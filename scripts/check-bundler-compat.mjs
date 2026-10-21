#!/usr/bin/env node

/**
 * Bundler compatibility check for the `@commercetools/nimbus` dist.
 *
 * Validates the bundled code itself — what `check:package-shape` (attw +
 * publint) does not look at. Two checks run against the built ESM output:
 *
 *   - Strict webpack consumer build: bundles the public entry points with
 *     webpack 5 the way Merchant Center applications do (`mc-scripts`):
 *     `module.strictExportPresence: true`, and warnings count as failures,
 *     because `mc-scripts` treats warnings as errors in CI. Catches imports
 *     webpack cannot resolve statically, such as the
 *     `export 'module.exports' (imported as 'i') was not found in 'react'`
 *     error that 3.7.0 shipped with.
 *   - `require` helper scan: Rolldown bundles a runtime `require` helper when
 *     bundled CJS code calls `require()` for an external module. The helper
 *     throws in browsers ("Calling `require` for ... in an environment that
 *     doesn't expose the `require` function"). See #1451. The helper's name
 *     is shortened in the output (`__require` in #1451, a single letter now),
 *     so the scan matches its error message, which Rolldown keeps verbatim.
 *
 * Both checks always run; findings are listed in the summary. Exits non-zero
 * on any finding so CI blocks the merge.
 *
 * Usage:
 *   node scripts/check-bundler-compat.mjs
 *
 * Requires the nimbus package to be built first (its dist/ must exist).
 */

import {
  mkdtempSync,
  rmSync,
  existsSync,
  readdirSync,
  readFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import webpack from "webpack";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");

const NIMBUS_DIST = join(ROOT, "packages/nimbus/dist");

// Public runtime entry points from the `exports` map in
// packages/nimbus/package.json, imported by package name so webpack resolves
// them through the `exports` map like a consumer app does.
const ENTRIES = {
  index: "@commercetools/nimbus",
  theme: "@commercetools/nimbus/theme",
};

// Fingerprints of Rolldown's runtime `require` helper in the ESM output.
const REQUIRE_HELPER_PATTERNS = [
  "doesn't expose the `require` function",
  "__require(",
];

const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const CYAN = "\x1b[36m";
const RESET = "\x1b[0m";

function header(text) {
  const bar = "─".repeat(Math.max(0, 72 - text.length - 2));
  return `\n${BOLD}${CYAN}${text}${RESET} ${DIM}${bar}${RESET}\n`;
}

function runWebpack(config) {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => (err ? reject(err) : resolve(stats)));
  });
}

async function checkWebpackBuild() {
  process.stdout.write(header("Strict webpack consumer build"));
  const outDir = mkdtempSync(join(tmpdir(), "nimbus-bundler-compat-"));
  try {
    const stats = await runWebpack({
      mode: "production",
      target: "web",
      context: ROOT,
      entry: ENTRIES,
      output: { path: outDir },
      module: { strictExportPresence: true },
      optimization: { minimize: false },
      devtool: false,
      performance: { hints: false },
    });
    if (!stats.hasErrors() && !stats.hasWarnings()) {
      console.log(
        `${GREEN}✓ webpack compiled without errors or warnings${RESET}`
      );
      return true;
    }
    console.log(stats.toString({ all: false, errors: true, warnings: true }));
    console.log(`${RED}✗ webpack reported errors or warnings${RESET}`);
    return false;
  } catch (err) {
    console.log(`${RED}✗ webpack failed to run: ${err.message}${RESET}`);
    return false;
  } finally {
    rmSync(outDir, { recursive: true, force: true });
  }
}

// ESM chunk names: `[format]` renders as `es` today; `esm` is accepted too in
// case a Vite or Rolldown upgrade changes it.
const ESM_FILE = /\.esm?\.js$/;

function listEsFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listEsFiles(path));
    else if (ESM_FILE.test(entry.name)) files.push(path);
  }
  return files;
}

function checkRequireHelper() {
  process.stdout.write(header("require helper scan"));
  const files = listEsFiles(NIMBUS_DIST);
  // Entry files are named by `lib.fileName`, chunks by `[format]`. The
  // runtime helper lives in a chunk, so fail instead of passing on a scan
  // that saw no chunks because their naming changed.
  const chunksDir = join(NIMBUS_DIST, "chunks");
  if (!files.some((file) => file.startsWith(chunksDir))) {
    console.log(
      `${RED}✗ no *.es.js or *.esm.js chunks in ${relative(ROOT, chunksDir)}: the chunk naming changed, update ESM_FILE${RESET}`
    );
    return false;
  }
  const hits = [];
  for (const file of files) {
    readFileSync(file, "utf8")
      .split("\n")
      .forEach((line, index) => {
        if (REQUIRE_HELPER_PATTERNS.some((pattern) => line.includes(pattern))) {
          hits.push(`${relative(ROOT, file)}:${index + 1}`);
        }
      });
  }
  if (hits.length === 0) {
    console.log(
      `${GREEN}✓ no require helper in ${files.length} ESM files${RESET}`
    );
    return true;
  }
  for (const hit of hits) console.log(`  ${hit}`);
  console.log(
    `${RED}✗ Rolldown's require helper is in the ESM output: bundled CJS code calls require() for an external module${RESET}`
  );
  return false;
}

async function main() {
  if (!existsSync(join(NIMBUS_DIST, "index.es.js"))) {
    console.error(
      `${RED}✗ ${relative(ROOT, NIMBUS_DIST)}/index.es.js not found. Run \`pnpm build:packages\` first.${RESET}`
    );
    process.exit(1);
  }

  const failures = [];
  if (!(await checkWebpackBuild()))
    failures.push("strict webpack consumer build");
  if (!checkRequireHelper()) failures.push("require helper scan");

  process.stdout.write(header("Summary"));
  if (failures.length === 0) {
    console.log(`${GREEN}Both checks passed.${RESET}`);
    process.exit(0);
  }
  console.log(`${RED}Findings:${RESET}`);
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
}

main();
