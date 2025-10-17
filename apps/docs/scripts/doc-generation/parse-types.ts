import fs from "fs";
import debounce from "lodash/debounce";
import docgen from "react-docgen-typescript";
import { processComponentTypes } from "./process-types";

export const flog = (str) => {
  console.log("\x1b[32m%s\x1b[0m", `\n  ➜ ${str}\n`);
};

// Thats where compiled docs will be saved
const compiledTypesFile = "./src/data/types.json";

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

  // Step 3: Single write to disk
  fs.writeFileSync(compiledTypesFile, JSON.stringify(processedTypes, null, 2));
  flog("[TSX] Prop tables updated");
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
