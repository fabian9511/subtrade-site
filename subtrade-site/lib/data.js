export const SIGNUP = 'https://portal.subtradesoftware.com/signup';
export const PORTAL = 'https://portal.subtradesoftware.com';

export const features = [
  {
    slug: 'field-operations',
    name: 'Field Operations',
    keyword: 'construction field operations software',
    title: 'Field Operations Software for Subcontractors',
    description:
      'One live view of everything happening in your business: crews clocked in, photos coming off sites, logs, approvals and every active project. SubTrade Field Operations.',
    h1: 'Your whole business, live',
    intro:
      'Field Operations is the command center: every project, every crew and every update from the field in one live view, so you always know what is happening across your company without a single status call.',
    points: [
      ['Everything, as it happens', 'Clock-ins, photos, logs and approvals stream in live from every site.'],
      ['Every crew, located', 'See who is working where across all your projects right now.'],
      ['Photos off every site', 'The latest field photos from every job surface automatically.'],
      ['One place to run the day', 'Jump from the live view into any project, task or approval.'],
    ],
    rich: {
      heroTitle: ['Your whole business,', 'live from the field'],
      heroSub:
        'Field Operations is your command center: every project, crew, photo and update in one live view. Run three sites or fifteen and always know exactly what is happening, without a single status call.',
      stats: [
        ['All sites', 'One live view'],
        ['Live', 'Crew clock-ins'],
        ['Auto', 'Photos & logs stream in'],
        ['1 tap', 'Into any project'],
      ],
      sections: [
        {
          eyebrow: 'The command center',
          title: 'See everything happening in your business',
          body:
            'Open Field Operations and the whole company is in front of you: task progress per project, every team member and their role, the latest photos coming off each site, and the project map. It is the view an owner actually needs at 7 AM.',
          checks: [
            'Right Now list: everything that needs action, ranked by urgency',
            'Overdue tasks and waiting change orders with dollar values attached',
            'Live site map: every project and who is working where',
            'Critical, needs-attention and active status per project',
            'Drill into any project, task or approval in one tap',
          ],
          images: ['/subtrade-field-operations-command-center.webp'],
          imageAlt: 'SubTrade Field Operations command center with right-now action list, overdue tasks, change orders waiting, and a live site map of worker locations across projects',
          browser: true,
        },
        {
          eyebrow: 'The live feed',
          title: 'From first clock-in to last log, watch the day happen',
          body:
            'Field data does not wait for Friday. As crews clock in, sign forms, take photos and file logs, everything streams into Field Operations in real time, timestamped and tied to its project. The office finally sees what the field sees.',
          checks: [
            'GPS clock-ins appear the moment crews start',
            'Safety forms and FLHAs land as they are signed',
            'Photos and daily logs stream in from every site',
            'Change orders and approvals flag themselves for action',
            'Everything timestamped and filed to its project automatically',
          ],
          images: ['/subtrade-crew-status-on-site.webp'],
          imageAlt: 'Live crew status in SubTrade showing who is on site, check-in times and running hours per worker',
          flip: true,
        },
        {
          eyebrow: 'Coverage',
          title: 'Know who is missing before the site calls you',
          body:
            'Today\u2019s coverage shows every project\u2019s planned shift against who actually showed up, missing crew flagged by name, and the next seven days of scheduling per site. The gap gets fixed before it becomes a lost day.',
          checks: [
            'Planned versus actual crew per project, live',
            'Missing workers flagged by name, not discovered at noon',
            'Partial coverage warnings before they cost you the day',
            'Next 7 days of shifts across every project in one grid',
            'Empty days are one tap from scheduled',
          ],
          images: ['/subtrade-shift-coverage-next-7-days.webp'],
          imageAlt: 'Shift coverage in SubTrade showing partial coverage warning with missing crew named and a seven day schedule grid across projects',
        },
      ],
      faqs: [
        ['What is Field Operations in SubTrade?', 'Field Operations is the live company-wide view: every active project, every crew member, and every update from the field, clock-ins, photos, forms and logs, in one screen, updating in real time.'],
        ['How is it different from the Project Dashboard?', 'The Project Dashboard goes deep on one job: its costs, billing and status. Field Operations goes wide across your whole business, showing everything happening on every site at once. Most owners live in Field Operations and drill into project dashboards from there.'],
        ['Is the view real time?', 'Yes. As crews clock in, take photos, sign forms and file logs, the updates appear in Field Operations as they happen, each one timestamped and tied to its project.'],
        ['Can I see where my crews are?', 'Yes. GPS-verified clock-ins show who is working on which site right now, across every active project.'],
        ['Does Field Operations work on my phone?', 'Yes. The same live view works on desktop, tablet and phone, so you can run the day from the office or the truck.'],
      ],
    },
  },
  {
    slug: 'project-dashboard',
    name: 'Project Dashboard',
    rich: {
      heroTitle: ['Every job on', 'one screen'],
      heroSub:
        'The project dashboard is your company at a glance: every active job with its hours, costs, billing status and open items, updated as the crew works. Stop calling five foremen to find out where you stand.',
      stats: [
        ['Live', 'Hours & job costs'],
        ['All jobs', 'One screen'],
        ['Real-time', 'Crew clock-ins'],
        ['0', 'Status phone calls'],
      ],
      sections: [
        {
          eyebrow: 'The overview',
          title: 'Your whole operation, at a glance',
          body:
            'Open the dashboard and see every active project side by side: who is clocked in where, percent complete, budget health and what is waiting on you. It works the same on the office monitor and on your phone in the truck.',
          checks: [
            'Every active project with live status on one screen',
            'See who is clocked in, on which site, right now',
            'Latest photos and daily logs surface automatically',
            'Open change orders and approvals waiting on you',
            'Works on desktop, tablet and phone',
          ],
          images: ['/subtrade-dashboard-project-overview.webp'],
          imageAlt: 'SubTrade project dashboard showing budget, margin, tasks, health score, financial performance and operational risk for a construction project',
          browser: true,
        },
        {
          eyebrow: 'Live job costing',
          title: 'Know your margin while you can still fix it',
          body:
            'Labour flows in from GPS clock-ins and material commitments from purchase orders, so cost against estimate is current every single day. The job that is drifting shows up in week two, not in the accountant\u2019s report two months after closeout.',
          checks: [
            'Labour hours roll up from clock-ins by job and cost code',
            'Committed PO costs counted the day you order',
            'Burn against estimate visible per project',
            'Spot the drifting job while there is time to correct it',
            'Real production numbers feed your next estimate',
          ],
          images: ['/subtrade-dashboard-job-costing.webp'],
          imageAlt: 'Financial performance card in SubTrade: contract value, change orders, purchase orders, labour cost, estimated final cost and projected margin',
          flip: true,
        },
        {
          eyebrow: 'From status to draw',
          title: 'The dashboard that gets you paid',
          body:
            'Percent complete, approved change orders and field documentation live in the same place, so when billing day comes the draw is already backed by data. No month-end scramble to reconstruct what happened.',
          checks: [
            'Percent complete per project, backed by field data',
            'Approved change orders ready to carry into billing',
            'Draw status visible: draft, sent, paid',
            'Email one-time PDF reports or share a live activity link with the GC',
            'Holdback handled the Canadian way',
          ],
          images: ['/subtrade-schedule-of-values-progress-billing.webp'],
          imageAlt: 'Schedule of values in SubTrade showing percent complete, this claim, previously invoiced and invoiced to date for progress billing',
          browser: true,
        },
      ],
      faqs: [
        ['What shows on the project dashboard?', 'Every active project with live hours, job costs, percent complete, billing status, latest photos and daily logs, plus anything waiting on your approval, all on one screen.'],
        ['Is the dashboard real time?', 'Yes. It updates as your crews work: GPS clock-ins, photos, logs and purchase orders appear as they happen, so the numbers you see reflect today, not last week.'],
        ['Can I see all my projects at once?', 'Yes. The dashboard is built for subs running multiple concurrent jobs. Every active project appears side by side with its own status, and you can drill into any one of them.'],
        ['How does the job costing work?', 'Labour rolls up automatically from GPS clock-ins by job and cost code, and material costs are counted from purchase orders the day you commit them. Both are compared against your estimate per project.'],
        ['Who on my team can see the dashboard?', 'You control access by role. Owners and project managers typically see everything, while field roles see their own projects and tasks. Everyone sees exactly what they need.'],
        ['Does the dashboard work on my phone?', 'Yes. The full dashboard works on desktop, tablet and phone, so you can check every job from the office, the truck or the site.'],
      ],
    },
    keyword: 'subcontractor project dashboard',
    title: 'Project Dashboard for Subcontractors',
    description:
      'A live dashboard for trade contractors: hours, costs, billing status and open items for every job on one screen. Part of SubTrade subcontractor software.',
    h1: 'Every job. One screen.',
    intro:
      'The project dashboard is the view from your desk, or your truck. Every active job with its hours, committed costs, billing status and open items, updated as the crew works. No calling five foremen to find out where you stand.',
    points: [
      ['Live job costing', 'Labour hours from GPS clock-ins and material commitments from purchase orders roll up per project, so margin is visible while you can still do something about it.'],
      ['Right-now alerts', 'See who is clocked in where, which change orders are waiting on approval, and which jobs are drifting from budget.'],
      ['Run it from anywhere', 'The dashboard works the same on a phone in the truck as on the office monitor. Owners running multiple sites live here.'],
      ['Built for subs, not GCs', 'No GC-style portfolio views you never use. Just your jobs, your crews, your money.'],
    ],
  },
  {
    slug: 'construction-crew-scheduling',
    image: '/subtrade-crew-scheduling-jobsite.webp',
    imageAlt: 'Two workers reviewing the SubTrade crew schedule on a phone at a truck tailgate',

    name: 'Crew Scheduling',
    rich: {
      heroTitle: ['Crews scheduled,', 'sites covered'],
      heroSub:
        'Construction crew scheduling built for subs running many jobs at once: drag crews between projects, everyone gets notified automatically, and coverage gaps show up before they cost you a day.',
      stats: [
        ['Drag & drop', 'Between any jobs'],
        ['Auto', 'Crew notifications'],
        ['7 days', 'Coverage ahead'],
        ['0', 'Monday scrambles'],
      ],
      sections: [
        {
          eyebrow: 'The board',
          title: 'The week, planned in minutes',
          body:
            'Every project and every day on one grid. Assign crews, spot the empty days, and fix partial coverage before it happens. When a site is not ready or an inspection slips, reassignment is a drag, not a phone tree.',
          checks: [
            'Every project and crew on one weekly grid',
            'Planned versus actual coverage, live',
            'Missing workers flagged by name',
            'Partial coverage warnings before they cost the day',
            'Empty days are one tap from scheduled',
          ],
          images: ['/subtrade-shift-coverage-next-7-days.webp'],
          imageAlt: 'SubTrade crew scheduling grid showing seven days of shift coverage across projects with a partial coverage warning',
        },
        {
          eyebrow: 'No phone tree',
          title: 'Everyone knows before they leave site',
          body:
            'Change the schedule and the affected crew members are notified on their phones immediately. Nobody drives to the wrong site, nobody stands around Monday morning waiting for instructions, and the group text finally dies.',
          checks: [
            'Automatic notifications on every schedule change',
            'Crews see where they are going before they leave today\u2019s site',
            'Reassignments take seconds, not an evening of calls',
            'Works across three jobs or fifteen',
            'iOS and Android, every crew member',
          ],
          images: ['/subtrade-crew-scheduling-jobsite.webp'],
          imageAlt: 'Two workers reviewing the SubTrade crew schedule on a phone at a truck tailgate',
          flip: true,
        },
        {
          eyebrow: 'Schedule meets timesheet',
          title: 'The schedule that checks itself',
          body:
            'Scheduling connects to GPS clock-ins, so the plan and the reality meet every morning. Who was scheduled, who showed up, and where the hours actually went, without asking anyone.',
          checks: [
            'Scheduled crews matched against GPS clock-ins',
            'No-shows visible by 8 AM, not at lunch',
            'Hours land on the scheduled job automatically',
            'Real manpower history per project',
            'Feeds job costing without a single spreadsheet',
          ],
          metaCard: [
            ['WingStop Chinook', 'Planned 5 \u00b7 on site 4 \u00b7 1 missing'],
            ['POD Commercial', 'Planned 3 \u00b7 on site 3 \u00b7 covered'],
            ['A. Valencia', 'Checked in 7:10 AM \u00b7 on site 2:39'],
            ['Y. Ortega', 'Checked in 7:54 AM \u00b7 on site 1:55'],
            ['This week', '46 shifts scheduled \u00b7 2 gaps left'],
            ['Next week', '4 of 6 projects covered'],
          ],
        },
      ],
      faqs: [
        ['How does crew scheduling work in SubTrade?', 'Every project and day sits on one grid. Assign crews by dragging, and the schedule shows planned versus actual coverage per site, with gaps and partial coverage flagged before they become lost days.'],
        ['Do crews get notified when the schedule changes?', 'Yes, automatically. Any change notifies the affected crew members on their phones immediately, so everyone knows where they are going before they leave site.'],
        ['Can I schedule across multiple projects?', 'That is exactly what it is built for. Subs running three to fifteen concurrent jobs see every project side by side and move crews between them in seconds.'],
        ['How do I know if someone did not show up?', 'The schedule matches against GPS clock-ins, so planned versus actual coverage is live. A missing crew member is flagged by name in the morning, not discovered at noon.'],
        ['Does scheduling connect to time tracking?', 'Yes. Clock-ins land against the scheduled job automatically, so hours, manpower history and job costing all flow from the same schedule.'],
      ],
    },
    keyword: 'construction crew scheduling',
    title: 'Construction Crew Scheduling Software',
    description:
      'Drag-and-drop construction crew scheduling for trade contractors. Move crews between jobs, notify everyone automatically, and stop the Monday morning scramble.',
    h1: 'Crew scheduling without the whiteboard',
    intro:
      'Construction crew scheduling in SubTrade is a drag-and-drop board. Move a crew from one project to another and everyone gets notified on their phone before they leave site. No group texts, no double-booked crews, no standing around Monday morning.',
    points: [
      ['Drag and drop between jobs', 'See every crew and every project on one timeline. Reassign in seconds when a site is not ready or an inspection slips.'],
      ['Automatic notifications', 'When the schedule changes, the affected crew members know immediately. Nobody shows up to the wrong site.'],
      ['Scheduling meets time tracking', 'The schedule feeds clock-in expectations, so you see planned versus actual manpower per job.'],
      ['Built for multi-site reality', 'Trade subs run three to fifteen jobs at once. The board is designed for exactly that, not for one megaproject.'],
    ],
  },
  {
    slug: 'change-order-management',
    image: '/subtrade-change-order-from-the-field.webp',
    imageAlt: 'Tradesman creating a change order in the SubTrade app in front of a wall opening',
    rich: {
      heroTitle: ['Get the extra signed', 'before you build it'],
      heroSub:
        'Where subs bleed money: extras done on a handshake and fought over at month end. SubTrade lets your foreman create a professional change order on a phone in about a minute, attach photos, send it, and track approval, before the work happens.',
      stats: [
        ['~60 sec', 'From field to sent'],
        ['Photos', 'Attached as backup'],
        ['Tracked', 'Approved \u00b7 pending \u00b7 rejected'],
        ['$0', 'Extras done for free'],
      ],
      sections: [
        {
          eyebrow: 'In the field',
          title: 'How change orders work on site',
          body:
            'The GC asks for extra work. Instead of a handshake and a hope, your foreman opens SubTrade at the wall: scope, price, photos of the condition, send. The paper exists before the work does, which is the whole game.',
          checks: [
            'Create and price a change order from any phone',
            'Attach GPS-tagged photos of the condition as backup',
            'Send it for approval before the extra work starts',
            'Professional format the GC takes seriously',
            'No more remembering extras at billing time',
          ],
          images: ['/subtrade-change-order-from-the-field.webp'],
          imageAlt: 'Tradesman creating a change order in the SubTrade app in front of a wall opening',
        },
        {
          eyebrow: 'Approval tracking',
          title: 'Every extra has a status, nothing gets forgotten',
          body:
            'Sent is not approved, and approved is not invoiced. SubTrade keeps a live register of every change order and where it stands, so slow approvals get chased, rejections get re-scoped, and nothing quietly dies in a GC inbox.',
          checks: [
            'Live status on every CO: draft, sent, approved, rejected',
            'See how long each one has been waiting',
            'Photos and scope stay attached through the whole life of the CO',
            'The full history in one place when the dispute lands',
            'Chase the slow ones before they become free work',
          ],
          metaCard: [
            ['CO-018', 'Approved \u00b7 $4,250'],
            ['CO-019', 'Sent \u00b7 awaiting GC'],
            ['CO-021', 'Pending \u00b7 3 days waiting'],
            ['CO-014', 'Rejected \u00b7 re-scoped'],
            ['Approved this month', '+$12,750'],
            ['Avg response time', '2.1 days'],
          ],
          flip: true,
        },
        {
          eyebrow: 'Into the draw',
          title: 'Approved extras become invoiced extras',
          body:
            'The change order you captured in the field carries straight into progress billing. Approved COs sit alongside your schedule of values, so when the draw goes out, every extra is on it, priced, documented and impossible to argue with.',
          checks: [
            'Approved change orders flow into progress billing',
            'Extras appear alongside the schedule of values',
            'Percent complete and claims backed by field records',
            'Holdback handled the Canadian way',
            'The month-end scramble stops existing',
          ],
          images: ['/subtrade-change-orders-billed-in-claim.webp'],
          imageAlt: 'Approved change orders in SubTrade billed into a progress claim with percent complete, this claim and invoiced to date columns',
          browser: true,
        },
      ],
      faqs: [
        ['How fast can I create a change order in the field?', 'About a minute. Open the project, describe the extra, price it, attach photos of the condition, and send. It is designed to be faster than the phone call it replaces.'],
        ['Can I attach photos to a change order?', 'Yes. GPS-tagged, timestamped photos attach directly to the CO, documenting the condition that triggered the extra work. That backup travels with the change order permanently.'],
        ['How does approval tracking work?', 'Every change order has a live status: draft, sent, approved or rejected, plus how long it has been waiting. You always know which extras are captured and which need chasing.'],
        ['What happens after a change order is approved?', 'It carries into progress billing automatically. Approved COs appear alongside your schedule of values so every extra lands on the next draw, priced and documented.'],
        ['What if the GC does not use SubTrade?', 'No problem. You send the change order to them directly from SubTrade, they do not need an account to receive, review or respond to it.'],
        ['Does this work on my phone?', 'Yes. Change orders are built field-first: create, price, photograph and send from any phone, iOS or Android.'],
      ],
    },

    name: 'Change Orders',
    keyword: 'change order management software',
    title: 'Change Order Management Software for Subcontractors',
    description:
      'Create, price and send change orders from the field before the extra work happens. Digital approval tracking so trade contractors stop working for free.',
    h1: 'Get the extra signed before you build it',
    intro:
      'Where subs bleed money: extras done on a handshake and fought over at month end. SubTrade lets your foreman create a professional change order on a phone in under a minute, attach photos, send it to the GC and track approval status. The work does not start until the paper exists.',
    points: [
      ['Sixty seconds from the field', 'Scope, price, photos, send. Faster than the phone call it replaces.'],
      ['Approval tracking', 'Approved, pending, rejected. Every change order has a status and a history, so nothing gets forgotten in an inbox.'],
      ['Photos as backup', 'GPS-tagged photos attach directly, documenting the condition that triggered the extra.'],
      ['Flows into billing', 'Approved change orders carry into progress billing, so captured scope becomes invoiced scope.'],
    ],
  },
  {
    slug: 'daily-logs',
    image: '/subtrade-daily-log-foreman-end-of-day.webp',
    imageAlt: 'Foreman filing a daily log in the SubTrade app at end of day on a commercial site',

    name: 'Daily Logs',
    rich: {
      heroTitle: ['The dispute file that', 'writes itself'],
      heroSub:
        'A daily log that takes twenty minutes does not get filled out. SubTrade logs take two: weather, manpower, work completed, delays and photos, filed to the project forever. Eight months later, when the claim lands, you have every day on record.',
      stats: [
        ['~2 min', 'Per daily log'],
        ['Auto', 'Weather stamped'],
        ['Photos', 'Attached in line'],
        ['Forever', 'Searchable by date'],
      ],
      sections: [
        {
          eyebrow: 'In the field',
          title: 'Two minutes, on a phone, on site',
          body:
            'Foremen fill logs at the end of the day with the crew still around them, not from memory at the kitchen table. Weather and date stamp automatically, manpower carries from clock-ins, and photos drop straight into the day they belong to.',
          checks: [
            'Weather, date and time stamped automatically',
            'Manpower pulled from the day\u2019s clock-ins',
            'Work completed, delays and visitors in plain fields',
            'Photos attach directly to the day',
            'Signed and filed to the project in one tap',
          ],
          images: ['/subtrade-daily-log-foreman-end-of-day.webp'],
          imageAlt: 'Foreman filing a daily log in the SubTrade app at end of day on a commercial site',
        },
        {
          eyebrow: 'A real day',
          title: 'What a log looks like',
          body:
            'Every log is a complete snapshot of the day: conditions, crew, progress, problems and proof. Individually they take two minutes. Together they are a defensible record of the entire project.',
          checks: [
            'Every day of the project, one tap away',
            'Delays documented the day they happen, not reconstructed later',
            'The other trade\u2019s slowdown, on the record',
            'Site conditions and visitors captured',
            'Search any project by date in seconds',
          ],
          metaCard: [
            ['Weather', '20\u00b0 \u00b7 clear \u00b7 wind 4.7 km/h'],
            ['Manpower', '6 on site \u00b7 46.5 hrs'],
            ['Completed', 'Boarding L3 east \u00b7 82%'],
            ['Delays', 'Electrical rough-in behind \u00b7 area blocked'],
            ['Photos', '4 attached \u00b7 GPS tagged'],
            ['Signed', 'M. Torres \u00b7 4:52 PM'],
          ],
          flip: true,
        },
      ],
      faqs: [
        ['How long does a daily log take?', 'About two minutes on a phone. Weather, date and manpower fill themselves, the foreman adds work completed, delays and photos, signs, and the log files to the project.'],
        ['Is the weather recorded automatically?', 'Yes. Every log stamps the day\u2019s weather and conditions automatically, the context that wins delay disputes.'],
        ['Can I attach photos to a daily log?', 'Yes. Site photos drop straight into the day they belong to, GPS-tagged and timestamped alongside the notes.'],
        ['Can I find old logs later?', 'Every log is filed to its project and searchable by date. What happened on any day of any job is seconds away, even years later.'],
        ['Why do daily logs matter for disputes?', 'Because a contemporaneous, timestamped record beats memory every time. When a delay claim or backcharge lands months later, the log from that exact day, with weather, manpower and photos, is your defence file.'],
      ],
    },
    keyword: 'construction daily log software',
    title: 'Construction Daily Log Software for Trade Contractors',
    description:
      'Two-minute daily logs from the field: weather, manpower, work completed, delays. Build a dispute defence file automatically with SubTrade.',
    h1: 'The dispute file that writes itself',
    intro:
      'A daily log that takes twenty minutes does not get filled out. SubTrade logs take two: weather, manpower, work completed, delays, photos. Eight months later, when the delay claim lands, you have a timestamped record for every day on site.',
    points: [
      ['Two minutes, on a phone', 'Foremen fill logs on site with the crew still around them, not from memory at the kitchen table.'],
      ['Weather and manpower stamped', 'The context that wins disputes gets captured automatically alongside the notes.'],
      ['Searchable forever', 'Every log filed to its project. Find what happened on any date on any job in seconds.'],
      ['Photos in line', 'Site photos drop straight into the day they belong to.'],
    ],
  },
  {
    slug: 'site-photos',
    image: '/subtrade-gps-site-photos-worker.webp',
    imageAlt: 'Worker capturing a GPS-tagged jobsite photo with the SubTrade app',
    rich: {
      heroTitle: ['Site photos that', 'prove your work'],
      heroSub:
        'Every photo tagged with who took it, when, and exactly where on site. Now with before and after comparisons and markups drawn right on the photo, so the record does not just exist, it makes your point.',
      stats: [
        ['GPS', 'Tagged from mobile'],
        ['Before / After', 'Side-by-side proof'],
        ['Markups', 'Draw on any photo'],
        ['500', 'Chars of notes per photo'],
      ],
      sections: [
        {
          eyebrow: 'New feature',
          title: 'Before & after photos',
          isNew: true,
          body:
            'Pair a before shot with an after shot and SubTrade puts them side by side. The proof speaks for itself, to the GC, the adjuster, or the owner who does not remember it looking that bad.',
          checks: [
            'Pair any two photos into a before and after comparison',
            'Side-by-side comparison on mobile and desktop',
            'Both photos keep their own GPS tag, date, and uploader',
            'Share the pair with the GC as one link',
            'Perfect for restoration, repairs, and progress claims',
          ],
          images: ['/subtrade-before-after-construction-photos.webp'],
          imageAlt: 'Before and after photos of a commercial restaurant ceiling project compared in SubTrade',
          tablet: 'portrait',
        },
        {
          eyebrow: 'New feature',
          title: 'Mark up your photos',
          isNew: true,
          body:
            'A photo shows the wall. A markup shows the problem. Draw, circle, drop arrows, and add text right on any site photo, so the crew, the GC, or the inspector sees exactly what you mean without a phone call.',
          checks: [
            'Draw freehand, circles, and arrows on any photo',
            'Add text labels right where the issue is',
            'Original photo stays untouched, markups save as a layer',
            'Share marked-up photos with the GC or your crew',
            'Use them in tasks, punch lists, and change orders',
          ],
          images: ['/subtrade-photo-markup-install-access-panel.webp'],
          imageAlt: 'Site photo marked up in SubTrade with an arrow and install access panel note',
          tablet: 'landscape',
          flip: true,
        },
        {
          eyebrow: 'GPS + notes',
          title: 'Every photo knows who, when & where',
          body:
            'Photos taken from the SubTrade mobile app are automatically GPS-tagged with the exact coordinates where they were taken. Add up to 500 characters of notes, and every upload carries the crew member\u2019s profile icon, so accountability is built in.',
          checks: [
            'Automatic GPS geotag on every mobile photo',
            'Map view shows the exact location on site',
            'Date, time, and uploader stamped automatically',
            'Latest photos visible right on the project dashboard',
            'Share photos directly from the app',
          ],
          metaCard: [
            ['Photo', 'Mar 31, 2026 \u00b7 2:14 PM'],
            ['Taken by', 'Derek Santos'],
            ['Location', '51.064810, \u2212114.093210'],
            ['Notes', 'Install blocking before boarding ceiling. Coordinate with electrical on conduit routing.'],
            ['Markups', '1 circle \u00b7 1 arrow \u00b7 1 label'],
            ['Compared', 'Paired with Apr 02 after photo'],
          ],
        },
      ],
      faqs: [
        ['Are photos automatically GPS tagged?', 'Yes. Photos taken from the SubTrade mobile app are automatically tagged with GPS coordinates, and a map view in the photo detail shows exactly where on site the photo was taken.'],
        ['How do before and after photos work?', 'Pair any two photos into a comparison. SubTrade shows them side by side, and both photos keep their own date, GPS tag, and uploader. Share the pair as one link.'],
        ['Can I draw on my photos?', 'Yes. Mark up any photo with freehand drawing, circles, arrows, and text labels. The original photo stays untouched, your markups save as a layer on top.'],
        ['Can I see who uploaded each photo?', 'Yes. Every photo displays the uploader\u2019s profile icon, in the grid view, the dashboard quick view, and the full photo detail. You always know who took what.'],
        ['Can I add notes to photos?', 'Yes. Add up to 500 characters of notes to any photo, describe what needs to happen, flag an issue, or leave instructions for the crew. Notes are visible to the whole project team.'],
        ['Can I share photos with the GC?', 'Yes. Share any photo, marked-up photo, or before and after pair directly from the app. The GC receives it with the date, uploader, notes, and GPS location, no phone call needed.'],
      ],
    },

    name: 'Photos',
    keyword: 'construction photo documentation',
    title: 'GPS-Tagged Construction Photos',
    description:
      'Every jobsite photo GPS-tagged, timestamped and filed to its project automatically. Photo documentation for trade contractors that holds up in disputes.',
    h1: 'Proof that holds up when memories do not',
    intro:
      'Camera rolls lose arguments. SubTrade photos are GPS-tagged, timestamped and filed to their project the moment they are taken. When someone claims the area was ready, or the damage was yours, you have the evidence in ten seconds.',
    points: [
      ['Location and time stamped', 'Every photo carries where and when. That metadata is the difference between a photo and evidence.'],
      ['Filed automatically', 'Photos land in the right project without anyone organizing folders.'],
      ['Markup in the field', 'Circle the issue, add a note, attach it to a task or change order.'],
      ['Findable months later', 'Search by project and date instead of scrolling a 4,000-photo camera roll.'],
    ],
  },
  {
    slug: 'task-management',
    name: 'Tasks & Punch Lists',
    rich: {
      heroTitle: ['Punch lists that', 'actually close'],
      heroSub:
        'Sticky notes and text threads are where deficiencies go to be forgotten. SubTrade tasks are boards built for construction closeout: assign the item, attach the photo, track it to done. Faster closeout means faster holdback release.',
      stats: [
        ['Kanban', 'Built for closeout'],
        ['Photos', 'On every task'],
        ['Assigned', 'Every item owned'],
        ['Faster', 'Holdback release'],
      ],
      sections: [
        {
          eyebrow: 'The board',
          title: 'Every deficiency, moving or visible',
          body:
            'Columns that match how deficiencies actually move: open, in progress, ready for review, closed. Nothing hides in a group text, and the board tells you at a glance whether closeout is moving or stuck.',
          checks: [
            'Boards per project: open, in progress, review, closed',
            'Every item assigned to a person, not a hope',
            'Overdue tasks flag themselves',
            'Filter by trade, area or assignee',
            'Watch the board burn down instead of walking with a legal pad',
          ],
          metaCard: [
            ['Open', '12 items \u00b7 3 overdue'],
            ['In progress', '7 items'],
            ['Ready for review', '4 items'],
            ['Closed this week', '23 items'],
            ['Oldest open', 'Corridor B bulkhead \u00b7 9 days'],
            ['Closeout pace', 'On track for Friday'],
          ],
        },
        {
          eyebrow: 'Proof attached',
          title: 'Every task carries its own evidence',
          body:
            'The deficiency photo and the completion photo live on the task itself. Whoever picks it up sees exactly what and where, and whoever reviews it sees the fix, without a site walk or a phone call.',
          checks: [
            'Deficiency photo attached when the task is created',
            'Completion photo attached when the work is done',
            'GPS and timestamps on both',
            'Notes and history stay with the task forever',
            'Created from photos, logs or change orders in one tap',
          ],
          metaCard: [
            ['Task', 'Patch bulkhead \u00b7 corridor B'],
            ['Assigned', 'J. Piriz \u00b7 due Friday'],
            ['Created from', 'Site photo \u00b7 GPS tagged'],
            ['Before', 'Photo attached \u00b7 Jun 11'],
            ['After', 'Photo attached \u00b7 Jun 14'],
            ['Status', 'Ready for review'],
          ],
          flip: true,
        },
      ],
      faqs: [
        ['How do punch lists work in SubTrade?', 'Every deficiency becomes a task on a board with columns for open, in progress, ready for review and closed. Items are assigned, photographed and tracked until the board is empty.'],
        ['Can I attach photos to tasks?', 'Yes, and you should: the deficiency photo when the task is created and the completion photo when it is done, both GPS-tagged, both permanently on the task.'],
        ['Can tasks be assigned to specific people?', 'Every task has an owner and a due date. Overdue items flag themselves, so nothing dies quietly in a list.'],
        ['Why does closeout speed matter?', 'Because holdback release waits on deficiency completion. A punch list that closes in days instead of weeks is money released sooner.'],
        ['Can I create a task from a photo?', 'Yes. A marked-up site photo becomes a task in one tap, with the photo, location and notes already attached.'],
      ],
    },
    keyword: 'construction task management',
    title: 'Task Management & Punch Lists for Subcontractors',
    description:
      'Kanban boards built for deficiencies and closeout, not software sprints. Assign tasks, attach photos, close punch lists faster with SubTrade.',
    h1: 'Punch lists that actually close',
    intro:
      'Sticky notes and text threads are where deficiencies go to be forgotten. SubTrade tasks are Kanban boards built for construction closeout: assign the item, attach the photo, track it to done. Faster closeout means faster holdback release.',
    points: [
      ['Kanban for construction', 'Columns that match how deficiencies actually move: open, in progress, ready for review, closed.'],
      ['Photo on every task', 'The deficiency photo and the completion photo live on the task itself.'],
      ['Assigned and visible', 'Every item has an owner. Nothing dies in a group text.'],
      ['Closeout velocity', 'Watch the board burn down instead of walking the site with a legal pad.'],
    ],
  },
  {
    slug: 'drawings-markups',
    name: 'Drawings & Markups',
    rich: {
      heroTitle: ['The current set,', 'in every pocket'],
      heroSub:
        'Building from a superseded drawing is one of the most expensive mistakes on any job. SubTrade puts the current set on every phone with markups, measurements and photo pins right on the sheet. When a revision lands, everyone has it instantly.',
      stats: [
        ['Current rev', 'On every device'],
        ['Measure', 'Right on the sheet'],
        ['Pins', 'Photos & notes placed'],
        ['Instant', 'Revision push'],
      ],
      sections: [
        {
          eyebrow: 'On site',
          title: 'Drawings that work with gloves on',
          body:
            'The full set on every phone and tablet, built for the field: pinch, zoom, measure and mark up right on the sheet. Your foreman stops calling to ask where the drawings are. They are in his pocket, and they are the right revision.',
          checks: [
            'Full drawing set on every phone and tablet',
            'Measure spans and take off areas right on the sheet',
            'Drop photo pins exactly where the issue is',
            'Markups, clouds and notes on the drawing',
            'Auto-named sheets on upload',
          ],
          images: ['/subtrade-app-construction-drawing-markup.webp'],
          imageAlt: 'Construction drawing in the SubTrade mobile app with measurements, markups and photo pins on a reflected ceiling plan',
          tablet: 'portrait',
        },
        {
          eyebrow: 'Precision',
          title: 'Measurements the whole crew can trust',
          body:
            'Set the scale once and measure anything: spans, runs, areas. Layout questions get answered at the wall in seconds instead of back at the trailer, and takeoff checks happen on the spot.',
          checks: [
            'Scale-accurate measurements on any sheet',
            'Span and distance measuring in feet and inches',
            'Area takeoffs for quick quantity checks',
            'Photo pins tie site reality to the drawing',
            'Every markup saved as a layer, original untouched',
          ],
          metaCard: [
            ['Sheet', '1.0102.1M \u00b7 Reflected ceiling'],
            ['Scale', '1/8\u2033 = 1\u2032-0\u2033'],
            ['Measured', '19.49 ft \u00b7 system span'],
            ['Area', '121.36 sq ft \u00b7 washrooms'],
            ['Pins', '2 photos \u00b7 1 note placed'],
            ['Revision', 'C \u00b7 current on 12 devices'],
          ],
          flip: true,
        },
        {
          eyebrow: 'Revision control',
          title: 'Revisions without casualties',
          body:
            'Upload the new set and the old one is superseded everywhere at once. Every device shows the current revision, the old sheets are archived, not deleted, and nobody builds a wall from drawing rev B on a rev C job.',
          checks: [
            'New revisions push to every device instantly',
            'Superseded sheets archived with full history',
            'Markups carry forward where they still apply',
            'See which revision anyone is looking at',
            'The rev B wall never gets built',
          ],
          metaCard: [
            ['Rev C uploaded', 'Tuesday 4:51 PM'],
            ['Pushed to', '12 devices \u00b7 instantly'],
            ['A-301', 'Superseded \u00b7 archived'],
            ['Markups', 'Carried forward \u00b7 3 sheets'],
            ['History', 'Rev A \u00b7 B \u00b7 C retained'],
            ['Wrong-rev builds', '0'],
          ],
        },
      ],
      faqs: [
        ['Can my crew see drawings on their phones?', 'Yes. The full current set works on every phone and tablet, iOS and Android, built for field conditions: pinch, zoom, measure and mark up on the sheet.'],
        ['Can I measure on the drawings?', 'Yes. Set the scale and measure spans, runs and areas directly on the sheet, scale-accurate, in feet and inches.'],
        ['What happens when a new revision comes in?', 'Upload it and every device updates instantly. Old sheets are superseded and archived with history, so nobody builds from an outdated drawing.'],
        ['Can I put photos on a drawing?', 'Yes. Drop a photo pin exactly where the issue is, and the site photo lives on the sheet at that location.'],
        ['Do markups change the original drawing?', 'No. Markups save as a layer on top. The original sheet stays untouched underneath.'],
      ],
    },
    keyword: 'construction drawings app',
    title: 'Construction Drawings & Markups in the Field',
    description:
      'The current drawing set on every phone. Mark up plans, pin photos and kill the wrong-revision callback with SubTrade drawings for trade contractors.',
    h1: 'The current set, in every pocket',
    intro:
      'Building from a superseded drawing is one of the most expensive mistakes on any job. SubTrade puts the current set on every device, with markups, measurements and photo pins right on the sheet. When a revision lands, everyone has it instantly.',
    points: [
      ['Always the current revision', 'Upload the new set and the old one is superseded everywhere at once.'],
      ['Markup on the sheet', 'Dimensions, clouds, notes and photo pins directly on the drawing.'],
      ['No more drawing phone calls', 'Your foreman stops calling to ask where the drawings are. They are in his pocket.'],
      ['Works on site', 'Built for phones and tablets in the field, gloves-on.'],
    ],
  },
  {
    slug: 'safety-custom-forms',
    name: 'Safety & Custom Forms',
    rich: {
      heroTitle: ['Compliance without', 'the binder'],
      heroSub:
        'Paper hazard assessments get pencil-whipped in the truck and lost in the glovebox. SubTrade puts FLHAs, toolbox talks, inspections and any form you build on the crew\u2019s phones, signed digitally and filed automatically.',
      stats: [
        ['FLHA', 'Signed on phones'],
        ['Any form', 'You can build it'],
        ['Auto-filed', 'By project & date'],
        ['Audit-ready', 'Always'],
      ],
      sections: [
        {
          eyebrow: 'In the field',
          title: 'Signed at the tailgate, filed forever',
          body:
            'The pre-shift inspection happens where it should: at the equipment, on a phone, with real checks. A Not Okay answer flags immediately instead of hiding on page three of a binder nobody opens.',
          checks: [
            'FLHAs and inspections completed on phones',
            'Digital signatures, timestamped and tied to the worker',
            'Not Okay answers flag for action immediately',
            'Reference images built into the form',
            'Every completed form filed by project and date',
          ],
          images: ['/subtrade-app-safety-inspection-checklist.webp'],
          imageAlt: 'Scissor lift pre-shift inspection checklist completed in the SubTrade app with okay and not okay checks',
          tablet: 'portrait',
        },
        {
          eyebrow: 'Your program',
          title: 'Any form your safety program runs on',
          body:
            'FLHA, toolbox talks, equipment inspections, incident reports, or the custom form your GC insists on. Build it once, and the crew fills it on their phones from then on. Two-minute phone forms get filled honestly; twenty-minute paper ones get faked.',
          checks: [
            'Build any custom form your program or GC requires',
            'Checklists, signatures, photos and reference images',
            'Recurring forms scheduled: daily FLHA, weekly toolbox talk',
            'Completion visible per crew and per project',
            'COR audit prep drops from weeks to hours',
          ],
          metaCard: [
            ['FLHA', 'Daily \u00b7 6 signed today'],
            ['Toolbox talk', 'Weekly \u00b7 fall protection'],
            ['Scissor lift inspection', '1 Not Okay \u00b7 flagged'],
            ['Incident reports', '0 this month'],
            ['Custom forms', '4 active \u00b7 your program'],
            ['Audit file', 'Complete \u00b7 by project & date'],
          ],
          flip: true,
        },
      ],
      faqs: [
        ['Can crews complete FLHAs on their phones?', 'Yes. Field level hazard assessments are completed and signed on phones at the start of shift, timestamped and tied to the worker and project.'],
        ['Can I build my own custom forms?', 'Yes. Any form your safety program or GC requires: checklists, text fields, signatures, photos and reference images. Build it once and it is on every crew phone.'],
        ['What happens when something is marked Not Okay?', 'It flags immediately for action instead of disappearing into a binder. The deficiency is visible the moment the form is signed.'],
        ['Where do completed forms go?', 'Filed automatically by project and date. When the safety audit or COR review comes, everything is already organized.'],
        ['Does this help with COR certification?', 'Substantially. The documentation trail COR audits demand, completed forms, signatures, dates, corrective actions, builds itself as your crews work.'],
      ],
    },
    keyword: 'construction safety forms software',
    title: 'Construction Safety Forms & Custom Forms Software',
    description:
      'FLHAs, toolbox talks, inspections and any custom form, completed and signed on a phone. Digital safety compliance for trade contractors.',
    h1: 'Compliance without the binder',
    intro:
      'Paper hazard assessments get pencil-whipped in the truck and lost in the glovebox. SubTrade puts FLHAs, toolbox talks, inspections and any form you build on the crew\u2019s phones, signed digitally and filed automatically. When the safety audit comes, everything is already organized.',
    points: [
      ['Your forms, digitized', 'Build any form your safety program or GC requires. FLHA, toolbox talk, equipment inspection, incident report.'],
      ['Signed on the phone', 'Digital signatures in the field, timestamped and tied to the worker and the project.'],
      ['Audit-ready always', 'Every completed form filed by project and date. COR audit prep goes from weeks to hours.'],
      ['Actually gets done', 'A two-minute phone form gets filled out honestly. A paper one gets faked.'],
    ],
  },
  {
    slug: 'submittals',
    name: 'Submittals & RFIs',
    rich: {
      heroTitle: ['Know who is sitting', 'on your paperwork'],
      heroSub:
        'The submittal you sent three weeks ago is holding up your material order, and nobody upstairs is in a hurry. SubTrade logs every submittal and RFI with dates and status, so you always know what is out, what is late, and you have the record when the delay becomes a claim.',
      stats: [
        ['Logged', 'Every submittal & RFI'],
        ['Dated', 'Sent \u00b7 due \u00b7 answered'],
        ['Visible', 'Who is holding it'],
        ['On record', 'When it becomes a claim'],
      ],
      sections: [
        {
          eyebrow: 'The register',
          title: 'Every open item, aging in plain sight',
          body:
            'Shop drawings, product data, samples, questions: everything you have sent up the chain sits in one register with its status and how long it has been waiting. The slow ones get chased before they slow you.',
          checks: [
            'Every submittal logged: sent date, response due, status',
            'RFIs asked once, in writing, with the answer attached',
            'Waiting time visible on every open item',
            'Resubmittals and revisions tracked in the chain',
            'Nothing falls through, nothing lives in sent mail',
          ],
          metaCard: [
            ['SUB-014 \u00b7 Shop drawings', 'Sent \u00b7 waiting 12 days'],
            ['SUB-015 \u00b7 Product data', 'Approved \u00b7 order released'],
            ['RFI-160 \u00b7 Wall furring', 'Answered \u00b7 3 days'],
            ['RFI-162 \u00b7 Ceiling detail', 'Open \u00b7 due Friday'],
            ['Oldest open', 'SUB-014 \u00b7 chase today'],
            ['Avg response', '6.4 days this project'],
          ],
        },
        {
          eyebrow: 'Paper trail',
          title: 'When their delay costs you, the log proves it',
          body:
            'Slow answers become schedule impacts, and schedule impacts become claims. The register is your evidence: what you asked, when you asked it, and how long the answer took. Verbal answers on site become written records the same day.',
          checks: [
            'Complete dated history on every item',
            'Delay documentation built as you work',
            'Answers attached permanently to the question',
            'Site-issued verbal answers captured in writing',
            'The record exists before the dispute does',
          ],
          metaCard: [
            ['RFI-160', 'Asked Jun 2 \u00b7 site verbal Jun 5'],
            ['Written answer', 'Logged same day \u00b7 attached'],
            ['SUB-014 impact', 'Material order held 12 days'],
            ['Schedule note', 'Linked to daily log Jun 14'],
            ['Claim file', 'Building itself'],
            ['Phone calls required', '0'],
          ],
          flip: true,
        },
      ],
      faqs: [
        ['What can I track with submittals?', 'Shop drawings, product data, samples, anything you send up the chain: each with sent date, response due date, current status and how long it has been waiting.'],
        ['How do RFIs work in SubTrade?', 'Ask the question once, in writing, tied to the project. The answer attaches permanently, and the full dated history stays on record.'],
        ['Can I see how long the GC has been sitting on something?', 'Yes. Waiting time is visible on every open item, so the slow ones get chased before they slow your schedule.'],
        ['Why does the paper trail matter?', 'Because slow responses become delay claims. A dated register of what you asked and when it was answered is the evidence that wins those conversations.'],
        ['Can I capture verbal answers from site?', 'Yes, and you should: log the verbal answer the day it is given, and it becomes part of the written record attached to the RFI.'],
      ],
    },
    keyword: 'submittals and RFI software',
    title: 'Submittals & RFI Tracking for Subcontractors',
    description:
      'Track shop drawings, submittals and RFIs: what went out, when, and who is sitting on it. Paper trail without the paper, built for trade contractors.',
    h1: 'Know who is sitting on your paperwork',
    intro:
      'The submittal you sent three weeks ago is holding up your material order, and nobody upstairs is in a hurry. SubTrade logs every submittal and RFI with dates and status, so you always know what is out, what is late, and you have the record when the delay becomes a claim.',
    points: [
      ['Every submittal logged', 'Shop drawings, product data, samples. Sent date, response due, current status.'],
      ['RFIs with a paper trail', 'Ask the question once, in writing, with the answer attached forever.'],
      ['Delay documentation', 'When their slow response costs you time, the log proves it.'],
      ['Nothing falls through', 'Open items are visible until they close, not buried in sent mail.'],
    ],
  },
];

