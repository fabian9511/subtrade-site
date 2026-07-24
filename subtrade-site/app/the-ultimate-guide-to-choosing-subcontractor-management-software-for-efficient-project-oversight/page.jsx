import { SIGNUP } from '../../lib/data';
import Link from 'next/link';
import ArticleToc from '../../components/ArticleToc';

const PATH =
  '/the-ultimate-guide-to-choosing-subcontractor-management-software-for-efficient-project-oversight/';
const BASE = 'https://subtradesoftware.com';

export const metadata = {
  title: 'How to Choose Subcontractor Management Software (2026 Guide)',
  description:
    'A practical guide to choosing subcontractor management software: the features that matter, the traps to avoid, and how to evaluate tools as a trade contractor.',
  alternates: { canonical: PATH },
};

const toc = [
  { id: 'the-uncomfortable-question', title: 'Start with the uncomfortable question' },
  { id: 'features-that-matter', title: 'The features that matter for subs' },
  { id: 'the-traps', title: 'The traps' },
  { id: 'run-the-evaluation', title: 'How to run the evaluation' },
  { id: 'where-subtrade-fits', title: 'Where SubTrade fits' },
];

const schema = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'The ultimate guide to choosing subcontractor management software',
    description:
      'A practical guide to choosing subcontractor management software: the features that matter, the traps to avoid, and how to evaluate tools as a trade contractor.',
    author: { '@type': 'Organization', name: 'SubTrade Software Ltd.', url: `${BASE}/` },
    publisher: {
      '@type': 'Organization',
      name: 'SubTrade Software Ltd.',
      logo: { '@type': 'ImageObject', url: `${BASE}/logo-horizontal.png` },
    },
    mainEntityOfPage: `${BASE}${PATH}`,
    datePublished: '2026-01-15',
    dateModified: '2026-07-24',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Blog', item: `${BASE}/blog/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'How to choose subcontractor management software',
        item: `${BASE}${PATH}`,
      },
    ],
  },
];

export default function Guide() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="section article-page" style={{ paddingTop: 80 }}>
        <div className="wrap article-wrap">
          <article className="prose article-body">
            <Link href="/blog" className="article-back">← All articles</Link>
            <p className="eyebrow">Buying guide</p>
            <h1 className="display">
              The ultimate guide to choosing subcontractor management software
            </h1>
            <div className="article-meta">
              <span>Guide</span>
              <span className="dot">•</span>
              <span>5 min read</span>
              <span className="dot">•</span>
              <span>Updated July 2026</span>
            </div>
            <p className="big">
              Most buying guides for construction software are written for general
              contractors. This one is written for subs, by a sub, because the
              software that fits a GC almost never fits you.
            </p>

            <h2 id="the-uncomfortable-question">Start with the uncomfortable question</h2>
            <p>
              Before comparing features, ask where your company actually loses money.
              For most trade contractors it is some mix of: extras done without a
              signed change order, labour hours that nobody can tie to a job until
              the accountant does, crews double-booked or idle because scheduling
              lives on a whiteboard, and progress draws argued from memory instead of
              records. The right software is whichever one closes your specific
              leaks. Everything else is decoration.
            </p>

            <h2 id="features-that-matter">The features that actually matter for subs</h2>
            <p>
              <b>Time tracking tied to job costing.</b> GPS clock-in is table stakes.
              The real question is whether hours flow into per-job labour costs you
              can see daily. If the answer involves exporting to a spreadsheet, keep
              looking.
            </p>
            <p>
              <b>Change orders from the field.</b> The tool must let a foreman create
              and send a priced change order from a phone in about a minute, with
              photos attached, before the extra work is done. Change order capture is
              the single fastest payback of any feature in this category.
            </p>
            <p>
              <b>Daily logs and photos that hold up.</b> Timestamped, GPS-tagged and
              filed to the project automatically. This is your dispute defence file,
              and it is only useful if it builds itself.
            </p>
            <p>
              <b>Scheduling built for multiple small jobs.</b> Subs run three to
              fifteen concurrent projects with crews that move between them. GC tools
              model one big project with many companies. That difference breaks more
              software fits than any missing feature.
            </p>
            <p>
              <b>Progress billing that matches your jurisdiction.</b> If you bill
              percent complete with holdback, the software must do that math
              natively. Canadian subs especially: holdback handled wrong creates real
              accounting pain.
            </p>

            <h2 id="the-traps">The traps</h2>
            <p>
              <b>GC software with a sub license.</b> Platforms built for general
              contractors will happily sell you seats. You will pay for portfolio
              views, bid leveling and owner reporting you never open, while the
              things you need daily feel bolted on.
            </p>
            <p>
              <b>The everything platform.</b> Suites that include accounting, payroll,
              CRM and marketing sound efficient and demo brilliantly. In practice you
              pay for modules you ignore, and each one is shallower than a dedicated
              tool. Your accountant already has accounting software. What you are
              missing is the field.
            </p>
            <p>
              <b>Adoption debt.</b> Any tool your crews will not use is worth exactly
              zero, regardless of features. Evaluate the foreman experience first: if
              clocking in, logging a day or snapping a change order takes more than a
              couple of taps, the data will never exist.
            </p>
            <p>
              <b>Quote-based pricing.</b> If a vendor will not put a price on the
              website, budget for a sales cycle, an annual contract and an
              implementation fee. Published pricing is a signal about the whole
              relationship.
            </p>

            <h2 id="run-the-evaluation">How to run the evaluation</h2>
            <p>
              Pick one real, active job. Load it into the trial: crew, drawings,
              schedule. Have your foreman, not you, run a week of clock-ins, logs and
              photos on it. Send one real change order through it. At the end of the
              week you will know more than any demo, comparison chart or review site
              could tell you. If a platform cannot survive one real week on one real
              job, it will not survive your company.
            </p>

            <h2 id="where-subtrade-fits">Where SubTrade fits</h2>
            <p>
              SubTrade is subcontractor management software built exclusively for
              trade contractors, by a working drywall subcontractor. Time tracking
              with live job costing, sixty-second change orders, scheduling for
              multi-job reality, daily logs, drawings, safety forms and progress
              billing with Canadian holdback, in one plan at{' '}
              <Link href="/pricing-plans">published pricing</Link>. The 14-day trial
              is the evaluation described above: load a real job and see.
            </p>

            <div className="article-cta">
              <div>
                <b>See it on one real job</b>
                <p>The 14-day trial is the evaluation this guide describes — load an active project and watch.</p>
              </div>
              <a href={SIGNUP} className="btn btn-primary btn-lg">Start free trial</a>
            </div>
          </article>

          <ArticleToc items={toc} />
        </div>
      </div>
    </>
  );
}
