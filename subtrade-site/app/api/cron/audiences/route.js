import { NextResponse } from 'next/server';
import { syncAudiences } from '../../../../lib/audiences';

/**
 * Daily: GoHighLevel contacts -> Facebook Custom Audiences (hashed emails
 * only). Run by Vercel Cron (vercel.json). On production it needs the
 * CRON_SECRET that Vercel sends; preview deployments are already behind
 * Vercel's login, so they can be run by hand for testing.
 */
export const maxDuration = 60;
export const dynamic = 'force-dynamic'; // never prerender: it talks to GHL and Meta

export async function GET(req) {
  if (process.env.VERCEL_ENV === 'production') {
    const ok = process.env.CRON_SECRET && req.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`;
    if (!ok) return NextResponse.json({ ok: false }, { status: 401 });
  }
  try {
    return NextResponse.json(await syncAudiences());
  } catch (err) {
    console.error('[audiences] failed', err?.message);
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 });
  }
}
