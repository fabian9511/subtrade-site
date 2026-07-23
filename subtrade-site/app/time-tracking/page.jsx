import RichFeature from '../../components/RichFeature';
import { timeTrackingRich } from '../../lib/data';

export const metadata = {
  title: 'GPS Time Tracking for Construction Crews | SubTrade',
  description:
    'GPS time tracking built for construction: crews clock in from their phones, hours land on the right job and cost code, and payroll prep takes minutes. Free trial.',
};

export default function TimeTrackingPage() {
  return <RichFeature f={timeTrackingRich} />;
}
