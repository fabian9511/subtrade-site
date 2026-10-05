import { NextResponse } from 'next/server';

/**
 * Lead capture for the Facebook-ads funnel at /start/.
 *
 * The page calls this twice: once when someone registers (name, email, phone,
 * company) and again when they finish the qualifying questions. Both calls
 * upsert the same GoHighLevel contact, matched on email, so the second call
 * fills in the answers instead of creating a duplicate.
 *
 * Needs GHL_PRIVATE_TOKEN in the Vercel environment (a GoHighLevel Private
 * Integration token with contacts.write and opportunities.write). Without it the funnel still works for
 * the visitor, but nothing reaches GoHighLevel — the response says so.
 */

const GHL = 'https://services.leadconnectorhq.com';
const LOCATION_ID = process.env.GHL_LOCATION_ID || 'tvaEDkrxBWUrDUqzetBb';

// "FB Ads Funnel - Fabian" pipeline, used only by this page. The page sets the
// first stages; GoHighLevel workflows move cards on from there (call booked,
// no show, won). Won customers are copied into SubTrade Software > Onboarding
// by a workflow.
const PIPELINE_ID = 'OuxZEd4r0BA8PEreH5n6';
const STAGES = {
  registered: 'ce4b3264-b6fc-4450-adde-5396d0410fe1', // Signed up – no answers
  qualified: 'c87c14c8-4d34-43c5-a653-e22ae0dcc45d', // Qualified
  // Small companies / price "No": kept out of Qualified so they never enter
  // the "book a demo" campaign (Facebook New Lead Camp starts on Qualified).
  trial: '6316cc7e-a969-4973-9529-448c93db84af', // Trial path
};

// Existing SubTrade custom fields in GoHighLevel (same ones the old forms used).
const FIELDS = {
  trade: 'MwdJ9aMXpOGG0s72uXTW', // Your Trade
  employees: 'wO4QTXHZIZmIjCzaK1e6', // Number of Employees
  volume: '4VyJjhp4RAEjcZacD7Vo', // What is your average annual construction volume?
  current: '2Zsao8Fuj0orjBrjrQGP', // How are you currently managing your construction projects?
  timeline: 'msNLRy4Ie7IDFbNeMEqx', // When are you planning to implement a new system?
  heard: 'lbWIwVStHiboFNlQw0qV', // Where did you hear about us? (single)
  company: 'Vptj9VI3AUb6rQR21GIR', // Organization Name
  role: 'VL3tWhtUJS8eU9vLt0CN', // Job Title:
};

// The software question is a pick-list of tools; the old GoHighLevel field only
// knows three buckets, so fold the picks into the closest one. The exact tools
// go into a note on the contact.
function currentBucket(software) {
  if (!software.length) return '';
  if (software.some((s) => !['Excel', 'QuickBooks', 'Pen & paper', 'Other'].includes(s))) return 'Another Construction Software';
  if (software.includes('Excel')) return 'SpreadSheets';
  if (software.includes('Pen & paper')) return 'Pen & Paper';
  return '';
}

// The exact consent wording shown on /start/ (components/Funnel.jsx). Bump the
// version whenever that wording changes, so each consent record says which
// text the person agreed to.
const CONSENT_VERSION = 'start-2026-10-04';
const CONSENT_TEXT = {
  smsMarketing:
    'I consent to receive marketing text messages from SubTrade Software Ltd at the phone number provided. Frequency may vary. Message & data rates may apply. Text HELP for assistance, reply STOP to opt out.',
  smsService:
    'I consent to receive non-marketing text messages from SubTrade Software Ltd about my demo call, onboarding, service updates and account notifications. Message & data rates may apply. Text HELP for assistance, reply STOP to opt out.',
};

