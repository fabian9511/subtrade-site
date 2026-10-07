import QuoteSheet from '../../components/QuoteSheet';
import { TOOL_COUNT, TOOL_NAMES, COMING_SOON } from '../../lib/tools';

export const metadata = {
  alternates: { canonical: '/pricing-plans/' },
  title: 'Pricing',
  description:
    'SubTrade is $299/month CAD with 5 users included. Additional users from $4 to $15 each. Save 20% on annual billing. Free trial, no demo call.',
};

const SIGNUP = 'https://portal.subtradesoftware.com/signup';

const ladder = [
  { range: 'Users 1–5', price: 'Incl.', note: 'In the $299 base plan', tone: 'l0' },
  { range: 'Users 6–15', price: '$15', note: 'per extra user / month', tone: 'l1' },
  { range: 'Users 16–25', price: '$10', note: 'per extra user / month', tone: 'l2' },
  { range: 'Users 26–29', price: '$7', note: 'per extra user / month', tone: 'l3' },
  { range: 'Users 30+', price: '$4', note: 'per extra user / month', tone: 'l4' },
];

const faqs = [
  ['Is every feature on every plan?', `Yes. There is one plan with all ${TOOL_COUNT} tools. No feature tiers and no add-on modules.`],
  ['How much is annual billing?', 'Annual billing saves 20%. The base plan is $2,870 a year instead of $3,588.'],
  ['Can I add people partway through a term?', 'Yes. Add users whenever you need them and the cost is prorated for the rest of the billing period.'],
  ['Is there a free trial?', 'Yes, 14 days with the full platform. Cancel during the trial and you pay nothing.'],
  ['What currency are prices in?', 'All prices are in Canadian dollars (CAD).'],
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

export default function Pricing() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO + QUOTE */}
      <section className="pp-hero">
        <div className="wrap pp-hero-wrap">
          <div className="pp-hero-copy">
            <p className="eyebrow">Pricing that is on the page</p>
            <h1 className="display">
              One plan.
              <br />
              <span>The whole platform.</span>
            </h1>
            <p className="pp-lede">
              No feature tiers, no per-module pricing, no sales call to find out
              the number. Set your crew size on the quote and read the total.
            </p>
            <ul className="pp-checks">
              <li>All {TOOL_COUNT} tools on every plan</li>
              <li>5 users included, more as you grow</li>
              <li>14-day free trial on a real job</li>
            </ul>
          </div>
          <QuoteSheet />
        </div>
      </section>

      {/* LADDER */}
      <section className="section pp-ladder-sec">
        <div className="wrap">
          <div className="pp-split-head">
            <div>
              <p className="eyebrow">Bigger crew, smaller bill per head</p>
              <h2 className="display">Every extra user costs less</h2>
            </div>
            <p>The first five are in the base plan. After that, each step down the ladder makes the next person cheaper to add.</p>
          </div>
          <ol className="pp-ladder">
            {ladder.map((r) => (
              <li key={r.range} className={`pp-rung ${r.tone}`}>
                <div className="pp-rung-bar"><span>{r.price}</span></div>
                <div className="pp-rung-text"><b>{r.range}</b><small>{r.note}</small></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* SCOPE / EXCLUSIONS / COMING SOON */}
      <section className="section pp-scope-sec">
        <div className="wrap pp-scope">
          <div>
            <p className="eyebrow">Scope of work</p>
            <h2 className="display">Included on every quote</h2>
            <ul className="pp-scope-list">
              {TOOL_NAMES.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>
          <div className="pp-side">
            <div className="pp-excl">
              <p className="pp-kicker">Exclusions</p>
              <p>Accounting and payroll processing. Your bookkeeper keeps their software. SubTrade hands them clean, job-costed numbers.</p>
            </div>
            <div className="pp-soon">
              <p className="pp-kicker pp-kicker-o">Coming soon</p>
              {COMING_SOON.map(([, name, sub]) => (
                <div key={name} className="pp-soon-item"><b>{name}</b><small>{sub}</small></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section pp-faq-sec">
        <div className="wrap pp-faq">
          <h2 className="display">Billing questions</h2>
          {faqs.map(([q, a]) => (
            <details key={q}>
              <summary><h3>{q}</h3></summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap">
          <h2 className="display">The trial is the demo</h2>
          <p>Load a real project and see it for yourself.</p>
          <a href={SIGNUP} className="btn btn-primary btn-lg">
            Start free trial
          </a>
        </div>
      </section>
    </>
  );
}
