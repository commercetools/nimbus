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
 *   2. Walk every .js and .d.ts file in dist/esm and rewrite bare relative
 *      imports (`from './foo'`) to include explicit `.js` extensions
 *      (`from './foo.js'` or `from './foo/index.js'`). Native Node ESM
 *      resolution requires extensions on relative imports; tsc doesn't add
 *      them. Without this, the ESM build crashes at module load time for
 *      any consumer that doesn't go through a bundler. dist/cjs is left
 *      alone — CJS resolution supports extensionless imports natively.
 */

import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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
// Step 2: add .js extensions to bare relative imports under dist/esm

function isDir(p) {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
}

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

// Matches relative-path specifiers: ".", "..", "./foo", "../foo/bar".
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

function walk(dir, predicate) {
  let count = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      count += walk(full, predicate);
    } else if (entry.isFile() && predicate(entry.name)) {
      if (rewriteFile(full)) count++;
    }
  }
  return count;
}

const esmDir = join(DIST, "esm");
const rewritten = walk(esmDir, (name) => name.endsWith(".js") || name.endsWith(".d.ts"));
console.log(`[postbuild] rewrote imports in ${rewritten} esm file(s)`);
