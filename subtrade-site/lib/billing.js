// Self-serve billing on subtradesoftware.com/billing/ — our own layout, Stripe
// does the work underneath. Used by the /api/billing/* routes (server only).
//
// Who is asking: the customer types their email, we email a signed one-time
// link (30 minutes for the email link, 60 minutes for the page it opens).
// Nothing is changed without a valid token.

import crypto from 'node:crypto';
import { clampUsers, periodPrice, fmt, MAX_USERS } from './pricing';
import { ghl, LOCATION_ID, toGhl, STAGES } from './stripeGhl';

const STRIPE = 'https://api.stripe.com/v1';
const LIVE_STATUSES = ['trialing', 'active', 'past_due'];

// The save offer: an extra 20% off for the next 12 months (on a yearly plan,
// that is the next yearly charge). One coupon, created on first use.
export const SAVE_COUPON = { id: 'SAVE20-12M', percent_off: 20, months: 12, label: 'an extra 20% off for your next 12 months' };

export const REASONS = {
  too_expensive: 'Too expensive',
  missing_features: 'Missing a feature we need',
  switched_service: 'Switching to another tool',
  unused: 'Not using it enough',
  too_complex: 'Too hard to set up or use',
  other: 'Something else',
};

/* ---------------- Stripe ---------------- */

