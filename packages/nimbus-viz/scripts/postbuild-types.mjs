// Post-processes the emitted .d.ts tree:
//   1. Add explicit `.js` extensions to relative imports (attw requires them
//      under moduleResolution: nodenext).
//   2. Write index.d.cts for the CJS `require` types condition.
import { copyFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { walkAndRewriteImports } from "../../../scripts/lib/rewrite-relative-imports.mjs";

const distDir = fileURLToPath(new URL("../dist", import.meta.url));

const rewritten = walkAndRewriteImports(distDir, (name) =>
  name.endsWith(".d.ts")
);
console.log(`[postbuild-types] rewrote relative imports in ${rewritten} file(s)`);

const indexDts = join(distDir, "index.d.ts");
if (existsSync(indexDts)) {
  copyFileSync(indexDts, join(distDir, "index.d.cts"));
  console.log("[postbuild-types] wrote index.d.cts");
} else {
  throw new Error(
    `[postbuild-types] expected ${indexDts} to exist after the dts build`
  );
}
