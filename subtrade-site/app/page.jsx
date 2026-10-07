import Link from 'next/link';
import { trades } from '../lib/data';
import AppShowcase from '../components/AppShowcase';
import Reviews from '../components/Reviews';
import AppDownload from '../components/AppDownload';
import TutorialStrip from '../components/TutorialStrip';
import { toolGroups, TOOL_COUNT, DEFINITION, COMING_SOON } from '../lib/tools';

export const metadata = {
  alternates: { canonical: '/' },
  title: 'Subcontractor Software for Trade Contractors | SubTrade',
  description:
    'All-in-one subcontractor software for electrical, plumbing, HVAC, drywall & concrete trades. GPS time tracking, change orders, daily logs. 14-day free trial.',
};

const faqs = [
  ['What is SubTrade and who is it built for?', 'SubTrade is all-in-one subcontractor software built exclusively for trade contractors, including electrical, plumbing, HVAC, drywall, painting, framing and more. It is engineered around how subs actually work: mobile-first time tracking, fast change orders, crew scheduling and real-time job costing.'],
  ['How much does SubTrade cost?', 'The plan is $299/month CAD with 5 users included, or save 20% with annual billing at $2,870/yr. Additional users are tiered from $15 down to $4 each. Every plan includes the full platform, with a 14-day free trial.'],
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
  { time: '6:52 AM', title: 'Crew clocks in', body: 'GPS clock-in from the truck. Hours land on the right job, so job costing is real from minute one.' },
  { time: '9:15 AM', title: 'Site gets documented', body: 'GPS-tagged photos and a two-minute daily log. Timestamped proof, tied to the project.' },
  { time: '11:40 AM', title: 'GC asks for an extra', body: 'The change order goes out from the phone before lunch, photos attached.' },
  { time: '2:30 PM', title: 'Tomorrow gets booked', body: 'Crews move between jobs on the board and see where they are going before they leave.' },
  { time: '4:45 PM', title: 'The draw builds itself', body: 'Percent complete rolls up from the day. Holdback handled.' },
];

export default function Home() {
  return (
    <>
      {/* Preload the hero background (LCP element). As a CSS background-image it is
          otherwise only discovered after the stylesheet is parsed, which serialized
          the request chain and pushed mobile LCP past 8s on slow 4G. */}
      <link
        rel="preload"
        as="image"
        href="/subtrade-commercial-construction-site-mobile.webp"
        media="(max-width: 700px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href="/subtrade-commercial-construction-site.webp"
        media="(min-width: 700.1px)"
        fetchPriority="high"
      />
      <section className="hero hero-photo">
        <div className="wrap hero-split">
          <div className="hero-inner">
            <p className="eyebrow">Field management for trade subcontractors</p>
            <h1 className="display">
              Subcontractor software
              <br />
              <em>built in the field</em>
            </h1>
            <p className="lede">{DEFINITION}</p>
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
              <span className="mono">{TOOL_COUNT}</span>
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

      <section className="section daytl-section">
        <div className="wrap">
          <div className="daytl-head">
            <div className="daytl-title">
              <p className="eyebrow">One day, one app</p>
              <h2 className="display">From the truck to the draw</h2>
            </div>
            <p className="daytl-intro">
              Most construction software is built for the GC upstairs. SubTrade
              follows your crew through the day, and every step feeds the next.
              Still comparing tools? Start with our guide to{' '}
              <Link href="/the-ultimate-guide-to-choosing-subcontractor-management-software-for-efficient-project-oversight">
                choosing subcontractor management software
              </Link>
              .
            </p>
          </div>
          <ol className="daytl">
            {day.map((s) => (
              <li className="daytl-step" key={s.time}>
                <span className="daytl-dot" aria-hidden="true" />
                <span className="daytl-time">{s.time}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Reviews />

      <section className="section toolset" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="toolset-head">
            <div>
              <p className="eyebrow">The full set</p>
              <h2 className="display">{TOOL_COUNT} tools. Every plan.</h2>
              <p>
                No modules to bolt on and no per-feature upsells. Field, money
                and office, all on one screen.
              </p>
            </div>
            <img
              src="/subtrade-worker-capturing-site-photo.webp"
              alt="Worker on a commercial jobsite taking a site photo in the SubTrade app"
              loading="lazy"
            />
          </div>

          <div className="toolset-cols">
            {toolGroups.map((g) => (
              <div className={`toolset-col zone-${g.key}`} key={g.key}>
                <div className="toolset-col-h">
                  <h3>{g.label}</h3>
                  <span>{g.tools.length} tools</span>
                </div>
                <ul>
                  {g.tools.map(([, title, body, href]) => (
                    <li key={title}>
                      <Link href={href} className="toolset-row">
                        <span className="toolset-name">
                          {title}
                          <span className="toolset-arrow" aria-hidden="true">→</span>
                        </span>
                        <span className="toolset-desc">{body}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="toolset-soon">
            <span className="toolset-soon-label">Coming soon</span>
            {COMING_SOON.map(([, name, sub]) => (
              <div className="toolset-soon-item" key={name}>
                <span className="toolset-name">{name} <span className="soon-tag">Soon</span></span>
                <span className="toolset-desc">{sub}</span>
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
              <b>Fabian V.</b>
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

      <TutorialStrip
        eyebrow="Watch it work"
        title="Two minutes each. See the app before you sign up."
        intro="Time tracking, scheduling, projects and forms, walked through by the SubTrade team. Every video comes with a PDF guide."
      />

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
