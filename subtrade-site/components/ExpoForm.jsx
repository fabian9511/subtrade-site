'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Builder Expo booth form (/expo/).
 *
 * Fabian and Steban fill it in on the iPad while they talk to each visitor
 * (no QR code at the booth). Staff mode is therefore on by default: the booth
 * fields (hot/warm/cold, notes, who met them), a list of everyone captured on
 * this device, a CSV download, and a conversation guide under every question
 * (what to ask, and what to say back once an answer is picked).
 * /expo/?staff=0 switches a device to the plain visitor form.
 *
 * Every lead is saved on the device first and then sent to /api/expo-lead.
 * If the expo Wi-Fi drops, leads wait on the device and go out by themselves
 * once it is back (every 20 seconds, and as soon as the device is online).
 */

const STORE = 'subtrade-expo-leads-v1';
const STAFF = 'subtrade-expo-staff';
const STAFF_BY = 'subtrade-expo-staff-by';
const BOOKING = 'https://subtradesoftware.com/construction-software-15min-demo/';
const SIGNUP = 'https://portal.subtradesoftware.com/signup';

// Values match GoHighLevel's pick-lists exactly (see app/api/expo-lead/route.js).
const TRADES = ['Drywall / Framing', 'Electrical', 'Plumbing', 'HVAC / Mechanical', 'Concrete Forming', 'Painting', 'General Contractor', 'Other'];
const ROLES = ['Owner', 'Partner', 'Project manager', 'Foreman / Superintendent', 'Office / Admin'];
const PEOPLE = ['1-5', '6-10', '11-20', '21-50', '50+'];
const SOFTWARE = ['Pen & paper', 'Excel', 'QuickBooks', 'Procore', 'Buildertrend', 'Jobber', 'Other'];
const NEEDS = ['Time tracking', 'Change orders', 'Scheduling', 'Progress billing', 'Daily logs & safety', 'Job costing', 'Estimating & takeoff'];
const TIMELINE = [
  ['Immediately', 'Right away'],
  ['1-3 months', 'In 1 to 3 months'],
  ['6+ Months', 'Just looking'],
];
const NEXT = ['Book a demo', 'Start a free trial', 'Send me info', 'Just looking'];
const TEMPS = ['Hot', 'Warm', 'Cold'];
const GUIDE_OFF = 'subtrade-expo-guide-off';

