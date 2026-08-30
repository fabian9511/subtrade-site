import { features, trades, compares } from '../lib/data';
import { tutorials } from '../lib/tutorials';
import { getAllPosts } from '../lib/posts';

const base = 'https://subtradesoftware.com';
const img = (p) => `${base}${p}`;

const pageImages = {
  '': [img('/subtrade-foreman-using-app-jobsite.webp'), img('/subtrade-app-project-tools-home.webp'), img('/subtrade-worker-capturing-site-photo.webp')],
  '/construction-management-features': [img('/subtrade-worker-capturing-site-photo-wide.webp')],
  '/construction-management-features/site-photos': [img('/subtrade-before-after-construction-photos.webp'), img('/subtrade-photo-markup-install-access-panel.webp'), img('/subtrade-gps-site-photos-worker.webp')],
  '/construction-management-features/change-order-management': [img('/subtrade-change-order-from-the-field.webp')],
  '/construction-management-features/daily-logs': [img('/subtrade-daily-log-foreman-end-of-day.webp')],
  '/construction-management-features/construction-crew-scheduling': [img('/subtrade-crew-scheduling-jobsite.webp')],
  '/time-tracking': [img('/subtrade-gps-time-tracking-clock-in.webp')],
  '/pricing-plans': [img('/subtrade-organized-multi-trade-jobsite.webp')],
  '/about': [img('/fabian-vargas-garcia-subtrade-cofounder.webp')],
};

export default function sitemap() {
  const staticPaths = [
    '', '/construction-management-features', '/time-tracking', '/pricing-plans',
    '/compare', '/blog', '/about', '/construction-templates',
    '/construction-holdback-calculator',
    '/construction-retainage-calculator',
    '/construction-software-15min-demo', '/contact-us', '/how-to-tutorials',
    '/the-ultimate-guide-to-choosing-subcontractor-management-software-for-efficient-project-oversight',
    '/terms-and-conditions', '/privacy-policy', '/fair-billing-policy',
  ];
  const featurePaths = features.map((f) => `/construction-management-features/${f.slug}`);
  const tradePaths = trades.map((t) => `/${t.slug}`);
  const comparePaths = compares.map((c) => `/compare/${c.slug}`);
  const tutorialPaths = tutorials.map((t) => `/tutorials/${t.slug}`);
  // Markdown blog posts add themselves — publishing never means editing this file.
  const posts = getAllPosts();
  const postPaths = posts.map((p) => `/blog/${p.slug}`);

  // <lastmod>, but only where the date is real. Posts carry `date` and
  // `updated` in their front matter, so those are honest. Nothing else on the
  // site records when it last changed, and Google's guidance is explicit that a
  // lastmod it learns to distrust is worse than no lastmod at all — so the rest
  // of the pages simply do not claim one. Give a feature, trade or tutorial an
  // `updated` field in its data file and it will appear here too.
  const lastMod = {};
  for (const p of posts) {
    const d = p.updated || p.date;
    if (d) lastMod[`/blog/${p.slug}`] = d;
  }

  return [...staticPaths, ...featurePaths, ...tradePaths, ...comparePaths, ...tutorialPaths, ...postPaths].map((p) => ({
    url: p === '' ? `${base}/` : `${base}${p}/`,
    changeFrequency: 'weekly',
    priority: p === '' ? 1 : 0.8,
    ...(lastMod[p] ? { lastModified: lastMod[p] } : {}),
    ...(pageImages[p] ? { images: pageImages[p] } : {}),
  }));
}
