'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const F = '/construction-management-features';
const SIGNUP = 'https://portal.subtradesoftware.com/signup';
const money = (n) =>
  '$' + Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\.))/g, ',');

/* ---------------- icons ---------------- */
const P = {
  timer: <><circle cx="12" cy="13" r="7" /><path d="M12 10v3l2 2M9 2h6" /></>,
  image: <><rect x="3" y="4" width="18" height="15" rx="2" /><path d="m3 15 5-4 4 3 3-2 6 5" /><circle cx="9" cy="9" r="1.4" /></>,
  form: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h6M8 12h8M8 16h5" /></>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></>,
  check: <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="m8.5 12.2 2.5 2.4 4.5-5" /></>,
  file: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></>,
  folder: <><path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" /></>,
  contact: <><rect x="4" y="3" width="16" height="18" rx="2" /><circle cx="12" cy="10" r="2.4" /><path d="M8.5 17c.8-1.8 2-2.6 3.5-2.6s2.7.8 3.5 2.6" /></>,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.6 9.4a2.5 2.5 0 1 1 3.3 2.4c-.6.2-.9.8-.9 1.4v.4" /><circle cx="12" cy="17" r=".9" fill="currentColor" stroke="none" /></>,
  swap: <><path d="M4 8h13l-3-3M20 16H7l3 3" /></>,
  receipt: <><path d="M6 3h12v18l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4L6 21V3Z" /><path d="M9.5 8h5M9.5 12h5" /></>,
  note: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 9h8M8 13h6" /></>,
  home: <><path d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-8Z" /></>,
  camera: <><path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.2l1.3-2h8l1.3 2h2.2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-9Z" /><circle cx="12" cy="12.5" r="3.4" /></>,
  back: <path d="m15 5-7 7 7 7" />,
  chev: <path d="m9 5 7 7-7 7" />,
  chevdown: <path d="m5 9 7 7 7-7" />,
  sync: <><path d="M20 11a8 8 0 0 0-14-4.5M4 13a8 8 0 0 0 14 4.5" /><path d="M6 3v3.5h3.5M18 21v-3.5h-3.5" /></>,
  flag: <><path d="M6 21V4h11l-1.6 3.5L17 11H6" /></>,
  cloud: <><path d="M7 18a4 4 0 0 1 .6-8 5.5 5.5 0 0 1 10.6 1.4A3.5 3.5 0 0 1 17.5 18H7Z" /></>,
  cloudup: <><path d="M7 18a4 4 0 0 1 .6-8 5.5 5.5 0 0 1 10.6 1.4A3.5 3.5 0 0 1 17.5 18H7Z" /><path d="M12 15v-5M9.8 12.2 12 10l2.2 2.2" /></>,
  pin: <><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></>,
  ruler: <><rect x="3" y="9" width="18" height="7" rx="1.6" /><path d="M7.5 9v2.4M11 9v3.4M14.5 9v2.4M18 9v3.4" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  cal: <><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M8 3v4M16 3v4M3.5 10h17" /></>,
  mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 12a6.5 6.5 0 0 0 13 0M12 18.5V21" /></>,
  shield: <><path d="M12 3 5 6v5.5c0 4.3 2.9 7.7 7 9.5 4.1-1.8 7-5.2 7-9.5V6l-7-3Z" /><path d="M9.5 12h5M12 9.5v5" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><circle cx="12" cy="8" r=".9" fill="currentColor" stroke="none" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7.5V12l3 2" /></>,
  warn: <><path d="M12 4 2.8 20h18.4L12 4Z" /><path d="M12 10v4.5" /><circle cx="12" cy="17.2" r=".9" fill="currentColor" stroke="none" /></>,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></>,
  filter: <path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z" />,
  send: <path d="M3 11.5 21 4l-7.5 17-2.5-7-8-2.5Z" />,
  trash: <><path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13" /></>,
  pencil: <><path d="m4 20 .8-4 11-11a2 2 0 0 1 2.8 2.8l-11 11-3.6.8Z" /></>,
  pdf: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8.5 12.5h1.5v4M13 12.5h2M13 14.5h1.6M13 16.5v-4" /></>,
  kebab: <><circle cx="12" cy="5.5" r="1.3" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" /><circle cx="12" cy="18.5" r="1.3" fill="currentColor" stroke="none" /></>,
  refresh: <><path d="M20 12a8 8 0 1 1-2.4-5.7" /><path d="M20 4v4.5h-4.5" /></>,
  users: <><circle cx="9" cy="9" r="3" /><path d="M3.5 19c.8-3 3-4.6 5.5-4.6S13.7 16 14.5 19" /><path d="M16 6.4a3 3 0 0 1 0 5.2M17.5 14.6c1.9.6 3.2 2.1 3.7 4.4" /></>,
  brush: <><path d="M14.5 4.5 19 9l-8 8-4.5-4.5 8-8Z" /><path d="M6.5 12.5 4 20l7.5-2.5" /></>,
  text: <><path d="M4 6h9M8.5 6v12" /><path d="M13 11h7M16.5 11v7" /></>,
  arrowup: <><path d="M12 20V5" /><path d="m6.5 10.5 5.5-5.5 5.5 5.5" /></>,
  compass: <><circle cx="12" cy="15" r="1.6" /><path d="M12 13.4 15.5 5M12 13.4 8.5 5M8.5 5h7" /></>,
  copy: <><rect x="8.5" y="8.5" width="11" height="11" rx="2" /><path d="M15.5 5.5h-9a2 2 0 0 0-2 2v9" /></>,
  phone: <><path d="M6 3.5h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5C10.6 18 5.9 13.3 4.5 5.1A1.5 1.5 0 0 1 6 3.5Z" /></>,
  tools: <><path d="m4 20 7-7M14 5l5 5-2 2-5-5 2-2Z" /><path d="M4 8.5 8.5 4l2 2-4.5 4.5-2-2ZM13 13l6 6" /></>,
  crane: <><path d="M4 20h9M8.5 20V9l5-4M13.5 5l5 3.5M13.5 5v8M18.5 8.5V12" /><circle cx="18.5" cy="14" r="2" /></>,
  truck: <><path d="M3 7h10v9H3zM13 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></>,
  checklist: <><path d="m4 7 1.5 1.5L8 6M4 13l1.5 1.5L8 12M4 19l1.5 1.5L8 18M11 7h9M11 13h9M11 19h9" /></>,
  clip: <><path d="m16.5 7.5-7 7a2.1 2.1 0 0 0 3 3l7.5-7.5a4.2 4.2 0 0 0-6-6L6.5 11.5a6.3 6.3 0 0 0 9 9l5-5" /></>,
  cameraplus: <><path d="M3 9.5A1.5 1.5 0 0 1 4.5 8h2.2l1.3-2h6" /><path d="M21 12v5.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-8" /><circle cx="11.5" cy="13" r="3" /><path d="M18 3v6M15 6h6" /></>,
  plusc: <><circle cx="12" cy="12" r="9" fill="currentColor" stroke="none" /><path d="M12 8v8M8 12h8" stroke="#fff" /></>,
};

