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
      window.fbq && window.fbq('track', 'StartTrial', {
        value: charge,
        currency: 'CAD',
        predicted_ltv: annual ? charge : charge * 12,
      });
      // Move the lead's card to "Trial started" now (the Stripe webhook does it
      // too; it cannot reach preview links).
      const sessionId = q.get('session_id');
      if (sessionId) {
        fetch('/api/trial-started/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
          keepalive: true,
        }).catch(() => {});
      }
      sessionStorage.removeItem('subtrade-start-funnel');
    } catch {}
  }, []);
  return null;
}
