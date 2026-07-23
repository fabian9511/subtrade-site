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
    eyebrow: 'Honest Comparison',
    headline: 'Plans on site, or the whole business?',
    positioning: `Fieldwire is an excellent jobsite coordination tool: plans, tasks, punch lists, and field markups, backed by Hilti. But it stops at the field. SubTrade covers the rest of running a trade sub: time tracking, change orders, scheduling, and job costing, in one app built for crews.`,
    heroNote: `No credit card required. An honest look at where each tool stops.`,
    shortAnswer: {
      them: [`Choose Fieldwire if`, `Your main need is jobsite plan management: drawings, tasks, punch lists, and field markups, and you handle costing and billing elsewhere.`],
      us: [`Choose SubTrade if`, `You want plans plus the business side: time tracking, change orders, scheduling, and job costing, in one app built for the trade sub.`],
    },
    glanceIntro: `Fieldwire is strong on plans and field coordination. SubTrade runs the whole sub workflow. Here is how they line up.`,
    table: [
      [`Built for`, `Running the whole trade-sub business`, `Jobsite plan and task coordination`],
      [`Plans, drawings & markups`, `Included`, `Core strength`],
      [`Tasks & punch lists`, `Yes`, `Core strength`],
      [`Time tracking & job costing`, `Core feature`, `Not the focus`],
      [`Change orders`, `Core, field-first`, `Not the focus`],
      [`Scheduling`, `Crew & job scheduling`, `Task-level`],
      [`Pricing`, `From $299/mo CAD, all-in`, `Free tier; paid about $29–$89/user/mo`],
      [`Best for`, `Subs who want one app for field and office`, `Teams who just need plan coordination`],
    ],
    tableNote: `Pricing as publicly listed. Confirm current tiers on their site.`,
    winsIntro: `Fieldwire keeps the plans organized. SubTrade runs the business those plans are part of.`,
    wins: [
      [`The Whole Workflow`, `Plans and field coordination plus time, change orders, scheduling, and costing, instead of just one slice.`],
      [`Field-First Change Orders`, `Price extras on the spot and see margin in real time, from the jobsite.`],
      [`Real-Time Job Costing`, `Labor and cost tracked as the crew works, not pieced together after the fact.`],
      [`Transparent Pricing`, `One all-inclusive plan instead of stacking per-user seats as the crew grows.`],
      [`Plans & Markups Too`, `Drawings, markups, and punch lists are included, so you do not lose what Fieldwire does well.`],
      [`One App, Not Two`, `No bolting a separate costing or billing tool onto your plan viewer.`],
      [`Built By A Real Sub`, `Out of a working commercial drywall company in Calgary. Every feature survived a real jobsite.`],
    ],
    theirWinsTitle: `Where Fieldwire wins`,
    theirWins: `For pure jobsite plan management, Fieldwire is excellent and well-backed by Hilti, with a free tier that is hard to beat if all you need is drawings, tasks, and punch lists. If you do not need costing, change orders, or billing in the same place, it is a strong, focused tool.`,
    pricingBody: [
      `Fieldwire has a free tier, with paid plans publicly around $29 to $89 per user per month depending on features. SubTrade is $299 per month CAD all-in with every feature included, a 14-day free trial, and no credit card.`,
      `As crews grow, per-user pricing adds up; SubTrade keeps it flat and bundles the field and office toolkit in one plan.`,
    ],
    pricingTagline: `Built for the trades, by the trades. Confirm current competitor pricing before relying on these figures.`,
    chooseHeading: `Who should choose SubTrade?`,
    chooseList: [
      `You want field and office in one app`,
      `Change orders, time, and costing matter, not just plans`,
      `Per-user pricing is getting expensive as you grow`,
      `Time tracking, change orders, scheduling, logs, drawings, costing`,
    ],
    faq: [
      [`Is SubTrade a good Fieldwire alternative?`, `Yes, if you want more than plan coordination. SubTrade includes drawings and markups but adds time tracking, change orders, scheduling, and job costing in one app for the trade sub.`],
      [`Does SubTrade do plans and markups like Fieldwire?`, `Yes. SubTrade includes drawings, markups, and punch lists, plus the costing and change-order tools Fieldwire leaves to other software.`],
    ],
  },
  {
    slug: 'subtrade-vs-buildertrend',
    competitor: 'Buildertrend',
    eyebrow: 'Honest Comparison',
    headline: 'Which is right for a subcontractor?',
    positioning: `Buildertrend is one of the best-known names in construction software, but it was built for general contractors and home builders managing a whole project, with subs as one piece of the puzzle. SubTrade is built for the opposite point of view: the trade sub running their own crews, bids, and billing.`,
    heroNote: `No credit card required. If you run an electrical, drywall, HVAC, plumbing, or concrete crew, this one is for you.`,
    shortAnswer: {
      them: [`Choose Buildertrend if`, `You are a residential general contractor or home builder who needs client-facing tools, selections, and full project management across many trades.`],
      us: [`Choose SubTrade if`, `You are a trade subcontractor who needs field-first time tracking, fast change orders, crew scheduling, and real-time job costing, without paying for a platform built for someone else's job.`],
    },
    glanceIntro: `Same category on paper. Built for two different companies. Here is how they line up for a trade subcontractor.`,
    table: [
      [`Built for`, `Trade subcontractors`, `General contractors and home builders`],
      [`Best fit`, `Electrical, drywall, HVAC, plumbing, concrete subs`, `Residential builders and remodelers`],
      [`Starting price`, `From $299/mo CAD, all features included`, `From about $399/mo, tiered plans, higher tiers $500 to $900+`],
      [`Field-first mobile app`, `Designed for crews on a phone`, `Yes, but office and client heavy`],
      [`GPS time tracking & job costing`, `Core feature`, `Available`],
      [`Change orders from the field`, `Core, under 2 minutes`, `Available, GC oriented`],
      [`Client / homeowner portal`, `Not needed by subs, so not in your way`, `Yes, core for builders`],
      [`Learning curve`, `Low, set up in a day`, `Steeper, more to configure`],
      [`Free trial`, `14 days, no credit card`, `Demo led`],
    ],
    tableNote: `Pricing as publicly listed. Confirm current Buildertrend pricing on their site.`,
    winsIntro: `Every point below comes from being built around the sub's workflow instead of the GC's.`,
    wins: [
      [`Built Around The Sub`, `You are not paying for client portals and selection tools you will never use. The whole app is your workflow.`],
      [`Field-First`, `Your foreman opens the app, clocks in by GPS, snaps photos, logs the day, and prices a change order on the spot. No training day.`],
      [`Capture More Revenue`, `Price and send a change order before the extra work is done, with GC sign-off. Subs who switch capture far more of their scope.`],
      [`Real-Time Margin`, `Labor cost and margin per job as you go, so you know if a job is profitable before the accountant tells you months later.`],
      [`Simpler Price`, `One all-inclusive plan instead of tiered packages that climb fast as you add what you actually need.`],
      [`Built By A Real Sub`, `SubTrade came out of a working commercial drywall company in Calgary. Every feature survived a real jobsite.`],
    ],
    theirWinsTitle: `Where Buildertrend wins`,
    theirWins: `Buildertrend is a mature, full-suite platform. If you are a builder coordinating an entire residential project, client selections, homeowner communication, warranty, and managing multiple trades, it has depth SubTrade does not try to match. It is a strong tool for the GC's job.`,
    pricingBody: [
      `SubTrade is a single all-inclusive plan from $299 per month CAD, save 20% annually, with tiered per-user pricing as your crew grows. Every feature included, 14-day free trial, no credit card.`,
      `Buildertrend uses tiered plans that publicly start around $399 per month and rise into the hundreds for higher tiers. For most trade subs, SubTrade delivers the tools you actually use at a lower total cost.`,
    ],
    pricingTagline: `Built for the trades, by the trades. Confirm current competitor pricing before relying on these figures.`,
    chooseHeading: `Who should switch?`,
    chooseList: [
      `You signed up for Buildertrend or inherited it from a GC`,
      `You use only a fraction of what you pay for`,
      `You want time tracking, change orders, scheduling, daily logs, drawings, and job costing`,
      `You want one simpler app built for your trade`,
    ],
    faq: [
      [`Is SubTrade a good Buildertrend alternative for subcontractors?`, `Yes. Buildertrend is built for general contractors and builders. SubTrade is built specifically for trade subcontractors, with field-first time tracking, change orders, and job costing at a lower starting price.`],
      [`Is SubTrade cheaper than Buildertrend?`, `SubTrade starts at $299 per month CAD with all features included. Buildertrend's public pricing starts around $399 per month and rises by tier, so SubTrade is generally lower cost for trade subs.`],
      [`Can SubTrade do change orders like Buildertrend?`, `Yes. SubTrade lets you price and send a change order from the field in under two minutes with GC digital sign-off, designed around how subs capture extras.`],
    ],
  },
  {
    slug: 'subtrade-vs-procore',
    competitor: 'Procore',
    eyebrow: 'Honest Comparison',
    headline: 'Which is right for a subcontractor?',
    positioning: `Procore is the biggest name in construction software, a powerful enterprise platform built for large general contractors and owners running complex projects. SubTrade is built for the other side of the table: the trade sub running crews, change orders, and labor cost on the jobs they are hired for.`,
    heroNote: `No credit card required. If you run an electrical, drywall, HVAC, plumbing, or concrete crew, this one is for you.`,
    shortAnswer: {
      them: [`Choose Procore if`, `You are a large GC or owner who needs enterprise project, financial, and document management across big commercial projects with many stakeholders.`],
      us: [`Choose SubTrade if`, `You are a trade sub who needs field-first time tracking, change orders, scheduling, and real-time job costing, without enterprise complexity or enterprise pricing.`],
    },
    glanceIntro: `One is an enterprise platform for the GC's whole project. One is right-sized for the sub doing the work. Here is how they line up.`,
    table: [
      [`Built for`, `Trade subcontractors`, `Large GCs, owners, enterprise`],
      [`Best fit`, `Small to mid trade crews`, `Large commercial projects`],
      [`Pricing`, `From $299/mo CAD, all-in`, `Custom quote, typically enterprise-level, often tens of thousands per year`],
      [`Setup`, `Up and running in a day`, `Longer onboarding and implementation`],
      [`Field-first mobile app`, `Designed for crews`, `Yes, but built for full project teams`],
      [`Change orders from the field`, `Core, under 2 minutes`, `Yes, GC and enterprise oriented`],
      [`Real-time labor cost & margin`, `Core feature`, `Available within a larger suite`],
      [`Complexity`, `Low`, `High, lots of modules`],
    ],
    tableNote: `Pricing as publicly available. Procore pricing is quote-based, confirm on their site.`,
    winsIntro: `Right-sized, field-first, and priced for a trade business instead of an enterprise.`,
    wins: [
      [`Right-Sized For Subs`, `You are not buying or learning an enterprise platform built for the GC's whole project.`],
      [`Field-First & Fast`, `Your foreman clocks in, snaps photos, logs the day, and prices a change order on the spot. No implementation project required.`],
      [`Transparent Pricing`, `One all-inclusive plan instead of a custom enterprise quote and a long contract.`],
      [`Live Margin Per Job`, `Labor cost and margin per job, the numbers a sub actually lives on, in real time.`],
      [`Set Up In A Day`, `No onboarding project. Create your account, add your crews, and start the same day.`],
      [`Built By A Real Sub`, `Born inside a working commercial drywall company in Calgary. Every feature survived a real jobsite.`],
    ],
    theirWinsTitle: `Where Procore wins`,
    theirWins: `For a large general contractor or owner, Procore is hard to beat: deep financials, document control, an enormous subcontractor network, and a module for nearly everything. If you are running big commercial projects with many stakeholders, that breadth is the point.`,
    pricingBody: [
      `SubTrade is a single all-inclusive plan from $299 per month CAD with a 14-day free trial and no credit card. Procore is quote-based and priced for enterprise, typically a much larger annual commitment with implementation.`,
      `For most trade subs, Procore is more platform, and more cost, than the job requires.`,
    ],
    pricingTagline: `Built for the trades, by the trades. Confirm current competitor pricing before relying on these figures.`,
    chooseHeading: `Who should choose SubTrade?`,
    chooseList: [
      `Subs asked to work inside a GC's Procore`,
      `Subs considering Procore for their own shop`,
      `Crews that want the sub-specific tools they will actually use`,
      `Anyone who wants one simple app at a fraction of the cost`,
    ],
    faq: [
      [`Is SubTrade a good Procore alternative for subcontractors?`, `Yes. Procore is enterprise software for large GCs. SubTrade is built and priced for trade subcontractors, with field-first time tracking, change orders, and job costing.`],
      [`Is SubTrade cheaper than Procore?`, `Generally, yes. SubTrade starts at $299 per month CAD all-in, while Procore is quote-based at enterprise pricing.`],
      [`Can I use SubTrade if my GC uses Procore?`, `Yes. Many subs run their own operations in SubTrade while still delivering to a GC who uses Procore.`],
    ],
  },
  {
    slug: 'subtrade-vs-esub',
    competitor: 'eSUB',
    eyebrow: 'Honest Comparison',
    headline: 'Two tools built for subcontractors',
    positioning: `eSUB and SubTrade cover much of the same ground for trade subcontractors: full RFIs, submittals, document control, time tracking, change orders, and job costing, for crews of any size. The real difference is how they feel to use. SubTrade gives you that same capability in a simpler, mobile-first app that a crew actually adopts, at a transparent price.`,
    heroNote: `No credit card required. Two sub-focused tools, compared straight.`,
    shortAnswer: {
      them: [`Choose eSUB if`, `You want a heavier, enterprise-style platform with deep configuration and structured workflows, and you have the team to run it.`],
      us: [`Choose SubTrade if`, `You want the same capabilities in a much simpler app, full paperwork and field tools, for any size of crew, that your people will actually use without training.`],
    },
    glanceIntro: `Both cover the core sub workflows for any size of crew. The honest difference is not what they do, it is how simple they are to run. Here is how they line up.`,
    table: [
      [`Built for`, `Trade subcontractors`, `Commercial trade subcontractors`],
      [`Style`, `Same depth, simpler and mobile-first`, `Capable but heavier, enterprise-leaning`],
      [`Pricing`, `From $299/mo CAD, all-in`, `Quote-based, per user`],
      [`Setup`, `A day`, `Longer onboarding`],
      [`Time tracking & job costing`, `Core feature`, `Yes`],
      [`Change orders`, `Core, field-first`, `Yes`],
      [`RFIs / submittals / doc control`, `Full RFIs, submittals, and document control`, `Deep, a core strength`],
      [`Best for`, `Trade subs of every size, from small crews to large commercial operations`, `Larger commercial subs`],
    ],
    tableNote: `Pricing as publicly available. eSUB is quote-based, confirm on their site.`,
    winsIntro: `SubTrade matches eSUB on the capabilities that matter. Where it pulls ahead is simplicity, speed, and price, the things that decide whether your crew actually uses it.`,
    wins: [
      [`The Same Power, Simpler`, `The capabilities are there, but mobile-first and set up in a day, so a crew uses it without a training session.`],
      [`Transparent Pricing`, `One all-inclusive plan instead of a custom per-user quote and a sales process.`],
      [`Field-First Change Orders`, `Price extras on the spot and see margin in real time, from the jobsite.`],
      [`Scales With You`, `From a single crew to a large commercial sub running many jobs at once. The same app grows with the company.`],
      [`Streamlined Docs`, `RFIs and submittals are included and kept simple, so they get used instead of avoided.`],
      [`Paperwork Handled`, `Full RFIs, submittals, and document control included, so you get the heavy paperwork and the field tools in one place.`],
      [`Built By A Real Sub`, `Out of a working commercial drywall company in Calgary. Every feature survived a real jobsite.`],
    ],
    theirWinsTitle: `Where eSUB still fits`,
    theirWins: `eSUB is a long-established, enterprise-grade platform, and some large organizations prefer a heavier system with deep configuration and a dedicated admin to run it. That is a real preference, not a capability gap: SubTrade serves large commercial subs too, with the same full RFIs, submittals, and document control. If you would rather have that power in an app your whole crew can pick up, that is SubTrade.`,
    pricingBody: [
      `eSUB is quote-based and priced per user for commercial operations. SubTrade is $299 per month CAD all-in with a 14-day free trial and no credit card.`,
      `For most trade subs, whatever the size, SubTrade is simpler to buy and lower in total cost.`,
    ],
    pricingTagline: `Built for the trades, by the trades. Confirm current competitor pricing before relying on these figures.`,
    chooseHeading: `Who should choose SubTrade?`,
    chooseList: [
      `You run anything from one crew to many`,
      `eSUB feels pricier than the job requires`,
      `You want core sub workflows in a lighter app`,
      `Time tracking, change orders, scheduling, logs, drawings, costing`,
    ],
    faq: [
      [`Is SubTrade a good eSUB alternative?`, `Yes. SubTrade serves trade subs of every size and covers the same heavy paperwork, full RFIs, submittals, and document control, plus field-first time tracking, change orders, and job costing, in a simpler, mobile-first, lower-cost platform than eSUB's enterprise approach.`],
      [`Do both eSUB and SubTrade do change orders and time tracking?`, `Yes. SubTrade emphasizes a fast, field-first experience and transparent pricing.`],
    ],
  },
  {
    slug: 'subtrade-vs-contractor-foreman',
    competitor: 'Contractor Foreman',
    eyebrow: 'Honest Comparison',
    headline: 'Which fits a trade sub?',
    positioning: `Contractor Foreman is one of the most affordable do-everything construction apps on the market: broad, budget-friendly, and popular with small contractors. SubTrade takes a different approach: instead of a little of everything for everyone, it is built specifically for trade subcontractors and the way crews actually run jobs.`,
    heroNote: `No credit card required. An honest comparison for trade subs weighing price against fit.`,
    shortAnswer: {
      them: [`Choose Contractor Foreman if`, `You want the cheapest possible all-in-one with a huge feature checklist and you are comfortable with a more generic, general-contractor-style tool.`],
      us: [`Choose SubTrade if`, `You want software built around a trade sub's workflow, fast field change orders, GPS time tracking, and real-time job costing, with a cleaner, crew-friendly experience.`],
    },
    glanceIntro: `One is the cheapest do-everything tool. One is purpose-built for the trade sub. Here is how they line up.`,
    table: [
      [`Built for`, `Trade subcontractors`, `General and small contractors, broad`],
      [`Approach`, `Focused, trade-specific`, `Many features, generalist`],
      [`Pricing`, `From $299/mo CAD, all-in`, `From about $49/mo, tiered, per limited users`],
      [`Field-first mobile app`, `Built for crews`, `Yes, but feature-dense`],
      [`Change orders from the field`, `Core, under 2 minutes`, `Available`],
      [`Real-time labor cost & margin`, `Core feature`, `Available`],
      [`Ease of use for crews`, `High, low learning curve`, `More to navigate`],
      [`Built by`, `A working subcontractor`, `A software company`],
    ],
    tableNote: `Pricing as publicly listed. Confirm current tiers on their site.`,
    winsIntro: `Focused beats generic when the software has to match how a trade crew actually works.`,
    wins: [
      [`Built For Trades`, `Workflows match how subs bid scope, run crews, and bill, not a generic GC checklist.`],
      [`Change Orders That Pay`, `Priced and sent from the field before the extra work happens, with GC sign-off.`],
      [`Crews Actually Use It`, `Less clutter, faster on a phone, set up in a day. The difference between a tool you use and one you bought.`],
      [`Costing Front And Center`, `Real-time job costing and margin up front, not buried three menus deep in a module.`],
      [`Per-Trade Fit`, `Dedicated solutions for drywall, electrical, HVAC, plumbing, and more.`],
      [`Built By A Real Sub`, `Out of a working commercial drywall company in Calgary. Every feature survived a real jobsite.`],
    ],
    theirWinsTitle: `Where Contractor Foreman wins`,
    theirWins: `Price and breadth. Contractor Foreman packs a long feature list at a low entry point, which is attractive if budget is the deciding factor and you want one tool that technically does almost everything. For a very small, cost-sensitive shop, that value is real.`,
    pricingBody: [
      `Contractor Foreman wins on sticker price, with entry plans around $49 per month for a few users. SubTrade is $299 per month CAD all-in.`,
      `The trade-off: with SubTrade you are paying for software purpose-built for your trade and a workflow your crew adopts fast, often the difference between a tool you use and a tool you bought.`,
    ],
    pricingTagline: `Built for the trades, by the trades. Confirm current competitor pricing before relying on these figures.`,
    chooseHeading: `Who should choose SubTrade?`,
    chooseList: [
      `You tried a cheap all-in-one and found it generic`,
      `The tool felt cluttered for real trade work`,
      `You want a focused, crew-friendly platform`,
      `You want change orders and costing built for subs`,
    ],
    faq: [
      [`Is SubTrade worth more than Contractor Foreman's lower price?`, `For trade subs, often yes. SubTrade is purpose-built for your workflow with deeper change-order and job-costing tools your crew will actually adopt.`],
      [`Is Contractor Foreman built for subcontractors?`, `It is a broad, general-purpose contractor tool. SubTrade is designed specifically for trade subcontractors.`],
    ],
  },
  {
    slug: 'subtrade-vs-raken',
    competitor: 'Raken',
    eyebrow: 'Honest Comparison',
    headline: 'Field reporting, or the whole operation?',
    positioning: `Raken is a well-liked field app for daily reports, time cards, photos, and toolbox talks. SubTrade does all of that, just as easily, and then keeps going: change orders, crew scheduling, drawings, and real-time job costing, all in one app that stays simple to use.`,
    heroNote: `No credit card required. An honest comparison for trade subs.`,
    shortAnswer: {
      them: [`Choose Raken if`, `You only ever need daily reports and time cards, and you are happy running change orders, scheduling, and costing in other tools.`],
      us: [`Choose SubTrade if`, `You want the same easy field reporting plus the whole operation, change orders, scheduling, drawings, and live job costing, in one simple app.`],
    },
    glanceIntro: `SubTrade does everything Raken does in the field, just as simply, and then covers the rest of the operation too. Here is how they line up.`,
    table: [
      [`Built for`, `Trade subcontractors, the full operation`, `Field reporting and time cards`],
      [`Daily logs & photos`, `Yes, just as easy`, `Yes, a core strength`],
      [`Time tracking`, `Yes, same ease, plus job costing`, `Yes, time cards`],
      [`Change order management`, `Core, field-first`, `Limited, not a focus`],
      [`Crew scheduling`, `Yes`, `Limited`],
      [`Drawings & markups`, `Yes`, `Limited`],
      [`Real-time labor cost & margin`, `Core feature`, `Time data, less margin focus`],
      [`Pricing`, `From $299/mo CAD, all-in`, `Quote-based, per user`],
    ],
    tableNote: `Pricing as publicly available. Raken is quote-based, confirm on their site.`,
    winsIntro: `SubTrade matches Raken on easy field reporting, then covers the rest of the operation, without making the app any harder to use.`,
    wins: [
      [`The Whole Job, Still Simple`, `Change orders, scheduling, drawings, and costing alongside your daily logs, and the app stays as easy as Raken to actually use.`],
      [`Change Orders That Pay`, `Priced and sent from the field before the extra is done, so the revenue does not slip away.`],
      [`Real-Time Margin`, `Labor cost and margin per project, not just hours captured on a time card.`],
      [`Scheduling & Drawings`, `Crew scheduling and current drawings live in the same place as your logs and photos.`],
      [`Just As Easy In The Field`, `GPS and time-stamped daily logs with photos, every bit as quick as Raken, so you give up nothing on ease.`],
      [`Built By A Real Sub`, `Out of a working commercial drywall company in Calgary. Every feature survived a real jobsite.`],
    ],
    theirWinsTitle: `Where Raken wins`,
    theirWins: `Raken is polished and genuinely easy for field documentation. If daily reporting is the only thing you will ever need, it does that one job nicely. SubTrade is built for the same ease, so the question is less about who reports better and more about whether you want the rest of the operation in the same simple app.`,
    pricingBody: [
      `Raken is quote-based and priced per user, focused on field reporting. SubTrade is $299 per month CAD all-in, covering reporting and change orders, scheduling, drawings, and job costing.`,
      `For a sub running the whole job, SubTrade replaces several separate tools with one simple app, without adding the complexity that usually comes with more features.`,
    ],
    pricingTagline: `Built for the trades, by the trades. Confirm current competitor pricing before relying on these figures.`,
    chooseHeading: `Who should choose SubTrade?`,
    chooseList: [
      `You like Raken's daily reports`,
      `But you stitch it together with other apps`,
      `For change orders, scheduling, and costing`,
      `You want the whole operation in one app`,
    ],
    faq: [
      [`Is SubTrade a good Raken alternative?`, `Yes, if you need more than daily reports. SubTrade includes daily logs plus change orders, scheduling, drawings, and job costing in one app.`],
      [`Does SubTrade do daily reports like Raken?`, `Yes. GPS and time-stamped daily logs with photos, plus the broader sub toolkit Raken does not focus on.`],
    ],
  },
  {
    slug: 'subtrade-vs-knowify',
    competitor: 'Knowify',
    eyebrow: 'Honest Comparison',
    headline: 'Office-first or field-first?',
    positioning: `Knowify is a capable platform for trade contractors, with real strengths in bidding, contract management, invoicing, and tight QuickBooks integration. SubTrade overlaps on change orders and job costing but leads with the field, the crew on the jobsite.`,
    heroNote: `No credit card required. An honest comparison to help you choose.`,
    shortAnswer: {
      them: [`Choose Knowify if`, `Your priority is the office side, detailed bidding, contracts, invoicing, and deep QuickBooks accounting workflows.`],
      us: [`Choose SubTrade if`, `Your priority is the field, getting crews to clock in, capture change orders, log the day, and see labor cost in real time, with a mobile experience built for the jobsite.`],
    },
    glanceIntro: `Both serve trade contractors. One leads from the office, one leads from the field. Here is how they line up.`,
    table: [
      [`Built for`, `Trade subcontractors, field-first`, `Trade and specialty contractors, office-first`],
      [`Strengths`, `Time tracking, change orders, scheduling, daily logs, drawings`, `Bidding, contracts, invoicing, QuickBooks`],
      [`Mobile / field experience`, `Core focus`, `Available`],
      [`Real-time labor cost & margin`, `Core feature`, `Yes`],
      [`Accounting integration`, `Job costing built in`, `Deep QuickBooks integration`],
      [`Pricing`, `From $299/mo CAD, all-in`, `Tiered, publicly from about $99+/mo`],
      [`Ease for crews`, `High`, `More office-oriented`],
    ],
    tableNote: `Pricing as publicly listed. Confirm current tiers on their site.`,
    winsIntro: `When the bottleneck is the jobsite, the software has to start there.`,
    wins: [
      [`Field-First By Design`, `Your crew opens the app and clocks in, snaps photos, logs the day, and prices change orders on site. No desk required.`],
      [`Change Orders In The Moment`, `Captured before the extra work is done, with GC sign-off, so the revenue does not slip away.`],
      [`Built For The Jobsite`, `Drawings, daily logs, and scheduling designed for the field, not just the office.`],
      [`Real-Time Margin`, `Labor cost and margin per job as the crew works, not at month end.`],
      [`Crews Adopt It`, `Many subs find the field-first approach drives adoption their office-first tool never got.`],
      [`Built By A Real Sub`, `Out of a working commercial drywall company in Calgary. Every feature survived a real jobsite.`],
    ],
    theirWinsTitle: `Where Knowify wins`,
    theirWins: `If your business runs on detailed bids, contracts, and invoicing, and you live in QuickBooks, Knowify's office and accounting workflows are a genuine strength. For contractors who manage the money side closely from the desk, that depth matters.`,
    pricingBody: [
      `Knowify uses tiered pricing publicly starting around $99+ per month depending on features and users. SubTrade is $299 per month CAD all-in with every feature included, a 14-day free trial, and no credit card.`,
      `Compare on what you will actually use: SubTrade bundles the full field and office toolkit in one plan.`,
    ],
    pricingTagline: `Built for the trades, by the trades. Confirm current competitor pricing before relying on these figures.`,
    chooseHeading: `Who should choose SubTrade?`,
    chooseList: [
      `Your bottleneck is the field, not the desk`,
      `Crews, hours, change orders, daily documentation`,
      `You want adoption your office-first tool never got`,
      `You want field and office in one plan`,
    ],
    faq: [
      [`Is SubTrade a good Knowify alternative?`, `Yes, especially if you want a field-first experience your crew adopts, with change orders, scheduling, daily logs, and job costing in one app.`],
      [`Does SubTrade integrate with accounting like Knowify?`, `SubTrade includes built-in job costing. Knowify's standout is deep QuickBooks integration. Choose based on whether your priority is field operations or office accounting.`],
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
