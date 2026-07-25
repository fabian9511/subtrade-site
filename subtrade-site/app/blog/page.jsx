import Link from 'next/link';
import { getAllPosts, legacyPosts } from '../../lib/posts';

export const metadata = {
  title: 'Blog',
  description: 'Guides and practical writing for trade subcontractors from SubTrade.',
  alternates: { canonical: '/blog/' },
};

export default function Blog() {
  // Markdown posts and the two original guides sit in one list, newest first.
  // Adding a .md file to content/posts/ is all it takes to appear here.
  const posts = [...getAllPosts(), ...legacyPosts].sort((a, b) =>
    String(b.date || '').localeCompare(String(a.date || ''))
  );

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
