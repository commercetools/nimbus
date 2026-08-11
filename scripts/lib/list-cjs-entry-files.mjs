#!/usr/bin/env node

/**
 * Recursively collects every CJS entry-point file (`*.cjs`) under `distDir`,
 * skipping the top-level `chunks/` directory.
 *
 * `dist/chunks/` holds shared code split out of entry points by the
 * bundler — those files are targets referenced BY entry points (via
 * `require()`), not entry points themselves, so they're excluded here and
 * handled separately by `rewrite-cjs-chunk-extensions.mjs`.
 *
 * Every other `.cjs` file anywhere under `dist/` is a real entry point:
 * `dist/index.cjs`, `dist/theme.cjs`, `dist/plugins/*.cjs`, and one
 * `dist/components/<name>.cjs` per component/pattern glob'd by
 * `vite.config.ts`'s `createEntries()` — all of which may contain
 * `require()` calls into `dist/chunks/` and so need their chunk references
 * fixed up alongside the chunks themselves.
 *
 * Usage:
 *   import { listCjsEntryFiles } from "./list-cjs-entry-files.mjs";
 *   const cjsEntryFiles = listCjsEntryFiles(distDir);
 */

import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * @param {string} distDir
 * @returns {string[]} absolute paths to every entry `.cjs` file under distDir
 */
export function listCjsEntryFiles(distDir) {
  const results = [];

  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      if (dir === distDir && name === "chunks") continue;

      const full = join(dir, name);
      if (statSync(full).isDirectory()) {
        walk(full);
      } else if (name.endsWith(".cjs")) {
        results.push(full);
      }
    }
  };

  walk(distDir);
  return results;
}
