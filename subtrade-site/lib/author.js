// Who gets credited on an article.
//
// Google's guidance on experience signals is that a named human with a
// verifiable background beats a company name, and on this site the named human
// is genuinely the differentiator: the articles are written by someone who
// still runs drywall projects every week, not by a software marketing team.
// Both the visible byline and the `author` in the structured data read from
// here, so a reader and a crawler are always told the same thing.
//
// A post can override the name with `author:` in its front matter. Do that
// whenever someone else actually wrote it — the byline is a claim about a real
// person, so it has to be true.

const BASE = 'https://subtradesoftware.com';

export const AUTHOR = {
  name: 'Fabian Vargas Garcia',
  // Shown under the byline. Kept short: the About page carries the full story.
  role: 'Co-founder of SubTrade. Runs Quality Gypsum Services, a commercial drywall and steel stud subcontractor in Calgary.',
  path: '/about/',
};

// The `author` node for BlogPosting and Article markup. `url` points at the
// About page, which is what lets Google connect the byline to a real person
// with a described background rather than treating it as a loose string.
export function authorSchema(name) {
  if (name && name !== AUTHOR.name) {
    return { '@type': 'Person', name };
  }
  return {
    '@type': 'Person',
    name: AUTHOR.name,
    url: `${BASE}${AUTHOR.path}`,
    jobTitle: 'Co-founder',
    description: AUTHOR.role,
    worksFor: { '@id': `${BASE}/#organization` },
    knowsAbout: [
      'Construction holdback and retainage',
      'Progress billing for subcontractors',
      'Change order management',
      'Commercial drywall and steel stud contracting',
    ],
  };
}
