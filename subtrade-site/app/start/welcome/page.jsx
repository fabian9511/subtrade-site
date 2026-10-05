import WelcomeTrack from '../../../components/WelcomeTrack';
import WelcomeSummary from '../../../components/WelcomeSummary';
import SignupButton from '../../../components/SignupButton';

// Where Stripe sends people after they start the card-on-file trial.
export const metadata = {
  title: 'Your SubTrade Trial Has Started',
  description: 'Your 14-day SubTrade trial is active. Create your login to get started.',
  robots: { index: false, follow: false },
};


export default function Welcome() {
  return (
    <section className="section fx-result">
      <WelcomeTrack />
      <div className="wrap fx-welcome">
        <p className="eyebrow">You&rsquo;re in</p>
        <h1 className="display fx-result-title">Your 14-day free trial has started</h1>
        <p className="fx-result-sub">
          Nothing was charged today. You&rsquo;re also registered for SubTrade onboarding: step-by-step tutorial emails over the next two weeks and a
          free setup session with our team, so your first job is running before the trial ends.
        </p>

        <div className="fx-welcome-grid">
          <WelcomeSummary />

          <div className="fx-welcome-next">
            <p className="eyebrow">Your onboarding</p>
            <ol className="fx-onboard">
              <li>
                <b>Create your SubTrade login</b>
                <span>Use the same email you just used, so your trial and your account match up.</span>
                <SignupButton className="btn btn-primary btn-lg">Create my login</SignupButton>
              </li>
              <li>
                <b>Book your free onboarding session</b>
                <span>15 minutes on a screen share. We walk you through setting up your company, your crew and your first job.</span>
                <a href="/construction-software-15min-demo/" className="fx-onboard-link">Pick a time →</a>
              </li>
              <li>
                <b>Follow the tutorials</b>
                <span>Short how-to guides for every part of SubTrade: jobs, crews, time tracking, change orders and billing.</span>
                <a href="/how-to-tutorials/" className="fx-onboard-link">Open the tutorials →</a>
              </li>
              <li>
                <b>Have your crew clock in</b>
                <span>They download the SubTrade app on iPhone or Android and clock in on site. That&rsquo;s when it clicks.</span>
              </li>
            </ol>
          </div>
        </div>

        <p className="fx-fine" style={{ marginTop: 36 }}>
          Questions at any point? Email <a href="mailto:support@subtradesoftware.com">support@subtradesoftware.com</a>.
          To see your plan, update your card or cancel, go to <a href="/billing/">subtradesoftware.com/billing</a>.
          See our <a href="/fair-billing-policy/">Fair Billing Policy</a>.
        </p>
      </div>
    </section>
  );
}
