import Calculator from '../../components/Calculator';

export const metadata = {
  title: 'Pricing',
  description:
    'SubTrade is $299/month CAD with 5 users included. Additional users from $4 to $15 each. Save 20% on annual billing. Free trial, no demo call.',
};

const PORTAL = 'https://portal.subtradesoftware.com';
const SIGNUP = 'https://portal.subtradesoftware.com/signup';

export default function Pricing() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="wrap hero-inner">
          <p className="eyebrow">Pricing that is on the page</p>
          <h1 className="display" style={{ fontSize: 'clamp(44px,7vw,84px)' }}>
            One plan.
            <br />
            The whole platform.
          </h1>
          <p className="lede">
            No feature tiers, no per-module pricing, no talking to sales to find
            out the number. Move the slider to your crew size and read the total.
          </p>
        </div>
      </section>

      <div className="wrap"><div className="chalkline" /></div>

      <section className="section">
        <div className="wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'flex-start' }}>
          <Calculator />
          <div style={{ flex: '1 1 320px', maxWidth: 480 }}>
            <p className="eyebrow">Every plan includes</p>
            <ul className="included" style={{ marginTop: 22 }}>
              <li>GPS Time Tracking</li>
              <li>Job costing</li>
              <li>Change Orders</li>
              <li>Progress Billing with holdback</li>
              <li>Purchase Orders</li>
              <li>Crew Scheduling</li>
              <li>Daily Logs</li>
              <li>GPS-tagged Photos</li>
              <li>Drawings & Markups</li>
              <li>Tasks & Punch Lists</li>
              <li>Submittals & RFIs</li>
              <li>Safety & Custom Forms</li>
              <li>Project Dashboard</li>
              <li>Unlimited projects</li>
            </ul>
            <p style={{ marginTop: 30, fontSize: 15, color: 'var(--steel-500)' }}>
              Prices in CAD. Annual billing saves 20% ($2,870/yr for the base
              plan). Cancel anytime during the free trial and pay nothing.
            </p>
            <img
              src="/subtrade-organized-multi-trade-jobsite.webp"
              alt="Foreman calmly overseeing a busy multi-trade commercial jobsite from his phone with SubTrade"
              className="media-inset"
              style={{ marginTop: 30, maxWidth: '100%', justifySelf: 'start' }}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap">
          <h2 className="display">The trial is the demo</h2>
          <p>Load a real project and see it for yourself.</p>
          <a href={SIGNUP} className="btn btn-primary btn-lg">
            Start free trial
          </a>
        </div>
      </section>
    </>
  );
}
