'use client';

import { useState } from 'react';
import { monthlyTotal, annualMonthly, annualYearly, userLines } from '../lib/pricing';

const SIGNUP = 'https://portal.subtradesoftware.com/signup';
const money = (n) => `$${n.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const whole = (n) => n.toLocaleString('en-CA', { maximumFractionDigits: 0 });

// The pricing page "quote": crew size and billing period in, line items and
// total out. All numbers come from lib/pricing.js (the same math as billing).
export default function QuoteSheet() {
  const [users, setUsers] = useState(12);
  const [annual, setAnnual] = useState(false);

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
            <button type="button" aria-label="One fewer user" onClick={() => setUsers((u) => Math.max(1, u - 1))}>−</button>
            <span aria-live="polite">{users}</span>
            <button type="button" aria-label="One more user" onClick={() => setUsers((u) => Math.min(200, u + 1))}>+</button>
          </div>
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
          <div className="qs-sign">
            <span aria-hidden="true">x</span>
            <small>Accepted by</small>
          </div>
          <a href={SIGNUP} className="btn btn-primary btn-lg">Accept and start free trial</a>
        </div>
      </div>
    </div>
  );
}
