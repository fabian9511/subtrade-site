import { features, SIGNUP } from '../../lib/data';
import Link from 'next/link';

export const metadata = {
  title: 'Construction Management Features for Subcontractors',
  description:
    'Every SubTrade feature: GPS time tracking, change orders, crew scheduling, daily logs, drawings, submittals, safety forms and progress billing for trade contractors.',
};

export default function FeaturesHub() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="wrap hero-inner">
          <p className="eyebrow">The full platform, every plan</p>
          <h1 className="display" style={{ fontSize: 'clamp(44px,7vw,84px)' }}>
            Built for how<br />subs actually work
          </h1>
          <p className="lede">
            Thirteen tools, one login, no add-on pricing. Field, money and office
            covered for trade contractors.
          </p>
        </div>
      </section>
      <div className="wrap"><div className="chalkline" /></div>
      <section className="section">
        <div className="wrap">
          <div className="head-split">
            <div className="section-head">
              <p className="eyebrow">Thirteen tools, one login</p>
              <h2 className="display">Everything on one screen</h2>
            </div>
            <img
              src="/subtrade-worker-capturing-site-photo-wide.webp"
              alt="Worker in a SubTrade shirt capturing site photos in the SubTrade app"
              className="media-inset"
              loading="lazy"
            />
          </div>
          <div className="grid">
            {features.map((f) => (
              <Link href={`/construction-management-features/${f.slug}`} className="cell" key={f.slug}>
                <h3>{f.name}</h3>
                <p>{f.description.split('.')[0]}.</p>
              </Link>
            ))}
            <Link href="/time-tracking" className="cell">
              <h3>Time Tracking</h3>
              <p>GPS clock-in with live job costing per project.</p>
            </Link>
          </div>
        </div>
      </section>
      <section className="cta-band">
        <div className="wrap">
          <h2 className="display">Try all of it, free</h2>
          <p>Full platform on the 14-day trial. No feature gates, no demo call required.</p>
          <a href={SIGNUP} className="btn btn-primary btn-lg">Start free trial</a>
        </div>
      </section>
    </>
  );
}
