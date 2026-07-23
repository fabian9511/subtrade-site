import Link from 'next/link';

export const metadata = {
  title: 'Blog',
  description: 'Guides and practical writing for trade subcontractors from SubTrade.',
};

const posts = [
  {
    href: '/the-ultimate-guide-to-choosing-subcontractor-management-software-for-efficient-project-oversight',
    title: 'How to choose subcontractor management software',
    blurb: 'The features that matter, the traps to avoid, and the one-week evaluation that beats every demo.',
  },
  {
    href: '/best-software-for-subcontractors-comparing-top-tools-for-2025-to-boost-efficiency-and-project-management',
    title: 'Best software for subcontractors: comparing the top tools',
    blurb: 'GC tools, builder tools and sub tools are different products. An honest map of the category.',
  },
];

export default function Blog() {
  return (
    <section className="section" style={{ paddingTop: 90 }}>
      <div className="wrap">
        <p className="eyebrow">Writing for the trades</p>
        <h1 className="display" style={{ fontSize: 'clamp(40px,6vw,72px)', margin: '18px 0 40px' }}>Blog</h1>
        <div className="workflow">
          {posts.map((p) => (
            <Link href={p.href} key={p.href} className="step" style={{ gridTemplateColumns: '1fr 1.4fr' }}>
              <h3>{p.title}</h3>
              <p>{p.blurb}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
