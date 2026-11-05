'use client';

import { useEffect, useState } from 'react';
import { EVENT, TRADES, WCB, INSURANCE, CREW, SAFETY, GC_WORK, YEARS } from '../lib/buildersNight';

/**
 * Builders Night registration (/builders-night/#register).
 *
 * One form, four kinds of sign-up: a subcontractor applying for a ticket,
 * a builder asking for a table, a builder coming as a guest, or a supplier
 * asking for one of the paid supplier tables. Subs answer
 * the pre-qualification questions and find out straight away whether they
 * qualify (the rules are qualify() in lib/buildersNight.js; the server
 * decides). Posts to /api/builders-night/, which writes the contact, tags and
 * a note to GoHighLevel. ?role=builder opens it on the builder table option,
 * ?role=supplier on the supplier table.
 *
 * Reminders go by email, so everyone coming needs a full name and an email:
 * last name is required, and builders and suppliers add the name and email of every other
 * person on their team (each one becomes their own GoHighLevel contact).
 * Reuses the expo-* form styles from globals.css.
 */

const ROLE_OPTIONS = [
  ['sub', "I'm a subcontractor"],
  ['table', "I'm a builder: I want a table"],
  ['guest', "I'm a builder: coming as a guest"],
  ['supplier', "I'm a supplier: I want a table"],
];

// Wording must match CONSENT_TEXT / SHARE_TEXT in app/api/builders-night/route.js.
const CONSENT =
  'Yes, SubTrade Software Ltd can email and text me about Builders Night and SubTrade. Message & data rates may apply. Reply STOP to opt out of texts, unsubscribe any time.';
const SHARE = 'Share my name, company, trade, contact details and these answers with the builders at Builders Night.';

