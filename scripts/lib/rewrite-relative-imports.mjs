#!/usr/bin/env node

/**
 * Walks a directory and rewrites bare relative imports in matching files to
 * include explicit `.js` extensions.
 *
 * Both `vite-plugin-dts` and `tsc` emit `from './foo'` without explicit
 * extensions. Node's native ESM resolution rejects these since Node 12 —
 * surfaced as @arethetypeswrong/cli "InternalResolutionError" under
 * moduleResolution: "nodenext".
 *
 * For each match in a file, the rewriter resolves the import against the
 * filesystem and decides how to append the extension:
 *   `./foo`  where ./foo.{d.ts,js} exists       → `./foo.js`
 *   `./foo`  where ./foo/ is a directory        → `./foo/index.js`
 *   `..`     (parent dir)                       → `../index.js`
 *   `.`      (current dir, rare)                → `./index.js`
 *
 * Imports that already carry an extension (`.js`, `.mjs`, `.cjs`, `.json`)
 * are left alone. Specifiers that don't resolve on disk (likely external
 * packages misclassified as relative — shouldn't happen, but defensively)
 * are also left alone.
 *
 * Note: the regex matches everywhere in the file, including inside JSDoc
 * `@example` blocks. An `@example import { Foo } from "./bar"` in an emitted
 * `.d.ts` will get rewritten to `from "./bar.js"` if `./bar` resolves on disk.
 * That's intentional — the rewritten form is the correct one to show in
 * examples — but worth knowing if a JSDoc-only diff shows up in code review.
 *
 * TypeScript resolves the `.js` extension back to the corresponding `.d.ts`
 * automatically. Runtime ESM resolves `./foo/index.js` to the same file
 * Node would have picked on its own.
 *
 * Usage:
 *   import { walkAndRewriteImports } from "../../../scripts/lib/rewrite-relative-imports.mjs";
 *   const count = walkAndRewriteImports(distDir, (name) => name.endsWith(".d.ts"));
 *   console.log(`rewrote ${count} files`);
 */

import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";

function isDir(p) {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
}

/**
 * Returns the rewritten import path (with explicit .js extension), or null if
 * the target can't be resolved on disk.
 */
function resolveImport(fromFileDir, importPath) {
  const abs = join(fromFileDir, importPath);
  if (existsSync(`${abs}.d.ts`) || existsSync(`${abs}.js`)) {
    return `${importPath}.js`;
  }
  if (isDir(abs)) {
    if (
      existsSync(join(abs, "index.d.ts")) ||
      existsSync(join(abs, "index.js"))
    ) {
      return `${importPath}/index.js`;
    }
  }
  return null;
}

// Matches `from "..."`, `from '...'`, and dynamic `import("...")` calls where
// the specifier is a relative path. Path can be:
//   "."           current dir (rare in emitted output)
//   ".."          parent dir
//   "./foo"       sibling file or subdir
//   "../foo/bar"  any relative path with content after the dots
const IMPORT_RE = /((?:from|import)\s*\(?\s*)(['"])(\.{1,2}(?:\/[^'"]*)?)\2/g;

function rewriteFile(filePath) {
  const content = readFileSync(filePath, "utf8");
  const fileDir = dirname(filePath);
  let changed = false;

  const updated = content.replace(IMPORT_RE, (match, prefix, quote, spec) => {
    if (/\.(js|mjs|cjs|json)$/.test(spec)) return match;
    const resolved = resolveImport(fileDir, spec);
    if (!resolved) return match;
    changed = true;
    return `${prefix}${quote}${resolved}${quote}`;
  });

  if (changed) writeFileSync(filePath, updated);
  return changed;
}

/**
 * Recursively walks `dir`, applies `predicate(name)` to each file's basename,
 * and rewrites bare relative imports in matching files. Returns the count of
 * files that were modified.
 */
export function walkAndRewriteImports(dir, predicate) {
  let count = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      count += walkAndRewriteImports(full, predicate);
    } else if (entry.isFile() && predicate(entry.name)) {
      if (rewriteFile(full)) count++;
    }
  }
  return count;
}
