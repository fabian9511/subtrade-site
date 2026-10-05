'use client';

import { useEffect } from 'react';
import { periodPrice } from '../lib/pricing';

// Tells the Facebook pixel a trial with a card was started (the page only
// loads after Stripe checkout succeeds).
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
      sessionStorage.removeItem('subtrade-start-funnel');
    } catch {}
  }, []);
  return null;
}
