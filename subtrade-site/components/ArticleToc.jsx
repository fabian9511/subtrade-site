'use client';

import { useEffect, useState } from 'react';

export default function ArticleToc({ items }) {
  const [active, setActive] = useState(items[0]?.id || '');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0);
      let current = items[0]?.id || '';
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top <= 140) current = it.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [items]);

  return (
    <>
      <div className="read-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
      <aside className="article-toc" aria-label="On this page">
        <span className="article-toc-label">On this page</span>
        <nav>
          {items.map((it) => (
            <a
              key={it.id}
              href={`#${it.id}`}
              className={`article-toc-link${active === it.id ? ' is-active' : ''}`}
            >
              {it.title}
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}
