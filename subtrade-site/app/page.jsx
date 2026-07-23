import Link from 'next/link';
import { trades } from '../lib/data';
import AppShowcase from '../components/AppShowcase';
import Reviews from '../components/Reviews';
import AppDownload from '../components/AppDownload';

export const metadata = {
  title: 'Subcontractor Software for Trade Contractors | SubTrade',
  description:
    'All-in-one subcontractor software for electrical, plumbing, HVAC, drywall & concrete trades. GPS time tracking, change orders, daily logs. 14-day free trial.',
};

const faqs = [
  ['What is SubTrade and who is it built for?', 'SubTrade is all-in-one subcontractor software built exclusively for trade contractors, including electrical, plumbing, HVAC, drywall, painting, framing and more. It is engineered around how subs actually work: mobile-first time tracking, fast change orders, crew scheduling and real-time job costing.'],
  ['How much does SubTrade cost?', 'The plan is $299/month CAD with 5 users included, or save 20% with annual billing at $2,870/yr. Additional users are tiered from $15 down to $4 each. Every plan includes the full platform, with a 14-day free trial and no credit card required.'],
  ['How quickly can my crew get set up?', 'Most subcontractors are fully set up with crews clocking in within one business day. No IT team, no lengthy onboarding: your field crew starts on their phones the same day you sign up.'],
  ['Does SubTrade work on phones in the field?', 'Yes. SubTrade is fully mobile on iOS and Android, built for jobsite reality: GPS clock-in, daily logs with photos, and change orders created and sent from a phone.'],
  ['Can SubTrade replace my spreadsheets and paper timesheets?', 'That is exactly what it is designed to do. GPS-verified time tracking replaces paper timesheets, live dashboards replace status spreadsheets, and scheduling, logs and change orders all live in one place.'],
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};


const PORTAL = 'https://portal.subtradesoftware.com';
const SIGNUP = 'https://portal.subtradesoftware.com/signup';

const day = [
  {
    time: '6:52 AM',
    title: 'Crew clocks in from the truck',
    body: 'GPS clock-in stamps who is on site and when. Hours land on the right job automatically, so job costing is real from minute one.',
  },
  {
    time: '9:15 AM',
    title: 'Site condition gets documented',
    body: 'Foreman snaps GPS-tagged photos of the blocked area and files a daily log in two minutes. Timestamped proof, tied to the project, searchable forever.',
  },
  {
    time: '11:40 AM',
    title: 'The GC asks for extra work',
    body: 'A change order goes out from the phone before lunch, with photos attached. No more doing extras on a handshake and fighting for the money at month end.',
  },
  {
    time: '2:30 PM',
    title: 'Tomorrow gets scheduled',
    body: 'Crews get moved between jobs on the scheduling board. Everyone sees where they are going before they leave site today.',
  },
  {
    time: '4:45 PM',
    title: 'Progress billing writes itself',
    body: 'Percent complete rolls up from the field data your crew already entered. Your monthly draw is backed by logs, photos and hours, not guesswork.',
  },
];

const featureGroups = [
  {
    key: 'field',
    label: 'Field',
    tools: [
      ['⏱️', 'Time Tracking', 'GPS clock-in with live job costing per project.'],
      ['📝', 'Daily Logs', 'Two-minute site reports with weather and manpower.'],
      ['📷', 'Photos', 'GPS-tagged and timestamped, organized by project.'],
      ['🛡️', 'Safety & Custom Forms', 'FLHAs, toolbox talks and your own forms, signed on the phone.'],
    ],
  },
  {
    key: 'money',
    label: 'Money',
    tools: [
      ['🧾', 'Change Orders', 'Price, send and track extras before the work is done.'],
      ['💵', 'Progress Billing', 'Draws built from real field data, with holdback handled.'],
      ['🧰', 'Purchase Orders', 'Commit costs against budgets and see burn instantly.'],
    ],
  },
  {
    key: 'office',
    label: 'Office',
    tools: [
      ['📅', 'Crew Scheduling', 'Drag crews between jobs, notify them automatically.'],
      ['✅', 'Tasks & Punch Lists', 'Kanban boards for deficiencies and closeout.'],
      ['📐', 'Drawings & Markups', 'Current set on every phone, marked up in the field.'],
      ['📄', 'Submittals & RFIs', 'Track what is out, what is late and who is holding it.'],
      ['📊', 'Project Dashboard', 'Every job, its hours, costs and status on one screen.'],
    ],
  },
];

