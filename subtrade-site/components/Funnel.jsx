'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { BASE, INCLUDED_USERS, MIN_USERS, MAX_USERS, periodPrice, shownMonthly, fmt } from '../lib/pricing';

/**
 * The Facebook-ads funnel on /start/:
 *   1. promise + what SubTrade is (the page itself)
 *   2. register (name, email, phone, company)
 *   3. five qualifying questions, one tap each
 *   4. the result: the video, then book a call (a fit) or start the trial (too small for a call yet)
 *
 * Every answer value matches a GoHighLevel picklist option exactly, because
 * /api/lead writes them straight into the existing custom fields.
 */

const SIGNUP = 'https://portal.subtradesoftware.com/signup';
const BOOKING_ID = '6mmJoUPX6PFLhrOHGt92';

const QUESTIONS = [
  {
    key: 'trade',
    q: 'What trade are you in?',
    options: ['Drywall / Framing', 'Electrical', 'Plumbing', 'HVAC / Mechanical', 'Concrete Forming', 'Painting', 'General Contractor', 'Other'],
  },
  {
    key: 'role',
    q: "What's your role?",
    options: ['Owner', 'Partner', 'Project manager', 'Foreman / Superintendent', 'Office / Admin'],
  },
  {
    key: 'employees',
    q: 'How many people work for you, office and field?',
    options: ['1-5', '6-10', '11-20', '21-50', '50+'],
  },
  {
    key: 'volume',
    q: 'Roughly how much work do you do a year?',
    options: ['$0 - 299K', '$300 - 599K', '$600 - 999K', '$1 - 2.99M', '$3 - 5.99M', '$6M +'],
  },
  {
    key: 'software',
    q: 'What do you use to run your jobs now?',
    hint: 'Pick all that apply.',
    multi: true,
    options: [
      'Procore', 'Buildertrend', 'Jobber', 'JobTread', 'Fieldwire', 'Monday',
      'Raken', 'SiteMax', 'Excel', 'QuickBooks', 'Pen & paper', 'Other',
    ],
  },
  {
    key: 'timeline',
    q: 'When do you want a better system in place?',
    options: [
      ['Immediately', 'Right away'],
      ['1-3 months', 'In the next 1 to 3 months'],
      ['6+ Months', 'Just looking for now'],
    ],
  },
  {
    key: 'price',
    q: 'SubTrade is $299/month for 5 users. Does that fit your budget?',
    options: ['Yes', 'I need to see it first', 'No'],
  },
];

// A 15-minute call is worth it for companies with a crew to run or real volume,
// as long as the price isn't already a no. Everyone else gets the trial, which
// is the full product anyway.
function isQualified(a) {
  const smallCrew = a.employees === '1-5';
  const smallVolume = a.volume === '$0 - 299K' || a.volume === '$300 - 599K';
  return !(smallCrew && smallVolume) && a.price !== 'No';
}

const track = (...args) => {
  try {
    window.fbq && window.fbq(...args);
  } catch {}
};

