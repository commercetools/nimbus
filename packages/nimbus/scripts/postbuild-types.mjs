#!/usr/bin/env node

/**
 * Duplicates the entry-point .d.ts files to .d.cts so the CJS path in
 * package.json `exports[*].require.types` resolves correctly.
 *
 * Background: nimbus's package.json sets "type": "module", so TypeScript reads
 * any .d.ts as ESM-flavored regardless of which path imports it. That confuses
 * CJS consumers — their require() returns a CJS module, but the types describe
 * an ESM one ("Masquerading as ESM" finding from @arethetypeswrong/cli). The
 * .d.cts extension overrides this: TS treats .d.cts as CJS-flavored
 * unconditionally, matching the runtime shape rollup emits.
 *
 * The file contents are identical; only the extension changes semantics.
 */

import { copyFileSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const DIST = join(__dirname, "..", "dist");

// vite-plugin-dts preserves src/ subdirs in dist/, so this entry's .d.ts lands
// at dist/test/setup-jsdom-polyfills.d.ts. The runtime files live flat in
// dist/, so the .d.ts needs to be relocated to match before consumers can
// resolve it via the package.json `exports` map.
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
  console.log(`[postbuild-types] relocated ${from} → ${to}`);
}

// Strip the now-unused dist/test/ directory so it doesn't ship in the tarball.
rmSync(join(DIST, "test"), { recursive: true, force: true });

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
