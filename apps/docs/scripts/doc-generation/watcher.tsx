import chokidar from "chokidar";
import { parseMdx } from "./parse-mdx";
import { parseTypes } from "./parse-types";

// Directory to watch
const directoryToWatch: string = "./../../packages";

const handleFileChange = async (filePath: string) => {
  const ext = filePath.split(".").pop();
  switch (true) {
    case ext === "mdx":
      await parseMdx(filePath);
      break;
    case ext === "ts" || ext === "tsx":
      await parseTypes(filePath);
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
  // only watch .mdx files
  ignored: (path, stats) =>
    (stats?.isFile() &&
      !(
        path.endsWith(".ts") ||
        path.endsWith(".tsx") ||
        path.endsWith(".mdx")
      )) ||
    false, // only watch js files
});

// Watch for add and change events on .mdx files
watcher
  .on("add", (filePath: string) => handleFileChange(filePath))
  .on("change", (filePath: string) => handleFileChange(filePath))
  .on("unlink", (filePath: string) => handleFileChange(filePath))
  .on("error", (error: Error) => console.log("Error watching files:", error));

// Creating a watcher for the object
const clr = "\x1b[33m%s\x1b[0m";
console.log(clr, `\n----------------------------------------------------`);
console.log(clr, `\n  Watching for file changes in packages directory.`);
console.log(clr, `\n----------------------------------------------------\n`);
