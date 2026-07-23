import { effective, intro, sections } from './privacy-text';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for the SubTrade construction project management platform by Subtrade Software Ltd.',
};

export default function Privacy() {
  return (
    <section className="section" style={{ paddingTop: 100 }}>
      <div className="wrap prose" style={{ maxWidth: 760 }}>
        <p className="eyebrow">Legal</p>
        <h1 className="display" style={{ fontSize: 'clamp(34px,5vw,56px)' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--steel-500)', fontSize: 15 }}>{effective}</p>
        {intro.map((p, i) => <p key={i}>{p}</p>)}
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
