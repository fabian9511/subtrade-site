'use client';

import { useEffect, useState } from 'react';

const SIGNUP = 'https://portal.subtradesoftware.com/signup';

// "Create my login" on /start/welcome/. Hands the portal what the buyer already
// gave us, so the sign-up form can be filled in for them:
//   checkout_session  Stripe Checkout Session id (cs_...). The portal can look
//                     it up with the Stripe secret key to confirm the details
//                     and link the trial subscription to the new account.
//   email, first_name, last_name, company   plain prefill for the form.
//   source=fb-ads-funnel
// The details arrive from /api/trial-started (see WelcomeTrack); until then the
// link carries just the checkout reference.
export default function SignupButton({ className, children }) {
  const [href, setHref] = useState(SIGNUP);

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id') || '';
    const build = (d = {}) => {
      const q = new URLSearchParams({ source: 'fb-ads-funnel' });
      if (sessionId) q.set('checkout_session', sessionId);
      for (const k of ['email', 'first_name', 'last_name', 'company']) if (d[k]) q.set(k, d[k]);
      setHref(`${SIGNUP}?${q}`);
    };
    build();
    const onSignup = (e) => build(e.detail);
    window.addEventListener('subtrade:signup', onSignup);
    return () => window.removeEventListener('subtrade:signup', onSignup);
  }, []);

  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
