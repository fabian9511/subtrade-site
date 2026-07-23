import { tutorials } from '../../lib/tutorials';
import Link from 'next/link';

export const metadata = {
  title: 'SubTrade Video Tutorials',
  description:
    'Step-by-step SubTrade video tutorials: projects, time tracking, change orders, purchase orders, scheduling, drawings and notifications.',
};

export default function Tutorials() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="wrap hero-inner">
          <p className="eyebrow">Learn the platform</p>
          <h1 className="display" style={{ fontSize: 'clamp(40px,6.5vw,76px)' }}>Video tutorials</h1>
          <p className="lede">
            Short, practical walkthroughs of every SubTrade workflow, from first
            project to progress billing. Also available on our{' '}
            <a href="https://www.youtube.com/@subtradesoftware" style={{ color: 'var(--chalk)' }} target="_blank" rel="noopener">
              YouTube channel
            </a>.
          </p>
        </div>
      </section>
      <div className="wrap"><div className="chalkline" /></div>
      <section className="section">
        <div className="wrap">
          <div className="grid">
            {tutorials.map((t) => (
              <Link href={`/tutorials/${t.slug}`} className="cell" key={t.slug}>
                <span className="tag">Tutorial</span>
                <h3>{t.title}</h3>
                <p>{t.blurb}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
