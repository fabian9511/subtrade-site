import WelcomeTrack from '../../../components/WelcomeTrack';

// Where Stripe sends people after they start the card-on-file trial.
export const metadata = {
  title: 'Your SubTrade Trial Has Started',
  description: 'Your 14-day SubTrade trial is active. Create your login to get started.',
  robots: { index: false, follow: false },
};

const SIGNUP = 'https://portal.subtradesoftware.com/signup';

export default function Welcome() {
  return (
    <section className="section fx-result">
      <WelcomeTrack />
      <div className="wrap" style={{ maxWidth: 760 }}>
        <p className="eyebrow">You&rsquo;re in</p>
        <h1 className="display fx-result-title">Your 14-day trial has started</h1>
        <p className="fx-result-sub">
          Nothing was charged today. One last step: create your SubTrade login with the same email you just used.
        </p>
        <a href={SIGNUP} className="btn btn-primary btn-lg">Create my SubTrade login</a>

        <ol className="fx-steps" style={{ marginTop: 48 }}>
          <li><b>Create your login</b><span>Use the same email, so your trial and your account match up.</span></li>
          <li><b>Load one real job</b><span>Not a test. Add the job and the crew working on it.</span></li>
          <li><b>Have your crew clock in tomorrow</b><span>They download the SubTrade app on iPhone or Android and clock in on site.</span></li>
        </ol>

        <p className="fx-fine" style={{ marginTop: 32 }}>
          Your card is only charged when the 14 days are up. Cancel anytime before then and you pay nothing.
          Questions? Email <a href="mailto:support@subtradesoftware.com">support@subtradesoftware.com</a> or{' '}
          <a href="/construction-software-15min-demo/">book 15 minutes with Fabian</a>.
        </p>
      </div>
    </section>
  );
}
