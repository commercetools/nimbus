import chokidar from "chokidar";
import fs from "fs";
import { debounce } from "lodash";
import docgen from "react-docgen-typescript";

// Thats where compiled docs will be saved
const compiledTypesFile = "./src/assets/types.json";

const fileToGrabTypesFrom: string = "./../../packages/bleh-ui/src/index.ts";

const writeDocs = debounce(() => {
  const options = {
    savePropValueAsString: true,
    propFilter: (prop) => {
      const isDOMAttribute = prop.parent?.name === "DOMAttributes";
      const isChackraSystemProperty = prop.parent?.name === "SystemProperties";
      const isAriaAttribute = prop.parent?.name === "AriaAttributes";
      const isHtmlProp = prop.parent?.name === "HtmlProps";
      const isHtmlAttr = prop.parent?.name === "HTMLAttributes";
      // Chakra Conditions
      const isChakraCondition = prop.parent?.name === "Conditions";
      // Exclude redundant props
      if (
        isDOMAttribute ||
        isChackraSystemProperty ||
        isChakraCondition ||
        isAriaAttribute ||
        isHtmlProp ||
        isHtmlAttr
      ) {
        return false;
      }
      return true;
    },
  };
  const res = docgen.parse(fileToGrabTypesFrom, options);

  fs.writeFileSync(compiledTypesFile, JSON.stringify(res, null, 2));
  console.log("Prop Tables compiled.");
}, 500);

const observable = (target, callback, _base = []) => {
  for (const key in target) {
    if (typeof target[key] === "object")
      target[key] = observable(target[key], callback, [..._base, key]);
  }
  return new Proxy(target, {
    set(target, key, value) {
      if (typeof value === "object")
        value = observable(value, callback, [..._base, key]);
      callback([..._base, key], (target[key] = value));
      return value;
    },
  });
};

const typesObj = observable({}, writeDocs);

// Directory to watch
const directoryToWatch: string = "./../../packages/bleh-ui/src";

const parseTypes = async (filePath: string) => {
  fs.readFile(filePath, "utf8", async (err, content) => {
    if (err) {
      console.error(`Error reading file ${filePath}:`, err);
      return;
    }
    typesObj[filePath] = true;
  });
};

// Action to trigger when .mdx file is created
async function handleFileAdd(filePath: string) {
  await parseTypes(filePath);
}

// Action to trigger when .mdx file is modified
async function handleFileChange(filePath: string) {
  await parseTypes(filePath);
}

// Initialize chokidar watcher
const watcher = chokidar.watch(directoryToWatch, {
  persistent: true,
  ignoreInitial: false, // Watch also for newly created files
  usePolling: true, // Can be set for environments that don't support native file watching
  // only watch .mdx files
  ignored: (path, stats) =>
    (stats?.isFile() && !(path.endsWith(".ts") || path.endsWith(".tsx"))) ||
    false, // only watch js files
});

// Watch for add and change events on .mdx files
watcher
  .on("add", (filePath: string) => handleFileAdd(filePath))
  .on("change", (filePath: string) => handleFileChange(filePath))
  .on("error", (error: Error) => console.log("Error watching files:", error));

// Creating a watcher for the object

console.log(`Watching for documentation updates in ${directoryToWatch}...`);
