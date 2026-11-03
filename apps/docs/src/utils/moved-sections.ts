/**
 * Sections whose pages moved to a new top-level section. An old link to a page
 * in a moved section opens the same page under the new section.
 * Prefixes are normalized routes: no leading or trailing slash.
 */
const MOVED_SECTIONS: Record<string, string> = {
  "home/design-tokens": "foundations/design-tokens",
  "home/style-props": "foundations/style-props",
  "home/contribute": "contribute",
};

/**
 * Single pages that moved to another section.
 */
const MOVED_PAGES: Record<string, string> = {
  "home/getting-started/collaboration": "contribute/collaboration",
  "home/getting-started/release-process": "contribute/release-process",
};

/**
 * Finds the new path of a page that moved to another section.
 * @param normalizedPath - A path without leading or trailing slash
 * @returns The new path with a leading slash, or undefined if the page did not move
 */
export const findMovedSectionPath = (
  normalizedPath: string
): string | undefined => {
  for (const [oldPath, newPath] of Object.entries(MOVED_PAGES)) {
    if (
      normalizedPath === oldPath ||
      normalizedPath.startsWith(`${oldPath}/`)
    ) {
      return `/${newPath}${normalizedPath.slice(oldPath.length)}`;
    }
  }
  for (const [oldPrefix, newPrefix] of Object.entries(MOVED_SECTIONS)) {
    if (
      normalizedPath === oldPrefix ||
      normalizedPath.startsWith(`${oldPrefix}/`)
    ) {
      return `/${newPrefix}${normalizedPath.slice(oldPrefix.length)}`;
    }
  }
  return undefined;
};
