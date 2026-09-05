import { SIGNUP } from '../../lib/data';
import Link from 'next/link';
import ArticleToc from '../../components/ArticleToc';
import { AUTHOR, authorSchema } from '../../lib/author';
import { breadcrumbs } from '../../lib/breadcrumbs';
import { isoDateTime } from '../../lib/isodate';

const PATH =
  '/the-ultimate-guide-to-choosing-subcontractor-management-software-for-efficient-project-oversight/';
const BASE = 'https://subtradesoftware.com';

export const metadata = {
  title: 'How to Choose Subcontractor Management Software (2026 Guide)',
  description:
    'How to choose subcontractor management software as a trade contractor: the features that matter, real pricing, the traps to avoid, and a one-week evaluation that works.',
  alternates: { canonical: PATH },
};

const toc = [
  { id: 'what-is-it', title: 'What is subcontractor management software?' },
  { id: 'the-uncomfortable-question', title: 'Start with the uncomfortable question' },
  { id: 'features-that-matter', title: 'The features that matter for subs' },
  { id: 'features-worth-having', title: 'Features worth having' },
  { id: 'the-traps', title: 'The traps' },
  { id: 'sub-vs-gc', title: 'Sub-first vs GC platforms' },
  { id: 'the-shortlist', title: 'The tools people shortlist' },
  { id: 'what-it-should-cost', title: 'What it should cost' },
  { id: 'run-the-evaluation', title: 'How to run the evaluation' },
  { id: 'faq', title: 'Frequently asked questions' },
  { id: 'where-subtrade-fits', title: 'Where SubTrade fits' },
];

