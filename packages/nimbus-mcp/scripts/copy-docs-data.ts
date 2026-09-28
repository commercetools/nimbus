import { cp, mkdir, access, rm } from "node:fs/promises";
import { resolve, dirname, sep } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOURCE = resolve(__dirname, "../../../apps/docs/src/data");
const PACKAGE_ROOT = resolve(__dirname, "..");
const TARGET = resolve(__dirname, "../data/docs");

/**
 * Throw unless `child` resolves to `parent` or something beneath it.
 *
 * Both paths below are currently derived from `import.meta.url` and the item
 * list is a literal, so neither assertion can fail as written. They exist
 * because the delete is recursive and irreversible: a later change that
 * accepts a caller-supplied output directory (the `fn(outDir?: string)` shape
 * this package's guidelines ask for) or builds the item list dynamically would
 * otherwise be able to delete a path outside the package with no tripwire.
 *
 * Compared with a trailing separator so `…/data` cannot match `…/data-backup`.
 */
function assertWithin(parent: string, child: string, label: string): void {
  const base = resolve(parent);
  const target = resolve(child);
  if (target !== base && !target.startsWith(base + sep)) {
    throw new Error(
      `[copy-docs-data] refusing to delete ${label}: ` +
        `"${target}" is outside "${base}"`
    );
  }
}

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

  assertWithin(PACKAGE_ROOT, TARGET, "the output directory");

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
    assertWithin(TARGET, dest, item);
    await rm(dest, { recursive: true, force: true });
    await cp(src, dest, { recursive: true });
  }

  console.log(`[copy-docs-data] Copied docs data to ${TARGET}`);
}
