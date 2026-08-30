// BreadcrumbList markup, in one place so every page trail is built the same way.
//
// Pass the trail below the home page as [name, path] pairs, deepest last:
//
//   breadcrumbs([['Tutorials', '/how-to-tutorials/'], [t.title, `/tutorials/${t.slug}/`]])
//
// Home is added automatically as position 1, and paths keep their trailing
// slash because every URL on this site does.

const BASE = 'https://subtradesoftware.com';

export function breadcrumbs(trail) {
  const items = [['Home', '/'], ...trail];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: `${BASE}${path}`,
    })),
  };
}
