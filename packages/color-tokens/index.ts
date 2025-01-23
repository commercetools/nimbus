import * as radixColors from "@radix-ui/colors";
import { brandColors } from "./brand-colors";
import chroma from "chroma-js";
import * as fs from "fs";
import * as path from "path";

const paletteKeys = Object.keys(radixColors);

const ignoredColors = ["mauve", "sage", "olive", "sand", "P3", "default"];
const pickedPalettes = paletteKeys.filter(
  (key) => !ignoredColors.some((ignoredColor) => key.includes(ignoredColor))
);

const sortedPalettes = {
  light: [],
  lightAlpha: [],
  dark: [],
  darkAlpha: [],
  blacksAndWhites: [],
};

pickedPalettes.forEach((key) => {
  if (key.includes("blackA") || key.includes("whiteA")) {
    sortedPalettes.blacksAndWhites.push(key);
  } else if (key.includes("DarkA")) {
    sortedPalettes.darkAlpha.push(key);
  } else if (key.includes("Dark")) {
    sortedPalettes.dark.push(key);
  } else if (key.includes("A")) {
    sortedPalettes.lightAlpha.push(key);
  } else {
    sortedPalettes.light.push(key);
  }
});

if (
  sortedPalettes.light.length !== sortedPalettes.lightAlpha.length ||
  sortedPalettes.light.length !== sortedPalettes.dark.length ||
  sortedPalettes.light.length !== sortedPalettes.darkAlpha.length
) {
  throw new Error(
    "light, lightAlpha, dark, and darkAlpha categories must have the same length"
  );
}

type SimplePalette = {
  "1": ValueObject<string>;
  "2": ValueObject<string>;
  "3": ValueObject<string>;
  "4": ValueObject<string>;
  "5": ValueObject<string>;
  "6": ValueObject<string>;
  "7": ValueObject<string>;
  "8": ValueObject<string>;
  "9": ValueObject<string>;
  "10": ValueObject<string>;
  "11": ValueObject<string>;
  "12": ValueObject<string>;
};

type ColorPalette = SimplePalette & {
  /** the default color if someone just uses the palette name without any step */
  DEFAULT: ValueObject<string>;
  /** contrast color that works on step 9 + 10 */
  contrast: ValueObject<string>;
  /** alpha variants of that color */
  alpha: SimplePalette;
};

type ColorPaletteCollectionStructure = {
  light: ColorPalette;
  dark: ColorPalette;
};

type ColorPaletteCollection = {
  [key: string]: ColorPaletteCollectionStructure;
};

type ValueObject<T> = {
  $value: T;
};

function createValue<T>(value: T): ValueObject<T> {
  return { $value: value };
}

function createSimplePalette(palette: any): SimplePalette {
  const baseKey = Object.keys(palette)[0].replace(/\d+$/, "");
  const paletteSteps = {
    1: `${baseKey}1`,
    2: `${baseKey}2`,
    3: `${baseKey}3`,
    4: `${baseKey}4`,
    5: `${baseKey}5`,
    6: `${baseKey}6`,
    7: `${baseKey}7`,
    8: `${baseKey}8`,
    9: `${baseKey}9`,
    10: `${baseKey}10`,
    11: `${baseKey}11`,
    12: `${baseKey}12`,
  };

  return Object.entries(paletteSteps).reduce((result, [step, key]) => {
    result[step as keyof SimplePalette] = createValue(palette[key]);
    return result;
  }, {} as SimplePalette);
}

function createSimpleAlphaPalette(palette: any): SimplePalette {
  const baseKey = Object.keys(palette)[0].replace(/\d+$/, "");
  return Object.entries(palette).reduce((result, [key, value]) => {
    const step = key.replace(baseKey, "");
    result[step as keyof SimplePalette] = createValue(value);
    return result;
  }, {} as SimplePalette);
}

function calculateContrastColor(baseKey: string, color: string): string {
  const black = "#000000";
  const white = "#ffffff";

  const whiteContrast = chroma.contrast(white, color);

  console.log(baseKey, whiteContrast);

  return whiteContrast > 2.9 ? white : black;
}

