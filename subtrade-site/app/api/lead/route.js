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

// "FB Leads" pipeline. New funnel leads land in Opt In; anyone who says the
// price doesn't fit goes straight to Long Term Nurture. Every later move
// (booked, no-show, closed) is done by GoHighLevel workflows, not here.
const PIPELINE_ID = '3LUh3uJf0lWBoU7XmSr1';
const STAGE = {
  optIn: 'd8abc937-55d3-4ec7-a5fb-3d6566d48bac',
  nurture: 'd5971925-9733-4d53-b42d-87947cd27eaa',
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
  const firstName = clean(body.firstName, 60);
  const required = [firstName, clean(body.lastName), clean(body.phone), clean(body.company)];
  if (required.some((v) => !v) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
        phone: clean(body.phone, 30),
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
    if (id) {
      await fetch(`${GHL}/contacts/${id}/tags`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ tags }),
      }).catch(() => {});

      // One card per lead in the FB Leads pipeline (upsert, so no duplicates).
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
          pipelineStageId: a.price === 'No' ? STAGE.nurture : STAGE.optIn,
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
