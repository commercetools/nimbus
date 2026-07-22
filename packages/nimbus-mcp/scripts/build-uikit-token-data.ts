/**
 * Reads UI Kit custom properties and builds a camelCase token map with
 * recommended Nimbus categories. Can be used as a prebuild step or run
 * directly via CLI.
 *
 * Usage (CLI):
 *   tsx scripts/build-uikit-token-data.ts [--out <dir>]
 *
 * Defaults to writing `data/uikit-tokens.json` in the nimbus-mcp package root.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { buildUiKitTokenMap } from "../src/processors/uikit-tokens.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(__dirname, "..");
const require = createRequire(import.meta.url);

/**
 * Resolves the path to UI Kit's custom-properties.json from the installed package.
 */
function resolveCustomPropertiesPath(): string {
  const uikitDesignSystem =
    require.resolve("@commercetools-uikit/design-system/package.json");
  return resolve(
    dirname(uikitDesignSystem),
    "materials/custom-properties.json"
  );
}

/**
 * Builds the UI Kit token map and writes it to `data/uikit-tokens.json`.
 *
 * @param outDir - Output directory. Defaults to `<package-root>/data`.
 */
export async function buildUiKitTokenData(outDir?: string) {
  const resolvedOutDir = outDir ?? resolve(PACKAGE_ROOT, "data");

  let customPropertiesPath: string;
  try {
    customPropertiesPath = resolveCustomPropertiesPath();
  } catch {
    console.warn(
      "⚠ @commercetools-uikit/design-system not found — skipping UI Kit token data build."
    );
    await mkdir(resolvedOutDir, { recursive: true });
    await writeFile(resolve(resolvedOutDir, "uikit-tokens.json"), "{}");
    return;
  }

  const raw = await readFile(customPropertiesPath, "utf-8");
  const customProperties = JSON.parse(raw) as Record<string, string>;

  const tokenMap = buildUiKitTokenMap(customProperties);

  await mkdir(resolvedOutDir, { recursive: true });
  const outPath = resolve(resolvedOutDir, "uikit-tokens.json");
  await writeFile(outPath, JSON.stringify(tokenMap, null, 2));

  const totalTokens = Object.keys(tokenMap).length;
  const withCategory = Object.values(tokenMap).filter(
    (e) => e.recommendedCategory !== null
  ).length;

  console.log(
    `Wrote ${totalTokens} UI Kit tokens (${withCategory} with category) → ${outPath}`
  );
}

// Run as CLI when executed directly
const isDirectRun =
  process.argv[1] &&
  resolve(process.argv[1]).includes("build-uikit-token-data");

if (isDirectRun) {
  const args = process.argv.slice(2);
  const outIdx = args.indexOf("--out");
  const outDir =
    outIdx !== -1 && args[outIdx + 1] ? resolve(args[outIdx + 1]) : undefined;

  buildUiKitTokenData(outDir).catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
}
