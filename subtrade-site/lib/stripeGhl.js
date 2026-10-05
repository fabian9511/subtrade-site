// Shared by /api/stripe-webhook and /api/trial-started: read Stripe, update
// the lead in GoHighLevel (contact, FB Ads Funnel card, tags, note).
//
// Needs STRIPE_SECRET_KEY and GHL_PRIVATE_TOKEN in Vercel.

const GHL = 'https://services.leadconnectorhq.com';
const LOCATION_ID = process.env.GHL_LOCATION_ID || 'tvaEDkrxBWUrDUqzetBb';
const PIPELINE_ID = 'OuxZEd4r0BA8PEreH5n6'; // FB Ads Funnel - Fabian
export const STAGES = {
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
const TRIAL_TAG = 'trial-card-on-file';

export async function stripeGet(path) {
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
  if (!res.ok) console.error('[stripe→ghl]', method, path, res.status, data?.message);
  return res.ok ? data : null;
}

// Update the contact, move their funnel card, add tags and a note.
// With onceTag, the note and workflow removal only happen the first time that
// tag is added (the webhook and the welcome page can both report one trial).
export async function toGhl({ email, meta = {}, stage, status = 'open', tags = [], note, leaveWorkflows = false, onceTag }) {
  if (!email || !process.env.GHL_PRIVATE_TOKEN) return { ok: false, reason: 'not configured' };
  const up = await ghl('/contacts/upsert', 'POST', {
    locationId: LOCATION_ID,
    email,
    ...(meta.first_name ? { firstName: meta.first_name } : {}),
    ...(meta.last_name ? { lastName: meta.last_name } : {}),
    ...(meta.company ? { companyName: meta.company } : {}),
  });
  const contact = up?.contact;
  if (!contact?.id) return { ok: false, reason: 'contact not saved' };
  const id = contact.id;
  const already = onceTag && (contact.tags || []).includes(onceTag);
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
  if (already) return { ok: true, repeat: true };
  if (note) await ghl(`/contacts/${id}/notes`, 'POST', { body: note });
  if (leaveWorkflows) {
    for (const wf of LEAVE_WORKFLOWS) await ghl(`/contacts/${id}/workflow/${wf}`, 'DELETE');
  }
  return { ok: true };
}

export const day = (unix) => (unix ? new Date(unix * 1000).toISOString().slice(0, 10) : '?');
export const money = (cents, cur = 'cad') => `$${(cents / 100).toFixed(2)} ${cur.toUpperCase()}`;

// A completed funnel checkout → card "Trial started", tags, note, out of the
// demo/trial-nudge workflows. Safe to call more than once for the same trial.
export async function recordTrialStarted(session) {
  if (session?.status !== 'complete' || session?.metadata?.source !== 'fb-ads-funnel') {
    return { ok: false, reason: 'not a completed funnel checkout' };
  }
  const meta = session.metadata;
  const sub = session.subscription
    ? typeof session.subscription === 'string' ? await stripeGet(`subscriptions/${session.subscription}`) : session.subscription
    : null;
  const plan = meta.plan || 'monthly';
  return toGhl({
    email: (session.customer_details?.email || session.customer_email || '').toLowerCase(),
    meta,
    stage: STAGES.trialStarted,
    tags: [TRIAL_TAG, `plan-${plan}`],
    onceTag: TRIAL_TAG,
    leaveWorkflows: true,
    note: [
      'Trial started with a card (Stripe, from subtradesoftware.com/start/)',
      `Plan: ${meta.price || (plan === 'yearly' ? '$2,870/year' : '$299/month')} CAD, ${meta.users || 5} users`,
      `First charge: ${day(sub?.trial_end)}`,
      `Stripe customer: ${session.customer} · subscription: ${sub?.id || session.subscription}`,
      'Next: make sure they created their login at portal.subtradesoftware.com/signup with this email.',
    ].join('\n'),
  });
}
