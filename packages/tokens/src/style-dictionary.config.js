import StyleDictionary from "style-dictionary";
import { fileHeader, minifyDictionary } from "style-dictionary/utils";
import { register } from "@tokens-studio/sd-transforms";
import * as prettier from "prettier/standalone";
import * as prettierPluginEstree from "prettier/plugins/estree";
import * as prettierPluginTypescript from "prettier/plugins/typescript";
import { formatDTCGforChakra } from "./utils/dtcg-to-chakra.js";

/** Register token-studio transforms with style-dictionary
 * https://github.com/tokens-studio/sd-transforms?tab=readme-ov-file#usage */
register(StyleDictionary);

/**Register custom format
 * https://styledictionary.com/reference/hooks/formats/#custom-formats
 * for tokens to be defined as typescript object literals, which results
 * in each value being displayed directly in typescript completions.
 *
 * Passing the `chakraSyntax` option generates a chakra-specific version
 * of the tokens.
 * https://www.chakra-ui.com/docs/theming/tokens#defining-tokens */
StyleDictionary.registerFormat({
  name: "ts/objectLiteral",
  format: async function ({ dictionary, options, file }) {
    const { chakraSyntax } = options;

    /** create header comment with timestamp
     * https://styledictionary.com/reference/utils/format-helpers/#fileheader */
    const header = await fileHeader({
      file,
      formatting: { fileHeaderTimestamp: false },
    });

    /** format tokens based on whether they are chakra syntax */
    const formattedTokens = JSON.stringify(
      chakraSyntax
        ? formatDTCGforChakra(dictionary.tokens)
        : minifyDictionary(dictionary.tokens, options.usesDtcg),
      null,
      2
    );

    const content = `${header} export default ${formattedTokens} as const;\n`;

    return prettier.format(content, {
      parser: "typescript",
      plugins: [prettierPluginEstree, prettierPluginTypescript],
    });
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
  source: ["src/base/tokens.json"],
  /** run tokens studio preprocessor
   * https://github.com/tokens-studio/sd-transforms?tab=readme-ov-file#using-the-preprocessor*/
  preprocessors: ["tokens-studio"],

  platforms: {
    css: {
      transformGroup: "custom/css",
      buildPath: "css/",
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
      buildPath: "src/generated/ts/",
      files: [
        {
          destination: "design-tokens.ts",
          /** generate ts file
           * https://v4.styledictionary.com/reference/hooks/formats/predefined/#javascriptesm
           */
          format: "ts/objectLiteral",
        },
      ],
    },
    chakra: {
      transformGroup: "custom/ts",
      buildPath: "src/generated/chakra/",

      files: [
        {
          destination: "theme-tokens.ts",
          /** generate tokens in chakra-accepted format https://www.chakra-ui.com/docs/theming/tokens#defining-tokens*/
          format: "ts/objectLiteral",
          options: {
            chakraSyntax: true,
            /** create custom header with timestamp of most recent build
             * https://styledictionary.com/reference/hooks/file-headers/#applying-it-in-config */
            fileHeader: (defaultMessage) => [
              ...defaultMessage,
              "This file is for only meant for use in building the chakra theme",
            ],
          },
        },
      ],
    },
  },
};
