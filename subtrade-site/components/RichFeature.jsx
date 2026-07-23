import { SIGNUP } from '../lib/data';

export default function RichFeature({ f }) {
  const r = f.rich;
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: r.faqs.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="hero">
        <div className="wrap hero-inner" style={{ maxWidth: 900 }}>
          <p className="eyebrow">{f.name} · SubTrade feature</p>
          <h1 className="display" style={{ fontSize: 'clamp(44px,7vw,84px)' }}>
            {r.heroTitle[0]}
            <br />
            <em>{r.heroTitle[1]}</em>
          </h1>
          <p className="lede">{r.heroSub}</p>
          <div className="stat-strip">
            {r.stats.map(([big, small]) => (
              <div className="stat" key={big}>
                <b>{big}</b>
                <span>{small}</span>
              </div>
            ))}
          </div>
          <div className="hero-ctas" style={{ marginTop: 34 }}>
            <a href={SIGNUP} className="btn btn-primary btn-lg">Start free trial</a>
          </div>
          <p className="hero-note">No credit card. Up and running in under 10 minutes.</p>
        </div>
      </section>

      {r.sections.map((s, i) => (
        <section className="section" key={s.title}>
          <div className="wrap fsplit" style={s.flip ? { direction: 'rtl' } : undefined}>
            <div style={{ direction: 'ltr' }}>
              <p className="eyebrow">{s.eyebrow}</p>
              <h2 className="display" style={{ fontSize: 'clamp(30px,4.4vw,46px)', margin: '14px 0 14px' }}>
                {s.title} {s.isNew && <span className="new-chip">New</span>}
              </h2>
              <p style={{ color: 'var(--steel-400)', fontSize: 17, marginBottom: 22 }}>{s.body}</p>
              <ul className="fchecks">
                {s.checks.map((c) => <li key={c}>{c}</li>)}
              </ul>
              <p style={{ marginTop: 28 }}>
                <a href={SIGNUP} className="btn btn-primary">Try it free</a>
              </p>
            </div>
            <div style={{ direction: 'ltr' }}>
              {s.images && s.browser && (
                <div className="browser">
                  <div className="browser-bar">
                    <span /><span /><span />
                    <i>app.subtradesoftware.com</i>
                  </div>
                  {s.images.map((img, j) => (
                    <img key={img} src={img} alt={j === 0 ? s.imageAlt : ''} loading="lazy" />
                  ))}
                </div>
              )}
              {s.images && !s.browser && (
                <div className={s.tablet ? `tablet tablet-${s.tablet}` : 'fimg-stack'}>
                  {s.images.map((img, j) => (
                    <img key={img} src={img} alt={j === 0 ? s.imageAlt : ''} loading="lazy" />
                  ))}
                </div>
              )}
              {s.metaCard && (
                <div className="meta-card">
                  {s.metaCard.map(([k, v]) => (
                    <div className="meta-row" key={k}>
                      <span>{k}</span>
                      <b>{v}</b>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      ))}

      <section className="section">
        <div className="wrap">
          <p className="eyebrow">Common {f.name.toLowerCase()} questions</p>
          <h2 className="display" style={{ fontSize: 'clamp(32px,5vw,52px)', margin: '14px 0 36px' }}>
            Questions, answered straight
          </h2>
          <div className="faq-grid">
            {r.faqs.map(([q, a]) => (
              <div className="faq-cell" key={q}>
                <h3>{q}</h3>
                <p>{a}</p>
              </div>
            ))}
          </div>
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
  );
}

