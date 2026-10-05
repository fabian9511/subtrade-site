import { NextResponse } from 'next/server';
import { stripeGet, recordTrialStarted } from '../../../lib/stripeGhl';

/**
 * Called by /start/welcome/ right after Stripe checkout. Looks the checkout up
 * in Stripe itself (nothing from the browser is trusted beyond the session id)
 * and moves the lead's card to "Trial started".
 *
 * The Stripe webhook does the same; this covers preview links (which Stripe
 * cannot reach) and a slow webhook. Repeats are skipped in lib/stripeGhl.js.
 */
export async function POST(req) {
  if (!process.env.STRIPE_SECRET_KEY) return NextResponse.json({ ok: false, configured: false });
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const id = typeof body.sessionId === 'string' ? body.sessionId : '';
  if (!/^cs_(test|live)_[A-Za-z0-9]{10,200}$/.test(id)) return NextResponse.json({ ok: false }, { status: 400 });

  const session = await stripeGet(`checkout/sessions/${id}`);
  if (!session) return NextResponse.json({ ok: false }, { status: 404 });
  try {
    const result = await recordTrialStarted(session);
    return NextResponse.json(result);
  } catch (err) {
    console.error('[trial-started] failed', err?.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
