---
title: "The headline of the post, in sentence case"
description: "One or two sentences. This is what Google shows under the title in search results, so write it for a human. Aim for 140 to 160 characters."
blurb: "The short line that shows on the blog index card. Can be punchier than the description."
tag: "Getting paid"
date: "2026-07-25"
updated: "2026-07-25"
---

Open with the point. No throat-clearing, no "in today's fast-paced construction
industry". The first paragraph should be worth reading on its own.

## Every "##" heading becomes a section

Section headings are picked up automatically and turned into the "On this page"
sidebar on the right, and each one gets its own anchor link. You never write the
table of contents yourself.

### "###" makes a smaller subheading

Regular paragraphs are just text with a blank line between them.

**Bold** is two asterisks. *Italic* is one. Links look like
[this](/construction-holdback-calculator/) — use a leading slash for pages on
this site, and a full https:// address for anywhere else. External links get
opened in a new tab automatically.

- Bullet lists start with a dash
- One item per line
- A blank line ends the list

1. Numbered lists work the same way
2. Just use "1." and "2."

> A line starting with ">" becomes a pull quote.

Tables use pipes. The second row of dashes is what makes it a table:

| Province | Holdback |
|---|---|
| Alberta | 10% |
| Manitoba | 7.5% |

Images go in the public/ folder and are referenced by their path:
![Description of the photo for screen readers](/some-image.webp)

---

## How to publish this

1. Copy this file, rename it to the URL you want. The filename becomes the web
   address: `progress-billing-holdback-canada.md` publishes at
   `/blog/progress-billing-holdback-canada/`. Lowercase, hyphens, no spaces.
2. Fill in the front matter at the top — everything between the two `---` lines.
   `title`, `description` and `date` are the ones that matter. `date` must be in
   YYYY-MM-DD format or the sorting goes wrong.
3. Write the post below the front matter.
4. Upload it to `subtrade-site/content/posts/` on GitHub and commit.

That is the whole process. The post page, the card on the blog index and the
sitemap entry all build themselves. Nothing else needs editing.

## Two useful extras

Add `draft: true` to the front matter to keep a post out of the live site while
you work on it. It stays in the repo, invisible, until you delete that line.

Add `read: "7 min read"` to override the reading time. Leave it out and it gets
calculated from the word count.
