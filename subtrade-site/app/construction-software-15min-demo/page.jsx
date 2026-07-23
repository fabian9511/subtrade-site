import Script from 'next/script';
import { SIGNUP } from '../../lib/data';

export const metadata = {
  title: 'Book a 15-Minute SubTrade Demo',
  description:
    'A 15-minute walkthrough of SubTrade for trade contractors. Or skip the call: the free trial gives you the full platform immediately.',
};

export default function Demo() {
  return (
    <section className="section" style={{ paddingTop: 90 }}>
      <div className="wrap" style={{ maxWidth: 860 }}>
        <p className="eyebrow">15 minutes, no pitch deck</p>
        <h1 className="display" style={{ fontSize: 'clamp(38px,5.5vw,64px)', margin: '18px 0 14px' }}>
          Book a quick demo
        </h1>
        <p style={{ color: 'var(--steel-400)', fontSize: 18, maxWidth: 620, marginBottom: 8 }}>
          Fifteen minutes, screen share, your questions. Run by someone who
          actually runs construction projects, not a sales script.
        </p>
        <p style={{ color: 'var(--steel-500)', fontSize: 15, marginBottom: 30 }}>
          In a hurry? <a href={SIGNUP} style={{ color: 'var(--chalk)' }}>Start the free trial instead</a>{' '}
          and get the full platform right now.
        </p>
        <div style={{ border: '1px solid var(--steel-700)', borderRadius: 4, overflow: 'hidden', background: '#fff' }}>
          <iframe
            src="https://api.leadconnectorhq.com/widget/booking/6mmJoUPX6PFLhrOHGt92"
            style={{ width: '100%', border: 'none', overflow: 'hidden', minHeight: 700 }}
            scrolling="no"
            id="6mmJoUPX6PFLhrOHGt92_booking"
            title="Book a SubTrade demo"
          />
        </div>
        <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="lazyOnload" />
      </div>
    </section>
  );
}
