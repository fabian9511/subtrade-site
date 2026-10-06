'use client';

import { priceBreakdown } from '../lib/pricing';

const money = (n) => `${n < 0 ? '−' : ''}$${Math.abs(n).toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// "What you pay, line by line" for a team size and billing period, from the
// same formula as the pricing page and Stripe (lib/pricing.js).
// saveOffer: show the extra 20% stay-with-us discount.
// cardFee: the 2.4% credit card processing fee is on this subscription.
export default function PriceBreakdown({ users, annual, saveOffer = false, cardFee = false, compact = false }) {
  if (!users) return null;
  const b = priceBreakdown(users, annual);
  const rows = b.lines.map((l) => ({ ...l }));
  if (annual) {
    rows.push({ label: 'Monthly price', amount: b.monthly, sub: true });
    rows.push({ label: '× 12 months', amount: b.monthly * 12 });
    rows.push({ label: 'Annual billing discount (20%)', amount: b.period - b.monthly * 12 });
  }
  let total = b.period;
  if (cardFee) {
    const fee = Math.round(b.period * 2.4) / 100;
    rows.push({ label: 'Credit card processing fee (2.4%)', amount: fee, detail: 'Pay by bank debit or a debit card to remove it' });
    total += fee;
  }
  if (saveOffer) {
    const off = -Math.round(total * 0.2 * 100) / 100;
    rows.push({ label: 'Stay-with-us discount (20%, 12 months)', amount: off });
    total += off;
  }
  const per = annual ? 'year' : 'month';
  return (
    <div className={`pb${compact ? ' pb-compact' : ''}`}>
      <table>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={r.sub ? 'pb-sub' : r.amount < 0 ? 'pb-off' : ''}>
              <td>
                {r.label}
                {r.detail && <small>{r.detail}</small>}
              </td>
              <td className="mono">{money(r.amount)}</td>
            </tr>
          ))}
          <tr className="pb-total">
            <td>Total per {per}</td>
            <td className="mono">{money(total)} <small>CAD</small></td>
          </tr>
        </tbody>
      </table>
      <p className="pb-tax">Plus GST/HST or other sales tax that applies at your billing address, added to each charge.</p>
    </div>
  );
}
