import { features, trades, compares } from '../lib/data';
import { tutorials } from '../lib/tutorials';

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
    '/construction-software-15min-demo', '/contact-us', '/how-to-tutorials',
    '/the-ultimate-guide-to-choosing-subcontractor-management-software-for-efficient-project-oversight',
    '/best-software-for-subcontractors-comparing-top-tools-for-2025-to-boost-efficiency-and-project-management',
    '/terms-and-conditions', '/privacy-policy', '/fair-billing-policy',
  ];
  const featurePaths = features.map((f) => `/construction-management-features/${f.slug}`);
  const tradePaths = trades.map((t) => `/${t.slug}`);
  const comparePaths = compares.map((c) => `/compare/${c.slug}`);
  const tutorialPaths = tutorials.map((t) => `/tutorials/${t.slug}`);
  return [...staticPaths, ...featurePaths, ...tradePaths, ...comparePaths, ...tutorialPaths].map((p) => ({
    url: `${base}${p}`,
    changeFrequency: 'weekly',
    priority: p === '' ? 1 : 0.8,
    ...(pageImages[p] ? { images: pageImages[p] } : {}),
  }));
}
