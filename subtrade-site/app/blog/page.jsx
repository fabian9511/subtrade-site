import { compares, SIGNUP } from '../../../lib/data';
import RelatedLinks from '../../../components/RelatedLinks';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const GUIDE = '/the-ultimate-guide-to-choosing-subcontractor-management-software-for-efficient-project-oversight';
const BEST = '/best-software-for-subcontractors-comparing-top-tools-for-2025-to-boost-efficiency-and-project-management';

export const dynamicParams = false;
export function generateStaticParams() {
  return compares.map((c) => ({ slug: c.slug }));
}
export function generateMetadata({ params }) {
  const c = compares.find((x) => x.slug === params.slug);
  if (!c) return {};
  const title = c.headline
    ? `SubTrade vs ${c.competitor}: ${c.headline}`
    : `SubTrade vs ${c.competitor}`;
  return {
    title,
    description: (c.positioning || '').slice(0, 155),
    alternates: { canonical: `/compare/${c.slug}/` },
  };
}

export default function ComparePage({ params }) {
  const c = compares.find((x) => x.slug === params.slug);
  if (!c) notFound();
  const relatedGroups = [
    {
      label: 'Compare SubTrade with other tools',
      links: compares
        .filter((x) => x.slug !== c.slug)
        .map((o) => ({ href: `/compare/${o.slug}`, label: `vs ${o.competitor}` })),
    },
    {
      label: 'Go deeper',
      links: [
        { href: BEST, label: 'Best software for subs' },
        { href: GUIDE, label: 'How to choose' },
        { href: '/pricing-plans', label: 'Pricing' },
      ],
    },
  ];
  const heroTitle = c.headline
    ? `SubTrade vs ${c.competitor}: ${c.headline}`
    : `SubTrade vs ${c.competitor}`;

  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="wrap hero-inner">
          <p className="eyebrow">{c.eyebrow || 'Comparison'}</p>
          <h1 className="display" style={{ fontSize: 'clamp(36px,5.5vw,68px)' }}>
            {heroTitle}
          </h1>
          <p className="lede">{c.positioning}</p>
          <div className="hero-ctas">
            <a href={SIGNUP} className="btn btn-primary btn-lg">
              Start your free trial
            </a>
            <a href="#at-a-glance" className="btn btn-ghost btn-lg">
              See the comparison
            </a>
          </div>
          {c.heroNote && <p className="hero-note">{c.heroNote}</p>}
        </div>
      </section>

      <div className="wrap"><div className="chalkline" /></div>

      {c.shortAnswer && (
        <section className="section" style={{ paddingBottom: 0 }}>
          <div className="wrap">
            <div className="section-head" style={{ marginBottom: 32 }}>
              <p className="eyebrow">The short answer</p>
              <h2 className="display">Which one fits you</h2>
            </div>
            <div className="cmp-short">
              <div className="cmp-ans">
                <span className="cmp-ans-h">{c.shortAnswer.them[0]}</span>
                <p>{c.shortAnswer.them[1]}</p>
              </div>
              <div className="cmp-ans cmp-ans-us">
                <span className="cmp-ans-h">{c.shortAnswer.us[0]}</span>
                <p>{c.shortAnswer.us[1]}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {c.table && (
        <section className="section" id="at-a-glance">
          <div className="wrap">
            <div className="section-head" style={{ marginBottom: 28 }}>
              <p className="eyebrow">The spec sheet</p>
              <h2 className="display">At a glance</h2>
              {c.glanceIntro && <p>{c.glanceIntro}</p>}
            </div>
            <div className="cmp-table-wrap">
              <table className="cmp-table">
                <thead>
                  <tr>
                    <th aria-hidden="true"></th>
                    <th className="us">SubTrade</th>
                    <th>{c.competitor}</th>
                  </tr>
                </thead>
                <tbody>
                  {c.table.map(([label, sub, comp]) => (
                    <tr key={label}>
                      <th scope="row">{label}</th>
                      <td className="us">
                        <span className="tick" aria-hidden="true">✓</span>
                        <span>{sub}</span>
                      </td>
                      <td>{comp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {c.tableNote && <p className="cmp-fineprint">{c.tableNote}</p>}
          </div>
        </section>
      )}

      {c.wins && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">Built for your side of the job</p>
              <h2 className="display">Where SubTrade wins for subcontractors</h2>
              {c.winsIntro && <p>{c.winsIntro}</p>}
            </div>
            <div className="cmp-wins">
              {c.wins.map(([t, b]) => (
                <div className="cmp-win" key={t}>
                  <h3>{t}</h3>
                  <p>{b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {c.theirWins && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="cmp-credit">
              <p className="eyebrow">In fairness</p>
              <h2
                className="display"
                style={{ fontSize: 'clamp(26px,3.4vw,38px)', margin: '12px 0 14px' }}
              >
                {c.theirWinsTitle || `Where ${c.competitor} wins`}
              </h2>
              <p>{c.theirWins}</p>
            </div>
          </div>
        </section>
      )}

      {c.pricingBody && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">Pricing comparison</p>
              <h2 className="display">What you actually pay</h2>
            </div>
            <div className="cmp-pricing">
              {c.pricingBody.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {c.pricingTagline && <p className="cmp-pricing-tag">{c.pricingTagline}</p>}
            </div>
          </div>
        </section>
      )}

      {c.chooseList && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="cmp-choose">
              <h2
                className="display"
                style={{ fontSize: 'clamp(26px,3.4vw,40px)', marginBottom: 22 }}
              >
                {c.chooseHeading || 'Who should choose SubTrade?'}
              </h2>
              <ul>
                {c.chooseList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <a href={SIGNUP} className="btn btn-primary btn-lg">
                Start your free trial
              </a>
            </div>
          </div>
        </section>
      )}

      {c.faq && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">Questions, answered straight</p>
              <h2 className="display">SubTrade vs {c.competitor} FAQ</h2>
            </div>
            <div className="cmp-faq">
              {c.faq.map(([q, a]) => (
                <div className="cmp-qa" key={q}>
                  <h3>{q}</h3>
                  <p>{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {!c.table && c.differences && (
        <section className="section">
          <div className="wrap">
            <div className="workflow">
              {c.differences.map(([t, b]) => (
                <div
                  className="step"
                  key={t}
                  style={{ gridTemplateColumns: '1fr 1.6fr' }}
                >
                  <h3>{t}</h3>
                  <p>{b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <RelatedLinks groups={relatedGroups} />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <p className="cmp-fineprint">
            Comparisons reflect general product positioning and publicly available
            information; check each vendor for current features and pricing.{' '}
            {c.competitor} is a trademark of its respective owner.
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
