import Link from 'next/link';

export default function AppShowcase() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head" style={{ maxWidth: 720, marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>
          <p className="eyebrow" style={{ justifyContent: 'center' }}>Inside the app</p>
          <h2 className="display" style={{ paddingBottom: 18 }}>One app runs the whole job</h2>
        </div>
        <div className="hub">
          <div className="hub-col hub-left">
            <div className="sc-block">
              <h3>Field data, live</h3>
              <p>
                Clock-ins, <Link href="/construction-management-features/site-photos">GPS photos</Link> and{' '}
                <Link href="/construction-management-features/daily-logs">daily logs</Link> flow from crew
                phones to your dashboard as the day happens.
              </p>
            </div>
            <div className="sc-block">
              <h3>Extras captured, not eaten</h3>
              <p>
                <Link href="/construction-management-features/change-order-management">Change orders</Link> priced
                and sent before the work is done, carried straight into billing.
              </p>
            </div>
          </div>

          <div className="iphone">
            <span className="island" aria-hidden="true" />
            <img
              src="/subtrade-app-project-tools-home.webp"
              alt="SubTrade mobile app project home screen showing synced status and tools: Timer, Gallery, Forms, Drawings, Submittals, Daily Logs, Documents, Tasks, RFIs, COs and POs"
              className="iphone-shot"
              loading="lazy"
              width="640"
              height="1387"
            />
          </div>

          <div className="hub-col hub-right">
            <div className="sc-block">
              <h3>Crews on rails</h3>
              <p>
                <Link href="/construction-management-features/construction-crew-scheduling">Drag-and-drop scheduling</Link> and{' '}
                <Link href="/construction-management-features/task-management">punch lists</Link> that actually
                close, across every active site.
              </p>
            </div>
            <div className="sc-block">
              <h3>Compliance without the binder</h3>
              <p>
                <Link href="/construction-management-features/safety-custom-forms">FLHAs and custom forms</Link> signed
                on phones, filed by project, audit-ready always.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
