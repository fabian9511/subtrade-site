import { features, SIGNUP } from '../../lib/data';
import Link from 'next/link';
import { TOOL_COUNT, COMING_SOON } from '../../lib/tools';

export const metadata = {
  alternates: { canonical: '/construction-management-features/' },
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
            {TOOL_COUNT} tools, one login, no add-on pricing. Field, money and office
            covered for trade contractors.
          </p>
        </div>
      </section>
      <div className="wrap"><div className="chalkline" /></div>
      <section className="section">
        <div className="wrap">
          <div className="head-split">
            <div className="section-head">
              <p className="eyebrow">{TOOL_COUNT} tools, one login</p>
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
            <Link href="/tutorials/purchase-orders-approval" className="cell">
              <h3>Purchase Orders</h3>
              <p>Material committed against the job budget, with approvals from the field.</p>
            </Link>
          </div>

          <div className="soon-block">
            <div className="soon-block-head">
              <p className="eyebrow">On the way</p>
              <h2 className="display">Coming soon</h2>
            </div>
            <div className="soon-grid">
              {COMING_SOON.map(([, name, sub]) => (
                <div className="soon-card" key={name}>
                  <span className="soon-tag">Soon</span>
                  <h3>{name}</h3>
                  <p>{sub}</p>
                </div>
              ))}
            </div>
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