const schema = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'The ultimate guide to choosing subcontractor management software',
    description:
      'How to choose subcontractor management software as a trade contractor: the features that matter, real pricing, the traps to avoid, and a one-week evaluation that works.',
    author: authorSchema(),
    publisher: {
      '@type': 'Organization',
      name: 'SubTrade Software Ltd.',
      logo: { '@type': 'ImageObject', url: `${BASE}/logo-horizontal.png` },
    },
    mainEntityOfPage: `${BASE}${PATH}`,
    datePublished: isoDateTime('2026-01-15'),
    dateModified: isoDateTime('2026-08-04'),
  },
  breadcrumbs([
    ['Blog', '/blog/'],
    ['How to choose subcontractor management software', PATH],
  ]),
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is subcontractor management software?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Subcontractor management software is a field management platform built for trade contractors. It combines time tracking with job costing, change orders, crew scheduling across multiple jobs, daily logs, site photos, drawings, safety forms and progress billing in one system, so a sub can run their own crews and projects instead of feeding data into a general contractor\u2019s platform.',
        },
      },
      {
        '@type': 'Question',
        name: 'How is subcontractor software different from general contractor software?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'General contractor software models one large project with many companies working under it. Subcontractor software models one company running many concurrent jobs with crews that move between them. That inversion changes scheduling, job costing, billing and pricing, which is why GC platforms rarely fit trade contractors even when the feature list looks similar.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does subcontractor management software cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Transparent sub-focused platforms typically run a few hundred dollars per month for a whole crew. SubTrade, for example, is $299 CAD per month for up to 5 users with tiered per-user pricing after that and 20% off annual billing. Quote-based enterprise platforms usually land far higher once implementation fees and annual contracts are included.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does subcontractor software need built-in accounting and payroll?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Your accountant already runs dedicated accounting software, and bundled accounting modules are almost always shallower than the tools they replace. What most trade contractors are missing is the field side: time tracking tied to job costing, change order capture, daily logs and progress billing records that feed clean numbers to the accountant.',
        },
      },
      {
        '@type': 'Question',
        name: 'What features matter most for a trade contractor?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Five features carry most of the value: GPS time tracking that flows into per-job labour costs, priced change orders a foreman can send from a phone before extra work starts, daily logs and GPS-tagged photos that file themselves, crew scheduling built for many small concurrent jobs, and progress billing that handles your jurisdiction\u2019s rules, including Canadian holdback.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does holdback affect which progress billing software I choose?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Canadian construction acts require holdback, typically 10%, to be withheld from every progress draw. If your software cannot calculate holdback natively on each billing, someone maintains it in a spreadsheet, releases get missed and the accounting gets painful. Progress billing with built-in holdback math is a hard requirement for Canadian subcontractors.',
        },
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
              <span>By <Link href={AUTHOR.path}>{AUTHOR.name}</Link></span>
              <span className="dot">•</span>
              <span>9 min read</span>
              <span className="dot">•</span>
              <span>Updated August 2026</span>
            </div>
            <p className="big">
              Most buying guides for construction software are written for general
              contractors. This one is written for subs, by a sub, because the
              software that fits a GC almost never fits you.
            </p>

            <h2 id="what-is-it">What is subcontractor management software?</h2>
            <p>
              <Link href="/">Subcontractor management software</Link> is field
              management software built for trade contractors rather than general
              contractors. It puts time tracking with job costing, change orders,
              crew scheduling, daily logs, site photos, drawings, safety forms and
              progress billing in one platform, so a drywall, electrical, plumbing,
              HVAC, painting, framing or concrete contractor can run their own
              company instead of just feeding data into someone else&apos;s system.
            </p>
            <p>
              That last distinction matters more than any feature list. Construction
              management software for subcontractors starts from your reality: many
              concurrent jobs, crews that move between them, extras that appear
              mid-shift, and billing rules like Canadian holdback that GC platforms
              treat as an afterthought. If you want the deeper version of that
              argument, read{' '}
              <Link href="/blog/subcontractor-software-vs-general-contractor-software">
                subcontractor software vs general contractor software
              </Link>
              .
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
            <p>
              Write your top two leaks down before you open a single vendor site.
              Every demo is built to make every feature look essential. Your list is
              what keeps the evaluation honest.
            </p>

            <h2 id="features-that-matter">The features that actually matter for subs</h2>
            <p>
              <b>Time tracking tied to job costing.</b>{' '}
              <Link href="/time-tracking">GPS time tracking</Link> with mobile
              clock-in is table stakes. The real question is whether hours flow into
              per-job labour costs you can see daily, against the labour budget you
              estimated. If the answer involves exporting timesheets to a
              spreadsheet, keep looking. Labour is the biggest and most volatile cost
              on a trade contractor&apos;s job, and construction time tracking that
              does not feed job costing is just a fancier punch clock.
            </p>
            <p>
              <b>Change orders from the field.</b> The tool must let a foreman create
              and send a priced change order from a phone in about a minute, with
              photos attached, before the extra work is done.{' '}
              <Link href="/construction-management-features/change-order-management">
                Change order management
              </Link>{' '}
              is the single fastest payback of any feature in this category, because
              every unsigned extra is pure margin walking off the job.
            </p>
            <p>
              <b>Daily logs and photos that hold up.</b> Timestamped, GPS-tagged and
              filed to the project automatically.{' '}
              <Link href="/construction-management-features/daily-logs">
                Construction daily logs
              </Link>{' '}
              and{' '}
              <Link href="/construction-management-features/site-photos">
                site photos
              </Link>{' '}
              are your dispute defence file, and they are only useful if the file
              builds itself while the crew works.
            </p>
            <p>
              <b>Scheduling built for multiple small jobs.</b> Subs run three to
              fifteen concurrent projects with crews that move between them. GC tools
              model one big project with many companies. That difference breaks more
              software fits than any missing feature.{' '}
              <Link href="/construction-management-features/construction-crew-scheduling">
                Crew scheduling software
              </Link>{' '}
              for subcontractors has to answer one question fast: who is on which job
              tomorrow, and what happens to everything else if I move them.
            </p>
            <p>
              <b>Progress billing that matches your jurisdiction.</b> If you bill
              percent complete with holdback, the software must do that math
              natively.{' '}
              <Link href="/construction-management-features/progress-billing">
                Progress billing software
              </Link>{' '}
              that ignores holdback creates real accounting pain for Canadian subs.
              If you want to see how much of your cash is sitting in holdback right
              now, run your numbers through the free{' '}
              <Link href="/construction-holdback-calculator">
                construction holdback calculator
              </Link>
              .
            </p>

            <h2 id="features-worth-having">Features worth having once the big five are covered</h2>
            <p>
              These will not make or break the purchase, but they separate a complete
              subcontractor platform from a point tool:{' '}
              <Link href="/construction-management-features/drawings-markups">
                drawings and markups
              </Link>{' '}
              so the field always works from the current set,{' '}
              <Link href="/construction-management-features/task-management">
                task and punch list management
              </Link>{' '}
              so deficiencies get closed instead of remembered,{' '}
              <Link href="/construction-management-features/safety-custom-forms">
                safety and custom forms
              </Link>{' '}
              so hazard assessments and toolbox talks live with the job,{' '}
              <Link href="/construction-management-features/submittals">
                submittals
              </Link>{' '}
              for the paper trail GCs demand, and a{' '}
              <Link href="/construction-management-features/project-dashboard">
                project dashboard
              </Link>{' '}
              that shows every active job&apos;s health on one screen. The full list
              is on the{' '}
              <Link href="/construction-management-features">features page</Link>.
            </p>

            <h2 id="the-traps">The traps</h2>
            <p>
              <b>GC software with a sub license.</b> Platforms built for general
              contractors will happily sell you seats. You will pay for portfolio
              views, bid leveling and owner reporting you never open, while the
              things you need daily feel bolted on. The{' '}
              <Link href="/compare">comparison pages</Link> break this down platform
              by platform.
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

            <h2 id="sub-vs-gc">Sub-first platforms vs GC platforms at a glance</h2>
            <table>
              <thead>
                <tr>
                  <th>What you need</th>
                  <th>GC platform</th>
                  <th>Sub-first platform</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Model of the world</td>
                  <td>One big project, many companies</td>
                  <td>One company, many concurrent jobs</td>
                </tr>
                <tr>
                  <td>Scheduling</td>
                  <td>Master project schedule</td>
                  <td>Crews moving across jobs daily</td>
                </tr>
                <tr>
                  <td>Job costing</td>
                  <td>Portfolio and owner reporting</td>
                  <td>Per-job labour cost, updated daily</td>
                </tr>
                <tr>
                  <td>Change orders</td>
                  <td>Routed for approval workflows</td>
                  <td>Priced and sent from the field in a minute</td>
                </tr>
                <tr>
                  <td>Billing</td>
                  <td>Owner draws and payment apps</td>
                  <td>Progress billing with holdback math</td>
                </tr>
                <tr>
                  <td>Pricing</td>
                  <td>Quote-based, annual contract</td>
                  <td>Published monthly pricing</td>
                </tr>
              </tbody>
            </table>
            <p>
              For head-to-head detail, see how SubTrade compares with{' '}
              <Link href="/compare/subtrade-vs-procore">Procore</Link>,{' '}
              <Link href="/compare/subtrade-vs-buildertrend">Buildertrend</Link>,{' '}
              <Link href="/compare/subtrade-vs-fieldwire">Fieldwire</Link> and the
              rest of the field on the{' '}
              <Link href="/compare">compare hub</Link>.
            </p>

            <h2 id="the-shortlist">The tools people shortlist, honestly framed</h2>
            <p>
              Most &ldquo;best software for subcontractors&rdquo; lists mix three
              different products together: tools for GCs, tools for residential
              builders, and tools for the trade subcontractors doing the actual work.
              Here is the same shortlist separated by who each one was really built
              for.
            </p>
            <p>
              <b>SubTrade</b> is built exclusively for trade subcontractors: GPS time
              tracking with live job costing, change orders from the field, crew
              scheduling across concurrent jobs, daily logs, drawings, safety forms,
              submittals, purchase orders and progress billing with Canadian holdback.
              One published plan, five users included, field-first design. Its focus
              is its edge: it does not try to be accounting or payroll.
            </p>
            <p>
              <b>Fieldwire</b> is strong on plans and task coordination and is widely
              used on large project teams. Subs on big jobs often like it; the money
              side of subcontracting is not its center of gravity.{' '}
              <Link href="/compare/subtrade-vs-fieldwire">Full comparison</Link>.
            </p>
            <p>
              <b>Buildertrend</b> serves residential builders and remodelers well,
              with homeowner-facing features subs rarely need.{' '}
              <Link href="/compare/subtrade-vs-buildertrend">Full comparison</Link>.
            </p>
            <p>
              <b>eSUB</b> also targets trade subs, with deep document workflows and a
              more enterprise-weight rollout.{' '}
              <Link href="/compare/subtrade-vs-esub">Full comparison</Link>.
            </p>
            <p>
              <b>Contractor Foreman</b> offers a very broad module list at an
              aggressive price across many contractor types; breadth over depth.{' '}
              <Link href="/compare/subtrade-vs-contractor-foreman">Full comparison</Link>.
            </p>
            <p>
              <b>Raken</b> is best known for daily reporting and field data capture,
              often paired with other systems for the rest.{' '}
              <Link href="/compare/subtrade-vs-raken">Full comparison</Link>.
            </p>
            <p>
              <b>Knowify</b> is a capable specialty-contractor platform with strong
              contract and back-office workflows.{' '}
              <Link href="/compare/subtrade-vs-knowify">Full comparison</Link>.
            </p>
            <p>
              Ignore feature-count comparisons; every vendor wins its own chart. The
              week-long trial below settles it faster than any list can.
            </p>

            <h2 id="what-it-should-cost">What subcontractor software should cost</h2>
            <p>
              For a crew of five to fifteen, expect a transparent sub-focused
              platform to run a few hundred dollars a month, flat, with everything
              included. SubTrade&apos;s{' '}
              <Link href="/pricing-plans">published pricing</Link> is $299 CAD per
              month for up to 5 users, tiered per-user pricing beyond that, and 20%
              off on annual billing. Quote-based enterprise platforms routinely land
              at several times that once implementation fees and multi-year contracts
              are included, for software your crews use a fraction of.
            </p>
            <p>
              The math that matters is not the subscription. One captured change
              order that would otherwise have been done on a handshake typically pays
              for months of software. A week of labour hours costed to the right job
              before the month closes is worth more than any discount.
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
            <p>Score the week on five questions:</p>
            <ol>
              <li>Did the foreman keep using it after day two without being chased?</li>
              <li>Can you see that job&apos;s labour cost today, without exporting anything?</li>
              <li>Did the change order go from discovery to sent in under five minutes?</li>
              <li>Does the daily log read like evidence you would show a GC in a dispute?</li>
              <li>Could you produce a progress billing with correct holdback from it?</li>
            </ol>
            <p>
              Three or fewer yes answers means keep shopping, no matter how good the
              demo was.
            </p>

            <h2 id="faq">Frequently asked questions</h2>
            <p>
              <b>How is subcontractor software different from general contractor
              software?</b> GC software models one large project with many companies
              under it. Subcontractor software models one company running many jobs
              at once. That inversion changes scheduling, costing, billing and
              pricing, which is why the fit fails even when the feature lists look
              alike. The full breakdown is in{' '}
              <Link href="/blog/subcontractor-software-vs-general-contractor-software">
                this comparison
              </Link>
              .
            </p>
            <p>
              <b>Does it need built-in accounting and payroll?</b> No. Bundled
              accounting modules are almost always shallower than the software your
              accountant already runs. Buy the field side and hand your accountant
              clean job-costed numbers.
            </p>
            <p>
              <b>Does it work for my trade?</b> The workflow above fits any trade
              running crews across concurrent jobs. There are trade-specific
              breakdowns for{' '}
              <Link href="/drywall-contractor-software">drywall</Link>,{' '}
              <Link href="/electrical-contractor-software">electrical</Link>,{' '}
              <Link href="/plumbing-contractor-software">plumbing</Link>,{' '}
              <Link href="/hvac-contractor-software">HVAC</Link>,{' '}
              <Link href="/painting-contractor-software">painting</Link>,{' '}
              <Link href="/framing-contractor-software">framing</Link> and{' '}
              <Link href="/concrete-contractor-software">concrete</Link> contractors.
            </p>
            <p>
              <b>What about US retainage instead of Canadian holdback?</b> Same
              principle, different rules by state. The free{' '}
              <Link href="/construction-retainage-calculator">
                construction retainage calculator
              </Link>{' '}
              covers all fifty states plus DC.
            </p>
            <p>
              <b>How long does rollout take?</b> With a field-first platform, one
              job and one crew should be running inside a week. If a vendor proposes
              a multi-month implementation plan for a fifteen-person company, that is
              the product telling you something.
            </p>

            <h2 id="where-subtrade-fits">Where SubTrade fits</h2>
            <p>
              SubTrade is{' '}
              <Link href="/">subcontractor management software</Link> built
              exclusively for trade contractors, by a working drywall subcontractor.
              Time tracking with live job costing, sixty-second change orders,
              scheduling for multi-job reality, daily logs, drawings, safety forms
              and progress billing with Canadian holdback, in one plan at{' '}
              <Link href="/pricing-plans">published pricing</Link>. The 14-day trial
              is the evaluation described above: load a real job and see.
            </p>

            <div className="article-cta">
              <div>
                <b>See it on one real job</b>
                <p>The 14-day trial is the evaluation this guide describes: load an active project and watch.</p>
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
