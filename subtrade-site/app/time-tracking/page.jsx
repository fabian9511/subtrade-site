import RichFeature from '../../components/RichFeature';
import { breadcrumbs } from '../../lib/breadcrumbs';
import { timeTrackingRich } from '../../lib/data';

export const metadata = {
  alternates: { canonical: '/time-tracking/' },
  title: 'GPS Time Tracking for Construction Crews | SubTrade',
  description:
    'GPS time tracking built for construction: crews clock in from their phones, hours land on the right job and cost code, and payroll prep takes minutes. Free trial.',
};

const crumbs = breadcrumbs([['Time Tracking', '/time-tracking/']]);

export default function TimeTrackingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      <RichFeature f={timeTrackingRich} />
    </>
  );
}
