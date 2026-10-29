import { NextResponse } from 'next/server';

/**
 * Lead capture for the Builder Expo booth page at /expo/.
 *
 * Visitors fill it in on their own phone (QR code at the booth), or Fabian
 * types them in on the iPad (staff mode). Every lead becomes a GoHighLevel
 * contact (matched on email, else phone), tagged builder-expo-2026, with all
 * answers as a note and one card in the "Builder Expo 2026" pipeline.
 *
 * The page keeps each lead on the device until this route says it was saved,
 * so a dead expo Wi-Fi only delays leads, it never loses them.
 *
 * Uses the same GHL_PRIVATE_TOKEN as the rest of the site.
 */

const GHL = 'https://services.leadconnectorhq.com';
const LOCATION_ID = process.env.GHL_LOCATION_ID || 'tvaEDkrxBWUrDUqzetBb';

// "Builder Expo 2026" pipeline, used only by this page. Its own pipeline, so
// none of the stage-triggered speed-to-lead or trial workflows fire for people
// Fabian has just spoken to in person.
// Later stages (Contacted, Demo booked, Trial started, Won – paying, Not a fit)
// are moved by hand.
const PIPELINE_ID = 'vpTfafN34efIUfV9MW2S';
const STAGES = {
  new: '88399393-a1ec-457a-ab5a-0850e0508bf9', // New – met at the expo
  hot: '2245a5e1-741d-4142-82ca-19bc0fd8a4de', // Hot – call this week
};

// Existing SubTrade custom fields in GoHighLevel. The pick-list values on the
// page match GoHighLevel's options exactly, or the whole upsert is refused.
const FIELDS = {
  trade: 'MwdJ9aMXpOGG0s72uXTW', // Your Trade
  employees: 'wO4QTXHZIZmIjCzaK1e6', // Number of Employees
  current: '2Zsao8Fuj0orjBrjrQGP', // How are you currently managing your construction projects?
  timeline: 'msNLRy4Ie7IDFbNeMEqx', // When are you planning to implement a new system?
  heard: 'lbWIwVStHiboFNlQw0qV', // Where did you hear about us? (single)
  company: 'Vptj9VI3AUb6rQR21GIR', // Organization Name
  role: 'VL3tWhtUJS8eU9vLt0CN', // Job Title:
  comments: 'y6ezvVcGsWi3yhbWBX2O', // Any additional comments or suggestions?
};

const PICK = {
  trade: ['Drywall / Framing', 'Electrical', 'Plumbing', 'HVAC / Mechanical', 'Concrete Forming', 'Painting', 'General Contractor', 'Other'],
  employees: ['1-5', '6-10', '11-20', '21-50', '50+'],
  timeline: ['Immediately', '1-3 months', '6+ Months'],
};

// Same folding as /start/: GoHighLevel's field only knows three buckets.
function currentBucket(software) {
  if (!software.length) return '';
  if (software.some((s) => !['Excel', 'QuickBooks', 'Pen & paper', 'Other'].includes(s))) return 'Another Construction Software';
  if (software.includes('Excel')) return 'SpreadSheets';
  if (software.includes('Pen & paper')) return 'Pen & Paper';
  return '';
}

// The exact consent wording shown on /expo/ (components/ExpoForm.jsx). Bump
// the version whenever that wording changes.
const CONSENT_VERSION = 'expo-2026-11-03';
const CONSENT_TEXT =
  'Yes, SubTrade Software Ltd can email and text me about SubTrade. Message & data rates may apply. Reply STOP to opt out of texts, unsubscribe any time.';

