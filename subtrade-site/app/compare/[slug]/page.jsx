import { compares, SIGNUP } from '../../../lib/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamicParams = false;
export function generateStaticParams() {
  return compares.map((c) => ({ slug: c.slug }));
}
export function generateMetadata({ params }) {
  const c = compares.find((x) => x.slug === params.slug);
  if (!c) return {};
  return {
    title: `SubTrade vs ${c.competitor}: Which Fits Trade Subcontractors?`,
    description: c.positioning.slice(0, 155),
  };
}

export default function ComparePage({ params }) {
  const c = compares.find((x) => x.slug === params.slug);
  if (!c) notFound();
  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="wrap hero-inner">
          <p className="eyebrow">Comparison</p>
          <h1 className="display" style={{ fontSize: 'clamp(40px,6.5vw,76px)' }}>
            SubTrade vs {c.competitor}
          </h1>
          <p className="lede">{c.positioning}</p>
          <div className="hero-ctas">
            <a href={SIGNUP} className="btn btn-primary btn-lg">Try SubTrade free</a>
            <Link href="/pricing-plans" className="btn btn-ghost btn-lg">See pricing</Link>
          </div>
        </div>
      </section>
      <div className="wrap"><div className="chalkline" /></div>
      <section className="section">
        <div className="wrap">
          <div className="workflow">
            {c.differences.map(([t, b]) => (
              <div className="step" key={t} style={{ gridTemplateColumns: '1fr 1.6fr' }}>
                <h3>{t}</h3>
                <p>{b}</p>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 40, fontSize: 14, color: 'var(--steel-500)' }}>
            Comparisons reflect general product positioning. Check each vendor for
            current features and pricing. {c.competitor} is a trademark of its
            respective owner.
          </p>
        </div>
      </section>
      <section className="cta-band">
        <div className="wrap">
          <h2 className="display">Decide on a real job</h2>
          <p>14-day free trial, full platform, no credit card.</p>
          <a href={SIGNUP} className="btn btn-primary btn-lg">Start free trial</a>
        </div>
      </section>
    </>
  );
}
