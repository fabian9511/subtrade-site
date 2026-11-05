/**
 * SubTrade Builders Night: every date, time, venue, price and
 * pre-qualification rule on /builders-night/ comes from this file. Change it
 * here and the page, the structured data, the form and the GHL tagging all
 * follow.
 *
 * Venue: keep `confirmed: false` until the venue contract is signed. While it
 * is false the page only says "Calgary Central, venue TBD" and the
 * street address stays off the site. Flip it to true once it's booked.
 */

export const EVENT = {
  name: 'SubTrade Builders Night',
  date: '2027-02-10',
  dateLabel: 'Wednesday, February 10, 2027',
  shortDate: 'Wed, Feb 10, 2027',
  timeLabel: '2:00 to 5:00 pm',
  // Calgary is on MST (UTC-7) in February.
  startISO: '2027-02-10T14:00:00-07:00',
  endISO: '2027-02-10T17:00:00-07:00',
  entryFee: 25,
  // Paid supplier tables: yards, rental companies, insurance brokers, safety trainers.
  supplierTables: 5,
  supplierPrice: 750, // plus GST
  builderDeadline: 'Friday, December 4, 2026',
  venue: {
    confirmed: false,
    name: 'Village Brewery',
    street: '5000 12A St SE',
    city: 'Calgary',
    region: 'AB',
    area: 'Calgary Central',
  },
};

export const venueLine = () =>
  EVENT.venue.confirmed
    ? `${EVENT.venue.name}, ${EVENT.venue.street}, ${EVENT.venue.city}`
    : `${EVENT.venue.area}, venue TBD`;

export const SCHEDULE = [
  ['12:00 pm', 'Setup', 'Builders and suppliers set up their table, banner and promo items. The room is ours from noon.'],
  ['2:00 pm', 'Show starts', 'Subs scan in, grab a badge in their trade colour and go straight to the builder tables. Food and drinks are on us.'],
  ['5:00 pm', 'Close', 'Home for dinner.'],
];

// ---------- pre-qualification ----------
// Subs answer these questions on the form. No documents. The rules:
//   WCB Alberta coverage: must be Yes
//   Liability insurance:  $1M to $2M does not qualify, $3M passes, $5M+ is the top tier
//   People, counting their own subs: 1-2 does not qualify, 3+ does
//   COR / SECOR: asked, a plus, not required
//   Worked for GCs before (and which ones), years in business: asked, shown to
//   builders, not required
export const WCB = ['Yes', 'No'];
export const GC_WORK = ['Yes', 'No'];
export const INSURANCE = ['No insurance', '$1M to $2M', '$3M to $4M', '$5M or more'];
export const CREW = ['1-2', '3-5', '6-10', '11-20', '21-50', '50+'];
export const SAFETY = ['COR', 'SECOR', 'Neither yet'];
export const YEARS = ['Under 2 years', '2 to 5 years', '5+ years'];

export function qualify(a = {}) {
  const reasons = [];
  if (a.wcb !== 'Yes') reasons.push('No WCB coverage');
  if (!['$3M to $4M', '$5M or more'].includes(a.insurance)) reasons.push('Liability insurance under $3M');
  if (!CREW.includes(a.crew) || a.crew === '1-2') reasons.push('Fewer than 3 people');
  const qualified = reasons.length === 0;
  const tier = !qualified ? 'not-qualified' : a.insurance === '$5M or more' ? 'top' : 'pass';
  return { qualified, tier, reasons };
}

// What the page shows under "Pre-qualified". Keep in step with qualify().
export const CHECKS = [
  ['WCB Alberta', 'Covered by WCB Alberta.'],
  ['Liability insurance', 'At least $3M in commercial general liability. $5M or more is ideal.'],
  ['Enough manpower', "The manpower to take on a builder's jobs, counting their own subs."],
  ['COR or SECOR', "Not required, but certified subs stand out. Builders see who's certified."],
  ['Work for GCs', 'Have they worked for general contractors before, and which ones.'],
  ['Years in business', "How long they've been running their company."],
];

// Pick-list values must match the GoHighLevel fields exactly, or GoHighLevel
// refuses the whole contact (see app/api/builders-night/route.js).
export const TRADES = ['Drywall / Framing', 'Electrical', 'Plumbing', 'HVAC / Mechanical', 'Concrete Forming', 'Painting', 'Other'];
// GHL's "Number of Employees" field only has these buckets.
export const crewToGhl = (c) => ({ '1-2': '1-5', '3-5': '1-5' })[c] || (['6-10', '11-20', '21-50', '50+'].includes(c) ? c : '');