// Booth conversation guide, staff only. `ask` is what to say to open the
// question; `say` is the talking point once an answer is tapped. Only promise
// what SubTrade does today (lib/tools.js); takeoff, QuickBooks job costing and
// invoicing are "coming soon" there, so they are "coming soon" here too.
const GUIDE = {
  trade: {
    ask: '“What trade are you in?”',
    say: {
      'Drywall / Framing': 'That’s us. We built SubTrade inside our own drywall company here in Calgary. Show Bid Manager and change orders. Takeoff & estimating is coming soon — put them on the list.',
      Electrical: 'Crews spread over many sites: show crew scheduling (drag crews between jobs, they get notified) and GPS clock-in.',
      Plumbing: 'Crews spread over many sites: show crew scheduling and GPS clock-in, then change orders for the extras.',
      'HVAC / Mechanical': 'Show crew scheduling and GPS clock-in, then submittals & RFIs — what’s out, what’s late, who’s holding it.',
      'Concrete Forming': 'Show the 2-minute daily log (weather + manpower), GPS photos and FLHAs signed on the phone.',
      Painting: 'Show change orders (price and get the extra signed before the work) and progress billing with holdback.',
      'General Contractor': 'SubTrade is built for subcontractors. Still take their details and ask which subs they work with — easy referral.',
      Other: 'Ask: “What slows your jobs down the most?” and steer to that tool.',
    },
  },
  role: {
    ask: '“What’s your role in the company?”',
    say: {
      Owner: 'Decision maker. Talk money: $299/month CAD with 5 users included, 14-day free trial. Go for the demo.',
      Partner: 'Decision maker. Talk money: $299/month CAD with 5 users included, 14-day free trial. Go for the demo.',
      'Project manager': 'Talk schedules, change orders, submittals & RFIs. Ask: “Who signs off on new software?” — get the owner’s name in the notes.',
      'Foreman / Superintendent': 'Show the phone side: clock-in, 2-minute daily log, drawings on the phone. Ask for the owner’s name and number for the notes.',
      'Office / Admin': 'Talk timesheets that come in on their own, progress billing, no more chasing hours. Ask who decides on software.',
    },
  },
  employees: {
    ask: '“How many people work for you, office and field?”',
    say: {
      '1-5': 'Fits the base plan: $299/month CAD, 5 users included.',
      '6-10': 'Sweet spot — hours and extras leak most at this size. 10 users ≈ $374/month (extra users $15 each). Push for a demo.',
      '11-20': 'Sweet spot. 20 users ≈ $499/month (users 6–15 $15, 16–25 $10). Push for a demo.',
      '21-50': 'Bigger crew: extra users get cheaper the more they add. Book a proper demo with Fabian. Annual billing saves 20%.',
      '50+': 'Big crew: extra users drop to $4 each past 30. Book a proper demo with Fabian. Annual billing saves 20%.',
    },
  },
  software: {
    ask: '“What do you run your jobs with now?”',
    say: {
      'Pen & paper': 'Ask: “How long does payroll take you each week?” SubTrade replaces the paper timesheets — hours land on the job from the phone.',
      Excel: 'Ask: “Who updates the spreadsheet, and when?” In SubTrade the field fills it in as they work.',
      QuickBooks: 'Keep QuickBooks for the books — SubTrade runs the field. Job costing synced to QuickBooks is coming soon.',
      Procore: 'Procore is mostly built for general contractors. SubTrade is built and priced for subcontractors.',
      Buildertrend: 'Buildertrend is mostly built for home builders. SubTrade is built for the trades doing the work.',
      Jobber: 'Jobber suits service calls. SubTrade handles project work: change orders, progress billing, holdback.',
      Other: 'Ask what they like and what drives them nuts about it — write it in the notes.',
    },
  },
  needs: {
    ask: '“What’s the biggest headache right now?”',
    say: {
      'Time tracking': 'GPS clock-in on the phone; hours land on the right job with live labour cost.',
      'Change orders': 'Price the extra on the phone, send it, get it signed before the work is done.',
      Scheduling: 'Drag crews between jobs; the crew gets notified automatically. Gantt per job too.',
      'Progress billing': 'Draws built from real field data, with holdback handled.',
      'Daily logs & safety': 'Two-minute daily log with weather and manpower; FLHAs and toolbox talks signed on the phone.',
      'Job costing': 'Live labour cost per job today from clock-ins. Full budget vs actual with QuickBooks sync is coming soon.',
      'Estimating & takeoff': 'Bid Manager today (every tender on one board, proposals with e-signature). Takeoff & estimating coming soon.',
    },
  },
  timeline: {
    ask: '“When would you want something better in place?”',
    say: {
      Immediately: 'Hot. Book the demo now, or start the free trial with them on the spot. Mark them Hot below.',
      '1-3 months': 'Book a demo for after the show. Mark Warm.',
      '6+ Months': 'No pressure. Offer the free trial and say we’ll check in after the show. Mark Cold.',
    },
  },
  next: {
    ask: '“What’s the best next step for you?”',
    say: {
      'Book a demo': 'Goes straight to “Hot – call this week”. If you can, agree a day and time now and write it in the notes.',
      'Start a free trial': '14-day free trial at subtradesoftware.com/free-trial. Offer to set it up with them.',
      'Send me info': 'We follow up after the show. Ask the email question below so we’re allowed to.',
      'Just looking': 'All good. Ask the email question below so we can keep in touch.',
    },
  },
};

const EMPTY = {
  firstName: '', lastName: '', company: '', phone: '', email: '', website: '',
  trade: '', role: '', employees: '', software: [], needs: [], timeline: '', next: '',
  consent: false, temp: '', notes: '',
};

const read = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v == null ? fallback : JSON.parse(v);
  } catch {
    return fallback;
  }
};
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

function Chips({ label, hint, options, value, onChange, multi, guide }) {
  const picked = multi ? value : value ? [value] : [];
  const tips = guide ? picked.map((v) => [v, guide.say[v]]).filter(([, t]) => t) : [];
  return (
    <fieldset className="expo-field">
      <legend>
        {label}
        {hint && <span className="expo-hint"> {hint}</span>}
      </legend>
      {guide && <p className="expo-ask"><b>Ask</b> {guide.ask}</p>}
      <div className="expo-chips">
        {options.map((o) => {
          const [val, text] = Array.isArray(o) ? o : [o, o];
          const on = multi ? value.includes(val) : value === val;
          return (
            <button
              key={val}
              type="button"
              className={`expo-chip${on ? ' on' : ''}`}
              aria-pressed={on}
              onClick={() => onChange(multi ? (on ? value.filter((v) => v !== val) : [...value, val]) : on ? '' : val)}
            >
              {text}
            </button>
          );
        })}
      </div>
      {tips.map(([v, t]) => (
        <p key={v} className="expo-say">
          <b>Say{multi ? ` · ${v}` : ''}</b> {t}
        </p>
      ))}
    </fieldset>
  );
}