function createColorPalette(basePalette: any, alphaPalette: any): ColorPalette {
  const baseKey = Object.keys(basePalette)[0].replace(/\d+$/, "");
  const defaultColor = basePalette[`${baseKey}9`];
  return {
    ...createSimplePalette(basePalette),
    DEFAULT: createValue(defaultColor),
    contrast: createValue(calculateContrastColor(baseKey, defaultColor)),
    alpha: createSimplePalette(alphaPalette),
  };
}

const colorPaletteCollection: ColorPaletteCollection = {};

sortedPalettes.light.forEach((key, index) => {
  const baseName = key.replace(/Dark$/, "");
  const lightPalette = radixColors[key];
  const lightAlphaPalette = radixColors[sortedPalettes.lightAlpha[index]];
  const darkPalette = radixColors[sortedPalettes.dark[index]];
  const darkAlphaPalette = radixColors[sortedPalettes.darkAlpha[index]];

  colorPaletteCollection[baseName] = {
    light: createColorPalette(lightPalette, lightAlphaPalette),
    dark: createColorPalette(darkPalette, darkAlphaPalette),
  };
});

const semanticPaletteMapping = {
  neutral: "gray",
  primary: "ctviolet", // Changed from 'violet' to 'ctviolet'
  info: "blue",
  error: "red",
  danger: "orange",
  success: "grass",
};

function createPaletteReference(
  systemName: string,
  isBrandPalette: boolean = false
): ColorPaletteCollectionStructure {
  const basePath = isBrandPalette ? "brand-palettes" : "system-palettes";
  return {
    light: {
      "1": { $value: `{color.${basePath}.${systemName}.light.1}` },
      "2": { $value: `{color.${basePath}.${systemName}.light.2}` },
      "3": { $value: `{color.${basePath}.${systemName}.light.3}` },
      "4": { $value: `{color.${basePath}.${systemName}.light.4}` },
      "5": { $value: `{color.${basePath}.${systemName}.light.5}` },
      "6": { $value: `{color.${basePath}.${systemName}.light.6}` },
      "7": { $value: `{color.${basePath}.${systemName}.light.7}` },
      "8": { $value: `{color.${basePath}.${systemName}.light.8}` },
      "9": { $value: `{color.${basePath}.${systemName}.light.9}` },
      "10": { $value: `{color.${basePath}.${systemName}.light.10}` },
      "11": { $value: `{color.${basePath}.${systemName}.light.11}` },
      "12": { $value: `{color.${basePath}.${systemName}.light.12}` },
      DEFAULT: { $value: `{color.${basePath}.${systemName}.light.DEFAULT}` },
      contrast: { $value: `{color.${basePath}.${systemName}.light.contrast}` },
      alpha: {
        "1": { $value: `{color.${basePath}.${systemName}.light.alpha.1}` },
        "2": { $value: `{color.${basePath}.${systemName}.light.alpha.2}` },
        "3": { $value: `{color.${basePath}.${systemName}.light.alpha.3}` },
        "4": { $value: `{color.${basePath}.${systemName}.light.alpha.4}` },
        "5": { $value: `{color.${basePath}.${systemName}.light.alpha.5}` },
        "6": { $value: `{color.${basePath}.${systemName}.light.alpha.6}` },
        "7": { $value: `{color.${basePath}.${systemName}.light.alpha.7}` },
        "8": { $value: `{color.${basePath}.${systemName}.light.alpha.8}` },
        "9": { $value: `{color.${basePath}.${systemName}.light.alpha.9}` },
        "10": { $value: `{color.${basePath}.${systemName}.light.alpha.10}` },
        "11": { $value: `{color.${basePath}.${systemName}.light.alpha.11}` },
        "12": { $value: `{color.${basePath}.${systemName}.light.alpha.12}` },
      },
    },
    dark: {
      "1": { $value: `{color.${basePath}.${systemName}.dark.1}` },
      "2": { $value: `{color.${basePath}.${systemName}.dark.2}` },
      "3": { $value: `{color.${basePath}.${systemName}.dark.3}` },
      "4": { $value: `{color.${basePath}.${systemName}.dark.4}` },
      "5": { $value: `{color.${basePath}.${systemName}.dark.5}` },
      "6": { $value: `{color.${basePath}.${systemName}.dark.6}` },
      "7": { $value: `{color.${basePath}.${systemName}.dark.7}` },
      "8": { $value: `{color.${basePath}.${systemName}.dark.8}` },
      "9": { $value: `{color.${basePath}.${systemName}.dark.9}` },
      "10": { $value: `{color.${basePath}.${systemName}.dark.10}` },
      "11": { $value: `{color.${basePath}.${systemName}.dark.11}` },
      "12": { $value: `{color.${basePath}.${systemName}.dark.12}` },
      DEFAULT: { $value: `{color.${basePath}.${systemName}.dark.DEFAULT}` },
      contrast: { $value: `{color.${basePath}.${systemName}.dark.contrast}` },
      alpha: {
        "1": { $value: `{color.${basePath}.${systemName}.dark.alpha.1}` },
        "2": { $value: `{color.${basePath}.${systemName}.dark.alpha.2}` },
        "3": { $value: `{color.${basePath}.${systemName}.dark.alpha.3}` },
        "4": { $value: `{color.${basePath}.${systemName}.dark.alpha.4}` },
        "5": { $value: `{color.${basePath}.${systemName}.dark.alpha.5}` },
        "6": { $value: `{color.${basePath}.${systemName}.dark.alpha.6}` },
        "7": { $value: `{color.${basePath}.${systemName}.dark.alpha.7}` },
        "8": { $value: `{color.${basePath}.${systemName}.dark.alpha.8}` },
        "9": { $value: `{color.${basePath}.${systemName}.dark.alpha.9}` },
        "10": { $value: `{color.${basePath}.${systemName}.dark.alpha.10}` },
        "11": { $value: `{color.${basePath}.${systemName}.dark.alpha.11}` },
        "12": { $value: `{color.${basePath}.${systemName}.dark.alpha.12}` },
      },
    },
  };
}

