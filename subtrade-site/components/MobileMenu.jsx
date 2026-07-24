'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';

const PORTAL = 'https://portal.subtradesoftware.com';
const SIGNUP = 'https://portal.subtradesoftware.com/signup';
const APPSTORE = 'https://apps.apple.com/ca/app/subtrade/id6752587413';
const GPLAY =
  'https://play.google.com/store/apps/details?id=com.subtradesoftware.subtrade.app';

const cols = [
  {
    title: 'Field Operations',
    items: [
      ['📡', 'Live Overview', 'Everything happening, live', '/construction-management-features/field-operations'],
      ['📷', 'Photos', 'GPS-tagged site photos', '/construction-management-features/site-photos'],
      ['⏱️', 'Time Tracking', 'GPS clock-in & job costing', '/time-tracking'],
      ['📅', 'Scheduling', 'Drag-and-drop crew timelines', '/construction-management-features/construction-crew-scheduling'],
      ['🛡️', 'Safety & Forms', 'Hazard reports & custom forms', '/construction-management-features/safety-custom-forms'],
    ],
  },
  {
    title: 'Project Management',
    items: [
      ['📊', 'Dashboard', 'Live cost & project overview', '/construction-management-features/project-dashboard'],
      ['✅', 'Tasks', 'Kanban boards & punch lists', '/construction-management-features/task-management'],
      ['📐', 'Drawings', 'Plans & markups in the field', '/construction-management-features/drawings-markups'],
      ['📝', 'Daily Logs', 'Field reports & site diary', '/construction-management-features/daily-logs'],
    ],
  },
  {
    title: 'Financial & Compliance',
    items: [
      ['🧾', 'Change Orders', 'Draft, submit & invoice COs', '/construction-management-features/change-order-management'],
      ['🧰', 'Purchase Orders', 'Track material orders & costs', '/construction-management-features/change-order-management'],
      ['📄', 'Submittals & RFIs', 'Shop drawings & RFI tracking', '/construction-management-features/submittals'],
      ['💵', 'Progress Billing', 'Draws with holdback handled', '/pricing-plans'],
    ],
  },
];

const AppleIcon = () => (
  <svg viewBox="0 0 384 512" width="17" height="17" fill="currentColor" aria-hidden="true">
    <path d="M318.7 268c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-92.6zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
);

const PlayIcon = () => (
  <svg viewBox="0 0 512 512" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l220.7-221.3 60.1 60.1L104.6 499z" />
  </svg>
);

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        className={`menu-toggle${open ? ' is-open' : ''}`}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span />
        <span />
        <span />
      </button>

      {mounted &&
        createPortal(
          <div className={`mnav${open ? ' open' : ''}`} aria-hidden={!open}>
            <nav className="mnav-panel" aria-label="Mobile navigation">
          <span className="mnav-label">Features</span>
          {cols.map((c) => (
            <div className="mnav-group" key={c.title}>
              <b>{c.title}</b>
              {c.items.map(([icon, name, sub, href]) => (
                <Link href={href} className="mnav-item" key={name} onClick={close}>
                  <span className="mnav-ico" aria-hidden="true">{icon}</span>
                  <span className="mnav-text">
                    <span className="mnav-name">{name}</span>
                    <span className="mnav-sub">{sub}</span>
                  </span>
                </Link>
              ))}
            </div>
          ))}

          <div className="mnav-links">
            <Link href="/pricing-plans" onClick={close}>Pricing</Link>
            <Link href="/compare" onClick={close}>Compare</Link>
            <Link href="/construction-templates" onClick={close}>Templates</Link>
            <Link href="/how-to-tutorials" onClick={close}>Tutorials</Link>
            <Link href="/blog" onClick={close}>Blog</Link>
            <a href={PORTAL}>Log in</a>
          </div>

          <div className="mnav-promo">
            <span className="mega-chip">For the Trades</span>
            <b>Built by a subcontractor, for subcontractors</b>
            <p>Every feature designed around how trade subs actually work, from the field to the office.</p>
            <a href={SIGNUP} className="btn btn-primary mnav-cta">Start free trial</a>
            <Link href="/construction-software-15min-demo" className="mnav-demo" onClick={close}>
              Book a 15-min demo →
            </Link>

            <span className="mnav-stores-label">Download the app</span>
            <div className="mnav-stores">
              <a href={APPSTORE} target="_blank" rel="noopener" className="mnav-store">
                <AppleIcon />
                <span>
                  <small>Download on the</small>
                  App Store
                </span>
              </a>
              <a href={GPLAY} target="_blank" rel="noopener" className="mnav-store">
                <PlayIcon />
                <span>
                  <small>Get it on</small>
                  Google Play
                </span>
              </a>
            </div>

            <span className="mnav-price">
              Run your whole company for as little as <span className="mono">$10/day</span>*
            </span>
          </div>
            </nav>
          </div>,
          document.body
        )}
    </>
  );
}
