import fs from "fs/promises";
import path from "path";

/**
 * Kinds of source files a component folder can hold, with the file-name
 * suffix that identifies each kind.
 */
export const SOURCE_FILE_SUFFIXES = {
  types: ".types.ts",
  stories: ".stories.tsx",
  illustration: ".illustration.ts",
  recipe: ".recipe.ts",
  slots: ".slots.tsx",
  i18n: ".i18n.ts",
  docsSpec: ".docs.spec.tsx",
  spec: ".spec.tsx",
} as const;

export type SourceFileKind = keyof typeof SOURCE_FILE_SUFFIXES;

/**
 * Names the kinds of source files in a list of file names.
 * `.docs.spec.tsx` counts as `docsSpec` only, not as `spec`.
 */
export function classifySourceFiles(fileNames: string[]): SourceFileKind[] {
  const kinds = new Set<SourceFileKind>();
  for (const name of fileNames) {
    const match = (
      Object.entries(SOURCE_FILE_SUFFIXES) as [SourceFileKind, string][]
    )
      .filter(([, suffix]) => name.endsWith(suffix))
      .sort((a, b) => b[1].length - a[1].length)[0];
    if (match) kinds.add(match[0]);
  }
  return [...kinds];
}

/** Lists the source file kinds next to a document; empty if the folder is unreadable. */
export async function resolveSourceFiles(
  documentFile: string
): Promise<SourceFileKind[]> {
  try {
    return classifySourceFiles(await fs.readdir(path.dirname(documentFile)));
  } catch {
    return [];
  }
}
