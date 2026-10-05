// SubTrade pricing — the one place the numbers live.
// Used by the pricing-page calculator, the /start/ trial box and /api/checkout,
// so what a visitor sees is always what Stripe charges.
//
// Base $299/month includes 5 users, then per extra user:
// users 6-15: $15 | 16-25: $10 | 26-29: $7 | 30+: $4
// Annual = 12 months less 20%.

export const BASE = 299;
export const INCLUDED_USERS = 5;
export const MIN_USERS = 1;
export const MAX_USERS = 50;
export const ANNUAL_DISCOUNT = 0.2;

export function clampUsers(n) {
  const v = Math.round(Number(n));
  if (!Number.isFinite(v)) return INCLUDED_USERS;
  return Math.min(MAX_USERS, Math.max(MIN_USERS, v));
}

export function monthlyTotal(users) {
  let total = BASE;
  if (users > 5) total += (Math.min(users, 15) - 5) * 15;
  if (users > 15) total += (Math.min(users, 25) - 15) * 10;
  if (users > 25) total += (Math.min(users, 29) - 25) * 7;
  if (users > 29) total += (users - 29) * 4;
  return total;
}

// What is charged each billing period, in whole dollars.
export function periodPrice(users, annual) {
  const m = monthlyTotal(clampUsers(users));
  return annual ? Math.round(m * 12 * (1 - ANNUAL_DISCOUNT)) : m;
}

// The per-month figure shown on the page.
export function shownMonthly(users, annual) {
  const m = monthlyTotal(clampUsers(users));
  return annual ? Math.round(m * (1 - ANNUAL_DISCOUNT)) : m;
}

export const fmt = (n) => n.toLocaleString('en-CA', { maximumFractionDigits: 0 });
