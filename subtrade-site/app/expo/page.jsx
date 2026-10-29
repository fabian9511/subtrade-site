import ExpoForm from '../../components/ExpoForm';

// Booth page for the Builder Expo (Tue 2026-11-03). Reached by the QR code at
// the booth only: kept out of search results and out of the sitemap.
export const metadata = {
  title: 'Builder Expo 2026',
  description: 'Leave your details at the SubTrade booth and get a free 15-minute walkthrough.',
  alternates: { canonical: '/expo/' },
  robots: { index: false, follow: false },
};

export default function ExpoPage() {
  return <ExpoForm />;
}