function toCsv(leads) {
  const cols = [
    ['Saved', (l) => new Date(l.createdAt).toLocaleString('en-CA')],
    ['Sent to GHL', (l) => (l.status === 'sent' ? 'yes' : l.status === 'failed' ? `no — ${l.error || 'refused'}` : 'waiting')],
    ['First name', (l) => l.payload.firstName],
    ['Last name', (l) => l.payload.lastName],
    ['Company', (l) => l.payload.company],
    ['Phone', (l) => l.payload.phone],
    ['Email', (l) => l.payload.email],
    ['Trade', (l) => l.payload.answers.trade],
    ['Role', (l) => l.payload.answers.role],
    ['People', (l) => l.payload.answers.employees],
    ['Uses now', (l) => l.payload.answers.software.join('; ')],
    ['Wants help with', (l) => l.payload.answers.needs.join('; ')],
    ['When', (l) => l.payload.answers.timelineLabel],
    ['Next step', (l) => l.payload.answers.next],
    ['Consent', (l) => (l.payload.consent ? 'yes' : 'no')],
    ['Lead', (l) => l.payload.staff?.temp || ''],
    ['Met by', (l) => l.payload.staff?.by || ''],
    ['Notes', (l) => l.payload.staff?.notes || ''],
  ];
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return [cols.map(([h]) => esc(h)).join(','), ...leads.map((l) => cols.map(([, f]) => esc(f(l))).join(','))].join('\r\n');
}