function Ico({ n, s = 20 }) {
  return (
    <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="currentColor"
      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {P[n]}
    </svg>
  );
}

/* ---------------- sample data (mirrors the real app, fictional content) ---------------- */
const PROJECT = 'Seton Commercial, #779 Calg…';

const TOOLS = [
  ['timer', 'Timer', 'timer'],
  ['gallery', 'Gallery', 'image'],
  ['forms', 'Forms', 'form'],
  ['drawings', 'Drawings', 'layers'],
  ['submittals', 'Submittals', 'check'],
  ['logs', 'Daily Logs', 'file'],
  ['docs', 'Documents', 'folder'],
  ['contacts', 'Contacts', 'contact'],
  ['tasks', 'Tasks', 'check'],
  ['rfis', 'RFIs', 'help'],
  ['cos', 'COs', 'swap'],
  ['pos', 'POs', 'receipt'],
  ['notes', 'Notes', 'note'],
];

const TIMESHEET = [
  ['Wed, Aug 26', [
    ['Seton Commercial', [
      ['10:27', '7:06 AM – 5:34 PM', 'J. Piriz'],
      ['10:32', '7:02 AM – 5:34 PM', 'J. Vargas'],
    ]],
    ['Riverbend Retail', [
      ['10:32', '7:01 AM – 5:34 PM', 'Y. Ortega'],
    ]],
  ]],
  ['Tue, Aug 25', [
    ['Seton Commercial', [
      ['09:54', '7:04 AM – 4:58 PM', 'M. Torres'],
      ['10:02', '6:58 AM – 5:00 PM', 'J. Reyes'],
    ]],
  ]],
];

const SITE = '/subtrade-commercial-construction-site-mobile.webp';
const MARKED = '/photos-markup.webp';
const BEFORE = '/photos-before.webp';
const AFTER = '/photos-after.webp';
const PANEL = '/subtrade-photo-markup-install-access-panel.webp';

const ALBUMS = [
  ['10/06/26', 7, [BEFORE, AFTER, MARKED, SITE]],
  ['New Extras', 11, [SITE, PANEL, AFTER, BEFORE]],
];

const PHOTO_DAYS = [
  ['Wed, Aug 5', [MARKED]],
  ['Fri, Jul 24', [BEFORE, AFTER, SITE, PANEL]],
  ['Thu, May 28', [SITE, BEFORE, MARKED, AFTER]],
];

const HAZARDS = [
  'Operating controls',
  'Emergency controls',
  'Safety devices',
  'Personal protective devices',
  'Housekeeping and access',
];

const CONDITIONS = [
  ['Schedule Delays', 'clock'],
  ['Weather Impact', 'cloud'],
  ['Accidents on Site', 'warn'],
];

/* daily report logs: [key, title, icon, entries[[title, meta]], extra entry added by the + button] */
const REPORT_LOGS = [
  ['work', 'Work Log', 'tools', [
    ['Boarding — Level 2 corridor', '4 workers · 36 hrs · grid C-2 to C-6'],
    ['Taping — Units 204 to 208', '2 workers · 18 hrs · level 4 finish'],
  ], ['Fire taping — rated wall A-1', '1 worker · 6 hrs · started 1:00 PM']],
  ['equip', 'Equipment Log', 'crane', [
    ['Scissor lift 19 ft — rental', '8 hrs · pre-shift inspection signed'],
    ['Drywall hoist', '4 hrs · Level 2 only'],
  ], ['Baker scaffold × 2', '6 hrs · corridor 2']],
  ['deliv', 'Material Deliveries', 'truck', [
    ['5/8" Type X — 120 sheets', 'Consolidated Gypsum · 9:40 AM · PO-PR2026007-001'],
    ['Corner bead + compound', 'Allied Gypsum · 1:15 PM · signed by M. Torres'],
  ], ['3-5/8" stud 25ga — 60 pcs', 'Stud & Track Ltd · 3:05 PM']],
  ['activity', 'Activity Log', 'checklist', [
    ['Fire taping started at rated wall A-1', '1:00 PM · photo attached'],
    ['Access panels held pending RFI-013', 'Flagged to super · 10:20 AM'],
  ], ['Super walked Level 2 — no deficiencies noted', '3:40 PM']],
];

const COS = [
  ['R22 Rockwool on Unit 311 & 312', 'CO-PR2026007-001', 2740.8, 'Approved'],
  ['Basement + Drywall rework', 'CO-PR2026007-002', 2860.0, 'Invoiced'],
  ['Bulkheads and drops — IVY-060_…', 'CO-PR2026007-003', 31441.1, 'Approved'],
];

const CO_BREAK = [
  ['Materials', 12100.0],
  ['Labour', 16418.0],
  ['Equipment', 0],
];

const POS = [
  ['Drywall delivery — Building C', 'PO-PR2026007-001', 'Consolidated Gypsum Supply', 0, 'Submitted'],
  ['Building C #2', 'PO-PR2026007-002', 'Consolidated Gypsum Supply', 0, 'Rejected'],
  ['Steel stud for bulkheads', 'PO-PR2026007-004', 'Stud & Track Ltd', 0, 'Submitted'],
  ['DW - 308', '', 'Not Assigned', 1909.3, 'Draft'],
  ['DW - 310 Basement', '', 'Not Assigned', 808.2, 'Draft'],
];

const RFIS = [
  ['RFI 052  Subject: Floor Track Fa…', 'Draft', 'medium'],
  ['RFI 039  Subject: Soffit Framing …', 'Closed', 'medium'],
  ['RFI 068  Subject: Drywall Layer …', 'Closed', 'medium'],
  ['RFI 012  Subject: Head of Wall D…', 'Submitted', 'high'],
  ['RFI 056  Subject: Backing Requi…', 'Closed', 'medium'],
  ['RFI 031  Subject: Steel Stud Gau…', 'Closed', 'high'],
  ['RFI 047  Subject: Ceiling Height …', 'Closed', 'medium'],
];

const SUBMITTALS = [
  ['Shop Drawings - Interior Steel Stud Wall Framing', 'Shop Drawings', '05 40 00', 'Jan 28, 2026', 'Rev B', 'compass'],
  ['BOTTOM TRACK SITE QUESTION', 'Other', '05 40 00', 'Feb 17, 2026', 'Rev A', 'folder'],
  ['Steel stud review — Mezzanine', 'Shop Drawings', '00000', 'Apr 6, 2026', 'Rev A', 'compass'],
  ['Boxbeam detail on purlin', 'Shop Drawings', '00', 'Feb 24, 2026', 'Rev A', 'compass'],
];

const DOC_FILES = [
  ['Quote — Steel stud package.pdf', '1.8 MB'],
  ['PO-PR2026007-001.pdf', '412 KB'],
  ['Supplier price list — Q3.pdf', '980 KB'],
  ['Delivery schedule.pdf', '224 KB'],
];

