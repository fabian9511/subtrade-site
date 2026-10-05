'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

/**
 * The Facebook-ads funnel on /start/:
 *   1. promise + what SubTrade is (the page itself)
 *   2. register (name, email, phone, company)
 *   3. five qualifying questions, one tap each
 *   4. the result: the video, then book a call (a fit) or start the trial (too small for a call yet)
 *
 * Every answer value matches a GoHighLevel picklist option exactly, because
 * /api/lead writes them straight into the existing custom fields.
 */

const SIGNUP = 'https://portal.subtradesoftware.com/signup';
const BOOKING_ID = '6mmJoUPX6PFLhrOHGt92';

const QUESTIONS = [
  {
    key: 'trade',
    q: 'What trade are you in?',
    options: ['Drywall / Framing', 'Electrical', 'Plumbing', 'HVAC / Mechanical', 'Concrete Forming', 'Painting', 'General Contractor', 'Other'],
  },
  {
    key: 'employees',
    q: 'How many people work for you, office and field?',
    options: ['1-5', '6-10', '11-20', '21-50', '50+'],
  },
  {
    key: 'volume',
    q: 'Roughly how much work do you do a year?',
    options: ['$0 - 299K', '$300 - 599K', '$600 - 999K', '$1 - 2.99M', '$3 - 5.99M', '$6M +'],
  },
  {
    key: 'current',
    q: 'How do you run your jobs today?',
    options: [
      ['Pen & Paper', 'Paper, whiteboard, texts'],
      ['SpreadSheets', 'Spreadsheets'],
      ['Another Construction Software', 'Another construction software'],
    ],
  },
  {
    key: 'timeline',
    q: 'When do you want a better system in place?',
    options: [
      ['Immediately', 'Right away'],
      ['1-3 months', 'In the next 1 to 3 months'],
      ['6+ Months', 'Just looking for now'],
    ],
  },
];

// A 15-minute call is worth it for companies with a crew to run or real volume.
// Everyone else gets the trial, which is the full product anyway.
function isQualified(a) {
  const smallCrew = a.employees === '1-5';
  const smallVolume = a.volume === '$0 - 299K' || a.volume === '$300 - 599K';
  return !(smallCrew && smallVolume);
}

const track = (...args) => {
  try {
    window.fbq && window.fbq(...args);
  } catch {}
};

