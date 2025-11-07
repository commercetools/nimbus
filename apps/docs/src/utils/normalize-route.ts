/**
 * Normalizes a route by removing leading/trailing slashes and handling empty routes.
 * @param route - The route string to normalize
 * @returns Normalized route string
 */
export const normalizeRoute = (route: string): string => {
  // Remove leading and trailing slashes
  const cleaned = route.replace(/^\/+|\/+$/g, "");
  // Empty route becomes "home"
  return cleaned || "home";
};
