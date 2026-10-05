import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { STAGES, stripeGet, toGhl, day, money, recordTrialStarted } from '../../../lib/stripeGhl';
import { onInvoicePaid, onPaymentFailed, onSubscriptionEnded } from '../../../lib/billing';

/**
 * Stripe → GoHighLevel for the /start/ funnel trials.
 *
 *   checkout.session.completed      trial started with a card  → card "Trial started", tags, note
 *   invoice.paid (amount > 0)       first real payment         → card "Won – paying"
 *   customer.subscription.deleted   cancelled / trial lapsed   → card "Nurture / lost" + team alert
 *   invoice.payment_failed          card declined              → team alert, GHL task, customer email
 *   (invoice.paid also sends the team alert on a subscription's first real payment)
 *
 * Only subscriptions made by the funnel (metadata.source = fb-ads-funnel) are
 * touched, so other SubTrade billing passes straight through.
 *
 * The GoHighLevel side lives in lib/stripeGhl.js.
 *
 * Needs STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET (from the webhook endpoint in
 * Stripe, whsec_...) and GHL_PRIVATE_TOKEN in Vercel.
 */

function verify(raw, header, secret) {
  if (!header || !secret) return false;
  const parts = Object.fromEntries(header.split(',').map((kv) => kv.split('=')));
  if (!parts.t || !parts.v1) return false;
  if (Math.abs(Date.now() / 1000 - Number(parts.t)) > 300) return false; // 5-minute window
  const expected = crypto.createHmac('sha256', secret).update(`${parts.t}.${raw}`).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(parts.v1));
  } catch {
    return false;
  }
}

export async function POST(req) {
  const raw = await req.text();
  if (!verify(raw, req.headers.get('stripe-signature'), process.env.STRIPE_WEBHOOK_SECRET)) {
    return NextResponse.json({ error: 'bad signature' }, { status: 400 });
  }
  const event = JSON.parse(raw);
  const obj = event.data?.object || {};

  try {
    if (event.type === 'checkout.session.completed') {
      await recordTrialStarted(obj); // also reported by the welcome page; repeats are skipped
    }

    if (event.type === 'invoice.paid' && obj.amount_paid > 0) {
      // Newer Stripe API versions moved the subscription id under invoice.parent.
      const subId = obj.subscription || obj.parent?.subscription_details?.subscription;
      const sub = subId ? await stripeGet(`subscriptions/${subId}`) : null;
      if (sub?.metadata?.source === 'fb-ads-funnel') {
        await toGhl({
          email: (obj.customer_email || '').toLowerCase(),
          meta: sub.metadata,
          stage: STAGES.won,
          status: 'won',
          tags: ['paying-customer'],
          note: `Payment received: ${money(obj.amount_paid, obj.currency)} on ${day(obj.created)} (Stripe invoice ${obj.number || obj.id}).`,
        });
      }
      await onInvoicePaid(obj); // team alert on the first real payment
    }

    if (event.type === 'invoice.payment_failed') {
      await onPaymentFailed(obj); // team alert + GHL task + "update your card" email
    }

    if (event.type === 'customer.subscription.deleted' && obj.metadata?.source === 'fb-ads-funnel') {
      const customer = await stripeGet(`customers/${obj.customer}`);
      await toGhl({
        email: (customer?.email || '').toLowerCase(),
        meta: obj.metadata,
        stage: STAGES.lost,
        status: 'lost',
        tags: ['trial-cancelled'],
        note: `Subscription ended on ${day(obj.ended_at || obj.canceled_at)} (${obj.cancellation_details?.reason || 'cancelled'}).`,
      });
    }
    if (event.type === 'customer.subscription.deleted') {
      await onSubscriptionEnded(obj); // team alert: close their account
    }
  } catch (err) {
    console.error('[stripe-webhook] failed', event.type, err?.message);
    return NextResponse.json({ error: 'handler failed' }, { status: 500 }); // Stripe retries
  }
  return NextResponse.json({ received: true });
}
