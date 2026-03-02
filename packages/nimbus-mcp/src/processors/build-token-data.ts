#!/usr/bin/env node
/**
 * CLI script that reads tokens.json and writes the flattened output to the
 * bundled data directory.
 *
 * Usage:
 *   tsx src/processors/build-token-data.ts [--out <dir>]
 *
 * Defaults to writing `data/tokens.json` in the nimbus-mcp package root.
 */
import { writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { flattenTokensFromFile } from "./flatten-tokens.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(__dirname, "../..");

async function main() {
  const args = process.argv.slice(2);
  const outIdx = args.indexOf("--out");
  const outDir =
    outIdx !== -1 && args[outIdx + 1]
      ? resolve(args[outIdx + 1])
      : resolve(PACKAGE_ROOT, "data");

  console.log("Flattening tokens…");
  const data = await flattenTokensFromFile();

  await mkdir(outDir, { recursive: true });
  const outPath = resolve(outDir, "tokens.json");
  await writeFile(outPath, JSON.stringify(data, null, 2));

  console.log(
    `Wrote ${data.tokens.length} tokens (${Object.keys(data.byCategory).length} categories) → ${outPath}`
  );
  console.log(
    `Reverse-lookup entries: ${Object.keys(data.reverseLookup).length}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