export default function Home() {
  return (
    <>
      <section className="hero hero-photo">
        <div className="wrap hero-split">
          <div className="hero-inner">
            <p className="eyebrow">Field management for trade subcontractors</p>
            <h1 className="display">
              Subcontractor software
              <br />
              <em>built in the field</em>
            </h1>
            <p className="lede">
              Track hours, capture change orders, run crews and bill progress
              from one app your field crew will actually use. Built by a working
              sub, not a software company guessing at your day.
            </p>
            <div className="hero-ctas">
              <a href={SIGNUP} className="btn btn-primary btn-lg">
                Start free trial
              </a>
              <Link href="/construction-software-15min-demo" className="btn btn-ghost btn-lg">
                Book a 15-min demo
              </Link>
            </div>
            <p className="hero-note">
              Free trial. $299/month CAD after, 5 users included. No demo call required.
            </p>
          </div>

          <div className="hero-media">
            <img
              src="/subtrade-foreman-using-app-jobsite.webp"
              alt="Foreman in a SubTrade hoodie updating the job from his phone on site"
              fetchPriority="high"
            />
          </div>

        </div>
        <div className="wrap">
          <div className="dimstring" aria-label="Key numbers">
            <div className="dim">
              <span className="mono">13</span>
              <small>tools in one app</small>
            </div>
            <div className="dim">
              <span className="mono">5</span>
              <small>users included in base plan</small>
            </div>
            <div className="dim">
              <span className="mono">$299</span>
              <small>per month CAD, flat</small>
            </div>
            <div className="dim">
              <span className="mono">0</span>
              <small>demo calls to get started</small>
            </div>
          </div>
        </div>
      </section>

      <div className="wrap"><div className="chalkline" /></div>

      <AppShowcase />

      <section className="section">
        <div className="wrap">
          <div className="head-split">
            <div className="section-head">
              <p className="eyebrow">One day, one app</p>
              <h2 className="display">Follow a crew through Tuesday</h2>
              <p>
                Most construction software is built for the GC upstairs. SubTrade
                follows your crew from the truck to the draw.
              </p>
            </div>
            <img
              src="/subtrade-worker-capturing-site-photo.webp"
              alt="Worker on a commercial jobsite using the SubTrade app on a phone"
              className="media-inset"
              loading="lazy"
            />
          </div>
          <div className="workflow">
            {day.map((s) => (
              <div className="step" key={s.time}>
                <span className="step-time">{s.time}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Reviews />

      <section className="section featureset" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">The full set</p>
            <h2 className="display">Everything on one screen</h2>
            <p>
              No modules to bolt on, no per-feature upsells. Every plan gets the
              whole platform.
            </p>
          </div>

          <div className="fset-cols">
            {featureGroups.map((g) => (
              <div className={`fset-col cat-${g.key}`} key={g.key}>
                <div className="fset-col-h">
                  <span className="fset-dot" aria-hidden="true" />
                  {g.label}
                  <b>{g.tools.length}</b>
                </div>
                {g.tools.map(([ico, title, body]) => (
                  <div className="fset-row" key={title}>
                    <span className="fset-ico" aria-hidden="true">
                      {ico}
                    </span>
                    <div className="fset-text">
                      <h3>{title}</h3>
                      <p>{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap founder">
          <blockquote className="display">
            I run a drywall company in Calgary.
            <br />
            <span>SubTrade exists because nothing on the market was built for us.</span>
          </blockquote>
          <div>
            <p className="founder-meta">
              <b>Fabian Vargas Garcia</b>
              Co-Founder, SubTrade · President, Quality Gypsum Services
            </p>
            <div className="founder-facts">
              <div className="fact">
                <span className="mono">Still</span>
                <p>Estimating and running commercial drywall projects every week</p>
              </div>
              <div className="fact">
                <span className="mono">Why</span>
                <p>
                  Every field tool was priced and designed for general contractors.
                  Subs got the leftovers.
                </p>
              </div>
              <div className="fact">
                <span className="mono">Result</span>
                <p>
                  Every feature ships because a real subcontracting business needed
                  it on a real job first.
                </p>
              </div>
            </div>
            <p style={{ marginTop: 26 }}>
              <Link href="/about" className="btn btn-ghost">
                Read the story
              </Link>
            </p>
          </div>
        </div>
      </section>

      <AppDownload />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Built for your trade</p>
            <h2 className="display">Software for the trade you run</h2>
          </div>
          <div className="grid">
            {trades.map((t) => (
              <Link href={`/${t.slug}`} className="cell" key={t.slug}>
                <h3>{t.trade}</h3>
                <p>{t.description.split('.')[0]}.</p>
              </Link>
            ))}
            <Link href={SIGNUP} className="cell cell-more">
              <h3>Your trade too</h3>
              <p>
                Glazing, roofing, insulation, mechanical and more. If you run
                crews on commercial sites, SubTrade fits. Try it on a real job.
              </p>
              <span className="cell-more-cta">Start free trial →</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
          <div className="section-head">
            <p className="eyebrow">Questions subs actually ask</p>
            <h2 className="display">Frequently asked questions</h2>
          </div>
          <div className="workflow">
            {faqs.map(([q, a]) => (
              <div className="step" key={q} style={{ gridTemplateColumns: '1fr 1.4fr' }}>
                <h3 style={{ textTransform: 'none', fontSize: 21 }}>{q}</h3>
                <p>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap">
          <h2 className="display">Run your next job on it</h2>
          <p>Set up takes an afternoon. Your foreman will get it by coffee break.</p>
          <a href={SIGNUP} className="btn btn-primary btn-lg">
            Start free trial
          </a>
        </div>
      </section>
    </>
  );
}
