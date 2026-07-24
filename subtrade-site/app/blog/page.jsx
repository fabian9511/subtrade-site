import Link from 'next/link';

export const metadata = {
  title: 'Blog',
  description: 'Guides and practical writing for trade subcontractors from SubTrade.',
  alternates: { canonical: '/blog/' },
};

const posts = [
  {
    href: '/the-ultimate-guide-to-choosing-subcontractor-management-software-for-efficient-project-oversight',
    tag: 'Buying guide',
    read: '5 min read',
    title: 'How to choose subcontractor management software',
    blurb: 'The features that matter, the traps to avoid, and the one-week evaluation that beats every demo.',
  },
  {
    href: '/best-software-for-subcontractors-comparing-top-tools-for-2025-to-boost-efficiency-and-project-management',
    tag: 'Comparison',
    read: '4 min read',
    title: 'Best software for subcontractors: comparing the top tools',
    blurb: 'GC tools, builder tools and sub tools are different products. An honest map of the category.',
  },
];

export default function Blog() {
  return (
    <section className="section" style={{ paddingTop: 90 }}>
      <div className="wrap">
        <p className="eyebrow">Writing for the trades</p>
        <h1 className="display" style={{ fontSize: 'clamp(40px,6vw,72px)', margin: '18px 0 14px' }}>
          Blog
        </h1>
        <p className="blog-intro">
          Practical, no-fluff writing for trade subcontractors — how to choose
          tools, run crews, and get paid for the work you actually did.
        </p>
        <div className="blog-grid">
          {posts.map((p) => (
            <Link href={p.href} key={p.href} className="blog-card">
              <span className="blog-card-top">
                <span className="blog-tag">{p.tag}</span>
                <span className="blog-read">{p.read}</span>
              </span>
              <h2>{p.title}</h2>
              <p>{p.blurb}</p>
              <span className="blog-more">Read the guide →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
