// The one list of tools in SubTrade. The homepage stat, the homepage
// "Everything on one screen" grid and the site-wide schema all count from here,
// so the number never drifts again. Update public/llms.txt by hand to match.

export const DEFINITION =
  'SubTrade is field management software for trade subcontractors: GPS time tracking, change orders, crew scheduling, daily logs and progress billing with holdback, $299/month CAD with 5 users included.';

const F = '/construction-management-features';

export const toolGroups = [
  {
    key: 'field',
    label: 'Field',
    tools: [
      ['⏱️', 'Time Tracking', 'GPS clock-in with live job costing per project.', '/time-tracking'],
      ['📝', 'Daily Logs', 'Two-minute site reports with weather and manpower.', `${F}/daily-logs`],
      ['📷', 'Photos', 'GPS-tagged and timestamped, organized by project.', `${F}/site-photos`],
      ['🛡️', 'Safety & Custom Forms', 'FLHAs, toolbox talks and your own forms, signed on the phone.', `${F}/safety-custom-forms`],
      ['🔧', 'Asset Management', 'Tools, vehicles and equipment, tracked to the job they are on.', `${F}/asset-management`],
    ],
  },
  {
    key: 'money',
    label: 'Money',
    tools: [
      ['🏆', 'Bid Manager', 'Every tender on one board, with proposals. Takeoff and estimating coming soon.', `${F}/bid-manager`],
      ['🧾', 'Change Orders', 'Price, send and track extras before the work is done.', `${F}/change-order-management`],
      ['🧰', 'Purchase Orders', 'Commit costs against budgets and see burn instantly.', '/tutorials/purchase-orders-approval'],
      ['💵', 'Progress Billing', 'Draws built from real field data, with holdback handled.', `${F}/progress-billing`],
    ],
  },
  {
    key: 'office',
    label: 'Office',
    tools: [
      ['📡', 'Live Overview', 'Everything happening on every site, as it happens.', `${F}/field-operations`],
      ['📅', 'Crew Scheduling', 'Drag crews between jobs, notify them automatically.', `${F}/construction-crew-scheduling`],
      ['🗓️', 'Project Schedule', 'Gantt chart per job, baseline slip and every job on one timeline.', `${F}/construction-gantt-chart-software`],
      ['✅', 'Tasks & Punch Lists', 'Kanban boards for deficiencies and closeout.', `${F}/task-management`],
      ['📐', 'Drawings & Markups', 'Current set on every phone, marked up in the field.', `${F}/drawings-markups`],
      ['📄', 'Submittals & RFIs', 'Track what is out, what is late and who is holding it.', `${F}/submittals`],
      ['📊', 'Project Dashboard', 'Every job, its hours, costs and status on one screen.', `${F}/project-dashboard`],
    ],
  },
];

export const TOOL_NAMES = toolGroups.flatMap((g) => g.tools.map((t) => t[1]));
export const TOOL_COUNT = TOOL_NAMES.length;

// Announced but not shipped yet. Shown in the Features menus with a "Soon" tag
// and no link. Not counted in TOOL_COUNT. Move an item into toolGroups (with
// its page) the day it ships.
export const COMING_SOON = [
  ['📐', 'Takeoff & Estimates', 'Plan and aerial view takeoff, priced right in Bid Manager'],
  ['📈', 'Job Costing + QuickBooks', 'Budget vs actual per job, synced to QuickBooks'],
  ['🧾', 'Invoicing', 'Invoice the GC right from the job'],
];
