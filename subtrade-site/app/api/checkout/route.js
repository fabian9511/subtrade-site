import { NextResponse } from 'next/server';
import { clampUsers, periodPrice, fmt } from '../../../lib/pricing';

/**
 * Starts a SubTrade 14-day trial with a card on file, for the /start/ funnel.
 *
 * Sends the visitor to Stripe's own hosted checkout page: $0 today, then
 * the pricing-page price for their team size (lib/pricing.js), monthly or
 * yearly, in CAD, when the 14 days are up, unless they cancel. The amount is
 * worked out here from the user count, never taken from the browser.
 * The card never touches our site.
 *
 * Needs STRIPE_SECRET_KEY in Vercel (start with a TEST key, sk_test_...).
 * Without it this returns { configured: false } and the page falls back to the
 * plain portal signup, so the funnel keeps working.
 *
 * Linking the subscription to the SubTrade account is the app's job (by email
 * and metadata.source = fb-ads-funnel) — see the note sent to Steban.
 */

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

  const plan = body.plan === 'yearly' ? 'yearly' : 'monthly';
  const annual = plan === 'yearly';
  const users = clampUsers(body.users ?? 5);
  const amount = periodPrice(users, annual); // whole dollars per billing period
  const priceText = `$${fmt(amount)}/${annual ? 'year' : 'month'}`;
  const usersText = `${users} ${users === 1 ? 'user' : 'users'}`;
  const productName = `SubTrade · ${usersText} · billed ${annual ? 'yearly (20% off)' : 'monthly'}`;
  const firstCharge = new Date(Date.now() + TRIAL_DAYS * 864e5).toLocaleDateString('en-CA', {
    month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/Edmonton',
  });
  const money = `CA$${fmt(amount)}.00 plus GST`;
  const description = `FREE 14-day trial: you pay $0.00 today. On ${firstCharge} your card is charged ${money} for ${annual ? 'one year' : 'one month'} (${usersText}), then every ${annual ? 'year' : 'month'} until you cancel. Cancel before ${firstCharge} and you pay nothing.`;
  const email = clean(body.email, 160).toLowerCase();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'A valid email is required' }, { status: 400 });
  }

  const origin = new URL(req.url).origin;
  const meta = {
    source: 'fb-ads-funnel',
    plan,
    users: String(users),
    price: priceText,
    first_name: clean(body.firstName, 60),
    last_name: clean(body.lastName, 60),
    company: clean(body.company),
    phone: clean(body.phone, 30),
  };

  const form = new URLSearchParams();
  form.set('mode', 'subscription');
  if (email) form.set('customer_email', email); // else Stripe asks for it
  form.set('payment_method_collection', 'always');
  form.set('line_items[0][quantity]', '1');
  form.set('line_items[0][price_data][currency]', 'cad');
  form.set('line_items[0][price_data][unit_amount]', String(amount * 100));
  form.set('line_items[0][price_data][recurring][interval]', annual ? 'year' : 'month');
  form.set('line_items[0][price_data][tax_behavior]', 'exclusive'); // prices are plus GST
  form.set('line_items[0][price_data][product_data][tax_code]', 'txcd_10103001'); // SaaS, business use
  form.set('line_items[0][price_data][product_data][name]', productName);
  form.set('line_items[0][price_data][product_data][description]', description);
  form.set('line_items[0][price_data][product_data][images][0]', 'https://subtradesoftware.com/logo-mark.png');
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
    `You pay $0.00 today — your card is saved, not charged. First charge: ${money} on ${firstCharge}. Cancel anytime before then and you pay nothing. By starting your trial you agree to our [Terms & Conditions](https://subtradesoftware.com/terms-and-conditions/) and [Fair Billing Policy](https://subtradesoftware.com/fair-billing-policy/).`,
  );
  // GST/HST through Stripe Tax: it charges only where a registration is added
  // in Stripe (Settings → Tax), so GST/HST only. Needs the billing address.
  form.set('automatic_tax[enabled]', 'true');
  form.set('billing_address_collection', 'required');
  // Required "I agree to the Terms" tick box (needs the Terms URL in Stripe →
  // Settings → Public details). Stripe keeps the record on the session.
  form.set('consent_collection[terms_of_service]', 'required');
  form.set('success_url', `${origin}/start/welcome/?plan=${plan}&users=${users}&session_id={CHECKOUT_SESSION_ID}`);
  form.set('cancel_url', `${origin}/start/`);

  const create = async (f) => {
    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: f,
    });
    return { res, data: await res.json() };
  };

  try {
    let { res, data } = await create(form);
    // If Stripe Tax or the Terms URL isn't set up in this Stripe account yet,
    // don't block the trial: drop that part, log it loudly, and carry on.
    for (let i = 0; !res.ok && i < 2; i++) {
      const msg = String(data?.error?.message || '');
      if (/tax/i.test(msg) && form.has('automatic_tax[enabled]')) {
        console.error('[checkout] SET UP STRIPE TAX — GST not charged:', msg);
        form.delete('automatic_tax[enabled]');
      } else if (/terms|consent/i.test(msg) && form.has('consent_collection[terms_of_service]')) {
        console.error('[checkout] ADD TERMS URL IN STRIPE PUBLIC DETAILS — no tick box:', msg);
        form.delete('consent_collection[terms_of_service]');
      } else break;
      ({ res, data } = await create(form));
    }
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
