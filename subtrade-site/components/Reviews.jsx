'use client';

import { useRef } from 'react';
import { reviews } from '../lib/reviews';


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
                <div className="rv-top">
                  <div className="review-stars" aria-label={`${r.rating} out of 5 stars`}>{'★'.repeat(r.rating)}</div>
                  {r.sourceLogo && (
                    <span className="rv-src">
                      Reviewed on
                      <img src={r.sourceLogo} alt={`${r.source} logo`} className="rv-src-logo" loading="lazy" />
                    </span>
                  )}
                </div>
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
