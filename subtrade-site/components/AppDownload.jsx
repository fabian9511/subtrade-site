import { SIGNUP } from '../lib/data';

export default function AppDownload() {
  return (
    <section className="section">
      <div className="wrap appdl">
        <div className="phone-duo">
          <div className="iphone duo-back">
            <span className="island" aria-hidden="true" />
            <img
              src="/subtrade-app-construction-drawing-markup.webp"
              alt="Construction drawing in the SubTrade app with field markups, measurements and photo pins on a reflected ceiling plan"
              className="iphone-shot"
              loading="lazy"
              width="640"
              height="1387"
            />
          </div>
          <div className="iphone duo-front">
            <span className="island" aria-hidden="true" />
            <img
              src="/subtrade-app-safety-inspection-checklist.webp"
              alt="Scissor lift pre-shift inspection checklist being completed in the SubTrade app with okay and not-okay checks"
              className="iphone-shot"
              loading="lazy"
              width="640"
              height="1387"
            />
          </div>
        </div>
        <div>
          <p className="eyebrow">iOS &amp; Android</p>
          <h2 className="display" style={{ fontSize: 'clamp(32px,4.6vw,50px)', margin: '16px 0 14px' }}>
            The whole office,
            <br />
            in their pocket
          </h2>
          <p style={{ color: 'var(--steel-400)', fontSize: 17, maxWidth: 480, marginBottom: 10 }}>
            Crews do not carry laptops. SubTrade lives on the phones already on
            your jobsite: clock in, snap photos, mark up drawings and file logs in a
            couple of taps.
          </p>
          <p style={{ color: 'var(--steel-400)', fontSize: 17, maxWidth: 480, marginBottom: 26 }}>
            No signal in the parkade? It works offline and syncs the moment the
            phone finds bars again.
          </p>
          <div className="appdl-actions">
            <a href={SIGNUP} className="btn btn-primary btn-lg">Start free trial</a>
            <div className="appdl-stores">
              <a href="https://apps.apple.com/ca/app/subtrade/id6752587413" target="_blank" rel="noopener">
                <small>Download on the</small>App Store
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.subtradesoftware.subtrade.app" target="_blank" rel="noopener">
                <small>Get it on</small>Google Play
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
