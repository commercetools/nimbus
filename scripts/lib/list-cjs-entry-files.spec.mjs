import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { listCjsEntryFiles } from "./list-cjs-entry-files.mjs";

let distDir;

beforeEach(() => {
  distDir = mkdtempSync(join(tmpdir(), "nimbus-postbuild-types-entries-"));
});

afterEach(() => {
  rmSync(distDir, { recursive: true, force: true });
});

describe("listCjsEntryFiles", () => {
  it("collects top-level .cjs entry files", () => {
    writeFileSync(join(distDir, "index.cjs"), "");
    writeFileSync(join(distDir, "theme.cjs"), "");
    writeFileSync(join(distDir, "index.d.ts"), "");

    const result = listCjsEntryFiles(distDir);

    expect(result.sort()).toEqual(
      [join(distDir, "index.cjs"), join(distDir, "theme.cjs")].sort()
    );
  });

  it("recurses into nested entry directories (e.g. components/, plugins/)", () => {
    mkdirSync(join(distDir, "components"));
    writeFileSync(join(distDir, "components", "button.cjs"), "");
    writeFileSync(join(distDir, "components", "button.d.ts"), "");
    mkdirSync(join(distDir, "plugins"));
    writeFileSync(join(distDir, "plugins", "webpack.cjs"), "");

    const result = listCjsEntryFiles(distDir);

    expect(result.sort()).toEqual(
      [
        join(distDir, "components", "button.cjs"),
        join(distDir, "plugins", "webpack.cjs"),
      ].sort()
    );
  });

  it("skips the chunks directory entirely", () => {
    writeFileSync(join(distDir, "index.cjs"), "");
    mkdirSync(join(distDir, "chunks"));
    writeFileSync(join(distDir, "chunks", "leaf-abc123.cjs"), "");

    const result = listCjsEntryFiles(distDir);

    expect(result).toEqual([join(distDir, "index.cjs")]);
  });

  it("returns an empty array when there are no .cjs files", () => {
    writeFileSync(join(distDir, "index.d.ts"), "");
    expect(listCjsEntryFiles(distDir)).toEqual([]);
  });
});
