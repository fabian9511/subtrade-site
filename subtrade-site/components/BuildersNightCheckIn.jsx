'use client';

import { useState } from 'react';

/**
 * Builders Night door check-in (/builders-night/check-in/). One field: the
 * email they registered with. Posts to /api/builders-night/check-in/, which
 * tags them bn-attended in GoHighLevel and moves their card to "Checked in".
 * Works on people's own phones (QR poster at the door) or a tablet at the
 * check-in table ("Check in someone else" clears it for the next person).
 */
export default function BuildersNightCheckIn() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | sending | done
  const [res, setRes] = useState(null);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter the email you registered with.');
      return;
    }
    setState('sending');
    try {
      const r = await fetch('/api/builders-night/check-in/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data.ok) throw new Error(data.error || 'Something went wrong');
      setRes(data);
      setState('done');
    } catch (err) {
      setState('idle');
      setError(`${err.message}. Please see the check-in table.`);
    }
  }

  const reset = () => {
    setEmail('');
    setRes(null);
    setError('');
    setState('idle');
  };

  if (state === 'done' && res) {
    const hi = res.firstName ? `, ${res.firstName}` : '';
    const ok = res.status === 'checked-in' || res.status === 'already';
    return (
      <div className="expo-card expo-thanks bn-checkin" role="status">
        <div className={`expo-tick${ok ? '' : ' bn-tick-no'}`} aria-hidden="true">{ok ? '✓' : '!'}</div>
        {res.status === 'checked-in' ? (
          <>
            <h2 className="display bn-thanks-h">You're in{hi}</h2>
            <p>Grab your badge at the check-in table and head to the builder tables.</p>
          </>
        ) : res.status === 'already' ? (
          <>
            <h2 className="display bn-thanks-h">Already checked in{hi}</h2>
            <p>You're all set. Grab your badge at the check-in table if you don't have it yet.</p>
          </>
        ) : res.status === 'not-qualified' ? (
          <>
            <h2 className="display bn-thanks-h">Please see the check-in table</h2>
            <p>We don't have you on the list for today. Our team at the table will sort it out.</p>
          </>
        ) : (
          <>
            <h2 className="display bn-thanks-h">We can't find that email</h2>
            <p>
              Try the email you registered with. Not registered? See the check-in table, or{' '}
              <a href="/builders-night/#register">register here</a>.
            </p>
          </>
        )}
        <button type="button" className="btn btn-ghost bn-checkin-again" onClick={reset}>
          {ok ? 'Check in someone else' : 'Try again'}
        </button>
      </div>
    );
  }

  return (
    <form className="expo-card bn-checkin" onSubmit={submit} noValidate>
      <label className="expo-input">
        <span>Your email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          inputMode="email"
          placeholder="The one you registered with"
          required
        />
      </label>
      {error ? <p className="expo-error" role="alert">{error}</p> : null}
      <button type="submit" className="expo-submit" disabled={state === 'sending'}>
        {state === 'sending' ? 'Checking in...' : 'Check in'}
      </button>
    </form>
  );
}
