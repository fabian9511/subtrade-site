import Script from 'next/script';

export const metadata = {
  title: 'Free Construction Templates for Subcontractors',
  description:
    'Free downloadable templates for trade contractors: change orders, daily logs, timesheets, FLHA and safety forms, punch lists and progress billing.',
  alternates: { canonical: '/construction-templates/' },
};

const templates = [
  ['🧾', 'Change Order Template', 'Price and document extras before the work happens. Word format, ready to send.'],
  ['📝', 'Daily Log Template', 'Weather, manpower, work completed and delays on one page.'],
  ['⏱️', 'Timesheet Template', 'Weekly crew timesheet with job and cost code columns.'],
  ['🛡️', 'FLHA / Hazard Assessment', 'Field level hazard assessment form matching common Canadian requirements.'],
  ['✅', 'Punch List Template', 'Deficiency tracking with location, trade, photo reference and status.'],
  ['💵', 'Progress Billing Template', 'Percent-complete invoice layout with holdback line.'],
];

export default function Templates() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="wrap hero-inner">
          <p className="eyebrow">Free downloads</p>
          <h1 className="display" style={{ fontSize: 'clamp(40px,6.5vw,76px)' }}>
            Construction templates for subcontractors
          </h1>
          <p className="lede">
            The paperwork that protects your margin, as free Word templates. Fill
            in the form below and we&apos;ll email you the full pack of six.
          </p>
          <div className="hero-ctas">
            <a href="#get-templates" className="btn btn-primary btn-lg">Get the free pack</a>
          </div>
          <p className="hero-note">Six templates, Word format. No credit card, no trial required.</p>
        </div>
      </section>
      <div className="wrap"><div className="chalkline" /></div>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">What&apos;s in the pack</p>
            <h2 className="display">Six documents every sub needs</h2>
          </div>
          <div className="grid">
            {templates.map(([icon, t, b]) => (
              <div className="cell" key={t}>
                <span className="tpl-ico" aria-hidden="true">{icon}</span>
                <h3>{t}</h3>
                <p>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="get-templates" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="tpl-form-split">
            <div className="tpl-form-copy">
              <p className="eyebrow">Free download</p>
              <h2 className="display">Get all six templates</h2>
              <p>
                Tell us where to send them and the full pack lands in your inbox
                in a couple of minutes. Use them as-is on your next job.
              </p>
              <p className="tpl-form-note">
                Every one of these documents also exists as a live workflow inside
                SubTrade: change orders send from a phone, logs and timesheets fill
                from GPS clock-ins, and billing builds itself from field data.
              </p>
            </div>
            <div className="tpl-form-embed">
              <iframe
                src="https://api.leadconnectorhq.com/widget/form/rfDZ5s2vmxDYwfPlGkcT"
                style={{ width: '100%', height: '100%', minHeight: 1020, border: 'none', borderRadius: 3 }}
                id="inline-rfDZ5s2vmxDYwfPlGkcT"
                data-layout="{'id':'INLINE'}"
                data-trigger-type="alwaysShow"
                data-trigger-value=""
                data-activation-type="alwaysActivated"
                data-activation-value=""
                data-deactivation-type="neverDeactivate"
                data-deactivation-value=""
                data-form-name="Free Resources From"
                data-height="1020"
                data-layout-iframe-id="inline-rfDZ5s2vmxDYwfPlGkcT"
                data-form-id="rfDZ5s2vmxDYwfPlGkcT"
                title="Free Resources From"
              />
              <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="lazyOnload" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
