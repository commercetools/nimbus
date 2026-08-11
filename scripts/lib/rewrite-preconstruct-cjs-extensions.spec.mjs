import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fixPreconstructCjsExtensions } from "./rewrite-preconstruct-cjs-extensions.mjs";

let distDir;

beforeEach(() => {
  distDir = mkdtempSync(join(tmpdir(), "nimbus-tokens-postbuild-"));
});

afterEach(() => {
  rmSync(distDir, { recursive: true, force: true });
});

describe("fixPreconstructCjsExtensions", () => {
  it("renames the main .cjs.js file to .cjs, and the dev/prod .cjs.*.js files to .cjs.*.cjs", () => {
    writeFileSync(
      join(distDir, "pkg.cjs.js"),
      "'use strict';\n" +
        'if (process.env.NODE_ENV === "production") {\n' +
        '  module.exports = require("./pkg.cjs.prod.js");\n' +
        "} else {\n" +
        '  module.exports = require("./pkg.cjs.dev.js");\n' +
        "}\n"
    );
    writeFileSync(join(distDir, "pkg.cjs.dev.js"), "module.exports = 1;\n");
    writeFileSync(join(distDir, "pkg.cjs.prod.js"), "module.exports = 2;\n");

    const result = fixPreconstructCjsExtensions(distDir);

    expect(result.renamed).toBe(3);
    expect(readFileSync(join(distDir, "pkg.cjs"), "utf8")).toContain(
      'require("./pkg.cjs.prod.cjs")'
    );
    expect(readFileSync(join(distDir, "pkg.cjs"), "utf8")).toContain(
      'require("./pkg.cjs.dev.cjs")'
    );
    expect(readFileSync(join(distDir, "pkg.cjs"), "utf8")).not.toContain(
      ".cjs.js"
    );
    expect(readFileSync(join(distDir, "pkg.cjs.dev.cjs"), "utf8")).toBe(
      "module.exports = 1;\n"
    );
    expect(readFileSync(join(distDir, "pkg.cjs.prod.cjs"), "utf8")).toBe(
      "module.exports = 2;\n"
    );
  });

  it("leaves bare/non-relative require() calls to other packages untouched", () => {
    writeFileSync(
      join(distDir, "pkg.cjs.js"),
      'const other = require("some-package");\n' +
        'module.exports = require("./pkg.cjs.dev.js");\n'
    );
    writeFileSync(join(distDir, "pkg.cjs.dev.js"), "module.exports = 1;\n");

    fixPreconstructCjsExtensions(distDir);

    expect(readFileSync(join(distDir, "pkg.cjs"), "utf8")).toContain(
      'require("some-package")'
    );
  });

  it("leaves requires into other directories (e.g. sub-entrypoints) untouched", () => {
    writeFileSync(
      join(distDir, "pkg.cjs.js"),
      "'use strict';\n" +
        'var a = require("../other/dist/other-pkg.cjs.dev.js");\n' +
        'module.exports = require("./pkg.cjs.dev.js");\n'
    );
    writeFileSync(join(distDir, "pkg.cjs.dev.js"), "module.exports = 1;\n");

    fixPreconstructCjsExtensions(distDir);

    const content = readFileSync(join(distDir, "pkg.cjs"), "utf8");
    expect(content).toContain('require("../other/dist/other-pkg.cjs.dev.js")');
    expect(content).toContain('require("./pkg.cjs.dev.cjs")');
  });

  it("is a no-op when there are no .cjs.js files", () => {
    writeFileSync(join(distDir, "already-fine.cjs"), "module.exports = {};\n");
    const result = fixPreconstructCjsExtensions(distDir);
    expect(result).toEqual({ renamed: 0, filesUpdated: 0 });
  });

  it("is idempotent: running it twice does not error or change anything further", () => {
    writeFileSync(
      join(distDir, "pkg.cjs.js"),
      'module.exports = require("./pkg.cjs.dev.js");\n'
    );
    writeFileSync(join(distDir, "pkg.cjs.dev.js"), "module.exports = 1;\n");

    fixPreconstructCjsExtensions(distDir);
    const second = fixPreconstructCjsExtensions(distDir);

    expect(second).toEqual({ renamed: 0, filesUpdated: 0 });
  });
});