const PERSON = { firstName: '', lastName: '', email: '' };
const EMPTY = {
  firstName: '', lastName: '', company: '', email: '', phone: '', website: '',
  trade: '', tradeOther: '', wcb: '', insurance: '', crew: '', safety: '', gcWork: '', gcNames: '', years: '',
  attending: '1', message: '',
  team: [PERSON, PERSON, PERSON], // people 2 to 4 on a builder's team
};
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Chips({ legend, hint, options, value, onPick }) {
  return (
    <fieldset className="expo-field">
      <legend>
        {legend} {hint ? <span className="expo-hint">{hint}</span> : null}
      </legend>
      <div className="expo-chips">
        {options.map((o) => (
          <button type="button" key={o} className={`expo-chip${value === o ? ' on' : ''}`} aria-pressed={value === o} onClick={() => onPick(value === o ? '' : o)}>
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default function BuildersNightForm() {
  const [role, setRole] = useState('sub');
  const [f, setF] = useState(EMPTY);
  const [consent, setConsent] = useState(false);
  const [share, setShare] = useState(false);
  const [state, setState] = useState('idle'); // idle | sending | done | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const r = new URLSearchParams(window.location.search).get('role');
      if (r === 'builder' || r === 'table') setRole('table');
      if (r === 'guest') setRole('guest');
      if (r === 'supplier') setRole('supplier');
    } catch {}
  }, []);

  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const pick = (k) => (v) => setF((p) => ({ ...p, [k]: v }));
  const setMate = (i, k) => (e) =>
    setF((p) => ({ ...p, team: p.team.map((m, j) => (j === i ? { ...m, [k]: e.target.value } : m)) }));
  const isSub = role === 'sub';
  const maxPeople = role === 'guest' ? 4 : 2;
  const extra = isSub ? 0 : Math.max(0, Math.min(parseInt(f.attending, 10) || 1, maxPeople) - 1);
  const mates = f.team.slice(0, extra);

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!f.firstName.trim() || !f.lastName.trim() || !f.company.trim() || !EMAIL.test(f.email.trim())) {
      setError('Please add your first and last name, company and a valid email.');
      return;
    }
    const missing = mates.findIndex((m) => !m.firstName.trim() || !m.lastName.trim() || !EMAIL.test(m.email.trim()));
    if (missing >= 0) {
      setError(`Please add the first and last name and email for person ${missing + 2}.`);
      return;
    }
    const emails = [f.email, ...mates.map((m) => m.email)].map((x) => x.trim().toLowerCase());
    if (new Set(emails).size !== emails.length) {
      setError('Each person needs their own email so everyone gets the reminders.');
      return;
    }
    if (isSub && (!f.trade || !f.wcb || !f.insurance || !f.crew)) {
      setError('Please answer your trade, WCB, liability insurance and crew size.');
      return;
    }
    setState('sending');
    try {
      const res = await fetch('/api/builders-night/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          firstName: f.firstName,
          lastName: f.lastName,
          company: f.company,
          email: f.email,
          phone: f.phone,
          website: f.website,
          consent,
          share: isSub ? share : false,
          team: mates,
          answers: {
            trade: f.trade, tradeOther: f.tradeOther, wcb: f.wcb, insurance: f.insurance, crew: f.crew,
            safety: f.safety, gcWork: f.gcWork, gcNames: f.gcWork === 'Yes' ? f.gcNames : '', years: f.years,
            attending: String(extra + 1), message: f.message,
          },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || 'Something went wrong');
      setResult(data);
      setState('done');
    } catch (err) {
      setState('error');
      setError(`${err.message}. Please try again, or email support@subtradesoftware.com and we'll register you by hand.`);
    }
  }

  if (state === 'done') {
    const notQualified = isSub && result && result.qualified === false;
    return (
      <div className="expo-card expo-thanks" role="status">
        <div className={`expo-tick${notQualified ? ' bn-tick-no' : ''}`} aria-hidden="true">{notQualified ? '!' : '✓'}</div>
        {isSub && !notQualified ? (
          <>
            <h3 className="display bn-thanks-h">You qualify</h3>
            <p>
              Check your email. We'll send the ${EVENT.entryFee} payment link, and your QR ticket as soon as it's paid.
              See you on {EVENT.shortDate}.
            </p>
          </>
        ) : notQualified ? (
          <>
            <h3 className="display bn-thanks-h">Not this time</h3>
            <p>
              Thanks for applying. This event is for subs with WCB coverage, at least $3M in liability insurance and a
              crew of three or more. We've kept your details and will let you know about future events.
            </p>
          </>
        ) : role === 'supplier' ? (
          <>
            <h3 className="display bn-thanks-h">You're on the list</h3>
            <p>
              Supplier tables are ${EVENT.supplierPrice} + GST and there are only {EVENT.supplierTables}, first come,
              first served. Fabian will confirm yours by email with the invoice. Everyone you added gets the event
              details and reminders.
            </p>
          </>
        ) : role === 'table' ? (
          <>
            <h3 className="display bn-thanks-h">You're on the list</h3>
            <p>
              Tables go first come, first served. Fabian will confirm yours by email. If they're gone, your team is
              still welcome as guests at ${EVENT.entryFee} a person. Everyone you added gets the event details and
              reminders.
            </p>
          </>
        ) : (
          <>
            <h3 className="display bn-thanks-h">You're on the list</h3>
            <p>
              We'll email you a payment link for your guest passes at ${EVENT.entryFee} a person. Everyone you added
              gets the event details and reminders.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <form className="expo-card" onSubmit={submit} noValidate>
      <fieldset className="expo-field" style={{ marginTop: 0 }}>
        <legend>Who's registering?</legend>
        <div className="expo-chips">
          {ROLE_OPTIONS.map(([v, label]) => (
            <button type="button" key={v} className={`expo-chip${role === v ? ' on' : ''}`} aria-pressed={role === v} onClick={() => {
                setRole(v);
                if (v !== 'guest') setF((p) => ({ ...p, attending: String(Math.min(parseInt(p.attending, 10) || 1, 2)) }));
              }}>
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="expo-grid" style={{ marginTop: 22 }}>
        <label className="expo-input">
          <span>First name</span>
          <input value={f.firstName} onChange={set('firstName')} autoComplete="given-name" required />
        </label>
        <label className="expo-input">
          <span>Last name</span>
          <input value={f.lastName} onChange={set('lastName')} autoComplete="family-name" required />
        </label>
        <label className="expo-input expo-wide">
          <span>Company</span>
          <input value={f.company} onChange={set('company')} autoComplete="organization" required />
        </label>
        <label className="expo-input">
          <span>Email</span>
          <input type="email" value={f.email} onChange={set('email')} autoComplete="email" inputMode="email" required />
        </label>
        <label className="expo-input">
          <span>Mobile</span>
          <input type="tel" value={f.phone} onChange={set('phone')} autoComplete="tel" inputMode="tel" />
        </label>
        <label className="expo-hp" aria-hidden="true">
          Website <input tabIndex={-1} autoComplete="off" value={f.website} onChange={set('website')} />
        </label>
      </div>

      {isSub ? (
        <>
          <Chips legend="Your trade" options={TRADES} value={f.trade} onPick={pick('trade')} />
          {f.trade === 'Other' ? (
            <label className="expo-input expo-other">
              <span>Which trade?</span>
              <input value={f.tradeOther} onChange={set('tradeOther')} placeholder="Roofing, glazing, flooring..." />
            </label>
          ) : null}
          <Chips legend="Are you covered by WCB Alberta?" options={WCB} value={f.wcb} onPick={pick('wcb')} />
          <Chips legend="Commercial general liability insurance" options={INSURANCE} value={f.insurance} onPick={pick('insurance')} />
          <Chips legend="How many people work for you?" hint="(counting your own subs)" options={CREW} value={f.crew} onPick={pick('crew')} />
          <Chips legend="Are you COR or SECOR certified?" options={SAFETY} value={f.safety} onPick={pick('safety')} />
          <Chips legend="Have you worked for general contractors before?" options={GC_WORK} value={f.gcWork} onPick={pick('gcWork')} />
          {f.gcWork === 'Yes' ? (
            <label className="expo-input expo-other">
              <span>Which ones?</span>
              <input value={f.gcNames} onChange={set('gcNames')} placeholder="The builders you've worked for" />
            </label>
          ) : null}
          <Chips legend="Years in business" options={YEARS} value={f.years} onPick={pick('years')} />
          <label className="expo-consent">
            <input type="checkbox" checked={share} onChange={(e) => setShare(e.target.checked)} />
            <span>{SHARE}</span>
          </label>
        </>
      ) : (
        <>
          <Chips
            legend="How many from your team?"
            options={role === 'guest' ? ['1', '2', '3', '4'] : ['1', '2']}
            value={f.attending}
            onPick={(v) => setF((p) => ({ ...p, attending: v || '1' }))}
          />
          {extra > 0 ? (
            <div className="bn-team">
              <p className="bn-team-note">You're person 1. Add everyone else coming so they get the event details and reminders.</p>
              {mates.map((m, i) => (
                <fieldset key={i} className="bn-person">
                  <legend>Person {i + 2}</legend>
                  <div className="bn-person-grid">
                    <label className="expo-input">
                      <span>First name</span>
                      <input value={m.firstName} onChange={setMate(i, 'firstName')} autoComplete="off" required />
                    </label>
                    <label className="expo-input">
                      <span>Last name</span>
                      <input value={m.lastName} onChange={setMate(i, 'lastName')} autoComplete="off" required />
                    </label>
                    <label className="expo-input">
                      <span>Email</span>
                      <input type="email" value={m.email} onChange={setMate(i, 'email')} autoComplete="off" inputMode="email" required />
                    </label>
                  </div>
                </fieldset>
              ))}
            </div>
          ) : null}
          <label className="expo-input" style={{ marginTop: 22 }}>
            <span>
              Anything we should know? <span className="expo-hint">(optional)</span>
            </span>
            <textarea rows={3} value={f.message} onChange={set('message')} placeholder={role === 'supplier' ? 'What you supply, who you want to meet...' : "Trades you're short on, projects you're bidding..."} />
          </label>
        </>
      )}

      <label className="expo-consent">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>{CONSENT}</span>
      </label>

      {error ? <p className="expo-error" role="alert">{error}</p> : null}

      <button type="submit" className="expo-submit" disabled={state === 'sending'}>
        {state === 'sending'
          ? 'Sending...'
          : isSub
            ? 'Check if I qualify'
            : role === 'table'
              ? 'Request a table'
              : role === 'supplier'
                ? 'Request a supplier table'
                : 'Register as a guest'}
      </button>
      <p className="expo-small">
        {isSub
          ? `Nothing to pay now. If you qualify, we email you the $${EVENT.entryFee} payment link.`
          : role === 'table'
            ? `Builder tables are free and limited. Confirm by ${EVENT.builderDeadline}.`
            : role === 'supplier'
              ? `Supplier tables are $${EVENT.supplierPrice} + GST, ${EVENT.supplierTables} spots, first come, first served. Nothing to pay now.`
              : `Guest passes are $${EVENT.entryFee} a person, paid by link after you register.`}
      </p>
    </form>
  );
}
