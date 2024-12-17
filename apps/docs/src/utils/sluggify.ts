import slug from "slug";
import { MdxFileFrontmatter } from "../types";

/**
 * Create a URL-compatible slug from a string
 * @param str - The string to be converted to a slug
 * @returns The slugified string
 */
export const sluggify = (str: string): string => {
  return slug(str, "-");
};

/**
 * Transforms a menu from an mdx-file's frontmatter to a path
 * @param menu - The menu array from the frontmatter
 * @returns The path created by joining the slugified menu items
 */
export const menuToPath = (
  menu: MdxFileFrontmatter["meta"]["menu"]
): string => {
  return menu.map((item: string) => sluggify(item)).join("/");
};
