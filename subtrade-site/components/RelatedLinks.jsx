import Link from 'next/link';

export default function RelatedLinks({ groups }) {
  const valid = (groups || []).filter((g) => g && g.links && g.links.length);
  if (!valid.length) return null;
  return (
    <section className="section related" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="related-box">
          {valid.map((g) => (
            <div className="related-group" key={g.label}>
              <span className="related-group-label">{g.label}</span>
              <div className="related-row">
                {g.links.map((l) => (
                  <Link key={l.href + l.label} href={l.href} className="related-pill">
                    {l.label}
                    <span className="related-arrow" aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
