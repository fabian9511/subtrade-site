export const metadata = {
  title: 'About',
  description:
    'SubTrade was built by Fabian Vargas Garcia, president of a Calgary commercial drywall company, after years of using field software designed for GCs instead of subs.',
};

const PORTAL = 'https://portal.subtradesoftware.com';
const SIGNUP = 'https://portal.subtradesoftware.com/signup';

export default function About() {
  return (
    <>
      <section className="section" style={{ paddingTop: 100 }}>
        <div className="wrap prose">
          <p className="eyebrow">Why SubTrade began</p>
          <h1 className="display">
            Built between
            <br />
            site visits
          </h1>
          <p className="big">
            SubTrade was not started by a tech company that discovered
            construction. It was started by a subcontractor who got tired of
            software that had never met one.
          </p>
          <p>
            Fabian runs Quality Gypsum Services, a commercial
            drywall and steel stud subcontractor in Calgary. Estimating,
            supervising, chasing draws, managing crews across multiple sites.
            The same week-to-week reality as every sub reading this page.
          </p>
          <p>
            The field management tools on the market were all built for general
            contractors. Priced for GC budgets, designed around GC workflows,
            with subcontractors treated as an afterthought seat license. The
            things that actually protect a sub's margin, like getting change
            orders signed before the work happens or building a progress draw
            with correct holdback, were either missing or buried.
          </p>
          <p>
            So SubTrade got built, feature by feature, against real jobs. Fabian
            brought the problem and the jobsites; his co-founder Steban Vargas, a
            senior software developer, saw the idea and made it real, turning
            field frustrations into working software. Every tool shipped because
            a working subcontracting business needed it on an actual project
            first, and when something was clumsy in the field, it got fixed,
            because the founders' own crews were the first ones stuck using it.
          </p>
          <p>
            That is still how it works today. Fabian still estimates and runs
            drywall projects every week. SubTrade is developed in the gap
            between site visits, which is exactly why it fits in yours.
          </p>
          <div style={{ marginTop: 56 }}>
            <p className="eyebrow">The founders</p>
            <div className="founders">
              <div className="founder-card">
                <img
                  src="/fabian-vargas-garcia-subtrade-cofounder.webp"
                  alt="Fabian Vargas Garcia, Co-Founder of SubTrade Software"
                  loading="lazy"
                />
                <b>Fabian Vargas</b>
                <span>Co-Founder · The Field</span>
                <p>
                  President of Quality Gypsum Services, a Calgary commercial
                  drywall and steel stud subcontractor. Still estimating and
                  running projects every week. Every SubTrade workflow starts
                  with a problem from his jobsites.
                </p>
              </div>
              <div className="founder-card">
                <img
                  src="/steban-vargas-subtrade-cofounder.webp"
                  alt="Steban Vargas, Co-Founder and Senior Software Developer at SubTrade Software"
                  loading="lazy"
                />
                <b>Steban Vargas</b>
                <span>Co-Founder · Senior Software Developer</span>
                <p>
                  The engineer who saw the idea and made it come true. Steban
                  turned jobsite frustrations into the platform itself, building
                  SubTrade from the first line of code into software crews
                  actually use.
                </p>
              </div>
            </div>
          </div>
          <p style={{ marginTop: 44 }}>
            <a href={SIGNUP} className="btn btn-primary btn-lg">
              Start free trial
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
