import { cp, mkdir, access } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOURCE = resolve(__dirname, "../../../apps/docs/src/data");
const TARGET = resolve(__dirname, "../data/docs");

export async function copyDocsData() {
  try {
    await access(SOURCE);
  } catch {
    console.warn(
      `[copy-docs-data] Source not found: ${SOURCE}\n` +
        `  Run "pnpm build:docs-data" first to generate docs data.`
    );
    return;
  }

  await mkdir(TARGET, { recursive: true });

  const items = ["route-manifest.json", "search-index.json", "routes", "types"];

  for (const item of items) {
    const src = resolve(SOURCE, item);
    const dest = resolve(TARGET, item);
    try {
      await access(src);
      await cp(src, dest, { recursive: true, force: true });
    } catch {
      console.warn(`[copy-docs-data] Skipping missing: ${item}`);
    }
  }

  console.log(`[copy-docs-data] Copied docs data to ${TARGET}`);
}
