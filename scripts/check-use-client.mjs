#!/usr/bin/env node

/**
 * Verifies that every entry-point file in the Nimbus dist has a `"use client"`
 * directive at the top. This ensures components work when imported from React
 * Server Components (Next.js App Router, etc.).
 *
 * The directive is injected by the `useClientDirectivePlugin` in vite.config.ts.
 * This script catches regressions — run it after `pnpm build`.
 *
 * Usage:
 *   node scripts/check-use-client.mjs
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const DIST = join(__dirname, "..", "packages", "nimbus", "dist");

const SKIP = ["setup-jsdom-polyfills"];

if (!existsSync(DIST)) {
  console.error(
    `FAIL  dist directory not found at ${DIST}\n` +
      `       Run "pnpm --filter @commercetools/nimbus build" first.`
  );
  process.exit(1);
}

function checkFile(filePath) {
  if (!existsSync(filePath)) {
    console.error(`FAIL  ${filePath} does not exist`);
    return false;
  }
  const content = readFileSync(filePath, "utf-8");
  return content.startsWith('"use client"');
}

let failures = 0;
let checked = 0;

// Check main entry points
for (const ext of ["es.js", "cjs"]) {
  const file = join(DIST, `index.${ext}`);
  checked++;
  if (!checkFile(file)) {
    console.error(`FAIL  index.${ext} missing "use client"`);
    failures++;
  }
}

// Check component entry points.
// Pattern entries (actions, dialogs, fields, pages) are also routed to
// dist/components/ by lib.fileName — they are covered by this scan.
const componentsDir = join(DIST, "components");
for (const file of readdirSync(componentsDir)) {
  if (!file.endsWith(".es.js") && !file.endsWith(".cjs")) continue;
  const fullPath = join(componentsDir, file);

  checked++;
  if (!checkFile(fullPath)) {
    console.error(`FAIL  components/${file} missing "use client"`);
    failures++;
  }
}

// Verify excluded files do NOT have the directive
for (const name of SKIP) {
  for (const ext of ["es.js", "cjs"]) {
    const file = join(DIST, `${name}.${ext}`);
    if (!existsSync(file)) continue;
    const content = readFileSync(file, "utf-8");
    if (content.startsWith('"use client"')) {
      console.error(
        `FAIL  ${name}.${ext} has "use client" but should not (test utility)`
      );
      failures++;
    }
  }
}

if (failures > 0) {
  console.error(`\n${failures} file(s) failed the "use client" check.`);
  process.exit(1);
} else {
  console.log(`OK  ${checked} entry points have "use client" directive.`);
}
