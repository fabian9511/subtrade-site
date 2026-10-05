// Meta Conversions API (server-side events), so Facebook can optimize ads for
// trials and real payments, not just page visits. Ad blockers don't affect it.
//
// Needs META_CAPI_TOKEN (Events Manager → pixel → Settings → Conversions API →
// Generate access token). Without it every call is a no-op.
// Optional: META_PIXEL_ID (default: the site pixel), META_TEST_EVENT_CODE
// (Events Manager → Test events, to see events arrive while testing).

import crypto from 'node:crypto';

const PIXEL = process.env.META_PIXEL_ID || '1355581835968226';
const sha = (v) => (v ? crypto.createHash('sha256').update(String(v).trim().toLowerCase()).digest('hex') : undefined);

// Customer details in Meta's format (hashed where Meta requires it).
// Never phone numbers: Privacy Policy 6.4 (SMS/carrier rules) promises mobile
// information is not shared with third parties for marketing.
export function userData({ email, firstName, lastName, city, state, zip, country, fbp, fbc, ip, ua }) {
  const u = {
    em: email ? [sha(email)] : undefined,
    fn: firstName ? [sha(firstName)] : undefined,
    ln: lastName ? [sha(lastName)] : undefined,
    ct: city ? [sha(String(city).replace(/\s+/g, ''))] : undefined,
    st: state ? [sha(state)] : undefined,
    zp: zip ? [sha(String(zip).replace(/\s+/g, ''))] : undefined,
    country: country ? [sha(country)] : undefined,
    fbp: fbp || undefined,
    fbc: fbc || undefined,
    client_ip_address: ip || undefined,
    client_user_agent: ua || undefined,
  };
  return Object.fromEntries(Object.entries(u).filter(([, v]) => v !== undefined));
}

// Send one event. eventId lets Meta drop the duplicate when the browser pixel
// sends the same event with the same eventID.
export async function sendMetaEvent({ name, eventId, user, value, currency = 'CAD', url, extra = {} }) {
  const token = process.env.META_CAPI_TOKEN;
  if (!token) {
    console.log('[meta] skipped', name, '(no META_CAPI_TOKEN)');
    return { ok: false, reason: 'not configured' };
  }
  const body = {
    data: [
      {
        event_name: name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: 'website',
        event_source_url: url || 'https://subtradesoftware.com/start/',
        user_data: user,
        custom_data: { currency, ...(value != null ? { value: Math.round(value * 100) / 100 } : {}), ...extra },
      },
    ],
    ...(process.env.META_TEST_EVENT_CODE ? { test_event_code: process.env.META_TEST_EVENT_CODE } : {}),
  };
  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${PIXEL}/events?access_token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) console.error('[meta] event failed', name, res.status, data?.error?.message);
    else console.log('[meta] sent', name, eventId, 'received:', data?.events_received, data?.fbtrace_id || '');
    return { ok: res.ok };
  } catch (err) {
    console.error('[meta] unreachable', err?.message);
    return { ok: false };
  }
}

// Build user data from a Stripe customer + subscription metadata.
export function userFromStripe(customer = {}, meta = {}) {
  const a = customer.address || {};
  return userData({
    email: customer.email,
    firstName: meta.first_name,
    lastName: meta.last_name,
    city: a.city,
    state: a.state,
    zip: a.postal_code,
    country: a.country,
    fbp: meta.fbp,
    fbc: meta.fbc,
  });
}
