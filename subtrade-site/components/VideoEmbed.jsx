'use client';

import { useState } from 'react';

/**
 * A YouTube embed that costs nothing until someone presses play.
 *
 * A plain <iframe> pulls roughly a megabyte of YouTube script into every page
 * view whether or not the video is watched, which would undo the page's load
 * time for the majority of visitors who never click. So this renders our own
 * poster image and swaps in the iframe on the first click.
 *
 * Styles are inline rather than in globals.css deliberately — this component is
 * self-contained and needs no global classes.
 */
export default function VideoEmbed({ id, title, poster, posterAlt }) {
  const [playing, setPlaying] = useState(false);
  const [hover, setHover] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16 / 9',
        borderRadius: 14,
        overflow: 'hidden',
        background: '#0b1220',
        boxShadow: '0 24px 60px rgba(0,0,0,0.28)',
      }}
    >
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={() => setHover(true)}
          onBlur={() => setHover(false)}
          aria-label={`Play video: ${title}`}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            padding: 0,
            border: 0,
            cursor: 'pointer',
            background: 'transparent',
            display: 'block',
          }}
        >
          <img
            src={poster}
            alt={posterAlt}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) scale(${hover ? 1.06 : 1})`,
              transition: 'transform 140ms ease, background-color 140ms ease',
              width: 88,
              height: 62,
              borderRadius: 14,
              backgroundColor: hover ? '#FE6B35' : 'rgba(232,115,42,0.94)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
            }}
          >
            <span
              style={{
                width: 0,
                height: 0,
                marginLeft: 5,
                borderTop: '13px solid transparent',
                borderBottom: '13px solid transparent',
                borderLeft: '21px solid #fff',
              }}
            />
          </span>
        </button>
      )}
    </div>
  );
}
