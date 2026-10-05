'use client';

import { useEffect, useState } from 'react';

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

const money = (n) => `$${Number(n).toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* ---------- /billing/ : ask for the email link ---------- */
export function BillingRequest() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [previewLink, setPreviewLink] = useState('');

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const r = await post('/api/billing/link/', { email });
    setBusy(false);
    if (r.ok) {
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
            <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          {error && <p className="fx-error" role="alert">{error}</p>}
          <button type="submit" className="btn btn-primary btn-lg fx-submit" disabled={busy}>
            {busy ? 'Sending…' : 'Email me a secure link'}
          </button>
          <p className="fx-fine">We email a one-time link so only you can see or change your subscription.</p>
        </form>
      )}
    </div>
  );
}

/* ---------- /billing/manage/ : the subscription, card, cancel ---------- */
export function BillingManage() {
  const [token, setToken] = useState('');
  const [s, setS] = useState(null); // summary
  const [step, setStep] = useState('loading'); // loading | view | reason | offer | saved | cancelled | expired
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('t') || '';
    // Keep the token out of the address bar and browser history.
    window.history.replaceState(null, '', '/billing/manage/');
    post('/api/billing/manage/', { token: t, action: 'view' }).then((r) => {
      if (!r.ok) return setStep('expired');
      setToken(r.token);
      setS(r.summary);
      setStep('view');
    });
  }, []);

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
    return r;
  }

  if (step === 'loading') return <div className="bl-card"><p className="bl-lead">Loading your subscription…</p></div>;

  if (step === 'expired')
    return (
      <div className="bl-card">
        <p className="eyebrow">Link expired</p>
        <p className="bl-lead">For your security, billing links only work for a short time.</p>
        <a href="/billing/" className="btn btn-primary btn-lg fx-submit">Get a new link</a>
      </div>
    );

  const usersText = s.users ? `${s.users} ${s.users === 1 ? 'user' : 'users'}` : null;
  const per = s.interval === 'year' ? 'year' : 'month';

  const Summary = (
    <div className="bl-summary">
      <p className="fx-receipt-plan">
        SubTrade, complete{usersText ? ` · ${usersText}` : ''} · billed {s.plan === 'yearly' ? 'yearly' : 'monthly'}
      </p>
      <div className="fx-receipt-row">
        <span>Status</span>
        <b>
          {s.cancel_at_period_end
            ? `Cancelled, access until ${s.ends_on}`
            : s.trial
              ? 'Free trial'
              : s.status === 'past_due'
                ? 'Payment overdue'
                : 'Active'}
        </b>
      </div>
      {!s.cancel_at_period_end && s.next_date && (
        <div className="fx-receipt-row">
          <span>
            {s.trial ? 'Trial ends, first charge' : 'Next charge'} <b>{s.next_date}</b>
            {s.save_offer_used && <small>Your extra 20% discount is applied</small>}
          </span>
          {s.amount != null && (
            <b className="mono">
              {money(s.amount)} <small>CAD + tax / {per}</small>
            </b>
          )}
        </div>
      )}
      <div className="fx-receipt-row">
        <span>Card on file</span>
        <b>{s.card ? `${s.card.brand.toUpperCase()} ending ${s.card.last4} · exp ${s.card.exp}` : 'None'}</b>
      </div>
    </div>
  );

  if (step === 'view')
    return (
      <div className="bl-card">
        <p className="eyebrow">Your subscription</p>
        {Summary}
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
            Update card
          </button>
          {s.cancel_at_period_end ? (
            <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => act('undo')}>
              Keep my subscription (undo cancel)
            </button>
          ) : (
            <button type="button" className="bl-link" disabled={busy} onClick={() => setStep('reason')}>
              Cancel subscription
            </button>
          )}
        </div>
        <p className="fx-fine">
          Questions about your bill? Email <a href="mailto:support@subtradesoftware.com">support@subtradesoftware.com</a>. See our{' '}
          <a href="/fair-billing-policy/">Fair Billing Policy</a>.
        </p>
      </div>
    );

  if (step === 'reason')
    return (
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
    );

  if (step === 'offer' || step === 'confirm')
    return (
      <div className="bl-card">
        <p className="eyebrow">Cancel · step 2 of 2</p>
        {step === 'offer' && (
          <div className="bl-offer">
            <h2 className="bl-title">Before you go: stay and get an extra 20% off for 12 months</h2>
            <p>
              {s.trial
                ? `Keep your trial. When your paid plan starts on ${s.next_date}, you pay 20% less for your first 12 months.`
                : 'Your next 12 months cost 20% less, starting with your next charge. Nothing else changes.'}
              {s.amount != null && (
                <>
                  {' '}That&rsquo;s <b>{money(s.amount * 0.8)}</b> instead of {money(s.amount)} per {per} (plus tax).
                </>
              )}
            </p>
            <button
              type="button"
              className="btn btn-primary btn-lg fx-submit"
              disabled={busy}
              onClick={async () => {
                if (await act('save')) setStep('saved');
              }}
            >
              {busy ? 'Applying…' : 'Yes, keep SubTrade with 20% off'}
            </button>
          </div>
        )}
        {step === 'confirm' && <h2 className="bl-title">Confirm cancellation</h2>}
        <p className="bl-cancel-note">
          {s.trial
            ? `If you cancel, your trial ends on ${s.next_date} and you won't be charged.`
            : `If you cancel, you keep access until ${s.next_date} and won't be charged again. No refund for the current ${per}.`}
        </p>
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
    );

  if (step === 'saved')
    return (
      <div className="bl-card">
        <p className="eyebrow">Done</p>
        <h2 className="bl-title">Thanks for staying. Your extra 20% off is on.</h2>
        {Summary}
        <p className="fx-fine">Want help getting more out of SubTrade? <a href="/construction-software-15min-demo/">Book 15 minutes with our team</a>.</p>
      </div>
    );

  // cancelled
  return (
    <div className="bl-card">
      <p className="eyebrow">Cancelled</p>
      <h2 className="bl-title">Your subscription is cancelled</h2>
      {Summary}
      <p>
        {s.trial ? 'You will not be charged.' : 'You will not be charged again.'} Your data stays available until access ends; after that you can ask us to
        export it within 30 days.
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
  );
}