const CONTACTS = [
  ['B. Muriel', 'General Manager', '+1 403 555 0142', 'gm@example.com'],
  ['D. Loveday', 'Project Coordinator', '+1 403 555 0198', 'coord@example.com'],
  ['M. Torres', 'Foreman — Boarding', '+1 403 555 0177', 'foreman@example.com'],
];

const NOTES_SEED = [
  ['F. Vargas', 'Jun 27, 2026', 'The generator should not be shutting off at all. Calling the rental company to get it serviced before Monday.'],
  ['M. Torres', 'Jun 27, 2026', 'Lockbox is on the temp panel by the north door. Latch is stiff — pull down before turning.'],
];

const NEW_NOTE = 'Hoarding is coming down Thursday. Get the level 5 sanding finished on the corridor before then.';

/* screen → the explainer that sits beside the phone */
const META = {
  home: ['The project home', 'One job, every tool',
    'This is what a foreman opens on site. One project, thirteen tools, nothing buried in a menu — and it behaves the same on a phone in a stairwell as it does at the desk.',
    ['/construction-management-features', 'See all features']],
  timer: ['Time tracking', 'The timesheet, already added up',
    'Hours come off the crew’s own phones and land on the right job. Approve a pending entry and watch the paid total move — that is the payroll run, done by Friday afternoon.',
    ['/time-tracking', 'How time tracking works']],
  gallery: ['Site photos', 'Albums, dates, and 235 photos you can find',
    'Everything the crew shot, grouped by day and sorted into albums. This is the folder you open when the GC says the damage was yours.',
    [F + '/site-photos', 'More on site photos']],
  markup: ['Photo markup', 'Arrow, caption, timestamp — on site',
    'Mark the photo while you are standing in front of the work. Arrow on the problem, caption in plain words, stamped with the date and time nobody can argue with.',
    [F + '/site-photos', 'Photo markup and GPS tagging']],
  forms: ['Safety and forms', 'Inspections signed on a phone',
    'Pre-shift inspections, hazard assessments and whatever custom form your GC demands — filled out in the field, filed by project, audit-ready without the binder.',
    [F + '/safety-custom-forms', 'Safety and custom forms']],
  drawings: ['Drawings', 'The current set, marked up in the field',
    'Pinch to zoom, drop a pin, measure a run, attach a photo to the exact spot on the plan. Everyone is looking at the same revision.',
    [F + '/drawings-markups', 'Drawings and markups']],
  logs: ['Daily logs', 'The record that wins the argument later',
    'Notes by voice, then flip the switches that matter — delays, weather, accidents. Two minutes at the truck and you have the contemporaneous record a delay claim needs.',
    [F + '/daily-logs', 'Daily logs and field reports']],
  tasks: ['Tasks', 'Assigned, photographed, closed',
    'Every task carries its team, its due date, its photo and its comment thread. Change the status here and the office sees it before you are off the ladder.',
    [F + '/task-management', 'Task management']],
  cos: ['Change orders', 'Extras priced, approved and invoiced',
    'Quoted value against approved value, with materials, labour and equipment broken out. Export the PDF from the phone and the GC has it before you leave site.',
    [F + '/change-order-management', 'Change order management']],
  pos: ['Purchase orders', 'What you ordered, what it cost',
    'Material orders raised against the job, tracked from draft through submitted to rejected. The cost lands on the project, not in somebody’s truck console.',
    [F + '/change-order-management', 'Cost tracking in SubTrade']],
  rfis: ['RFIs', 'Questions with a paper trail',
    'Draft it on site, submit it, and the clock starts. Every answer stays attached to the job, so the reason you framed it that way is still there in six months.',
    [F + '/submittals', 'Submittals and RFIs']],
  submittals: ['Submittals', 'The approved set, in your pocket',
    'Shop drawings and product data filed by spec section with the revision letter visible, so the crew is never building off a superseded sheet.',
    [F + '/submittals', 'Submittals and RFIs']],
  docs: ['Documents', 'Downloaded before you lose signal',
    'Quotes, POs, contracts and schedules, kept offline on the phone. The counter tells you what is downloaded, what is available and what changed since you last looked.',
    ['/construction-management-features', 'See all features']],
  contacts: ['Contacts', 'The whole job, one tap to call',
    'Superintendent, coordinator, foreman, supplier. Tap to dial or copy the address without digging through your texts for a number.',
    ['/construction-management-features', 'See all features']],
  notes: ['Notes', 'The things that never make it into a report',
    'Gate codes, which door is unlocked, what the super said Tuesday. Dictated in seconds and left where the next person on site will actually find them.',
    [F + '/daily-logs', 'Daily logs and field reports']],
};

const CHAPTERS = [
  ['home', 'Project home', 'home'],
  ['timer', 'Timesheet', 'timer'],
  ['gallery', 'Site photos', 'image'],
  ['markup', 'Photo markup', 'brush'],
  ['drawings', 'Drawings', 'layers'],
  ['forms', 'Safety forms', 'form'],
  ['logs', 'Daily log', 'file'],
  ['tasks', 'Task details', 'check'],
  ['cos', 'Change orders', 'swap'],
  ['pos', 'Purchase orders', 'receipt'],
  ['rfis', 'RFIs', 'help'],
];

const pill = (s) => {
  const k = (s || '').toLowerCase();
  if (k === 'approved' || k === 'closed' || k === 'signed' || k === 'complete') return 'ok';
  if (k === 'submitted' || k === 'in progress') return 'info';
  if (k === 'invoiced') return 'purple';
  if (k === 'rejected') return 'bad';
  if (k === 'pending') return 'wait';
  return 'flat';
};

