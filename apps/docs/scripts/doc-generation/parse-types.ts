import fs from "fs";
import path from "path";
import debounce from "lodash/debounce";
import docgen from "react-docgen-typescript";
import { processComponentTypes } from "./process-types";

export const flog = (str) => {
  console.log("\x1b[32m%s\x1b[0m", `\n  ➜ ${str}\n`);
};

// Directory where individual type files will be saved
// Using public folder so files are accessible in production builds
const typesDirectory = "./public/generated/types";
const manifestFile = path.join(typesDirectory, "manifest.json");

const fileToGrabTypesFrom: string = "./../../packages/nimbus/src/index.ts";

const writeDocs = debounce(() => {
  // Step 1: Parse ALL props (no filtering at parse time)
  const options = {
    savePropValueAsString: true,
    // No propFilter - parse everything first
  };
  const rawTypes = docgen.parse(fileToGrabTypesFrom, options);

  // Step 2: Process in memory (enrich + filter in single pass)
  const processedTypes = processComponentTypes(rawTypes);

  // Step 3: Ensure types directory exists
  if (!fs.existsSync(typesDirectory)) {
    fs.mkdirSync(typesDirectory, { recursive: true });
  }

  // Step 4: Write individual component type files and build manifest
  const manifest: Record<string, string> = {};

  processedTypes.forEach((componentDoc) => {
    const componentName = componentDoc.displayName;
    if (!componentName) return;

    const filename = `${componentName}.json`;
    const filePath = path.join(typesDirectory, filename);

    // Write individual component type file
    fs.writeFileSync(filePath, JSON.stringify(componentDoc, null, 2));

    // Add to manifest
    manifest[componentName] = filename;
  });

  // Step 5: Write manifest file
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));

  flog(
    `[TSX] Prop tables updated (${Object.keys(manifest).length} components)`
  );
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

export const parseTypes = async (filePath: string) => {
  // Skip files from node_modules to avoid duplicated IDs
  if (filePath.includes("node_modules")) {
    return;
  }

  fs.readFile(filePath, "utf8", async (err) => {
    if (err) {
      console.error(`Error reading file ${filePath}:`, err);
      return;
    }
    typesObj[filePath] = true;
  });
};
