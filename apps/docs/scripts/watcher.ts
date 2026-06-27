import chokidar from "chokidar";
import fs from "fs/promises";
import { readdirSync } from "fs";
import path from "path";
import debounce from "lodash/debounce";
import {
  parseMdxFile,
  parseTypesToFiles,
  generateRouteManifest,
  generateSearchIndex,
  getPathFromMonorepoRoot,
  flog,
  validateFilePath,
  type MdxDocument,
} from "@commercetools/nimbus-docs-build";

// Configuration
const PACKAGES_DIR = path.resolve("../../packages");
const ROUTES_DIR = path.resolve("./src/data/routes");
const MANIFEST_PATH = path.resolve("./src/data/route-manifest.json");
const SEARCH_INDEX_PATH = path.resolve("./src/data/search-index.json");
const TYPES_DIR = path.resolve("./src/data/types");
const COMPONENT_INDEX_PATH = path.resolve("../../packages/nimbus/src/index.ts");

// In-memory storage for generating manifest and search index
const documentation: Map<string, MdxDocument> = new Map();

// Map size monitoring configuration
const MAX_EXPECTED_DOCS = 1000; // Adjust based on project size

// Initial-scan state. With `ignoreInitial: false`, chokidar emits an `add`
// event for every existing file on startup. Rather than log one line per
// route (hundreds of lines), we collapse the initial scan into a single
// updating progress counter and a final summary once chokidar is `ready`.
let isReady = false;
const initialRoutes = new Set<string>();
const totalMdxFiles = countMdxFiles(PACKAGES_DIR);

/**
 * Count main `.mdx` files (excluding view files like `button.dev.mdx`, which
 * re-parse their main file rather than producing their own route) so the
 * startup progress counter has a stable denominator.
 */
function countMdxFiles(dir: string): number {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return 0;
  }
  let count = 0;
  for (const entry of entries) {
    if (entry.name === "node_modules") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += countMdxFiles(full);
    } else if (entry.name.endsWith(".mdx")) {
      // Main files only — basename without `.mdx` has no further dot.
      if (!entry.name.slice(0, -".mdx".length).includes(".")) count += 1;
    }
  }
  return count;
}

// ANSI helpers
const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;

/**
 * Render an in-place progress bar for the initial scan. `\r` returns to the
 * start of the line and `\x1b[2K` clears it, so each call overwrites the last.
 */
function renderProgressBar(current: number, total: number): void {
  const width = 28;
  const ratio = total > 0 ? Math.min(current / total, 1) : 0;
  const filled = Math.round(ratio * width);
  const bar = "█".repeat(filled) + "░".repeat(width - filled);
  const pct = String(Math.round(ratio * 100)).padStart(3);
  process.stdout.write(
    `\r\x1b[2K${green(`  ➜ Building routes  ${bar}  ${pct}%  (${current}/${total})`)}`
  );
}

/**
 * Run `fn` with `console.log` muted so the build package's progress chatter
 * (manifest/search index "Generated …" lines) doesn't break up our own
 * formatted startup output. Restored unconditionally afterwards.
 */
async function withSilencedLogs(fn: () => Promise<void>): Promise<void> {
  const original = console.log;
  console.log = () => {};
  try {
    await fn();
  } finally {
    console.log = original;
  }
}

/**
 * Print the tidy, ordered summary shown once the initial scan settles.
 */
function printStartupSummary(routeCount: number, typeCount: number): void {
  process.stdout.write(
    "\n" +
      green(`  ✓ ${routeCount} routes built\n`) +
      green(`  ✓ manifest + search index generated\n`) +
      green(`  ✓ ${typeCount} component types parsed\n`) +
      "\n" +
      `  ${dim("Watching")} ${green("packages/")} ${dim("for changes…")}\n\n`
  );
}

/**
 * Write individual route JSON file
 */
