import Funnel from '../../components/Funnel';

// Paid-traffic landing page for Facebook/Instagram ads. It is kept out of
// search (noindex, not in the sitemap) so it never competes with the organic
// pages, and so ad-specific copy can change freely.
export const metadata = {
  title: 'Every Job. Every Crew. One App.',
  description:
    'SubTrade is field management software built by a Calgary drywall contractor for subcontractors: GPS time tracking, change orders, progress billing and scheduling in one app. $299/month CAD, 5 users included.',
  alternates: { canonical: '/start/' },
  robots: { index: false, follow: true },
  openGraph: {
    title: 'SubTrade: every job, every crew, one app',
    description:
      'Built by a working subcontractor for Canadian trade contractors. See if it fits your company in 2 minutes.',
    url: '/start/',
    images: [{ url: '/subtrade-foreman-using-app-jobsite.webp', alt: 'Foreman using the SubTrade app on a commercial jobsite' }],
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    ['How much does SubTrade cost?', '$299/month CAD with 5 users included. Extra users are $4 to $15 each, and annual billing saves 20%.'],
    ['Who is SubTrade built for?', 'Subcontractors and trade contractors: drywall, framing, electrical, plumbing, HVAC, painting, concrete and other trades running crews on commercial and residential jobs.'],
    ["Does it work on my crew's phones?", 'Yes. Crews clock in, take photos and fill forms from the phone app on iPhone or Android.'],
    ['Can I try it before I pay?', 'Yes. The free trial gives you the full platform, and you can cancel anytime during the trial and pay nothing.'],
  ].map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

export default function Start() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Funnel />
    </>
  );
}
