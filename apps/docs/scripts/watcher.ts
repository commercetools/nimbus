import chokidar from "chokidar";
import fs from "fs/promises";
import path from "path";
import debounce from "lodash/debounce";
import {
  parseMdxFile,
  parseTypesToFiles,
  generateRouteManifest,
  generateSearchIndex,
  flog,
  type MdxDocument,
} from "@commercetools/nimbus-docs-build";

// Configuration
const PACKAGES_DIR = path.resolve("../../packages");
const ROUTES_DIR = path.resolve("./src/data/routes");
const MANIFEST_PATH = path.resolve("./src/data/route-manifest.json");
const SEARCH_INDEX_PATH = path.resolve("./src/data/search-index.json");
const TYPES_DIR = path.resolve("./public/generated/types");
const COMPONENT_INDEX_PATH = path.resolve("../../packages/nimbus/src/index.ts");

// In-memory storage for generating manifest and search index
const documentation: Map<string, MdxDocument> = new Map();

/**
 * Write individual route JSON file
 */
async function writeRouteFile(doc: MdxDocument): Promise<void> {
  const chunkName = doc.meta.route.replace(/\//g, "-");
  const filePath = path.join(ROUTES_DIR, `${chunkName}.json`);
  await fs.writeFile(filePath, JSON.stringify(doc, null, 2));
  flog(`[MDX] Updated route: ${chunkName}.json`);
}

/**
 * Delete route file when document is removed
 */
async function deleteRouteFile(doc: MdxDocument): Promise<void> {
  const chunkName = doc.meta.route.replace(/\//g, "-");
  const filePath = path.join(ROUTES_DIR, `${chunkName}.json`);
  try {
    await fs.unlink(filePath);
    flog(`[MDX] Deleted route: ${chunkName}.json`);
  } catch {
    // File might not exist, ignore
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
      // Store in memory
      documentation.set(doc.meta.repoPath, doc);

      // Write individual route file
      await writeRouteFile(doc);

      // Trigger manifest and search index update
      await writeManifestAndSearch();

      const viewCount = doc.meta.tabs.length;
      if (viewCount > 1) {
        flog(
          `[MDX] Parsed ${path.basename(targetPath)} with ${viewCount} views: ${doc.meta.tabs.map((t) => t.key).join(", ")}`
        );
      } else {
        flog(`[MDX] Parsed ${path.basename(targetPath)}`);
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
  // Find and remove from documentation
  let docToDelete: MdxDocument | undefined;

  for (const [repoPath, doc] of documentation.entries()) {
    if (repoPath.includes(path.basename(filePath))) {
      docToDelete = doc;
      documentation.delete(repoPath);
      break;
    }
  }

  if (docToDelete) {
    await deleteRouteFile(docToDelete);
    await writeManifestAndSearch();
    flog(`[MDX] Removed ${path.basename(filePath)} from documentation`);
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

// Log watcher status
const clr = "\x1b[33m%s\x1b[0m";
console.log(clr, "\n----------------------------------------------------");
console.log(clr, "\n  Watching for file changes in packages directory.");
console.log(clr, "\n----------------------------------------------------\n");
