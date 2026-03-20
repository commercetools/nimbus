import { readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Augments the search index with pre-lowered fields so the runtime
 * doesn't need to call toLowerCase() or concatenate strings on every query.
 * Adds: _lower.title, _lower.description, _lower.tags, _lower.content, _lower.combined
 */
export async function buildSearchIndex(outDir?: string) {
  const dataDir = outDir ?? resolve(__dirname, "../data");
  const indexPath = resolve(dataDir, "docs/search-index.json");

  const raw = await readFile(indexPath, "utf-8");
  const index = JSON.parse(raw) as Array<{
    id: string;
    title: string;
    description: string;
    tags: string[];
    route: string;
    menu: string[];
    content: string;
    _lower?: unknown;
  }>;

  for (const entry of index) {
    const title = entry.title.toLowerCase();
    const description = entry.description.toLowerCase();
    const tags = entry.tags.join(" ").toLowerCase();
    const content = (entry.content ?? "").toLowerCase();
    entry._lower = {
      title,
      description,
      tags,
      content,
      combined: title + " " + description + " " + tags + " " + content,
    };
  }

  await writeFile(indexPath, JSON.stringify(index));
  console.log(
    `[build-search-index] Augmented ${index.length} entries with pre-lowered fields`
  );
}

if (process.argv[1]?.includes("build-search-index")) {
  buildSearchIndex().catch(console.error);
}
