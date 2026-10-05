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

// Line-by-line price for a team size, matching monthlyTotal/periodPrice.
// Returns { lines: [{label, detail, amount}], monthly, period, annual }.
export const TIERS = [
  { from: 6, to: 15, rate: 15 },
  { from: 16, to: 25, rate: 10 },
  { from: 26, to: 29, rate: 7 },
  { from: 30, to: Infinity, rate: 4 },
];

export function priceBreakdown(users, annual) {
  const u = clampUsers(users);
  const lines = [{ label: 'SubTrade, complete platform', detail: `includes ${INCLUDED_USERS} users`, amount: BASE }];
  for (const t of TIERS) {
    if (u < t.from) break;
    const n = Math.min(u, t.to) - t.from + 1;
    lines.push({
      label: Math.min(u, t.to) === t.from ? `User ${t.from}` : `Users ${t.from}–${Math.min(u, t.to)}`,
      detail: `${n} × $${t.rate}`,
      amount: n * t.rate,
    });
  }
  const monthly = monthlyTotal(u);
  return { users: u, lines, monthly, annual, period: periodPrice(u, annual) };
}
