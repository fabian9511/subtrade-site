// Blog posts are Markdown files in content/posts/. Drop a .md file in that
// folder, commit, and the post page, the blog index card and the sitemap
// entry all appear on their own. Nothing else needs editing to publish.
//
// This module touches the filesystem, so it must only ever be imported from
// server components (app/blog/page.jsx, app/blog/[slug]/page.jsx, sitemap.js).

import fs from 'fs';
import path from 'path';
import { renderMarkdown, readingTime } from './markdown';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

// Minimal YAML front matter reader: "key: value" pairs between --- fences.
// Values may be quoted. "true"/"false" become booleans. That covers every
// field the blog uses and avoids pulling in a YAML dependency.
function parseFrontMatter(raw) {
  const text = raw.replace(/^﻿/, '').replace(/\r\n/g, '\n');
  const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: text };

  const data = {};
  for (const line of match[1].split('\n')) {
    if (!line.trim() || /^\s*#/.test(line)) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (value === 'true') value = true;
    else if (value === 'false') value = false;
    data[key] = value;
  }
  return { data, body: match[2] };
}

function readAll() {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md') && f !== 'TEMPLATE.md')
    .map((file) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
      const { data, body } = parseFrontMatter(raw);
      const slug = data.slug || file.replace(/\.md$/, '');
      const { html, headings } = renderMarkdown(body);
      return {
        slug,
        title: data.title || slug,
        description: data.description || '',
        blurb: data.blurb || data.description || '',
        tag: data.tag || 'Article',
        date: data.date || '',
        updated: data.updated || data.date || '',
        // image      -> the big picture at the top of the post. Also what
        //               Google and social previews use.
        // cardImage  -> optional wider crop for the blog index card. Leave it
        //               out and the card just reuses `image`.
        // imageAlt   -> one sentence describing the picture, for screen
        //               readers and for Google Images.
        image: data.image || '',
        cardImage: data.cardImage || data.image || '',
        imageAlt: data.imageAlt || '',
        draft: data.draft === true,
        read: data.read || readingTime(body),
        href: `/blog/${slug}`,
        html,
        headings,
      };
    })
    .filter((p) => !p.draft)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

export function getAllPosts() {
  return readAll();
}

export function getPostSlugs() {
  return readAll().map((p) => p.slug);
}

export function getPost(slug) {
  return readAll().find((p) => p.slug === slug) || null;
}

// The two long-form guides published before the Markdown system existed.
// They keep their original root-level URLs because Google has them indexed
// and moving them would throw away that history for nothing.
export const legacyPosts = [
  {
    href: '/the-ultimate-guide-to-choosing-subcontractor-management-software-for-efficient-project-oversight',
    tag: 'Buying guide',
    read: '5 min read',
    date: '2026-01-15',
    title: 'How to choose subcontractor management software',
    blurb:
      'The features that matter, the traps to avoid, and the one-week evaluation that beats every demo.',
  },
  {
    href: '/best-software-for-subcontractors-comparing-top-tools-for-2025-to-boost-efficiency-and-project-management',
    tag: 'Comparison',
    read: '4 min read',
    date: '2026-01-08',
    title: 'Best software for subcontractors: comparing the top tools',
    blurb:
      'GC tools, builder tools and sub tools are different products. An honest map of the category.',
  },
];