/* ---------------- component ---------------- */
export default function AppDemo() {
  const [screen, setScreen] = useState('home');
  const [toast, setToast] = useState('');
  const bodyRef = useRef(null);

  /* timesheet */
  const [approved, setApproved] = useState({});
  /* gallery + markup */
  const [photo, setPhoto] = useState(SITE);
  const [marks, setMarks] = useState(['arrow', 'text', 'stamp']);
  const [inkRed, setInkRed] = useState(true);
  /* forms */
  const [answers, setAnswers] = useState(() => HAZARDS.map((_, i) => (i === 2 ? 1 : 0)));
  const [signed, setSigned] = useState(false);
  const [formSent, setFormSent] = useState(false);
  /* drawings */
  /* hotspots sit on the photo pins already in the real screenshot */
  const [pins, setPins] = useState([
    { x: 78, y: 33.5, n: 1, note: 'Existing grid at dining — verify height before drops go in', ph: 1 },
    { x: 18, y: 47.5, n: 2, note: 'Cooler wall — bulkhead framed per RFI-039', ph: 1 },
    { x: 77, y: 69, n: 3, note: 'Soffit at dining — hat track in, waiting on board', ph: 1 },
    { x: 54.5, y: 31, n: 4, kind: 'task', note: 'Frame bulkhead at cooler wall before board arrives', who: 'M. Torres', due: 'Fri, Jun 26' },
    { x: 70.5, y: 67.5, n: 5, kind: 'note', note: 'Dining drops go to 9\'-10" here, not 10\'-2" — confirmed with the super on site', who: 'F. Vargas', due: 'Jun 29' },
    { x: 70, y: 60.5, n: 6, kind: 'scale', note: '19.49 ft across the dining ceiling, measured off the sheet at 1/8" = 1\'-0"', who: 'Scale set from the title block', due: '' },
  ]);
  const [openPin, setOpenPin] = useState(null);
  const [addPin, setAddPin] = useState(false);
  /* daily log */
  const [conds, setConds] = useState([true, false, false]);
  const [logSent, setLogSent] = useState(false);
  const [logExtra, setLogExtra] = useState({});
  /* task */
  const [taskStatus, setTaskStatus] = useState('Not Started');
  const [comments, setComments] = useState(0);
  /* cos */
  const [coView, setCoView] = useState(false);
  const [openLine, setOpenLine] = useState(null);
  /* docs */
  const [folderOpen, setFolderOpen] = useState(false);
  /* notes */
  const [notes, setNotes] = useState(NOTES_SEED);

  const go = (s) => { setScreen(s); setOpenPin(null); };
  const jump = (s) => {
    setCoView(false); setFolderOpen(false);
    if (s === 'markup') { setPhoto(SITE); setMarks(['arrow', 'text', 'stamp']); }
    go(s);
  };

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [screen, coView, folderOpen]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(''), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  /* timesheet totals move as entries get approved */
  const approvedCount = Object.values(approved).filter(Boolean).length;
  const netMin = 4464 + approvedCount * 61;
  const grossMin = 4734 + approvedCount * 61;
  const hhmm = (m) => Math.floor(m / 60) + ':' + String(m % 60).padStart(2, '0');

  const coTotal = CO_BREAK.reduce((a, b) => a + b[1], 0) + 2923.1;

  const title =
    screen === 'home' ? PROJECT
      : screen === 'timer' ? 'TimeSheet'
        : screen === 'gallery' ? 'Gallery'
          : screen === 'forms' ? 'Scissor Lift: Pre-Shift Insp…'
            : screen === 'drawings' ? 'A2.01 Reflected Ceiling'
              : screen === 'logs' ? 'Edit Report'
                : screen === 'tasks' ? 'Task Details'
                  : screen === 'cos' ? (coView ? 'Change Order' : 'Change Orders')
                    : screen === 'pos' ? 'Purchase Orders'
                      : screen === 'rfis' ? 'RFIs'
                        : screen === 'submittals' ? 'Approved Submittals'
                          : screen === 'docs' ? (folderOpen ? 'Quote/PO' : 'Documents')
                            : screen === 'contacts' ? 'Contacts'
                              : screen === 'notes' ? 'Notes'
                                : 'SubTrade';

  const meta = META[screen] || META.home;
  const dark = screen === 'markup';
  /* the drawings screen is the real screenshot, which carries its own chrome */
  const full = screen === 'drawings';

  function Body() {
    switch (screen) {
      /* ---------------- TimeSheet ---------------- */
      case 'timer':
        return (
          <div className="ad-pad">
            <div className="ad-select">
              <Ico n="cal" s={17} />
              <span><b>Current Biweekly</b><small>Aug 15 – Aug 31, 2026</small></span>
              <Ico n="chevdown" s={16} />
            </div>
            <div className="ad-select tint">
              <Ico n="users" s={17} />
              <span><b>All users</b></span>
              <Ico n="chevdown" s={16} />
            </div>
            <div className="ad-card ad-hours">
              <b className="mono">{hhmm(netMin)}</b>
              <span className="ad-hours-rule" aria-hidden="true" />
              <span className="ad-hours-lbl">Net Paid Hours</span>
              <div className="ad-hours-split">
                <span><b className="mono">{hhmm(grossMin)}</b><small>Gross</small></span>
                <span className="ad-vr" aria-hidden="true" />
                <span><b className="mono">04:30</b><small>Breaks</small></span>
              </div>
              <span className="ad-pill ok ad-hours-pill">Approved hours only</span>
            </div>
            {TIMESHEET.map(([day, projects]) => (
              <div className="ad-day" key={day}>
                <div className="ad-day-head"><b>{day}</b><span className="ad-daytot mono">00:00</span></div>
                {projects.map(([proj, entries]) => (
                  <div className="ad-proj" key={proj}>
                    <div className="ad-proj-head"><b>{proj}</b><span className="mono">00:00</span></div>
                    {entries.map(([dur, range, who]) => {
                      const k = day + who + dur;
                      const on = !!approved[k];
                      return (
                        <div className={'ad-entry' + (on ? ' ok' : '')} key={k}>
                          <b className="mono">{dur}</b>
                          <button type="button" className={'ad-pill ' + (on ? 'ok' : 'wait')}
                            onClick={() => {
                              setApproved((a) => ({ ...a, [k]: !a[k] }));
                              setToast(on ? who + '’s entry set back to pending' : who + '’s hours approved · payroll total updated');
                            }}>
                            {on ? 'Approved' : 'Pending'}
                          </button>
                          <span className="ad-entry-range mono">{range}</span>
                          <span className="ad-entry-who"><Ico n="contact" s={12} /> {who}</span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            ))}
            <p className="ad-hint">Tap a Pending badge to approve those hours — the paid total at the top moves with it.</p>
            <span className="ad-fab wide" aria-hidden="true"><Ico n="plus" s={16} /> Add time</span>
          </div>
        );

      /* ---------------- Gallery ---------------- */
      case 'gallery':
        return (
          <div className="ad-pad">
            <div className="ad-albums">
              {ALBUMS.map(([name, count, shots]) => (
                <button type="button" className="ad-album" key={name}
                  onClick={() => { setPhoto(shots[0]); setMarks([]); go('markup'); setToast('Opened ' + name); }}>
                  <span className="ad-mosaic">
                    {shots.map((s) => <img src={s} alt="" key={s} loading="lazy" />)}
                  </span>
                  <b>{name}</b>
                  <small>{count} photos</small>
                </button>
              ))}
              <span className="ad-album ad-album-new">
                <span className="ad-mosaic ad-mosaic-new"><Ico n="plus" s={22} /></span>
                <b>New Album</b>
              </span>
            </div>
            <div className="ad-unorg"><b>Unorganized</b> <span>235</span></div>
            {PHOTO_DAYS.map(([day, shots]) => (
              <div className="ad-photoday" key={day}>
                <div className="ad-photoday-head"><b>{day}</b> <span>{shots.length}</span></div>
                <div className="ad-grid4">
                  {shots.map((s, i) => (
                    <button type="button" key={s + i} className="ad-shot"
                      onClick={() => { setPhoto(s); setMarks([]); go('markup'); }}>
                      <img src={s} alt="Site photo" loading="lazy" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <p className="ad-hint">Tap any photo to open it in the markup editor.</p>
          </div>
        );

      /* ---------------- Photo markup editor ---------------- */
      case 'markup':
        return (
          <div className="ad-editor">
            <div className="ad-canvas">
              <div className="ad-frame">
              <img src={photo} alt="Site photo being marked up" loading="lazy" />
              <svg className="ad-marks" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                {marks.includes('arrow') && (
                  <g stroke={inkRed ? '#ef2c2c' : '#fff'} strokeWidth="1.6" fill="none" strokeLinecap="round">
                    <path d="M50 76 V44" />
                    <path d="m43.5 51 6.5-7 6.5 7" />
                  </g>
                )}
                {marks.includes('text') && (
                  <text x="50" y="84" textAnchor="middle" fill={inkRed ? '#ef2c2c' : '#fff'}
                    fontSize="6.4" fontWeight="700" fontFamily="sans-serif">BOARDING COMPLETE</text>
                )}
                {marks.includes('stamp') && (
                  <g>
                    <rect x="19" y="87" width="62" height="9" rx="1.6" fill="#111"
                      stroke={inkRed ? '#ef2c2c' : '#fff'} strokeWidth="0.9" />
                    <text x="50" y="93.6" textAnchor="middle" fill="#fff" fontSize="5.2"
                      fontWeight="700" fontFamily="monospace">Aug 27, 2026  10:34 AM</text>
                  </g>
                )}
              </svg>
              </div>
              <div className="ad-tooldock">
                <button type="button" className={'ad-swatch red' + (inkRed ? ' on' : '')}
                  onClick={() => { setInkRed(true); setToast('Red ink'); }} aria-label="Red ink" />
                <button type="button" className={'ad-swatch white' + (!inkRed ? ' on' : '')}
                  onClick={() => { setInkRed(false); setToast('White ink'); }} aria-label="White ink" />
                <span className="ad-dockrule" aria-hidden="true" />
                <button type="button" className={'ad-dockbtn' + (marks.includes('arrow') ? ' on' : '')}
                  onClick={() => { setMarks((m) => (m.includes('arrow') ? m : [...m, 'arrow'])); setToast('Arrow added'); }}
                  aria-label="Draw arrow"><Ico n="brush" s={19} /></button>
                <span className="ad-dockrule" aria-hidden="true" />
                <button type="button" className={'ad-dockbtn' + (marks.includes('text') ? ' on' : '')}
                  onClick={() => { setMarks((m) => (m.includes('text') ? m : [...m, 'text'])); setToast('Caption added'); }}
                  aria-label="Add text"><Ico n="text" s={19} /></button>
                <button type="button" className={'ad-dockbtn' + (marks.includes('stamp') ? ' on' : '')}
                  onClick={() => { setMarks((m) => (m.includes('stamp') ? m : [...m, 'stamp'])); setToast('Date and time stamped'); }}
                  aria-label="Stamp date and time"><Ico n="clock" s={19} /></button>
              </div>
            </div>
            <div className="ad-editor-foot">
              <span className="ad-desc"><Ico n="note" s={17} /> Add a description…</span>
              <span className="ad-done">Done</span>
            </div>
          </div>
        );

      /* ---------------- Forms ---------------- */
      case 'forms':
        return (
          <div className="ad-pad">
            <div className="ad-formhead">
              <b>Inspection Checklist</b>
              <span>{formSent ? 'Submitted · filed to this project' : 'Saved just now'}</span>
            </div>
            {HAZARDS.map((h, i) => (
              <div className="ad-q" key={h}>
                <div className="ad-q-top"><span>{h}</span><Ico n="flag" s={15} /></div>
                <div className="ad-radios">
                  {['Okay', 'Not Okay', 'N/A'].map((o, j) => (
                    <button type="button" key={o}
                      className={'ad-radio' + (answers[i] === j ? ' on' : '')}
                      onClick={() => setAnswers((a) => a.map((v, k) => (k === i ? j : v)))}>
                      <span className="ad-radio-dot" />{o}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="ad-q">
              <div className="ad-q-top"><span>Worker signature</span></div>
              <button type="button" className={'ad-sign' + (signed ? ' on' : '')} onClick={() => setSigned(true)}>
                {signed ? 'M. Torres' : 'Tap to sign'}
              </button>
            </div>
            <button type="button" className="ad-cta" disabled={!signed || formSent}
              onClick={() => { setFormSent(true); setToast('Inspection submitted · filed to the project'); }}>
              {formSent ? 'Submitted' : 'Submit inspection'}
            </button>
            {!signed && <p className="ad-hint">Sign it first — the app will not put an unsigned form through.</p>}
          </div>
        );

      /* ---------------- Drawings ---------------- */
      case 'drawings':
        return (
          <div
            className="ad-real"
            style={addPin ? { cursor: 'crosshair' } : undefined}
            onClick={(e) => {
              if (!addPin) return;
              const r = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - r.left) / r.width) * 100;
              const y = ((e.clientY - r.top) / r.height) * 100;
              setPins((ps) => [...ps, { x, y, n: ps.length + 1, note: 'Added from the field just now', ph: 0, mine: true }]);
              setAddPin(false);
              setToast('Markup pinned to the sheet · the office sees it now');
            }}
          >
            <img
              src="/subtrade-app-construction-drawing-markup.webp"
              alt="SubTrade drawing viewer: reflected ceiling plan with field markups, a measurement and photo pins"
              className="ad-real-img"
              loading="lazy"
              width="640"
              height="1387"
            />
            <button type="button" className="ad-real-back" aria-label="Back" onClick={(e) => { e.stopPropagation(); jump('home'); }} />
            {pins.map((p) => (
              <button type="button" key={p.n}
                className={(p.mine ? 'ad-pin' : 'ad-hot') + (p.kind ? ' ' + p.kind : '') + (openPin === p.n ? ' on' : '')}
                style={{ left: p.x + '%', top: p.y + '%' }}
                onClick={(e) => { e.stopPropagation(); setOpenPin(openPin === p.n ? null : p.n); }}
                aria-label={'Markup ' + p.n}>
                {p.mine ? p.n : ''}
              </button>
            ))}
            {openPin !== null && pins[openPin - 1] && (
              <div className="ad-callout" style={{
                left: Math.min(Math.max(pins[openPin - 1].x, 30), 70) + '%',
                top: Math.min(pins[openPin - 1].y + 5, 70) + '%',
              }}>
                <b>
                  {pins[openPin - 1].mine ? 'Markup ' + openPin
                    : pins[openPin - 1].kind === 'task' ? 'Task pin'
                      : pins[openPin - 1].kind === 'note' ? 'Note pin'
                        : pins[openPin - 1].kind === 'scale' ? 'Scale pin' : 'Photo pin'}
                </b>
                <span>{pins[openPin - 1].note}</span>
                <small>
                  {pins[openPin - 1].kind === 'task'
                    ? 'Not started · ' + pins[openPin - 1].who + ' · due ' + pins[openPin - 1].due
                    : pins[openPin - 1].kind === 'note'
                      ? pins[openPin - 1].who + ' · ' + pins[openPin - 1].due
                      : pins[openPin - 1].kind === 'scale'
                        ? pins[openPin - 1].who
                        : pins[openPin - 1].ph + ' photo' + (pins[openPin - 1].ph === 1 ? '' : 's') + ' attached · M. Torres'}
                </small>
              </div>
            )}
            <div className="ad-real-foot">
              <button type="button" className={'ad-btn' + (addPin ? ' on' : '')}
                onClick={(e) => { e.stopPropagation(); setAddPin((a) => !a); }}>
                <Ico n="plus" s={15} /> {addPin ? 'Now tap the plan…' : 'Add a markup'}
              </button>
              <span className="ad-real-hint">Tap a photo pin, or drop your own anywhere on the sheet.</span>
            </div>
          </div>
        );

      /* ---------------- Daily log (Edit Report) ---------------- */
      case 'logs':
        return (
          <div className="ad-pad">
            <div className="ad-card ad-section">
              <div className="ad-section-head"><Ico n="info" s={17} /> <b>General Information</b></div>
              <div className="ad-field">
                <span className="ad-field-lbl">Date</span>
                <div className="ad-field-box"><Ico n="cal" s={17} /> August 21, 2026</div>
              </div>
              <div className="ad-field">
                <span className="ad-field-lbl">General Notes</span>
                <div className="ad-field-box tall">
                  <span>Painters on site at 8:30 — taper started at 7:30. Corridor walls look like they were skimmed twice, checking with the super before we sand.</span>
                  <Ico n="mic" s={16} />
                </div>
                <span className="ad-counter mono">638/5000</span>
              </div>
            </div>
            <div className="ad-card ad-section">
              <div className="ad-section-head"><Ico n="shield" s={17} /> <b>Site Conditions</b></div>
              {CONDITIONS.map(([label, icon], i) => (
                <div className={'ad-cond' + (conds[i] ? ' on' : '')} key={label}>
                  <button type="button" className="ad-cond-top"
                    onClick={() => {
                      setConds((c) => c.map((v, k) => (k === i ? !v : v)));
                      setToast(conds[i] ? label + ' switched off' : label + ' flagged on today’s report');
                    }}>
                    <Ico n={icon} s={17} />
                    <span>{label}</span>
                    <span className="ad-knob" />
                  </button>
                  {conds[i] && (
                    <div className="ad-field-box tall">
                      <span className="ad-ph">Add details…</span>
                      <Ico n="mic" s={16} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {REPORT_LOGS.map(([key, label, icon, entries, extra]) => (
              <div className="ad-card ad-section" key={key}>
                <div className="ad-section-head ad-log-head">
                  <Ico n={icon} s={17} /> <b>{label}</b>
                  <button type="button" className="ad-addc" aria-label={'Add to ' + label}
                    onClick={() => {
                      if (logExtra[key]) { setToast('Already added to the ' + label.toLowerCase()); return; }
                      setLogExtra((x) => ({ ...x, [key]: true }));
                      setToast('Entry added to the ' + label.toLowerCase());
                    }}>
                    <Ico n="plusc" s={22} />
                  </button>
                </div>
                {[...entries, ...(logExtra[key] ? [extra] : [])].map(([t, m]) => (
                  <div className="ad-logrow" key={t}><b>{t}</b><small>{m}</small></div>
                ))}
              </div>
            ))}
            <div className="ad-card ad-section">
              <div className="ad-section-head ad-log-head">
                <Ico n="clip" s={17} /> <b>Attachments</b>
                <button type="button" className="ad-addc plain" aria-label="Add a photo"
                  onClick={() => setToast('In the app this opens the camera')}>
                  <Ico n="cameraplus" s={20} />
                </button>
              </div>
              <div className="ad-attachrow">
                <img src={SITE} alt="Attachment: site progress" loading="lazy" />
                <img src={MARKED} alt="Attachment: marked-up photo" loading="lazy" />
                <img src={AFTER} alt="Attachment: ceiling progress" loading="lazy" />
              </div>
            </div>
            <div className="ad-btnrow">
              <button type="button" className="ad-btn" onClick={() => setToast('Draft saved · finish it tonight')}>
                Save Draft
              </button>
              <button type="button" className="ad-cta half" disabled={logSent}
                onClick={() => { setLogSent(true); setToast('Report submitted · the office has it now'); }}>
                <Ico n="send" s={15} /> {logSent ? 'Submitted' : 'Submit Report'}
              </button>
            </div>
            <p className="ad-hint">Flip a switch to see how a delay gets recorded — that is the entry a claim is built on later.</p>
          </div>
        );

      /* ---------------- Task details ---------------- */
      case 'tasks':
        return (
          <div className="ad-pad">
            <div className="ad-card ad-triple">
              <button type="button" className="ad-trip"
                onClick={() => {
                  const next = taskStatus === 'Not Started' ? 'In Progress' : taskStatus === 'In Progress' ? 'Complete' : 'Not Started';
                  setTaskStatus(next);
                  setToast('Status → ' + next + ' · team notified');
                }}>
                <Ico n="clock" s={16} />
                <small>Status</small>
                <b className={'ad-status ' + pill(taskStatus)}>{taskStatus}</b>
              </button>
              <span className="ad-trip">
                <span className="ad-dash" aria-hidden="true" />
                <small>Priority</small>
                <b>Medium</b>
              </span>
              <span className="ad-trip">
                <span className="ad-calred"><Ico n="cal" s={16} /></span>
                <small>Due Date</small>
                <b>Jun 22, 2026</b>
              </span>
            </div>
            <b className="ad-h">Assigned Team</b>
            <div className="ad-team">
              {[['SW', 'S. Wren'], ['MT', 'M. Torres']].map(([ini, name]) => (
                <span className="ad-member" key={ini}><span className="ad-ini">{ini}</span><small>{name}</small></span>
              ))}
            </div>
            <span className="ad-created">Created by <span className="ad-ini sm">FV</span> <b>F. Vargas</b></span>
            <b className="ad-h">Description</b>
            <div className="ad-field-box tall">
              <span>I think we can use all the drywall left over from the last unit for the storage rooms.</span>
            </div>
            <b className="ad-h">Attachments (1)</b>
            <img className="ad-attach" src="/photos-before.webp" alt="Task attachment" loading="lazy" />
            <b className="ad-h">Comments ({comments})</b>
            {comments > 0 && (
              <div className="ad-comment">
                <span className="ad-ini sm">MT</span>
                <span><b>M. Torres</b><small>Counted 34 sheets, enough for both rooms. Moving them Thursday.</small></span>
              </div>
            )}
            <button type="button" className="ad-composer"
              onClick={() => { setComments((c) => c + 1); setToast('Comment posted · the office is notified'); }}>
              <Ico n="camera" s={17} />
              <Ico n="mic" s={17} />
              <span className="ad-composer-in">Write a comment…</span>
              <Ico n="send" s={17} />
            </button>
            <p className="ad-hint">Tap the status tile to move the task, or the composer to drop a comment.</p>
          </div>
        );

      /* ---------------- Change orders ---------------- */
      case 'cos':
        if (coView) {
          return (
            <div className="ad-pad">
              <span className="ad-conum mono">CO-PR2026007-003</span>
              <b className="ad-cotitle">Bulkheads and drops — IVY-060_VPO-002</b>
              <span className="ad-pill ok ad-solo">Approved</span>
              <div className="ad-card ad-values">
                <span><small>Quoted value</small><b className="mono">{money(coTotal)}</b></span>
                <span><small>Approved value</small><b className="mono">{money(coTotal)}</b></span>
              </div>
              <b className="ad-h">Description</b>
              <p className="ad-copy">Steel stud framing of bulkheads and drops as per site layout.</p>
              <ul className="ad-bullets">
                <li>Light gauge hat track for drops and bulkheads</li>
                <li>1/2&quot; drywall plus installation — taping is included in the base quote</li>
              </ul>
              <b className="ad-h">Decision notes</b>
              <p className="ad-copy">Owner / GC request</p>
              {CO_BREAK.map(([label, amt], i) => (
                <div key={label}>
                  <button type="button" className="ad-expand" onClick={() => setOpenLine(openLine === i ? null : i)}>
                    <b>{label}</b>
                    <b className="mono">{money(amt)}</b>
                    <span className={'ad-caret' + (openLine === i ? ' on' : '')}><Ico n="chevdown" s={16} /></span>
                  </button>
                  {openLine === i && (
                    <div className="ad-expand-body">
                      {label === 'Materials' && <span>Hat track, 3-5/8&quot; stud, 1/2&quot; board, corner bead, compound</span>}
                      {label === 'Labour' && <span>Framing 96 hrs · boarding 64 hrs · taping included in base</span>}
                      {label === 'Equipment' && <span>Nothing charged — lift already on site for the base scope</span>}
                    </div>
                  )}
                </div>
              ))}
              <button type="button" className="ad-btn wide" onClick={() => setCoView(false)}>Back to change orders</button>
              <p className="ad-hint">Tap a cost line to open it. The PDF icon in the header is what goes to the GC.</p>
            </div>
          );
        }
        return (
          <div className="ad-pad">
            {COS.map(([name, num, amt, status], i) => (
              <button type="button" className="ad-list" key={num}
                onClick={() => { if (i === 2) { setCoView(true); } else setToast(name + ' · ' + status); }}>
                <span>
                  <b>{name}</b>
                  <small><span className={'ad-pill ' + pill(status)}>{status}</span> <span className="mono">{num}</span> <b className="mono">{money(amt)}</b></small>
                </span>
                <Ico n="chev" s={16} />
              </button>
            ))}
            <p className="ad-hint">Open the bulkheads change order to see how an extra is priced and approved.</p>
            <span className="ad-fab" aria-hidden="true"><Ico n="plus" s={20} /></span>
          </div>
        );

      /* ---------------- Purchase orders ---------------- */
      case 'pos':
        return (
          <div className="ad-pad">
            {POS.map(([name, num, supplier, amt, status]) => (
              <div className="ad-list flat" key={name}>
                <span>
                  <b>{name}</b>
                  <small><span className={'ad-pill ' + pill(status)}>{status}</span> <span className="mono">{num || 'Not Assigned'}</span></small>
                  <small className="ad-sub2">{supplier} <b className="mono">{money(amt)}</b></small>
                </span>
                <Ico n="chev" s={16} />
              </div>
            ))}
            <p className="ad-hint">Material orders raised against the job, so the cost lands on the project.</p>
            <span className="ad-fab" aria-hidden="true"><Ico n="plus" s={20} /></span>
          </div>
        );

      /* ---------------- RFIs ---------------- */
      case 'rfis':
        return (
          <div className="ad-pad">
            {RFIS.map(([name, status, prio]) => (
              <div className="ad-list flat" key={name}>
                <span>
                  <b>{name}</b>
                  <small><span className={'ad-pill ' + pill(status)}>{status}</span> {prio}</small>
                </span>
                <Ico n="chev" s={16} />
              </div>
            ))}
            <p className="ad-hint">Draft it standing at the wall, submit it, and the answer stays attached to the job.</p>
            <span className="ad-fab" aria-hidden="true"><Ico n="plus" s={20} /></span>
          </div>
        );

      /* ---------------- Submittals ---------------- */
      case 'submittals':
        return (
          <div className="ad-pad">
            <div className="ad-search"><Ico n="search" s={17} /> Search by title or number…</div>
            <div className="ad-filters">
              <span>All Types <Ico n="chevdown" s={14} /></span>
              <span>All Sections <Ico n="chevdown" s={14} /></span>
            </div>
            {SUBMITTALS.map(([name, type, sec, date, rev, icon]) => (
              <div className="ad-sub" key={name}>
                <span className={'ad-sub-ico' + (type === 'Shop Drawings' ? ' blue' : '')}><Ico n={icon} s={17} /></span>
                <span className="ad-sub-text">
                  <b>{name}</b>
                  <small>
                    <span className={'ad-tag' + (type === 'Shop Drawings' ? ' blue' : '')}>{type}</span>
                    <span className="ad-tag mono">{sec}</span>
                  </small>
                  <small><Ico n="cal" s={12} /> {date}</small>
                  <small className="ad-rev"><Ico n="check" s={12} /> {rev}</small>
                </span>
                <Ico n="chev" s={16} />
              </div>
            ))}
          </div>
        );

      /* ---------------- Documents ---------------- */
      case 'docs':
        if (folderOpen) {
          return (
            <div className="ad-pad">
              {DOC_FILES.map(([name, size]) => (
                <div className="ad-list flat" key={name}>
                  <span><b>{name}</b><small>{size}</small></span>
                  <Ico n="cloudup" s={17} />
                </div>
              ))}
              <button type="button" className="ad-btn wide" onClick={() => setFolderOpen(false)}>Back to documents</button>
            </div>
          );
        }
        return (
          <div className="ad-pad">
            <div className="ad-stats">
              <span className="ad-stat"><Ico n="check" s={17} /><b className="mono green">0</b><small>Downloaded</small></span>
              <span className="ad-stat"><Ico n="cloudup" s={17} /><b className="mono blue">4</b><small>Available</small></span>
              <span className="ad-stat"><Ico n="clock" s={17} /><b className="mono amber">0</b><small>Updates</small></span>
            </div>
            <div className="ad-search"><Ico n="search" s={17} /> Search documents…</div>
            <button type="button" className="ad-list" onClick={() => { setFolderOpen(true); setToast('Quote/PO · 4 documents'); }}>
              <span className="ad-folderrow">
                <span className="ad-folder-ico"><Ico n="folder" s={17} /></span>
                <span><b>Quote/PO</b><small>4 documents</small></span>
              </span>
              <Ico n="chev" s={16} />
            </button>
            <p className="ad-hint">Downloaded documents stay on the phone, so the parkade level is not a problem.</p>
          </div>
        );

      /* ---------------- Contacts ---------------- */
      case 'contacts':
        return (
          <div className="ad-pad">
            <div className="ad-search"><Ico n="search" s={17} /> Search by name or role…</div>
            {CONTACTS.map(([name, role, phone, email]) => (
              <div className="ad-card ad-contact" key={name}>
                <span className="ad-contact-top">
                  <span className="ad-ini">{name.split(' ').map((p) => p[0]).join('')}</span>
                  <span><b>{name}</b><small>{role}</small></span>
                </span>
                <span className="ad-contact-btns">
                  <span className="ad-cbtn"><Ico n="phone" s={14} /> <span className="mono">{phone}</span></span>
                  <span className="ad-cbtn"><Ico n="copy" s={14} /> {email}</span>
                </span>
              </div>
            ))}
          </div>
        );

      /* ---------------- Notes ---------------- */
      case 'notes':
        return (
          <div className="ad-pad">
            {notes.map(([who, date, text], i) => (
              <div className="ad-card ad-note-card" key={who + i}>
                <span className="ad-note-top">
                  <span className="ad-ini sm">{who.split(' ').map((p) => p[0]).join('')}</span>
                  <span><b>{who}</b><small>{date}</small></span>
                  <Ico n="kebab" s={16} />
                </span>
                <p>{text}</p>
              </div>
            ))}
            <button type="button" className="ad-composer"
              onClick={() => {
                if (notes.length > NOTES_SEED.length) { setToast('Already added'); return; }
                setNotes((n) => [['F. Vargas', 'Today', NEW_NOTE], ...n]);
                setToast('Note added · everyone on the job sees it');
              }}>
              <span className="ad-composer-in">Add a note…</span>
              <Ico n="mic" s={17} />
            </button>
            <p className="ad-hint">Tap the note bar — in the app you hold the mic and talk instead of typing.</p>
          </div>
        );

      /* ---------------- Project home ---------------- */
      default:
        return (
          <div className="ad-pad">
            <div className="ad-card ad-sync">
              <span className="ad-cloud"><Ico n="cloud" s={16} /></span>
              <b>Synced <em>7m ago</em></b>
              <span className="ad-sep" aria-hidden="true">|</span>
              <Ico n="cloud" s={15} />
              <b className="mono">24°</b>
              <span>· Mainly clear</span>
            </div>
            <button type="button" className="ad-card ad-caught" onClick={() => go('tasks')}>
              <span className="ad-caught-ico"><Ico n="check" s={18} /></span>
              <span className="ad-caught-text">
                <b>All caught up</b>
                <small>No tasks assigned to you</small>
              </span>
              <span className="ad-caught-go">Team tasks <Ico n="chev" s={13} /></span>
            </button>
            <p className="ad-tools-lbl">Tools</p>
            <div className="ad-tools">
              {TOOLS.map(([k, label, icon]) => (
                <button type="button" key={k} className="ad-tool" onClick={() => go(k)}>
                  <span className="ad-tool-ico"><Ico n={icon} s={18} /></span>
                  {label}
                </button>
              ))}
            </div>
          </div>
        );
    }
  }

  return (
    <div className="ad-stage">
      <nav className="ad-chapters" aria-label="Demo screens">
        <span className="ad-chapters-lbl">Jump to</span>
        {CHAPTERS.map(([k, label, icon]) => (
          <button type="button" key={k}
            className={'ad-chapter' + (screen === k ? ' on' : '')}
            onClick={() => jump(k)}>
            <Ico n={icon} s={16} /> {label}
          </button>
        ))}
      </nav>

      <div className="ad-phonewrap">
        <div className="ad-phone">
          <span className="ad-island" aria-hidden="true" />
          <div className={'ad-screen' + (dark ? ' dark' : '') + (full ? ' full' : '')}>
            {!full && (
              <div className="ad-statusbar">
                <span className="mono">10:39</span>
                <span className="ad-bars" aria-hidden="true"><i /><i /><i /><i /><b /></span>
              </div>
            )}
            {full ? null : dark ? (
              <div className="ad-topbar dark">
                <button type="button" className="ad-back" aria-label="Back" onClick={() => jump('gallery')}>
                  <Ico n="back" s={20} />
                </button>
                <button type="button" className="ad-txtbtn"
                  onClick={() => { setMarks((m) => m.slice(0, -1)); setToast('Undone'); }}>Undo</button>
                <button type="button" className="ad-txtbtn"
                  onClick={() => { setMarks([]); setToast('All markups cleared'); }}>Clear All</button>
                <span className="ad-topspacer" />
                <span className={'ad-swatch ' + (inkRed ? 'red on' : 'white on')} aria-hidden="true" />
              </div>
            ) : (
              <div className="ad-topbar">
                <button type="button" className="ad-back" aria-label="Back"
                  onClick={() => {
                    if (screen === 'cos' && coView) setCoView(false);
                    else if (screen === 'docs' && folderOpen) setFolderOpen(false);
                    else jump('home');
                  }}>
                  <Ico n="back" s={20} />
                </button>
                <b>{title}</b>
                <span className="ad-topright">
                  {screen === 'home' && <Ico n="sync" s={18} />}
                  {screen === 'tasks' && <Ico n="pencil" s={18} />}
                  {screen === 'cos' && coView && <Ico n="pdf" s={18} />}
                  {screen === 'gallery' && <><Ico n="filter" s={17} /><Ico n="plus" s={17} /></>}
                  {screen === 'notes' && <><Ico n="refresh" s={17} /><Ico n="kebab" s={17} /></>}
                  <span className="ad-avatar" />
                </span>
              </div>
            )}
            <div className="ad-body" ref={bodyRef}>{Body()}</div>
            {!dark && !full && (
              <div className="ad-tabs">
                {[['home', 'Home', 'home', 0], ['drawings', 'Drawings', 'layers', 0], ['gallery', 'Camera', 'camera', 0],
                  ['tasks', 'Tasks', 'check', 1], ['docs', 'Documents', 'folder', 0]].map(([k, label, icon, badge]) => (
                    <button type="button" key={label}
                      className={'ad-tab' + (screen === k ? ' on' : '')}
                      onClick={() => jump(k)}>
                      <span className="ad-tab-ico">
                        <Ico n={icon} s={19} />
                        {badge ? <i className="ad-badge">{badge}</i> : null}
                      </span>
                      {label}
                    </button>
                  ))}
              </div>
            )}
            <div className={'ad-toast' + (toast ? ' on' : '')} role="status" aria-live="polite">{toast}</div>
          </div>
        </div>
        <p className="ad-disclaimer">
          Sample project data, fictional names and numbers. Nothing here touches a live
          account — it is the real interface, running in your browser.
        </p>
      </div>

      <aside className="ad-note">
        <p className="eyebrow">{meta[0]}</p>
        <h3>{meta[1]}</h3>
        <p>{meta[2]}</p>
        <Link href={meta[3][0]} className="ad-note-link">{meta[3][1]} →</Link>
        <div className="ad-note-cta">
          <a href={SIGNUP} className="btn btn-primary" style={{ justifyContent: 'center' }}>Start free trial</a>
          <Link href="/construction-software-15min-demo" className="ad-note-demo">
            Rather have a walkthrough? Book 15 min →
          </Link>
        </div>
      </aside>
    </div>
  );
}
