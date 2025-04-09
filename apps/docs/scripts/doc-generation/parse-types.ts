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
  fs.readFile(filePath, "utf8", async (err, content) => {
    if (err) {
      console.error(`Error reading file ${filePath}:`, err);
      return;
    }
    typesObj[filePath] = true;
  });
};
