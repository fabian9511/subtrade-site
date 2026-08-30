import HoldbackCalc from '../../components/HoldbackCalc';
import { PROVINCES } from '../../lib/holdback';
import RelatedLinks from '../../components/RelatedLinks';
import { SIGNUP } from '../../lib/data';

export const metadata = {
  title: 'Construction Holdback Calculator (Canada)',
  description:
    'Free holdback and progress billing calculator for Canadian subcontractors. Work out your draw, the statutory holdback withheld, GST timing and net payable — Alberta, BC, Saskatchewan, Manitoba and Ontario. Download the draw summary as a PDF.',
  alternates: { canonical: '/construction-holdback-calculator/' },
};

const faqs = [
  [
    'What is a construction holdback?',
    'A holdback is a percentage of every progress payment that the payer is required by lien legislation to retain rather than pay out. It sits as a fund that unpaid subcontractors and suppliers can claim against if someone further up the chain does not get paid. It is not a penalty and it is not discretionary — in most Canadian provinces the payer is legally required to hold it back, and cannot waive it by contract.',
  ],
  [
    'How much is the holdback in Canada?',
    'Ten percent of the value of work done is the standard across most of Canada, including Alberta, British Columbia, Saskatchewan and Ontario. Manitoba is the notable exception at 7.5%. The percentage is set by each province’s lien legislation, so it does not change from project to project within a province.',
  ],
  [
    'How long is holdback held for in Alberta?',
    'Under the Prompt Payment and Construction Lien Act, the 10% holdback is normally retained for 60 days after a certificate of substantial performance is issued, or 60 days after completion where no certificate is issued. Concrete work and oil and gas work are held for 90 days instead of 60. On contracts over $10 million running longer than a year, progressive or phased release is required rather than waiting until the end.',
  ],
  [
    'Do I charge GST on the holdback?',
    'Not at the time you invoice, under the general CRA position. The Excise Tax Act treats GST or HST on a holdback as payable on the earlier of the day the holdback is actually paid out and the day the holdback period expires. In practice that means you invoice tax on the amount you are actually being paid now, and the tax on the holdback follows when the holdback is released. Confirm the treatment with your accountant, because how your contract is written can change it.',
  ],
  [
    'How do I calculate a progress draw with holdback?',
    'Start from the value of work in place to date, including approved change orders. Subtract everything you have already billed on prior draws to get this claim. Take the statutory holdback percentage off that claim. Add GST or HST on the amount being paid now. What remains is your net payable. Your accumulated holdback grows with every draw and is released after the lien period.',
  ],
  [
    'Can I download the calculation as a PDF?',
    'Yes, and it is free with no signup. Enter the project name and the draw number, then use the download button to get a one-page progress draw summary you can attach to your claim or take into a draw meeting. It shows the contract inputs, the holdback withheld, the tax treatment and the net payable. The PDF is generated in your browser, so nothing is uploaded and nothing is stored.',
  ],
  [
    'Can a general contractor hold back more than the statutory amount?',
    'Some contracts attempt to hold additional retention on top of the statutory holdback, or hold back the full amount past the release date. The statutory holdback itself is fixed by legislation, but anything above it is a contract term you agreed to. Read the payment clause before you sign, and price the cash flow cost of any extra retention into your bid.',
  ],
  [
    'What happens if the holdback is never released?',
    'Once the lien period has expired and no liens are registered, the holdback becomes payable. If it is not released, that is a collection matter and you may still have lien rights depending on timing. Keeping clean records of substantial performance dates, approved change orders and every draw you submitted is what makes that conversation short. This is where documentation, not argument, wins.',
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
  name: 'Construction Holdback Calculator',
  url: 'https://subtradesoftware.com/construction-holdback-calculator/',
  description:
    'Calculate statutory holdback, GST timing and net payable on a construction progress draw in Canada.',
  isPartOf: { '@id': 'https://subtradesoftware.com/#website' },
  publisher: { '@id': 'https://subtradesoftware.com/#organization' },
  inLanguage: 'en-CA',
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
      { href: '/construction-retainage-calculator', label: 'US retainage calculator' },
      { href: '/construction-templates', label: 'Free templates' },
      { href: '/how-to-tutorials', label: 'Video tutorials' },
    ],
  },
];

