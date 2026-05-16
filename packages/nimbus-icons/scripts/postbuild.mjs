#!/usr/bin/env node

/**
 * Post-build fixups for the published nimbus-icons tarball.
 *
 * Two tasks:
 *
 *   1. Write marker package.json files into dist/esm and dist/cjs so Node
 *      knows how to interpret each directory's .js files. tsc emits .js
 *      without flipping extensions, and the root package has no "type" field
 *      — so without markers Node defaults to CJS by extension, breaking
 *      ESM consumers.
 *
 *   2. Walk dist/esm and rewrite bare relative imports (`from './foo'`) to
 *      include explicit `.js` extensions. Native Node ESM resolution requires
 *      extensions on relative imports; tsc doesn't add them. dist/cjs is left
 *      alone — CJS resolution supports extensionless imports natively. The
 *      shared rewriter lives at scripts/lib/rewrite-relative-imports.mjs.
 */

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { walkAndRewriteImports } from "../../../scripts/lib/rewrite-relative-imports.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const DIST = join(__dirname, "..", "dist");

// ---------------------------------------------------------------------------
// Step 1: dual-package markers

const MARKERS = [
  ["esm", { type: "module" }],
  ["cjs", { type: "commonjs" }],
];

for (const [subdir, contents] of MARKERS) {
  const path = join(DIST, subdir, "package.json");
  writeFileSync(path, JSON.stringify(contents, null, 2) + "\n");
  console.log(`[postbuild] wrote ${subdir}/package.json`);
}

// ---------------------------------------------------------------------------
// Step 2: rewrite bare relative imports under dist/esm

const esmDir = join(DIST, "esm");
const rewritten = walkAndRewriteImports(
  esmDir,
  (name) => name.endsWith(".js") || name.endsWith(".d.ts")
);
console.log(`[postbuild] rewrote imports in ${rewritten} esm file(s)`);
