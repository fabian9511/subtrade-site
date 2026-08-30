import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SIGNUP } from '../../../lib/data';
import { getAllPosts, getPost, getRelatedPosts } from '../../../lib/posts';
import ArticleToc from '../../../components/ArticleToc';
import RelatedLinks from '../../../components/RelatedLinks';
import { AUTHOR, authorSchema } from '../../../lib/author';
import { breadcrumbs } from '../../../lib/breadcrumbs';

const BASE = 'https://subtradesoftware.com';

// Every post is known at build time, so each one is prerendered as static
// HTML — same as the hand-built pages were.
export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const post = getPost(params.slug);
  if (!post) return {};
  const path = `/blog/${post.slug}/`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: path },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${BASE}${path}`,
      type: 'article',
      publishedTime: post.date || undefined,
      modifiedTime: post.updated || undefined,
      ...(post.image ? { images: [`${BASE}${post.image}`] } : {}),
    },
  };
}

function prettyDate(iso) {
  if (!iso) return '';
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export default function Post({ params }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const path = `/blog/${post.slug}/`;

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      author: authorSchema(post.author),
      publisher: {
        '@type': 'Organization',
        name: 'SubTrade Software Ltd.',
        logo: { '@type': 'ImageObject', url: `${BASE}/logo-horizontal.png` },
      },
      mainEntityOfPage: `${BASE}${path}`,
      ...(post.date ? { datePublished: post.date } : {}),
      ...(post.updated ? { dateModified: post.updated } : {}),
      ...(post.image ? { image: `${BASE}${post.image}` } : {}),
    },
    breadcrumbs([
      ['Blog', '/blog/'],
      [post.title, path],
    ]),
  ];

  // Three sibling articles, chosen by tag. This is what gives every post more
  // than the single incoming link from the blog index.
  const siblings = getRelatedPosts(post.slug, 3);

  const related = [
    ...(siblings.length
      ? [
          {
            label: 'More on this',
            links: siblings.map((p) => ({ href: `/blog/${p.slug}/`, label: p.title })),
          },
        ]
      : []),
    {
      label: 'Free for subcontractors',
      links: [
        { href: '/construction-holdback-calculator', label: 'Holdback calculator' },
        { href: '/construction-retainage-calculator', label: 'US retainage calculator' },
        { href: '/construction-templates', label: 'Construction templates' },
      ],
    },
    {
      label: 'Keep reading',
      links: [
        { href: '/blog', label: 'All articles' },
        { href: '/construction-management-features', label: 'What SubTrade does' },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="section article-page" style={{ paddingTop: 80 }}>
        <div className="wrap article-wrap">
          <article className="prose article-body post-body">
            <Link href="/blog" className="article-back">← All articles</Link>
            <p className="eyebrow">{post.tag}</p>
            <h1 className="display">{post.title}</h1>
            {/* Visible byline. The same name goes into the structured data, and
                Google is explicit that an author it cannot see on the page is
                worth little — so these two must never drift apart. */}
            <p className="article-meta">
              By{' '}
              {post.author ? (
                post.author
              ) : (
                <Link href={AUTHOR.path}>{AUTHOR.name}</Link>
              )}
              <span className="dot"> · </span>
              {prettyDate(post.date)}
              {post.date ? <span className="dot"> · </span> : null}
              {post.read}
            </p>

            {/* Hero image. Entirely optional: add `image:` to the post's
                front matter and it shows up here, in the social preview and
                in the structured data. Leave it out and the post opens
                straight into the text, exactly as before. */}
            {post.image ? (
              <figure className="post-hero">
                <img src={post.image} alt={post.imageAlt || post.title} />
              </figure>
            ) : null}

            <div dangerouslySetInnerHTML={{ __html: post.html }} />

            <div className="article-cta">
              <div>
                <b>Built by a subcontractor, for subcontractors</b>
                <p>
                  SubTrade runs time tracking, change orders, daily logs and progress
                  billing on one plan. 14-day trial, no credit card.
                </p>
              </div>
              <a href={SIGNUP} className="btn btn-primary btn-lg">Start free trial</a>
            </div>
          </article>

          {post.headings.length > 1 ? <ArticleToc items={post.headings} /> : null}
        </div>
      </div>
      <RelatedLinks groups={related} />
    </>
  );
}