async function stripe(path, { method = 'GET', form } = {}) {
  const res = await fetch(`${STRIPE}/${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      ...(form ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
    },
    body: form ? new URLSearchParams(form) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) console.error('[billing] stripe', method, path, res.status, data?.error?.message);
  return res.ok ? data : null;
}

// Same as stripe() but keeps Stripe's error (e.g. a declined card).
async function stripeTry(path, form) {
  const res = await fetch(`${STRIPE}/${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(form),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) console.error('[billing] stripe POST', path, res.status, data?.error?.message);
  return { ok: res.ok, data, card: data?.error?.type === 'card_error' };
}

const cardMessage = (data) =>
  `Your card was declined${data?.error?.decline_code ? ` (${data.error.decline_code.replace(/_/g, ' ')})` : ''}. Nothing was charged and nothing changed. Update your card and try again.`;

// Ending a trial now: Stripe charges the first period immediately; if the card
// fails, Stripe rejects the change and the trial carries on untouched.
const END_TRIAL_NOW = { trial_end: 'now', payment_behavior: 'error_if_incomplete', proration_behavior: 'none' };

// The customer's current subscription (newest live one), with card and discount.
export async function findSubscription(email) {
  const list = await stripe(`customers?email=${encodeURIComponent(email)}&limit=10`);
  for (const c of list?.data || []) {
    const subs = await stripe(
      `subscriptions?customer=${c.id}&status=all&limit=10&expand[]=data.default_payment_method&expand[]=data.discounts`,
    );
    const live = (subs?.data || []).filter((s) => LIVE_STATUSES.includes(s.status)).sort((a, b) => b.created - a.created);
    if (live[0]) return { customer: c, sub: live[0] };
  }
  return null;
}

async function getSub(subId) {
  return stripe(
    `subscriptions/${subId}?expand[]=default_payment_method&expand[]=customer&expand[]=discounts&expand[]=items.data.price.product`,
  );
}

async function ensureCoupon() {
  const have = await stripe(`coupons/${SAVE_COUPON.id}`);
  if (have) return have.id;
  const made = await stripe('coupons', {
    method: 'POST',
    form: {
      id: SAVE_COUPON.id,
      percent_off: String(SAVE_COUPON.percent_off),
      duration: 'repeating',
      duration_in_months: String(SAVE_COUPON.months),
      name: 'Stay with SubTrade: 20% off, 12 months', // Stripe max 40 chars
    },
  });
  return made?.id || null;
}

const hasSaveCoupon = (sub) =>
  (sub.discounts || []).some((d) => d?.coupon?.id === SAVE_COUPON.id || d?.source?.coupon === SAVE_COUPON.id) ||
  sub.metadata?.save_offer === 'accepted';

/* ---------------- signed links ---------------- */

// Key derived from the Stripe secret, so no extra setting is needed and test
// links never work against live (different keys).
const key = () => crypto.createHash('sha256').update(`billing-link:${process.env.STRIPE_SECRET_KEY || ''}`).digest();
const b64 = (b) => Buffer.from(b).toString('base64url');

export function signToken(payload, minutes) {
  const body = b64(JSON.stringify({ ...payload, exp: Date.now() + minutes * 60e3 }));
  const sig = b64(crypto.createHmac('sha256', key()).update(body).digest());
  return `${body}.${sig}`;
}

export function readToken(token) {
  if (typeof token !== 'string' || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  const want = b64(crypto.createHmac('sha256', key()).update(body).digest());
  if (sig.length !== want.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(want))) return null;
  try {
    const p = JSON.parse(Buffer.from(body, 'base64url').toString());
    return p.exp > Date.now() ? p : null;
  } catch {
    return null;
  }
}

// One-time email links: each link carries a random nonce that is also saved on
// the subscription. Opening the link clears it, and asking for a new link
// replaces it, so an old or already-used link never works again.
export async function issueLinkNonce(subId) {
  const nonce = crypto.randomBytes(16).toString('hex');
  const ok = await stripe(`subscriptions/${subId}`, { method: 'POST', form: { 'metadata[billing_link]': nonce } });
  return ok ? nonce : null;
}

export async function consumeLinkNonce(sub, nonce) {
  if (!nonce || sub.metadata?.billing_link !== nonce) return false;
  await stripe(`subscriptions/${sub.id}`, { method: 'POST', form: { 'metadata[billing_link]': '' } });
  return true;
}

/* ---------------- what the page shows ---------------- */

const day = (unix) =>
  unix ? new Date(unix * 1000).toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/Edmonton' }) : null;

// Newer Stripe API versions moved the period end onto the items.
const periodEnd = (sub) => sub.current_period_end || sub.items?.data?.[0]?.current_period_end;

export function summarize(sub) {
  const item = sub.items?.data?.[0];
  const price = item?.price || {};
  const pm = sub.default_payment_method;
  const trial = sub.status === 'trialing';
  const nextDate = trial ? sub.trial_end : periodEnd(sub);
  return {
    status: sub.status,
    trial,
    plan: sub.metadata?.plan || (price.recurring?.interval === 'year' ? 'yearly' : 'monthly'),
    users: Number(sub.metadata?.users) || null,
    name: price.product?.name || null,
    amount: price.unit_amount ? price.unit_amount / 100 : null,
    interval: price.recurring?.interval || 'month',
    next_date: day(nextDate),
    cancel_at_period_end: !!sub.cancel_at_period_end,
    ends_on: sub.cancel_at_period_end ? day(sub.cancel_at || nextDate) : null,
    card: pm?.card ? { brand: pm.card.brand, last4: pm.card.last4, exp: `${pm.card.exp_month}/${String(pm.card.exp_year).slice(-2)}` } : null,
    save_offer_used: hasSaveCoupon(sub),
    offer: SAVE_COUPON.label,
    period_start: sub.current_period_start || item?.current_period_start || null,
    period_end: periodEnd(sub) || null,
    trial_start: sub.trial_start || null,
    trial_end: sub.trial_end || null,
    email: sub.customer?.email || null,
    company: sub.metadata?.company || sub.customer?.name || null,
  };
}

// Last invoices for the billing history (Stripe-hosted invoice/receipt links).
export async function listInvoices(sub) {
  const customer = sub.customer?.id || sub.customer;
  const r = await stripe(`invoices?customer=${customer}&limit=6`);
  return (r?.data || [])
    .filter((i) => i.status !== 'draft')
    .map((i) => ({
      id: i.id,
      number: i.number,
      date: day(i.created),
      total: i.total / 100,
      status: i.status === 'paid' ? (i.total === 0 ? 'Free trial' : 'Paid') : i.status === 'open' ? 'Due' : i.status,
      url: i.hosted_invoice_url || null,
    }));
}

/* ---------------- team alerts ---------------- */

// SubTrade accounts don't read Stripe yet, so anything that changes what a
// customer has (users, paid/cancelled) must reach the people who update the
// app, right away: an email to each address and a text to each phone.
// Override with BILLING_ALERT_EMAILS / BILLING_ALERT_PHONES (comma-separated).
// TESTING: Fabian only. At launch add Steban: cvargas024@gmail.com / +14033053853.
const ALERT_EMAILS = (process.env.BILLING_ALERT_EMAILS || 'info@qualitygypsum.ca')
  .split(',').map((x) => x.trim()).filter(Boolean);
const ALERT_PHONES = (process.env.BILLING_ALERT_PHONES || '+14038092908')
  .split(',').map((x) => x.trim()).filter(Boolean);

async function alertTeam(subIn, { title, action, details = [] }) {
  if (!process.env.GHL_PRIVATE_TOKEN) return;
  // Re-read so the alert shows the plan as it is now (after the change).
  const sub =
    (await stripe(
      `subscriptions/${subIn.id}?expand[]=customer&expand[]=customer.tax_ids&expand[]=discounts&expand[]=items.data.price.product&expand[]=default_payment_method`,
    )) || subIn;
  const c = typeof sub.customer === 'object' && sub.customer ? sub.customer : {};
  const m = sub.metadata || {};
  const s = summarize(sub);

  const company = m.company || c.name || '—';
  const contact = [m.first_name, m.last_name].filter(Boolean).join(' ') || c.name || '—';
  const email = c.email || '—';
  const phone = m.phone || c.phone || '—';
  const a = c.address || {};
  const address = [a.line1, a.line2, a.city, a.state, a.postal_code, a.country].filter(Boolean).join(', ') || '—';
  const taxIds = (c.tax_ids?.data || []).map((t) => `${t.type.replace(/_/g, ' ').toUpperCase()} ${t.value}`).join(', ') || '—';
  const per = s.interval === 'year' ? 'year' : 'month';
  const amount = s.amount != null ? `$${(s.save_offer_used ? s.amount * 0.8 : s.amount).toFixed(2)} CAD + tax / ${per}${s.save_offer_used ? ' (20% stay discount)' : ''}` : '—';
  const status = s.cancel_at_period_end ? `Cancelling — access until ${s.ends_on}` : s.trial ? `Free trial — first charge ${s.next_date}` : s.status === 'past_due' ? 'Payment overdue' : `Active — next charge ${s.next_date}`;

  const card = s.card ? `${s.card.brand.toUpperCase()} •••• ${s.card.last4} · exp ${s.card.exp}` : 'No card on file';
  const stripeUrl = `https://dashboard.stripe.com/${sub.livemode ? '' : 'test/'}subscriptions/${sub.id}`;
  let ghlUrl = null;
  if (c.email) {
    const up = await ghl('/contacts/upsert', 'POST', { locationId: LOCATION_ID, email: c.email });
    if (up?.contact?.id) ghlUrl = `https://app.gohighlevel.com/v2/location/${LOCATION_ID}/contacts/detail/${up.contact.id}`;
  }

  const esc = (v) => String(v).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]);
  const font = "font-family:'Barlow',Arial,Helvetica,sans-serif;";
  const cond = "font-family:'Barlow Condensed','Arial Narrow',Arial,sans-serif;";
  const row = (k, v) =>
    `<tr><td style="${font}padding:7px 0;font-size:13px;color:#6b7280;width:38%;vertical-align:top;border-top:1px solid #eef1f5;">${k}</td><td style="${font}padding:7px 0;font-size:14px;color:#0A1628;font-weight:600;border-top:1px solid #eef1f5;">${esc(v)}</td></tr>`;
  const block = (label, rows) =>
    `<p style="${cond}margin:22px 0 6px;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#E8732A;">${label}</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>`;
  const button = (href, text, solid) =>
    `<td align="center" bgcolor="${solid ? '#E8732A' : '#ffffff'}" style="border-radius:6px;${solid ? 'background:#E8732A;' : 'border:1px solid #0A1628;'}"><a href="${href}" target="_blank" style="${cond}display:inline-block;padding:12px 22px;font-size:14px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${solid ? '#ffffff' : '#0A1628'};text-decoration:none;">${text}</a></td>`;

  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Billing alert</title>
