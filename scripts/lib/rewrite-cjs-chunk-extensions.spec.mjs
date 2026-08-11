import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fixCjsChunkExtensions } from "./rewrite-cjs-chunk-extensions.mjs";

let distDir;
let chunksDir;

beforeEach(() => {
  distDir = mkdtempSync(join(tmpdir(), "nimbus-postbuild-types-"));
  chunksDir = join(distDir, "chunks");
  mkdirSync(chunksDir);
});

afterEach(() => {
  rmSync(distDir, { recursive: true, force: true });
});

describe("fixCjsChunkExtensions", () => {
  it("renames .cjs.js chunk files to .cjs (and their sourcemaps)", () => {
    writeFileSync(
      join(chunksDir, "leaf-abc123.cjs.js"),
      "module.exports = {};\n"
    );
    writeFileSync(join(chunksDir, "leaf-abc123.cjs.js.map"), "{}");

    const result = fixCjsChunkExtensions(distDir, []);

    expect(result.renamed).toBe(1);
    expect(readFileSync(join(chunksDir, "leaf-abc123.cjs"), "utf8")).toBe(
      "module.exports = {};\n"
    );
    expect(readFileSync(join(chunksDir, "leaf-abc123.cjs.map"), "utf8")).toBe(
      "{}"
    );
  });

  it("rewrites chunk-to-chunk require() references, not just entry points", () => {
    // Regression case: a chunk that requires another chunk (not an entry
    // point) must also have its require() string updated, otherwise the
    // renamed target no longer matches the literal string on disk.
    writeFileSync(
      join(chunksDir, "parent-hash1.cjs.js"),
      'const { leaf } = require("./leaf-hash2.cjs.js");\nmodule.exports = { leaf };\n'
    );
    writeFileSync(
      join(chunksDir, "leaf-hash2.cjs.js"),
      "module.exports = { leaf: true };\n"
    );

    const result = fixCjsChunkExtensions(distDir, []);

    expect(result.renamed).toBe(2);
    const parentContent = readFileSync(
      join(chunksDir, "parent-hash1.cjs"),
      "utf8"
    );
    expect(parentContent).toContain('require("./leaf-hash2.cjs")');
    expect(parentContent).not.toContain(".cjs.js");
  });

  it("rewrites references from top-level entry-point .cjs files", () => {
    writeFileSync(
      join(chunksDir, "chunk-hash3.cjs.js"),
      "module.exports = {};\n"
    );
    const indexFile = join(distDir, "index.cjs");
    writeFileSync(
      indexFile,
      'module.exports = require("./chunks/chunk-hash3.cjs.js");\n'
    );

    fixCjsChunkExtensions(distDir, [indexFile]);

    expect(readFileSync(indexFile, "utf8")).toBe(
      'module.exports = require("./chunks/chunk-hash3.cjs");\n'
    );
  });

  it("is a no-op when there is no chunks directory", () => {
    rmSync(chunksDir, { recursive: true, force: true });
    const result = fixCjsChunkExtensions(distDir, []);
    expect(result).toEqual({ renamed: 0, filesUpdated: 0 });
  });

  it("is a no-op when no .cjs.js chunks exist", () => {
    writeFileSync(
      join(chunksDir, "already-fine.cjs"),
      "module.exports = {};\n"
    );
    const result = fixCjsChunkExtensions(distDir, []);
    expect(result).toEqual({ renamed: 0, filesUpdated: 0 });
  });
});
