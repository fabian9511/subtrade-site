'use client';

import { useEffect, useState } from 'react';
import PriceBreakdown from './PriceBreakdown';
import { periodPrice, MIN_USERS, MAX_USERS } from '../lib/pricing';

const post = (url, body) =>
  fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    .then(async (r) => ({ status: r.status, ...(await r.json().catch(() => ({}))) }))
    .catch(() => ({ ok: false, error: 'Network problem. Check your connection and try again.' }));

const REASONS = [
  ['too_expensive', 'Too expensive'],
  ['missing_features', 'Missing a feature we need'],
  ['switched_service', 'Switching to another tool'],
  ['unused', 'Not using it enough'],
  ['too_complex', 'Too hard to set up or use'],
  ['other', 'Something else'],
];

export const EMAIL_KEY = 'subtrade-billing-email';

const money = (n) => `$${Number(n).toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* ---------- /billing/ : ask for the email link ---------- */
export function BillingRequest() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [previewLink, setPreviewLink] = useState('');

  // Fill the email in for them: ?email= in the link, else the one they used
  // last time on this device (saved after checkout or a previous request).
  useEffect(() => {
    let e = new URLSearchParams(window.location.search).get('email') || '';
    if (!e) {
      try {
        e = localStorage.getItem(EMAIL_KEY) || '';
      } catch {}
    }
    if (e) setEmail(e.trim().toLowerCase());
  }, []);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const r = await post('/api/billing/link/', { email });
    setBusy(false);
    if (r.ok) {
      try {
        localStorage.setItem(EMAIL_KEY, email.trim().toLowerCase());
      } catch {}
      setMsg(r.message);
      if (r.previewLink) setPreviewLink(r.previewLink);
    } else setError(r.error || 'Something went wrong. Please try again.');
  }

  return (
    <div className="bl-card">
      {msg ? (
        <>
          <p className="eyebrow">Check your email</p>
          <p className="bl-lead">{msg}</p>
          <p className="fx-fine">The link works for 30 minutes. No email? Make sure it&rsquo;s the address you used at checkout, or email support@subtradesoftware.com.</p>
          {previewLink && (
            <p className="fx-fine">
              Preview only (never shown on the live site): <a href={previewLink}>open the link</a>
            </p>
          )}
        </>
      ) : (
        <form onSubmit={submit}>
          <label className="fx-field">
            <span>Email you subscribed with</span>
            <input type="email" name="email" id="bl-email" required autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          {error && <p className="fx-error" role="alert">{error}</p>}
          <button type="submit" className="btn btn-primary btn-lg fx-submit" disabled={busy}>
            {busy ? 'Sending…' : 'Email me a secure link'}
          </button>
          <p className="fx-fine">We email a one-time link that works for 30 minutes, so only you can see or change your subscription.</p>
        </form>
      )}
    </div>
  );
}

/* ---------- /billing/manage/ : the subscription, card, cancel ---------- */

// Same list as "Every plan includes" on /pricing-plans, plus Bid Manager.
const INCLUDED = [
  'GPS Time Tracking',
  'Job costing',
  'Change Orders',
  'Progress Billing with holdback',
  'Purchase Orders',
  'Crew Scheduling',
  'Daily Logs',
  'GPS-tagged Photos',
  'Drawings & Markups',
  'Tasks & Punch Lists',
  'Submittals & RFIs',
  'Safety & Custom Forms',
  'Project Dashboard',
  'Bid Manager',
  'Unlimited projects',
  'iPhone & Android app for your crews',
];

const WHY = [
  ['Built by a subcontractor', 'Made by a working drywall contractor in Calgary, for trade contractors, not GCs.'],
  ['Your crews actually use it', 'Clock-in, photos and forms from the phone app on iPhone and Android.'],
  ['One price, no per-feature upsells', 'The full platform with 5 users included. Add people as you grow.'],
  ['Real people behind it', 'Questions go straight to our team, not a ticket queue.'],
];

const REVIEWS = [
  {
    quote:
      'Having every drawing, change order, and document in one centralized spot saves us hours of headache each week. The daily log feature is awesome.',
    name: 'TQC Windows & Doors Inc.',
    place: 'Mississauga, Ontario',
  },
  {
    quote:
      'A much more streamlined way of managing projects from a subcontractor perspective. They did an excellent job onboarding us and listening to our needs. 10/10 experience.',
    name: 'Goose Mechanical',
    place: 'Calgary, Alberta · on Capterra',
  },
];

const LOSE = [
  'Your crews stop clocking in from the app',
  'Change orders, daily logs and photos are no longer kept for you',
  'Your drawings and documents leave your foremen’s phones',
  'Your team loses access when the subscription ends',
];

function Sidebar() {
  return (
    <aside className="bl-side">
      <div className="bl-why">
        <p className="eyebrow">Why subs run on SubTrade</p>
        <ul>
          {WHY.map(([t, d]) => (
            <li key={t}>
              <b>{t}</b>
              <span>{d}</span>
            </li>
          ))}
        </ul>
      </div>
      {REVIEWS.map((r) => (
        <figure key={r.name} className="bl-review">
          <div className="bl-stars" aria-label="5 out of 5">★★★★★</div>
          <blockquote>“{r.quote}”</blockquote>
          <figcaption>
            <b>{r.name}</b>
            <span>{r.place}</span>
          </figcaption>
        </figure>
      ))}
      <div className="bl-founder">
        <p>“I run a drywall company in Calgary. SubTrade exists because nothing on the market was built for us.”</p>
        <span>Fabian Vargas Garcia · Co-Founder</span>
      </div>
    </aside>
  );
}

function ChangePlan({ s, busy, error, onConfirm, onBack }) {
  const curAnnual = s.interval === 'year';
  const [annual, setAnnual] = useState(curAnnual);
  const [users, setUsers] = useState(s.users || 5);
  const disc = s.save_offer_used ? 0.8 : 1;
  const curPrice = (s.amount || 0) * disc;
  const newPrice = periodPrice(users, annual) * disc;
  const per = annual ? 'year' : 'month';
  const same = users === s.users && annual === curAnnual;
  const switching = annual && !curAnnual;
  const up = switching || newPrice > curPrice;

  // What's charged today (Stripe does the exact proration; this is the estimate).
  const now = Date.now() / 1000;
  const left = s.period_start && s.period_end ? Math.max(0, Math.min(1, (s.period_end - now) / (s.period_end - s.period_start))) : 1;
  let today = 0;
  if (!s.trial && up) today = switching ? Math.max(0, newPrice - curPrice * left) : (newPrice - curPrice) * left;
  const daysTotal = s.period_start && s.period_end ? Math.round((s.period_end - s.period_start) / 86400) : null;
  const daysLeft = daysTotal != null ? Math.max(0, Math.round(daysTotal * left)) : null;
  const credit = curPrice * left;
  const todayLine = same
    ? null
    : s.trial
      ? `Today: ${money(0)}. Nothing is charged during your free trial. First charge on ${s.next_date}: ${money(newPrice)} + tax.`
      : switching
        ? `Today: ${money(newPrice)} yearly price − ${money(credit)} credit for the ${daysLeft ?? 'unused'} unused days of this month = ≈ ${money(today)} + tax.`
        : up
          ? `Today: ${money(newPrice - curPrice)} difference × ${daysLeft ?? '?'} of ${daysTotal ?? '?'} days left this ${curAnnual ? 'year' : 'month'} = ≈ ${money(today)} + tax.`
          : `Today: ${money(0)}. From ${s.next_date}: ${money(newPrice)} + tax per ${per}.`;

  return (
    <div className="bl-card">
      <p className="eyebrow">Change plan</p>
      <h2 className="bl-title">Add or remove users, or switch to yearly</h2>

      <div className="toggle" role="group" aria-label="Billing period">
        <button type="button" className={annual ? '' : 'on'} aria-pressed={!annual} disabled={curAnnual} onClick={() => setAnnual(false)}>
          Monthly
        </button>
        <button type="button" className={annual ? 'on' : ''} aria-pressed={annual} onClick={() => setAnnual(true)}>
          Annual −20%
        </button>
      </div>
      {curAnnual && <p className="fx-fine">You&rsquo;re on yearly billing (20% off). Yearly plans renew yearly and can&rsquo;t be switched to monthly. You can still add or remove users.</p>}

      <div className="calc">
        <label htmlFor="bl-users">
          Team size: <b className="mono" style={{ color: 'var(--gypsum)' }}>{users} {users === 1 ? 'user' : 'users'}</b>
          {s.users && users !== s.users && <span className="bl-delta"> ({users > s.users ? '+' : ''}{users - s.users} from today)</span>}
        </label>
        <input id="bl-users" type="range" min={MIN_USERS} max={MAX_USERS} value={users} onChange={(e) => setUsers(Number(e.target.value))} />
        <p className="fx-fine">More than {MAX_USERS} users? Email support@subtradesoftware.com.</p>
      </div>

      <div className="bl-compare">
        <div>
          <span>Now</span>
          <b className="mono">{money(curPrice)}</b>
          <small>{s.users} users · per {curAnnual ? 'year' : 'month'}</small>
        </div>
        <div className={same ? '' : 'is-new'}>
          <span>New</span>
          <b className="mono">{money(newPrice)}</b>
          <small>{users} users · per {per}</small>
        </div>
        <div>
          <span>Charged today</span>
          <b className="mono">{same ? '—' : s.trial ? money(0) : `${up ? '≈ ' : ''}${money(today)}`}</b>
          <small>{same ? 'no change' : '+ tax'}</small>
        </div>
      </div>

      {!same && (
        <p className="bl-change-note">
          {s.trial
            ? `You're on your free trial, so nothing is charged now. When it ends on ${s.next_date}, you'll pay ${money(newPrice)} + tax per ${per}.`
            : switching
              ? `Your yearly plan starts today. You're charged ${money(newPrice)} + tax less a credit for the unused part of this month, then yearly from today.`
              : up
                ? `The extra users are yours right away. Today you pay only the difference for the rest of this ${curAnnual ? 'year' : 'month'}; from ${s.next_date} you pay ${money(newPrice)} + tax per ${per}.`
                : `Your new lower price of ${money(newPrice)} + tax starts on ${s.next_date}. No refund for the current ${curAnnual ? 'year' : 'month'}, as in our Fair Billing Policy.`}
        </p>
      )}

      {todayLine && <p className="bl-today">{todayLine}</p>}

      {!same && (
        <details className="pb-details">
          <summary>New price, line by line</summary>
          <PriceBreakdown users={users} annual={annual} saveOffer={s.save_offer_used} compact />
        </details>
      )}

      {error && <p className="fx-error" role="alert">{error}</p>}
      <p className="fx-fine">
        Pay by card, Google Pay or bank debit (pre-authorized debit from a Canadian bank account).
        {s.card_fee ? ' Bank debit and debit cards have no card fee.' : ''}
      </p>
      <div className="bl-actions">
        <button type="button" className="btn btn-primary" disabled={busy || same} onClick={() => onConfirm({ users, plan: annual ? 'yearly' : 'monthly' })}>
          {busy ? 'Saving…' : same ? 'Pick a change above' : s.trial || !up ? 'Confirm change' : `Confirm and pay ${today > 0 ? `≈ ${money(today)}` : ''} + tax`}
        </button>
        <button type="button" className="bl-link" onClick={onBack}>Go back</button>
      </div>
    </div>
  );
}

