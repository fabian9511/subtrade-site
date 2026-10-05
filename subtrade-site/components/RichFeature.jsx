import { SIGNUP } from '../lib/data';
import VideoEmbed from './VideoEmbed';

const SITE = 'https://subtradesoftware.com';

/**
 * Alt text for image `j` of a section. A section with one image uses
 * `imageAlt`; a section stacking several passes `imageAlts`, one per image.
 * Falling back to an empty alt on the extras is only right when they are
 * decorative, which a second screenshot of a different screen is not.
 */
const alt = (s, j) => (s.imageAlts ? s.imageAlts[j] || '' : j === 0 ? s.imageAlt : '');

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
  // A feature that has a walkthrough on YouTube describes it to search engines
  // and answer engines as well as showing it.
  const v = r.video;
  // An optional vertical YouTube Short plays beside the main video.
  const sh = r.short;
  const toSchema = (x, url) => ({
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: x.title,
    description: x.description,
    thumbnailUrl: [`${SITE}${x.poster}`],
    uploadDate: x.uploadDate,
    duration: x.duration,
    embedUrl: `https://www.youtube.com/embed/${x.id}`,
    contentUrl: url,
    publisher: {
      '@type': 'Organization',
      name: 'SubTrade Software',
      url: SITE,
    },
  });
  const videoSchema = v && toSchema(v, `https://youtu.be/${v.id}`);
  const shortSchema = sh && toSchema(sh, `https://www.youtube.com/shorts/${sh.id}`);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {v && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }} />
      )}
      {sh && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(shortSchema) }} />
      )}
      {(v && (sh || r.videoHero)) || (sh && !v) ? (
        <section className="hero hero-fv">
          <div className="wrap">
            <div className="hs-grid">
              <div className="hs-copy">
                <p className="eyebrow">{f.name} · SubTrade feature</p>
                <h1 className="display hs-title">
                  {r.heroTitle[0]}
                  <br />
                  <em>{r.heroTitle[1]}</em>
                </h1>
                <p className="lede">{r.heroSub}</p>
                <div className="hero-ctas">
                  <a href={SIGNUP} className="btn btn-primary btn-lg">Start free trial</a>
                </div>
                <p className="hero-note">No credit card. Up and running in under 10 minutes.</p>
              </div>
              <div className={!v ? 'hs-media hs-shortonly' : sh ? 'hs-media' : 'hs-media hs-solo'}>
                {v && (
                  <div className="hs-main">
                    <VideoEmbed id={v.id} title={v.title} poster={v.poster} posterAlt={v.posterAlt} parts={v.parts} />
                  </div>
                )}
                {sh && (
                  <div className="hs-short">
                    <VideoEmbed id={sh.id} title={sh.title} poster={sh.poster} posterAlt={sh.posterAlt} ratio="9 / 16" />
                  </div>
                )}
                <p className="hero-note hs-cap">{v ? v.caption : sh.caption}</p>
              </div>
            </div>
            <div className="stat-strip hs-stats">
              {r.stats.map(([big, small]) => (
                <div className="stat" key={big}>
                  <b>{big}</b>
                  <span>{small}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
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
            {v && (
              <div style={{ marginTop: 44 }}>
                <VideoEmbed id={v.id} title={v.title} poster={v.poster} posterAlt={v.posterAlt} parts={v.parts} />
                <p className="hero-note" style={{ marginTop: 14 }}>{v.caption}</p>
              </div>
            )}
          </div>
        </section>
      )}

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
                    <img key={img} src={img} alt={alt(s, j)} loading="lazy" />
                  ))}
                </div>
              )}
              {s.images && !s.browser && (
                <div className={s.tablet ? `tablet tablet-${s.tablet}` : 'fimg-stack'}>
                  {s.images.map((img, j) => (
                    <img key={img} src={img} alt={alt(s, j)} loading="lazy" />
                  ))}
                </div>
              )}
              {s.motion === 'beforeAfter' && (
                <div className="tablet tablet-landscape">
                  <div className="ba" role="img" aria-label={`${s.beforeAlt}. ${s.afterAlt}.`}>
                    <img src={s.before} alt={s.beforeAlt} loading="lazy" />
                    <div className="ba-after"><img src={s.after} alt={s.afterAlt} loading="lazy" /></div>
                    <span className="ba-line" aria-hidden="true"><i /></span>
                    <span className="ba-tag ba-tag-b" aria-hidden="true">Before</span>
                    <span className="ba-tag ba-tag-a" aria-hidden="true">After</span>
                  </div>
                </div>
              )}
              {s.motion === 'markup' && (
                <div className="tablet tablet-landscape">
                  <div className="mk">
                    <img src={s.markupImage} alt={s.imageAlt} loading="lazy" />
                    <svg viewBox="0 0 1400 1050" aria-hidden="true">
                      <rect className="mk-rect" x="513" y="235" width="211" height="129" rx="4" pathLength="100" />
                      <path className="mk-arrow" d="M724 584 L703 404" pathLength="100" />
                      <path className="mk-head" d="M674 440 L703 400 L736 436" pathLength="100" />
                      <text className="mk-text" x="752" y="680" textAnchor="middle">Install access panel</text>
                    </svg>
                  </div>
                </div>
              )}
              {s.metaCard && (
                <div className={s.metaMap ? 'meta-card meta-live' : 'meta-card'}>
                  {s.metaMap && (
                    <div className="meta-map" aria-hidden="true">
                      <span className="meta-pin"><i /></span>
                      <em>GPS locked</em>
                      <b>{s.metaMap}</b>
                    </div>
                  )}
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