<style>@import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700&family=Barlow+Condensed:wght@700;800&display=swap');
@media only screen and (max-width:600px){.px{padding-left:20px!important;padding-right:20px!important}}</style></head>
<body style="margin:0;padding:0;background:#e8edf3;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#e8edf3;"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;background:#ffffff;border-radius:14px;overflow:hidden;">
  <tr><td align="center" class="px" style="background:#0A1628;padding:24px 48px 20px;">
    <img src="${LOGO}" alt="SubTrade Software" width="130" style="display:block;width:130px;max-width:130px;height:auto;border:0;">
    <p style="${font}margin:8px 0 0;font-size:10px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.4);">Internal · Billing alert</p>
  </td></tr>
  <tr><td align="center" class="px" style="background:#E8732A;background-image:linear-gradient(135deg,#E8732A 0%,#c95e1a 100%);padding:26px 48px 22px;">
    <span style="${font}display:inline-block;background:rgba(255,255,255,0.2);color:#ffffff;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;padding:5px 14px;border-radius:20px;margin-bottom:10px;">${esc(company)}</span>
    <h1 style="${cond}margin:0;font-size:32px;line-height:1.1;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#ffffff;">${esc(title)}</h1>
  </td></tr>
  <tr><td class="px" style="padding:26px 48px 0;">
    <div style="${font}background:#fff4ec;border-left:4px solid #E8732A;border-radius:0 8px 8px 0;padding:14px 18px;font-size:15px;line-height:1.55;color:#0A1628;"><b>To do:</b> ${esc(action)}</div>
    ${block('Company', row('Company', company) + row('Contact', contact) + row('Email', email) + row('Phone', phone) + row('Billing address', address) + row('Tax number', taxIds))}
    ${block('Plan', row('Users', s.users || '—') + row('Billing', s.plan === 'yearly' ? 'Yearly' : 'Monthly') + row('Amount', amount) + row('Status', status) + row('Card on file', card) + details.map((d) => row('Change', d)).join(''))}
    ${block('Reference', row('Stripe customer', c.id || sub.customer) + row('Stripe subscription', sub.id))}
  </td></tr>
  <tr><td align="center" class="px" style="padding:24px 48px 30px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${button(stripeUrl, 'Open in Stripe', true)}${ghlUrl ? `<td width="10">&nbsp;</td>${button(ghlUrl, 'Open in GoHighLevel', false)}` : ''}</tr></table>
  </td></tr>
  <tr><td align="center" style="background:#0A1628;padding:18px 48px 20px;">
    <p style="${font}margin:0;font-size:11px;line-height:1.7;color:rgba(255,255,255,0.4);">Sent automatically by subtradesoftware.com/billing to the SubTrade team.<br>&copy; ${new Date().getFullYear()} SubTrade Software Ltd.</p>
  </td></tr>
