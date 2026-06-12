#!/usr/bin/env node
/* eslint-disable no-undef -- Node script */
/**
 * Verifies the Webpack plugin stubbing mechanism produced correct output.
 *
 * Assertions:
 *  1. dist-webpack/bundle.js exists
 *  2. The bundle does NOT contain any literal @commercetools/nimbus import
 *  3. All three named imports (Button, NimbusProvider, nimbusTheme) appear as
 *     property accesses, proving they resolved through the CJS stub
 */
import { readFileSync } from "node:fs";

const BUNDLE = new URL("./dist-webpack/bundle.js", import.meta.url);

let exitCode = 0;
function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
  } else {
    console.error(`  ✗ ${message}`);
    exitCode = 1;
  }
}

console.log("Verifying Webpack plugin output…");

let bundle;
try {
  bundle = readFileSync(BUNDLE, "utf8");
  assert(true, "dist-webpack/bundle.js exists");
} catch {
  assert(false, "dist-webpack/bundle.js exists");
  process.exit(1);
}

assert(
  !bundle.includes("@commercetools/nimbus"),
  "no residual @commercetools/nimbus imports in bundle"
);

for (const name of ["Button", "NimbusProvider", "nimbusTheme"]) {
  assert(
    bundle.includes(`.${name}`) || bundle.includes(`["${name}"]`),
    `"${name}" appears as a property access on the stub`
  );
}

console.log(exitCode === 0 ? "\nAll checks passed." : "\nSome checks FAILED.");
process.exit(exitCode);
