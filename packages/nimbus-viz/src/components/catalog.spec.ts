import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import type { Dirent } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

/**
 * Catalog-consistency guard. Every directory under `src/components/` must be a
 * non-empty module reachable from the public API, so the on-disk chart set, the
 * barrel, and the docs catalog can't silently drift apart (this is the check
 * that would have caught the empty `ridgeline-plot/` stub). The authoritative
 * component count lives in the README catalog table.
 */
const componentsDir = dirname(fileURLToPath(import.meta.url)); // …/src/components
const srcDir = dirname(componentsDir); // …/src
const barrel = readFileSync(join(srcDir, "index.ts"), "utf8");

// data-table is public via the selection barrel, not the components section.
const EXPORTED_VIA_SELECTION = new Set(["data-table"]);

const componentDirs: string[] = readdirSync(componentsDir, {
  withFileTypes: true,
})
  .filter((entry: Dirent) => entry.isDirectory())
  .map((entry: Dirent) => entry.name)
  .sort();

// it.each wants tuple rows; wrap each name in a single-element tuple.
const rows = componentDirs.map((name) => [name] as const);

describe("component catalog consistency", () => {
  it("finds the expected chart set on disk", () => {
    // A floor, not an exact count — new charts are welcome, empty stubs are not.
    expect(componentDirs.length).toBeGreaterThanOrEqual(45);
  });

  it.each(rows)("'%s' is a non-empty component directory", (name) => {
    const files = readdirSync(join(componentsDir, name));
    expect(
      files.length,
      `src/components/${name}/ is empty — leftover stub? Remove it or implement it.`
    ).toBeGreaterThan(0);
  });

  it.each(rows)("'%s' is reachable from the public API", (name) => {
    const reachable =
      barrel.includes(`from "./components/${name}"`) ||
      EXPORTED_VIA_SELECTION.has(name);
    expect(
      reachable,
      `src/components/${name}/ has no barrel export in src/index.ts (nor a known re-export).`
    ).toBe(true);
  });
});
