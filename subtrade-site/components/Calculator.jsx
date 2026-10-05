'use client';

import { useState } from 'react';

import { monthlyTotal, fmt } from '../lib/pricing';

export default function Calculator() {
  const [users, setUsers] = useState(5);
  const [annual, setAnnual] = useState(false);

  const monthly = monthlyTotal(users);
  const shown = annual ? Math.round(monthly * 0.8) : monthly;
  const yearly = annual ? Math.round(monthly * 12 * 0.8) : monthly * 12;

  return (
    <div className="price-card" style={{ flex: '1 1 380px' }}>
      <p className="eyebrow">SubTrade, complete</p>
      <div className="price-line">
        <span className="mono">${fmt(shown)}</span>
        <small>/month CAD + tax</small>
      </div>
      <p className="price-sub">
        {annual
          ? `Billed annually at $${fmt(yearly)}/yr (20% off)`
          : 'Billed monthly. Switch to annual and save 20%.'}
      </p>

      <div className="toggle" role="group" aria-label="Billing period">
        <button className={annual ? '' : 'on'} onClick={() => setAnnual(false)}>
          Monthly
        </button>
        <button className={annual ? 'on' : ''} onClick={() => setAnnual(true)}>
          Annual −20%
        </button>
      </div>

      <div className="calc">
        <label htmlFor="users">
          Team size: <b className="mono" style={{ color: 'var(--gypsum)' }}>{users} users</b>
          {users <= 5 && ' (included in base)'}
        </label>
        <input
          id="users"
          type="range"
          min="1"
          max="50"
          value={users}
          onChange={(e) => setUsers(Number(e.target.value))}
        />
        <div className="calc-readout">
          <span className="mono">${fmt(shown)}/mo</span>
          <small>
            {users > 5
              ? `base $${annual ? fmt(299 * 0.8) : 299} + ${users - 5} extra ${users - 5 === 1 ? 'user' : 'users'}`
              : '5 users included'}
          </small>
        </div>
        <a
          href="https://portal.subtradesoftware.com/signup"
          className="btn btn-primary btn-lg"
          style={{ width: '100%', justifyContent: 'center', marginTop: 20 }}
        >
          Start free trial
        </a>
        <div className="tiers">
          Base plan <span className="mono">$299</span> includes 5 users, then per user:
          <br />
          users 6–15 <span className="mono">$15</span> · 16–25 <span className="mono">$10</span> · 26–29 <span className="mono">$7</span> · 30+ <span className="mono">$4</span>
        </div>
      </div>
    </div>
  );
}
