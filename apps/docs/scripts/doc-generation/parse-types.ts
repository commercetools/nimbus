import fs from "fs";
import debounce from "lodash/debounce";
import docgen from "react-docgen-typescript";

export const flog = (str) => {
  console.log("\x1b[32m%s\x1b[0m", `\n  ➜ ${str}\n`);
};

// Thats where compiled docs will be saved
const compiledTypesFile = "./src/data/types.json";

const fileToGrabTypesFrom: string = "./../../packages/nimbus/src/index.ts";

const writeDocs = debounce(() => {
  const options = {
    savePropValueAsString: true,
    propFilter: (prop) => {
      // React Key attribute
      const isReactKeyAttribute = prop.name === "key";
      // All HTML attributes
      const isHTMLAttribute = prop.parent?.name === "HTMLAttributes";
      // HTML-Event listener
      const isDOMAttribute = prop.parent?.name === "DOMAttributes";
      // ButtonHTMLAttributes
      const isButtonAttribue = prop.parent?.name === "ButtonHTMLAttributes";
      // GlobalDOMEvents
      const isGlobalDOMEvent = prop.parent?.name === "GlobalDOMEvents";
      // GlobalDOMAttribute
      const isGlobalDOMAttribute = prop.parent?.name === "GlobalDOMAttributes";
      // Chakra related props
      const isChakraSystemProperty = prop.parent?.name === "SystemProperties";
      const isChakraCondition = prop.parent?.name === "Conditions";
      const isSlotRecipeDefinition = prop.name === "recipe";
      // Default accessibility props
      const isAriaAttribute = prop.parent?.name === "AriaAttributes";
      /**
       * Fallback props: When standard HTML attribute names (e.g., "height") are
       * repurposed for style APIs, their actual DOM equivalents are generated
       * as "HtmlProps" (e.g., "htmlHeight") to avoid conflicts.
       */
      const isHtmlFallbackProp = prop.parent?.name === "HtmlProps";

      // Exclude redundant props
      if (
        isReactKeyAttribute ||
        isHTMLAttribute ||
        isDOMAttribute ||
        isButtonAttribue ||
        isGlobalDOMEvent ||
        isGlobalDOMAttribute ||
        isAriaAttribute ||
        isChakraSystemProperty ||
        isChakraCondition ||
        isSlotRecipeDefinition ||
        isHtmlFallbackProp
      ) {
        return false;
      }
      return true;
    },
  };
  const res = docgen.parse(fileToGrabTypesFrom, options);

  fs.writeFileSync(compiledTypesFile, JSON.stringify(res, null, 2));
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
