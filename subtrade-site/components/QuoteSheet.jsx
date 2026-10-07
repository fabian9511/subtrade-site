'use client';

import { useState } from 'react';
import { monthlyTotal, annualMonthly, annualYearly, userLines } from '../lib/pricing';

const SIGNUP = 'https://portal.subtradesoftware.com/signup';
const money = (n) => `$${n.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const whole = (n) => n.toLocaleString('en-CA', { maximumFractionDigits: 0 });

// The pricing page "quote": crew size and billing period in, line items and
// total out. All numbers come from lib/pricing.js (the same math as billing).
const MIN = 5; // base plan: 5 users, $299
const MAX = 100;
const clamp = (n) => Math.min(MAX, Math.max(MIN, Math.round(n)));

export default function QuoteSheet() {
  const [users, setUsers] = useState(MIN);
  const [draft, setDraft] = useState(String(MIN)); // what is typed in the box
  const [annual, setAnnual] = useState(false);

  const set = (n) => { const v = clamp(n); setUsers(v); setDraft(String(v)); };
  const onType = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
    setDraft(raw);
    const n = parseInt(raw, 10);
    if (!Number.isNaN(n) && n >= MIN && n <= MAX) setUsers(n);
  };
  const onBlur = () => set(parseInt(draft, 10) || MIN);

  const monthly = monthlyTotal(users);
  const total = annual ? annualMonthly(monthly) : monthly;
  const lines = userLines(users);

  return (
    <div className="qs">
      <div className="qs-stripe" aria-hidden="true" />
      <div className="qs-body">
        <div className="qs-head">
          <div>
            <p className="qs-title">Quote</p>
            <p className="qs-from">SubTrade Software Ltd. · Calgary, Alberta</p>
          </div>
          <div className="qs-meta">
            <span>No. ST-{users}</span>
            <span>Prepared for: your company</span>
            <span>Terms: {annual ? 'annual' : 'monthly'}</span>
          </div>
        </div>

        <div className="qs-controls">
          <span className="qs-label" id="qs-crew">Crew size</span>
          <div className="qs-stepper" role="group" aria-labelledby="qs-crew">
            <button type="button" aria-label="One fewer user" onClick={() => set(users - 1)} disabled={users <= MIN}>−</button>
            <input
              type="text"
              inputMode="numeric"
              aria-label={`Number of users, ${MIN} to ${MAX}`}
              value={draft}
              onChange={onType}
              onBlur={onBlur}
              onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
            />
            <button type="button" aria-label="One more user" onClick={() => set(users + 1)} disabled={users >= MAX}>+</button>
          </div>
          <span className="qs-range">{MIN} to {MAX} users</span>
          <label className="qs-annual">
            <input type="checkbox" checked={annual} onChange={(e) => setAnnual(e.target.checked)} />
            Pay annually (save 20%)
          </label>
        </div>

        <div className="qs-table-wrap">
          <table className="qs-table">
            <thead>
              <tr><th scope="col">Item</th><th scope="col">Qty</th><th scope="col">Rate</th><th scope="col">Amount</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><b>SubTrade plan</b><small>All 15 tools, 5 users included</small></td>
                <td>1</td><td>$299</td><td>{money(299)}</td>
              </tr>
              {lines.map((l) => (
                <tr key={l.label}>
                  <td><b>Additional users</b><small>{l.label}</small></td>
                  <td>{l.qty}</td><td>${l.rate}</td><td>{money(l.qty * l.rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="qs-sums">
          <div><span>Subtotal / month</span><span>{money(monthly)}</span></div>
          {annual && <div className="qs-disc"><span>Annual discount 20%</span><span>−{money(monthly - total)}</span></div>}
        </div>

        <div className="qs-total">
          <span>Total per month (CAD)</span>
          <span className="qs-total-num">${whole(total)}</span>
        </div>
        <p className="qs-note">
          {annual
            ? `Billed annually at $${whole(annualYearly(monthly))}/yr (20% off).`
            : 'Billed monthly. Tick annual to save 20%.'}
        </p>

        <div className="qs-foot">
          <a href={SIGNUP} className="btn btn-primary btn-lg">Accept and start free trial</a>
        </div>
      </div>
    </div>
  );
}
