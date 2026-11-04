/**
 * The sections the start page links to, in card order. Each one is the route
 * path of a page in the route manifest. Learn comes first, because it is where
 * new readers start; the other cards follow the top navigation. Design tokens
 * and style props are reached through Foundations.
 */
export const SECTION_PATHS = [
  "/learn",
  "/foundations",
  "/components",
  "/patterns",
  "/icons",
  "/hooks",
] as const;

/**
 * The manifest entries of the given paths, in the order of `paths`. A path
 * that is not in the manifest is left out, so a renamed page removes its card
 * instead of breaking the page.
 */
export const findSectionRoutes = <T extends { path: string }>(
  routes: ReadonlyArray<T>,
  paths: ReadonlyArray<string> = SECTION_PATHS
): T[] =>
  paths.flatMap((path) => routes.find((route) => route.path === path) ?? []);