export const trades = [
  {
    slug: 'drywall-contractor-software',
    trade: 'Drywall',
    keyword: 'drywall contractor software',
    title: 'Drywall Contractor Software',
    description:
      'Software built by a working drywall contractor: track hours per unit, capture extras, schedule tapers and boarders, and bill progress draws. Free trial.',
    h1: 'Software that has actually hung board',
    intro:
      'SubTrade was built inside a commercial drywall company. Not inspired by one, built inside one. Boarding, taping, texture: the founder runs a Calgary drywall sub to this day, which is why the workflow fits yours.',
    pains: [
      'Labour per unit or per floor is a guess until the job is over',
      'Patching and extras done verbally and never billed',
      'Boarders, tapers and texture crews double-booked across sites',
      'Draw disputes with nothing but memory as backup',
    ],
    wins: [
      'GPS clock-ins tie hours to the job and cost code, so you see labour burn per phase while it happens',
      'Change orders created at the wall, with photos, before the patch gets mudded',
      'Crew scheduling built for the boarding-taping-texture sequence across multiple sites',
      'Daily logs and photos that back up every progress draw',
    ],
  },
  {
    slug: 'electrical-contractor-software',
    trade: 'Electrical',
    keyword: 'electrical contractor software',
    title: 'Electrical Contractor Software',
    description:
      'Field software for electrical subcontractors: time tracking by circuit of work, change orders, drawings on every phone, and progress billing. Free trial.',
    h1: 'Built for sparkies running multiple sites',
    intro:
      'Electrical subs live and die on labour productivity and captured extras. SubTrade tracks both from the field, keeps the current drawing set in every journeyman\u2019s pocket, and turns site directives into signed change orders before the wire is pulled.',
    pains: [
      'Site instructions become free work when nobody writes the CO',
      'Hours tracked on paper and allocated to jobs from memory on Friday',
      'Crews working from superseded drawings after a revision',
      'RFIs answered verbally with no record when it matters',
    ],
    wins: [
      'Change orders created and sent for approval the moment the directive lands',
      'GPS time tracking that allocates hours to the right job automatically',
      'Current drawings with markups on every phone, revisions pushed instantly',
      'RFIs and submittals logged with dates, so slow answers are documented',
    ],
  },
  {
    slug: 'hvac-contractor-software',
    trade: 'HVAC',
    keyword: 'HVAC contractor software',
    title: 'HVAC Contractor Software',
    description:
      'HVAC subcontractor software for mechanical trades: crew scheduling, equipment and material POs, change orders and progress billing in one app. Free trial.',
    h1: 'Mechanical work, managed from the field',
    intro:
      'HVAC and mechanical subs juggle long-lead equipment, multi-phase installs and coordination with every other trade on site. SubTrade keeps the schedule, the paperwork and the money visible in one place, from rough-in to startup.',
    pains: [
      'Equipment and material orders disconnected from job budgets',
      'Coordination delays absorbed silently instead of documented',
      'Rough-in and finish crews scheduled by group text',
      'Percent-complete billing argued from memory',
    ],
    wins: [
      'Purchase orders committed against the job the day you order, not when the invoice lands',
      'Daily logs that document the trades ahead of you running late',
      'Drag-and-drop scheduling across rough-in, set and finish phases',
      'Progress billing built from field data, with holdback handled correctly',
    ],
  },
  {
    slug: 'plumbing-contractor-software',
    trade: 'Plumbing',
    keyword: 'plumbing contractor software',
    title: 'Plumbing Contractor Software',
    description:
      'Field management software for plumbing subcontractors: GPS time tracking, change orders, inspections and scheduling across rough-in and finish. Free trial.',
    h1: 'From ground rough to final fixture',
    intro:
      'Plumbing subs run crews across ground rough, top-out and finish on multiple sites at once, with inspections gating every phase. SubTrade keeps crews, hours, extras and inspection paperwork organized so the office always knows where every job stands.',
    pains: [
      'Inspection results and deficiencies scattered across texts and voicemail',
      'Extra work from site conflicts done without paper',
      'Hours split across phases and jobs by guesswork',
      'Material runs with no PO and no cost code',
    ],
    wins: [
      'Tasks and punch lists that track deficiencies from inspection to sign-off',
      'Sixty-second change orders with photos of the conflict',
      'Clock-ins tied to job and phase for real labour costing',
      'POs from the field matched to the job budget',
    ],
  },
  {
    slug: 'painting-contractor-software',
    trade: 'Painting',
    keyword: 'painting contractor software',
    title: 'Painting Contractor Software',
    description:
      'Software for commercial painting subcontractors: crew scheduling, production tracking, touch-up punch lists and progress billing in one app. Free trial.',
    h1: 'Production and touch-ups, tracked',
    intro:
      'Commercial painting margins live in production rates and die in unpaid touch-ups. SubTrade tracks hours against jobs in real time, documents the damage other trades cause, and turns endless touch-up lists into managed punch lists that actually close.',
    pains: [
      'Touch-ups from other trades\u2019 damage eaten as free work',
      'Production rates unknown until the job closes',
      'Crews bounced between sites with no record of where hours went',
      'Final payment held hostage by an unmanaged deficiency list',
    ],
    wins: [
      'Photos and change orders documenting damage before you repaint it',
      'Live hours per job showing production against estimate',
      'GPS clock-ins that put labour on the right project automatically',
      'Punch list boards that drive closeout and release your holdback',
    ],
  },
  {
    slug: 'framing-contractor-software',
    trade: 'Framing',
    keyword: 'framing contractor software',
    title: 'Framing Contractor Software',
    description:
      'Field software for framing and steel stud subcontractors: crew scheduling, layout drawings on site, hours by phase and change orders. Free trial.',
    h1: 'Wood or steel, keep the crews moving',
    intro:
      'Framing subs, wood or steel stud, run production crews that need the right drawings, the right site and the right scope every morning. SubTrade was built alongside a steel stud and drywall operation, so layout changes, extras and crew moves are its home turf.',
    pains: [
      'Layout revisions reaching the site after the walls are up',
      'Extra blocking, backing and openings framed for free',
      'Crews idle because the site was not ready and nobody rescheduled',
      'Labour by phase invisible until the estimator asks what went wrong',
    ],
    wins: [
      'Revision-controlled drawings with markups on every phone',
      'Change orders for extras captured at layout, not remembered at billing',
      'Drag-and-drop crew moves with automatic notifications',
      'Hours by job and phase feeding real production numbers back to estimating',
    ],
  },
  {
    slug: 'concrete-contractor-software',
    trade: 'Concrete',
    keyword: 'concrete contractor software',
    title: 'Concrete Contractor Software',
    description:
      'Field software for concrete and formwork subcontractors: pour scheduling, crew management, extras captured, QC documentation and progress billing. Free trial.',
    h1: 'From formwork to finish, documented',
    intro:
      'Concrete subs live on schedule windows that weather and other trades love to break. SubTrade keeps pours, crews, extras and QC paperwork in one place, so every delay is documented and every extra yard, pump hour and additive gets billed.',
    pains: [
      'Pour delays from site conditions absorbed without paper',
      'Pump time, additives and extra yards billed from memory',
      'Form, pour and strip crews juggled across sites by phone',
      'QC tests and inspection records scattered when the dispute lands',
    ],
    wins: [
      'Daily logs with weather stamps that document every delayed pour',
      'Change orders for extras created at the truck, photos attached',
      'Drag-and-drop scheduling across form, pour and strip phases',
      'Photos, tests and inspection forms filed by project, audit-ready',
    ],
  },
];