</table></td></tr></table></body></html>`;

  const sms = [
    `SubTrade billing alert: ${title}`,
    `${company} — ${contact}`,
    `${phone} · ${email}`,
    `${s.users || '?'} users, ${amount.replace(' CAD + tax', '')}`,
    `Card: ${card}`,
    `To do: ${action}`,
  ].join('\n').slice(0, 480);

  for (const to of ALERT_EMAILS) {
    // No tags here: tags on /contacts/upsert REPLACE the contact's tags.
    const up = await ghl('/contacts/upsert', 'POST', { locationId: LOCATION_ID, email: to });
    const id = up?.contact?.id;
    if (id) await ghl('/conversations/messages', 'POST', { type: 'Email', contactId: id, subject: `Billing alert: ${title} — ${company}`, html }, '2021-04-15');
  }
  for (const to of ALERT_PHONES) {
    const up = await ghl('/contacts/upsert', 'POST', { locationId: LOCATION_ID, phone: to });
    const id = up?.contact?.id;
    if (id) await ghl('/conversations/messages', 'POST', { type: 'SMS', contactId: id, message: sms }, '2021-04-15');
  }
}

/* ---------------- actions ---------------- */

async function noteToGhl(sub, { tags, note, task, stage, status }) {
  const email = (sub.customer?.email || '').toLowerCase();
  if (!email || !process.env.GHL_PRIVATE_TOKEN) return;
  const r = await toGhl({ email, meta: sub.metadata || {}, tags, note, stage, status });
  if (task && r?.ok) {
    const up = await ghl('/contacts/upsert', 'POST', { locationId: LOCATION_ID, email });
    const id = up?.contact?.id;
    if (id) {
      await ghl(`/contacts/${id}/tasks`, 'POST', {
        title: task.title,
        body: task.body,
        dueDate: task.due,
        completed: false,
      });
    }
  }
}

export async function loadFromToken(token) {
  const p = readToken(token);
  if (!p?.sub) return null;
  const sub = await getSub(p.sub);
  if (!sub || (p.cus && (sub.customer?.id || sub.customer) !== p.cus)) return null;
  return sub;
}

export async function acceptOffer(sub, { reason, comment }) {
  if (hasSaveCoupon(sub)) return { ok: false, error: 'This offer was already used on your subscription.' };
  const coupon = await ensureCoupon();
  const fallback = async (why) => {
    // Never leave someone who said "yes, I'll stay" with an error: keep them,
    // and flag it so we apply the discount by hand.
    await stripe(`subscriptions/${sub.id}`, {
      method: 'POST',
      form: { cancel_at_period_end: 'false', 'metadata[save_offer]': 'requested' },
    });
    await noteToGhl(sub, {
      tags: ['save-offer-manual'],
      note: `Took the save offer (${SAVE_COUPON.label}) but it could not be applied automatically (${why}). APPLY THE 20% DISCOUNT BY HAND in Stripe.
