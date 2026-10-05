// Self-serve billing on subtradesoftware.com/billing/ — our own layout, Stripe
// does the work underneath. Used by the /api/billing/* routes (server only).
//
// Who is asking: the customer types their email, we email a signed one-time
// link (30 minutes for the email link, 60 minutes for the page it opens).
// Nothing is changed without a valid token.

import crypto from 'node:crypto';
import { ghl, LOCATION_ID, toGhl } from './stripeGhl';

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
      name: 'Stay with SubTrade: extra 20% off for 12 months',
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
  };
}

/* ---------------- actions ---------------- */

async function noteToGhl(sub, { tags, note, task }) {
  const email = (sub.customer?.email || '').toLowerCase();
  if (!email || !process.env.GHL_PRIVATE_TOKEN) return;
  const r = await toGhl({ email, meta: sub.metadata || {}, tags, note });
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
  if (!coupon) return { ok: false, error: 'Could not apply the offer.' };
  const updated = await stripe(`subscriptions/${sub.id}`, {
    method: 'POST',
    form: {
      'discounts[0][coupon]': coupon,
      cancel_at_period_end: 'false',
      'metadata[save_offer]': 'accepted',
      'metadata[save_reason]': reason || '',
    },
  });
  if (!updated) return { ok: false, error: 'Could not apply the offer.' };
  await noteToGhl(sub, {
    tags: ['save-offer-accepted'],
    note: `Tried to cancel, took the save offer (${SAVE_COUPON.label}).\nReason: ${REASONS[reason] || reason || '-'}${comment ? `\nComment: ${comment}` : ''}`,
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
  return { ok: true, summary: s };
}

export async function undoCancel(sub) {
  const updated = await stripe(`subscriptions/${sub.id}`, { method: 'POST', form: { cancel_at_period_end: 'false' } });
  if (!updated) return { ok: false, error: 'Could not undo. Please email support@subtradesoftware.com.' };
  await noteToGhl(sub, { tags: ['cancel-undone'], note: 'Undid their cancellation on the website. Subscription continues.' });
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
  const html = `
<div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.5;color:#15181c;max-width:520px">
  <p>Hi,</p>
  <p>Here is your secure link to manage your SubTrade subscription. It works for 30 minutes.</p>
  <p><a href="${link}" style="display:inline-block;background:#e8542b;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:4px">Manage my subscription</a></p>
  <p style="font-size:13px;color:#585d64">If you didn't ask for this, you can ignore this email. Nothing changes unless you use the link.</p>
  <p style="font-size:13px;color:#585d64">SubTrade Software Ltd · Calgary, Alberta · support@subtradesoftware.com</p>
</div>`;
  const sent = await ghl(
    '/conversations/messages',
    'POST',
    { type: 'Email', contactId: id, subject: 'Your SubTrade billing link', html, emailFrom: 'SubTrade Software <support@subtradesoftware.com>' },
    '2021-04-15',
  );
  return !!sent;
}
