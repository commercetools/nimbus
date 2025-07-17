import fs from "fs";
import debounce from "lodash/debounce";
import docgen from "react-docgen-typescript";

export const flog = (str: any) => {
  console.log("\x1b[32m%s\x1b[0m", `\n  ➜ ${str}\n`);
};

// Thats where compiled docs will be saved
const compiledTypesFile = "./src/data/types.json";

// Main entry point for parsing
const fileToGrabTypesFrom: string = "./../../packages/nimbus/src/index.ts";

const writeDocs = debounce(() => {
  const options = {
    savePropValueAsString: true,
    propFilter: (prop: any) => {
      const isDOMAttribute = prop.parent?.name === "DOMAttributes";
      const isChakraSystemProperty = prop.parent?.name === "SystemProperties";
      const isAriaAttribute = prop.parent?.name === "AriaAttributes";
      const isHtmlProp = prop.parent?.name === "HtmlProps";
      const isHtmlAttr = prop.parent?.name === "HTMLAttributes";
      // Chakra Conditions
      const isChakraCondition = prop.parent?.name === "Conditions";
      // Exclude redundant props
      if (
        isDOMAttribute ||
        isChakraSystemProperty ||
        isChakraCondition ||
        isAriaAttribute ||
        isHtmlProp ||
        isHtmlAttr
      ) {
        return false;
      }
      return true;
    },
    // Enhanced type resolution options
    shouldExtractLiteralValuesFromEnum: true,
    shouldExtractValuesFromUnion: true,
    shouldRemoveUndefinedFromOptional: true,
    // Additional options for complex types
    skipChildrenPropWithoutDoc: false, // Include children prop
    componentNameResolver: (exp: any) => {
      // Help with proper component name resolution
      return exp.getName();
    },
  };

  // Try withDefaultConfig for simpler, more reliable type resolution
  const parser = docgen.withDefaultConfig(options);

  // Parse main index for components
  const allResults = parser.parse(fileToGrabTypesFrom);

  fs.writeFileSync(compiledTypesFile, JSON.stringify(allResults, null, 2));
  flog("[TSX] Prop tables updated");
}, 500);

const observable = (target: any, callback: any, _base: any[] = []) => {
  for (const key in target) {
    if (typeof target[key] === "object")
      target[key] = observable(target[key], callback, [..._base, key]);
  }
  return new Proxy(target, {
    set(target, key, value) {
      if (typeof value === "object")
        value = observable(value, callback, [..._base, key as string]);
      callback([..._base, key], (target[key as string] = value));
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
