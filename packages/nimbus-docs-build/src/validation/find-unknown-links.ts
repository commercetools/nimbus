/**
 * Internal links in the documentation text.
 *
 * Authors link to other pages with Markdown links such as
 * `[Colors](/foundations/design-tokens/colors)`. The build does not check the text of
 * these links, so a renamed or removed page leaves links that lead nowhere.
 */

type LinkSource = {
  /** File of the document, for the report. */
  file: string;
  /** Route of the document, with or without a leading slash. */
  route: string;
  /** Keys of the tabs of the document, such as `dev`; each one has a route. */
  viewKeys: string[];
  /** MDX text of the document. */
  mdx: string;
};

/** A Markdown link to a path on the docs site, such as `](/learn/rules)`. */
const INTERNAL_LINK = /\]\((\/[^)\s#?]*)[^)]*\)/g;

/** Paths of static files, which are not pages. */
const STATIC_PATH = /^\/(images|public)\//;

const normalize = (path: string) =>
  `/${path.replace(/^\/+|\/+$/g, "")}`.toLowerCase();

/**
 * The docs app opens a page whose path differs only by dashes, for example
 * `/defaultpage` for `/default-page`, so such links still work.
 */
const undashed = (path: string) => path.replace(/-/g, "");

/**
 * Finds internal links whose path is not the route of any document or of one
 * of its tabs.
 * @returns One entry for each link that leads nowhere
 */
export function findUnknownInternalLinks(
  docs: LinkSource[]
): { file: string; path: string }[] {
  const known = new Set<string>();
  for (const doc of docs) {
    const route = normalize(doc.route);
    known.add(route);
    for (const key of doc.viewKeys) known.add(`${route}/${key}`);
  }
  const knownUndashed = new Set([...known].map(undashed));

  const unknown: { file: string; path: string }[] = [];
  for (const doc of docs) {
    for (const match of doc.mdx.matchAll(INTERNAL_LINK)) {
      const path = match[1];
      if (STATIC_PATH.test(path)) continue;
      const normalized = normalize(path);
      if (known.has(normalized)) continue;
      if (knownUndashed.has(undashed(normalized))) continue;
      unknown.push({ file: doc.file, path });
    }
  }
  return unknown;
}
