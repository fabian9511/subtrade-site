// Each tutorial lives at /tutorials/<slug> matching the old WordPress URLs.
// videoId: the YouTube video ID (the part after v= or youtu.be/).
// Fill in each videoId before launch; pages render a link to the channel until then.
// pdf (optional): path to a PDF guide in /public/guides/. Adds a download button
// on the tutorial page and a "PDF guide" tag on the card.
export const tutorials = [
  {
    slug: 'how-to-create-a-project-subtrade-software',
    title: 'Project dashboard and templates',
    blurb: 'Run every job from one screen and start each new one from a template.',
    videoId: 'OUYpHYuhJ2w',
    pdf: '/guides/subtrade-project-dashboard-guide.pdf',
    content: {
      lead: `Every job you're running sits on one Projects page. This walkthrough shows how to read a project card, create a new job in a couple of minutes, and build templates so every job of the same type starts set up the way you work.`,
      learnTitle: `In this tutorial you'll learn how to:`,
      learn: [
        `Switch between active and archived jobs and search any project by name`,
        `Read a project card: progress, tasks, team, dates and status`,
        `Create a project with customer, crew, job site address and schedule`,
        `Build a template per job type with tasks, priority, start and due days`,
        `Load default team members, drawing folders and forms into a template`,
        `Set the statuses for tasks, RFIs, change orders and POs`,
      ],
      body: [
        `Leave the project code blank and SubTrade numbers the job for you. Archive a job when it wraps up and your active list stays clean.`,
        `Want it on paper? Download the PDF guide below and hand it to your PMs and supervisors.`,
      ],
    },
  },
  {
    slug: 'setup-new-employees-fast-in-subtrade-software',
    title: 'Set up new employees fast',
    blurb: 'Add crew members and get them clocking in the same day.',
    videoId: '9k-B3G5IFKc',
  },
  {
    slug: 'workflow-efficiency-with-employee-time-sheets',
    title: 'Employee time sheets workflow',
    blurb: 'Review, correct and approve crew hours without the Friday detective work.',
    videoId: 'yadJ0PqzO5k',
    pdf: '/guides/subtrade-timesheet-guide.pdf',
    content: {
      lead: `Every hour your crew clocks lands on one Timesheet page. This walkthrough shows how to review those hours, approve them before payroll, and check who was actually on site, without chasing anyone down on Friday.`,
      learnTitle: `In this tutorial you'll learn how to:`,
      learn: [
        `Filter hours by pay period, project or employee, and export them to CSV`,
        `Read the totals: gross hours, breaks, payable hours and labour cost`,
        `Approve or reject time before it reaches payroll`,
        `Fix or stop a running timer when someone forgets to clock out`,
        `Check each worker's pay period totals and every entry behind them`,
        `See whether a punch was on site or off site, with the exact pin on a map`,
      ],
      body: [
        `Pending Approvals is a company setting. Turn it on in Company Settings when you want a supervisor to sign off on hours before they count toward payroll.`,
        `Want it on paper? Download the PDF guide below and hand it to your supervisors.`,
      ],
    },
  },
  {
    slug: 'time-tracking-approval-and-the-time-splitting',
    title: 'Time tracking approval and time splitting',
    blurb: 'Approve time and split hours across jobs and cost codes.',
    videoId: 'VYoNEFi7GqU',
  },
  {
    slug: 'manage-change-orders-subtrade-software',
    title: 'Manage change orders',
    blurb: 'Create, price, send and track change orders from the field.',
    videoId: 'gSl3P6ZYrlM',
  },
  {
    slug: 'purchase-orders-approval',
    title: 'Purchase orders and approval',
    blurb: 'Create POs from the field and run them through approval.',
    videoId: 'TOlQrawWAaE',
    content: {
      lead: `Learn how to set up and manage the full purchase order approval workflow in SubTrade — from configuring company settings to collecting signatures and sending approved POs.`,
      learnTitle: `In this tutorial you'll learn how to:`,
      learn: [
        `Enable purchase order approvals in your company settings`,
        `Assign an approver to your PO workflow`,
        `Create a purchase order inside a project`,
        `Request approval and manage signature requests`,
        `Confirm signatures and send approved purchase orders`,
      ],
      body: [
        `SubTrade is built specifically for trade subcontractors — drywall, electrical, plumbing, HVAC, roofing, and more. Stop chasing paper approvals and run your jobs with a system that actually fits how you work in the field.`,
      ],
    },
  },
  {
    slug: 'subtrade-tutorial-auto-naming-construction-drawings',
    title: 'Auto-naming construction drawings',
    blurb: 'Upload a drawing set and let SubTrade name and organize the sheets.',
    videoId: '6Sl9PQ5N92k',
  },
  {
    slug: 'crew-scheduling-subtrade-software',
    title: 'Crew scheduling',
    blurb: 'Book your crew for the week, repeat shifts and catch double-bookings.',
    videoId: 'MxCJSzEnXL4',
    pdf: '/guides/subtrade-scheduling-guide.pdf',
    content: {
      lead: `The Schedule shows your whole crew for the week: who's working, what hours, and on which job. This walkthrough shows how to book shifts fast and keep anyone from getting double-booked.`,
      learnTitle: `In this tutorial you'll learn how to:`,
      learn: [
        `Read the week at a glance: total scheduled hours, the week scroller and daily or weekly view`,
        `Filter the schedule by employee or by project`,
        `Book one worker or a whole crew in a single shift`,
        `Repeat a shift across several days and skip weekends automatically`,
        `Use the Morning, Afternoon, All Day and Night presets, or set custom and overnight hours`,
        `Assign the project, task and notes, and let SubTrade skip any shift that clashes`,
      ],
      body: [
        `Book next week's shifts before Friday and your crew sees where they're going on their phone.`,
        `Want it on paper? Download the PDF guide below and hand it to your supervisors.`,
      ],
    },
  },
  {
    slug: 'scheduling-feature-workflow-construction-drawings-upload',
    title: 'Scheduling workflow and drawings upload',
    blurb: 'Schedule crews and attach the right drawings to the right job.',
    videoId: '5prhlCrc0BU',
  },
  {
    slug: 'custom-notifications',
    title: 'Custom notifications',
    blurb: 'Choose what your crew and office get notified about, and when.',
    videoId: 'P7cCwB33_QQ',
  },
  {
    slug: 'manage-time-tracking-and-approvals',
    title: 'Manage time tracking and approvals',
    blurb: 'Run the full time tracking workflow from clock-in to approval.',
    videoId: '0R906kMBrCc',
  },
  {
    slug: 'creating-and-submitting-a-daily-report',
    title: 'Create and submit a daily report',
    blurb: 'File a detailed daily report with weather, manpower and photos.',
    videoId: 'YiYaNBgRVRY',
    content: {
      lead: `Learn how to create and submit a daily report in SubTrade Software, step by step. This tutorial walks you through the complete daily reporting workflow, from logging general notes and site conditions to tracking manpower, equipment, materials, and activity progress.`,
    },
  },
  {
    slug: 'introducing-field-operations',
    title: 'Introducing Field Operations',
    blurb: 'A tour of the Field Operations dashboard: live crews, alerts and sites.',
    videoId: '8eddsG-K56Y',
    content: {
      lead: `We just dropped something big. Introducing Field Operations: one screen that shows you everything happening across all your active jobs, right now.`,
      learnTitle: `What Field Operations gives you:`,
      learn: [
        `Priority alerts ranked by what needs action first`,
        `Live job site map — see who's on site, who's late, who didn't show up`,
        `Crew status per site in real time`,
        `Change orders, timesheets and signatures waiting on you`,
        `Full 7-day manpower view across every project`,
      ],
      body: [
        `No more jumping between jobs to figure out what's on fire. It's all in one place, and it's live today for every SubTrade account, at no extra cost.`,
      ],
    },
  },
];
