import { effective, intro, sections } from './terms-text';
import { breadcrumbs } from '../../lib/breadcrumbs';

export const metadata = {
  alternates: { canonical: '/terms-and-conditions/' },
  title: 'Terms & Conditions',
  description: 'Terms and Conditions for the SubTrade construction project management platform by Subtrade Software Ltd.',
};

const crumbs = breadcrumbs([['Terms & Conditions', '/terms-and-conditions/']]);

export default function Terms() {
  return (
    <section className="section" style={{ paddingTop: 100 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      <div className="wrap prose" style={{ maxWidth: 760 }}>
        <p className="eyebrow">Legal</p>
        <h1 className="display" style={{ fontSize: 'clamp(34px,5vw,56px)' }}>Terms & Conditions</h1>
        <p style={{ color: 'var(--steel-500)', fontSize: 15 }}>{effective}</p>
        <p>{intro}</p>
        {sections.map((s) => (
          <div key={s.h}>
            <h2 className="display" style={{ fontSize: 26, margin: '36px 0 12px' }}>{s.h}</h2>
            {s.b.map((p, i) => (
              <p key={i} style={{ fontSize: 16 }}>{p}</p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
