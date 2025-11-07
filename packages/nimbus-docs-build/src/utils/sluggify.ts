/**
 * String to URL slug conversion utilities
 */

/**
 * Create a URL-compatible slug from a string
 * Simple implementation to avoid dependency on 'slug' package
 * @param str - The string to be converted to a slug
 * @returns The slugified string
 */
export const sluggify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces, underscores with single dash
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing dashes
};

/**
 * Transforms a menu from an mdx-file's frontmatter to a path
 * @param menu - The menu array from the frontmatter
 * @returns The path created by joining the slugified menu items
 */
export const menuToPath = (menu: string[]): string => {
  return menu.map((item: string) => sluggify(item)).join("/");
};
