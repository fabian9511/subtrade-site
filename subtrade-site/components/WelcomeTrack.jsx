'use client';

import { useEffect } from 'react';

// Tells the Facebook pixel a trial with a card was started (the page only
// loads after Stripe checkout succeeds).
export default function WelcomeTrack() {
  useEffect(() => {
    try {
      const plan = new URLSearchParams(window.location.search).get('plan') === 'yearly' ? 'yearly' : 'monthly';
      window.fbq && window.fbq('track', 'StartTrial', {
        value: plan === 'yearly' ? 2870 : 299,
        currency: 'CAD',
        predicted_ltv: plan === 'yearly' ? 2870 : 3588,
      });
      sessionStorage.removeItem('subtrade-start-funnel');
    } catch {}
  }, []);
  return null;
}