const clean = (v, max = 120) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 });
  }

  // Honeypot: real people never see or fill this field.
  if (clean(body.website)) return NextResponse.json({ ok: true });

  const email = clean(body.email, 160).toLowerCase();
  // Always hand GoHighLevel +1XXXXXXXXXX, whatever the browser sent.
  const digits = clean(body.phone, 30).replace(/\D/g, '').replace(/^1/, '');
  const phone = digits.length === 10 ? `+1${digits}` : '';
  const firstName = clean(body.firstName, 60);
  const required = [firstName, clean(body.lastName), phone, clean(body.company)];
  if (!body.consent?.terms || required.some((v) => !v) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'All fields are required' }, { status: 400 });
  }

  const token = process.env.GHL_PRIVATE_TOKEN;
  if (!token) {
    console.warn('[lead] GHL_PRIVATE_TOKEN not set — lead not sent to GoHighLevel');
    return NextResponse.json({ ok: true, stored: false });
  }

  const a = body.answers || {};
  const software = (Array.isArray(a.software) ? a.software : []).map((v) => clean(v, 40)).filter(Boolean).slice(0, 15);
  const customFields = [
    ['company', body.company],
    ['trade', a.trade],
    ['employees', a.employees],
    ['volume', a.volume],
    ['current', currentBucket(software)],
    ['role', a.role],
    ['timeline', a.timeline],
    ['heard', 'Facebook'],
  ]
    .map(([k, v]) => ({ id: FIELDS[k], field_value: clean(v) }))
    .filter((f) => f.field_value);

  const tags = ['fb-ads-funnel'];
  if (body.stage === 'qualified') tags.push('fb-funnel-qualified');
  if (body.stage === 'trial') tags.push('fb-funnel-trial-path');
  if (a.price === 'No') tags.push('fb-price-no');
  // Hot lead: someone who can buy, runs a crew of 6 or more, wants it now and
  // is fine with the price. GoHighLevel texts Fabian to call these within 15 minutes.
  if (
    ['Owner', 'Partner'].includes(a.role) &&
    ['6-10', '11-20', '21-50', '50+'].includes(a.employees) &&
    a.timeline === 'Immediately' &&
    a.price === 'Yes'
  ) tags.push('hot-lead');
  // Consent from the sign-up form. Follow-up texts must only go to people
  // tagged here (marketing texts need sms-consent-marketing).
  const consent = body.consent || {};
  if (consent.terms) tags.push('accepted-terms');
  if (consent.smsMarketing) tags.push('sms-consent-marketing');
  if (consent.smsService) tags.push('sms-consent-service');
  software.forEach((t) => tags.push(`uses-${t.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`));

  const headers = {
    Authorization: `Bearer ${token}`,
    Version: '2021-07-28',
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  try {
    const res = await fetch(`${GHL}/contacts/upsert`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        locationId: LOCATION_ID,
        firstName,
        lastName: clean(body.lastName, 60),
        email,
        phone,
        companyName: clean(body.company),
        source: 'Facebook Ads - /start',
        customFields,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error('[lead] upsert failed', res.status, data?.message);
      return NextResponse.json({ ok: true, stored: false });
    }

    // Tags go through their own endpoint so we add to a contact's tags rather
    // than replacing them.
    const id = data?.contact?.id;
    if (id && body.stage === 'registered') {
      const consentNow = body.consent || {};
      const anySms = consentNow.smsMarketing || consentNow.smsService;

      // A brand-new contact who ticked no SMS box gets SMS turned off (DND) in
      // GoHighLevel itself, so no workflow or manual text can reach them by
      // mistake. Existing contacts are left alone: they may have opted in
      // somewhere else, and we never switch DND off for anyone.
      if (data.new && !anySms) {
        await fetch(`${GHL}/contacts/${id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            dndSettings: { SMS: { status: 'active', message: 'No SMS consent given on subtradesoftware.com/start/' } },
          }),
        })
          .then((r) => !r.ok && r.text().then((t) => console.error('[lead] dnd failed', r.status, t.slice(0, 200))))
          .catch(() => {});
      }

      // Proof of consent, kept on the contact: what they agreed to, when,
      // where and from which connection. This is what a carrier asks for.
      const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
      const proof = [
        `Consent record (${CONSENT_VERSION}) — subtradesoftware.com/start/`,
        `Time: ${new Date().toISOString()}`,
        `IP: ${ip}`,
        `Browser: ${clean(req.headers.get('user-agent') || 'unknown', 200)}`,
        `Phone: ${phone}`,
        `Terms & Privacy Policy accepted: ${consentNow.terms ? 'yes' : 'no'}`,
        `Marketing SMS: ${consentNow.smsMarketing ? `YES — "${CONSENT_TEXT.smsMarketing}"` : 'no'}`,
        `Non-marketing SMS: ${consentNow.smsService ? `YES — "${CONSENT_TEXT.smsService}"` : 'no'}`,
        anySms ? '' : (data.new ? 'SMS DND switched on (no consent).' : 'Existing contact: SMS settings left unchanged.'),
      ].filter(Boolean);
      await fetch(`${GHL}/contacts/${id}/notes`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ body: proof.join('\n') }),
      }).catch(() => {});
    }
    if (id) {
      await fetch(`${GHL}/contacts/${id}/tags`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ tags }),
      }).catch(() => {});

      // One card per lead in FB Ads Funnel (upsert, so no duplicates; the
      // second call after the questions moves it on from Signed up).
      const company = clean(body.company);
      await fetch(`${GHL}/opportunities/upsert`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          locationId: LOCATION_ID,
          pipelineId: PIPELINE_ID,
          contactId: id,
          name: `${firstName} ${clean(body.lastName, 60)}${company ? ` — ${company}` : ''}`.trim(),
          status: 'open',
          pipelineStageId: STAGES[body.stage] || STAGES.registered,
        }),
      })
        .then((r) => !r.ok && r.text().then((t) => console.error('[lead] opportunity failed', r.status, t.slice(0, 200))))
        .catch(() => {});

      // After the questions, leave the answers as a note so they read in one place.
      if (body.stage === 'qualified' || body.stage === 'trial') {
        const lines = [
          `Facebook ads funnel (/start/) — ${body.stage === 'qualified' ? 'shown the booking calendar' : 'sent to free trial'}`,
          `Trade: ${clean(a.trade) || '-'}`,
          `Role: ${clean(a.role) || '-'}`,
          `People: ${clean(a.employees) || '-'}`,
          `Yearly volume: ${clean(a.volume) || '-'}`,
          `Uses now: ${software.join(', ') || '-'}`,
          `Wants a system: ${clean(a.timeline) || '-'}`,
          `$299/month fits budget: ${clean(a.price) || '-'}`,
          `SMS consent: marketing ${consent.smsMarketing ? 'yes' : 'no'}, service ${consent.smsService ? 'yes' : 'no'} (terms accepted ${consent.terms ? 'yes' : 'no'})`,
        ];
        await fetch(`${GHL}/contacts/${id}/notes`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ body: lines.join('\n') }),
        }).catch(() => {});
      }
    }
    return NextResponse.json({ ok: true, stored: true });
  } catch (err) {
    console.error('[lead] GoHighLevel unreachable', err?.message);
    return NextResponse.json({ ok: true, stored: false });
  }
}
