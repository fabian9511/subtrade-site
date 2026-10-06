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
  bankSetupUrl,
  listInvoices,
  consumeLinkNonce,
  startPaidNow,
  changePlan,
  REASONS,
} from '../../../../lib/billing';

/**
 * /billing/manage/ calls this with the signed token from the email link.
 *   action: "view"   → plan summary (and a fresh 60-minute page token)
 *           "save"   → accept the save offer
 *           "cancel" → cancel at the end of the paid period (reason, comment)
 *           "undo"   → undo a cancellation
 *           "start"  → end the free trial now and start the paid plan
 *           "change" → change users / monthly→yearly (users, plan)
 *           "card"   → Stripe's secure page to change the card
 *           "bank"   → Stripe's secure page to switch to bank debit (PAD)
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
  const p = readToken(body.token);
  const expired = NextResponse.json(
    { ok: false, expired: true, error: 'This link has expired or was already used. Ask for a new one below.' },
    { status: 401 },
  );
  if (p.step === 'email') {
    // The emailed link opens the page once; everything after uses the page token.
    if (body.action !== 'view' || !(await consumeLinkNonce(sub, p.n))) return expired;
  } else if (p.step !== 'page') return expired;
  const reason = REASONS[body.reason] ? body.reason : 'other';
  const comment = typeof body.comment === 'string' ? body.comment.trim().slice(0, 500) : '';

  switch (body.action) {
    case 'view': {
      // Swap the 30-minute email token for a 60-minute page token.
      const token = p.step === 'email' ? signToken({ sub: p.sub, cus: p.cus, step: 'page' }, 60) : body.token;
      return NextResponse.json({ ok: true, token, summary: summarize(sub), invoices: await listInvoices(sub) });
    }
    case 'save': {
      const r = await acceptOffer(sub, { reason, comment });
      if (!r.ok) return NextResponse.json(r, { status: 409 });
      return NextResponse.json({ ...r, summary: summarize((await loadFromToken(body.token)) || sub) });
    }
    case 'change': {
      const r = await changePlan(sub, { users: body.users, plan: body.plan });
      if (!r.ok) return NextResponse.json(r, { status: 409 });
      const fresh = (await loadFromToken(body.token)) || sub;
      return NextResponse.json({ ...r, summary: summarize(fresh), invoices: await listInvoices(fresh) });
    }
    case 'start': {
      const r = await startPaidNow(sub);
      if (!r.ok) return NextResponse.json(r, { status: 409 });
      return NextResponse.json({ ok: true, summary: summarize((await loadFromToken(body.token)) || sub) });
    }
    case 'cancel':
      return NextResponse.json(await cancelAtPeriodEnd(sub, { reason, comment }));
    case 'undo':
      return NextResponse.json(await undoCancel(sub));
    case 'card': {
      // Come straight back to this subscription page (fresh 60-minute page
      // token), not to the "enter your email" page.
      const origin = new URL(req.url).origin;
      const pageToken = encodeURIComponent(signToken({ sub: p.sub, cus: p.cus, step: 'page' }, 60));
      const url =
        (await cardUpdateUrl(sub, `${origin}/billing/manage/#t=${pageToken}&back=1`)) ||
        (await cardUpdateUrl(sub, `${origin}/billing/manage/?t=${pageToken}&back=1`));
      return url
        ? NextResponse.json({ ok: true, url })
        : NextResponse.json({ ok: false, error: 'Card updates are not switched on yet. Email support@subtradesoftware.com.' }, { status: 503 });
    }
    case 'bank': {
      const back = `${new URL(req.url).origin}/billing/`;
      const url = await bankSetupUrl(sub, back);
      return url
        ? NextResponse.json({ ok: true, url })
        : NextResponse.json({ ok: false, error: 'Bank debit is not switched on yet. Email support@subtradesoftware.com.' }, { status: 503 });
    }
    default:
      return NextResponse.json({ ok: false }, { status: 400 });
  }
}
