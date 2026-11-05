import { NextResponse } from 'next/server';
import { TRADES, WCB, INSURANCE, CREW, SAFETY, YEARS, GC_WORK, qualify, crewToGhl } from '../../../lib/buildersNight';
import { LOCATION_ID, PIPELINE_NAMES, STAGE_NAMES, makeGhl, findStage, norm } from '../../../lib/buildersNightGhl';

/**
 * Registration for SubTrade Builders Night (/builders-night/).
 *
 * Four kinds of sign-up come through here:
 *   sub      – a subcontractor applying for a ticket ($25 entry if they qualify)
 *   table    – a builder asking for one of the free builder tables
 *   guest    – a builder coming as a guest ($25 a person)
 *   supplier – a supplier asking for one of the 5 paid supplier tables ($750 + GST)
 *
 * Subs pre-qualify by answering questions (no documents). The rules live in
 * qualify() in lib/buildersNight.js: WCB yes, $3M+ liability, 3+ people
 * counting their own subs. The answer comes back to the form straight away.
 *
 * Every sign-up becomes a GoHighLevel contact (matched on email), tagged
 * builders-night-2027 plus its own tags, with all answers as a note:
 *   bn-sub, bn-trade-<trade>, bn-share-ok,
 *   bn-qualified + bn-tier-top | bn-tier-pass, or bn-not-qualified      (subs)
 *   bn-builder, bn-table-request | bn-guest                              (builders)
 *   bn-supplier, bn-supplier-table                                       (suppliers)
 *   the same tags + bn-team-member                                       (the rest of a builder's or supplier's team)
 *
 * Reminders go out by email, so everyone coming must give a first and last
 * name and an email. A builder also sends the name and email of every other
 * person on their team; each one is saved as their own contact (same company)
 * so they get the event details and reminders too.
 *
 * Each sign-up also gets a card in its Builders Night pipeline. Pipelines and
 * stages are found by name; the names to create in GHL are listed in
 * lib/buildersNightGhl.js. Until they exist the contact, tags and note are
 * still saved; only the pipeline card is skipped.
 *
 * Uses the same GHL_PRIVATE_TOKEN as the rest of the site.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Existing SubTrade custom fields in GoHighLevel (same ids as /api/expo-lead/).
const FIELDS = {
  trade: 'MwdJ9aMXpOGG0s72uXTW', // Your Trade
  employees: 'wO4QTXHZIZmIjCzaK1e6', // Number of Employees
  company: 'Vptj9VI3AUb6rQR21GIR', // Organization Name
};

// The exact wording shown on the form (components/BuildersNightForm.jsx).
// Bump the version whenever that wording changes.
const CONSENT_VERSION = 'builders-night-2026-11-04';
const CONSENT_TEXT =
  'Yes, SubTrade Software Ltd can email and text me about Builders Night and SubTrade. Message & data rates may apply. Reply STOP to opt out of texts, unsubscribe any time.';
const SHARE_TEXT = 'Share my name, company, trade, contact details and these answers with the builders at Builders Night.';

const ROLES = ['sub', 'table', 'guest', 'supplier'];
const clean = (v, max = 120) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const pickFrom = (list, v) => (list.includes(v) ? v : '');
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 });
  }

  // Honeypot: real people never see or fill this field.
  if (clean(body.website)) return NextResponse.json({ ok: true, qualified: true });

  const role = ROLES.includes(body.role) ? body.role : '';
  const email = clean(body.email, 160).toLowerCase();
  const digits = clean(body.phone, 30).replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
  const phone = digits.length === 10 ? `+1${digits}` : '';
  const firstName = clean(body.firstName, 60);
  const lastName = clean(body.lastName, 60);
  const company = clean(body.company);
  const emailOk = EMAIL_RE.test(email);
  if (!role || !firstName || !lastName || !company || !emailOk) {
    return NextResponse.json({ ok: false, error: 'First and last name, company and a valid email are needed' }, { status: 400 });
  }

  const a = body.answers || {};
  const isSub = role === 'sub';
  const ans = {
    trade: isSub ? pickFrom(TRADES, a.trade) : role === 'supplier' ? '' : 'General Contractor',
    tradeOther: clean(a.tradeOther, 60),
    wcb: pickFrom(WCB, a.wcb),
    insurance: pickFrom(INSURANCE, a.insurance),
    crew: pickFrom(CREW, a.crew),
    safety: pickFrom(SAFETY, a.safety),
    gcWork: pickFrom(GC_WORK, a.gcWork),
    gcNames: clean(a.gcNames, 400),
    years: pickFrom(YEARS, a.years),
  };
  if (isSub && (!ans.trade || !ans.wcb || !ans.insurance || !ans.crew)) {
    return NextResponse.json({ ok: false, error: 'Please answer the pre-qualification questions' }, { status: 400 });
  }
  const result = isSub ? qualify(ans) : null;

  // A builder's team: people 2 to 4, each with a full name and their own email.
  const attending = isSub ? 1 : Math.min(Math.max(parseInt(a.attending, 10) || 1, 1), role === 'guest' ? 4 : 2);
  const seen = new Set([email]);
  const team = (isSub || !Array.isArray(body.team) ? [] : body.team)
    .slice(0, attending - 1)
    .map((m) => ({ firstName: clean(m?.firstName, 60), lastName: clean(m?.lastName, 60), email: clean(m?.email, 160).toLowerCase() }))
    .filter((m) => m.firstName && m.lastName && EMAIL_RE.test(m.email) && !seen.has(m.email) && seen.add(m.email));
  if (team.length < attending - 1) {
    return NextResponse.json({ ok: false, error: 'Please add the first and last name and email for everyone coming' }, { status: 400 });
  }

  const token = process.env.GHL_PRIVATE_TOKEN;
  if (!token) {
    console.warn('[builders-night] GHL_PRIVATE_TOKEN not set');
    return NextResponse.json({ ok: false, error: 'Registration is not connected yet' }, { status: 503 });
  }

  const consent = Boolean(body.consent);
  const share = isSub && Boolean(body.share);

  const customFields = [
    ['company', company],
    ['trade', ans.trade],
    ['employees', isSub ? crewToGhl(ans.crew) : ''],
  ]
    .map(([k, v]) => ({ id: FIELDS[k], field_value: v }))
    .filter((f) => f.field_value);

  const ghl = makeGhl(token);

  let id;
  let isNew = false;
  let oldTags = [];
  try {
    const res = await ghl('/contacts/upsert', 'POST', {
      locationId: LOCATION_ID,
      firstName,
      lastName,
      email,
      ...(phone ? { phone } : {}),
      companyName: company,
      source: 'Builders Night 2027',
      customFields,
    });
    const data = await res.json().catch(() => ({}));
    id = data?.contact?.id;
    isNew = Boolean(data?.new);
    oldTags = (data?.contact?.tags || []).map(norm);
  } catch (err) {
    console.error('[builders-night] upsert error', err?.message);
  }
  if (!id) return NextResponse.json({ ok: false, error: 'GoHighLevel did not save it' }, { status: 502 });

  // Already registered for Builders Night? Then this is a repeat: same contact
  // (upsert matches on email), no second card, and a flag so it can be checked.
  // A sub whose answers now give a different result than last time is not
  // re-qualified automatically: they go to review instead of getting the pay link.
  const repeat = oldTags.includes(norm('builders-night-2027'));
  const wasQualified = oldTags.includes(norm('bn-qualified'));
  const wasNotQualified = oldTags.includes(norm('bn-not-qualified'));
  const review = repeat && isSub && ((result.qualified && wasNotQualified) || (!result.qualified && wasQualified));

  const tags = ['builders-night-2027'];
  if (repeat) tags.push('bn-registered-twice');
  if (isSub) {
    tags.push('bn-sub', `bn-trade-${slug(ans.trade === 'Other' && ans.tradeOther ? ans.tradeOther : ans.trade)}`);
    if (review) tags.push('bn-review');
    else if (result.qualified) tags.push('bn-qualified', `bn-tier-${result.tier}`);
    else tags.push('bn-not-qualified');
    if (ans.safety === 'COR' || ans.safety === 'SECOR') tags.push('bn-cor-secor');
    if (share) tags.push('bn-share-ok');
  } else if (role === 'supplier') {
    tags.push('bn-supplier', 'bn-supplier-table');
  } else {
    tags.push('bn-builder', role === 'table' ? 'bn-table-request' : 'bn-guest');
  }
  if (consent) tags.push('sms-consent-marketing', 'email-consent-marketing');

  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  const now = new Date().toISOString();
  const label = {
    sub: 'Subcontractor ticket application',
    table: 'Builder: wants a table',
    guest: 'Builder: guest ($25 a person)',
    supplier: 'Supplier: wants a supplier table ($750 + GST)',
  }[role];
  const body1 = isSub
    ? [
        `Result: ${result.qualified ? `QUALIFIED (${result.tier === 'top' ? 'top tier, $5M+ liability' : 'pass'})` : `NOT QUALIFIED: ${result.reasons.join(', ')}`}`,
        `Trade: ${[ans.trade, ans.tradeOther].filter(Boolean).join(': ')}`,
        `WCB Alberta: ${ans.wcb}`,
        `Liability insurance: ${ans.insurance}`,
        `People, counting their subs: ${ans.crew}`,
        `COR / SECOR: ${ans.safety || '-'}`,
        `Worked for GCs before: ${ans.gcWork || '-'}${ans.gcNames ? ` (${ans.gcNames})` : ''}`,
        `In business: ${ans.years || '-'}`,
        `Share with builders: ${share ? `yes (ticked "${SHARE_TEXT}" at ${now})` : 'no'}`,
        result.qualified ? 'Next: send the $25 payment link, then the QR ticket.' : 'Next: no ticket. Keep as a SubTrade lead.',
      ]
    : [
        `Coming: ${attending} ${attending === 1 ? 'person' : 'people'}`,
        team.length ? `Team: ${team.map((m) => `${m.firstName} ${m.lastName} <${m.email}>`).join(', ')}` : '',
        clean(a.message, 800) ? `Message: ${clean(a.message, 800)}` : '',
        role === 'table'
          ? 'Next: confirm the table by email if one is still free; if not, offer guest passes.'
          : role === 'supplier'
            ? 'Next: if one of the 5 supplier tables is still free, confirm it by email and send the $750 + GST invoice.'
            : `Next: send the $25 a person payment link (${attending} ${attending === 1 ? 'pass' : 'passes'}).`,
      ].filter(Boolean);
  const note = [
    ...(repeat
      ? [
          review
            ? 'REGISTERED AGAIN, ANSWERS CHANGED: the result is different from their first registration. Tagged bn-review, no payment link sent. Compare with the first note before qualifying them by hand.'
            : 'REGISTERED AGAIN with this email. Same contact, no second card; their card was left where it was.',
          '',
        ]
      : []),
    `Builders Night 2027: ${label}`,
    `Company: ${company}`,
    ...body1,
    '',
    consent
      ? `Consent record (${CONSENT_VERSION}): ticked "${CONSENT_TEXT}" at ${now}, IP ${ip}.`
      : 'No marketing consent ticked. Event emails about their registration only; no marketing email or texts.',
  ].join('\n');

  const jobs = [ghl(`/contacts/${id}/tags`, 'POST', { tags }), ghl(`/contacts/${id}/notes`, 'POST', { body: note })];

  // A brand-new contact who gave no consent gets SMS switched off, so no
  // workflow can text them by mistake. Existing contacts are left alone.
  if (isNew && !consent) {
    jobs.push(ghl(`/contacts/${id}`, 'PUT', { dndSettings: { SMS: { status: 'active', message: 'No SMS consent given on the Builders Night form' } } }));
  }

  const target = isSub
    ? await findStage(ghl, PIPELINE_NAMES.subs, result.qualified ? STAGE_NAMES.qualified : STAGE_NAMES.notQualified)
    : role === 'supplier'
      ? await findStage(ghl, PIPELINE_NAMES.suppliers, STAGE_NAMES.table)
      : await findStage(ghl, PIPELINE_NAMES.builders, role === 'table' ? STAGE_NAMES.table : STAGE_NAMES.guest);
  if (target && !repeat) {
    jobs.push(
      ghl('/opportunities/upsert', 'POST', {
        locationId: LOCATION_ID,
        pipelineId: target.pipelineId,
        contactId: id,
        name: `${firstName} ${lastName}, ${company}`.trim(),
        status: 'open',
        pipelineStageId: target.stageId,
      }),
    );
  }
  await Promise.allSettled(jobs);

  // The rest of the team: their own contacts, so the reminders reach them too.
  const teamTags = [...tags.filter((t) => t.startsWith('bn-') || t === 'builders-night-2027'), 'bn-team-member'];
  const teamNote = [
    `Builders Night 2027: ${label}`,
    `Company: ${company}`,
    `Coming with ${firstName} ${lastName} <${email}>, who registered the team on ${now}.`,
    '',
    'Added by a teammate, so no marketing consent from this person. Event emails about this registration only; no marketing email or texts.',
  ].join('\n');
  await Promise.allSettled(
    team.map(async (m) => {
      const r = await ghl('/contacts/upsert', 'POST', {
        locationId: LOCATION_ID,
        firstName: m.firstName,
        lastName: m.lastName,
        email: m.email,
        companyName: company,
        source: 'Builders Night 2027',
        customFields: customFields.filter((f) => f.id !== FIELDS.employees),
      });
      const d = await r.json().catch(() => ({}));
      const mateId = d?.contact?.id;
      if (!mateId) return;
      const mateJobs = [ghl(`/contacts/${mateId}/tags`, 'POST', { tags: teamTags }), ghl(`/contacts/${mateId}/notes`, 'POST', { body: teamNote })];
      if (d?.new) {
        mateJobs.push(ghl(`/contacts/${mateId}`, 'PUT', { dndSettings: { SMS: { status: 'active', message: 'Added by a teammate on the Builders Night form; no SMS consent' } } }));
      }
      await Promise.allSettled(mateJobs);
    }),
  );

  return NextResponse.json({
    ok: true,
    repeat,
    review,
    ...(isSub && !review ? { qualified: result.qualified, tier: result.tier } : {}),
  });
}
