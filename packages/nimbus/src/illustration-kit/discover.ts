import { readdirSync, readFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";

/** `packages/nimbus/src`, where components and patterns live. */
export const SRC_DIR = resolve(import.meta.dirname, "..");

const ROOTS = ["components", "patterns"] as const;

export type RequiredIllustration = {
  /** Folder name, `<name>.illustration.ts` and the id prefix. */
  name: string;
  /** Absolute folder path. */
  dir: string;
  /** Docs menu category: the second `menu` entry of the main page. */
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

const walk = (dir: string): RequiredIllustration[] =>
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

/**
 * Every folder in `components/` and `patterns/` with a main doc page
 * `<dir>/<basename(dir)>.mdx`. Each one needs an illustration.
 */
export const discover = (): RequiredIllustration[] =>
  ROOTS.flatMap((root) => walk(join(SRC_DIR, root))).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