const save = (payload) =>
  fetch('/api/lead/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});

const STORE = 'subtrade-start-funnel';

export default function Funnel() {
  const [stage, setStage] = useState('register'); // register | questions | result
  const [lead, setLead] = useState({ firstName: '', lastName: '', email: '', phone: '', company: '', website: '' });
  const [answers, setAnswers] = useState({});
  const [qi, setQi] = useState(0);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const cardRef = useRef(null);

  // Pick up where they left off after a refresh.
  useEffect(() => {
    try {
      const s = JSON.parse(sessionStorage.getItem(STORE) || 'null');
      if (s?.stage) {
        setStage(s.stage);
        setLead((l) => ({ ...l, ...s.lead }));
        setAnswers(s.answers || {});
        setQi(s.qi || 0);
      }
    } catch {}
  }, []);
  useEffect(() => {
    try {
      sessionStorage.setItem(STORE, JSON.stringify({ stage, lead: { ...lead, website: '' }, answers, qi }));
    } catch {}
  }, [stage, lead, answers, qi]);

  // Each new question can be shorter than the last, so keep the card's top in view.
  useEffect(() => {
    if (stage !== 'questions') return;
    const top = cardRef.current?.getBoundingClientRect().top;
    if (top !== undefined && top < 80) cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [stage, qi]);

  useEffect(() => {
    if (stage === 'result') window.scrollTo(0, 0);
  }, [stage]);

  const toForm = () => cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  async function register(e) {
    e.preventDefault();
    setError('');
    if (!lead.firstName.trim()) return setError('Please add your first name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email.trim())) return setError('Please check your email address.');
    if (lead.phone.replace(/\D/g, '').length < 10) return setError('Please add a phone number we can reach you on.');
    setBusy(true);
    await save({ ...lead, stage: 'registered' });
    setBusy(false);
    track('track', 'Lead', { content_name: 'SubTrade /start register' });
    setStage('questions');
  }

  function answer(key, value) {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    if (qi < QUESTIONS.length - 1) {
      setQi(qi + 1);
      return;
    }
    const qualified = isQualified(next);
    save({ ...lead, answers: next, stage: qualified ? 'qualified' : 'trial' });
    track('track', 'CompleteRegistration', { content_name: 'SubTrade /start questions', status: qualified ? 'qualified' : 'trial' });
    setStage('result');
  }

  if (stage === 'result') return <Result name={lead.firstName} qualified={isQualified(answers)} />;

  return (
    <>
      {/* ---------- 1. the promise ---------- */}
      <section className="hero fx-hero">
        <div className="wrap fx-hero-grid">
          <div>
            <p className="eyebrow">For subcontractors who run crews</p>
            <h1 className="display">
              Stop chasing paper.
              <br />
              <em>Get paid for every hour and every extra.</em>
            </h1>
            <p className="lede">
              SubTrade puts your crews, time sheets, change orders and progress billing in one app, so the
              hours your guys work and the extras they do actually make it onto the invoice.
            </p>
            <ul className="fx-ticks">
              <li>GPS clock-ins from the phone, time sheets done for you</li>
              <li>Change orders signed in the field, before the work starts</li>
              <li>Progress claims with holdback, built from the job</li>
            </ul>
            <p className="hero-note">Built by a Calgary drywall contractor. $299/month CAD, 5 users included.</p>
            <button type="button" className="btn btn-primary btn-lg fx-jump" onClick={toForm}>
              See if it fits my company
            </button>
          </div>

          {/* ---------- 2 + 3. register, then qualify ---------- */}
          <div className="fx-card" ref={cardRef} id="get-started">
            {stage === 'register' ? (
              <form onSubmit={register} noValidate>
                <p className="fx-step mono">Step 1 of 2</p>
                <h2 className="display fx-card-title">See if SubTrade fits your company</h2>
                <p className="fx-card-sub">Two minutes. Then watch how it works and grab a time with us.</p>
                <div className="fx-row">
                  <Field label="First name" value={lead.firstName} onChange={(v) => setLead({ ...lead, firstName: v })} autoComplete="given-name" />
                  <Field label="Last name" value={lead.lastName} onChange={(v) => setLead({ ...lead, lastName: v })} autoComplete="family-name" />
                </div>
                <Field label="Work email" type="email" value={lead.email} onChange={(v) => setLead({ ...lead, email: v })} autoComplete="email" />
                <Field label="Mobile phone" type="tel" value={lead.phone} onChange={(v) => setLead({ ...lead, phone: v })} autoComplete="tel" />
                <Field label="Company name" value={lead.company} onChange={(v) => setLead({ ...lead, company: v })} autoComplete="organization" />
                <input
                  className="fx-hp"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={lead.website}
                  onChange={(e) => setLead({ ...lead, website: e.target.value })}
                />
                {error && <p className="fx-error" role="alert">{error}</p>}
                <button className="btn btn-primary btn-lg fx-submit" disabled={busy}>
                  {busy ? 'One second…' : 'Continue'}
                </button>
                <p className="fx-fine">
                  By continuing you agree we can call, text or email you about SubTrade. No spam, unsubscribe anytime.
                  See our <a href="/privacy-policy/">privacy policy</a>.
                </p>
              </form>
            ) : (
              <div>
                <p className="fx-step mono">
                  Step 2 of 2 · Question {qi + 1} of {QUESTIONS.length}
                </p>
                <div className="fx-progress" aria-hidden="true">
                  <span style={{ width: `${((qi + 1) / QUESTIONS.length) * 100}%` }} />
                </div>
                <h2 className="display fx-card-title">{QUESTIONS[qi].q}</h2>
                <div className="fx-options">
                  {QUESTIONS[qi].options.map((o) => {
                    const [value, label] = Array.isArray(o) ? o : [o, o];
                    return (
                      <button
                        key={value}
                        type="button"
                        className={`fx-option${answers[QUESTIONS[qi].key] === value ? ' is-on' : ''}`}
                        onClick={() => answer(QUESTIONS[qi].key, value)}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                {qi > 0 && (
                  <button type="button" className="fx-back" onClick={() => setQi(qi - 1)}>
                    ← Back
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="wrap"><div className="chalkline" /></div>

      {/* ---------- the problem ---------- */}
      <section className="section">
        <div className="wrap fx-split">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <p className="eyebrow">Sound familiar?</p>
            <h2 className="display">The money leaks out between the field and the office</h2>
            <p>
              Hours written on a scrap of paper. An extra the GC asked for on a Tuesday that nobody wrote up.
              A progress claim built from memory at 10 PM. Every one of those is money you earned and never billed.
            </p>
          </div>
          <img
            src="/unsigned-change-order-recovery-foreman-tablet.webp"
            alt="Foreman on a jobsite reviewing an unsigned change order on a tablet"
            className="fx-photo"
            loading="lazy"
          />
        </div>
      </section>

      {/* ---------- what SubTrade is ---------- */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">What you get</p>
            <h2 className="display">One app from the first clock-in to the final claim</h2>
            <p>Your foremen use it on their phones. You run the company from the office. No feature tiers, everything is included.</p>
          </div>
          <div className="fx-features">
            {[
              ['/subtrade-gps-time-tracking-clock-in.webp', 'GPS time tracking', 'Crews clock in on site from their phone. Time sheets and job costs fill themselves in.', 'Worker clocking in on a jobsite with GPS time tracking in the SubTrade app'],
              ['/subtrade-change-order-from-the-field.webp', 'Change orders', 'Write it up and get it signed on the spot, with photos, before the extra work starts.', 'Foreman creating a change order from the field in SubTrade'],
              ['/subtrade-schedule-of-values-progress-billing.webp', 'Progress billing', 'Schedule of values, holdback and approved change orders, rolled into the claim for you.', 'SubTrade progress billing screen with schedule of values and holdback'],
              ['/subtrade-crew-scheduling-jobsite.webp', 'Crew scheduling', 'See who is on which job this week and move people around in seconds.', 'Crew scheduling across jobsites in SubTrade'],
              ['/subtrade-daily-log-foreman-end-of-day.webp', 'Daily logs & photos', 'GPS-tagged photos and daily logs filed to the right job, ready when there is a dispute.', 'Foreman filing an end-of-day daily log in SubTrade'],
              ['/subtrade-dashboard-job-costing.webp', 'Job costing', 'Budget against actual on every job while it is still running, not after it is over.', 'SubTrade job costing dashboard showing budget versus actual'],
            ].map(([src, title, text, alt]) => (
              <article key={title} className="fx-feature">
                <img src={src} alt={alt} loading="lazy" />
                <h3 className="display">{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- who built it ---------- */}
      <section className="section">
        <div className="wrap fx-split">
          <img
            src="/fabian-vargas-garcia-subtrade-cofounder.webp"
            alt="Fabian Vargas Garcia, SubTrade co-founder and president of a Calgary commercial drywall company"
            className="fx-photo"
            loading="lazy"
          />
          <div className="section-head" style={{ marginBottom: 0 }}>
            <p className="eyebrow">Built on jobsites, not in boardrooms</p>
            <h2 className="display">Made by a sub, for subs</h2>
            <p>
              SubTrade was built by Fabian Vargas Garcia, who runs a commercial drywall company in Calgary, after
              years of using software made for general contractors. It is built around how a subcontractor actually
              gets paid: hours, extras, and progress claims with holdback.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- how it works ---------- */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">What happens next</p>
            <h2 className="display">Three steps, about 20 minutes of your time</h2>
          </div>
          <ol className="fx-steps">
            <li><b>Answer 5 quick questions</b><span>So we know your trade, crew size and how you run jobs today.</span></li>
            <li><b>Watch the short video</b><span>See SubTrade working on a real job before you talk to anyone.</span></li>
            <li><b>Book a 15-minute call</b><span>A screen share with someone who runs construction jobs, set up around your company.</span></li>
          </ol>
          <div style={{ marginTop: 40 }}>
            <button type="button" className="btn btn-primary btn-lg" onClick={toForm}>See if it fits my company</button>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="section">
        <div className="wrap" style={{ maxWidth: 820 }}>
          <div className="section-head">
            <p className="eyebrow">Questions</p>
            <h2 className="display">Straight answers</h2>
          </div>
          <div className="fx-faq">
            {[
              ['How much does it cost?', '$299/month CAD with 5 users included. Extra users are $4 to $15 each, and paying yearly saves 20%. The price is on our pricing page, no sales call needed to find it out.'],
              ['Which trades is it for?', 'Subcontractors running crews: drywall, framing, electrical, plumbing, HVAC, painting, concrete and more.'],
              ['Will my guys actually use it?', 'Clocking in, taking photos and filling a form are all one tap from the phone app (iPhone and Android).'],
              ['Can I try it first?', 'Yes. The free trial is the full platform, and you can cancel anytime during the trial and pay nothing.'],
            ].map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap">
          <h2 className="display">Every hour and every extra, billed</h2>
          <p>Two minutes to see if SubTrade fits your company.</p>
          <button type="button" className="btn btn-primary btn-lg" onClick={toForm}>Get started</button>
        </div>
      </section>
    </>
  );
}

function Field({ label, type = 'text', value, onChange, autoComplete }) {
  return (
    <label className="fx-field">
      <span>{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} />
    </label>
  );
}

/* ---------- 4. the result: video, then book a call or start the trial ---------- */
function Result({ name, qualified }) {
  return (
    <section className="section fx-result">
      <div className="wrap" style={{ maxWidth: 900 }}>
        <p className="eyebrow">{qualified ? 'You are a good fit' : 'You are all set'}</p>
        <h1 className="display fx-result-title">
          {name ? `Thanks, ${name}. ` : ''}Watch this first
        </h1>
        <p className="fx-result-sub">
          {qualified
            ? 'See how SubTrade runs a job from clock-in to progress claim, then pick a time below for a 15-minute call.'
            : 'See how SubTrade runs a job from clock-in to progress claim. Then start your free trial and load a real project.'}
        </p>

        <video
          className="fx-vsl"
          src="/vsl/subtrade-why.mp4"
          poster="/vsl/subtrade-why-poster.webp"
          controls
          playsInline
          preload="metadata"
        />

        {qualified ? (
          <>
            <h2 className="display fx-book-title">Book your 15-minute call</h2>
            <p className="fx-result-sub">Screen share, your questions, your trade. No pitch deck.</p>
            <div className="fx-booking">
              <iframe
                src={`https://api.leadconnectorhq.com/widget/booking/${BOOKING_ID}`}
                id={`${BOOKING_ID}_booking`}
                title="Book a SubTrade call"
                scrolling="no"
              />
            </div>
            <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="lazyOnload" />
            <p className="fx-fine" style={{ textAlign: 'center' }}>
              Rather just try it? <a href={SIGNUP}>Start the free trial</a>.
            </p>
          </>
        ) : (
          <div className="fx-trial">
            <a href={SIGNUP} className="btn btn-primary btn-lg" onClick={() => track('track', 'StartTrial')}>
              Start my free trial
            </a>
            <p className="fx-fine">Full platform, cancel anytime during the trial and pay nothing.</p>
            <p className="fx-fine">
              Want to talk it through first? <a href="/construction-software-15min-demo/">Book a 15-minute call</a>.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
