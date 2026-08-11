#!/usr/bin/env node

/**
 * Renames preconstruct-emitted CJS build artifacts so Node treats them as
 * CommonJS regardless of a package's `"type": "module"` declaration, and
 * rewrites the `require(...)` calls between them to match.
 *
 * Preconstruct's CJS output for an entrypoint is a trio of flat files:
 *
 *   - `<name>.cjs.js`      — the public entry, dispatches on NODE_ENV
 *   - `<name>.cjs.dev.js`  — required by the entry in development
 *   - `<name>.cjs.prod.js` — required by the entry in production
 *
 * All three are plain CJS syntax, but end in `.js`. In a package whose
 * `package.json` declares `"type": "module"`, Node treats every `.js` file
 * as ESM regardless of content, so the entry's own
 * `require("./<name>.cjs.dev.js")` throws `MODULE_NOT_FOUND` (Node can't
 * resolve a `.js` specifier to what it's decided is an ESM module via
 * `require`). Renaming to `.cjs` sidesteps that, since the `.cjs` extension
 * is always CommonJS.
 *
 *   `<name>.cjs.js`      → `<name>.cjs`
 *   `<name>.cjs.dev.js`  → `<name>.cjs.dev.cjs`
 *   `<name>.cjs.prod.js` → `<name>.cjs.prod.cjs`
 *
 * Only files directly inside `distDir` are considered — this targets flat
 * preconstruct entrypoint output, not a nested chunk graph (see
 * `rewrite-cjs-chunk-extensions.mjs` for that case). Requires that point
 * outside `distDir` (e.g. into a sibling sub-entrypoint's own `dist/`) are
 * left untouched: those directories have their own `package.json`, so their
 * `.js` files are unaffected by this package's `"type": "module"`.
 *
 * Usage:
 *   import { fixPreconstructCjsExtensions } from "./rewrite-preconstruct-cjs-extensions.mjs";
 *   const { renamed, filesUpdated } = fixPreconstructCjsExtensions(distDir);
 */

import {
  readFileSync,
  readdirSync,
  renameSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const MAIN_RE = /\.cjs\.js$/;
const DEV_PROD_RE = /\.cjs\.(dev|prod)\.js$/;

/**
 * @param {string} distDir - flat directory containing preconstruct's CJS
 *   entrypoint output (`<name>.cjs.js`, `<name>.cjs.dev.js`, `<name>.cjs.prod.js`)
 * @returns {{ renamed: number, filesUpdated: number }}
 */
export function fixPreconstructCjsExtensions(distDir) {
  const files = readdirSync(distDir).filter((f) =>
    statSync(join(distDir, f)).isFile()
  );

  const renames = new Map();
  for (const file of files) {
    if (DEV_PROD_RE.test(file)) {
      renames.set(file, file.replace(/\.js$/, ".cjs"));
    } else if (MAIN_RE.test(file)) {
      renames.set(file, file.replace(MAIN_RE, ".cjs"));
    }
  }

  if (renames.size === 0) {
    return { renamed: 0, filesUpdated: 0 };
  }

  for (const [oldName, newName] of renames) {
    renameSync(join(distDir, oldName), join(distDir, newName));
  }

  const remaining = readdirSync(distDir).filter(
    (f) => statSync(join(distDir, f)).isFile() && f.endsWith(".cjs")
  );

  let filesUpdated = 0;
  for (const file of remaining) {
    const filePath = join(distDir, file);
    let content = readFileSync(filePath, "utf8");
    let changed = false;
    for (const [oldName, newName] of renames) {
      // Only rewrite relative requires that resolve within distDir
      // (`./<oldName>`), not bare package requires or requires that reach
      // into other directories.
      const needle = `./${oldName}`;
      if (content.includes(needle)) {
        content = content.replaceAll(needle, `./${newName}`);
        changed = true;
      }
    }
    if (changed) {
      writeFileSync(filePath, content);
      filesUpdated++;
    }
  }

  return { renamed: renames.size, filesUpdated };
}
