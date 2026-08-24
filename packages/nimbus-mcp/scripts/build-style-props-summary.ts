/**
 * Style Props Summary Builder
 *
 * Reads all `data/docs/routes/home-style-props-*.json` sub-page files, parses
 * the MDX table rows to extract prop names, and writes a compact summary to
 * `data/style-props-summary.json`. This summary is served through MCP tool
 * responses to inform consuming LLMs which style props are available.
 *
 * Can be used as a prebuild step or run directly via CLI:
 *   tsx scripts/build-style-props-summary.ts
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type {
  StylePropsCategorySummary,
  StylePropsSummary,
} from "../src/types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(__dirname, "..");
const ROUTES_DIR = resolve(PACKAGE_ROOT, "data/docs/routes");

/**
 * Extracts prop names from MDX content by parsing table rows.
 *
 * Each style-props sub-page has tables where the first column contains
 * backtick-quoted prop names, sometimes comma-separated:
 *   | `p`, `padding` | `padding` | `spacing` |
 */
function extractPropNames(mdx: string): string[] {
  const props = new Set<string>();

  // Match table rows: lines starting with `|` that contain backtick-quoted names
  // in the first cell. Skip header/separator rows.
  for (const line of mdx.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|") || trimmed.startsWith("| ---")) continue;

    // Extract the first cell content
    const cells = trimmed.split("|");
    const firstCell = cells[1]; // cells[0] is empty (before first |)
    if (!firstCell) continue;

    // Extract all backtick-quoted names from the first cell
    const matches = firstCell.matchAll(/`([^`]+)`/g);
    for (const match of matches) {
      // Some cells contain comma-separated names like `p`, `padding`
      // but they're individually backtick-quoted, so each match is a single prop
      const name = match[1].trim();
      if (name && !name.includes(" ")) {
        props.add(name);
      }
    }
  }

  return [...props];
}

interface RouteFileData {
  meta: {
    title: string;
    route: string;
  };
  views?: {
    overview?: {
      mdx: string;
    };
  };
}

/**
 * Builds the style props summary and writes it to `data/style-props-summary.json`.
 *
 * @param outDir - Output directory. Defaults to `<package-root>/data`.
 */
export async function buildStylePropsSummary(outDir?: string) {
  const resolvedOutDir = outDir ?? resolve(PACKAGE_ROOT, "data");

  // Find all style-props sub-page route files (exclude the landing page itself)
  const files = readdirSync(ROUTES_DIR).filter(
    (f) =>
      f.startsWith("home-style-props-") &&
      f.endsWith(".json") &&
      f !== "home-style-props.json"
  );

  const categories: StylePropsCategorySummary[] = [];

  for (const file of files.sort()) {
    const filePath = resolve(ROUTES_DIR, file);
    const data: RouteFileData = JSON.parse(readFileSync(filePath, "utf-8"));

    const mdx = data.views?.overview?.mdx;
    if (!mdx) continue;

    const props = extractPropNames(mdx);
    if (props.length === 0) continue;

    categories.push({
      name: data.meta.title,
      path: data.meta.route,
      props,
    });
  }

  const summary: StylePropsSummary = {
    categories,
    hint: 'For detailed docs on a category, use get_docs_page(path: "<path>")',
  };

  mkdirSync(resolvedOutDir, { recursive: true });
  const outPath = resolve(resolvedOutDir, "style-props-summary.json");
  writeFileSync(outPath, JSON.stringify(summary, null, 2) + "\n", "utf-8");

  const totalProps = categories.reduce((sum, c) => sum + c.props.length, 0);
  console.log(
    `Wrote ${categories.length} categories, ${totalProps} props → ${outPath}`
  );
}

// Run as CLI when executed directly
const isDirectRun =
  process.argv[1] &&
  resolve(process.argv[1]).includes("build-style-props-summary");

if (isDirectRun) {
  buildStylePropsSummary().catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
}
