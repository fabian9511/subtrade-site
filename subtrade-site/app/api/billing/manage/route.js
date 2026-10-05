import { NextResponse } from 'next/server';
import {
  loadFromToken,
  readToken,
  signToken,
  summarize,
  acceptOffer,
  cancelAtPeriodEnd,
  undoCancel,
  cardUpdateUrl,
  REASONS,
} from '../../../../lib/billing';

/**
 * /billing/manage/ calls this with the signed token from the email link.
 *   action: "view"   → plan summary (and a fresh 60-minute page token)
 *           "save"   → accept the save offer
 *           "cancel" → cancel at the end of the paid period (reason, comment)
 *           "undo"   → undo a cancellation
 *           "card"   → Stripe's secure page to change the card
 */
export async function POST(req) {
  if (!process.env.STRIPE_SECRET_KEY) return NextResponse.json({ ok: false, error: 'Billing is not set up yet.' }, { status: 503 });
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const sub = await loadFromToken(body.token);
  if (!sub) {
    return NextResponse.json(
      { ok: false, expired: true, error: 'This link has expired. Ask for a new one below.' },
      { status: 401 },
    );
  }
  const reason = REASONS[body.reason] ? body.reason : 'other';
  const comment = typeof body.comment === 'string' ? body.comment.trim().slice(0, 500) : '';

  switch (body.action) {
    case 'view': {
      const p = readToken(body.token);
      // Swap the 30-minute email token for a 60-minute page token.
      const token = p.step === 'email' ? signToken({ sub: p.sub, cus: p.cus, step: 'page' }, 60) : body.token;
      return NextResponse.json({ ok: true, token, summary: summarize(sub) });
    }
    case 'save': {
      const r = await acceptOffer(sub, { reason, comment });
      if (!r.ok) return NextResponse.json(r, { status: 409 });
      return NextResponse.json({ ok: true, summary: summarize((await loadFromToken(body.token)) || sub) });
    }
    case 'cancel':
      return NextResponse.json(await cancelAtPeriodEnd(sub, { reason, comment }));
    case 'undo':
      return NextResponse.json(await undoCancel(sub));
    case 'card': {
      const back = `${new URL(req.url).origin}/billing/`;
      const url = await cardUpdateUrl(sub, back);
      return url
        ? NextResponse.json({ ok: true, url })
        : NextResponse.json({ ok: false, error: 'Card updates are not switched on yet. Email support@subtradesoftware.com.' }, { status: 503 });
    }
    default:
      return NextResponse.json({ ok: false }, { status: 400 });
  }
}
