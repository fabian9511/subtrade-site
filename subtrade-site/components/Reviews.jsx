'use client';

import { useRef } from 'react';

const reviews = [
  {
    quote:
      'Since bringing SubTrade on board, our company growth has taken off. Having every drawing, change order, and document in one centralized spot saves us hours of headache each week. The daily log feature is awesome, and we use the Tasks and deficiencies section constantly to keep every site moving. Highly recommend!',
    name: 'TQC Windows & Doors Inc.',
    place: 'Mississauga, Ontario',
    logo: '/tqc-windows-and-doors-logo.webp',
    initials: 'TQC',
  },
  // Add more reviews here; each becomes a slide automatically.
];

export default function Reviews() {
  const track = useRef(null);
  const slide = (dir) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' });
  };
  const many = reviews.length > 1;

  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', maxWidth: 'none' }}>
          <div>
            <p className="eyebrow">From the field</p>
            <h2 className="display">Subs on SubTrade</h2>
          </div>
          {many && (
            <div className="rv-nav">
              <button onClick={() => slide(-1)} aria-label="Previous review">←</button>
              <button onClick={() => slide(1)} aria-label="Next review">→</button>
            </div>
          )}
        </div>
        <div className="rv-track" ref={track}>
          {reviews.map((r) => (
            <figure className="rv-slide" key={r.name}>
              <div className="rv-quote">
                <div className="review-stars" aria-label="5 out of 5 stars">★★★★★</div>
                <blockquote>{r.quote}</blockquote>
              </div>
              <figcaption className="rv-who">
                {r.logo ? (
                  <img src={r.logo} alt={`${r.name} logo`} className="rv-logo" loading="lazy" />
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
