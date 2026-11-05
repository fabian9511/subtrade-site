import BuildersNightForm from '../../components/BuildersNightForm';
import { EVENT, SCHEDULE, CHECKS, venueLine } from '../../lib/buildersNight';

// SubTrade Builders Night: one afternoon where Calgary builders meet
// pre-qualified subcontractors. Dates, venue and prices live in
// lib/buildersNight.js; registrations go to GoHighLevel via
// app/api/builders-night/route.js.

const title = 'Builders Night Calgary 2027: Meet Builders and Pre-Qualified Trades';
const description =
  'One afternoon in Calgary where general contractors meet pre-qualified subcontractors from every trade. Wednesday, February 10, 2027, 2 to 5 pm. Hosted by SubTrade.';

export const metadata = {
  title,
  description,
  alternates: { canonical: '/builders-night/' },
  openGraph: {
    title,
    description,
    url: 'https://subtradesoftware.com/builders-night/',
    type: 'website',
  },
};

const faqs = [
  [
    'Who can come?',
    'Calgary-area general contractors and builders, and subcontractors from every trade who pre-qualify. Subs apply first; nobody gets a ticket without qualifying.',
  ],
  [
    'What does it cost?',
    `Builder tables are free and limited. Subs pay $${EVENT.entryFee} to get in, charged only once they qualify. Builders who miss a table can come as guests at $${EVENT.entryFee} a person.`,
  ],
  [
    'Why is it free for builders?',
    "SubTrade makes software for subcontractors, so the trades in the room are the people we want to meet. We'll have our own table where subs can see SubTrade. Builders get the room, we get to show the subs what we built.",
  ],
  [
    'How do subs qualify?',
    'They answer a few questions when they register. To get a ticket a sub needs WCB Alberta coverage, at least $3M in commercial general liability ($5M or more is ideal) and a crew of three or more, counting their own subs. We also ask about COR or SECOR, which general contractors they have worked for and how long they have been in business.',
  ],
  [
    'How do builders get a table?',
    `Request one with the form on this page or reply to Fabian's invite with the name and email of each person coming, so everyone gets the event details and reminders. Tables go first come, first served; confirm by ${EVENT.builderDeadline}. Each builder gets a 6 ft table, 2 chairs and a white tablecloth, and brings their own banner and promo items. After the event each builder gets the attendee list, sorted by trade, for every sub who agreed to share their details.`,
  ],
  [
    'Can I sponsor?',
    'Yes. Builders, suppliers and vendors can all sponsor: presenting $2,500, food or drinks $1,500, check-in, coffee station, photographer or supporting $500, and coat check $400, plus GST. You can also donate a door prize or branded toques. Email support@subtradesoftware.com for the details.',
  ],
];

