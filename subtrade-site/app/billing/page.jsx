import { BillingRequest } from '../../components/Billing';

export const metadata = {
  title: 'Manage Your Subscription',
  description: 'See your SubTrade plan, update your card or cancel your subscription.',
  alternates: { canonical: '/billing/' },
  robots: { index: false, follow: false },
};

export default function BillingPage() {
  return (
    <section className="section fx-result">
      <div className="wrap bl-wrap">
        <p className="eyebrow">Billing</p>
        <h1 className="display fx-result-title">Manage your subscription</h1>
        <p className="fx-result-sub">See your plan and next charge, update your card, or cancel. Enter the email you subscribed with and we&rsquo;ll send you a secure link.</p>
        <BillingRequest />
      </div>
    </section>
  );
}
