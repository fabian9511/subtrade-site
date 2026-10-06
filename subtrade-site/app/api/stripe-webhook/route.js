import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { STAGES, stripeGet, toGhl, day, money, recordTrialStarted } from '../../../lib/stripeGhl';
import { onInvoicePaid, onPaymentFailed, onSubscriptionEnded, applyBankSetup, applyBankSetupIntent, onSwitchedToBank } from '../../../lib/billing';
import { syncCardFee, syncCardFeeForCustomer } from '../../../lib/cardFee';

/**
 * Stripe → GoHighLevel for the /start/ funnel trials.
 *
 *   checkout.session.completed      trial started with a card  → card "Trial started", tags, note
 *   invoice.paid (amount > 0)       first real payment         → card "Won – paying"
 *   customer.subscription.deleted   cancelled / trial lapsed   → card "Nurture / lost" + team alert
 *   invoice.payment_failed          card declined              → team alert, GHL task, customer email
 *   (invoice.paid also sends the team alert on a subscription's first real payment)
 *   checkout.session.completed (setup) / setup_intent.succeeded
 *                                   "Pay by bank instead" on /billing → bank debit becomes the payment method
 *   customer.subscription.updated / customer.updated
 *                                   card, bank account or address changed: card fee
 *                                   added or removed (lib/cardFee.js, only when switched on)
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
    if (event.type === 'checkout.session.completed' && obj.mode === 'setup') {
      await applyBankSetup(obj); // "Pay by bank instead" on /billing
    } else if (event.type === 'checkout.session.completed') {
      await recordTrialStarted(obj); // also reported by the welcome page; repeats are skipped
      if (obj.subscription) await syncCardFee(obj.subscription);
    }

    // Bank account verified by micro-deposits (days after "Pay by bank instead").
    if (event.type === 'setup_intent.succeeded' && obj.metadata?.subscription) {
      await applyBankSetupIntent(obj);
    }

    // Our own fee change also fires subscription.updated; syncCardFee then
    // finds nothing to do, so it never loops.
    if (event.type === 'customer.subscription.updated') {
      const prev = event.data?.previous_attributes || {};
      if ('default_payment_method' in prev || 'items' in prev) await syncCardFee(obj.id);
      if ('default_payment_method' in prev && obj.default_payment_method && obj.metadata?.source === 'fb-ads-funnel') {
        const pm = await stripeGet(`payment_methods/${obj.default_payment_method}`);
        const was = prev.default_payment_method ? await stripeGet(`payment_methods/${prev.default_payment_method}`) : null;
        if (pm?.type === 'acss_debit' && was?.type !== 'acss_debit') await onSwitchedToBank(obj.id);
      }
    }
    if (event.type === 'customer.updated') {
      const prev = event.data?.previous_attributes || {};
      if ('invoice_settings' in prev || 'address' in prev) await syncCardFeeForCustomer(obj.id);
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
