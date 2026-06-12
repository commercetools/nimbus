#!/usr/bin/env node
/* eslint-disable no-undef -- Node script */
/**
 * Verifies the Vite plugin stubbing mechanism produced correct output.
 *
 * Assertions:
 *  1. dist-vite/ contains exactly one JS asset
 *  2. The bundle does NOT contain any literal @commercetools/nimbus import
 *  3. All three named imports (Button, NimbusProvider, nimbusTheme) appear as
 *     property accesses, proving they resolved through the CJS stub interop
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DIST = new URL("./dist-vite/assets/", import.meta.url);
const assets = readdirSync(DIST).filter((f) => f.endsWith(".js"));

let exitCode = 0;
function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
  } else {
    console.error(`  ✗ ${message}`);
    exitCode = 1;
  }
}

console.log("Verifying Vite plugin output…");

assert(assets.length === 1, `exactly one JS asset (found ${assets.length})`);

const bundle = readFileSync(join(DIST.pathname, assets[0]), "utf8");

assert(
  !bundle.includes("@commercetools/nimbus"),
  "no residual @commercetools/nimbus imports in bundle"
);

for (const name of ["Button", "NimbusProvider", "nimbusTheme"]) {
  assert(
    bundle.includes(`.${name}`),
    `"${name}" appears as a property access on the stub`
  );
}

console.log(exitCode === 0 ? "\nAll checks passed." : "\nSome checks FAILED.");
process.exit(exitCode);
