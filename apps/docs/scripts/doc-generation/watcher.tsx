import chokidar from "chokidar";
import debounce from "lodash/debounce";
import { parseMdx } from "./parse-mdx";
import { parseTypes } from "./parse-types";
import { injectRecipeProps } from "./inject-recipe-props";

// Directory to watch
const directoryToWatch: string = "./../../packages";

// Debounced recipe props injection - runs after types.json has been updated
const debouncedInjectRecipeProps = debounce(async () => {
  try {
    await injectRecipeProps();
  } catch (error) {
    console.error("Error injecting recipe props:", error);
  }
}, 1000); // Wait 1s after last type change to ensure types.json is written

const handleFileChange = async (filePath: string) => {
  const ext = filePath.split(".").pop();
  switch (true) {
    case ext === "mdx":
      await parseMdx(filePath);
      break;
    case ext === "ts" || ext === "tsx":
      await parseTypes(filePath);
      // Trigger recipe props injection after types are parsed
      debouncedInjectRecipeProps();
      break;
    default:
      break;
  }
};

// Initialize chokidar watcher
const watcher = chokidar.watch(directoryToWatch, {
  persistent: true,
  ignoreInitial: false, // Watch also for newly created files
  usePolling: true, // Can be set for environments that don't support native file watching
  // Ignore node_modules and files that are not .ts, .tsx, or .mdx
  ignored: (path, stats) => {
    // Always ignore node_modules directories
    if (path.includes("node_modules")) {
      return true;
    }

    // For files, only watch .ts, .tsx, and .mdx files
    if (stats?.isFile()) {
      return !(
        path.endsWith(".ts") ||
        path.endsWith(".tsx") ||
        path.endsWith(".mdx")
      );
    }

    return false; // Don't ignore directories (except node_modules)
  },
});

// Watch for add and change events on .mdx files
watcher
  .on("add", (filePath: string) => handleFileChange(filePath))
  .on("change", (filePath: string) => handleFileChange(filePath))
  .on("unlink", (filePath: string) => handleFileChange(filePath))
  .on("error", (error: unknown) => console.log("Error watching files:", error));

// Creating a watcher for the object
const clr = "\x1b[33m%s\x1b[0m";
console.log(clr, `\n----------------------------------------------------`);
console.log(clr, `\n  Watching for file changes in packages directory.`);
console.log(clr, `\n----------------------------------------------------\n`);
