import BuildersNightCheckIn from '../../../components/BuildersNightCheckIn';

// Door check-in for Builders Night. Opened from the QR poster at the door;
// kept out of search and the sitemap.
export const metadata = {
  title: 'Builders Night check-in',
  robots: { index: false, follow: false },
  alternates: { canonical: '/builders-night/check-in/' },
};

export default function BuildersNightCheckInPage() {
  return (
    <section className="section bn-checkin-page">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">Builders Night</p>
          <h1 className="display">Check in</h1>
          <p>Enter the email you registered with. Takes five seconds.</p>
        </div>
        <BuildersNightCheckIn />
      </div>
    </section>
  );
}
