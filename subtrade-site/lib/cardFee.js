// Credit card processing fee (surcharge) for online subscriptions.
//
// SWITCHED OFF until NEXT_PUBLIC_CARD_FEE=on is set in Vercel. Before turning
// it on (Canadian card rules + Fair Billing Policy 3.6):
//   1. Notify Mastercard (mastercard.ca/surchargedisclosure) and Visa (through
//      Stripe, the acquirer) at least 30 days ahead.
//   2. Email existing online subscribers at least 30 days ahead.
// Rules this file keeps: at most 2.4% of the plan price, credit cards only
// (never debit, prepaid or bank debit), Canadian billing addresses outside
// Québec only, its own line on every invoice, taxed like the plan (GST/HST).
//
// The fee is a second subscription item on a permanent product, added or
// removed whenever the payment method, address or plan changes (see the
// Stripe webhook and changePlan). Turning the switch off removes it again on
// the next change.

const STRIPE = 'https://api.stripe.com/v1';
export const FEE_RATE = 0.024;
export const FEE_PRODUCT = 'subtrade_card_fee';
// Never charged with a live key before the card-network notice period ends
// (45 days after the Visa/Mastercard notices, at least the 30 the networks require). Test mode is not held back.
export const CARD_FEE_START = process.env.CARD_FEE_START || '2026-11-19';
export const cardFeeOn = () =>
  process.env.NEXT_PUBLIC_CARD_FEE === 'on' &&
  (!String(process.env.STRIPE_SECRET_KEY || '').includes('_live_') ||
    Date.now() >= Date.parse(`${CARD_FEE_START}T00:00:00-07:00`));

async function stripe(path, form) {
  const res = await fetch(`${STRIPE}/${path}`, {
    method: form ? 'POST' : 'GET',
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      ...(form ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
    },
    body: form ? new URLSearchParams(form) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) console.error('[card-fee] stripe', path.split('?')[0], res.status, data?.error?.message);
  return res.ok ? data : null;
}

const productId = (item) => (typeof item?.price?.product === 'object' ? item.price.product?.id : item?.price?.product);
export const isFeeItem = (item) => productId(item) === FEE_PRODUCT;
export const planItem = (sub) => (sub.items?.data || []).find((i) => !isFeeItem(i)) || null;
export const feeItem = (sub) => (sub.items?.data || []).find(isFeeItem) || null;
export const feeCents = (planCents) => Math.round((planCents || 0) * FEE_RATE);

async function ensureFeeProduct() {
  const have = await stripe(`products/${FEE_PRODUCT}`);
  if (have) {
    if (!have.active) await stripe(`products/${FEE_PRODUCT}`, { active: 'true' });
    return FEE_PRODUCT;
  }
  const made = await stripe('products', {
    id: FEE_PRODUCT,
    name: 'Credit card processing fee (2.4%)',
    tax_code: 'txcd_10103001', // taxed like the plan it is part of
    'metadata[source]': 'subtradesoftware.com/billing',
  });
  return made?.id || null;
}

// Why the fee does or doesn't apply (shown in notes and alerts).
export function feeReason(pm, address) {
  if (!cardFeeOn()) return { apply: false, why: 'card fee switched off' };
  if (!pm) return { apply: false, why: 'no payment method' };
  if (pm.type !== 'card') return { apply: false, why: pm.type === 'acss_debit' ? 'pays by bank debit' : `pays by ${pm.type}` };
  if (pm.card?.funding !== 'credit') return { apply: false, why: `${pm.card?.funding || 'non-credit'} card` };
  if ((address?.country || '').toUpperCase() !== 'CA') return { apply: false, why: 'billing address outside Canada' };
  if ((address?.state || '').toUpperCase() === 'QC') return { apply: false, why: 'Québec billing address' };
  return { apply: true, why: 'credit card' };
}

// Add, update or remove the fee item so it matches the payment method now on
// file. Safe to call any number of times. Returns { changed, applied, why }.
export async function syncCardFee(subOrId) {
  const id = typeof subOrId === 'string' ? subOrId : subOrId?.id;
  if (!id || !process.env.STRIPE_SECRET_KEY) return { changed: false };
  const sub = await stripe(
    `subscriptions/${id}?expand[]=default_payment_method&expand[]=customer&expand[]=customer.invoice_settings.default_payment_method`,
  );
  if (!sub || !['trialing', 'active', 'past_due'].includes(sub.status)) return { changed: false };
  if (sub.metadata?.source !== 'fb-ads-funnel') return { changed: false }; // only self-serve subscriptions
  // Card + bank debit only (no Stripe Link: it hides credit vs debit).
  const types = sub.payment_settings?.payment_method_types;
  if (!Array.isArray(types) || types.length !== 2 || !types.includes('card') || !types.includes('acss_debit')) {
    await stripe(`subscriptions/${sub.id}`, {
      'payment_settings[payment_method_types][0]': 'card',
      'payment_settings[payment_method_types][1]': 'acss_debit',
    });
  }

  const customer = typeof sub.customer === 'object' ? sub.customer : {};
  const pm = sub.default_payment_method || customer.invoice_settings?.default_payment_method || null;
  const plan = planItem(sub);
  const fee = feeItem(sub);
  const { apply, why } = feeReason(typeof pm === 'object' ? pm : null, customer.address);
  if (!plan) return { changed: false };

  const interval = plan.price?.recurring?.interval || 'month';
  const want = feeCents(plan.price?.unit_amount);
  const base = { proration_behavior: 'none' }; // takes effect from the next invoice

  if (!apply || !want) {
    if (!fee) return { changed: false, applied: false, why };
    const r = await stripe(`subscriptions/${sub.id}`, { ...base, 'items[0][id]': fee.id, 'items[0][deleted]': 'true' });
    return { changed: !!r, applied: false, why };
  }
  if (fee && fee.price?.unit_amount === want && fee.price?.recurring?.interval === interval) {
    return { changed: false, applied: true, why, amount: want / 100 };
  }
  const product = await ensureFeeProduct();
  if (!product) return { changed: false, applied: !!fee, why: 'fee product unavailable' };
  const r = await stripe(`subscriptions/${sub.id}`, {
    ...base,
    ...(fee ? { 'items[0][id]': fee.id } : {}),
    'items[0][quantity]': '1',
    'items[0][price_data][currency]': plan.price?.currency || 'cad',
    'items[0][price_data][product]': product,
    'items[0][price_data][unit_amount]': String(want),
    'items[0][price_data][recurring][interval]': interval,
    'items[0][price_data][tax_behavior]': 'exclusive',
  });
  return { changed: !!r, applied: !!r, why, amount: want / 100 };
}

// Every self-serve subscription of a customer (card or address changed).
export async function syncCardFeeForCustomer(customerId) {
  const subs = await stripe(`subscriptions?customer=${customerId}&status=all&limit=10`);
  for (const s of subs?.data || []) {
    if (['trialing', 'active', 'past_due'].includes(s.status)) await syncCardFee(s.id);
  }
}
