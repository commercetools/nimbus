import { readdir, readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { stripMarkdown } from "../src/utils/markdown.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Pre-builds a compact lowered-content index for all route views.
 * Output: data/view-index.json — a map from route slug to array of
 * { key, lower (stripped markdown + lowered) }.
 *
 * Only stores lowered text for fast token matching. Full content for
 * snippets is loaded on-demand from route data files for top results only.
 */
export async function buildViewIndex(outDir?: string) {
  const dataDir = outDir ?? resolve(__dirname, "../data");
  const routesDir = resolve(dataDir, "docs/routes");

  const files = await readdir(routesDir);
  const index: Record<string, Array<{ key: string; lower: string }>> = {};

  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const slug = file.replace(".json", "");
    const raw = await readFile(resolve(routesDir, file), "utf-8");
    const data = JSON.parse(raw);

    const views: Array<{ key: string; lower: string }> = [];

    if (data.views) {
      for (const [key, view] of Object.entries(data.views)) {
        const v = view as { mdx?: string };
        if (v.mdx) {
          views.push({ key, lower: stripMarkdown(v.mdx).toLowerCase() });
        }
      }
    } else if (data.mdx) {
      views.push({
        key: "overview",
        lower: stripMarkdown(data.mdx).toLowerCase(),
      });
    }

    if (views.length > 0) {
      index[slug] = views;
    }
  }

  const outPath = resolve(dataDir, "view-index.json");
  await writeFile(outPath, JSON.stringify(index));
  console.log(
    `[build-view-index] Wrote ${Object.keys(index).length} route entries to ${outPath}`
  );
}

if (process.argv[1]?.includes("build-view-index")) {
  buildViewIndex().catch(console.error);
}
