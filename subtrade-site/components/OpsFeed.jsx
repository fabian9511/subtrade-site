'use client';

import { useEffect, useRef, useState } from 'react';

const EVENTS = [
  ['⏱️', 'M. Torres clocked in', 'Site 4 · GPS verified', '7:02 AM', true],
  ['🛡️', 'FLHA signed by 6 workers', 'Aldersyde WTP', '7:15 AM', false],
  ['📷', '3 site photos added', 'WingStop Chinook · GPS-tagged', '9:14 AM', true],
  ['🧾', 'CO-2026-014 signed', '$2,340 approved by GC', '9:41 AM', false],
  ['💵', 'Draw #6 assembled', '$25,506 this claim · holdback handled', '11:20 AM', false],
  ['📅', 'Crew moved to Site 4', '3 boarders notified automatically', '1:05 PM', false],
  ['✅', 'Punch item closed', 'U204 · photo attached', '2:48 PM', false],
  ['📝', 'Daily log submitted', 'POD Commercial · weather + manpower', '4:56 PM', false],
];

const VISIBLE = 4;

export default function OpsFeed() {
  const [items, setItems] = useState(() =>
    EVENTS.slice(0, VISIBLE).map((e, i) => ({ e, key: i }))
  );
  const nextRef = useRef(VISIBLE);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return; // static feed for reduced motion
    }
    const id = setInterval(() => {
      if (document.hidden || paused) return;
      setItems((prev) => {
        const k = nextRef.current;
        const e = EVENTS[k % EVENTS.length];
        nextRef.current = k + 1;
        return [{ e, key: k }, ...prev].slice(0, VISIBLE);
      });
    }, 2600);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div
      className="opsfeed"
      aria-label="Live example of SubTrade field activity"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="opsfeed-head">
        <span className="opsfeed-dot" aria-hidden="true" />
        FIELD OPERATIONS · LIVE
      </div>
      {items.map(({ e, key }) => (
        <div className="opscard" key={key}>
          <span className="opscard-time">{e[3]}</span>
          <b>
            <span aria-hidden="true" style={{ marginRight: 8 }}>{e[0]}</span>
            {e[1]}
          </b>
          <span className="opscard-meta">
            {e[4] && <span className="gps-dot" aria-hidden="true" />}
            {e[2]}
          </span>
        </div>
      ))}
      <div className="opsfeed-foot">
        <span><b className="mono">4</b> crews on site</span>
        <span><b className="mono">37.5</b> hrs today</span>
        <span><b className="mono">$2,340</b> extras captured</span>
      </div>
    </div>
  );
}
