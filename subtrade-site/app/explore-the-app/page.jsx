import Link from 'next/link';
import AppDemo from '../../components/AppDemo';
import AppDownload from '../../components/AppDownload';
import RelatedLinks from '../../components/RelatedLinks';
import { SIGNUP } from '../../lib/data';

export const metadata = {
  title: 'Construction App Demo — Try the SubTrade Mobile App',
  description:
    'Interactive construction app demo for subcontractors. Try SubTrade in your browser — no signup: clock in, mark up drawings, sign an FLHA, close punch items and price a change order on a sample drywall job.',
  alternates: { canonical: '/explore-the-app/' },
  openGraph: {
    title: 'Explore the SubTrade mobile app — interactive demo',
    description:
      'The real interface, running in your browser. Tap through time tracking, photos, drawings, daily logs, change orders and progress billing.',
    url: 'https://subtradesoftware.com/explore-the-app/',
    images: ['/subtrade-app-project-tools-home.webp'],
  },
};

const F = '/construction-management-features';

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'SubTrade Mobile App — Interactive Demo',
  url: 'https://subtradesoftware.com/explore-the-app/',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, iOS, Android',
  description:
    'A clickable demo of the SubTrade field management app for trade subcontractors. Runs in the browser with sample project data and needs no account.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'CAD' },
  publisher: { '@type': 'Organization', name: 'SubTrade Software Ltd.' },
};

const faqs = [
  [
    'Do I need an account to try the demo?',
    'No. The demo runs entirely in your browser on sample project data. There is no signup, no email wall and no sales call — tap whatever you want, including the buttons that would normally send something.',
  ],
  [
    'Is this the actual app?',
    'It is the actual interface, rebuilt to run on a web page. The screens, the tools and the flow are what your crew sees on their phones. What it does not do is talk to a real account, so nothing you tap here is saved anywhere.',
  ],
  [
    'Does the real app work without signal?',
    'Yes. Clock-ins, photos, forms and daily logs are captured offline and sync as soon as the phone finds bars again. Parkades, elevator shafts and rural sites were the reason it was built that way.',
  ],
  [
    'What does the crew actually need to learn?',
    'For most workers it is one screen: clock in, take photos, sign the form. Foremen add daily logs and punch items. The office side — change orders, billing, scheduling — is where the training time goes, and that is usually an afternoon.',
  ],
  [
    'Is it on iOS and Android?',
    'Both, from the App Store and Google Play, and the same account opens in a browser for the office. One subscription covers all three.',
  ],
  [
    'What does it cost after the trial?',
    '$299 per month with five users included, and additional users on top. The free trial does not ask for a credit card. Full pricing is on the pricing page.',
  ],
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

const relatedGroups = [
  {
    label: 'Go deeper on what you just tried',
    links: [
      { href: '/time-tracking', label: 'Time tracking' },
      { href: `${F}/drawings-markups`, label: 'Drawings & markups' },
      { href: `${F}/change-order-management`, label: 'Change orders' },
      { href: `${F}/daily-logs`, label: 'Daily logs' },
    ],
  },
  {
    label: 'Free, no signup',
    links: [
      { href: '/construction-holdback-calculator', label: 'Holdback calculator' },
      { href: '/construction-retainage-calculator', label: 'Retainage calculator' },
      { href: '/construction-templates', label: 'Templates' },
      { href: '/how-to-tutorials', label: 'Video tutorials' },
    ],
  },
];

export default function ExploreTheAppPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="hero" style={{ paddingBottom: 30 }}>
        <div className="wrap hero-inner" style={{ maxWidth: 900 }}>
          <p className="eyebrow">Interactive · No signup</p>
          <h1 className="display" style={{ fontSize: 'clamp(38px,6vw,72px)' }}>
            Explore the
            <br />
            <em>mobile app</em>
          </h1>
          <p className="lede">
            This is the app your crew carries, running in your browser. Clock in,
            mark up a drawing, sign an inspection, close a punch item and assemble a
            progress draw — on sample data, without talking to anybody.
          </p>
          <p className="hero-note">
            Tap anything. Nothing here is connected to a real account, so you cannot
            break it. Prefer a human?{' '}
            <Link href="/construction-software-15min-demo">Book a 15-minute walkthrough</Link>.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <AppDemo />
        </div>
      </section>

      <div className="wrap">
        <div className="chalkline" />
      </div>

      <section className="section">
        <div className="wrap" style={{ maxWidth: 820 }}>
          <p className="eyebrow">Why it looks like this</p>
          <h2
            className="display"
            style={{ fontSize: 'clamp(30px,4.4vw,46px)', margin: '14px 0 22px' }}
          >
            Built for a phone in a glove
          </h2>
          <div className="prose">
            <p>
              Most construction software was designed for a general contractor sitting
              at a desk, then shrunk down until it fit on a phone. SubTrade went the
              other way. The screen you just tapped through is the one a foreman opens
              standing on a scissor lift, and every decision in it came from that.
            </p>
            <p>
              One project at a time, because a worker is only ever on one job. Thirteen
              tools on a single screen rather than buried in a menu tree. Buttons big
              enough for a gloved thumb. And everything captured offline, because the
              parkade level of a downtown job has never had a bar of signal in its life.
            </p>
            <h3>The office half is a browser away</h3>
            <p>
              What lands from the field shows up instantly on the office side: hours
              against cost codes, GPS-tagged photos, signed forms, approved change
              orders. The{' '}
              <Link href={`${F}/project-dashboard`}>project dashboard</Link> is where
              that turns into job costing and{' '}
              <Link href={`${F}/progress-billing`}>progress billing</Link>, with the
              holdback already handled. Same subscription, no separate module to buy.
            </p>
            <h3>What the demo leaves out</h3>
            <p>
              The clickable version above runs on made-up data for one drywall job.
              The live app carries your real projects, your cost codes, your crews and
              your GC&rsquo;s forms, and it syncs between the phone and the office in
              both directions. Everything else — the layout, the flow, the number of
              taps — is exactly what you just used.
            </p>
          </div>
        </div>
      </section>

      <AppDownload />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Before you ask</p>
            <h2 className="display">The demo, answered</h2>
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
          <h2 className="display">Now try it on your own job</h2>
          <p>
            The free trial takes a project, a crew and about ten minutes to set up.
            $299/month after that, five users included, no credit card to start.
          </p>
          <a href={SIGNUP} className="btn btn-primary btn-lg">
            Start free trial
          </a>
        </div>
      </section>

      <RelatedLinks groups={relatedGroups} />
    </>
  );
}
