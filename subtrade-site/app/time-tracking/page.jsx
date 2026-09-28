import RichFeature from '../../components/RichFeature';
import { timeTrackingRich } from '../../lib/data';
import TutorialStrip from '../../components/TutorialStrip';

export const metadata = {
  title: 'GPS Time Tracking for Construction Crews | SubTrade',
  description:
    'GPS time tracking built for construction: crews clock in from their phones, hours land on the right job and cost code, and payroll prep takes minutes. Free trial.',
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
