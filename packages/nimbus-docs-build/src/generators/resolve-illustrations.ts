/**
 * Illustration resolution for the route manifest.
 *
 * Each document gets an ordered list of illustration names for its overview
 * card. The first rule that matches wins:
 *
 * 1. Own source: `<doc>.illustration.ts` exists next to the mdx (set by the
 *    caller as the route's initial `illustrations`).
 * 2. Children: a document without its own illustration (for example a
 *    category page) shows the first few illustrations of the documents below
 *    it in the menu.
 * 3. None: an empty list. The card keeps its icon.
 */

/** Most illustrations a category card shows. */
export const MAX_COLLAGE = 2;

type Resolvable = {
  title: string;
  menu: string[];
  order: number;
  illustrations: string[];
};

const isBelow = (route: Resolvable, parent: Resolvable) =>
  route.menu.length > parent.menu.length &&
  parent.menu.every((label, index) => route.menu[index] === label);

/** Fills `illustrations` of routes that have none from their menu children. */
export function resolveChildIllustrations(routes: Resolvable[]): void {
  // Decide from the own illustrations only, so the result does not depend on
  // the order the routes are visited in.
  const own = routes.filter((route) => route.illustrations.length > 0);

  for (const route of routes) {
    if (route.illustrations.length > 0) continue;
    const names = own
      .filter((candidate) => isBelow(candidate, route))
      .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
      .flatMap((candidate) => candidate.illustrations);
    route.illustrations = [...new Set(names)].slice(0, MAX_COLLAGE);
  }
}
