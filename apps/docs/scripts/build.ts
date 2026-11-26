import { build } from "@commercetools/nimbus-docs-build";
import { execFileSync } from "child_process";
import path from "path";

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

// Render the component illustrations (SVG) from their sources
execFileSync(
  "pnpm",
  [
    "--filter",
    "@commercetools/nimbus",
    "illustrations:generate",
    "--out",
    path.resolve("./src/data/illustrations"),
  ],
  { stdio: "inherit" }
);

try {
  const result = await build(config);

  console.log("\n✨ Documentation build completed successfully!");
  console.log(`   📄 ${result.routeCount} routes generated`);
  console.log(`   🔧 ${result.componentCount} TypeScript components parsed`);
  console.log(`   ⚡ Build took ${(result.duration / 1000).toFixed(2)}s`);
} catch (error) {
  console.error("\n❌ Documentation build failed:");
  console.error(error);
  process.exit(1);
}
