---
title: "Subcontractor dashboards: what to track"
description: "What a subcontractor dashboard should show, which numbers predict a bad job, and how to see every active site without another spreadsheet."
blurb: "Twenty active jobs, two people in the office. The four numbers a sub's dashboard has to surface before Thursday — and the ones that are just decoration."
tag: "Choosing software"
date: "2026-08-02"
image: "/subcontractor-dashboard-software-foreman-tablet.webp"
imageAlt: "A construction supervisor reviewing job data on a tablet in a site trailer, with drawings and a laptop on the desk beside him."
---

Most subcontractor dashboards fail the same way. They show you what already happened, beautifully, three weeks after you could have done something about it.

A general contractor's dashboard is built for depth on one project — schedule, RFIs, submittals, the owner's draw. A sub trade needs the opposite shape: breadth across twenty-five active jobs at once, with enough detail on each to know which one is quietly bleeding. Those are different products, and the second one is much rarer.

We built ours inside a commercial drywall contractor in Calgary, Alberta, after years of running the real numbers in Excel on Sunday nights. Here's what we learned belongs on the screen — and what doesn't.

## The visibility problem, stated honestly

A sub trade with twenty active jobs and two office staff has a specific failure mode. Nobody is looking at job number fourteen. It isn't the biggest, it isn't the newest, and it isn't on fire yet. So it gets attention when the foreman calls, which is usually the week after the labour overrun became unrecoverable.

The purpose of a dashboard isn't to display data. It's to make job fourteen raise its hand on its own.

That means the design question is not "what can we show?" but "what would have caught the last job that went sideways, and when?"

## The four numbers that actually predict a bad job

Everything else is context. These four are the spine.

### 1. Installed cost per unit, this week versus the bid

Not total spend. Not percent complete. The unit rate you're achieving right now against the unit rate you priced. Board hung per man-hour, devices per unit, square feet per shift — whatever your trade measures in.

This is the earliest warning signal that exists. A job can be on schedule and under total budget and still be losing money, because you're burning hours faster than you're installing work. Total spend won't show that until the money's gone.

### 2. Labour hours by cost code, updated daily

Hours are the sub trade's raw material and the only cost you can still influence mid-job. If your hours arrive as a timesheet retyped on Monday morning, your dashboard is always three to seven days stale — which is exactly long enough for a bad week to become a bad month.

This is why field-captured [time tracking](/time-tracking/) is the foundation of a sub's system rather than a module you add later. The dashboard is only as fresh as the clock-in.

### 3. Unsigned change orders, with age

Most subs lose more margin to unsigned extras than to bad estimating. The number that matters isn't how many change orders you've submitted — it's the dollar value of work you've already performed that nobody has approved, sorted by how long it's been sitting.

An extra that's 40 days old is a different problem from one that's 4 days old, and a dashboard that shows them as the same line is hiding the thing you needed to see. Sub-side [change order management](/construction-management-features/change-order-management/) has to track direction, date, photo, and status until signature — not just submission.

### 4. Billed versus earned, plus holdback

What you've installed, what you've invoiced, and what's being held. Holdback accumulates quietly across every job and becomes the single largest receivable most sub trades carry. If you can't see it per job and in total, you're managing cash flow blind. Our [holdback calculator](/construction-holdback-calculator/) covers the statutory rates across five Canadian provinces, and the [retainage calculator](/construction-retainage-calculator/) handles all fifty US states plus DC.

## What belongs on a portfolio view versus a job view

Two screens, two jobs to do.

**The portfolio view** answers one question: which of my active jobs needs me this week? It should fit on one screen, list every active job, and sort by exception rather than alphabetically. Green, amber, red on labour variance. Unsigned extras by age. Nothing else. If you have to scroll, it's a report, not a dashboard.

**The job view** answers: what exactly is going wrong here? Hours by cost code against budget, crew on site, daily logs, photos, open extras, billing to date. This is where you dig in after the portfolio view raised its hand.

The common design mistake is building one screen that tries to do both — usually a dense grid of every metric for every job. It looks impressive in a demo and gets ignored by week three.

## The metrics that are mostly decoration

Worth saying plainly, because they take up the best real estate on most platforms:

**Percent complete.** Self-reported, lagging, and easy to be wrong about in the direction that feels good. Useful for billing, near-useless as a warning signal.

**Total spend to date.** Tells you the money's gone. Doesn't tell you whether it bought the right amount of work.

**Task counts and open items.** Activity, not outcome. A dashboard full of task counters measures how busy the office is.

**Gantt charts of the GC's schedule.** You don't control it, and it's already in the GC's platform. Read it there.

**Safety and PPE tracking by trade.** Genuinely important, and a real question people ask — but it belongs on its own screen with your [safety forms](/construction-management-features/safety-custom-forms/) and daily logs, not competing for space with the numbers that predict margin. Compliance and profitability are both worth watching; mixing them on one screen means neither gets looked at properly.

## What to ask a vendor before you buy

Two questions cut through most demos.

**"Show me a job going bad."** Not the polished sample project where everything is green. Ask them to show you what the screen looks like on a job that's 12% over on labour in week three — and ask how you would have known. If the answer involves running a report or exporting to Excel, the dashboard isn't doing the work.

**"How does today's field labour get here?"** Trace it backwards from the dashboard to the foreman's phone. Every manual step in that chain is a day of staleness and a chance for the number to be wrong. A dashboard fed by retyped timesheets is a very expensive rear-view mirror.

It's also worth checking the seat-count math before you fall in love with anything. Per-seat pricing built for GC office staff turns ugly fast when you have fourteen field guys who each need to do exactly three things. When licences get rationed, half the crew stays on paper — and the dashboard goes stale at the source.

## The honest test

Take your worst job from the last two years. The one that went sideways. Sit with the vendor and ask them to show you, in their product, the screen where you'd have caught it — and in which week.

If they can do it, and the answer is week three rather than month three, the dashboard is real.

SubTrade [starts at $299/month CAD](/pricing-plans/) with a 14-day free trial and no credit card required, so you can run that test on your own jobs rather than theirs. You can also see how the pieces fit together in our [construction management features](/construction-management-features/), or compare us directly against [Procore](/compare/subtrade-vs-procore/), [Knowify](/compare/subtrade-vs-knowify/) and [eSUB](/compare/subtrade-vs-esub/).

## FAQ

**What tool provides subcontractor dashboards?**

Purpose-built subcontractor platforms — SubTrade, eSUB, Knowify — provide dashboards organized around crews and cost codes. General contractor platforms such as Procore provide dashboards too, but they're organized around a single project, which is a poor fit for a sub trade running many jobs at once.

**What should a subcontractor dashboard show?**

Four things above all: installed cost per unit against bid, labour hours by cost code updated daily, unsigned change orders sorted by age, and billed versus earned including holdback. Everything else is supporting context.

**How do I get visibility across all my active jobs?**

Use a portfolio view that lists every active job sorted by exception rather than by name, with labour variance and unsigned extras as the flags. The goal is for a problem job to surface itself rather than waiting for a phone call.

**What's the best system for subcontractor oversight?**

The one whose numbers are fed directly from the field rather than retyped in the office. Oversight quality is determined almost entirely by data freshness — a beautiful dashboard fed by Monday-morning timesheets is always several days behind the problem.

**How often should the data update?**

Daily, at minimum, for labour. Anything slower and you're finding out about a bad week after it's finished.

**Do I need a dashboard if I only run a few jobs?**

Less urgently. The case for a portfolio view scales with job count — under about five active jobs most owners genuinely do carry it in their head. Past ten, something is always being missed.
