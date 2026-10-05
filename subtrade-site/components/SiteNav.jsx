'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MegaMenu from './MegaMenu';
import MobileMenu from './MobileMenu';

// Main header nav. On the billing pages (people who already pay) it is a
// simple header: no marketing menu, no "Start free trial".
export default function SiteNav({ portal, signup }) {
  const path = usePathname() || '';
  if (path.startsWith('/billing')) {
    return (
      <nav className="nav" aria-label="Account">
        <a href="mailto:support@subtradesoftware.com" className="nav-plain">Support</a>
        <a href={portal} className="btn btn-primary">Log in to SubTrade</a>
      </nav>
    );
  }
  return (
    <nav className="nav" aria-label="Main">
      <span className="hide-m"><MegaMenu /></span>
      <Link href="/explore-the-app" className="hide-m nav-explore">Explore the app</Link>
      <Link href="/pricing-plans" className="hide-m">Pricing</Link>
      <a href={portal} className="hide-m">Log in</a>
      <a href={signup} className="btn btn-primary">
        Start free trial
      </a>
      <MobileMenu />
    </nav>
  );
}
