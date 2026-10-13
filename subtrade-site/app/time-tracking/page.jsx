import RichFeature from '../../components/RichFeature';
import { timeTrackingRich } from '../../lib/data';
import TutorialStrip from '../../components/TutorialStrip';

export const metadata = {
  alternates: { canonical: '/time-tracking/' },
  title: 'GPS Time Tracking for Construction Crews | SubTrade',
  description:
    'GPS time tracking for construction crews: phone clock-ins checked on site, one-click timesheet approvals, overtime flagged, CSV export for payroll. Free trial.',
};

export default function TimeTrackingPage() {
  return (
    <>
      <RichFeature f={timeTrackingRich} />
      <TutorialStrip
        slugs={['workflow-efficiency-with-employee-time-sheets', 'time-tracking-approval-and-the-time-splitting', 'manage-time-tracking-and-approvals', 'setup-new-employees-fast-in-subtrade-software']}
        eyebrow="Video tutorials"
        title="See time tracking in the app"
        intro="Short walkthroughs from the SubTrade team, each with a PDF guide your office can keep."
      />
    </>
  );
}
