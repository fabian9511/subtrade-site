import { trades, SIGNUP } from '../../lib/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamicParams = false;
export function generateStaticParams() {
  return trades.map((t) => ({ trade: t.slug }));
}
export function generateMetadata({ params }) {
  const t = trades.find((x) => x.slug === params.trade);
  if (!t) return {};
  return { title: `${t.title} | SubTrade`, description: t.description };
}

export default function TradePage({ params }) {
  const t = trades.find((x) => x.slug === params.trade);
  if (!t) notFound();
  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="wrap hero-inner">
          <p className="eyebrow">{t.trade} contractor software</p>
          <h1 className="display" style={{ fontSize: 'clamp(40px,6.5vw,76px)' }}>{t.h1}</h1>
          <p className="lede">{t.intro}</p>
          <div className="hero-ctas">
            <a href={SIGNUP} className="btn btn-primary btn-lg">Start free trial</a>
            <Link href="/pricing-plans" className="btn btn-ghost btn-lg">See pricing</Link>
          </div>
          <p className="hero-note">14-day free trial · $299/month CAD · 5 users included · No credit card</p>
        </div>
      </section>
      <div className="wrap"><div className="chalkline" /></div>
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Sound familiar</p>
            <h2 className="display">Where {t.trade.toLowerCase()} subs lose money</h2>
          </div>
          <div className="workflow">
            {t.pains.map((p) => (
              <div className="step" key={p} style={{ gridTemplateColumns: '1fr' }}>
                <p style={{ fontSize: 17 }}>✕&nbsp;&nbsp;{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">The fix</p>
            <h2 className="display">What SubTrade changes</h2>
          </div>
          <div className="workflow">
            {t.wins.map((w) => (
              <div className="step" key={w} style={{ gridTemplateColumns: '1fr' }}>
                <p style={{ fontSize: 17, color: 'var(--steel-300)' }}>
                  <b style={{ color: 'var(--chalk)' }}>✓</b>&nbsp;&nbsp;{w}
                </p>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 40, color: 'var(--steel-400)' }}>
            Every tool above is included in one plan.{' '}
            <Link href="/construction-management-features" style={{ color: 'var(--chalk)' }}>
              See all 13 features
            </Link>
          </p>
        </div>
      </section>
      <section className="cta-band">
        <div className="wrap">
          <h2 className="display">Run your next {t.trade.toLowerCase()} job on it</h2>
          <p>Built by a working subcontractor. 14-day free trial, no credit card.</p>
          <a href={SIGNUP} className="btn btn-primary btn-lg">Start free trial</a>
        </div>
      </section>
    </>
  );
}
