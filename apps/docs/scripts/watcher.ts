import chokidar from "chokidar";
import fs from "fs/promises";
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

/**
 * Write individual route JSON file
 */
async function writeRouteFile(doc: MdxDocument): Promise<void> {
  const chunkName = doc.meta.route.replace(/\//g, "-");
  const filePath = validateFilePath(ROUTES_DIR, `${chunkName}.json`);

  // Ensure routes directory exists
  await fs.mkdir(ROUTES_DIR, { recursive: true });

  await fs.writeFile(filePath, JSON.stringify(doc, null, 2));
  flog(`[MDX] Updated route: ${chunkName}.json`);
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
 * Debounced function to write manifest and search index
 */
const writeManifestAndSearch = debounce(async () => {
  // Ensure output directory exists
  await fs.mkdir(path.dirname(MANIFEST_PATH), { recursive: true });

  // Generate manifest (function writes to file internally)
  await generateRouteManifest(documentation, MANIFEST_PATH);

  // Generate search index (function writes to file internally)
  await generateSearchIndex(documentation, SEARCH_INDEX_PATH);

  // Monitor Map size after operations
  checkMapHealth();
}, 500);

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
    flog(`[MDX] View file changed, re-parsing main file: ${mainBasename}.mdx`);
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

      // Trigger manifest and search index update
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
    await handleTypeChange();
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

// Log watcher status
const clr = "\x1b[33m%s\x1b[0m";
console.log(clr, "\n----------------------------------------------------");
console.log(clr, "\n  Watching for file changes in packages directory.");
console.log(clr, "\n----------------------------------------------------\n");
