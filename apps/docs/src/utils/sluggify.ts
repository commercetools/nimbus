import slug from "slug";
import { MdxFileFrontmatter } from "../types";

/**
 * Create a url-compatible slug from a string
 * @param str
 * @returns
 */
export const sluggify = (str: string) => {
  return slug(str, "-");
};

/** Transforms a menu from an mdx-files frontmatter to a path */
export const menuToPath = (menu: MdxFileFrontmatter["meta"]["menu"]) => {
  return menu.map((item) => sluggify(item)).join("/");
};
