import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";

/** `packages/nimbus/src`, where components and patterns live. */
export const SRC_DIR = resolve(import.meta.dirname, "..");

/**
 * Illustrations for docs pages that are not a component or pattern, for
 * example Design Tokens. A page picks one with the `illustration` front matter
 * field.
 */
export const DOCS_ILLUSTRATIONS_DIR = join(SRC_DIR, "docs", "illustrations");

/** Contact sheet category of the docs page illustrations. */
export const DOCS_CATEGORY = "Docs pages";

const ROOTS = ["components", "patterns"] as const;

const SUFFIX = ".illustration.ts";

export type IllustrationSource = {
  /** `<name>.illustration.ts`, the id prefix and the rendered `<name>.svg`. */
  name: string;
  /** Absolute folder path. */
  dir: string;
  /**
   * Contact sheet category: the second `menu` entry of the main page, or
   * `Docs pages` for the docs page illustrations.
   */
  category: string;
};

const isMainDoc = (file: string, dir: string) =>
  file === `${basename(dir)}.mdx`;

/** Second entry of the `menu:` list in the frontmatter, or `Other`. */
const readCategory = (mdxPath: string): string => {
  const frontmatter = /^---\n([\s\S]*?)\n---/.exec(
    readFileSync(mdxPath, "utf8")
  )?.[1];
  const menu = /^menu:\n((?:\s+-\s+.*\n?)+)/m.exec(frontmatter ?? "")?.[1];
  const items = [...(menu ?? "").matchAll(/^\s+-\s+(.*)$/gm)].map((m) =>
    m[1].trim()
  );
  return items[1] ?? "Other";
};

const walk = (dir: string): IllustrationSource[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (!entry.isDirectory() || entry.name === "node_modules") return [];
    const child = join(dir, entry.name);
    const found = walk(child);
    const main = join(child, `${entry.name}.mdx`);
    return readdirSync(child).some((file) => isMainDoc(file, child))
      ? [
          { name: entry.name, dir: child, category: readCategory(main) },
          ...found,
        ]
      : found;
  });

const byName = (a: IllustrationSource, b: IllustrationSource) =>
  a.name.localeCompare(b.name);

/**
 * Every folder in `components/` and `patterns/` with a main doc page
 * `<dir>/<basename(dir)>.mdx`. Each one needs an illustration.
 */
export const discover = (): IllustrationSource[] =>
  ROOTS.flatMap((root) => walk(join(SRC_DIR, root))).sort(byName);

/**
 * Every `<name>.illustration.ts` in `docs/illustrations/`. No page needs one,
 * so these are never reported as missing.
 */
export const discoverDocsIllustrations = (
  dir = DOCS_ILLUSTRATIONS_DIR
): IllustrationSource[] =>
  existsSync(dir)
    ? readdirSync(dir)
        .filter((file) => file.endsWith(SUFFIX))
        .map((file) => ({
          name: file.slice(0, -SUFFIX.length),
          dir,
          category: DOCS_CATEGORY,
        }))
        .sort(byName)
    : [];

/**
 * Throws when two sources share a name. Both would render to `<name>.svg`,
 * and one would silently replace the other.
 */
export const assertUniqueNames = (items: IllustrationSource[]) => {
  const seen = new Set<string>();
  const twice = new Set<string>();
  for (const { name } of items) {
    if (seen.has(name)) twice.add(name);
    seen.add(name);
  }
  if (twice.size > 0) {
    throw new Error(
      `Illustration names must be unique. Used more than once: ${[...twice].join(", ")}`
    );
  }
};

/** All illustration sources: components, patterns and docs pages. */
export const discoverAll = (): IllustrationSource[] => {
  const all = [...discover(), ...discoverDocsIllustrations()];
  assertUniqueNames(all);
  return all;
};