const palettes = {
  color: {
    $type: "color",
    ["blacks-and-whites"]: {
      black: createValue("#000"),
      white: createValue("#FFF"),
      blackAlpha: createSimpleAlphaPalette(radixColors.blackA),
      whiteAlpha: createSimpleAlphaPalette(radixColors.whiteA),
    },
    ["system-palettes"]: {
      ...colorPaletteCollection,
    },
    ["brand-palettes"]: {
      ctyellow: {
        light: createColorPalette(brandColors.ctyellow, brandColors.ctyellowA),
        dark: createColorPalette(
          brandColors.ctyellowDark,
          brandColors.ctyellowDarkA
        ),
      },
      ctviolet: {
        light: createColorPalette(brandColors.ctviolet, brandColors.ctvioletA),
        dark: createColorPalette(
          brandColors.ctvioletDark,
          brandColors.ctvioletDarkA
        ),
      },
      ctteal: {
        light: createColorPalette(brandColors.ctteal, brandColors.cttealA),
        dark: createColorPalette(
          brandColors.cttealDark,
          brandColors.cttealDarkA
        ),
      },
    },
    ["semantic-palettes"]: {
      $type: "color",
      ...Object.entries(semanticPaletteMapping).reduce(
        (result, [semanticName, systemName]) => {
          // TODO: Make pretty. Will do for now, probably will break at some point
          const isBrandPalette = systemName.startsWith("ct");
          result[semanticName] = createPaletteReference(
            systemName,
            isBrandPalette
          );
          return result;
        },
        {} as ColorPaletteCollection
      ),
    },
  },
};

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, "dist");
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Write the JSON file
fs.writeFileSync(
  path.join(distDir, "color-tokens.json"),
  JSON.stringify(palettes, null, 2),
  "utf-8"
);
