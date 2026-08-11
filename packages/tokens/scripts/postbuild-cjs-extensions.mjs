#!/usr/bin/env node

/**
 * Post-processes preconstruct's CJS output for `@commercetools/nimbus-tokens`.
 *
 * `packages/tokens/package.json` declares `"type": "module"`, but
 * preconstruct's CJS entrypoint (`dist/commercetools-nimbus-tokens.cjs.js`,
 * which internally `require()`s `.cjs.dev.js` / `.cjs.prod.js` for the
 * dev/prod split) is plain CJS syntax in files ending `.js` — which Node
 * treats as ESM under `"type": "module"`, so the inner `require()` calls
 * throw `MODULE_NOT_FOUND`. This is the same class of bug
 * `scripts/lib/rewrite-cjs-chunk-extensions.mjs` fixes for the nimbus
 * package's Rolldown chunks; here it's preconstruct's flat entrypoint trio
 * instead of a chunk graph, so it's handled by the sibling helper
 * `scripts/lib/rewrite-preconstruct-cjs-extensions.mjs`.
 *
 * Only `dist/` (the root `index.ts` entrypoint) is affected. The
 * `generated/ts/dist/` and `generated/chakra/dist/` sub-entrypoints each ship
 * their own `package.json` with no `"type"` field, so Node already treats
 * their `.js` files as CommonJS by default — nothing to fix there.
 *
 * After renaming, also duplicates the `.cjs.d.ts` declaration file to
 * `.d.cts`: TypeScript's node16/nodenext resolution looks for a `.d.cts`
 * sibling for a `.cjs` runtime file, not a `.cjs.d.ts` one.
 *
 * Run after `preconstruct build` (which emits the `dist/` this script
 * rewrites). Idempotent: safe to run against an already-fixed `dist/`.
 */

import { copyFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { fixPreconstructCjsExtensions } from "../../../scripts/lib/rewrite-preconstruct-cjs-extensions.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const DIST = join(__dirname, "..", "dist");

const { renamed, filesUpdated } = fixPreconstructCjsExtensions(DIST);
if (renamed > 0) {
  console.log(
    `[postbuild-cjs-extensions] renamed ${renamed} CJS file(s): .cjs.js → .cjs (updated ${filesUpdated} referencing file(s))`
  );
}

const cjsDts = join(DIST, "commercetools-nimbus-tokens.cjs.d.ts");
const dCts = join(DIST, "commercetools-nimbus-tokens.d.cts");
if (existsSync(cjsDts)) {
  copyFileSync(cjsDts, dCts);
  console.log(
    `[postbuild-cjs-extensions] ${relative(DIST, cjsDts)} → ${relative(DIST, dCts)}`
  );
}
