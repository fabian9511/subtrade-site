import { NextResponse } from 'next/server';

/**
 * Starts a SubTrade 14-day trial with a card on file, for the /start/ funnel.
 *
 * Sends the visitor to Stripe's own hosted checkout page: $0 today, then
 * $299/month or $2,870/year (CAD) when the 14 days are up, unless they cancel.
 * The card never touches our site.
 *
 * Needs STRIPE_SECRET_KEY in Vercel (start with a TEST key, sk_test_...).
 * Without it this returns { configured: false } and the page falls back to the
 * plain portal signup, so the funnel keeps working.
 *
 * Linking the subscription to the SubTrade account is the app's job (by email
 * and metadata.source = fb-ads-funnel) — see the note sent to Steban.
 */

const PLANS = {
  monthly: { amount: 29900, interval: 'month', name: 'SubTrade – Monthly (5 users)' },
  yearly: { amount: 287000, interval: 'year', name: 'SubTrade – Yearly (5 users, save 20%)' },
};
const TRIAL_DAYS = 14;

const clean = (v, max = 120) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 });
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return NextResponse.json({ ok: false, configured: false });

  const plan = PLANS[body.plan] ? body.plan : 'monthly';
  const p = PLANS[plan];
  const email = clean(body.email, 160).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'A valid email is required' }, { status: 400 });
  }

  const origin = new URL(req.url).origin;
  const meta = {
    source: 'fb-ads-funnel',
    plan,
    first_name: clean(body.firstName, 60),
    last_name: clean(body.lastName, 60),
    company: clean(body.company),
    phone: clean(body.phone, 30),
  };

  const form = new URLSearchParams();
  form.set('mode', 'subscription');
  form.set('customer_email', email);
  form.set('payment_method_collection', 'always');
  form.set('line_items[0][quantity]', '1');
  form.set('line_items[0][price_data][currency]', 'cad');
  form.set('line_items[0][price_data][unit_amount]', String(p.amount));
  form.set('line_items[0][price_data][recurring][interval]', p.interval);
  form.set('line_items[0][price_data][product_data][name]', p.name);
  form.set('subscription_data[trial_period_days]', String(TRIAL_DAYS));
  // No card at the end of the trial means no subscription, never a surprise bill.
  form.set('subscription_data[trial_settings][end_behavior][missing_payment_method]', 'cancel');
  for (const [k, v] of Object.entries(meta)) {
    if (!v) continue;
    form.set(`metadata[${k}]`, v);
    form.set(`subscription_data[metadata][${k}]`, v);
  }
  form.set(
    'custom_text[submit][message]',
    `$0 today. Your card is charged ${p.interval === 'month' ? '$299/month' : '$2,870/year'} CAD after the ${TRIAL_DAYS}-day trial. Cancel anytime before then and you pay nothing.`,
  );
  if (process.env.STRIPE_AUTOMATIC_TAX === '1') form.set('automatic_tax[enabled]', 'true');
  form.set('success_url', `${origin}/start/welcome/?plan=${plan}`);
  form.set('cancel_url', `${origin}/start/`);

  try {
    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form,
    });
    const data = await res.json();
    if (!res.ok) {
      console.error('[checkout] stripe error', res.status, data?.error?.message);
      return NextResponse.json({ ok: false, error: 'Could not start checkout' }, { status: 502 });
    }
    return NextResponse.json({ ok: true, url: data.url });
  } catch (err) {
    console.error('[checkout] stripe unreachable', err?.message);
    return NextResponse.json({ ok: false, error: 'Could not start checkout' }, { status: 502 });
  }
}
