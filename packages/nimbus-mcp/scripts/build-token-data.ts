/**
 * Reads theme tokens and writes the flattened output to the bundled data
 * directory. Can be used as a prebuild step or run directly via CLI.
 *
 * Usage (CLI):
 *   tsx scripts/build-token-data.ts [--out <dir>]
 *
 * Defaults to writing `data/tokens.json` in the nimbus-mcp package root.
 */
import { writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { flattenTokensFromFile } from "../src/processors/flatten-tokens.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(__dirname, "..");

/**
 * Flattens design tokens and writes the result to `data/tokens.json`.
 *
 * @param outDir - Output directory. Defaults to `<package-root>/data`.
 */
export async function buildTokenData(outDir?: string) {
  const resolvedOutDir = outDir ?? resolve(PACKAGE_ROOT, "data");

  const data = await flattenTokensFromFile();

  await mkdir(resolvedOutDir, { recursive: true });
  const outPath = resolve(resolvedOutDir, "tokens.json");
  await writeFile(outPath, JSON.stringify(data, null, 2));

  console.log(
    `Wrote ${data.tokens.length} tokens (${Object.keys(data.byCategory).length} categories) → ${outPath}`
  );
  console.log(
    `Reverse-lookup entries: ${Object.keys(data.reverseLookup).length}`
  );
}

// Run as CLI when executed directly
const isDirectRun =
  process.argv[1] && resolve(process.argv[1]).includes("build-token-data");

if (isDirectRun) {
  const args = process.argv.slice(2);
  const outIdx = args.indexOf("--out");
  const outDir =
    outIdx !== -1 && args[outIdx + 1] ? resolve(args[outIdx + 1]) : undefined;

  buildTokenData(outDir).catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
}