export const compares = [
  {
    slug: 'subtrade-vs-fieldwire',
    competitor: 'Fieldwire',
    positioning:
      'Fieldwire is a strong task and plan management tool that grew up serving general contractors and large project teams. SubTrade is built exclusively for trade subcontractors, so the money side of subcontracting, change orders, purchase orders and progress billing with holdback, is native rather than an afterthought.',
    differences: [
      ['Who it is built for', 'Fieldwire centers on GC and project-team workflows. SubTrade is designed around a trade sub running crews across multiple jobs.'],
      ['The money workflow', 'SubTrade includes change orders, POs and progress billing with Canadian holdback in every plan. Task-first tools typically leave billing to other systems.'],
      ['Time tracking and job costing', 'GPS clock-in tied to live job costing is core SubTrade. Labour burn per job is visible daily.'],
      ['Pricing simplicity', 'SubTrade is one plan with everything included, published on the pricing page. No feature tiers to decode.'],
    ],
  },
  {
    slug: 'subtrade-vs-buildertrend',
    competitor: 'Buildertrend',
    positioning:
      'Buildertrend is a well-established platform aimed primarily at residential builders and remodelers, with strong client-facing and sales features. SubTrade is aimed at commercial trade subcontractors, where the daily reality is crews on other people\u2019s projects, GC paperwork and progress draws.',
    differences: [
      ['Residential builder vs commercial sub', 'Buildertrend\u2019s core personas are builders selling to homeowners. SubTrade\u2019s core persona is a sub working for GCs.'],
      ['Client portal vs GC paperwork', 'Where Buildertrend invests in homeowner communication, SubTrade invests in change orders, submittals, RFIs and holdback billing.'],
      ['Field-first simplicity', 'SubTrade is scoped to what crews actually use, so setup takes a day, not a consulting engagement.'],
      ['Transparent pricing', 'One SubTrade plan, published pricing, five users included.'],
    ],
  },
  {
    slug: 'subtrade-vs-esub',
    competitor: 'eSUB',
    positioning:
      'eSUB is one of the few platforms that also focuses on trade subcontractors, with deep document workflows. SubTrade takes a more field-first approach: lighter to roll out, priced for small and mid-size subs, and built with Canadian billing practices like holdback in mind.',
    differences: [
      ['Rollout weight', 'SubTrade setup averages a day with crews on phones the same week. Enterprise-style platforms typically involve longer onboarding.'],
      ['Canadian billing', 'Progress billing with holdback handled the Canadian way is native to SubTrade.'],
      ['Priced for real subs', 'Published pricing at $299/month with five users included, instead of quote-based sales cycles.'],
      ['Field adoption', 'SubTrade is designed so a foreman learns it by coffee break. Adoption is the feature.'],
    ],
  },
  {
    slug: 'subtrade-vs-contractor-foreman',
    competitor: 'Contractor Foreman',
    positioning:
      'Contractor Foreman offers a very broad feature list at an aggressive price, serving many contractor types at once. SubTrade goes the other way: a focused set of tools for trade subcontractors specifically, each built deep for that one workflow.',
    differences: [
      ['Breadth vs focus', 'Contractor Foreman covers many contractor types with many modules. SubTrade does the sub workflow deeply, without trying to be everything.'],
      ['Built by a sub', 'Every SubTrade feature exists because a working subcontracting business needed it on a real job first.'],
      ['No bloat to ignore', 'No accounting suite or payroll module you pay attention to but never use. SubTrade pairs with the accounting you already have.'],
      ['Canadian workflows', 'Holdback math and Canadian billing practices are first-class in SubTrade.'],
    ],
  },
  {
    slug: 'subtrade-vs-raken',
    competitor: 'Raken',
    positioning:
      'Raken is well known for daily reporting and field data capture. SubTrade includes comparable daily logs, photos and time tracking, then continues into what subs need next: change orders, purchase orders and progress billing, so field data becomes invoiced dollars.',
    differences: [
      ['Beyond reporting', 'Daily logs are where Raken shines and where SubTrade starts. The same data flows into billing and change orders.'],
      ['The revenue loop', 'Field-documented extras become sendable change orders in the same app. Documentation that turns into money.'],
      ['One platform', 'Scheduling, drawings, tasks, safety forms and billing alongside the daily log, one login for the whole job.'],
      ['Sub-specific design', 'Built for trade subcontractors rather than as a field add-on for GC systems.'],
    ],
  },
  {
    slug: 'subtrade-vs-knowify',
    competitor: 'Knowify',
    positioning:
      'Knowify is a capable platform for specialty contractors with strong contract and accounting-adjacent workflows. SubTrade is more field-first: crews, drawings, logs and safety on phones, with billing driven by what actually happened on site.',
    differences: [
      ['Field-first vs office-first', 'SubTrade starts with what crews touch daily. Field adoption drives everything else.'],
      ['Crew tools included', 'Drawings with markups, safety and custom forms, GPS photos and punch lists are core, not integrations.'],
      ['Canadian holdback', 'Progress billing handles holdback the Canadian way out of the box.'],
      ['Simple to run', 'One plan, everything included, running in a day.'],
    ],
  },
];

