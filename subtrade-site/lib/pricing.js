// SubTrade pricing math. This is the same math as the original pricing
// calculator and as billing. Do not change it here without changing billing.
//
// Base plan $299/month CAD includes 5 users. Extra users per month:
// users 6-15: $15 | 16-25: $10 | 26-29: $7 | 30+: $4
// Annual billing is 20% off, rounded to whole dollars.
export function monthlyTotal(users) {
  let total = 299;
  if (users > 5) total += (Math.min(users, 15) - 5) * 15;
  if (users > 15) total += (Math.min(users, 25) - 15) * 10;
  if (users > 25) total += (Math.min(users, 29) - 25) * 7;
  if (users > 29) total += (users - 29) * 4;
  return total;
}

// What the customer pays per month on annual billing (same rounding as before).
export const annualMonthly = (monthly) => Math.round(monthly * 0.8);

// What the customer pays per year on annual billing (same rounding as before).
export const annualYearly = (monthly) => Math.round(monthly * 12 * 0.8);

// Extra-user brackets, for showing line items. Each entry: users in the
// bracket for a given crew size, and the per-user rate.
export function userLines(users) {
  return [
    { label: 'Users 6 to 15', rate: 15, qty: users > 5 ? Math.min(users, 15) - 5 : 0 },
    { label: 'Users 16 to 25', rate: 10, qty: users > 15 ? Math.min(users, 25) - 15 : 0 },
    { label: 'Users 26 to 29', rate: 7, qty: users > 25 ? Math.min(users, 29) - 25 : 0 },
    { label: 'Users 30 and up', rate: 4, qty: users > 29 ? users - 29 : 0 },
  ].filter((l) => l.qty > 0);
}
