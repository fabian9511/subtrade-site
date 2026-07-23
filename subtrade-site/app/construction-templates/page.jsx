import { SIGNUP } from '../../lib/data';

export const metadata = {
  title: 'Free Construction Templates for Subcontractors',
  description:
    'Free downloadable templates for trade contractors: change orders, daily logs, timesheets, FLHA and safety forms, punch lists and progress billing.',
};

const templates = [
  ['Change Order Template', 'Price and document extras before the work happens. Word format, ready to send.'],
  ['Daily Log Template', 'Weather, manpower, work completed and delays on one page.'],
  ['Timesheet Template', 'Weekly crew timesheet with job and cost code columns.'],
  ['FLHA / Hazard Assessment', 'Field level hazard assessment form matching common Canadian requirements.'],
  ['Punch List Template', 'Deficiency tracking with location, trade, photo reference and status.'],
  ['Progress Billing Template', 'Percent-complete invoice layout with holdback line.'],
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
            The paperwork that protects your margin, as free templates. Use them
            as-is, or see what happens when the same documents fill themselves
            out from field data.
          </p>
          <div className="hero-ctas">
            <a href={SIGNUP} className="btn btn-primary btn-lg">Get templates + free trial</a>
          </div>
          <p className="hero-note">Templates are included with the free trial. No credit card required.</p>
        </div>
      </section>
      <div className="wrap"><div className="chalkline" /></div>
      <section className="section">
        <div className="wrap">
          <div className="grid">
            {templates.map(([t, b]) => (
              <div className="cell" key={t}>
                <h3>{t}</h3>
                <p>{b}</p>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 36, color: 'var(--steel-400)' }}>
            Every one of these documents exists as a live workflow inside
            SubTrade: change orders send from a phone, logs and timesheets fill
            from GPS clock-ins, and billing builds itself from field data.
          </p>
        </div>
      </section>
    </>
  );
}
