import { compares, SIGNUP } from '../../lib/data';
import Link from 'next/link';

export const metadata = {
  title: 'Compare SubTrade to Other Construction Software',
  description:
    'How SubTrade compares to Fieldwire, Buildertrend, eSUB, Contractor Foreman, Raken and Knowify for trade subcontractors.',
};

export default function CompareHub() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="wrap hero-inner">
          <p className="eyebrow">Honest comparisons</p>
          <h1 className="display" style={{ fontSize: 'clamp(44px,7vw,84px)' }}>
            How SubTrade<br />stacks up
          </h1>
          <p className="lede">
            Most construction software is built for GCs or builders. Here is how
            SubTrade compares to the tools subs usually shortlist, and where each
            one fits.
          </p>
        </div>
      </section>
      <div className="wrap"><div className="chalkline" /></div>
      <section className="section">
        <div className="wrap">
          <div className="grid">
            {compares.map((c) => (
              <Link href={`/compare/${c.slug}`} className="cell" key={c.slug}>
                <h3>SubTrade vs {c.competitor}</h3>
                <p>{c.positioning.split('.')[0]}.</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="cta-band">
        <div className="wrap">
          <h2 className="display">The trial beats the comparison</h2>
          <p>Load a real project into SubTrade and judge for yourself. 14 days free.</p>
          <a href={SIGNUP} className="btn btn-primary btn-lg">Start free trial</a>
        </div>
      </section>
    </>
  );
}
