import { cp, mkdir, access, rm } from "node:fs/promises";
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
    } catch {
      console.warn(`[copy-docs-data] Skipping missing: ${item}`);
      continue;
    }

    // Clear the destination first. `cp` overwrites but never deletes, so a
    // file removed upstream would linger here indefinitely. That matters
    // because `data-loader`/`get-component` discover type files by reading the
    // directory and prefix-matching names rather than consulting
    // `manifest.json` — a stale file is a live input and surfaces as a bogus
    // sub-component. `force` keeps a first run, where nothing exists yet, from
    // being treated as an error.
    await rm(dest, { recursive: true, force: true });
    await cp(src, dest, { recursive: true });
  }

  console.log(`[copy-docs-data] Copied docs data to ${TARGET}`);
}