export default function BuildersNight() {
  const v = EVENT.venue;
  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: EVENT.name,
    description,
    startDate: EVENT.startISO,
    endDate: EVENT.endISO,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: v.confirmed ? v.name : v.area,
      address: {
        '@type': 'PostalAddress',
        ...(v.confirmed ? { streetAddress: v.street } : {}),
        addressLocality: v.city,
        addressRegion: v.region,
        addressCountry: 'CA',
      },
    },
    organizer: { '@type': 'Organization', name: 'SubTrade Software Ltd.', url: 'https://subtradesoftware.com/' },
    offers: {
      '@type': 'Offer',
      name: 'Subcontractor entry (after pre-qualification)',
      price: String(EVENT.entryFee),
      priceCurrency: 'CAD',
      availability: 'https://schema.org/InStock',
      url: 'https://subtradesoftware.com/builders-night/',
    },
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="section bn-hero">
        <div className="wrap">
          <p className="eyebrow">Calgary · {EVENT.shortDate}</p>
          <h1 className="display bn-h1">
            Builders Night: Calgary builders meet <span>pre-qualified trades</span>
          </h1>
          <p className="bn-lead">
            One afternoon. Calgary general contractors and pre-qualified subcontractors from every trade, in one room.
            Every sub has to pre-qualify before they get a ticket: WCB coverage, at least $3M in liability and the
            manpower to take on the work.
          </p>
          <div className="bn-ctas">
            <a className="btn btn-primary btn-lg" href="#register">
              Subs: apply for a ticket
            </a>
            <a className="btn btn-ghost btn-lg" href="?role=builder#register">
              Builders: get a table
            </a>
          </div>
          <dl className="bn-facts">
            <div>
              <dt>When</dt>
              <dd>{EVENT.dateLabel}</dd>
              <dd className="bn-sub">{EVENT.timeLabel}</dd>
            </div>
            <div>
              <dt>Where</dt>
              <dd>{v.confirmed ? v.name : v.area}</dd>
              <dd className="bn-sub">{v.confirmed ? `${v.street}, ${v.city}` : 'Venue confirmed soon'}</dd>
            </div>
            <div>
              <dt>Builders</dt>
              <dd>Free table</dd>
              <dd className="bn-sub">Limited, first come, first served</dd>
            </div>
            <div>
              <dt>Subs</dt>
              <dd>${EVENT.entryFee} entry</dd>
              <dd className="bn-sub">Once you pre-qualify</dd>
            </div>
          </dl>
          <figure className="bn-photo" aria-hidden="true">
            <img
              src="/builders-night-builder-table-trades.webp"
              alt=""
              width="1600"
              height="893"
              decoding="async"
            />
          </figure>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">The afternoon</p>
            <h2 className="display">Three hours, then home for dinner</h2>
            <p>Midweek, mid-afternoon: knock off site early, meet the people you want to work with, done by five. Builders get the room from noon to set up. No speeches: the whole afternoon is open floor, and the food and drinks are on us.</p>
          </div>
          <ol className="bn-schedule">
            {SCHEDULE.map(([time, what, detail]) => (
              <li key={time} className={what === 'Show starts' ? 'key' : ''}>
                <span className="mono bn-time">{time}</span>
                <div>
                  <h3 className="display">{what}</h3>
                  <p>{detail}</p>
                </div>
              </li>
            ))}
          </ol>
          <figure className="bn-photo" aria-hidden="true">
            <img
              src="/builders-night-food-drinks-networking.webp"
              alt=""
              width="1600"
              height="893"
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Who it's for</p>
            <h2 className="display">A room that works for both sides</h2>
          </div>
          <div className="bn-two">
            <article className="bn-card">
              <p className="bn-kicker">Subcontractors</p>
              <h3 className="display">Meet the builders who hand out the work</h3>
              <ul className="bn-list">
                <li>Face time with Calgary builders while they're setting up their 2027 bid lists</li>
                <li>Every trade in one room, so builders see who's ready to go</li>
                <li>
                  ${EVENT.entryFee} entry, only once you pre-qualify
                </li>
                <li>A look at SubTrade, the software we built for subcontractors, at our own table</li>
              </ul>
              <a className="btn btn-primary" href="#register">
                Apply for a ticket
              </a>
            </article>
            <article className="bn-card">
              <p className="bn-kicker">Builders and GCs</p>
              <h3 className="display">Meet pre-qualified trades before bid day</h3>
              <ul className="bn-list">
                <li>A free 6 ft table with 2 chairs and a white tablecloth. Bring up to two people from your team</li>
                <li>You bring your own banner and promo items</li>
                <li>Subs work the builder tables during the open floor</li>
                <li>The attendee list after the event, sorted by trade</li>
                <li>
                  {`Table availability is limited. If they sell out, your team can still attend as individual guests for $${EVENT.entryFee} per person.`}
                </li>
              </ul>
              <div className="bn-btnrow">
                <a className="btn btn-primary" href="?role=builder#register">
                  Request a table
                </a>
                <a className="btn btn-ghost" href="/subtrade-builders-night-brochure.pdf">
                  Builder brochure (PDF)
                </a>
              </div>
            </article>
          </div>
          <figure className="bn-photo" aria-hidden="true">
            <img
              src="/builders-night-builder-sub-handshake.webp"
              alt=""
              width="1600"
              height="893"
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Pre-qualified</p>
            <h2 className="display">Qualify first, then get a ticket</h2>
            <p>Subs can't just show up. Every sub answers these questions before they can get a ticket:</p>
          </div>
          <div className="bn-checks">
            {CHECKS.map(([h, p]) => (
              <div key={h} className="bn-check">
                <span className="bn-tick" aria-hidden="true">✓</span>
                <div>
                  <h3 className="display">{h}</h3>
                  <p>{p}</p>
                </div>
              </div>
            ))}
          </div>
          <ol className="bn-steps">
            <li>
              <b>Apply</b> with the form below. Two minutes, no documents.
            </li>
            <li>
              <b>Find out</b> straight away if you qualify.
            </li>
            <li>
              <b>Pay ${EVENT.entryFee}</b> with the link we email you.
            </li>
            <li>
              <b>Get your QR ticket.</b> Each trade is capped so builders see a full spread.
            </li>
          </ol>
          <p className="bn-fine">Subs answer these questions themselves. We don't vouch for workmanship; who you hire is always your call.</p>
        </div>
      </section>

      <section className="section" id="register">
        <div className="wrap bn-register bn-centered">
          <div className="section-head">
            <p className="eyebrow">Register</p>
            <h2 className="display">Get on the list</h2>
            <p>
              {EVENT.dateLabel}, {EVENT.timeLabel}. {venueLine()}.
            </p>
          </div>
          <BuildersNightForm />
        </div>
      </section>

      <section className="section">
        <div className="wrap bn-centered">
          <div className="section-head">
            <p className="eyebrow">Questions</p>
            <h2 className="display">Builders Night FAQ</h2>
          </div>
          <div className="cmp-faq">
            {faqs.map(([q, a]) => (
              <div key={q} className="cmp-qa">
                <h3>{q}</h3>
                <p>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
