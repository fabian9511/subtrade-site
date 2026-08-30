import HoldbackCalc from '../../components/HoldbackCalc';
import { STATES, releaseLabel } from '../../lib/retainage';
import RelatedLinks from '../../components/RelatedLinks';
import { SIGNUP } from '../../lib/data';

export const metadata = {
  title: 'Construction Retainage Calculator (All 50 States)',
  description:
    'Free retainage and progress billing calculator for US subcontractors. Work out your pay application, the retainage withheld and the net payable, with statutory caps for all 50 states and DC — public and private. Download the draw summary as a PDF.',
  alternates: { canonical: '/construction-retainage-calculator/' },
};

const faqs = [
  [
    'What is retainage in construction?',
    'Retainage is a percentage of every progress payment that the owner or general contractor holds back rather than paying out, released only after the work is complete and accepted. It exists to give the payer leverage over punch list and closeout. Unlike the Canadian statutory holdback, US retainage is not a lien fund held for your benefit — it is your money sitting in somebody else’s account, and in a number of states there is no legal ceiling on how much of it they can keep.',
  ],
  [
    'How much retainage can be withheld?',
    'Five percent is the most common statutory cap and the closest thing to a national norm, but it is not universal. New Jersey caps public retainage at 2%, Iowa at 3%, South Carolina at 3.5%, Ohio at 4%. Texas, Pennsylvania, Illinois, Kentucky, Michigan, Louisiana, Nebraska, North Dakota and DC still allow 10% on at least some work. New Mexico prohibits retainage outright. Alaska, New Hampshire, South Dakota, Vermont and West Virginia set no cap at all — West Virginia has no retainage statute whatsoever.',
  ],
  [
    'Is retainage different on public and private jobs?',
    'Yes, and this is the single most expensive thing to get wrong. Most states wrote their public retainage rules decades before they touched private work, so the two numbers are frequently different and in about eighteen states private work is not capped at all. Arizona caps public work at 10% but leaves private work entirely to the contract. Missouri runs the other way, 5% public and 10% private. Alabama is 5% public and 10% private. Always check which side of the line your job falls on before you price it.',
  ],
  [
    'When does retainage have to be released?',
    'It depends on the state and, again, on whether the job is public or private. Thirty days after completion or acceptance is the most common statutory clock. Maryland runs 120 days on public work, Tennessee and Rhode Island around 90, Massachusetts 65, Alaska just 8 working days from the prime being paid. Several states — North Dakota, Illinois, Hawaii, Virginia, Wisconsin, West Virginia — set no deadline at all, which means the contract is the only thing standing between you and an indefinite wait.',
  ],
  [
    'Do I charge sales tax on retainage?',
    'Usually there is nothing to charge. In most states sales or use tax on construction work attaches to materials at the time you purchase them, with the contractor treated as the final consumer, rather than to the progress payment you bill the owner. That is why this calculator has no tax line — unlike the Canadian version, where GST timing on the holdback is worth real money. A handful of states do tax construction services or specific project types, so confirm your own state before you invoice.',
  ],
  [
    'Does retainage drop once the job is half done?',
    'In a number of states, yes, and a surprising number of subs never ask for it. Arizona releases half the retainage and drops to 5% at the 50% mark. Pennsylvania does the same. Oklahoma steps down to 2.5%. Illinois and Kentucky drop to 5%. Arkansas, Hawaii, North Carolina, North Dakota and Wisconsin simply stop withholding further retainage once you pass 50%. Michigan freezes at that point rather than stepping down. If your state has a step-down and nobody applies it, that is cash you are entitled to and are not asking for.',
  ],
  [
    'What is the difference between retainage and holdback?',
    'They solve different problems. Canadian holdback is set by provincial lien legislation, is the same percentage on every job in the province, and exists as a fund that unpaid subs and suppliers can claim against — the payer is legally required to withhold it and cannot contract out of it. US retainage is a contract term that the states have layered caps on top of, it varies by state and by project type, and it is security for the payer rather than a fund for you. If you work both sides of the border, use the Canadian holdback calculator for Canadian jobs — the math and the language are genuinely different.',
  ],
  [
    'Can I download the calculation as a PDF?',
    'Yes, and it is free with no signup. Enter the project name and the pay application number, then use the download button to get a one-page draw summary you can attach to your pay app or take into a progress meeting. It shows the contract inputs, the retainage withheld, the governing state statute and the net payable. The PDF is generated in your browser, so nothing is uploaded and nothing is stored.',
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

// A WebPage rather than a WebApplication. Google's rich results rules require
// anything in the SoftwareApplication family to carry a rating or a review, and
// a free calculator has neither, so the old markup failed validation on every
// crawl while buying no rich result in return.
const pageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Construction Retainage Calculator',
  url: 'https://subtradesoftware.com/construction-retainage-calculator/',
  description:
    'Calculate retainage withheld and net payable on a US construction progress payment, with statutory caps for all 50 states and DC.',
  isPartOf: { '@id': 'https://subtradesoftware.com/#website' },
  publisher: { '@id': 'https://subtradesoftware.com/#organization' },
  inLanguage: 'en-US',
};

const F = '/construction-management-features';

const relatedGroups = [
  {
    label: 'Do this in SubTrade instead',
    links: [
      { href: `${F}/change-order-management`, label: 'Change Orders' },
      { href: `${F}/project-dashboard`, label: 'Project Dashboard' },
      { href: '/time-tracking', label: 'Time Tracking' },
    ],
  },
  {
    label: 'Free for subcontractors',
    links: [
      { href: '/construction-holdback-calculator', label: 'Canadian holdback calculator' },
      { href: '/construction-templates', label: 'Free templates' },
      { href: '/how-to-tutorials', label: 'Video tutorials' },
    ],
  },
];

// A null cap is not zero and it is not unknown — it means the state never set
// a ceiling, which is exactly where a sub is least protected. Say so.
function cap(v) {
  if (v === null || v === undefined) return <em className="hb-nocap">No cap</em>;
  if (v === 0) return <em className="hb-nocap">Prohibited</em>;
  return <span className="mono">{v}%</span>;
}

export default function RetainageCalculatorPage() {
  const rows = STATES.filter((s) => s.statute);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />

      <section className="hero" style={{ paddingBottom: 34 }}>
        <div className="wrap hero-inner" style={{ maxWidth: 900 }}>
          <p className="eyebrow">Free tool · No signup</p>
          <h1 className="display" style={{ fontSize: 'clamp(38px,6vw,72px)' }}>
            Construction retainage
            <br />
            <em>calculator</em>
          </h1>
          <p className="lede">
            Work out what a progress payment actually pays you after retainage —
            and whether the amount being withheld is even legal in your state.
            Built for US trade subcontractors.
          </p>
          <p className="hero-note">
            All 50 states and DC, public and private caps, with the step-down
            rules. Download the draw summary as a PDF — nothing leaves your
            browser. Working in Canada?{' '}
            <a href="/construction-holdback-calculator/">
              Use the holdback calculator instead
            </a>
            .
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap" style={{ maxWidth: 1000 }}>
          <HoldbackCalc country="US" />
        </div>
      </section>

      <div className="wrap">
        <div className="chalkline" />
      </div>

      <section className="section">
        <div className="wrap" style={{ maxWidth: 820 }}>
          <p className="eyebrow">The part nobody explains</p>
          <h2
            className="display"
            style={{ fontSize: 'clamp(30px,4.4vw,46px)', margin: '14px 0 22px' }}
          >
            Retainage is not a discount
          </h2>
          <div className="prose">
            <p>
              Retainage is the oldest financing trick in construction. A
              percentage of every payment gets held back until the job is done,
              which means the subcontractor — the party with the least cash and
              the most payroll — funds the closeout risk of everybody above
              them. On a $500,000 contract at 10% you are carrying $50,000 of
              somebody else&rsquo;s comfort for the length of the job plus
              however long the release takes. That is usually more than your net
              margin, and it is the reason a profitable sub can still run out of
              money.
            </p>
            <p>
              Two things make it worse than it needs to be. The first is billing
              late — every week you delay a pay application is a week further out
              on money you already spent on labor and material. The second is
              unapproved change orders, because work you performed but never got
              approved is not in the value of work in place at all, so it is not
              even earning its retainage yet.
            </p>
            <h3>The cap is not five percent everywhere</h3>
            <p>
              Most people in the trades carry around a rule of thumb that
              retainage is 10%, or that it is 5%, and neither is reliably true.
              The statutory ceiling depends on the state, on whether the money is
              public or private, and increasingly on when the contract was
              signed. New Jersey caps public work at 2%. Iowa cut its cap from 5%
              to 3% in July 2025. Ohio replaced an 8%-until-halfway regime with a
              flat 4% at the end of September 2025, so two different rules are
              live right now depending on your contract date. California only
              got a private cap for contracts signed from January 2026, and New
              York only started voiding private clauses above 5% in December
              2025.
            </p>
            <h3>The states where nothing protects you</h3>
            <p>
              Alaska, New Hampshire, South Dakota, Vermont and West Virginia set
              no statutory ceiling on either public or private retainage. West
              Virginia has no retainage statute at all. In roughly eighteen more
              states — Arizona, Texas, Pennsylvania, Michigan, Louisiana,
              Oklahoma, Wisconsin, Virginia, Delaware, DC and others — public
              work is capped but private work is left entirely to the contract.
              This calculator says <em>no statutory cap</em> in those cases
              rather than showing a number, because a number would be a lie and
              the honest answer is that your payment clause is the only thing
              standing between you and whatever the GC feels like withholding.
            </p>
            <p>
              Texas is the one to be careful with, because the secondary sources
              get it wrong. Property Code §53.101 requires an owner to reserve
              10% as a lien fund for claimants. That is a duty the owner owes to
              people who might file a lien; it is not a ceiling on what can be
              withheld from your pay application. Plenty of articles publish it
              as a 10% private cap. It is not one.
            </p>
            <h3>Ask for the step-down</h3>
            <p>
              A dozen states reduce or stop retainage at the halfway mark, and it
              is rarely applied unless somebody asks. Arizona and Pennsylvania
              both release half the retainage and drop the rate to 5% at 50%
              complete. Oklahoma steps down to 2.5%. Illinois, Kentucky and
              Nebraska drop to 5%. Arkansas, Hawaii, North Carolina, North Dakota
              and Wisconsin simply stop withholding more. Michigan freezes at 10%
              rather than stepping down. If your job crossed 50% two draws ago
              and the withholding never changed, that is a phone call worth
              making.
            </p>
            <h3>Caps by state</h3>
            <p>
              Public and private ceilings, with the usual release clock. Where
              the two release windows differ, the public figure is shown first.
              Several of these have moved recently, so treat the statute cite as
              the thing to check rather than the number.
            </p>
          </div>

          <div className="hb-table-wrap">
            <table className="hb-table wide">
              <thead>
                <tr>
                  <th>State</th>
                  <th>Public</th>
                  <th>Private</th>
                  <th>Release</th>
                  <th>Statute</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s.code}>
                    <td>{s.name}</td>
                    <td>{cap(s.publicPct)}</td>
                    <td>{cap(s.privatePct)}</td>
                    <td className="mono">{releaseLabel(s)}</td>
                    <td>{s.statute}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="hb-tablenote">
            Caps frequently turn on contract size or project type: Georgia and
            Indiana have dollar thresholds, Massachusetts requires a $3 million
            contract before the private cap applies, North Carolina prohibits
            retainage under $100,000, Louisiana and Texas tier down on larger
            jobs, and several state DOTs are carved out of their own state&rsquo;s
            rules. New Mexico prohibits retainage except on state road work.
            None of this is legal advice; confirm your project with your
            attorney.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Questions subs actually ask</p>
            <h2 className="display">Retainage, answered</h2>
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
          <h2 className="display">Stop doing this in a spreadsheet</h2>
          <p>
            SubTrade assembles the pay application off your actual field data —
            hours, approved change orders and percent complete — with the
            retainage line already in it. $299/month, 5 users included.
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
