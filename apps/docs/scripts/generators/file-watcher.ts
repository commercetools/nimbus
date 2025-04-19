import chokidar from "chokidar";
import path from "path";
import { logger } from "../utils/logger";
import { CONFIG } from "../config";
import { shouldProcessFile } from "../utils/path-utils";
import { parseMdxFile, writeMdxDocs } from "./mdx/parse-mdx";
import { parseTypeFile, writeTypeDocs } from "./types/parse-types";
import debounce from "lodash/debounce";

/**
 * Event emitter for file change events
 * This replaces the previous observer pattern with a cleaner approach
 */
type FileChangeCallback = (filePath: string) => Promise<void>;
const fileChangeHandlers: FileChangeCallback[] = [];

/**
 * Register a callback for file change events
 */
export function onFileChange(callback: FileChangeCallback): void {
  fileChangeHandlers.push(callback);
}

/**
 * Trigger all registered file change handlers
 */
async function triggerFileChangeHandlers(filePath: string): Promise<void> {
  for (const handler of fileChangeHandlers) {
    await handler(filePath);
  }
}

/**
 * Debounced function to write documentation files
 */
const writeDocFiles = debounce(async () => {
  await Promise.all([writeMdxDocs(), writeTypeDocs()]);
}, CONFIG.debounceMs);

/**
 * Check if a file path is within the nimbus package
 */
function isInNimbusPackage(filePath: string): boolean {
  const normalizedPath = path.normalize(filePath).replace(/\\/g, "/");
  const normalizedNimbusPath = path
    .normalize(CONFIG.packageDirs.nimbus)
    .replace(/\\/g, "/");
  return normalizedPath.startsWith(normalizedNimbusPath);
}

/**
 * Handle a file change event
 */
async function handleFileChange(filePath: string): Promise<void> {
  if (!shouldProcessFile(filePath)) {
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  let success = false;

  if (CONFIG.extensions.docs.includes(ext)) {
    success = await parseMdxFile(filePath);
  } else if (CONFIG.extensions.code.includes(ext)) {
    // Only process TypeScript files from the nimbus package
    if (isInNimbusPackage(filePath)) {
      logger.debug(
        `Processing TypeScript file from nimbus package: ${filePath}`
      );
      success = await parseTypeFile(filePath);
    } else {
      // Skip TypeScript files outside the nimbus package
      logger.debug(
        `Skipping TypeScript file outside nimbus package: ${filePath}`
      );
      return;
    }
  }

  if (success) {
    // Trigger write after a delay to batch multiple changes
    writeDocFiles();
    // Notify any registered handlers
    await triggerFileChangeHandlers(filePath);
  }
}

/**
 * Initialize file watcher for the project
 */
export function initializeWatcher(): void {
  // Initialize with monitoring options
  const watcher = chokidar.watch(CONFIG.watchDir, {
    persistent: true,
    ignoreInitial: false,
    usePolling: true,
    ignored: (watchPath, stats) => {
      // Always ignore node_modules and other specified directories
      for (const ignoreDir of CONFIG.ignoreDirs) {
        if (watchPath.includes(`/${ignoreDir}/`)) {
          return true;
        }
      }

      // For files, only watch specified extensions
      if (stats?.isFile()) {
        const ext = path.extname(watchPath).toLowerCase();
        const validExtensions = [
          ...CONFIG.extensions.code,
          ...CONFIG.extensions.docs,
        ];

        // Skip TypeScript files outside the nimbus package
        if (
          CONFIG.extensions.code.includes(ext) &&
          !isInNimbusPackage(watchPath)
        ) {
          return true;
        }

        return !validExtensions.includes(ext);
      }

      return false; // Don't ignore other directories
    },
  });

  // Set up event handlers
  watcher
    .on("add", (filePath) => {
      logger.info(`File added: ${path.basename(filePath)}`);
      handleFileChange(filePath);
    })
    .on("change", (filePath) => {
      logger.info(`File changed: ${path.basename(filePath)}`);
      handleFileChange(filePath);
    })
    .on("unlink", (filePath) => {
      logger.info(`File removed: ${path.basename(filePath)}`);
      handleFileChange(filePath);
    })
    .on("error", (error) => {
      logger.error("Error watching files:", error);
    });

  logger.success(`Watching for file changes in: ${CONFIG.watchDir}`);
  logger.info(
    `TypeScript processing restricted to: ${CONFIG.packageDirs.nimbus}`
  );
}
