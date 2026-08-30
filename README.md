# SubTrade marketing site — start here

This file exists so anyone picking up this repo cold — a new person, or a new AI
chat session — can be useful within a couple of minutes instead of asking the
same six questions every time. Read it before touching anything.

---

## The one-line summary

`subtradesoftware.com` is a Next.js 14 App Router site for **SubTrade Software
Ltd.**, Calgary, Alberta — field management software for trade subcontractors.
It lives in this repo, deploys itself to Vercel, and is maintained by Fabian.

---

## Two rules that are not negotiable

**1. Never publish the street address.** The company location is written as
**"Calgary, Alberta"** or **"Calgary, AB"** and nothing more — no street, no
postal code — in the footer, in structured data, in blog posts, in schema
markup, anywhere on the site or in anything generated from it. If you find a
street address anywhere in this repo, that is a bug; remove it.

**2. Hand Fabian the files. Do not drive his browser.** When a change is
requested, produce the finished file or files and deliver them for him to
upload himself. Browser automation against GitHub or Vercel happens only when
he explicitly says so in that specific conversation, and that permission
expires with the task it was given for. It does not carry forward.

---

## Repo layout — read this part twice

The Next.js project is **not at the repo root**. It is one level down:

```
subtrade-site/            <- the repo root (this README lives here)
└── subtrade-site/        <- the Next.js app. Everything below is inside this.
    ├── app/              <- App Router pages, one folder per URL
    ├── components/       <- shared React components
    ├── content/posts/    <- blog posts, as Markdown files
    ├── lib/              <- data and logic, no JSX
    ├── public/           <- images, served from /
    ├── next.config.mjs   <- trailing slashes + every 301 redirect
    └── package.json
```

Nearly every mistake a new session makes starts with forgetting the nested
folder. `git clone` then `cd subtrade-site/subtrade-site` before `npm install`.

To get the current code:

```bash
git clone https://github.com/fabian9511/subtrade-site.git
cd subtrade-site/subtrade-site
npm install
npm run dev
```

The repo is public, so cloning it needs no credentials and takes seconds. Do
that rather than guessing at what a file contains.

---

## How deployment works

Vercel watches `main`. **Every commit to `main` deploys to production
automatically.** There is no separate deploy step, no build command to run, no
dashboard button to press. Commit the file on GitHub and the live site updates
in one to two minutes.

Practical consequence: a commit is a publish. There is no staging environment,
so check the build locally before handing over a file.

DNS points at Vercel (`A @ → 216.198.79.1`, `CNAME www → *.vercel-dns-017.com`).
Mail records are not managed here and must not be touched. The customer app at
`portal.subtradesoftware.com` is a separate system on AWS — this repo has
nothing to do with logins, and links to the product point at that hostname.

---

## Publishing a blog post

This is the part that used to require writing React. It does not any more.

1. Copy `subtrade-site/content/posts/TEMPLATE.md`.
2. Rename it. **The filename becomes the URL** —
   `progress-billing-holdback-canada.md` publishes at
   `/blog/progress-billing-holdback-canada/`. Lowercase, hyphens, no spaces.
3. Fill in the front matter between the `---` lines at the top. `title`,
   `description` and `date` are the ones that matter; `date` must be
   `YYYY-MM-DD` or the sort order breaks.
4. Write the post in Markdown underneath.
5. Upload it to `subtrade-site/content/posts/` on GitHub and commit.

The post page, the card on `/blog/`, the "On this page" sidebar and the
sitemap entry all generate themselves from that one file. **No other file needs
editing to publish.** `TEMPLATE.md` documents every supported piece of
formatting and is skipped by the build, so it never appears on the site.

Add `draft: true` to the front matter to keep a post in the repo but off the
live site.

**Pictures.** Upload a roughly 1200px-wide `.webp` to `subtrade-site/public/`,
name the file after what is in it, and point at it from the front matter with
`image: "/that-filename.webp"` plus a one-sentence `imageAlt:`. That one line
puts a hero image at the top of the article, a thumbnail on the blog index card
and a preview image on shared links, and feeds the `BlogPosting` structured
data. Posts without an `image:` render exactly as before and get a plain
branded panel on their index card, so the grid stays even. An optional
`cardImage:` overrides just the index thumbnail. `TEMPLATE.md` spells all of
this out.

The two original guides — the "ultimate guide" and the "best software"
comparison — are still hand-built React pages at their own root-level URLs.
That is deliberate: Google has those URLs indexed, and moving them under
`/blog/` would throw away that history for nothing. They appear on the blog
index via `legacyPosts` in `lib/posts.js`. Leave them where they are.

---

## The zero-dependency rule

Fabian edits this repo through GitHub's web interface. That works well for
source files and not at all for `package-lock.json`, so **adding an npm package
is expensive and should be treated as a last resort.**

This is why the Markdown renderer (`lib/markdown.js`), the YAML front-matter
parser (`lib/posts.js`) and the PDF writer (`lib/holdbackPdf.js`) are all
hand-rolled rather than pulled from npm. They are small, they are commented,
and they are the reason publishing works through a browser upload. Before
reaching for a library, check whether ninety lines of plain JavaScript will do
the job — for this site, it usually will.

---

## What is where

