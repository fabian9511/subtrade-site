import { tutorials } from '../../../lib/tutorials';
import { SIGNUP } from '../../../lib/data';
import RelatedLinks from '../../../components/RelatedLinks';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const F = '/construction-management-features';
const FEATURE_FOR = {
  'how-to-create-a-project-subtrade-software': [`${F}/project-dashboard`, 'Project Dashboard'],
  'setup-new-employees-fast-in-subtrade-software': ['/time-tracking', 'Time Tracking'],
  'workflow-efficiency-with-employee-time-sheets': ['/time-tracking', 'Time Tracking'],
  'time-tracking-approval-and-the-time-splitting': ['/time-tracking', 'Time Tracking'],
  'manage-time-tracking-and-approvals': ['/time-tracking', 'Time Tracking'],
  'manage-change-orders-subtrade-software': [`${F}/change-order-management`, 'Change Orders'],
  'purchase-orders-approval': [`${F}/change-order-management`, 'Change Orders'],
  'subtrade-tutorial-auto-naming-construction-drawings': [`${F}/drawings-markups`, 'Drawings & Markups'],
  'crew-scheduling-subtrade-software': [`${F}/construction-crew-scheduling`, 'Crew Scheduling'],
  'scheduling-feature-workflow-construction-drawings-upload': [`${F}/construction-crew-scheduling`, 'Crew Scheduling'],
  'custom-notifications': [`${F}/field-operations`, 'Field Operations'],
  'creating-and-submitting-a-daily-report': [`${F}/daily-logs`, 'Daily Logs'],
  'introducing-field-operations': [`${F}/field-operations`, 'Field Operations'],
  'forms-dashboard-subtrade-software': [`${F}/safety-custom-forms`, 'Safety & Custom Forms'],
  'build-a-form-subtrade-software': [`${F}/safety-custom-forms`, 'Safety & Custom Forms'],
  'forms-in-projects-subtrade-software': [`${F}/safety-custom-forms`, 'Safety & Custom Forms'],
  'review-form-submissions-subtrade-software': [`${F}/safety-custom-forms`, 'Safety & Custom Forms'],
  'progress-billing-subtrade-software': [`${F}/progress-billing`, 'Progress Billing'],
  'project-reports-subtrade-software': [`${F}/project-dashboard`, 'Project Dashboard'],
  'bid-manager-pipeline-subtrade-software': [`${F}/bid-manager`, 'Bid Manager'],
  'bid-manager-inside-a-tender-subtrade-software': [`${F}/bid-manager`, 'Bid Manager'],
  'bid-manager-proposals-vendors-follow-ups-subtrade-software': [`${F}/bid-manager`, 'Bid Manager'],
};

function seriesOf(t) {
  if (!t.series) return null;
  const parts = tutorials
    .filter((x) => x.series && x.series.name === t.series.name)
    .sort((a, b) => a.series.part - b.series.part);
  const i = parts.findIndex((x) => x.slug === t.slug);
  return { parts, prev: parts[i - 1], next: parts[i + 1] };
}
const shortTitle = (x) => x.title.replace(/^.*?Part \d+:\s*/, '');

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
    uploadDate: t.published || '2026-01-01',
    publisher: { '@type': 'Organization', name: 'SubTrade Software Ltd.' },
  };
  const feat = FEATURE_FOR[t.slug];
  const ser = seriesOf(t);
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
        <p className="eyebrow">
          {ser ? `${t.series.name} series · Part ${t.series.part} of ${t.series.of}` : 'SubTrade tutorial'}
        </p>
        <h1 className="display" style={{ fontSize: 'clamp(34px,5.5vw,58px)', margin: '18px 0 14px' }}>
          {t.title}
        </h1>
        <p style={{ color: 'var(--steel-400)', marginBottom: 30, fontSize: 18 }}>{t.blurb}</p>
        {ser && (
          <nav className="series-steps" aria-label={`${t.series.name} series`}>
            {ser.parts.map((x) => (
              <Link
                key={x.slug}
                href={`/tutorials/${x.slug}`}
                className={x.slug === t.slug ? 'on' : ''}
                aria-current={x.slug === t.slug ? 'page' : undefined}
              >
                <span>Part {x.series.part}</span>
                {shortTitle(x)}
              </Link>
            ))}
          </nav>
        )}
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

        {ser && (
          <div className="series-nav">
            {ser.prev ? (
              <Link href={`/tutorials/${ser.prev.slug}`} className="series-btn prev">
                <small>&larr; Previous · Part {ser.prev.series.part}</small>
                {shortTitle(ser.prev)}
              </Link>
            ) : <span />}
            {ser.next ? (
              <Link href={`/tutorials/${ser.next.slug}`} className="series-btn next">
                <small>Next · Part {ser.next.series.part} &rarr;</small>
                {shortTitle(ser.next)}
              </Link>
            ) : (
              <Link href={`/tutorials/${ser.parts[0].slug}`} className="series-btn next done">
                <small>Series complete · Start over &rarr;</small>
                {shortTitle(ser.parts[0])}
              </Link>
            )}
          </div>
        )}

        <div style={{ marginTop: 36, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {t.pdf && (
            <a href={t.pdf} className="btn btn-ghost" download>Download the PDF guide</a>
          )}
          <Link href="/how-to-tutorials" className="btn btn-ghost">All tutorials</Link>
          <a href={SIGNUP} className="btn btn-primary">Start free trial</a>
        </div>
      </div>
    </section>
    <RelatedLinks groups={relatedGroups} />
    </>
  );
}