const save = (payload) =>
  fetch('/api/lead/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});

const STORE = 'subtrade-start-funnel';

// North American numbers only (Canada/US). Area codes never start with 1, so a
// leading 1 is always the country code, whether typed or from our own "+1 ".
const phoneDigits = (v) => v.replace(/\D/g, '').replace(/^1/, '').slice(0, 10);
function formatPhone(v) {
  const d = phoneDigits(v);
  if (!d) return '';
  if (d.length <= 3) return `+1 ${d}`;
  if (d.length <= 6) return `+1 ${d.slice(0, 3)}-${d.slice(3)}`;
  return `+1 ${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
}
// What GoHighLevel stores: +14038092908
const phoneE164 = (v) => `+1${phoneDigits(v)}`;

export default function Funnel() {
  const [stage, setStage] = useState('register'); // register | questions | result
  const [lead, setLead] = useState({ firstName: '', lastName: '', email: '', phone: '', company: '', website: '' });
  const [consent, setConsent] = useState({ terms: false, smsMarketing: false, smsService: false });
  const [answers, setAnswers] = useState({});
  const [qi, setQi] = useState(0);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const cardRef = useRef(null);

  // Pick up where they left off after a refresh.
  useEffect(() => {
    try {
      const s = JSON.parse(sessionStorage.getItem(STORE) || 'null');
      if (s?.stage) {
        setStage(s.stage);
        setLead((l) => ({ ...l, ...s.lead }));
        setAnswers(s.answers || {});
        setQi(s.qi || 0);
      }
    } catch {}
  }, []);
  useEffect(() => {
    try {
      sessionStorage.setItem(STORE, JSON.stringify({ stage, lead: { ...lead, website: '' }, answers, qi }));
    } catch {}
  }, [stage, lead, answers, qi]);

  // Each new question can be shorter than the last, so keep the card's top in view.
  useEffect(() => {
    if (stage !== 'questions') return;
    const top = cardRef.current?.getBoundingClientRect().top;
    if (top !== undefined && top < 80) cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [stage, qi]);

  useEffect(() => {
    if (stage === 'result') window.scrollTo(0, 0);
  }, [stage]);

  const toForm = () => cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  async function register(e) {
    e.preventDefault();
    setError('');
    if (!lead.firstName.trim()) return setError('Please add your first name.');
    if (!lead.lastName.trim()) return setError('Please add your last name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email.trim())) return setError('Please check your email address.');
    if (phoneDigits(lead.phone).length !== 10) return setError('Please enter a 10-digit phone number, like +1 403-555-0100.');
    if (!lead.company.trim()) return setError('Please add your company name.');
    if (!consent.terms) return setError('Please agree to the Terms & Conditions and Privacy Policy.');
    setBusy(true);
    await save({ ...lead, phone: phoneE164(lead.phone), consent: { ...consent, at: new Date().toISOString() }, stage: 'registered' });
    setBusy(false);
    track('track', 'Lead', { content_name: 'SubTrade /start register' });
    setStage('questions');
  }

  function toggle(key, value) {
    setAnswers((prev) => {
      const list = Array.isArray(prev[key]) ? prev[key] : [];
      return { ...prev, [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] };
    });
  }

  function answer(key, value) {
    const next = value === undefined ? answers : { ...answers, [key]: value };
    setAnswers(next);
    if (qi < QUESTIONS.length - 1) {
      setQi(qi + 1);
      return;
    }
    const qualified = isQualified(next);
    save({ ...lead, phone: phoneE164(lead.phone), consent, answers: next, stage: qualified ? 'qualified' : 'trial' });
    track('track', 'CompleteRegistration', { content_name: 'SubTrade /start questions', status: qualified ? 'qualified' : 'trial' });
    setStage('result');
  }

  if (stage === 'result') return <Result lead={lead} qualified={isQualified(answers)} />;

  return (
    <>
      {/* ---------- 1. the promise ---------- */}
      <section className="hero fx-hero">
        <div className="wrap fx-hero-grid">
          <div>
            <p className="eyebrow">Field management software for subcontractors</p>
            <h1 className="display">
              Every job. Every crew.
              <br />
              <em>One app.</em>
            </h1>
            <p className="lede">
              Time tracking, scheduling, change orders, daily logs, safety forms and progress billing, all in one
              place. Your crews use it on site, you see everything from the office, and nothing gets lost in a truck.
            </p>
            <ul className="fx-ticks">
              <li><b>Know who is working where</b>, live, with GPS clock-ins</li>
              <li><b>Get every extra signed</b> before the work starts</li>
              <li><b>Photos, logs and FLHAs</b> filed to the right job automatically</li>
              <li><b>Progress claims with holdback</b>, built from the field</li>
              <li><b>$299/month, 5 users,</b> every feature included</li>
            </ul>
            <p className="hero-note">Built by a Calgary drywall contractor, for trade contractors across Canada.</p>
            <button type="button" className="btn btn-primary btn-lg fx-jump" onClick={toForm}>
              See if it fits my company
            </button>
          </div>

          {/* ---------- 2 + 3. register, then qualify ---------- */}
          <div className="fx-card" ref={cardRef} id="get-started">
            {stage === 'register' ? (
              <form onSubmit={register} noValidate>
                <p className="fx-step mono">Step 1 of 2</p>
                <h2 className="display fx-card-title">See if SubTrade fits your company</h2>
                <p className="fx-card-sub">Two minutes. Then watch how it works and grab a time with us.</p>
                <div className="fx-row">
                  <Field label="First name" value={lead.firstName} name="given-name" onChange={(v) => setLead((l) => ({ ...l, firstName: v }))} autoComplete="given-name" />
                  <Field label="Last name" value={lead.lastName} name="family-name" onChange={(v) => setLead((l) => ({ ...l, lastName: v }))} autoComplete="family-name" />
                </div>
                <Field label="Work email" type="email" value={lead.email} name="email" onChange={(v) => setLead((l) => ({ ...l, email: v }))} autoComplete="email" />
                <Field label="Mobile phone" type="tel" value={lead.phone} name="tel" onChange={(v) => setLead((l) => ({ ...l, phone: formatPhone(v) }))} placeholder="+1 403-555-0100" inputMode="tel" autoComplete="tel" />
                <Field label="Company name" value={lead.company} name="organization" onChange={(v) => setLead((l) => ({ ...l, company: v }))} autoComplete="organization" />
                <input
                  className="fx-hp"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={lead.website}
                  onChange={(e) => { const v = e.target.value; setLead((l) => ({ ...l, website: v })); }}
                />
                <div className="fx-consent">
                  <Check id="c-terms" checked={consent.terms} onChange={(v) => setConsent((c) => ({ ...c, terms: v }))}>
                    I agree to the <a href="/terms-and-conditions/" target="_blank" rel="noopener">Terms &amp; Conditions</a> and{' '}
                    <a href="/privacy-policy/" target="_blank" rel="noopener">Privacy Policy</a> <span className="fx-req">*</span>
                  </Check>
                  <p className="fx-consent-label mono">SMS consent (optional)</p>
                  <Check id="c-sms-mkt" checked={consent.smsMarketing} onChange={(v) => setConsent((c) => ({ ...c, smsMarketing: v }))}>
                    I consent to receive marketing text messages from SubTrade Software Ltd at the phone number provided.
                    Frequency may vary. Message &amp; data rates may apply. Text HELP for assistance, reply STOP to opt out.
                  </Check>
                  <Check id="c-sms-svc" checked={consent.smsService} onChange={(v) => setConsent((c) => ({ ...c, smsService: v }))}>
                    I consent to receive non-marketing text messages from SubTrade Software Ltd about my demo call, onboarding,
                    service updates and account notifications. Message &amp; data rates may apply. Text HELP for assistance, reply
                    STOP to opt out.
                  </Check>
                </div>
                {error && <p className="fx-error" role="alert">{error}</p>}
                <button className="btn btn-primary btn-lg fx-submit" disabled={busy}>
                  {busy ? 'One second…' : 'Continue'}
                </button>
              </form>
            ) : (
              <div>
                <p className="fx-step mono">
                  Step 2 of 2 · Question {qi + 1} of {QUESTIONS.length}
                </p>
                <div className="fx-progress" aria-hidden="true">
                  <span style={{ width: `${((qi + 1) / QUESTIONS.length) * 100}%` }} />
                </div>
                <h2 className="display fx-card-title">{QUESTIONS[qi].q}</h2>
                {QUESTIONS[qi].hint && <p className="fx-card-sub" style={{ marginBottom: 0 }}>{QUESTIONS[qi].hint}</p>}
                <div className={`fx-options${QUESTIONS[qi].multi ? ' fx-options-grid' : ''}`}>
                  {QUESTIONS[qi].options.map((o) => {
                    const [value, label] = Array.isArray(o) ? o : [o, o];
                    const { key, multi } = QUESTIONS[qi];
                    const on = multi ? (answers[key] || []).includes(value) : answers[key] === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={on}
                        className={`fx-option${on ? ' is-on' : ''}`}
                        onClick={() => (multi ? toggle(key, value) : answer(key, value))}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                {QUESTIONS[qi].multi && (
                  <button
                    type="button"
                    className="btn btn-primary btn-lg fx-submit"
                    style={{ marginTop: 16 }}
                    disabled={!(answers[QUESTIONS[qi].key] || []).length}
                    onClick={() => answer(QUESTIONS[qi].key)}
                  >
                    Next
                  </button>
                )}
                {qi > 0 && (
                  <button type="button" className="fx-back" onClick={() => setQi(qi - 1)}>
                    ← Back
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="wrap"><div className="chalkline" /></div>

      {/* ---------- the problem ---------- */}
      <section className="section">
        <div className="wrap fx-split">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <p className="eyebrow">Sound familiar?</p>
            <h2 className="display">The money leaks out between the field and the office</h2>
            <p>
              Hours written on a scrap of paper. An extra the GC asked for on a Tuesday that nobody wrote up.
              A progress claim built from memory at 10 PM. Every one of those is money you earned and never billed.
            </p>
          </div>
          <img
            src="/unsigned-change-order-recovery-foreman-tablet.webp"
            alt="Foreman on a jobsite reviewing an unsigned change order on a tablet"
            className="fx-photo"
            loading="lazy"
          />
        </div>
      </section>

      {/* ---------- what SubTrade is ---------- */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">What you get</p>
            <h2 className="display">One app from the first clock-in to the final claim</h2>
            <p>Your foremen use it on their phones. You run the company from the office. No feature tiers, everything is included.</p>
          </div>
          <div className="fx-features">
            {[
              ['/subtrade-gps-time-tracking-clock-in.webp', 'GPS time tracking', 'Crews clock in on site from their phone. Time sheets and job costs fill themselves in.', 'Worker clocking in on a jobsite with GPS time tracking in the SubTrade app'],
              ['/subtrade-change-order-from-the-field.webp', 'Change orders', 'Write it up and get it signed on the spot, with photos, before the extra work starts.', 'Foreman creating a change order from the field in SubTrade'],
              ['/subcontractor-filling-out-aia-g702-g703-pay-application.webp', 'Progress billing', 'Schedule of values, holdback and approved change orders, rolled into the claim for you.', 'Subcontractor at his desk building a progress claim on a laptop, calculator and hard hat beside him'],
              ['/subtrade-crew-scheduling-jobsite.webp', 'Crew scheduling', 'See who is on which job this week and move people around in seconds.', 'Crew scheduling across jobsites in SubTrade'],
              ['/subtrade-daily-log-foreman-end-of-day.webp', 'Daily logs & photos', 'GPS-tagged photos and daily logs filed to the right job, ready when there is a dispute.', 'Foreman filing an end-of-day daily log in SubTrade'],
              ['/ppe-tracking-hardhats-vests-gang-box-jobsite.webp', 'Forms & safety', 'FLHAs, toolbox talks and inspections filled out and signed on the phone, filed to the job automatically.', 'Hard hats, safety vests, glasses and a harness on a jobsite gang box while a worker fills out a safety form on his phone'],
              ['/prompt-payment-foreman-highrise-goldenhour.webp', 'Field operations', 'One live view of every site: who is clocked in where, photos coming in, and what needs your OK today.', 'Foreman on a high-rise deck at sunrise checking every jobsite on a tablet'],
              ['/subcontractor-dashboard-software-foreman-tablet.webp', 'Dashboard & job costing', 'Budget against actual on every job while it is still running, not after it is over.', 'Site supervisor in the trailer comparing job costs on a tablet and laptop'],
              ['/foreman-marking-up-construction-drawings-tablet-jobsite.webp', 'Drawings & markups', 'The latest drawings on every phone and tablet. Mark them up on site so nobody builds off an old set.', 'Foreman marking up construction drawings on a tablet inside a framed building'],
              ['/sub-trade-foreman-reviewing-software-checklist-jobsite.webp', 'Tasks & punch lists', 'Assign the work, attach photos and close out deficiencies before the GC walks the floor.', 'Foreman checking off a punch list on his phone among steel studs and drywall'],
              ['/subcontractor-reviewing-lien-paperwork-site-office.webp', 'Submittals & RFIs', 'Send them, track them and keep every answer on the job, so nothing is stuck in someone’s inbox.', 'Subcontractor in a site office reviewing submittal paperwork next to a laptop'],
              ['/material-cost-increase-steel-copper-jobsite.webp', 'Purchase orders', 'Order material against the job, track what arrived, and see the cost land on the budget.', 'Supervisor checking a material delivery of steel studs and copper wire on a tablet'],
            ].map(([src, title, text, alt]) => (
              <article key={title} className="fx-feature">
                <img src={src} alt={alt} loading="lazy" />
                <h3 className="display">{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- who built it ---------- */}
      <section className="section">
        <div className="wrap fx-split">
          <img
            src="/fabian-vargas-garcia-subtrade-cofounder.webp"
            alt="Fabian Vargas Garcia, SubTrade co-founder and president of a Calgary commercial drywall company"
            className="fx-photo"
            loading="lazy"
          />
          <div className="section-head" style={{ marginBottom: 0 }}>
            <p className="eyebrow">Built on jobsites, not in boardrooms</p>
            <h2 className="display">Made by a sub, for subs</h2>
            <p>
              SubTrade was built by Fabian Vargas Garcia, who runs a commercial drywall company in Calgary, after
              years of using software made for general contractors. It is built around how a subcontractor actually
              gets paid: hours, extras, and progress claims with holdback.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- how it works ---------- */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">What happens next</p>
            <h2 className="display">Three steps, about 20 minutes of your time</h2>
          </div>
          <ol className="fx-steps">
            <li><b>Answer 7 quick questions</b><span>So we know your trade, crew size and what you use to run jobs today.</span></li>
            <li><b>Watch the short video</b><span>See SubTrade working on a real job before you talk to anyone.</span></li>
            <li><b>Book a 15-minute call</b><span>A screen share with someone who runs construction jobs, set up around your company.</span></li>
          </ol>
          <div style={{ marginTop: 40 }}>
            <button type="button" className="btn btn-primary btn-lg" onClick={toForm}>See if it fits my company</button>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="section">
        <div className="wrap" style={{ maxWidth: 820 }}>
          <div className="section-head">
            <p className="eyebrow">Questions</p>
            <h2 className="display">Straight answers</h2>
          </div>
          <div className="fx-faq">
            {[
              ['How much does it cost?', '$299/month CAD with 5 users included. Extra users are $4 to $15 each, and paying yearly saves 20%. The price is on our pricing page, no sales call needed to find it out.'],
              ['Which trades is it for?', 'Subcontractors running crews: drywall, framing, electrical, plumbing, HVAC, painting, concrete and more.'],
              ['Will my guys actually use it?', 'Clocking in, taking photos and filling a form are all one tap from the phone app (iPhone and Android).'],
              ['Can I try it first?', 'Yes. The free trial is the full platform, and you can cancel anytime during the trial and pay nothing.'],
            ].map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap">
          <h2 className="display">Every hour and every extra, billed</h2>
          <p>Two minutes to see if SubTrade fits your company.</p>
          <button type="button" className="btn btn-primary btn-lg" onClick={toForm}>Get started</button>
        </div>
      </section>
    </>
  );
}

function Check({ id, checked, onChange, children }) {
  return (
    <label className="fx-check" htmlFor={id}>
      <input type="checkbox" id={id} checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{children}</span>
    </label>
  );
}

function Field({ label, type = 'text', value, onChange, autoComplete, name, placeholder, inputMode }) {
  return (
    <label className="fx-field">
      <span>{label}</span>
      <input type={type} name={name} placeholder={placeholder} inputMode={inputMode} id={`f-${name}`} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} required aria-required="true" />
    </label>
  );
}

/* ---------- 4. the result: video, then book a call or start the trial ---------- */
function Result({ lead, qualified }) {
  const name = lead.firstName;
  // GoHighLevel's booking widget fills its own form from these.
  const prefill = new URLSearchParams({
    first_name: lead.firstName || '',
    last_name: lead.lastName || '',
    email: lead.email || '',
    phone: lead.phone ? phoneE164(lead.phone) : '',
    company_name: lead.company || '',
    organization: lead.company || '',
    companyName: lead.company || '',
  }).toString();
  return (
    <section className="section fx-result">
      <div className="wrap" style={{ maxWidth: 900 }}>
        <p className="eyebrow">{qualified ? 'You are a good fit' : 'You are all set'}</p>
        <h1 className="display fx-result-title">
          {name ? `Thanks, ${name}. ` : ''}Watch this first
        </h1>
        <p className="fx-result-sub">
          {qualified
            ? 'See how SubTrade runs a job from clock-in to progress claim, then pick a time below for a 15-minute call.'
            : 'See how SubTrade runs a job from clock-in to progress claim. Then start your free trial and load a real project.'}
        </p>

        <video
          className="fx-vsl"
          src="/vsl/subtrade-why.mp4"
          poster="/vsl/subtrade-why-poster.webp"
          controls
          playsInline
          preload="metadata"
        />

        {qualified ? (
          <>
            <h2 className="display fx-book-title">Book your 15-minute call</h2>
            <p className="fx-result-sub">Screen share, your questions, your trade. No pitch deck.</p>
            <div className="fx-booking">
              <iframe
                src={`https://api.leadconnectorhq.com/widget/booking/${BOOKING_ID}?${prefill}`}
                id={`${BOOKING_ID}_booking`}
                title="Book a SubTrade call"
                scrolling="no"
              />
            </div>
            <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="lazyOnload" />
            <h2 className="display fx-book-title">Or skip the call and start now</h2>
            <TrialBox lead={lead} />
          </>
        ) : (
          <div className="fx-trial">
            <h2 className="display fx-book-title">Start your 14-day free trial</h2>
            <TrialBox lead={lead} />
            <p className="fx-fine">
              Want to talk it through first? <a href="/construction-software-15min-demo/">Book a 15-minute call</a>.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- 14-day trial with a card on file (Stripe checkout) ---------- */
// Same look and numbers as the pricing page calculator (lib/pricing.js).
function TrialBox({ lead }) {
  const [annual, setAnnual] = useState(false);
  const [users, setUsers] = useState(INCLUDED_USERS);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const firstCharge = new Date(Date.now() + 14 * 864e5).toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' });
  const plan = annual ? 'yearly' : 'monthly';
  const shown = shownMonthly(users, annual);
  const charge = periodPrice(users, annual);
  const chargeText = `$${fmt(charge)}/${annual ? 'year' : 'month'}`;
  const extra = users - INCLUDED_USERS;

  async function start() {
    setBusy(true);
    setError('');
    track('track', 'InitiateCheckout', { value: charge, currency: 'CAD', num_items: users });
    try {
      const res = await fetch('/api/checkout/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          users,
          email: lead.email,
          firstName: lead.firstName,
          lastName: lead.lastName,
          company: lead.company,
          phone: lead.phone ? phoneE164(lead.phone) : '',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.url) return window.location.assign(data.url);
      if (data.configured === false) return window.location.assign(SIGNUP);
      setError('Checkout did not open. Please try again, or email support@subtradesoftware.com.');
    } catch {
      setError('Checkout did not open. Check your connection and try again.');
    }
    setBusy(false);
  }

  return (
    <div className="price-card fx-trialcard">
      <p className="eyebrow">SubTrade, complete</p>
      <div className="price-line">
        <span className="mono">${fmt(shown)}</span>
        <small>/month CAD</small>
      </div>
      <p className="price-sub">
        {annual ? `Billed annually at $${fmt(charge)}/yr (20% off)` : 'Billed monthly. Switch to annual and save 20%.'}
      </p>

      <div className="toggle" role="group" aria-label="Billing period">
        <button type="button" className={annual ? '' : 'on'} aria-pressed={!annual} onClick={() => setAnnual(false)}>Monthly</button>
        <button type="button" className={annual ? 'on' : ''} aria-pressed={annual} onClick={() => setAnnual(true)}>Annual −20%</button>
      </div>

      <div className="calc">
        <label htmlFor="fx-users">
          Team size: <b className="mono" style={{ color: 'var(--gypsum)' }}>{users} {users === 1 ? 'user' : 'users'}</b>
          {users <= INCLUDED_USERS && ' (included in base)'}
        </label>
        <input id="fx-users" type="range" min={MIN_USERS} max={MAX_USERS} value={users} onChange={(e) => setUsers(Number(e.target.value))} />
        <div className="calc-readout">
          <span className="mono">${fmt(shown)}/mo</span>
          <small>
            {extra > 0
              ? `base $${annual ? fmt(Math.round(BASE * 0.8)) : BASE} + ${extra} extra ${extra === 1 ? 'user' : 'users'}`
              : `${INCLUDED_USERS} users included`}
          </small>
        </div>

        <ul className="fx-ticks fx-trial-terms">
          <li><b>$0 today.</b> The full platform for 14 days.</li>
          <li>Your card is charged <b>{chargeText} CAD</b> on <b>{firstCharge}</b>.</li>
          <li>Cancel anytime before then and you pay nothing.</li>
        </ul>
        {error && <p className="fx-error" role="alert">{error}</p>}
        <button type="button" className="btn btn-primary btn-lg fx-submit" onClick={start} disabled={busy}>
          {busy ? 'Opening secure checkout…' : 'Start free trial'}
        </button>
        <div className="tiers">
          Base plan <span className="mono">${BASE}</span> includes {INCLUDED_USERS} users, then per user:
          <br />
          users 6–15 <span className="mono">$15</span> · 16–25 <span className="mono">$10</span> · 26–29 <span className="mono">$7</span> · 30+ <span className="mono">$4</span>
        </div>
      </div>
      <p className="fx-fine">Secure checkout by Stripe. Your card details never touch our site. See our <a href="/fair-billing-policy/">Fair Billing Policy</a>.</p>
    </div>
  );
}