| Thing | File |
|---|---|
| Markdown → HTML renderer | `lib/markdown.js` |
| Reads `content/posts/`, parses front matter | `lib/posts.js` |
| Blog post page template | `app/blog/[slug]/page.jsx` |
| Blog index | `app/blog/page.jsx` |
| Canadian holdback rates and math | `lib/holdback.js` |
| US retainage rules, 50 states + DC | `lib/retainage.js` |
| The PDF export both calculators use | `lib/holdbackPdf.js` |
| Features, trades, comparisons, signup URL | `lib/data.js` |
| Tutorial library content | `lib/tutorials.js` |
| Customer reviews (carousel **and** home page markup) | `lib/reviews.js` |
| Every 301 redirect from the WordPress days | `next.config.mjs` |
| Sitemap (posts add themselves) | `app/sitemap.js` |
| All styling, one file | `app/globals.css` |

The two free calculators are at `/construction-holdback-calculator/` (Canadian
statutory holdback, five provinces) and `/construction-retainage-calculator/`
(US retainage, all fifty states and DC). Both run entirely in the browser, need
no signup, and export a one-page PDF summary. They share their PDF writer and
their component shell, but the rules engines are deliberately separate because
Canadian holdback and US retainage are different legal animals.

---

## SEO plumbing that is easy to break

**Every page needs a self-referencing canonical.** Add
`alternates: { canonical: '/that-url/' }` to the page's `metadata` export (with
the trailing slash). A page with no canonical is a page Google is free to fold
into some other URL it thinks is similar.

**Structured data is not free.** Google's rich results rules require anything in
the `SoftwareApplication` family — including `WebApplication` — to carry a
rating or a review. The site-wide markup used to be a `SoftwareApplication`
with neither, so every page on the site failed validation. It is now an
`Organization` plus a `WebSite`, which are valid everywhere, and the app itself
is marked up on the home page where the reviews actually are. Never invent a
rating to satisfy a validator: reviews in `lib/reviews.js` are what both the
carousel and the markup render, so the two cannot drift apart.

**Watch for `_1` filenames.** GitHub's uploader silently appends `_1` when a
file of that name already exists, so re-uploading an edited post publishes a
second copy of it instead of replacing the original. That has happened four
times. If you see `something_1.md` in `content/posts/`, it is almost certainly
the *newer* text: move it onto the original filename, delete the `_1`, and add a
redirect from the `_1` URL in `next.config.mjs`.

**IndexNow, if Ahrefs Site Audit is nagging about it.** IndexNow tells Bing,
Yandex and Naver about changed pages — Google does not use it, so this is not
how you get indexed by Google. To turn it on: generate a key in Ahrefs Site
Audit under Crawl settings, then add a file named `<that-key>.txt` to
`subtrade-site/public/` whose entire contents are the key itself. It publishes
at `https://subtradesoftware.com/<that-key>.txt`, which is where Ahrefs looks
to verify it before submitting anything.

---

## Conventions worth knowing before you edit

**Trailing slashes are on** (`trailingSlash: true`). Every internal URL ends in
`/`. This matches the URLs the old WordPress site had indexed, so nothing that
Google knows about got redirected at launch. Do not turn this off.

**This is not a static export.** `next.config.mjs` uses `async redirects()`,
which `output: 'export'` does not support. So `next build && next start` is the
way to verify locally — `npx serve out` will not work because there is no `out`.

**Pages are server components by default.** Anything needing state or browser
APIs lives in `components/` with `'use client'` at the top. `lib/posts.js`
touches the filesystem and must only ever be imported by server components.

**Styling is one file.** `app/globals.css` is long and organised into commented
sections. There is no Tailwind, no CSS modules, no component library. Match the
existing section conventions rather than inventing a new pattern.

**Mobile grid columns need `minmax(0, 1fr)`, not `1fr`.** A plain `1fr` refuses
to shrink below its content's intrinsic width, so one wide table can stretch
the entire page sideways on a phone. This has bitten the article layout once
already.

---

## Before handing over a file

```bash
cd subtrade-site/subtrade-site
npx next build          # must be clean
npx next start -p 4400  # then check the pages you touched
```

Worth checking every time:

- the pages you changed return 200, and so do the two calculators
- `curl -s localhost:4400/sitemap.xml` lists any new URL
- no page scrolls sideways at 390px wide
- a case-insensitive search of the repo for the company's street name and
  postal code returns nothing — see rule 1. (Deliberately not written out here:
  this file is public, so spelling the address out to test for it would be the
  exact leak the rule exists to prevent.)

Never run `pkill -f next` from a tool-driven shell. The pattern matches the
shell's own command line and it kills the process doing the killing.

---

## Background: how this site got here

It was a WordPress site on Hostinger. It was rebuilt as this Next.js app and
moved to Vercel with URL parity as the hard requirement — hence the trailing
slashes and the long redirect table in `next.config.mjs`, which maps every old
WordPress URL to its nearest surviving page. DNS was cut over to Vercel; mail
was left alone; the customer portal on AWS was never touched, so no user's login
was affected. The old Rank Math `sitemap_index.xml` was removed from Search
Console and the new `sitemap.xml` submitted in its place.

If a similar migration comes up for another site, that is the shape of it.
