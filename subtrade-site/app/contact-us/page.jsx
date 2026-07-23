export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with SubTrade Software. Support, sales and general questions.',
};

export default function Contact() {
  return (
    <section className="section" style={{ paddingTop: 100 }}>
      <div className="wrap prose">
        <p className="eyebrow">SubTrade Software Ltd.</p>
        <h1 className="display">Contact us</h1>
        <p className="big">Real people, Calgary-based, jobsite hours.</p>
        <p>
          Support and general questions:{' '}
          <a href="mailto:support@subtradesoftware.com" style={{ color: 'var(--chalk)' }}>
            support@subtradesoftware.com
          </a>
        </p>
        <p>
          Existing customers can also reach support directly inside the app,
          which is the fastest path to a fix.
        </p>
      </div>
    </section>
  );
}
