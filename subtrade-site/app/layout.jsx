import './globals.css';
import Link from 'next/link';
import MegaMenu from '../components/MegaMenu';
import '@fontsource/barlow-condensed/500.css';
import '@fontsource/barlow-condensed/600.css';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/archivo/400.css';
import '@fontsource/archivo/500.css';
import '@fontsource/archivo/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';

const PORTAL = 'https://portal.subtradesoftware.com';
const SIGNUP = 'https://portal.subtradesoftware.com/signup';

export const metadata = {
  metadataBase: new URL('https://subtradesoftware.com'),
  title: {
    default: 'SubTrade | Field Management Software Built for Subcontractors',
    template: '%s | SubTrade',
  },
  description:
    'Time tracking, change orders, scheduling, daily logs and progress billing in one app. Built by a working subcontractor for Canadian trade contractors. $299/month, 5 users included.',
  openGraph: {
    siteName: 'SubTrade',
    type: 'website',
    locale: 'en_CA',
  },
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'SubTrade',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, iOS, Android',
  offers: {
    '@type': 'Offer',
    price: '299',
    priceCurrency: 'CAD',
  },
  publisher: {
    '@type': 'Organization',
    name: 'SubTrade Software Ltd.',
    url: 'https://subtradesoftware.com/',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-NMZ7RBXD');`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1355581835968226');fbq('track','PageView');`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <header className="header">
          <div className="wrap header-inner">
            <Link href="/" className="logo" aria-label="SubTrade home">
              <img src="/logo-horizontal.png" alt="SubTrade Software" className="logo-full" />
              <img src="/logo-mark.png" alt="SubTrade" className="logo-mark-only" />
            </Link>
            <nav className="nav" aria-label="Main">
              <span className="hide-m"><MegaMenu /></span>
              <Link href="/pricing-plans">Pricing</Link>
              <a href={PORTAL}>Log in</a>
              <a href={SIGNUP} className="btn btn-primary">
                Start free trial
              </a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="footer">
          <div className="wrap footer-inner">
            <div>
              <img
                src="/logo-horizontal.png"
                alt="SubTrade Software"
                style={{ height: 40, width: 'auto', display: 'block', marginBottom: 16 }}
                loading="lazy"
              />
              SubTrade Software Ltd. · Calgary, Alberta
              <br />
              Built on jobsites, not in boardrooms.
              <br />
              <span style={{ display: 'inline-flex', gap: 16, marginTop: 10 }}>
                <a href="https://apps.apple.com/ca/app/subtrade/id6752587413" target="_blank" rel="noopener">App Store</a>
                <a href="https://play.google.com/store/apps/details?id=com.subtradesoftware.subtrade.app" target="_blank" rel="noopener">Google Play</a>
              </span>
            </div>
            <div className="footer-cols">
              <div className="footer-col">
                <b>Product</b>
                <Link href="/construction-management-features">Features</Link>
                <Link href="/pricing-plans">Pricing</Link>
                <Link href="/compare">Compare</Link>
                <Link href="/construction-templates">Templates</Link>
                <Link href="/how-to-tutorials">Tutorials</Link>
                <Link href="/blog">Blog</Link>
              </div>
              <div className="footer-col">
                <b>Trades we serve</b>
                <Link href="/drywall-contractor-software">Drywall</Link>
                <Link href="/electrical-contractor-software">Electrical</Link>
                <Link href="/hvac-contractor-software">HVAC</Link>
                <Link href="/plumbing-contractor-software">Plumbing</Link>
                <Link href="/painting-contractor-software">Painting</Link>
                <Link href="/framing-contractor-software">Framing</Link>
                <Link href="/concrete-contractor-software">Concrete</Link>
              </div>
              <div className="footer-col">
                <b>Company</b>
                <Link href="/about">About</Link>
                <Link href="/contact-us">Contact</Link>
                <a href={PORTAL}>Log in</a>
                <Link href="/terms-and-conditions">Terms</Link>
                <Link href="/privacy-policy">Privacy</Link>
                <Link href="/fair-billing-policy">Fair Billing</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