async function writeRouteFile(doc: MdxDocument): Promise<void> {
  const chunkName = doc.meta.route.replace(/\//g, "-");
  const filePath = validateFilePath(ROUTES_DIR, `${chunkName}.json`);

  // Ensure routes directory exists
  await fs.mkdir(ROUTES_DIR, { recursive: true });

  await fs.writeFile(filePath, JSON.stringify(doc, null, 2));
  // During the initial scan, the per-route line is suppressed in favor of the
  // progress counter (see handleMdxChange / the `ready` handler).
  if (isReady) {
    flog(`[MDX] Updated route: ${chunkName}.json`);
  }
}

/**
 * Delete route file when document is removed
 */
async function deleteRouteFile(doc: MdxDocument): Promise<void> {
  const chunkName = doc.meta.route.replace(/\//g, "-");
  const filePath = validateFilePath(ROUTES_DIR, `${chunkName}.json`);
  try {
    await fs.unlink(filePath);
    flog(`[MDX] Deleted route: ${chunkName}.json`);
  } catch {
    // File might not exist, ignore
  }
}

/**
 * Check Map health and warn if size exceeds expected threshold
 */
function checkMapHealth(): void {
  const size = documentation.size;
  if (size > MAX_EXPECTED_DOCS) {
    console.warn(
      `[WARNING] Documentation Map has ${size} entries (expected < ${MAX_EXPECTED_DOCS}). ` +
        `Possible memory leak or unexpected file growth.`
    );
  }
}

/**
 * Regenerate the route manifest and search index from the in-memory docs.
 */
async function regenerateManifestAndSearch(): Promise<void> {
  // Ensure output directory exists
  await fs.mkdir(path.dirname(MANIFEST_PATH), { recursive: true });

  // Generate manifest (function writes to file internally)
  await generateRouteManifest(documentation, MANIFEST_PATH);

  // Generate search index (function writes to file internally)
  await generateSearchIndex(documentation, SEARCH_INDEX_PATH);

  // Monitor Map size after operations
  checkMapHealth();
}

/**
 * Debounced wrapper used for live edits (after the initial scan).
 */
const writeManifestAndSearch = debounce(regenerateManifestAndSearch, 500);

/**
 * Handle MDX file changes
 */
async function handleMdxChange(filePath: string): Promise<void> {
  // Check if this is a view file (*.{key}.mdx pattern)
  const basename = path.basename(filePath);
  const nameWithoutMdx = basename.replace(/\.mdx$/, "");

  let targetPath = filePath;

  if (nameWithoutMdx.includes(".")) {
    // This is a view file - trigger re-parsing of the main .mdx file
    const mainBasename = nameWithoutMdx.substring(
      0,
      nameWithoutMdx.lastIndexOf(".")
    );
    targetPath = path.join(path.dirname(filePath), `${mainBasename}.mdx`);
    if (isReady) {
      flog(
        `[MDX] View file changed, re-parsing main file: ${mainBasename}.mdx`
      );
    }
  }

  try {
    // Parse the MDX file (handles multi-view automatically)
    const doc = await parseMdxFile(targetPath);

    if (doc) {
      // Check if this is an update or new entry
      const existingDoc = documentation.get(doc.meta.repoPath);
      const isUpdate = !!existingDoc;

      // Store in memory
      documentation.set(doc.meta.repoPath, doc);

      // Write individual route file
      await writeRouteFile(doc);

      // During the initial scan, only advance the progress bar. The manifest,
      // search index, and types are generated once in the `ready` handler —
      // regenerating them per-file here would interleave their logs with the
      // bar and waste work on partial results.
      if (!isReady) {
        initialRoutes.add(doc.meta.route);
        renderProgressBar(initialRoutes.size, totalMdxFiles);
        return;
      }

      // Live edit: regenerate dependent artifacts and log per file.
      await writeManifestAndSearch();

      const viewCount = doc.meta.tabs.length;
      if (viewCount > 1) {
        flog(
          `[MDX] ${isUpdate ? "Updated" : "Added"} ${path.basename(targetPath)} with ${viewCount} views: ${doc.meta.tabs.map((t) => t.key).join(", ")} (Map size: ${documentation.size})`
        );
      } else {
        flog(
          `[MDX] ${isUpdate ? "Updated" : "Added"} ${path.basename(targetPath)} (Map size: ${documentation.size})`
        );
      }
    }
  } catch (error) {
    console.error(`Error parsing MDX file ${targetPath}:`, error);
  }
}

/**
 * Handle MDX file deletion
 */
async function handleMdxDelete(filePath: string): Promise<void> {
  try {
    // Get the same repoPath format that was used when storing the document
    const repoPathToDelete = await getPathFromMonorepoRoot(filePath);

    // Find document by exact repoPath match
    const docToDelete = documentation.get(repoPathToDelete);

    if (docToDelete) {
      // Delete from in-memory map
      documentation.delete(repoPathToDelete);

      // Delete route file
      await deleteRouteFile(docToDelete);

      // Regenerate manifest and search index
      await writeManifestAndSearch();

      flog(
        `[MDX] Removed ${path.basename(filePath)} from documentation (Map size: ${documentation.size})`
      );
    } else {
      // Not found - might be a view file (e.g., button.dev.mdx)
      // View files trigger re-parsing of main file, so no explicit deletion needed
      flog(
        `[MDX] Skipped deletion for ${path.basename(filePath)} (not found in documentation map)`
      );
    }
  } catch (error) {
    console.error(`Error handling MDX deletion for ${filePath}:`, error);
  }
}

/**
 * Debounced TypeScript type parsing
 */
const handleTypeChange = debounce(async () => {
  try {
    await parseTypesToFiles(COMPONENT_INDEX_PATH, TYPES_DIR);
    flog("[TSX] Updated component types");
  } catch (error) {
    console.error("Error parsing TypeScript types:", error);
  }
}, 1000);

/**
 * Handle file changes based on type
 */
async function handleFileChange(
  filePath: string,
  event: string
): Promise<void> {
  const ext = path.extname(filePath);

  if (ext === ".mdx") {
    if (event === "unlink") {
      await handleMdxDelete(filePath);
    } else {
      await handleMdxChange(filePath);
    }
  } else if (ext === ".ts" || ext === ".tsx") {
    // During the initial scan, skip per-event type parsing; types are parsed
    // once in the `ready` handler. Only react to live edits.
    if (isReady) await handleTypeChange();
  }
}

// Initialize chokidar watcher
const watcher = chokidar.watch(PACKAGES_DIR, {
  persistent: true,
  ignoreInitial: false,
  usePolling: true,
  ignored: (filePath, stats) => {
    // Always ignore node_modules
    if (filePath.includes("node_modules")) {
      return true;
    }

    // For files, only watch .ts, .tsx, and .mdx files
    if (stats?.isFile()) {
      return !(
        filePath.endsWith(".ts") ||
        filePath.endsWith(".tsx") ||
        filePath.endsWith(".mdx")
      );
    }

    return false;
  },
});

// Watch for add, change, and unlink events
watcher
  .on("add", (filePath: string) => handleFileChange(filePath, "add"))
  .on("change", (filePath: string) => handleFileChange(filePath, "change"))
  .on("unlink", (filePath: string) => handleFileChange(filePath, "unlink"))
  .on("ready", async () => {
    isReady = true;

    // Finalize the progress bar at 100%, then drop to a fresh line.
    renderProgressBar(totalMdxFiles, totalMdxFiles);
    process.stdout.write("\n");

    // Generate dependent artifacts once, silently, so their internal logs
    // don't break up the formatted summary. From here on, live edits log
    // individually (verbose, see handleMdxChange / handleTypeChange).
    let typeCount = 0;
    await withSilencedLogs(async () => {
      await regenerateManifestAndSearch();
      const manifest = await parseTypesToFiles(COMPONENT_INDEX_PATH, TYPES_DIR);
      typeCount = Object.keys(manifest).length;
    });

    printStartupSummary(documentation.size, typeCount);
  })
  .on("error", (error: unknown) =>
    console.error("Error watching files:", error)
  );

// Graceful shutdown — close chokidar and cancel pending debounced work
function shutdown() {
  writeManifestAndSearch.cancel();
  handleTypeChange.cancel();
  watcher.close().then(() => process.exit());
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// The initial scan begins as soon as chokidar emits events above; the progress
// bar (renderProgressBar) and final summary (printStartupSummary) are the only
// startup output — no separate banner needed.