export default function ExpoForm() {
  const [form, setForm] = useState(EMPTY);
  const [staff, setStaff] = useState(false);
  const [by, setBy] = useState('');
  const [leads, setLeads] = useState([]);
  const [done, setDone] = useState(null); // the lead just saved → thank-you screen
  const [error, setError] = useState('');
  const [showList, setShowList] = useState(false);
  const [guideOn, setGuideOn] = useState(true);
  const sending = useRef(false);
  const top = useRef(null);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v && v.target ? v.target.value : v }));

  // Staff mode is the default (staff fill the form in at the booth);
  // ?staff=0 turns it off for this device, ?staff=1 turns it back on.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('staff');
    if (q === '1') write(STAFF, true);
    if (q === '0') write(STAFF, false);
    setStaff(Boolean(read(STAFF, true)));
    setGuideOn(!read(GUIDE_OFF, false));
    setBy(read(STAFF_BY, ''));
    setLeads(read(STORE, []));
  }, []);

  const flush = useCallback(async () => {
    if (sending.current) return;
    sending.current = true;
    try {
      for (const lead of read(STORE, []).filter((l) => l.status === 'pending')) {
        let status = 'pending';
        let err = '';
        try {
          const res = await fetch('/api/expo-lead/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lead.payload),
          });
          const data = await res.json().catch(() => ({}));
          if (res.ok && data.stored) status = 'sent';
          else if (res.status === 400) [status, err] = ['failed', data.error || 'refused'];
        } catch {
          break; // offline: stop and try the rest later
        }
        // Re-read so a lead added while this one was sending is not lost.
        const all = read(STORE, []).map((l) => (l.id === lead.id ? { ...l, status, error: err } : l));
        write(STORE, all);
        setLeads(all);
      }
    } finally {
      sending.current = false;
    }
  }, []);

  useEffect(() => {
    flush();
    const t = setInterval(flush, 20000);
    window.addEventListener('online', flush);
    return () => {
      clearInterval(t);
      window.removeEventListener('online', flush);
    };
  }, [flush]);

  // Staff: the thank-you screen clears itself for the next person.
  useEffect(() => {
    if (!done || !staff) return;
    const t = setTimeout(() => nextPerson(), 8000);
    return () => clearTimeout(t);
  }, [done, staff]); // eslint-disable-line react-hooks/exhaustive-deps

  function nextPerson() {
    setDone(null);
    setForm(EMPTY);
    setError('');
    top.current?.scrollIntoView({ block: 'start' });
  }

  function submit(e) {
    e.preventDefault();
    const digits = form.phone.replace(/\D/g, '');
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    if (!form.firstName.trim()) return setError('Please add a first name.');
    if (!emailOk && digits.length < 10) return setError('Please add a phone number or an email so we can reach you.');
    if (form.email.trim() && !emailOk) return setError('That email does not look right.');
    if (form.phone.trim() && digits.length < 10) return setError('That phone number looks short.');
    setError('');

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      company: form.company.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      website: form.website,
      consent: form.consent,
      answers: {
        trade: form.trade,
        role: form.role,
        employees: form.employees,
        software: form.software,
        needs: form.needs,
        timeline: form.timeline,
        timelineLabel: (TIMELINE.find(([v]) => v === form.timeline) || [])[1] || '',
        next: form.next,
      },
      staff: staff ? { temp: form.temp, notes: form.notes.trim(), by: by.trim() } : undefined,
    };
    const lead = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, createdAt: new Date().toISOString(), status: 'pending', payload };
    const all = [...read(STORE, []), lead];
    write(STORE, all);
    setLeads(all);
    if (staff) write(STAFF_BY, by.trim());
    setDone(lead);
    top.current?.scrollIntoView({ block: 'start' });
    flush();
  }

  function downloadCsv() {
    const blob = new Blob([`﻿${toCsv(leads)}`], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `builder-expo-2026-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  const waiting = leads.filter((l) => l.status === 'pending').length;
  const failed = leads.filter((l) => l.status === 'failed').length;
  const g = (key) => (staff && guideOn ? GUIDE[key] : undefined);
  const toggleGuide = () => {
    write(GUIDE_OFF, guideOn);
    setGuideOn(!guideOn);
  };

  return (
    <div className="expo" ref={top}>
      <header className="expo-top">
        <img src="/logo-horizontal.png" alt="SubTrade Software" className="expo-logo" />
        <span className="expo-badge">Builder Expo 2026</span>
      </header>

      {staff && (
        <div className="expo-staffbar">
          <b>Staff mode</b>
          <span>{leads.length} saved on this device</span>
          {waiting > 0 && <span className="expo-wait">{waiting} waiting for Wi-Fi</span>}
          {failed > 0 && <span className="expo-bad">{failed} need a look</span>}
          <span className="expo-staffbar-btns">
            <button type="button" onClick={toggleGuide}>{guideOn ? 'Hide guide' : 'Show guide'}</button>
            <button type="button" onClick={() => setShowList((s) => !s)}>{showList ? 'Hide list' : 'Show list'}</button>
            <button type="button" onClick={downloadCsv} disabled={!leads.length}>Download CSV</button>
          </span>
        </div>
      )}

      {staff && showList && (
        <ul className="expo-list">
          {[...leads].reverse().map((l) => (
            <li key={l.id}>
              <span className="expo-list-name">
                {l.payload.firstName} {l.payload.lastName}
                {l.payload.company && <em> · {l.payload.company}</em>}
              </span>
              <span className={`expo-status ${l.status}`}>
                {l.status === 'sent' ? 'In GHL' : l.status === 'failed' ? l.error || 'Refused' : 'Waiting'}
              </span>
            </li>
          ))}
          {!leads.length && <li>Nobody yet.</li>}
        </ul>
      )}

      {done ? (
        <section className="expo-card expo-thanks" aria-live="polite">
          <div className="expo-tick" aria-hidden="true">✓</div>
          <h1>Thanks, {done.payload.firstName}!</h1>
          {staff ? (
            <>
              <p>Saved. {waiting > 0 ? 'It goes to GoHighLevel as soon as the Wi-Fi lets it.' : ''}</p>
              <button type="button" className="expo-submit" onClick={nextPerson}>Next person</button>
              <p className="expo-small">Clears by itself in a few seconds.</p>
            </>
          ) : (
            <>
              <p>We&rsquo;ll be in touch after the show. Want a head start?</p>
              <div className="expo-actions">
                <a className="expo-submit" href={BOOKING}>Book a 15-min walkthrough</a>
                <a className="expo-ghost" href={SIGNUP}>Start the 14-day free trial</a>
              </div>
              <p className="expo-small">Come say hi at the SubTrade booth any time.</p>
            </>
          )}
        </section>
      ) : (
        <form className="expo-card" onSubmit={submit} noValidate>
          {staff ? (
            <>
              <h1>New contact</h1>
              {guideOn && (
                <div className="expo-guide">
                  <p className="expo-guide-title">How to open</p>
                  <p>
                    &ldquo;Hey, are you a contractor? We build SubTrade — the app we made to run our own drywall
                    company here in Calgary: time tracking, change orders, scheduling and progress billing, all from
                    the phone. Can I grab your details and show you two minutes of it?&rdquo;
                  </p>
                  <p className="expo-guide-small">
                    Fill it in as you talk. Each question shows what to ask, and once you tap their answer, what to say
                    back. Name plus a phone or email is all that&rsquo;s required.
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <h1>Run your crew from your phone.</h1>
              <p className="expo-lead">
                Leave your details and we&rsquo;ll send you a free 15-minute walkthrough of SubTrade, built by a
                Calgary drywall contractor for trade contractors. Takes 30 seconds.
              </p>
            </>
          )}

          <div className="expo-grid">
            <label className="expo-input">
              <span>First name *</span>
              <input value={form.firstName} onChange={set('firstName')} autoComplete="given-name" required />
            </label>
            <label className="expo-input">
              <span>Last name</span>
              <input value={form.lastName} onChange={set('lastName')} autoComplete="family-name" />
            </label>
            <label className="expo-input expo-wide">
              <span>Company</span>
              <input value={form.company} onChange={set('company')} autoComplete="organization" />
            </label>
            <label className="expo-input">
              <span>Phone</span>
              <input type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" inputMode="tel" />
            </label>
            <label className="expo-input">
              <span>Email</span>
              <input type="email" value={form.email} onChange={set('email')} autoComplete="email" inputMode="email" autoCapitalize="none" />
            </label>
          </div>
          {/* Honeypot for bots; hidden from people and screen readers. */}
          <input className="expo-hp" tabIndex={-1} aria-hidden="true" autoComplete="off" value={form.website} onChange={set('website')} name="website" />

          <Chips label={staff ? 'Trade' : 'Your trade'} options={TRADES} value={form.trade} onChange={set('trade')} guide={g('trade')} />
          <Chips label={staff ? 'Role' : 'Your role'} options={ROLES} value={form.role} onChange={set('role')} guide={g('role')} />
          <Chips label="People in the company" hint="office + field" options={PEOPLE} value={form.employees} onChange={set('employees')} guide={g('employees')} />
          <Chips label={staff ? 'What they run jobs with now' : 'What do you run your jobs with now?'} hint="pick any" options={SOFTWARE} value={form.software} onChange={set('software')} multi guide={g('software')} />
          <Chips label={staff ? 'What they want help with' : 'What would you like help with?'} hint="pick any" options={NEEDS} value={form.needs} onChange={set('needs')} multi guide={g('needs')} />
          <Chips label={staff ? 'When they want a better system' : 'When do you want a better system?'} options={TIMELINE} value={form.timeline} onChange={set('timeline')} guide={g('timeline')} />
          <Chips label={staff ? 'Next step' : 'What would you like next?'} options={NEXT} value={form.next} onChange={set('next')} guide={g('next')} />

          {staff && (
            <div className="expo-staff">
              <p className="expo-staff-title">Booth notes · for us, not read out</p>
              <Chips
                label="Lead"
                options={TEMPS}
                value={form.temp}
                onChange={set('temp')}
                guide={guideOn ? {
                  ask: 'Your gut call after the chat.',
                  say: {
                    Hot: 'Owner or decision maker who wants it soon. Lands in “Hot – call this week”.',
                    Warm: 'Interested, but not now or not the one who decides. Follow up after the show.',
                    Cold: 'Just browsing. Keep in touch, no hard follow-up.',
                  },
                } : undefined}
              />
              <label className="expo-input">
                <span>Notes</span>
                <textarea rows={3} value={form.notes} onChange={set('notes')} placeholder="What they said, who to call, anything to remember" />
              </label>
              <label className="expo-input">
                <span>Met by</span>
                <input value={by} onChange={(e) => setBy(e.target.value)} autoComplete="off" placeholder="Your name" />
              </label>
            </div>
          )}

          {staff && guideOn && (
            <p className="expo-ask expo-ask-consent">
              <b>Ask</b> &ldquo;Is it OK if we email and text you about SubTrade?&rdquo; Only tick the box if they say yes.
            </p>
          )}
          <label className="expo-consent">
            <input type="checkbox" checked={form.consent} onChange={(e) => set('consent')(e.target.checked)} />
            <span>
              Yes, SubTrade Software Ltd can email and text me about SubTrade. Message &amp; data rates may apply.
              Reply STOP to opt out of texts, unsubscribe any time.
            </span>
          </label>

          {staff && guideOn && (
            <div className="expo-guide expo-guide-close">
              <p className="expo-guide-title">How to close</p>
              <p>
                &ldquo;Thanks, [name]. We&rsquo;ll reach out after the show
                {form.next === 'Book a demo' ? ' to lock in your demo' : ''}.&rdquo; Hand them a card, pick Hot / Warm /
                Cold, add a line in the notes, then save.
              </p>
            </div>
          )}
          {error && <p className="expo-error" role="alert">{error}</p>}
          <button type="submit" className="expo-submit">{staff ? 'Save contact' : 'Send'}</button>
          <p className="expo-small">
            We only use this to follow up about SubTrade. <a href="/privacy-policy/">Privacy policy</a>
          </p>
        </form>
      )}
    </div>
  );
}
