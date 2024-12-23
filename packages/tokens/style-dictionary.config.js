import StyleDictionary from "style-dictionary";
import { register } from "@tokens-studio/sd-transforms";

/** Register token-studio transforms with style-dictionary
 * https://github.com/tokens-studio/sd-transforms?tab=readme-ov-file#usage */
register(StyleDictionary);

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
  transforms: ["shadow/css/shorthand", "name/pascal", "color/hsl"],
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
      buildPath: "generated/js/",
      files: [
        {
          destination: "design-tokens.js",
          /** generate js file
           * https://v4.styledictionary.com/reference/hooks/formats/predefined/#javascriptesm
           */
          format: "javascript/esm",
          options: { stripMeta: true, minify: true },
        },
        {
          destination: "design-tokens.d.ts",
          /** generate d.ts file
           * https://v4.styledictionary.com/reference/hooks/formats/predefined/#typescriptes6-declarations
           */
          format: "typescript/es6-declarations",
          options: { outputStringLiterals: true },
        },
      ],
    },
  },
};
