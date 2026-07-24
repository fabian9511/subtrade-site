import { features, trades, SIGNUP } from '../../../lib/data';
import RichFeature from '../../../components/RichFeature';
import RelatedLinks from '../../../components/RelatedLinks';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const GUIDE = '/the-ultimate-guide-to-choosing-subcontractor-management-software-for-efficient-project-oversight';

export const dynamicParams = false;
export function generateStaticParams() {
  return features.map((f) => ({ slug: f.slug }));
}
export function generateMetadata({ params }) {
  const f = features.find((x) => x.slug === params.slug);
  if (!f) return {};
  return { title: f.title, description: f.description };
}

export default function FeaturePage({ params }) {
  const f = features.find((x) => x.slug === params.slug);
  if (!f) notFound();
  const relatedGroups = [
    {
      label: 'More features',
      links: features
        .filter((x) => x.slug !== f.slug)
        .slice(0, 8)
        .map((x) => ({ href: `/construction-management-features/${x.slug}`, label: x.name })),
    },
    {
      label: 'Built for your trade',
      links: trades.map((tr) => ({ href: `/${tr.slug}`, label: tr.trade })),
    },
    {
      label: 'Compare & learn',
      links: [
        { href: '/compare', label: 'All comparisons' },
        { href: GUIDE, label: 'How to choose software' },
        { href: '/pricing-plans', label: 'Pricing' },
      ],
    },
  ];
  return (
    <>
      {f.rich && <RichFeature f={f} />}
      {!f.rich && (
        <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="wrap hero-inner">
          <p className="eyebrow">{f.name} · SubTrade feature</p>
          <h1 className="display" style={{ fontSize: 'clamp(40px,6.5vw,76px)' }}>{f.h1}</h1>
          <p className="lede">{f.intro}</p>
          <div className="hero-ctas">
            <a href={SIGNUP} className="btn btn-primary btn-lg">Start free trial</a>
            <Link href="/pricing-plans" className="btn btn-ghost btn-lg">See pricing</Link>
          </div>
        </div>
      </section>
      <div className="wrap"><div className="chalkline" /></div>
      <section className="section">
        <div className="wrap">
          {f.image && (
            <div className="head-split">
              <div className="section-head">
                <p className="eyebrow">In the field</p>
                <h2 className="display">How {f.name.toLowerCase()} works on site</h2>
              </div>
              <img src={f.image} alt={f.imageAlt || f.name} className="media-inset" loading="lazy" />
            </div>
          )}
          <div className="workflow">
            {f.points.map(([t, b]) => (
              <div className="step" key={t} style={{ gridTemplateColumns: '1fr 1.6fr' }}>
                <h3>{t}</h3>
                <p>{b}</p>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 40, color: 'var(--steel-400)' }}>
            {f.name} is included in every SubTrade plan alongside the full platform.{' '}
            <Link href="/construction-management-features" style={{ color: 'var(--chalk)' }}>
              See all features
            </Link>
          </p>
        </div>
      </section>
      <section className="cta-band">
        <div className="wrap">
          <h2 className="display">Try it on a real job</h2>
          <p>Full platform, 14-day free trial, no credit card.</p>
          <a href={SIGNUP} className="btn btn-primary btn-lg">Start free trial</a>
        </div>
      </section>
        </>
      )}
      <RelatedLinks groups={relatedGroups} />
    </>
  );
}
