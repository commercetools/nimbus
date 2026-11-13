/**
 * Illustration names for the route manifest.
 *
 * The docs build renders every `<name>.illustration.ts` source in
 * `packages/nimbus/src` to `<name>.svg`, so the known names are the file names
 * of those sources: components, patterns and the docs page illustrations in
 * `src/docs/illustrations/`.
 */
import fs from "fs/promises";
import path from "path";

const SUFFIX = ".illustration.ts";

/** Folder with all illustration sources, relative to the monorepo root. */
export const ILLUSTRATION_SOURCES_DIR = path.join("packages", "nimbus", "src");

/**
 * Names of all illustration sources below `dir`. Returns an empty set when the
 * folder does not exist.
 */
export async function listIllustrationNames(dir: string): Promise<Set<string>> {
  try {
    const entries = await fs.readdir(dir, {
      withFileTypes: true,
      recursive: true,
    });
    return new Set(
      entries
        .filter((entry) => entry.isFile() && entry.name.endsWith(SUFFIX))
        .map((entry) => entry.name.slice(0, -SUFFIX.length))
    );
  } catch {
    return new Set();
  }
}

/** The names in an `illustration` front matter value: one name or a list. */
export const illustrationNames = (
  illustration: string | string[] | undefined
): string[] =>
  illustration === undefined
    ? []
    : Array.isArray(illustration)
      ? illustration
      : [illustration];

/** `illustration` front matter values that match no illustration source. */
export function findUnknownIllustrations<
  T extends { illustration?: string | string[] },
>(
  docs: Array<{ file: string; meta: T }>,
  known: Set<string>
): Array<{ file: string; name: string }> {
  return docs.flatMap(({ file, meta }) =>
    illustrationNames(meta.illustration)
      .filter((name) => !known.has(name))
      .map((name) => ({ file, name }))
  );
}

/** Error message for unknown `illustration` values, one entry per page. */
export function formatUnknownIllustrations(
  unknown: Array<{ file: string; name: string }>
): string {
  return `Unknown illustration names: ${unknown
    .map(({ file, name }) => `"${name}" (${file})`)
    .join(", ")}. Use the file name of an existing <name>.illustration.ts.`;
}

/**
 * Illustration of a page. The `illustration` front matter field wins when it
 * names a known source. Otherwise a main doc page uses the source
 * `<name>.illustration.ts` next to its `<name>.mdx`. The docs build renders the
 * SVG from the source.
 */
export async function findIllustration(
  monorepoRoot: string | null,
  meta: { illustration?: string | string[]; repoPath: string },
  known: Set<string>
): Promise<string[]> {
  const named = illustrationNames(meta.illustration);
  if (named.length > 0) {
    return named.filter((name) => known.has(name));
  }
  const { repoPath } = meta;
  const name = path.basename(repoPath, ".mdx");
  const isMainPage = path.basename(repoPath) === `${name}.mdx`;
  if (!monorepoRoot || !isMainPage || name.includes(".")) return [];
  const source = path.join(
    monorepoRoot,
    path.dirname(repoPath),
    `${name}.illustration.ts`
  );
  try {
    await fs.access(source);
    return [name];
  } catch {
    return [];
  }
}
