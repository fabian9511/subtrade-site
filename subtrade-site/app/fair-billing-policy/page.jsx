import { effective, intro, sections } from './billing-text';
import { breadcrumbs } from '../../lib/breadcrumbs';

export const metadata = {
  alternates: { canonical: '/fair-billing-policy/' },
  title: 'Fair Billing Policy',
  description: 'Fair Billing Policy for the SubTrade platform by Subtrade Software Ltd: transparent pricing, billing cycles, proration and cancellations.',
};

const crumbs = breadcrumbs([['Fair Billing Policy', '/fair-billing-policy/']]);

export default function FairBilling() {
  return (
    <section className="section" style={{ paddingTop: 100 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      <div className="wrap prose" style={{ maxWidth: 760 }}>
        <p className="eyebrow">Legal</p>
        <h1 className="display" style={{ fontSize: 'clamp(34px,5vw,56px)' }}>Fair Billing Policy</h1>
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
