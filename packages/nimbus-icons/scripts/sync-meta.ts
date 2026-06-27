#!/usr/bin/env tsx
/**
 * Generate search metadata for the icon set.
 *
 * No Material npm package ships synonym tags — the canonical source of
 * `tags` / `categories` / `popularity` is Google's metadata endpoint. This
 * script fetches that feed, joins it against the icons we actually ship
 * (the svgr-generated barrel), merges hand-authored metadata for the custom
 * icons, and writes `src/meta.generated.json` (committed).
 *
 * Run on icon version bumps (after `build:icons`), NOT as part of `build` —
 * the build path stays network-free. Mirrors the registry `sync` scripts.
 *
 *   pnpm --filter @commercetools/nimbus-icons sync:meta
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { customIconsMeta, type IconMeta } from "../src/custom-icons-meta";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const SRC = join(__dirname, "..", "src");

const GOOGLE_METADATA_URL =
  "https://fonts.google.com/metadata/icons?incomplete=true&key=material_symbols";

/** Google returns JSON guarded by an XSSI prefix that must be stripped. */
async function fetchGoogleMetadata(): Promise<Map<string, IconMeta>> {
  const res = await fetch(GOOGLE_METADATA_URL);
  if (!res.ok) {
    throw new Error(
      `Google metadata fetch failed: ${res.status} ${res.statusText}`
    );
  }
  const raw = (await res.text()).replace(/^\)\]\}'/, "").trimStart();
  const { icons } = JSON.parse(raw) as {
    icons: Array<{
      name: string;
      tags?: string[];
      categories?: string[];
      popularity?: number;
    }>;
  };
  const map = new Map<string, IconMeta>();
  for (const icon of icons) {
    map.set(icon.name, {
      tags: icon.tags ?? [],
      categories: icon.categories ?? [],
      popularity: icon.popularity,
    });
  }
  return map;
}

/**
 * Parse the svgr-generated barrel to get the authoritative
 * export-name ↔ kebab-filename pairs. Avoids re-deriving svgr's naming
 * (e.g. digit-leading icons export as `Svg10k`).
 */
function readMaterialIconExports(): Array<{
  exportName: string;
  file: string;
}> {
  const index = readFileSync(join(SRC, "material-icons", "index.ts"), "utf8");
  const re = /export\s*\{\s*default as (\w+)\s*\}\s*from\s*"\.\/([\w-]+)"/g;
  const pairs: Array<{ exportName: string; file: string }> = [];
  for (const m of index.matchAll(re)) {
    pairs.push({ exportName: m[1], file: m[2] });
  }
  return pairs;
}

async function main() {
  const google = await fetchGoogleMetadata();
  const exports = readMaterialIconExports();

  const metadata: Record<string, IconMeta> = {};
  const misses: string[] = [];

  for (const { exportName, file } of exports) {
    const snake = file.replace(/-/g, "_");
    const meta = google.get(snake);
    if (!meta) {
      misses.push(`${exportName} (${file})`);
      continue;
    }
    metadata[exportName] = meta;
  }

  // Hand-authored custom-icon metadata wins over anything from the feed.
  for (const [exportName, meta] of Object.entries(customIconsMeta)) {
    metadata[exportName] = meta;
  }

  const outPath = join(SRC, "meta.generated.json");
  writeFileSync(outPath, JSON.stringify(metadata, null, 0) + "\n");

  console.log(
    `[sync-meta] wrote ${Object.keys(metadata).length} entries ` +
      `(${exports.length} material + ${Object.keys(customIconsMeta).length} custom)`
  );
  if (misses.length) {
    console.warn(
      `[sync-meta] ${misses.length} icon(s) had no Google match ` +
        `(check for renames in the icon source):\n  ${misses.join("\n  ")}`
    );
  } else {
    console.log("[sync-meta] 0 join misses — full coverage");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
