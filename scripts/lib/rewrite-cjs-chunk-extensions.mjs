#!/usr/bin/env node

/**
 * Renames Rolldown-emitted `.cjs.js` chunk files to `.cjs` and rewrites every
 * `require(".../<old-name>")` reference to match.
 *
 * Rolldown names chunks with the template `[name]-[hash].[format].js`. For
 * CJS chunks this produces `<name>-<hash>.cjs.js`. In a `"type": "module"`
 * package, Node treats any `.js` file as ESM regardless of content, so
 * `require("./chunk.cjs.js")` throws `ERR_REQUIRE_ESM` — renaming to `.cjs`
 * sidesteps that, since the `.cjs` extension is always CommonJS.
 *
 * Renaming alone isn't enough: chunks commonly `require()` *other* chunks
 * (not just entry points), and those cross-chunk references embed the old
 * `.cjs.js` name as a literal string. Skipping them leaves a real
 * `MODULE_NOT_FOUND` at runtime — the renamed file no longer matches the
 * string still baked into whichever chunk imported it. This scans every
 * `.cjs` file inside the chunks directory (post-rename) in addition to the
 * caller-supplied entry-point files, so both directions get fixed.
 *
 * Usage:
 *   import { fixCjsChunkExtensions } from "./rewrite-cjs-chunk-extensions.mjs";
 *   const { renamed, filesUpdated } = fixCjsChunkExtensions(distDir, [
 *     join(distDir, "index.cjs"),
 *   ]);
 */

import {
  existsSync,
  readFileSync,
  readdirSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

/**
 * @param {string} distDir - directory containing a `chunks/` subfolder
 * @param {string[]} entryPointCjsFiles - absolute paths to top-level `.cjs`
 *   entry points that may reference chunks (e.g. `dist/index.cjs`)
 * @returns {{ renamed: number, filesUpdated: number }}
 */
export function fixCjsChunkExtensions(distDir, entryPointCjsFiles) {
  const chunksDir = join(distDir, "chunks");
  if (!existsSync(chunksDir)) {
    return { renamed: 0, filesUpdated: 0 };
  }

  const cjsJsChunks = readdirSync(chunksDir).filter((f) =>
    f.endsWith(".cjs.js")
  );
  const renames = new Map();

  for (const oldName of cjsJsChunks) {
    const newName = oldName.replace(/\.cjs\.js$/, ".cjs");
    renameSync(join(chunksDir, oldName), join(chunksDir, newName));
    renames.set(oldName, newName);

    const oldMap = `${oldName}.map`;
    const newMap = `${newName}.map`;
    if (existsSync(join(chunksDir, oldMap))) {
      renameSync(join(chunksDir, oldMap), join(chunksDir, newMap));
    }
  }

  if (renames.size === 0) {
    return { renamed: 0, filesUpdated: 0 };
  }

  // Candidates for cross-references: the caller's entry points, plus every
  // chunk file itself (post-rename) — chunks require each other constantly.
  const chunkFiles = readdirSync(chunksDir)
    .filter((f) => f.endsWith(".cjs"))
    .map((f) => join(chunksDir, f));
  const candidates = [...entryPointCjsFiles, ...chunkFiles];

  let filesUpdated = 0;
  for (const file of candidates) {
    if (!existsSync(file)) continue;
    let content = readFileSync(file, "utf8");
    let changed = false;
    for (const [oldName, newName] of renames) {
      if (content.includes(oldName)) {
        content = content.replaceAll(oldName, newName);
        changed = true;
      }
    }
    if (changed) {
      writeFileSync(file, content);
      filesUpdated++;
    }
  }

  return { renamed: renames.size, filesUpdated };
}
