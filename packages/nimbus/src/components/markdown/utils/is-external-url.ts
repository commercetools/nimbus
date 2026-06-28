/**
 * Whether an href points to an external origin (absolute http/https or a
 * protocol-relative URL). Relative and in-page (`#…`) links are internal.
 */
export function isExternalUrl(href: string | undefined | null): boolean {
  if (!href) return false;
  return /^(https?:)?\/\//i.test(href.trim());
}