const clean = (v, max = 120) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const list = (v, max = 15) => (Array.isArray(v) ? v.map((x) => clean(x, 40)).filter(Boolean).slice(0, max) : []);

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 });
  }

  // Honeypot: real people never see or fill this field.
  if (clean(body.website)) return NextResponse.json({ ok: true, stored: true });

  const email = clean(body.email, 160).toLowerCase();
  const digits = clean(body.phone, 30).replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
  const phone = digits.length === 10 ? `+1${digits}` : '';
  const firstName = clean(body.firstName, 60);
  const lastName = clean(body.lastName, 60);
  const company = clean(body.company);
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!firstName || (!emailOk && !phone)) {
    return NextResponse.json({ ok: false, error: 'Name and a phone or email are needed' }, { status: 400 });
  }

  const token = process.env.GHL_PRIVATE_TOKEN;
  if (!token) {
    // Not "stored": the page keeps the lead and tries again later.
    console.warn('[expo-lead] GHL_PRIVATE_TOKEN not set — lead kept on the device');
    return NextResponse.json({ ok: false, error: 'Not connected' }, { status: 503 });
  }

  const a = body.answers || {};
  const software = list(a.software);
  const needs = list(a.needs);
  const staff = body.staff || {};
  const consent = Boolean(body.consent);
  const pick = (k) => (PICK[k].includes(a[k]) ? a[k] : '');

  const customFields = [
    ['company', company],
    ['trade', pick('trade')],
    ['employees', pick('employees')],
    ['current', currentBucket(software)],
    ['role', clean(a.role)],
    ['timeline', pick('timeline')],
    ['heard', 'Other'],
  ]
    .map(([k, v]) => ({ id: FIELDS[k], field_value: v }))
    .filter((f) => f.field_value);

  const headers = {
    Authorization: `Bearer ${token}`,
    Version: '2021-07-28',
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  const ghl = (path, method, payload) =>
    fetch(`${GHL}${path}`, { method, headers, body: JSON.stringify(payload) }).then(async (r) => {
      if (!r.ok) console.error(`[expo-lead] ${method} ${path.split('/').slice(0, 3).join('/')} failed`, r.status, (await r.text()).slice(0, 200));
      return r;
    });

  let id;
  let isNew = false;
  try {
    const res = await ghl('/contacts/upsert', 'POST', {
      locationId: LOCATION_ID,
      firstName,
      lastName,
      ...(emailOk ? { email } : {}),
      ...(phone ? { phone } : {}),
      companyName: company,
      source: 'Builder Expo 2026',
      customFields,
    });
    const data = await res.json().catch(() => ({}));
    id = data?.contact?.id;
    isNew = Boolean(data?.new);
  } catch (err) {
    console.error('[expo-lead] upsert error', err?.message);
  }
  if (!id) return NextResponse.json({ ok: false, error: 'GoHighLevel did not save it' }, { status: 502 });

  const tags = ['builder-expo-2026'];
  if (consent) tags.push('sms-consent-marketing', 'email-consent-marketing');
  software.forEach((t) => tags.push(`uses-${t.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`));

  const hot = staff.temp === 'Hot' || a.next === 'Book a demo';
  const by = clean(staff.by, 40);
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  const note = [
    `Builder Expo 2026 — ${by ? `entered by ${by} on the booth iPad` : 'filled in by the visitor (QR code)'}`,
    staff.temp ? `Lead: ${clean(staff.temp, 10)}` : '',
    `Company: ${company || '-'}`,
    `Trade: ${clean(a.trade) || '-'}`,
    `Role: ${clean(a.role) || '-'}`,
    `People: ${clean(a.employees) || '-'}`,
    `Uses now: ${software.join(', ') || '-'}`,
    `Wants help with: ${needs.join(', ') || '-'}`,
    `Wants a system: ${clean(a.timelineLabel) || '-'}`,
    `Next step they asked for: ${clean(a.next) || '-'}`,
    staff.notes ? `Booth notes: ${clean(staff.notes, 1500)}` : '',
    '',
    consent
      ? `Consent record (${CONSENT_VERSION}): ticked "${CONSENT_TEXT}" at ${new Date().toISOString()}, IP ${ip}${by ? `, entered by ${by}` : ''}.`
      : 'No email/SMS consent ticked — met in person at the expo (implied consent for 6 months under CASL; phone/personal follow-up only after that).',
  ].filter((l) => l !== '');

  // A brand-new contact who gave no consent gets SMS switched off, so no
  // workflow can text them by mistake. Existing contacts are left alone.
  const jobs = [
    ghl(`/contacts/${id}/tags`, 'POST', { tags }),
    ghl(`/contacts/${id}/notes`, 'POST', { body: note.join('\n') }),
  ];
  if (isNew && !consent) {
    jobs.push(ghl(`/contacts/${id}`, 'PUT', { dndSettings: { SMS: { status: 'active', message: 'No SMS consent given at Builder Expo 2026' } } }));
  }
  jobs.push(
    ghl('/opportunities/upsert', 'POST', {
      locationId: LOCATION_ID,
      pipelineId: PIPELINE_ID,
      contactId: id,
      name: `${firstName} ${lastName}${company ? ` — ${company}` : ''}`.trim(),
      status: 'open',
      pipelineStageId: hot ? STAGES.hot : STAGES.new,
    }),
  );
  await Promise.allSettled(jobs);

  return NextResponse.json({ ok: true, stored: true });
}
