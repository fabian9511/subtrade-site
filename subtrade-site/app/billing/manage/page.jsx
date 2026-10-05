import { BillingManage } from '../../../components/Billing';

export const metadata = {
  title: 'Your Subscription',
  description: 'Your SubTrade subscription.',
  robots: { index: false, follow: false },
};

export default function BillingManagePage() {
  return (
    <section className="section fx-result">
      <div className="wrap bl-wide">
        <p className="eyebrow">Your account</p>
        <h1 className="display fx-result-title">Your SubTrade subscription</h1>
        <BillingManage />
      </div>
    </section>
  );
}
