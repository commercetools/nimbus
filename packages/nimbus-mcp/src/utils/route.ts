/**
 * Sections that moved. Old routes still resolve, so links and prompts that use
 * them keep working.
 */
const MOVED_ROUTE_PREFIXES: ReadonlyArray<readonly [string, string]> = [
  ["home/getting-started/collaboration", "contribute/collaboration"],
  ["home/getting-started/release-process", "contribute/release-process"],
  ["home/design-tokens", "foundations/design-tokens"],
  ["home/style-props", "foundations/style-props"],
  ["home/contribute", "contribute"],
];

/** Removes leading and trailing slashes from a route path. */
const trimSlashes = (path: string): string => path.replace(/^\/+|\/+$/g, "");

/**
 * Maps an old route of a moved section to its current route.
 * A route that did not move is returned without leading or trailing slashes.
 */
export function resolveMovedRoute(path: string): string {
  const trimmed = trimSlashes(path);
  for (const [oldPrefix, newPrefix] of MOVED_ROUTE_PREFIXES) {
    if (trimmed === oldPrefix || trimmed.startsWith(`${oldPrefix}/`)) {
      return `${newPrefix}${trimmed.slice(oldPrefix.length)}`;
    }
  }
  return trimmed;
}

/** Normalize a route path and convert to the docs data slug format. */
export function routePathToSlug(path: string): string {
  return resolveMovedRoute(path).replace(/\//g, "-");
}