Reason: ${REASONS[reason] || reason || '-'}${comment ? `
Comment: ${comment}` : ''}`,
      task: {
        title: 'Apply the 20% stay discount by hand',
        body: `They accepted the save offer on the website, but Stripe did not apply it (${why}). Add coupon ${SAVE_COUPON.id} to their subscription in Stripe.`,
        due: new Date(Date.now() + 864e5).toISOString(),
      },
    });
    await alertTeam(sub, {
      title: 'Apply the 20% stay discount by hand',
      action: `In Stripe, add coupon ${SAVE_COUPON.id} to subscription ${sub.id}.`,
      details: [`Reason it failed: ${why}`],
    });
    return { ok: true, manual: true };
  };
  if (!coupon) return fallback('coupon not available');
  // During the free trial, taking the offer starts the paid plan now: the
  // trial ends and the first (discounted) period is charged today.
  const trial = sub.status === 'trialing';
  const r = await stripeTry(`subscriptions/${sub.id}`, {
    'discounts[0][coupon]': coupon,
    cancel_at_period_end: 'false',
    'metadata[save_offer]': 'accepted',
    'metadata[save_reason]': reason || '',
    ...(trial ? END_TRIAL_NOW : {}),
  });
  if (r.card) return { ok: false, error: cardMessage(r.data) };
  if (!r.ok) return fallback('subscription update failed');
  const why = `Reason: ${REASONS[reason] || reason || '-'}${comment ? `\nComment: ${comment}` : ''}`;
  await noteToGhl(sub, {
    tags: trial ? ['save-offer-accepted', 'paying-customer'] : ['save-offer-accepted'],
    note: trial
      ? `Tried to cancel during the trial, took the save offer (${SAVE_COUPON.label}). Trial ended and the first discounted charge was taken today.\n${why}`
      : `Tried to cancel, took the save offer (${SAVE_COUPON.label}).\n${why}`,
    ...(trial ? { stage: STAGES.won, status: 'won' } : {}),
  });
  if (trial) {
    await alertTeam(sub, {
      title: 'Took the stay offer: trial ended, now paying',
      action: `Make sure their SubTrade account is set as paid with ${sub.metadata?.users || '?'} users.`,
      details: [`Plan: ${sub.metadata?.price || '?'} CAD with 20% off for 12 months`, why.replace(/\n/g, ' · ')],
    });
  }
  return { ok: true, charged: trial };
}

// Change users and/or billing period (self-serve, Fair Billing Policy 4.x):
//   more users, or monthly -> yearly: now, prorated difference charged today
//   fewer users: the lower price applies from the next renewal, no refund
//   yearly -> monthly: not self-serve (yearly is paid up front)
//   during the trial: just updates what will be charged when it ends
export async function changePlan(sub, { users, plan }) {
  const item = sub.items?.data?.[0];
  if (!item) return { ok: false, error: 'Could not read your plan.' };
  const curAnnual = item.price?.recurring?.interval === 'year';
  const curUsers = Number(sub.metadata?.users) || null;
  const annual = plan === 'yearly';
  const u = clampUsers(users);
  if (Number(users) > MAX_USERS) return { ok: false, error: `For more than ${MAX_USERS} users, email support@subtradesoftware.com and we'll set it up.` };
  if (curAnnual && !annual) return { ok: false, error: 'Switching from yearly to monthly happens at your renewal. Email support@subtradesoftware.com and we will set it up.' };
  if (u === curUsers && annual === curAnnual) return { ok: false, error: 'That is already your plan.' };

  const amount = periodPrice(u, annual);
  const trial = sub.status === 'trialing';
  const upgrade = annual !== curAnnual || amount > (item.price?.unit_amount || 0) / 100;
  const product = typeof item.price?.product === 'string' ? item.price.product : item.price?.product?.id;
  const usersText = `${u} ${u === 1 ? 'user' : 'users'}`;
  const priceText = `$${fmt(amount)}/${annual ? 'year' : 'month'}`;

  const form = {
    'items[0][id]': item.id,
    'items[0][price_data][currency]': 'cad',
    'items[0][price_data][product]': product,
    'items[0][price_data][unit_amount]': String(amount * 100),
    'items[0][price_data][recurring][interval]': annual ? 'year' : 'month',
    'items[0][price_data][tax_behavior]': 'exclusive',
    'metadata[users]': String(u),
    'metadata[plan]': annual ? 'yearly' : 'monthly',
    'metadata[price]': priceText,
    proration_behavior: trial || !upgrade ? 'none' : 'always_invoice',
    payment_behavior: 'error_if_incomplete',
  };
  if (!trial && annual && !curAnnual) form.billing_cycle_anchor = 'now'; // yearly starts today
  // Checkout's inline prices leave the product "inactive", and Stripe won't
  // attach a new price to an inactive product, so switch it back on (and
  // rename it to the new plan) first.
  if (product) {
    await stripe(`products/${product}`, {
      method: 'POST',
      form: { active: 'true', name: `SubTrade · ${usersText} · billed ${annual ? 'yearly (20% off)' : 'monthly'}` },
    });
  }
  const r = await stripeTry(`subscriptions/${sub.id}`, form);
  if (r.card) return { ok: false, error: cardMessage(r.data) };
  if (!r.ok) return { ok: false, error: 'Could not change your plan. Please email support@subtradesoftware.com.' };

  const before = `${curUsers || '?'} users, $${fmt((item.price?.unit_amount || 0) / 100)}/${curAnnual ? 'year' : 'month'}`;
  await noteToGhl(sub, {
    tags: [upgrade ? 'plan-upgraded' : 'plan-downgraded', `plan-${annual ? 'yearly' : 'monthly'}`],
    note: `Changed plan on the website: ${before} → ${usersText}, ${priceText} CAD.${
      trial ? ' (During the free trial, no charge yet.)' : upgrade ? ' Prorated difference charged today.' : ' Lower price applies from the next renewal.'
    }`,
  });
  await alertTeam(sub, {
    title: `Plan changed to ${usersText}`,
    action: curUsers && curUsers !== u
      ? `Update their user count in SubTrade from ${curUsers} to ${u}${u > curUsers ? ' now' : ' (they keep access until renewal)'}.`
      : `Billing switched to ${annual ? 'yearly' : 'monthly'} — check their account plan in SubTrade.`,
    details: [
      `Before: ${before}`,
      `After: ${usersText}, ${priceText} CAD`,
      trial ? 'During the free trial (no charge yet)' : upgrade ? 'Prorated difference charged today' : `Lower price from the next renewal`,
    ],
  });
  return { ok: true, charged: !trial && upgrade };
}

