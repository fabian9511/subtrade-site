// Company facts used in structured data (schema.org JSON-LD) across the site.
// One place, so every page tells search engines and AI assistants the same story.
// Location stays at city level: never add a street address or postal code here.

export const BASE = 'https://subtradesoftware.com';

// Third-party profiles. AI assistants cross-check a brand against these.
// Add a URL to a slot and it appears in the schema on every page automatically.
export const PROFILES = {
  capterra: 'https://www.capterra.com/p/10039358/SubTrade/',
  capterraCa: 'https://www.capterra.ca/software/1092138/SubTrade',
  getapp: 'https://www.getapp.com/all-software/a/subtrade/',
  trustradius: 'https://www.trustradius.com/products/subtrade-software',
  appStore: 'https://apps.apple.com/ca/app/subtrade/id6752587413',
  googlePlay: 'https://play.google.com/store/apps/details?id=com.subtradesoftware.subtrade.app',
  youtube: 'https://www.youtube.com/@subtradesoftware',
  linkedin: '', // company page, e.g. https://www.linkedin.com/company/...
  facebook: '', // e.g. https://www.facebook.com/...
  instagram: '', // e.g. https://www.instagram.com/...
};

export const SAME_AS = Object.values(PROFILES).filter(Boolean);

// The founders. `sameAs` takes each person's LinkedIn profile URL once known.
export const FABIAN = {
  name: 'Fabian Vargas Garcia',
  jobTitle: 'Co-Founder, SubTrade · President, Quality Gypsum Services',
  image: '/fabian-vargas-garcia-subtrade-cofounder.webp',
  sameAs: [
    // 'https://www.linkedin.com/in/...',
  ],
};

export const STEBAN = {
  name: 'Steban Vargas',
  jobTitle: 'Co-Founder and Senior Software Developer, SubTrade',
  image: '/steban-vargas-subtrade-cofounder.webp',
  sameAs: [],
};

export const ORG_REF = {
  '@type': 'Organization',
  '@id': `${BASE}/#organization`,
  name: 'SubTrade Software Ltd.',
  url: `${BASE}/`,
};

// Full Person schema for a founder. `worksFor` points at the Organization node.
export function personSchema(p, extra = {}) {
  return {
    '@type': 'Person',
    '@id': `${BASE}/about/#${p.name.toLowerCase().replace(/[^a-z]+/g, '-')}`,
    name: p.name,
    jobTitle: p.jobTitle,
    image: `${BASE}${p.image}`,
    url: `${BASE}/about/`,
    worksFor: ORG_REF,
    ...(p.sameAs.length ? { sameAs: p.sameAs } : {}),
    ...extra,
  };
}

// Short author reference for articles: the person, linked to the About page.
export function authorRef(p = FABIAN) {
  return {
    '@type': 'Person',
    '@id': `${BASE}/about/#${p.name.toLowerCase().replace(/[^a-z]+/g, '-')}`,
    name: p.name,
    url: `${BASE}/about/`,
    jobTitle: p.jobTitle,
    ...(p.sameAs.length ? { sameAs: p.sameAs } : {}),
  };
}
