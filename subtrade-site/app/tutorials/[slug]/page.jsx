import { tutorials } from '../../../lib/tutorials';
import { SIGNUP } from '../../../lib/data';
import RelatedLinks from '../../../components/RelatedLinks';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const F = '/construction-management-features';
const FEATURE_FOR = {
  'how-to-create-a-project-subtrade-software': [`${F}/field-operations`, 'Field Operations'],
  'setup-new-employees-fast-in-subtrade-software': ['/time-tracking', 'Time Tracking'],
  'workflow-efficiency-with-employee-time-sheets': ['/time-tracking', 'Time Tracking'],
  'time-tracking-approval-and-the-time-splitting': ['/time-tracking', 'Time Tracking'],
  'manage-time-tracking-and-approvals': ['/time-tracking', 'Time Tracking'],
  'manage-change-orders-subtrade-software': [`${F}/change-order-management`, 'Change Orders'],
  'purchase-orders-approval': [`${F}/change-order-management`, 'Change Orders'],
  'subtrade-tutorial-auto-naming-construction-drawings': [`${F}/drawings-markups`, 'Drawings & Markups'],
  'scheduling-feature-workflow-construction-drawings-upload': [`${F}/construction-crew-scheduling`, 'Crew Scheduling'],
  'custom-notifications': [`${F}/field-operations`, 'Field Operations'],
  'creating-and-submitting-a-daily-report': [`${F}/daily-logs`, 'Daily Logs'],
  'introducing-field-operations': [`${F}/field-operations`, 'Field Operations'],
};

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
  const videoSchema = t.videoId && {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: t.title,
    description: t.blurb,
    thumbnailUrl: `https://i.ytimg.com/vi/${t.videoId}/hqdefault.jpg`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${t.videoId}`,
    uploadDate: '2026-01-01',
    publisher: { '@type': 'Organization', name: 'SubTrade Software Ltd.' },
  };
  const feat = FEATURE_FOR[t.slug];
  const relatedGroups = [
    ...(feat ? [{ label: 'Related feature', links: [{ href: feat[0], label: feat[1] }] }] : []),
    {
      label: 'Keep learning',
      links: [
        { href: '/how-to-tutorials', label: 'All tutorials' },
        { href: '/construction-management-features', label: 'All features' },
        { href: '/pricing-plans', label: 'Pricing' },
      ],
    },
  ];
  return (
    <>
    {videoSchema && (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />
    )}
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

        {t.content && (
          <div className="tut-content">
            {t.content.lead && <p className="tut-lead">{t.content.lead}</p>}
            {t.content.learn && t.content.learn.length > 0 && (
              <>
                {t.content.learnTitle && <h2>{t.content.learnTitle}</h2>}
                <ul className="tut-learn">
                  {t.content.learn.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            )}
            {t.content.body &&
              t.content.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        )}

        <div style={{ marginTop: 36, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <Link href="/how-to-tutorials" className="btn btn-ghost">All tutorials</Link>
          <a href={SIGNUP} className="btn btn-primary">Start free trial</a>
        </div>
      </div>
    </section>
    <RelatedLinks groups={relatedGroups} />
    </>
  );
}
