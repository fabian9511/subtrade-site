import crypto from 'node:crypto';
import { NextResponse } from 'next/server';

/**
 * Stripe → GoHighLevel for the /start/ funnel trials.
 *
 *   checkout.session.completed      trial started with a card  → card "Trial started", tags, note
 *   invoice.paid (amount > 0)       first real payment         → card "Won – paying"
 *   customer.subscription.deleted   cancelled / trial lapsed   → card "Nurture / lost"
 *
 * Only subscriptions made by the funnel (metadata.source = fb-ads-funnel) are
 * touched, so other SubTrade billing passes straight through.
 *
 * Needs STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET (from the webhook endpoint in
 * Stripe, whsec_...) and GHL_PRIVATE_TOKEN in Vercel.
 */

const GHL = 'https://services.leadconnectorhq.com';
const LOCATION_ID = process.env.GHL_LOCATION_ID || 'tvaEDkrxBWUrDUqzetBb';
const PIPELINE_ID = 'OuxZEd4r0BA8PEreH5n6'; // FB Ads Funnel - Fabian
const STAGES = {
  trialStarted: '8094972b-1354-4448-a2c5-4bdd0c9cc265',
  won: 'eff7a931-a879-415b-abb1-7360d6fc5f5b',
  lost: 'ca9a87ad-259a-4646-9fdc-648e482c4616',
};
// Workflows a paying-trial lead must leave: the "book a demo" campaign and the
// "start your trial" nudges.
const LEAVE_WORKFLOWS = [
  'e686c805-adb2-4766-beee-897e08dab924', // Facebook New Lead Camp
  '553a8ee7-3258-4c6b-8ef9-3912453abee9', // FB Ads Funnel - Trial path
];

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

async function stripeGet(path) {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` },
  });
  return res.ok ? res.json() : null;
}

async function ghl(path, method, body) {
  const res = await fetch(`${GHL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.GHL_PRIVATE_TOKEN}`,
      Version: '2021-07-28',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) console.error('[stripe-webhook] ghl', method, path, res.status, data?.message);
  return res.ok ? data : null;
}

// Update the contact, move their funnel card, add tags and a note.
async function toGhl({ email, meta = {}, stage, status = 'open', tags = [], note, leaveWorkflows = false }) {
  if (!email || !process.env.GHL_PRIVATE_TOKEN) return;
  const up = await ghl('/contacts/upsert', 'POST', {
    locationId: LOCATION_ID,
    email,
    ...(meta.first_name ? { firstName: meta.first_name } : {}),
    ...(meta.last_name ? { lastName: meta.last_name } : {}),
    ...(meta.company ? { companyName: meta.company } : {}),
  });
  const id = up?.contact?.id;
  if (!id) return;
  if (tags.length) await ghl(`/contacts/${id}/tags`, 'POST', { tags });
  if (stage) {
    await ghl('/opportunities/upsert', 'POST', {
      locationId: LOCATION_ID,
      pipelineId: PIPELINE_ID,
      contactId: id,
      pipelineStageId: stage,
      status,
    });
  }
  if (note) await ghl(`/contacts/${id}/notes`, 'POST', { body: note });
  if (leaveWorkflows) {
    for (const wf of LEAVE_WORKFLOWS) await ghl(`/contacts/${id}/workflow/${wf}`, 'DELETE');
  }
}

const day = (unix) => (unix ? new Date(unix * 1000).toISOString().slice(0, 10) : '?');
const money = (cents, cur = 'cad') => `$${(cents / 100).toFixed(2)} ${cur.toUpperCase()}`;

export async function POST(req) {
  const raw = await req.text();
  if (!verify(raw, req.headers.get('stripe-signature'), process.env.STRIPE_WEBHOOK_SECRET)) {
    return NextResponse.json({ error: 'bad signature' }, { status: 400 });
  }
  const event = JSON.parse(raw);
  const obj = event.data?.object || {};

  try {
    if (event.type === 'checkout.session.completed' && obj.metadata?.source === 'fb-ads-funnel') {
      const sub = obj.subscription ? await stripeGet(`subscriptions/${obj.subscription}`) : null;
      const plan = obj.metadata.plan || 'monthly';
      await toGhl({
        email: (obj.customer_details?.email || obj.customer_email || '').toLowerCase(),
        meta: obj.metadata,
        stage: STAGES.trialStarted,
        tags: ['trial-card-on-file', `plan-${plan}`],
        leaveWorkflows: true,
        note: [
          'Trial started with a card (Stripe, from subtradesoftware.com/start/)',
          `Plan: ${obj.metadata.price || (plan === 'yearly' ? '$2,870/year' : '$299/month')} CAD, ${obj.metadata.users || 5} users`,
          `First charge: ${day(sub?.trial_end)}`,
          `Stripe customer: ${obj.customer} · subscription: ${obj.subscription}`,
          'Next: make sure they created their login at portal.subtradesoftware.com/signup with this email.',
        ].join('\n'),
      });
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
  } catch (err) {
    console.error('[stripe-webhook] failed', event.type, err?.message);
    return NextResponse.json({ error: 'handler failed' }, { status: 500 }); // Stripe retries
  }
  return NextResponse.json({ received: true });
}
