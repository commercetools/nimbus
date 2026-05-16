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
 *      moduleResolution: "nodenext". The shared rewriter lives at
 *      scripts/lib/rewrite-relative-imports.mjs.
 *
 *   3. Duplicate index.d.ts and setup-jsdom-polyfills.d.ts to .d.cts variants
 *      for the CJS exports path. Identical content; the extension flips how
 *      TypeScript interprets the module kind (CJS regardless of `"type"`).
 *
 * Steps 1 & 2 run before step 3 so the .d.cts copies inherit the rewritten
 * imports.
 *
 * Not idempotent: step 1 removes dist/test/ after relocating, so a second run
 * without a fresh `vite build` fails on the missing source file. Always run
 * `vite build` (which emits dist/test/) before invoking this script.
 */

import { copyFileSync, existsSync, rmSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { walkAndRewriteImports } from "../../../scripts/lib/rewrite-relative-imports.mjs";

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