export default function HoldbackCalculatorPage() {
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
            Construction holdback
            <br />
            <em>calculator</em>
          </h1>
          <p className="lede">
            Work out what a progress draw actually pays you after statutory
            holdback — and when the GST on that holdback is really due. Built
            for Canadian trade subcontractors.
          </p>
          <p className="hero-note">
            Alberta, BC, Saskatchewan, Manitoba and Ontario rates built in.
            Download the draw summary as a PDF — nothing leaves your browser.
            Working in the States?{' '}
            <a href="/construction-retainage-calculator/">
              Use the retainage calculator instead
            </a>
            .
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap" style={{ maxWidth: 1000 }}>
          <HoldbackCalc />
        </div>
      </section>

      <div className="wrap">
        <div className="chalkline" />
      </div>

      <section className="section">
        <div className="wrap" style={{ maxWidth: 820 }}>
          <p className="eyebrow">The part nobody explains</p>
          <h2 className="display" style={{ fontSize: 'clamp(30px,4.4vw,46px)', margin: '14px 0 22px' }}>
            Holdback is not a discount
          </h2>
          <div className="prose">
            <p>
              Every province except Quebec runs some version of the same system.
              A percentage of each progress payment gets retained rather than
              paid, and it sits as a fund that anyone further down the chain can
              lien against if they do not get paid. The general contractor is
              not doing it to you. In most cases they are legally required to,
              and they cannot contract out of it.
            </p>
            <p>
              What that means for a sub is simple and unpleasant: on a $500,000
              contract you are financing $50,000 of somebody else&rsquo;s risk
              for the length of the job plus the lien period. That is real
              money, it is usually more than your net margin on the job, and it
              is the reason a profitable sub can still run out of cash.
            </p>
            <p>
              Two things make it worse than it needs to be. The first is billing
              late — every week you delay a draw is a week further out on money
              you have already spent on labour and material. The second is
              unapproved change orders, because work you performed but never got
              approved is not in the value of work in place at all, so it is not
              even earning its holdback yet.
            </p>
            <h3>The GST timing nobody uses</h3>
            <p>
              This one is worth actual money. Under the Excise Tax Act, GST or
              HST on a holdback is payable on the earlier of the day the
              holdback is paid to you and the day the holdback period expires.
              You do not have to remit tax on money that is being withheld from
              you. Plenty of subs invoice GST on the full draw anyway and end up
              fronting the CRA out of pocket for the length of the job. Toggle
              it in the calculator above and watch what it does to the net.
            </p>
            <h3>Rates by province</h3>
            <p>
              The statutory percentage is fixed by each province&rsquo;s lien
              legislation, so it does not move from project to project.
              Retention periods are the more slippery number — they run from
              substantial performance rather than from your last invoice, and
              some work types are treated differently.
            </p>
          </div>

          <div className="hb-table-wrap">
            <table className="hb-table">
              <thead>
                <tr>
                  <th>Province</th>
                  <th>Holdback</th>
                  <th>Typical retention</th>
                  <th>Legislation</th>
                </tr>
              </thead>
              <tbody>
                {PROVINCES.filter((p) => p.act).map((p) => (
                  <tr key={p.code}>
                    <td>{p.name}</td>
                    <td className="mono">{p.pct}%</td>
                    <td className="mono">{p.days} days</td>
                    <td>{p.act}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="hb-tablenote">
            Alberta retains 90 days rather than 60 on concrete and on oil and
            gas work. Ontario&rsquo;s Construction Act was amended effective
            January 1, 2026 to make annual holdback release mandatory. Quebec
            does not use a statutory holdback in the same form — retention there
            is a contract term. None of this is legal advice; confirm your
            project with your lawyer.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Questions subs actually ask</p>
            <h2 className="display">Holdback, answered</h2>
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
            SubTrade assembles the draw off your actual field data — hours,
            approved change orders and percent complete — with the holdback line
            already in it. $299/month, 5 users included.
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