// "Start my paid plan now" during the free trial: full price, charged today.
export async function startPaidNow(sub) {
  if (sub.status !== 'trialing') return { ok: false, error: 'Your paid plan is already running.' };
  const r = await stripeTry(`subscriptions/${sub.id}`, { ...END_TRIAL_NOW, cancel_at_period_end: 'false', 'metadata[started_early]': 'website' });
  if (r.card) return { ok: false, error: cardMessage(r.data) };
  if (!r.ok) return { ok: false, error: 'Could not start your plan. Please email support@subtradesoftware.com.' };
  await noteToGhl(sub, {
    tags: ['paying-customer', 'started-early'],
    note: 'Ended the free trial early on the website and started the paid plan. First charge taken today.',
    stage: STAGES.won,
    status: 'won',
  });
  await alertTeam(sub, {
    title: 'Trial ended early: now a paying customer',
    action: `Make sure their SubTrade account is set as paid with ${sub.metadata?.users || '?'} users.`,
    details: [`Plan: ${sub.metadata?.price || '?'} CAD, ${sub.metadata?.users || '?'} users`],
  });
  return { ok: true };
}

export async function cancelAtPeriodEnd(sub, { reason, comment }) {
  const form = {
    cancel_at_period_end: 'true',
    'metadata[cancel_reason]': reason || '',
  };
  if (REASONS[reason] && reason !== 'other') form['cancellation_details[feedback]'] = reason;
  else form['cancellation_details[feedback]'] = 'other';
  if (comment) form['cancellation_details[comment]'] = comment.slice(0, 500);
  const updated = await stripe(`subscriptions/${sub.id}`, { method: 'POST', form });
  if (!updated) return { ok: false, error: 'Could not cancel. Please email support@subtradesoftware.com.' };
  const fresh = await getSub(sub.id);
  const s = summarize(fresh || updated);
  const endUnix = updated.cancel_at || (updated.status === 'trialing' ? updated.trial_end : periodEnd(updated));
  await noteToGhl(fresh || sub, {
    tags: ['cancel-requested'],
    note: `Cancelled on the website. Access ends ${s.ends_on || day(endUnix)}${updated.status === 'trialing' ? ' (during the free trial, so no charge)' : ''}.\nReason: ${REASONS[reason] || reason || '-'}${comment ? `\nComment: ${comment}` : ''}\nThey declined the save offer.`,
    task: {
      title: 'Call before their SubTrade access ends',
      body: `Cancelled on the website. Reason: ${REASONS[reason] || reason || '-'}. Access ends ${s.ends_on || day(endUnix)}. They can undo from the billing page, or you can reactivate in Stripe.`,
      due: new Date(Date.now() + 864e5).toISOString(),
    },
  });
  await alertTeam(fresh || sub, {
    title: 'Cancelled their subscription',
    action: `Call them before ${s.ends_on || day(endUnix)}. On that date, close or downgrade their SubTrade account.`,
    details: [`Reason: ${REASONS[reason] || reason || '-'}`, ...(comment ? [`Comment: ${comment}`] : []), `Access ends: ${s.ends_on || day(endUnix)}`],
  });
  return { ok: true, summary: s };
}

