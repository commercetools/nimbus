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

import {
  copyFileSync,
  existsSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
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

const ENTRY_POINTS = [
  "index",
  "setup-jsdom-polyfills",
  "plugins/webpack",
  "plugins/vite",
  "plugins/stub",
];

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

// ---------------------------------------------------------------------------
// Step 4: fix stub runtime content
//
// Rolldown compiles `export {}` to empty files. The stub must be CJS
// (`module.exports = {}`) so webpack's CJS-to-ESM interop silently resolves
// missing named imports to `undefined` instead of erroring.

const STUB_CJS = "module.exports = {};\n";
writeFileSync(join(DIST, "plugins", "stub.cjs"), STUB_CJS);
console.log(`[postbuild-types] wrote CJS stub content to plugins/stub.cjs`);

// ---------------------------------------------------------------------------
// Step 5: fix CJS chunk extensions
//
// Rolldown names chunks with the template `[name]-[hash].[format].js`.
// For CJS chunks this produces `.cjs.js`. In a `type: "module"` package,
// Node treats `.js` files as ESM, so `require("./chunk.cjs.js")` fails.
// Rename `.cjs.js` → `.cjs` and update references in CJS entry points.

const CHUNKS_DIR = join(DIST, "chunks");
if (existsSync(CHUNKS_DIR)) {
  const cjsChunks = readdirSync(CHUNKS_DIR).filter((f) =>
    f.endsWith(".cjs.js")
  );
  const renames = new Map();

  for (const oldName of cjsChunks) {
    const newName = oldName.replace(/\.cjs\.js$/, ".cjs");
    renameSync(join(CHUNKS_DIR, oldName), join(CHUNKS_DIR, newName));
    renames.set(oldName, newName);

    // Rename the sourcemap too
    const oldMap = oldName + ".map";
    const newMap = newName + ".map";
    if (existsSync(join(CHUNKS_DIR, oldMap))) {
      renameSync(join(CHUNKS_DIR, oldMap), join(CHUNKS_DIR, newMap));
    }
  }

  // Update require() references in all CJS entry points
  if (renames.size > 0) {
    const cjsEntries = [
      join(DIST, "index.cjs"),
      ...ENTRY_POINTS.filter((e) => e !== "index").map((e) =>
        join(DIST, `${e}.cjs`)
      ),
    ];

    for (const entry of cjsEntries) {
      if (!existsSync(entry)) continue;
      let content = readFileSync(entry, "utf8");
      let changed = false;
      for (const [oldName, newName] of renames) {
        if (content.includes(oldName)) {
          content = content.replaceAll(oldName, newName);
          changed = true;
        }
      }
      if (changed) writeFileSync(entry, content);
    }

    console.log(
      `[postbuild-types] renamed ${renames.size} CJS chunk(s): .cjs.js → .cjs`
    );
  }
}
