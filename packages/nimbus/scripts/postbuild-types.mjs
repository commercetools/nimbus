#!/usr/bin/env node

/**
 * Post-processes the emitted .d.ts files for nimbus.
 *
 * Three tasks, in order:
 *
 *   1. Relocate setup-jsdom-polyfills.d.ts from dist/test/ to dist/ to match
 *      where the runtime files (.es.js / .cjs) land. vite-plugin-dts preserves
 *      src/ subdirs; vite emits the runtime flat for declared entry points.
 *
 *   2. Walk every .d.ts in dist/ and rewrite bare relative imports
 *      (`export * from './foo'`) to include explicit `.js` extensions
 *      (`export * from './foo/index.js'`). vite-plugin-dts doesn't emit
 *      extensions, which causes attw InternalResolutionError under
 *      moduleResolution: "nodenext". TS resolves the `.js` extension back to
 *      the corresponding `.d.ts` automatically.
 *
 *   3. Duplicate index.d.ts and setup-jsdom-polyfills.d.ts to .d.cts variants
 *      for the CJS exports path. Identical content; the extension flips how
 *      TypeScript interprets the module kind (CJS regardless of `"type"`).
 *
 * Steps 1 & 2 run before step 3 so the .d.cts copies inherit the rewritten
 * imports.
 */

import {
  copyFileSync,
  existsSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const DIST = join(__dirname, "..", "dist");

// ---------------------------------------------------------------------------
// Step 1: relocate

const RELOCATIONS = [
  {
    from: join(DIST, "test", "setup-jsdom-polyfills.d.ts"),
    to: join(DIST, "setup-jsdom-polyfills.d.ts"),
  },
];

for (const { from, to } of RELOCATIONS) {
  if (!existsSync(from)) {
    console.error(`[postbuild-types] missing ${from}`);
    process.exit(1);
  }
  copyFileSync(from, to);
  console.log(`[postbuild-types] relocated ${relative(DIST, from)} → ${relative(DIST, to)}`);
}

rmSync(join(DIST, "test"), { recursive: true, force: true });

// ---------------------------------------------------------------------------
// Step 2: rewrite bare relative imports

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
  if (existsSync(`${abs}.d.ts`) || existsSync(`${abs}.js`)) return `${importPath}.js`;
  if (isDir(abs)) {
    if (existsSync(join(abs, "index.d.ts")) || existsSync(join(abs, "index.js"))) {
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

function walkDts(dir) {
  let count = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      count += walkDts(full);
    } else if (entry.isFile() && entry.name.endsWith(".d.ts")) {
      if (rewriteFile(full)) count++;
    }
  }
  return count;
}

const rewritten = walkDts(DIST);
console.log(`[postbuild-types] rewrote imports in ${rewritten} .d.ts file(s)`);

// ---------------------------------------------------------------------------
// Step 3: duplicate to .d.cts (after rewriting, so they inherit fixed paths)

const ENTRY_POINTS = ["index", "setup-jsdom-polyfills"];

for (const entry of ENTRY_POINTS) {
  const src = join(DIST, `${entry}.d.ts`);
  const dst = join(DIST, `${entry}.d.cts`);
  if (!existsSync(src)) {
    console.error(`[postbuild-types] missing ${src}`);
    process.exit(1);
  }
  copyFileSync(src, dst);
  console.log(`[postbuild-types] ${entry}.d.ts → ${entry}.d.cts`);
}