export async function undoCancel(sub) {
  const updated = await stripe(`subscriptions/${sub.id}`, { method: 'POST', form: { cancel_at_period_end: 'false' } });
  if (!updated) return { ok: false, error: 'Could not undo. Please email support@subtradesoftware.com.' };
  await noteToGhl(sub, { tags: ['cancel-undone'], note: 'Undid their cancellation on the website. Subscription continues.' });
  await alertTeam(sub, { title: 'Undid their cancellation', action: 'No account change needed. Their subscription continues.' });
  const fresh = await getSub(sub.id);
  return { ok: true, summary: summarize(fresh || updated) };
}

// Stripe's own secure page for changing the card (needs the Customer Portal
// switched on in Stripe → Settings → Billing → Customer portal).
export async function cardUpdateUrl(sub, returnUrl) {
  const s = await stripe('billing_portal/sessions', {
    method: 'POST',
    form: {
      customer: sub.customer?.id || sub.customer,
      return_url: returnUrl,
      'flow_data[type]': 'payment_method_update',
      'flow_data[after_completion][type]': 'redirect',
      'flow_data[after_completion][redirect][return_url]': returnUrl,
    },
  });
  return s?.url || null;
}

/* ---------------- the email with the link ---------------- */

export async function emailLink(email, link) {
  if (!process.env.GHL_PRIVATE_TOKEN) return false;
  const up = await ghl('/contacts/upsert', 'POST', { locationId: LOCATION_ID, email });
  const id = up?.contact?.id;
  if (!id) return false;
  const html = billingEmailHtml(link);
  const sent = await ghl(
    '/conversations/messages',
    'POST',
    { type: 'Email', contactId: id, subject: 'Your SubTrade billing link', html, emailFrom: 'SubTrade Software <support@subtradesoftware.com>' },
    '2021-04-15',
  );
  return !!sent;
}

