import Link from 'next/link';
import { tutorials } from '../lib/tutorials';

/**
 * A row of video tutorial cards. Pass `slugs` (in order) or nothing for the
 * default "start here" set. Renders nothing if no slug matches a tutorial.
 */
const DEFAULT = [
  'workflow-efficiency-with-employee-time-sheets',
  'crew-scheduling-subtrade-software',
  'how-to-create-a-project-subtrade-software',
  'forms-dashboard-subtrade-software',
];

export default function TutorialStrip({ slugs = DEFAULT, eyebrow = 'Watch it work', title = 'See it in the app', intro, tight }) {
  const items = slugs.map((s) => tutorials.find((t) => t.slug === s)).filter((t) => t && t.videoId);
  if (!items.length) return null;
  return (
    <section className="section tut-strip" style={tight ? { paddingTop: 0 } : undefined}>
      <div className="wrap">
        <div className="tut-strip-head">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="display">{title}</h2>
            {intro && <p>{intro}</p>}
          </div>
          <Link href="/how-to-tutorials" className="btn btn-ghost">All tutorials →</Link>
        </div>
        <div className="tut-strip-grid">
          {items.map((t) => (
            <Link href={`/tutorials/${t.slug}`} className="tut-card" key={t.slug}>
              <span className="tut-thumb">
                <img
                  src={`https://i.ytimg.com/vi/${t.videoId}/hqdefault.jpg`}
                  alt={`${t.title} video thumbnail`}
                  loading="lazy"
                  width="480"
                  height="270"
                />
                <span className="tut-play" aria-hidden="true" />
              </span>
              <span className="tag">
                {[t.series && `Part ${t.series.part} of ${t.series.of}`, t.pdf && 'PDF guide'].filter(Boolean).join(' · ') || 'Tutorial'}
              </span>
              <h3>{t.title}</h3>
              <p>{t.blurb}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
