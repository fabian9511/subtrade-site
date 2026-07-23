import { tutorials } from '../../../lib/tutorials';
import { SIGNUP } from '../../../lib/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamicParams = false;
export function generateStaticParams() {
  return tutorials.map((t) => ({ slug: t.slug }));
}
export function generateMetadata({ params }) {
  const t = tutorials.find((x) => x.slug === params.slug);
  if (!t) return {};
  return {
    title: `${t.title} | SubTrade Tutorial`,
    description: `${t.blurb} Step-by-step SubTrade video tutorial.`,
  };
}

export default function TutorialPage({ params }) {
  const t = tutorials.find((x) => x.slug === params.slug);
  if (!t) notFound();
  return (
    <section className="section" style={{ paddingTop: 90 }}>
      <div className="wrap" style={{ maxWidth: 860 }}>
        <p className="eyebrow">SubTrade tutorial</p>
        <h1 className="display" style={{ fontSize: 'clamp(34px,5.5vw,58px)', margin: '18px 0 14px' }}>
          {t.title}
        </h1>
        <p style={{ color: 'var(--steel-400)', marginBottom: 30, fontSize: 18 }}>{t.blurb}</p>
        {t.videoId ? (
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, border: '1px solid var(--steel-700)', borderRadius: 4, overflow: 'hidden' }}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${t.videoId}`}
              title={t.title}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <p>
            Watch this tutorial on our{' '}
            <a href="https://www.youtube.com/@subtradesoftware" style={{ color: 'var(--chalk)' }} target="_blank" rel="noopener">
              YouTube channel
            </a>
            .
          </p>
        )}
        <div style={{ marginTop: 36, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <Link href="/how-to-tutorials" className="btn btn-ghost">All tutorials</Link>
          <a href={SIGNUP} className="btn btn-primary">Start free trial</a>
        </div>
      </div>
    </section>
  );
}
