'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';

const SIGNUP = 'https://portal.subtradesoftware.com/signup';

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

export default function MegaMenu() {
  const [open, setOpen] = useState(false);
  const timer = useRef(null);
  const openNow = () => { clearTimeout(timer.current); setOpen(true); };
  const closeSoon = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(false), 220); };
  const close = () => { clearTimeout(timer.current); setOpen(false); };

  return (
    <div
      className={`nav-mega-wrap${open ? ' open' : ''}`}
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onFocus={openNow}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) close(); }}
      onClickCapture={(e) => { if (e.target.closest('a')) close(); }}
    >
      <Link href="/construction-management-features" className="nav-mega-trigger">
        Features <span aria-hidden="true" style={{ fontSize: 10 }}>▾</span>
      </Link>
      <div className="mega" role="menu">
        <div className="mega-inner">
          <div className="mega-cols">
            {cols.map((c) => (
              <div className="mega-col" key={c.title}>
                <b>{c.title}</b>
                {c.items.map(([icon, name, sub, href]) => (
                  <Link href={href} className="mega-item" key={name}>
                    <span>
                      <span className="mega-item-name">{name}</span>
                      <span className="mega-item-sub">{sub}</span>
                    </span>
                  </Link>
                ))}
              </div>
            ))}
            <div className="mega-promo">
              <span className="mega-chip">For the Trades</span>
              <b>Built by a subcontractor, for subcontractors</b>
              <p>Every feature designed around how trade subs actually work, from the field to the office.</p>
              <a href={SIGNUP} className="btn btn-primary" style={{ justifyContent: 'center' }}>Start free trial</a>
              <Link href="/construction-software-15min-demo" className="mega-demo">Book a demo →</Link>
              <span className="mega-zero"><span className="mono">$0</span> to get started · no credit card</span>
              <div className="mega-stores">
                <a href="https://apps.apple.com/ca/app/subtrade/id6752587413" target="_blank" rel="noopener">App Store</a>
                <a href="https://play.google.com/store/apps/details?id=com.subtradesoftware.subtrade.app" target="_blank" rel="noopener">Google Play</a>
              </div>
            </div>
          </div>
          <div className="mega-banner">
            <div>
              <b>Run your entire company for as little as <span className="mono" style={{ color: 'var(--chalk)' }}>$10/day</span>*</b>
              <small>*Base plan over a month. Annual billing saves 20%.</small>
            </div>
            <Link href="/pricing-plans" className="btn btn-ghost">See pricing plans →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
