import { PROFILES } from '../lib/site';

const reviews = [
  {
    quote:
      'Since bringing SubTrade on board, our company growth has taken off. Having every drawing, change order, and document in one centralized spot saves us hours of headache each week. The daily log feature is awesome, and we use the Tasks and deficiencies section constantly to keep every site moving. Highly recommend!',
    name: 'TQC Windows & Doors Inc.',
    place: 'Mississauga, Ontario',
    logo: '/tqc-windows-and-doors-logo.webp',
    initials: 'TQC',
  },
  {
    quote:
      'I chose SubTrade as it was a much more streamlined way of managing projects from a subcontractor perspective. Our previous software did not work well and was expensive. Initially in the set-up phase we had to iron out some kinks, however the team reacted quickly and handled each issue as it arose. They did an excellent job onboarding us and listening to our needs. 10/10 experience.',
    name: 'Goose Mechanical',
    place: 'Calgary, Alberta',
    logo: '/goose-mechanical-logo.webp',
    initials: 'GM',
    source: 'Capterra',
    sourceLogo: '/capterra-logo.webp',
    sourceUrl: PROFILES.capterra,
  },
  // Add more reviews here; each becomes a slide automatically.
];

// Review cards side by side (they wrap to one column on phones). A review
// with a sourceUrl shows a linked "Reviewed on" badge with the site's logo.
export default function Reviews() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head" style={{ marginBottom: 36 }}>
          <p className="eyebrow">From the field</p>
          <h2 className="display">Subs on SubTrade</h2>
        </div>
        <div className="rvc-grid">
          {reviews.map((r) => (
            <figure className="rvc" key={r.name}>
              <div className="rvc-top">
                <span className="review-stars" aria-label="5 out of 5 stars">★★★★★</span>
                {r.sourceLogo ? (
                  <a className="rvc-src" href={r.sourceUrl} target="_blank" rel="noopener">
                    Reviewed on
                    <img src={r.sourceLogo} alt={r.source} loading="lazy" />
                  </a>
                ) : (
                  <span className="rvc-label">Customer review</span>
                )}
              </div>
              <blockquote>{r.quote}</blockquote>
              <figcaption className="rvc-who">
                {r.logo ? (
                  <img src={r.logo} alt={`${r.name} logo`} className="rvc-logo" loading="lazy" />
                ) : (
                  <span className="rv-mono" aria-hidden="true">{r.initials}</span>
                )}
                <span>
                  <b>{r.name}</b>
                  <small>{r.place}</small>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
