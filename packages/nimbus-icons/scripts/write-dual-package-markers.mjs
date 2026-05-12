#!/usr/bin/env node

/**
 * Writes marker package.json files into dist/esm and dist/cjs so Node knows
 * how to interpret the .js files in each directory.
 *
 * tsc emits .js without flipping extensions, and this package's root
 * package.json has no "type" field — so Node defaults to CJS by extension.
 * That makes the ESM build unimportable from native Node ESM contexts
 * (Next.js app router server components, Remix loaders, Node 22 with
 * "type": "module"). The marker files override the inferred kind.
 */

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const DIST = join(__dirname, "..", "dist");

const MARKERS = [
  ["esm", { type: "module" }],
  ["cjs", { type: "commonjs" }],
];

for (const [subdir, contents] of MARKERS) {
  const path = join(DIST, subdir, "package.json");
  writeFileSync(path, JSON.stringify(contents, null, 2) + "\n");
  console.log(`[markers] wrote ${path}`);
}
