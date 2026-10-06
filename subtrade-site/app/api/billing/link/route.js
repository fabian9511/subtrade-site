import { NextResponse } from 'next/server';
import { findSubscription, signToken, emailLink, issueLinkNonce } from '../../../../lib/billing';

/**
 * Step 1 of /billing/: the customer types their email; if it has a live
 * subscription we email a signed, one-time link (30 minutes). The answer is always the
 * same, so nobody can use this to find out who is a customer.
 *
 * On preview links (never production) the link is also returned, so the flow
 * can be tested without the email.
 */
const recent = new Map(); // email -> last request time (per server instance)

export async function POST(req) {
  if (!process.env.STRIPE_SECRET_KEY) return NextResponse.json({ ok: false, error: 'Billing is not set up yet.' }, { status: 503 });
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase().slice(0, 160) : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'Please enter a valid email.' }, { status: 400 });
  }
  const done = { ok: true, message: 'If that email has a SubTrade subscription, a secure link is on its way. Check your inbox (and spam).' };

  const preview = process.env.VERCEL_ENV !== 'production' && !/(^|\.)subtradesoftware\.com$/.test(new URL(req.url).hostname);
  const last = recent.get(email) || 0;
  if (!preview && Date.now() - last < 60e3) return NextResponse.json(done); // one email a minute (live site)
  recent.set(email, Date.now());

  const found = await findSubscription(email);
  if (!found) return NextResponse.json(done);

  const nonce = await issueLinkNonce(found.sub.id);
  if (!nonce) return NextResponse.json(done);
  const token = signToken({ sub: found.sub.id, cus: found.customer.id, step: 'email', n: nonce }, 30);
  // After "#", so the code is never sent to any server, analytics or referrer.
  const link = `${new URL(req.url).origin}/billing/manage/#t=${encodeURIComponent(token)}`;
  const sent = await emailLink(email, link);
  if (!sent) console.error('[billing/link] email not sent for', found.customer.id);

  return NextResponse.json(preview ? { ...done, previewLink: link, emailSent: sent } : done);
}
