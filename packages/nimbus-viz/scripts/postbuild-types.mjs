// Post-processes the .d.ts tree emitted by vite-plugin-dts so the published
// type surface matches what tsup produced before the Vite switch. Two steps
// only — viz is a single-entry package, so it needs none of nimbus's
// relocate / plugins-stub / theme-typegen steps.
//
//   1. Add explicit `.js` extensions to bare relative imports in every emitted
//      .d.ts. Without this, @arethetypeswrong/cli (run by check:package-shape)
//      reports InternalResolutionError under moduleResolution: nodenext.
//   2. Duplicate the top-level index.d.ts to index.d.cts for the CJS `require`
//      types condition in package.json `exports`.
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
