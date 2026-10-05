'use client';

import { useEffect, useState } from 'react';
import { periodPrice, fmt, INCLUDED_USERS } from '../lib/pricing';
import PriceBreakdown from './PriceBreakdown';

// "What you signed up for" on /start/welcome/, from the plan and team size
// Stripe sends back in the URL. Same numbers as the trial box and Stripe.
export default function WelcomeSummary() {
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const annual = q.get('plan') === 'yearly';
    const users = Number(q.get('users')) || INCLUDED_USERS;
    setPlan({
      annual,
      users,
      charge: periodPrice(users, annual),
      firstCharge: new Date(Date.now() + 14 * 864e5).toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' }),
    });
  }, []);

  if (!plan) return <div className="fx-welcome-summary" aria-hidden="true" style={{ minHeight: 260 }} />;
  const usersText = `${plan.users} ${plan.users === 1 ? 'user' : 'users'}`;

  return (
    <div className="fx-welcome-summary">
      <p className="eyebrow">What you signed up for</p>
      <p className="fx-receipt-plan">
        SubTrade, complete · {usersText} · billed {plan.annual ? 'yearly (20% off)' : 'monthly'}
      </p>
      <div className="fx-receipt-row fx-receipt-today">
        <span>Charged today</span>
        <b className="mono">$0.00</b>
      </div>
      <div className="fx-receipt-row">
        <span>
          Free trial ends <b>{plan.firstCharge}</b>
          <small>first charge that day, then every {plan.annual ? 'year' : 'month'} until you cancel</small>
        </span>
        <b className="mono">${fmt(plan.charge)}.00 <small>CAD + tax</small></b>
      </div>
      <details className="pb-details">
        <summary>What you&rsquo;re paying for, line by line</summary>
        <PriceBreakdown users={plan.users} annual={plan.annual} compact />
      </details>
      <p className="fx-fine">
        Cancel anytime before {plan.firstCharge} and you pay nothing.
      </p>
    </div>
  );
}
