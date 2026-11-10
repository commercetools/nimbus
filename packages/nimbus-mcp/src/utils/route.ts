/** Normalize a route path and convert to the docs data slug format. */
export function routePathToSlug(path: string): string {
  return path.replace(/^\/+|\/+$/g, "").replace(/\//g, "-");
}