function TrialBar({ s }) {
  if (!s.trial || !s.trial_start || !s.trial_end) return null;
  const total = Math.max(1, Math.round((s.trial_end - s.trial_start) / 86400));
  const used = Math.min(total, Math.max(1, Math.ceil((Date.now() / 1000 - s.trial_start) / 86400)));
  const left = Math.max(0, total - used);
  return (
    <div className="bl-trialbar">
      <div className="bl-trialbar-top">
        <span>Free trial · day {used} of {total}</span>
        <b>{left === 0 ? 'Ends today' : `${left} ${left === 1 ? 'day' : 'days'} left`}</b>
      </div>
      <div className="bl-track"><i style={{ width: `${(used / total) * 100}%` }} /></div>
    </div>
  );
}

export function BillingManage() {
  const [token, setToken] = useState('');
  const [s, setS] = useState(null); // summary
  const [invoices, setInvoices] = useState([]);
  const [step, setStep] = useState('loading'); // loading | ready | view | reason | offer | confirm | saved | cancelled | expired
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const t =
      new URLSearchParams(window.location.hash.slice(1)).get('t') ||
      new URLSearchParams(window.location.search).get('t') ||
      '';
    // Design check on a developer's own machine only: /billing/manage/?mock=1
    if (window.location.hostname === 'localhost' && new URLSearchParams(window.location.search).has('mock')) {
      const now = Date.now() / 1000;
      setS({ status: 'trialing', trial: true, plan: 'monthly', users: 20, amount: 499, interval: 'month', next_date: 'October 19, 2026', cancel_at_period_end: false, ends_on: null, card: { brand: 'visa', last4: '4242', exp: '12/30' }, save_offer_used: false, trial_start: now - 3 * 86400, trial_end: now + 11 * 86400, company: 'Quality Gypsum Services Ltd' });
      setInvoices([{ id: 'in_1', date: 'October 5, 2026', total: 0, status: 'Free trial', url: '#' }]);
      setStep('view');
      return;
    }
    // Keep the token out of the address bar and browser history.
    window.history.replaceState(null, '', '/billing/manage/');
    if (!t) return setStep('expired');
    // Wait for a real click: email link scanners open links automatically and
    // would otherwise use up the one-time link.
    setToken(t);
    setStep('ready');
  }, []);

  async function open() {
    setBusy(true);
    const r = await post('/api/billing/manage/', { token, action: 'view' });
    setBusy(false);
    if (!r.ok) return setStep('expired');
    setToken(r.token);
    setS(r.summary);
    setInvoices(r.invoices || []);
    setStep('view');
  }

  useEffect(() => {
    if (step !== 'loading') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  async function act(action, extra = {}) {
    setBusy(true);
    setError('');
    const r = await post('/api/billing/manage/', { token, action, reason, comment, ...extra });
    setBusy(false);
    if (r.expired) return setStep('expired');
    if (!r.ok) {
      setError(r.error || 'Something went wrong. Please try again.');
      return null;
    }
    if (r.summary) setS(r.summary);
    if (r.invoices) setInvoices(r.invoices);
    return r;
  }

  if (step === 'loading')
    return (
      <div className="bl-layout">
        <div className="bl-card"><p className="bl-lead">Loading your subscription…</p></div>
      </div>
    );

  if (step === 'ready')
    return (
      <div className="bl-layout">
        <div className="bl-card">
          <p className="eyebrow">Secure link</p>
          <p className="bl-lead">Your link is ready. For your security it works once.</p>
          <button type="button" className="btn btn-primary btn-lg fx-submit" disabled={busy} onClick={open}>
            {busy ? 'Opening…' : 'Show my subscription'}
          </button>
        </div>
      </div>
    );

  if (step === 'expired')
    return (
      <div className="bl-layout">
        <div className="bl-card">
          <p className="eyebrow">Link expired</p>
          <p className="bl-lead">For your security, billing links work once and only for 30 minutes.</p>
          <a href="/billing/" className="btn btn-primary btn-lg fx-submit">Get a new link</a>
        </div>
      </div>
    );

  const usersText = s.users ? `${s.users} ${s.users === 1 ? 'user' : 'users'}` : null;
  const per = s.interval === 'year' ? 'year' : 'month';
  const status = s.cancel_at_period_end
    ? { label: 'Cancelling', cls: 'is-warn' }
    : s.trial
      ? { label: 'Free trial', cls: 'is-trial' }
      : s.status === 'past_due'
        ? { label: 'Payment overdue', cls: 'is-warn' }
        : { label: 'Active', cls: 'is-ok' };

  const PlanCard = (
    <div className="bl-card bl-plan">
      <div className="bl-plan-head">
        <div>
          <p className="eyebrow">Your plan</p>
          <h2 className="bl-plan-name">SubTrade, complete</h2>
          <p className="bl-plan-meta">
            {[usersText, `billed ${s.plan === 'yearly' ? 'yearly' : 'monthly'}`, s.company].filter(Boolean).join(' · ')}
          </p>
        </div>
        <span className={`bl-chip ${status.cls}`}>{status.label}</span>
      </div>

      <TrialBar s={s} />

      {s.cancel_at_period_end && (
        <div className="bl-notice">
          Your subscription ends on <b>{s.ends_on}</b>. You keep full access until then and won&rsquo;t be charged again.
        </div>
      )}

      <div className="bl-stats">
        <div>
          <span>{s.cancel_at_period_end ? 'Access until' : s.trial ? 'First charge' : 'Next charge'}</span>
          <b>{s.cancel_at_period_end ? s.ends_on : s.next_date || '—'}</b>
        </div>
        <div>
          <span>Amount</span>
          <b className="mono">{s.amount != null ? money((s.amount + (s.card_fee || 0)) * (s.save_offer_used ? 0.8 : 1)) : '—'}</b>
          <small>CAD + tax / {per}{s.card_fee ? ' · incl. 2.4% card fee' : ''}{s.save_offer_used ? ' · 20% off applied' : ''}</small>
        </div>
        <div>
          <span>{s.bank ? 'Paying by' : 'Card on file'}</span>
          <b>{s.card ? `${s.card.brand.toUpperCase()} •••• ${s.card.last4}` : s.bank ? `${s.bank.bank} •••• ${s.bank.last4}` : s.link ? 'Link' : 'None'}</b>
          {s.link && <small>Saved with Stripe Link{s.link.email ? ` · ${s.link.email}` : ''}</small>}
          {s.card && <small>Expires {s.card.exp}</small>}
          {s.bank && <small>Bank debit (PAD)</small>}
        </div>
      </div>

      {s.users && (
        <details className="pb-details bl-breakdown" open>
          <summary>What you pay, line by line</summary>
          <PriceBreakdown users={s.users} annual={s.interval === 'year'} saveOffer={s.save_offer_used} cardFee={!!s.card_fee} />
        </details>
      )}

      {error && <p className="fx-error" role="alert">{error}</p>}
      <div className="bl-actions">
        <button
          type="button"
          className="btn btn-primary"
          disabled={busy}
          onClick={async () => {
            const r = await act('card');
            if (r?.url) window.location.assign(r.url);
          }}
        >
          Update payment method
        </button>
        {!s.cancel_at_period_end && s.users && (
          <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => setStep('change')}>
            Change plan
          </button>
        )}
        {s.trial && !s.cancel_at_period_end && (
          <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => setStep('buy')}>
            Start my paid plan now
          </button>
        )}
        {s.cancel_at_period_end ? (
          <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => act('undo')}>
            Keep my subscription
          </button>
        ) : (
          <button type="button" className="bl-link" disabled={busy} onClick={() => setStep('reason')}>
            Cancel subscription
          </button>
        )}
      </div>
    </div>
  );

  if (step === 'view')
    return (
      <div className="bl-layout">
        <div className="bl-main">
          {PlanCard}

          <div className="bl-card">
            <p className="eyebrow">Everything in your plan</p>
            <ul className="bl-included">
              {INCLUDED.map((t) => (
                <li key={t}>
                  <b>{t}</b>
                </li>
              ))}
            </ul>
            <p className="fx-fine">
              {usersText ? `${usersText} on your plan. ` : ''}Need more people? Add users anytime from $4 to $15 each. See{' '}
              <a href="/pricing-plans/">pricing</a>.
            </p>
          </div>

          <div className="bl-card">
            <p className="eyebrow">Billing history</p>
            {invoices.length ? (
              <table className="bl-invoices">
                <tbody>
                  {invoices.map((i) => (
                    <tr key={i.id}>
                      <td>{i.date}</td>
                      <td className="mono">{money(i.total)}</td>
                      <td><span className={`bl-chip ${i.status === 'Due' ? 'is-warn' : 'is-ok'}`}>{i.status}</span></td>
                      <td>{i.url && <a href={i.url} target="_blank" rel="noopener noreferrer">View</a>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="bl-muted">No invoices yet.</p>
            )}
          </div>

          <div className="bl-card bl-help">
            <p className="eyebrow">Get more out of SubTrade</p>
            <div className="bl-help-grid">
              <a href="/how-to-tutorials/"><b>Watch the tutorials</b><span>Short how-to videos for every part of SubTrade</span></a>
              <a href="/construction-software-15min-demo/"><b>Book a setup session</b><span>15 minutes with our team on a screen share</span></a>
              <a href="mailto:support@subtradesoftware.com"><b>Email support</b><span>support@subtradesoftware.com, answered by real people</span></a>
            </div>
          </div>
          <p className="fx-fine">
            Questions about your bill? Email <a href="mailto:support@subtradesoftware.com">support@subtradesoftware.com</a>. See our{' '}
            <a href="/fair-billing-policy/">Fair Billing Policy</a>.
          </p>
        </div>
        <Sidebar />
      </div>
    );

  if (step === 'reason')
    return (
      <div className="bl-layout">
        <div className="bl-main">
          <div className="bl-card">
            <p className="eyebrow">Cancel · step 1 of 2</p>
            <h2 className="bl-title">Sorry to see you go. What&rsquo;s the main reason?</h2>
            <div className="bl-reasons" role="radiogroup" aria-label="Reason for cancelling">
              {REASONS.map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={reason === id}
                  className={`fx-choice${reason === id ? ' is-on' : ''}`}
                  onClick={() => setReason(id)}
                >
                  <span className="fx-choice-radio" aria-hidden="true" />
                  <span className="fx-choice-body"><b>{label}</b></span>
                </button>
              ))}
            </div>
            <label className="fx-field">
              <span>Anything we should know? (optional)</span>
              <textarea rows={3} value={comment} maxLength={500} onChange={(e) => setComment(e.target.value)} />
            </label>
            <div className="bl-actions">
              <button
                type="button"
                className="btn btn-primary"
                disabled={!reason}
                onClick={() => setStep(s.save_offer_used ? 'confirm' : 'offer')}
              >
                Continue
              </button>
              <button type="button" className="bl-link" onClick={() => setStep('view')}>Never mind, go back</button>
            </div>
          </div>
        </div>
        <Sidebar />
      </div>
    );

  if (step === 'offer' || step === 'confirm')
    return (
      <div className="bl-layout">
        <div className="bl-main">
          <div className="bl-card">
            <p className="eyebrow">Cancel · step 2 of 2</p>
            {step === 'offer' && (
              <div className="bl-offer">
                <span className="bl-offer-tag">Offer for you</span>
                <h2 className="bl-title">Don&rsquo;t cancel, and save an extra 20%</h2>
                {s.amount != null && (
                  <div className="bl-save">
                    <div>
                      <span>You save</span>
                      <b className="mono">{money(s.amount * 0.2)}</b>
                      <small>every {per}</small>
                    </div>
                    <div>
                      <span>Over the next 12 months</span>
                      <b className="mono">{money(per === 'year' ? s.amount * 0.2 : s.amount * 0.2 * 12)}</b>
                      <small>back in your pocket</small>
                    </div>
                    <div>
                      <span>Your new price</span>
                      <b className="mono">{money(s.amount * 0.8)}</b>
                      <small><s>{money(s.amount)}</s> per {per} + tax</small>
                    </div>
                  </div>
                )}
                <p>
                  {s.trial ? (
                    <>
                      Your plan starts today with 20% off for 12 months. Your free trial ends now and{' '}
                      <b>{s.amount != null ? `${money(s.amount * 0.8)} + tax` : 'your first discounted payment'}</b> is charged to your card today,
                      then every {per}.
                    </>
                  ) : (
                    'The discount starts with your next charge and lasts 12 months. Same plan, same users, nothing else changes.'
                  )}
                </p>
                {s.users && (
                  <details className="pb-details">
                    <summary>See the full price with your discount</summary>
                    <PriceBreakdown users={s.users} annual={s.interval === 'year'} saveOffer compact />
                  </details>
                )}
                <button
                  type="button"
                  className="btn btn-primary btn-lg fx-submit"
                  disabled={busy}
                  onClick={async () => {
                    const r = await act('save');
                    if (r) setStep(r.manual ? 'saved-manual' : r.charged ? 'started' : 'saved');
                    if (r?.charged) act('view');
                  }}
                >
                  {busy
                    ? 'Applying…'
                    : s.amount != null
                      ? `${s.trial ? 'Start my plan today and save' : 'Keep SubTrade and save'} ${money(per === 'year' ? s.amount * 0.2 : s.amount * 0.2 * 12)}`
                      : 'Yes, keep SubTrade with 20% off'}
                </button>
              </div>
            )}
            {step === 'confirm' && <h2 className="bl-title">Confirm cancellation</h2>}

            <div className="bl-lose">
              <p className="bl-lose-title">If you cancel</p>
              <ul>
                {LOSE.map((l) => <li key={l}>{l}</li>)}
              </ul>
              <p className="bl-cancel-note">
                {s.trial
                  ? `Your trial ends on ${s.next_date} and you won't be charged.`
                  : `You keep access until ${s.next_date} and won't be charged again. No refund for the current ${per}. You can ask us to export your data within 30 days after it ends.`}
              </p>
            </div>

            {error && <p className="fx-error" role="alert">{error}</p>}
            <div className="bl-actions">
              <button
                type="button"
                className="btn btn-ghost"
                disabled={busy}
                onClick={async () => {
                  if (await act('cancel')) setStep('cancelled');
                }}
              >
                {step === 'offer' ? 'No thanks, cancel my subscription' : 'Cancel my subscription'}
              </button>
              <button type="button" className="bl-link" onClick={() => setStep('view')}>Go back</button>
            </div>
          </div>
        </div>
        <Sidebar />
      </div>
    );

  if (step === 'change')
    return (
      <div className="bl-layout">
        <div className="bl-main">
          <ChangePlan
            s={s}
            busy={busy}
            error={error}
            onBack={() => setStep('view')}
            onConfirm={async (choice) => {
              const r = await act('change', choice);
              if (r) setStep('changed');
            }}
          />
        </div>
        <Sidebar />
      </div>
    );

  if (step === 'changed')
    return (
      <div className="bl-layout">
        <div className="bl-main">
          <div className="bl-card bl-done">
            <p className="eyebrow">Plan updated</p>
            <h2 className="bl-title">Done. Your plan is now {s.users} users, billed {s.plan === 'yearly' ? 'yearly' : 'monthly'}.</h2>
            <p>Any charge for today is in your billing history. Your team can add the new users in SubTrade right away.</p>
            <div className="bl-actions">
              <button type="button" className="btn btn-primary" onClick={() => setStep('view')}>Back to my subscription</button>
            </div>
          </div>
        </div>
        <Sidebar />
      </div>
    );

  if (step === 'buy') {
    const due = s.amount != null ? (s.save_offer_used ? s.amount * 0.8 : s.amount) : null;
    return (
      <div className="bl-layout">
        <div className="bl-main">
          <div className="bl-card">
            <p className="eyebrow">Start your paid plan</p>
            <h2 className="bl-title">Ready to go? End your free trial and start today.</h2>
            <p>
              Your trial ends now and {due != null ? <b>{money(due)} + tax</b> : 'your first payment'} is charged to your{' '}
              {s.card ? `${s.card.brand.toUpperCase()} ending ${s.card.last4}` : 'card on file'} today. After that you&rsquo;re billed every {per} on
              this date. Same plan, same users, nothing else changes.
            </p>
            {s.users && (
              <details className="pb-details" open>
                <summary>What you&rsquo;ll pay, line by line</summary>
                <PriceBreakdown users={s.users} annual={s.interval === 'year'} saveOffer={s.save_offer_used} compact />
              </details>
            )}
            {error && <p className="fx-error" role="alert">{error}</p>}
            <div className="bl-actions">
              <button
                type="button"
                className="btn btn-primary"
                disabled={busy}
                onClick={async () => {
                  if (await act('start')) {
                    setStep('started');
                    act('view'); // refresh billing history with today's charge
                  }
                }}
              >
                {busy ? 'Starting…' : due != null ? `Charge ${money(due)} + tax and start now` : 'Start my plan now'}
              </button>
              <button type="button" className="bl-link" onClick={() => setStep('view')}>Not yet, keep my trial</button>
            </div>
          </div>
        </div>
        <Sidebar />
      </div>
    );
  }

  if (step === 'started')
    return (
      <div className="bl-layout">
        <div className="bl-main">
          <div className="bl-card bl-done">
            <p className="eyebrow">You&rsquo;re all set</p>
            <h2 className="bl-title">Your paid plan has started. Welcome to SubTrade.</h2>
            <p>Your first payment was charged today. You&rsquo;ll find the receipt under Billing history on your subscription page. Thanks for building with us.</p>
            <div className="bl-actions">
              <a href="/construction-software-15min-demo/" className="btn btn-primary">Book a setup session</a>
              <button type="button" className="bl-link" onClick={() => setStep('view')}>Back to my subscription</button>
            </div>
          </div>
        </div>
        <Sidebar />
      </div>
    );

  if (step === 'saved-manual')
    return (
      <div className="bl-layout">
        <div className="bl-main">
          <div className="bl-card bl-done">
            <p className="eyebrow">Done</p>
            <h2 className="bl-title">Thanks for staying. Your subscription continues.</h2>
            <p>Your extra 20% off is being added to your account by our team today. You&rsquo;ll see it on your next charge. Nothing else to do.</p>
            <div className="bl-actions">
              <a href="/construction-software-15min-demo/" className="btn btn-primary">Book 15 minutes with our team</a>
            </div>
          </div>
        </div>
        <Sidebar />
      </div>
    );

  if (step === 'saved')
    return (
      <div className="bl-layout">
        <div className="bl-main">
          <div className="bl-card bl-done">
            <p className="eyebrow">Done</p>
            <h2 className="bl-title">Thanks for staying. Your extra 20% off is on.</h2>
            <p>Let&rsquo;s make sure SubTrade is earning its keep. A 15-minute session with our team usually fixes whatever wasn&rsquo;t working.</p>
            <div className="bl-actions">
              <a href="/construction-software-15min-demo/" className="btn btn-primary">Book 15 minutes with our team</a>
              <button type="button" className="bl-link" onClick={() => setStep('view')}>Back to my subscription</button>
            </div>
          </div>
          {PlanCard}
        </div>
        <Sidebar />
      </div>
    );

  // cancelled
  return (
    <div className="bl-layout">
      <div className="bl-main">
        <div className="bl-card bl-done">
          <p className="eyebrow">Cancelled</p>
          <h2 className="bl-title">Your subscription is cancelled</h2>
          <p>
            {s.trial ? 'You will not be charged.' : 'You will not be charged again.'} You keep access until <b>{s.ends_on || s.next_date}</b>. Changed your mind? You can undo it any time before then.
          </p>
          {error && <p className="fx-error" role="alert">{error}</p>}
          <div className="bl-actions">
            <button
              type="button"
              className="btn btn-primary"
              disabled={busy}
              onClick={async () => {
                if (await act('undo')) setStep('view');
              }}
            >
              Undo, keep my subscription
            </button>
          </div>
        </div>
      </div>
      <Sidebar />
    </div>
  );
}
