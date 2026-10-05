'use client';

import { useEffect } from 'react';
import { periodPrice } from '../lib/pricing';

// Tells the Facebook pixel and GoHighLevel a trial with a card was started
// (the page only loads after Stripe checkout succeeds).
export default function WelcomeTrack() {
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      const annual = q.get('plan') === 'yearly';
      const users = q.get('users') || 5;
      const charge = periodPrice(users, annual);
      const sid = q.get('session_id') || undefined;
      window.fbq &&
        window.fbq(
          'track',
          'StartTrial',
          { value: charge, currency: 'CAD', predicted_ltv: annual ? charge : charge * 12 },
          sid ? { eventID: sid } : undefined,
        );
      // Move the lead's card to "Trial started" now (the Stripe webhook does it
      // too; it cannot reach preview links).
      const sessionId = q.get('session_id');
      if (sessionId) {
        fetch('/api/trial-started/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
          keepalive: true,
        })
          .then((r) => r.json())
          .then((d) => {
            if (!d?.signup) return;
            window.dispatchEvent(new CustomEvent('subtrade:signup', { detail: d.signup }));
            try {
              if (d.signup.email) localStorage.setItem('subtrade-billing-email', d.signup.email);
            } catch {}
          })
          .catch(() => {});
      }
      sessionStorage.removeItem('subtrade-start-funnel');
    } catch {}
  }, []);
  return null;
}
