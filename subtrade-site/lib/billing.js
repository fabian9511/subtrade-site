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
