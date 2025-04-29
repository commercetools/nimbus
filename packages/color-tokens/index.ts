/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as radixColors from "@radix-ui/colors";
import { brandColors } from "./brand-colors";
import chroma from "chroma-js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const paletteKeys = Object.keys(radixColors).filter(
  (key) => key !== "__esModule"
);

const ignoredColors = ["mauve", "sage", "olive", "sand", "P3", "default"];
const pickedPalettes = paletteKeys.filter(
  (key) => !ignoredColors.some((ignoredColor) => key.includes(ignoredColor))
);

const sortedPalettes: {
  light: string[];
  lightAlpha: string[];
  dark: string[];
  darkAlpha: string[];
  blacksAndWhites: string[];
} = {
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

// Add this type alias to represent a palette with string keys and values.
type Palette = Record<string, string>;

function createSimplePalette(palette: Palette): SimplePalette {
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

function createSimpleAlphaPalette(palette: Palette): SimplePalette {
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

  return whiteContrast > 2.9 ? white : black;
}

function createColorPalette(basePalette: Palette): ColorPalette {
  const baseKey = Object.keys(basePalette)[0].replace(/\d+$/, "");
  const defaultColor = basePalette[`${baseKey}9`];
  return {
    ...createSimplePalette(basePalette),
    DEFAULT: createValue(defaultColor),
    contrast: createValue(calculateContrastColor(baseKey, defaultColor)),
  };
}

const colorPaletteCollection: ColorPaletteCollection = {};

sortedPalettes.light.forEach((key, index) => {
  const baseName = key.replace(/Dark$/, "");
  // @ts-expect-error - TS doesn't like the dynamic key, but it's fine
  const lightPalette = radixColors[key];
  // @ts-expect-error - TS doesn't like the dynamic key, but it's fine
  const lightAlphaPalette = radixColors[sortedPalettes.lightAlpha[index]];
  // @ts-expect-error - TS doesn't like the dynamic key, but it's fine
  const darkPalette = radixColors[sortedPalettes.dark[index]];
  // @ts-expect-error - TS doesn't like the dynamic key, but it's fine
  const darkAlphaPalette = radixColors[sortedPalettes.darkAlpha[index]];

  colorPaletteCollection[baseName] = {
    light: createColorPalette(lightPalette),
    dark: createColorPalette(darkPalette),
  };

  colorPaletteCollection[baseName + "Alpha"] = {
    light: createColorPalette(lightAlphaPalette),
    dark: createColorPalette(darkAlphaPalette),
  };
});

const semanticPaletteMapping = {
  neutral: "gray",
  primary: "ctviolet", // Changed from 'violet' to 'ctviolet'
  info: "blue",
  critical: "red",
  warning: "amber",
  positive: "grass",
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
        light: createColorPalette(brandColors.ctyellow),
        dark: createColorPalette(brandColors.ctyellowDark),
      },
      ctyellowAlpha: {
        light: createColorPalette(brandColors.ctyellowA),
        dark: createColorPalette(brandColors.ctyellowDarkA),
      },
      ctviolet: {
        light: createColorPalette(brandColors.ctviolet),
        dark: createColorPalette(brandColors.ctvioletDark),
      },
      ctvioletAlpha: {
        light: createColorPalette(brandColors.ctvioletA),
        dark: createColorPalette(brandColors.ctvioletDarkA),
      },
      ctteal: {
        light: createColorPalette(brandColors.ctteal),
        dark: createColorPalette(brandColors.cttealDark),
      },
      cttealAlpha: {
        light: createColorPalette(brandColors.cttealA),
        dark: createColorPalette(brandColors.cttealDarkA),
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

          result[semanticName + "Alpha"] = createPaletteReference(
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
