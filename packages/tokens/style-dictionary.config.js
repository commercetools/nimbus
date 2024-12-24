import StyleDictionary from "style-dictionary";

import { register } from "@tokens-studio/sd-transforms";

import isPlainObject from "is-plain-obj";
import * as prettier from "prettier/standalone";
import * as prettierPluginEstree from "prettier/plugins/estree";
import * as prettierPluginTypescript from "prettier/plugins/typescript";

function formatDTCGforChakra(tokens) {
  const clone = structuredClone(tokens);
  const format = (slice) => {
    if (slice.hasOwnProperty("$value")) {
      slice.value = slice.$value;
      Object.keys(slice).forEach((key) => {
        if (key && key !== "value") delete slice[key];
      });
      delete slice.$value;
    } else {
      Object.values(slice).forEach((val) => {
        if (isPlainObject(val)) {
          format(val);
        }
      });
    }
  };
  format(clone);

  return clone;
}

/** Register token-studio transforms with style-dictionary
 * https://github.com/tokens-studio/sd-transforms?tab=readme-ov-file#usage */
register(StyleDictionary);

StyleDictionary.registerFormat({
  name: "ts/chakra",
  format: function ({ dictionary, platform, options, file }) {
    const formattedTokens = formatDTCGforChakra(dictionary.tokens);

    return prettier.format(
      `export default ${JSON.stringify(formattedTokens, null, 2)} as const; \n`,
      {
        parser: "typescript",
        plugins: [prettierPluginEstree, prettierPluginTypescript],
      }
    );
  },
});

/** define custom transformGroup for css files, see
 * https://v4.styledictionary.com/reference/hooks/transforms/
 * https://v4.styledictionary.com/reference/hooks/transform-groups/
 * https://github.com/tokens-studio/sd-transforms?tab=readme-ov-file#transforms*/
StyleDictionary.registerTransformGroup({
  name: "custom/css",
  transforms: [
    "shadow/css/shorthand",
    "fontFamily/css",
    "cubicBezier/css",
    "color/hsl",
    "name/kebab",
  ],
});

/** define custom transformGroup for js/ts files */
StyleDictionary.registerTransformGroup({
  name: "custom/ts",
  transforms: [
    "shadow/css/shorthand",
    "name/pascal",
    "color/hsl",
    "fontFamily/css",
    "cubicBezier/css",
  ],
});

/** configure style dictionary
 * https://v4.styledictionary.com/reference/config/ */
export default {
  source: ["base/tokens.json"],
  /** run tokens studio preprocessor
   * https://github.com/tokens-studio/sd-transforms?tab=readme-ov-file#using-the-preprocessor*/
  preprocessors: ["tokens-studio"],

  platforms: {
    css: {
      transformGroup: "custom/css",
      buildPath: "generated/css/",
      files: [
        {
          destination: "design-tokens.css",
          /** generate css variables file
           * https://v4.styledictionary.com/reference/hooks/formats/predefined/#cssvariables
           */
          format: "css/variables",
        },
      ],
    },
    ts: {
      transformGroup: "custom/ts",
      buildPath: "generated/ts/",
      files: [
        {
          destination: "design-tokens.ts",
          /** generate ts file
           * https://v4.styledictionary.com/reference/hooks/formats/predefined/#javascriptesm
           */
          format: "javascript/esm",
          options: { stripMeta: true, minify: true },
        },
      ],
    },
    chakra: {
      transformGroup: "custom/ts",
      buildPath: "generated/chakra/",

      files: [
        {
          destination: "theme-tokens.ts",
          /** generate tokens in chakra-accepted format https://www.chakra-ui.com/docs/theming/tokens#defining-tokens*/
          format: "ts/chakra",
        },
      ],
    },
  },
};