// Branded like SubTrade's product emails (navy header + logo, orange band,
// Barlow, navy footer). Styles are inline so Gmail and Outlook keep them.
// Transactional (the person asked for it), so no unsubscribe link.
const LOGO = 'https://assets.cdn.filesafe.space/tvaEDkrxBWUrDUqzetBb/media/69d663795075bef1bf313b01.png';
function billingEmailHtml(link) {
  const font = "font-family:'Barlow',Arial,Helvetica,sans-serif;";
  const cond = "font-family:'Barlow Condensed','Arial Narrow',Arial,sans-serif;";
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Your SubTrade billing link</title>
<style>@import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700&family=Barlow+Condensed:wght@700;800&display=swap');
@media only screen and (max-width:600px){.px{padding-left:20px!important;padding-right:20px!important}.h1{font-size:32px!important}}</style></head>
<body style="margin:0;padding:0;background:#e8edf3;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#e8edf3;"><tr><td align="center" style="padding:40px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;background:#ffffff;border-radius:14px;overflow:hidden;">
  <tr><td align="center" class="px" style="background:#0A1628;padding:30px 48px 26px;">
    <img src="${LOGO}" alt="SubTrade Software" width="150" style="display:block;width:150px;max-width:150px;height:auto;border:0;">
    <p style="${font}margin:8px 0 0;font-size:10px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.4);">Built for Subcontractors</p>
  </td></tr>
  <tr><td align="center" class="px" style="background:#E8732A;background-image:linear-gradient(135deg,#E8732A 0%,#c95e1a 100%);padding:34px 48px 30px;">
    <span style="${font}display:inline-block;background:rgba(255,255,255,0.2);color:#ffffff;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;padding:5px 14px;border-radius:20px;margin-bottom:14px;">&#128274; Account &middot; Billing</span>
    <h1 class="h1" style="${cond}margin:0 0 10px;font-size:42px;line-height:1.05;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#ffffff;">Manage your<br>subscription</h1>
    <p style="${font}margin:0;font-size:15px;line-height:1.6;color:rgba(255,255,255,0.88);">Your secure link is ready. It works for 30 minutes.</p>
  </td></tr>
  <tr><td class="px" style="padding:36px 48px 0;">
    <p style="${font}margin:0 0 14px;font-size:16px;font-weight:600;color:#0A1628;">Hi there &#128075;</p>
    <p style="${font}margin:0 0 20px;font-size:15px;line-height:1.75;color:#374151;">You asked to manage your SubTrade subscription. Use the button below to see your plan and next charge, update your card, or make changes.</p>
  </td></tr>
  <tr><td align="center" class="px" style="padding:8px 48px 32px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" bgcolor="#E8732A" style="border-radius:6px;background:#E8732A;">
      <a href="${link}" target="_blank" style="${cond}display:inline-block;padding:16px 44px;font-size:17px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#ffffff;text-decoration:none;">Manage my subscription</a>
    </td></tr></table>
    <p style="${font}margin:12px 0 0;font-size:11px;color:#9ca3af;">For your security this link expires in 30 minutes. You can always ask for a new one at subtradesoftware.com/billing</p>
  </td></tr>
  <tr><td class="px" style="padding:0 48px;"><div style="height:1px;background:#e8ecf0;line-height:1px;font-size:1px;">&nbsp;</div></td></tr>
  <tr><td class="px" style="padding:26px 48px 30px;">
    <p style="${font}margin:0;font-size:14px;line-height:1.75;color:#374151;">Didn't ask for this? You can ignore this email. Nothing changes unless you use the link.</p>
    <p style="${font}margin:14px 0 0;font-size:14px;line-height:1.75;color:#374151;">&#128172; Questions about your bill? Just reply. It comes straight to us, not a ticket queue.</p>
    <p style="${font}margin:18px 0 2px;font-size:14px;font-weight:700;color:#0A1628;">The SubTrade Team</p>
    <p style="${font}margin:0;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#E8732A;">SubTrade Software Ltd.</p>
  </td></tr>
  <tr><td align="center" style="background:#0A1628;padding:28px 48px 8px;">
    <img src="${LOGO}" alt="SubTrade Software" width="120" style="display:block;width:120px;max-width:120px;height:auto;border:0;margin:0 auto;">
  </td></tr>
  <tr><td align="center" style="background:#0A1628;padding:4px 48px 10px;">
    <p style="${font}margin:0;font-size:11px;line-height:1.7;color:rgba(255,255,255,0.35);">Calgary, Alberta, Canada<br>You are receiving this because someone asked for a billing link for this email address.</p>
  </td></tr>
  <tr><td align="center" style="background:#0A1628;padding:10px 48px 8px;">
    <a href="https://subtradesoftware.com/fair-billing-policy/" style="${font}font-size:11px;font-weight:700;color:rgba(255,255,255,0.5);text-decoration:underline;">Fair Billing Policy</a>
    &nbsp;&nbsp;&nbsp;
    <a href="https://subtradesoftware.com/privacy-policy/" style="${font}font-size:11px;font-weight:700;color:rgba(255,255,255,0.5);text-decoration:underline;">Privacy Policy</a>
  </td></tr>
  <tr><td align="center" style="background:#0A1628;padding:4px 48px 24px;">
    <p style="${font}margin:0;font-size:10px;color:rgba(255,255,255,0.25);">&copy; ${new Date().getFullYear()} SubTrade Software Ltd. All Rights Reserved.</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}
