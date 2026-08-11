#!/usr/bin/env node

/**
 * Post-processes the emitted .d.ts files for nimbus.
 *
 * Three tasks, in order:
 *
 *   1. Relocate setup-jsdom-polyfills.d.ts (from dist/test/) and theme.d.ts
 *      (from dist/theme/index.d.ts) to dist/ to match where the runtime
 *      files (.es.js / .cjs) land. vite-plugin-dts preserves src/ subdirs;
 *      vite emits the runtime flat for declared entry points. dist/theme/
 *      itself is kept — other components' .d.ts files still import from
 *      ./theme/recipes, ./theme/tokens, etc.
 *
 *   2. Walk every .d.ts in dist/ and rewrite bare relative imports
 *      (`export * from './foo'`) to include explicit `.js` extensions
 *      (`export * from './foo/index.js'`). vite-plugin-dts doesn't emit
 *      extensions, which causes attw InternalResolutionError under
 *      moduleResolution: "nodenext". The shared rewriter lives at
 *      scripts/lib/rewrite-relative-imports.mjs.
 *
 *   3. Duplicate index.d.ts, theme.d.ts, and setup-jsdom-polyfills.d.ts to
 *      .d.cts variants for the CJS exports path. Identical content; the
 *      extension flips how TypeScript interprets the module kind (CJS
 *      regardless of `"type"`).
 *
 * Steps 1 & 2 run before step 3 so the .d.cts copies inherit the rewritten
 * imports.
 *
 * Not idempotent: step 1 removes dist/test/ after relocating, so a second run
 * without a fresh `vite build` fails on the missing source file. Always run
 * `vite build` (which emits dist/test/) before invoking this script.
 */

import { copyFileSync, existsSync, rmSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { walkAndRewriteImports } from "../../../scripts/lib/rewrite-relative-imports.mjs";
import { fixCjsChunkExtensions } from "../../../scripts/lib/rewrite-cjs-chunk-extensions.mjs";
import { listCjsEntryFiles } from "../../../scripts/lib/list-cjs-entry-files.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const DIST = join(__dirname, "..", "dist");

// ---------------------------------------------------------------------------
// Step 1: relocate

const RELOCATIONS = [
  {
    from: join(DIST, "test", "setup-jsdom-polyfills.d.ts"),
    to: join(DIST, "setup-jsdom-polyfills.d.ts"),
  },
  {
    // theme/index.d.ts only declares `system` typed against
    // `@chakra-ui/react`'s public types. A plain copy is safe here
    // regardless of what it currently imports: step 2 below
    // (walkAndRewriteImports) runs over every .d.ts in dist/ after
    // relocation and rewrites relative imports unconditionally, so import
    // paths are handled either way, not because this file happens to have
    // none today. Unlike dist/test/, dist/theme/ is NOT removed afterward:
    // sibling component .d.ts files still import from ./theme/recipes,
    // ./theme/tokens, etc.
    from: join(DIST, "theme", "index.d.ts"),
    to: join(DIST, "theme.d.ts"),
  },
];

for (const { from, to } of RELOCATIONS) {
  if (!existsSync(from)) {
    console.error(`[postbuild-types] missing ${from}`);
    process.exit(1);
  }
  copyFileSync(from, to);
  console.log(
    `[postbuild-types] relocated ${relative(DIST, from)} → ${relative(DIST, to)}`
  );
}

rmSync(join(DIST, "test"), { recursive: true, force: true });

// ---------------------------------------------------------------------------
// Step 2: rewrite bare relative imports

const rewritten = walkAndRewriteImports(DIST, (name) => name.endsWith(".d.ts"));
console.log(`[postbuild-types] rewrote imports in ${rewritten} .d.ts file(s)`);

// ---------------------------------------------------------------------------
// Step 3: duplicate to .d.cts (after rewriting, so they inherit fixed paths)

const ENTRY_POINTS = [
  "index",
  "theme",
  "setup-jsdom-polyfills",
  "plugins/webpack",
  "plugins/vite",
  "plugins/stub",
];

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

// ---------------------------------------------------------------------------
// Step 4: fix stub runtime content
//
// Rolldown compiles `export {}` to empty files. The stub must be CJS
// (`module.exports = {}`) so webpack's CJS-to-ESM interop silently resolves
// missing named imports to `undefined` instead of erroring.

const STUB_CJS = "module.exports = {};\n";
writeFileSync(join(DIST, "plugins", "stub.cjs"), STUB_CJS);
console.log(`[postbuild-types] wrote CJS stub content to plugins/stub.cjs`);

// ---------------------------------------------------------------------------
// Step 5: fix CJS chunk extensions
//
// Rolldown names chunks with the template `[name]-[hash].[format].js`.
// For CJS chunks this produces `.cjs.js`. In a `type: "module"` package,
// Node treats `.js` files as ESM, so `require("./chunk.cjs.js")` fails.
// Rename `.cjs.js` → `.cjs` and update references in CJS entry points AND
// in every other chunk (chunks require each other, not just entry points —
// see scripts/lib/rewrite-cjs-chunk-extensions.mjs for the regression this
// guards against).
//
// Entry points aren't limited to the curated ENTRY_POINTS list above:
// vite.config.ts's createEntries() also globs every
// src/{components,patterns}/**/index.ts into its own CJS entry under
// dist/components/*.cjs — well over a hundred of them. Any of those can
// require() a renamed chunk too, so scan every entry `.cjs` file actually on
// disk (skipping dist/chunks/ itself) rather than deriving the list from
// ENTRY_POINTS.
const cjsEntryFiles = listCjsEntryFiles(DIST);
const { renamed, filesUpdated } = fixCjsChunkExtensions(DIST, cjsEntryFiles);
if (renamed > 0) {
  console.log(
    `[postbuild-types] renamed ${renamed} CJS chunk(s): .cjs.js → .cjs (updated ${filesUpdated} referencing file(s))`
  );
}