export const timeTrackingRich = {
  name: 'Time Tracking',
  rich: {
    heroTitle: ['Every hour, on the', 'right job'],
    heroSub:
      'GPS time tracking built for construction crews: clock in from the truck, hours land on the right project and cost code automatically, and Friday payroll prep takes minutes instead of an evening of deciphering texts.',
    stats: [
      ['GPS', 'Verified clock-ins'],
      ['Live', 'Who is on site now'],
      ['By job', 'Hours & cost codes'],
      ['~6 min', 'Friday payroll prep'],
    ],
    sections: [
      {
        eyebrow: 'In the field',
        title: 'Clock in from the truck',
        body:
          'Crews clock in on their own phones when they arrive, GPS confirms they are on site, and the timer runs against the right project. No shared kiosk, no paper cards, no 4 PM guess about when Tuesday started.',
        checks: [
          'Clock in and out from any phone, iOS or Android',
          'GPS verification: on site means on site',
          'Hours land on the right project automatically',
          'Breaks and site switches handled cleanly',
          'Works offline, syncs when signal returns',
        ],
        images: ['/subtrade-gps-time-tracking-clock-in.webp'],
        imageAlt: 'Worker clocking in with GPS on the SubTrade app at sunrise beside his truck',
      },
      {
        eyebrow: 'The timesheet',
        title: 'Friday takes six minutes',
        body:
          'Timesheets build themselves from the week\u2019s clock-ins, organized by person and by job. Review, adjust the odd entry, approve. What used to be an evening of texts and memory is a coffee-length task.',
        checks: [
          'Timesheets assemble automatically from clock-ins',
          'Review by person, by crew or by project',
          'One-tap approvals with an audit trail',
          'Exceptions flagged: missed punches, long days',
          'Export for payroll in the format you need',
        ],
        metaCard: [
          ['M. Torres', '8.0 hrs \u00b7 Site 4 \u00b7 framing'],
          ['A. Valencia', '7.5 hrs \u00b7 WingStop \u00b7 boarding'],
          ['Y. Ortega', '8.0 hrs \u00b7 POD \u00b7 taping'],
          ['Crew total', '46.5 hrs today'],
          ['Flagged', '1 missed punch \u00b7 fixed'],
          ['Week status', 'Approved \u00b7 exported'],
        ],
        flip: true,
      },
      {
        eyebrow: 'Job costing',
        title: 'Hours become job costs, live',
        body:
          'Every tracked hour feeds labour cost per project and per cost code, compared against your estimate as the job runs. Labour is the number that decides whether a drywall job made money, and now you watch it live instead of discovering it at closeout.',
        checks: [
          'Labour cost per project, updating as crews work',
          'Cost codes show where the hours actually went',
          'Burn against estimate, visible mid-job',
          'The drifting job surfaces in week two, not month four',
          'Real production rates feed your next bid',
        ],
        metaCard: [
          ['Capitol Hill \u00b7 U204', 'Labour 61% of estimate \u00b7 on pace'],
          ['Boarding', '1,120 hrs \u00b7 $42,300'],
          ['Taping', '369 hrs \u00b7 $14,760'],
          ['vs estimate', '+2.1% margin projected'],
          ['This week', '212 crew hours captured'],
          ['Spreadsheets involved', '0'],
        ],
      },
    ],
    faqs: [
      ['How does GPS time tracking work?', 'Crews clock in on their own phones when they arrive, and GPS confirms the clock-in happened on site. Hours run against the right project automatically from that moment.'],
      ['Can I see who is on site right now?', 'Yes. Live status shows every crew member currently clocked in, on which site, with their running hours.'],
      ['How do timesheets and payroll work?', 'Timesheets assemble automatically from the week\u2019s clock-ins, organized by person and project. Review, approve and export for payroll, most subs get Friday prep down to minutes.'],
      ['Does it work without cell signal?', 'Yes. Clock-ins work offline, in the parkade or the basement, and sync the moment the phone finds signal again.'],
      ['How does this feed job costing?', 'Every hour lands on a project and cost code, so labour cost per job updates live against your estimate. You see the drifting job while there is still time to fix it.'],
      ['What do my crews need?', 'Just their own phones, iOS or Android. No kiosks, no cards, no extra hardware.'],
    ],
  },
};
