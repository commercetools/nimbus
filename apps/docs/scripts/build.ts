import { build, parseTypes } from "@commercetools/nimbus-docs-build";
import fs from "fs/promises";
import path from "path";

// The core build extracts prop types from the nimbus barrel only. Chart docs
// (<PropsTable id="BarChart" />) live in @commercetools/nimbus-viz, whose
// components are not reachable from that index — so we extract them separately
// and merge into the same types dir + manifest below.
const vizComponentIndexPath = path.resolve(
  "../../packages/nimbus-viz/src/index.ts"
);

// Configuration for the documentation build
const config = {
  sources: {
    packagesDir: path.resolve("../../packages"),
    componentIndexPath: path.resolve("../../packages/nimbus/src/index.ts"),
  },
  output: {
    routesDir: path.resolve("./src/data/routes"),
    manifestPath: path.resolve("./src/data/route-manifest.json"),
    searchIndexPath: path.resolve("./src/data/search-index.json"),
    typesDir: path.resolve("./src/data/types"),
  },
  cache: {
    enabled: true,
    cacheDir: path.resolve("./.cache"),
  },
  validation: {
    enabled: true,
    strict: false,
  },
};

// Run the build
console.log("🚀 Building documentation...\n");

/**
 * Extend the props-table type manifest to cover @commercetools/nimbus-viz.
 *
 * `build()` above extracts types from `nimbus/src/index.ts` only, so chart
 * components are missing from `types/manifest.json` and `<PropsTable id="…" />`
 * on a chart doc renders "component not found". We run react-docgen-typescript
 * over the viz barrel and merge each real component into the same types dir.
 *
 * Add-only on name collisions: a name already claimed by core nimbus is left
 * untouched so no existing props table changes. (Verified: none of the 47 viz
 * chart components collide with a core export.) Non-component exports
 * (constants, hooks, types) are skipped — PascalCase name + at least one prop.
 */
async function mergeVizComponentTypes(typesDir: string): Promise<number> {
  const vizDocs = await parseTypes({
    sources: { packagesDir: "", componentIndexPath: vizComponentIndexPath },
  });

  const manifestPath = path.join(typesDir, "manifest.json");
  const manifest: Record<string, string> = JSON.parse(
    await fs.readFile(manifestPath, "utf8")
  );

  let added = 0;
  for (const doc of vizDocs) {
    const name = doc.displayName;
    if (!name || !/^[A-Z]/.test(name)) continue; // skip hooks/constants
    if (!doc.props || Object.keys(doc.props).length === 0) continue;
    if (manifest[name]) continue; // never clobber a core component
    await fs.writeFile(
      path.join(typesDir, `${name}.json`),
      JSON.stringify(doc, null, 2)
    );
    manifest[name] = name;
    added += 1;
  }

  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  return added;
}

try {
  const result = await build(config);

  const vizComponentCount = await mergeVizComponentTypes(
    config.output.typesDir
  );

  console.log("\n✨ Documentation build completed successfully!");
  console.log(`   📄 ${result.routeCount} routes generated`);
  console.log(`   🔧 ${result.componentCount} TypeScript components parsed`);
  console.log(`   📊 ${vizComponentCount} nimbus-viz components parsed`);
  console.log(`   ⚡ Build took ${(result.duration / 1000).toFixed(2)}s`);
} catch (error) {
  console.error("\n❌ Documentation build failed:");
  console.error(error);
  process.exit(1);
}
