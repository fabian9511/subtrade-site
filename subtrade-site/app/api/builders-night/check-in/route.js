import { NextResponse } from 'next/server';
import { LOCATION_ID, STAGE_NAMES, makeGhl, buildersNightPipelines, norm } from '../../../../lib/buildersNightGhl';

/**
 * Door check-in for SubTrade Builders Night (/builders-night/check-in/).
 *
 * A QR poster at the door opens the check-in page and people type the email
 * they registered with. If that email is a Builders Night contact in
 * GoHighLevel (tag builders-night-2027), this:
 *   - adds the tag bn-attended and a note with the time they came in
 *   - moves their Builders Night pipeline card to the "Checked in" stage
 * Subs tagged bn-not-qualified are not checked in; the page sends them to the
 * check-in table instead.
 *
 * After the event: everyone confirmed who has no bn-attended tag is a no-show.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 });
  }
  const email = (typeof body.email === 'string' ? body.email.trim().slice(0, 160) : '').toLowerCase();
  if (!EMAIL_RE.test(email)) return NextResponse.json({ ok: false, error: 'Please enter a valid email' }, { status: 400 });

  const token = process.env.GHL_PRIVATE_TOKEN;
  if (!token) {
    console.warn('[builders-night check-in] GHL_PRIVATE_TOKEN not set');
    return NextResponse.json({ ok: false, error: 'Check-in is not connected yet' }, { status: 503 });
  }
  const ghl = makeGhl(token, '[builders-night check-in]');

  let contact;
  try {
    const r = await ghl(`/contacts/search/duplicate?locationId=${LOCATION_ID}&email=${encodeURIComponent(email)}`, 'GET');
    contact = (await r.json().catch(() => ({})))?.contact;
  } catch (err) {
    console.error('[builders-night check-in] lookup error', err?.message);
    return NextResponse.json({ ok: false, error: 'Could not reach GoHighLevel' }, { status: 502 });
  }

  const tags = (contact?.tags || []).map(norm);
  if (!contact?.id || !tags.includes(norm('builders-night-2027'))) return NextResponse.json({ ok: true, status: 'not-found' });
  const firstName = cap(contact.firstNameRaw || contact.firstName || '');
  if (tags.includes(norm('bn-not-qualified'))) return NextResponse.json({ ok: true, status: 'not-qualified', firstName });
  if (tags.includes(norm('bn-attended'))) return NextResponse.json({ ok: true, status: 'already', firstName });

  const at = new Date().toLocaleString('en-CA', { timeZone: 'America/Edmonton', dateStyle: 'medium', timeStyle: 'short' });
  const jobs = [
    ghl(`/contacts/${contact.id}/tags`, 'POST', { tags: ['bn-attended'] }),
    ghl(`/contacts/${contact.id}/notes`, 'POST', { body: `Builders Night 2027: checked in at the door, ${at}` }),
  ];

  // Move their Builders Night card(s) to "Checked in". Cards in other pipelines are left alone.
  try {
    const [pipes, r] = await Promise.all([
      buildersNightPipelines(ghl),
      ghl(`/opportunities/search?location_id=${LOCATION_ID}&contact_id=${contact.id}`, 'GET'),
    ]);
    const opps = (await r.json().catch(() => ({})))?.opportunities || [];
    for (const o of opps) {
      const pipe = pipes.find((p) => p.id === o.pipelineId);
      const stage = pipe?.stages?.find((s) => norm(s.name) === norm(STAGE_NAMES.checkedIn));
      if (stage && o.pipelineStageId !== stage.id) jobs.push(ghl(`/opportunities/${o.id}`, 'PUT', { pipelineStageId: stage.id }));
    }
  } catch (err) {
    console.error('[builders-night check-in] pipeline move error', err?.message);
  }
  await Promise.allSettled(jobs);

  return NextResponse.json({ ok: true, status: 'checked-in', firstName });
}
