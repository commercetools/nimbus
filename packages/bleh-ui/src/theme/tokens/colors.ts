import { defineTokens } from "@chakra-ui/react";

import {
  gray,
  grayA,
  mauve,
  mauveA,
  slate,
  slateA,
  sage,
  sageA,
  olive,
  oliveA,
  sand,
  sandA,
  tomato,
  tomatoA,
  red,
  redA,
  ruby,
  rubyA,
  crimson,
  crimsonA,
  pink,
  pinkA,
  plum,
  plumA,
  purple,
  purpleA,
  violet,
  violetA,
  iris,
  irisA,
  indigo,
  indigoA,
  blue,
  blueA,
  cyan,
  cyanA,
  teal,
  tealA,
  jade,
  jadeA,
  green,
  greenA,
  grass,
  grassA,
  bronze,
  bronzeA,
  gold,
  goldA,
  brown,
  brownA,
  orange,
  orangeA,
  amber,
  amberA,
  yellow,
  yellowA,
  lime,
  limeA,
  mint,
  mintA,
  sky,
  skyA,
  blackA,
  whiteA,
} from "@radix-ui/colors";

import {
  grayDark,
  grayDarkA,
  mauveDark,
  mauveDarkA,
  slateDark,
  slateDarkA,
  sageDark,
  sageDarkA,
  oliveDark,
  oliveDarkA,
  sandDark,
  sandDarkA,
  tomatoDark,
  tomatoDarkA,
  redDark,
  redDarkA,
  rubyDark,
  rubyDarkA,
  crimsonDark,
  crimsonDarkA,
  pinkDark,
  pinkDarkA,
  plumDark,
  plumDarkA,
  purpleDark,
  purpleDarkA,
  violetDark,
  violetDarkA,
  irisDark,
  irisDarkA,
  indigoDark,
  indigoDarkA,
  blueDark,
  blueDarkA,
  cyanDark,
  cyanDarkA,
  tealDark,
  tealDarkA,
  jadeDark,
  jadeDarkA,
  greenDark,
  greenDarkA,
  grassDark,
  grassDarkA,
  bronzeDark,
  bronzeDarkA,
  goldDark,
  goldDarkA,
  brownDark,
  brownDarkA,
  orangeDark,
  orangeDarkA,
  amberDark,
  amberDarkA,
  yellowDark,
  yellowDarkA,
  limeDark,
  limeDarkA,
  mintDark,
  mintDarkA,
  skyDark,
  skyDarkA,
} from "@radix-ui/colors";

type ColorToken = {
  value: string;
};

type RawPalette = Record<string, string>;

type BasePalette = {
  "1": ColorToken;
  "2": ColorToken;
  "3": ColorToken;
  "4": ColorToken;
  "5": ColorToken;
  "6": ColorToken;
  "7": ColorToken;
  "8": ColorToken;
  "9": ColorToken;
  "10": ColorToken;
  "11": ColorToken;
  "12": ColorToken;
};

type ColorScale = {
  [key: string]: {
    DEFAULT: ColorToken;
    "1": ColorToken;
    "2": ColorToken;
    "3": ColorToken;
    "4": ColorToken;
    "5": ColorToken;
    "6": ColorToken;
    "7": ColorToken;
    "8": ColorToken;
    "9": ColorToken;
    "10": ColorToken;
    "11": ColorToken;
    "12": ColorToken;
    contrast: ColorToken;
    alpha: {
      "1": ColorToken;
      "2": ColorToken;
      "3": ColorToken;
      "4": ColorToken;
      "5": ColorToken;
      "6": ColorToken;
      "7": ColorToken;
      "8": ColorToken;
      "9": ColorToken;
      "10": ColorToken;
      "11": ColorToken;
      "12": ColorToken;
    };
  };
};

const unstringKeys = (obj: RawPalette) => {
  const result: { [key: string]: ColorToken } = {};
  for (const key in obj) {
    const k = key.replace(/\D/g, "");
    result[k] = { value: obj[key] };
  }
  return result as BasePalette;
};

const makeScale = (
  name: string,
  basePalette: RawPalette,
  alphaPalette: RawPalette,
  contrastColor: "black" | "white"
) => {
  const p = unstringKeys(basePalette);
  const pA = unstringKeys(alphaPalette);

  return {
    [name]: {
      DEFAULT: p["9"],
      "1": p["1"],
      "2": p["2"],
      "3": p["3"],
      "4": p["4"],
      "5": p["5"],
      "6": p["6"],
      "7": p["7"],
      "8": p["8"],
      "9": p["9"],
      "10": p["10"],
      "11": p["11"],
      "12": p["12"],
      contrast: { value: contrastColor },
      alpha: {
        "1": pA["1"],
        "2": pA["2"],
        "3": pA["3"],
        "4": pA["4"],
        "5": pA["5"],
        "6": pA["6"],
        "7": pA["7"],
        "8": pA["8"],
        "9": pA["9"],
        "10": pA["10"],
        "11": pA["11"],
        "12": pA["12"],
      },
    },
  } as ColorScale;
};

const makeSemanticScale = (
  /** semantic name */
  name: string,
  /** reference palette */
  ref: string
) => {
  return {
    [name]: {
      DEFAULT: `{colors.${ref}}`,
      "1": `{colors.${ref}.1}`,
      "2": `{colors.${ref}.2}`,
      "3": `{colors.${ref}.3}`,
      "4": `{colors.${ref}.4}`,
      "5": `{colors.${ref}.5}`,
      "6": `{colors.${ref}.6}`,
      "7": `{colors.${ref}.7}`,
      "8": `{colors.${ref}.8}`,
      "9": `{colors.${ref}.9}`,
      "10": `{colors.${ref}.10}`,
      "11": `{colors.${ref}.11}`,
      "12": `{colors.${ref}.12}`,
      contrast: `{colors.${ref}.contrast}`,
      alpha: {
        "1": `{colors.${ref}.alpha.1}`,
        "2": `{colors.${ref}.alpha.2}`,
        "3": `{colors.${ref}.alpha.3}`,
        "4": `{colors.${ref}.alpha.4}`,
        "5": `{colors.${ref}.alpha.5}`,
        "6": `{colors.${ref}.alpha.6}`,
        "7": `{colors.${ref}.alpha.7}`,
        "8": `{colors.${ref}.alpha.8}`,
        "9": `{colors.${ref}.alpha.9}`,
        "10": `{colors.${ref}.alpha.10}`,
        "11": `{colors.${ref}.alpha.11}`,
        "12": `{colors.${ref}.alpha.12}`,
      },
    },
  };
};

export const ctYellow = {
  "1": "#fefdfb",
  "2": "#fffae9",
  "3": "#fff4cf",
  "4": "#ffebac",
  "5": "#ffe081",
  "6": "#f9d475",
  "7": "#e6c368",
  "8": "#d4ab3c",
  "9": "#ffcc16",
  "10": "#f6c326",
  "11": "#957200",
  "12": "#453a1e",
};

export const ctYellowAlpha = {
  "1": "#cc990005",
  "2": "#ffc80017",
  "3": "#ffd60043",
  "4": "#ffcf0069",
  "5": "#ffca008e",
  "6": "#f5b40092",
  "7": "#d69f009c",
  "8": "#ca9800cd",
  "9": "#ffd000",
  "10": "#f9c700",
  "11": "#977200",
  "12": "#2c2000e1",
};

export const ctYellowDark = {
  "1": "#000",
  "2": "#151109",
  "3": "#281f04",
  "4": "#382800",
  "5": "#463300",
  "6": "#544101",
  "7": "#e6c368",
  "8": "#836a20",
  "9": "#ffcc16",
  "10": "#f5c200",
  "11": "#ffcf1e",
  "12": "#fce8b3",
};

export const ctYellowDarkAlpha = {
  "1": "#00000000",
  "2": "#ffcf6e15",
  "3": "#ffc61a28",
  "4": "#ffb70038",
  "5": "#ffba0046",
  "6": "#ffc60454",
  "7": "#ffce3767",
  "8": "#ffcf3f83",
  "9": "#ffcc16",
  "10": "#ffca00f5",
  "11": "#ffcf1e",
  "12": "#ffebb5fc",
};

export const ctViolet = {
  "1": "#fdfdff",
  "2": "#f7f8ff",
  "3": "#eef1ff",
  "4": "#e3e7ff",
  "5": "#d6dcff",
  "6": "#c6cdff",
  "7": "#b0b9ff",
  "8": "#939cff",
  "9": "#6359ff",
  "10": "#584ee7",
  "11": "#5347e0",
  "12": "#27236e",
};

export const ctVioletAlpha = {
  "1": "#0000ff02",
  "2": "#0020ff08",
  "3": "#002dff11",
  "4": "#002cff1d",
  "5": "#002bff2a",
  "6": "#0024ff3a",
  "7": "#001eff4f",
  "8": "#0016ff6c",
  "9": "#1000ffa6",
  "10": "#0f00ddb1",
  "11": "#5347e0",
  "12": "#1100d4b8",
};

export const ctVioletDark = {
  "1": "#000",
  "2": "#0d0f21",
  "3": "#1c1b4c",
  "4": "#26216f",
  "5": "#302c82",
  "6": "#3a3891",
  "7": "#4544a7",
  "8": "#5352c6",
  "9": "#6359ff",
  "10": "#5849ef",
  "11": "#a3acff",
  "12": "#dae0ff",
};

export const ctVioletDarkAlpha = {
  "1": "#00000000",
  "2": "#6574ff21",
  "3": "#5e5bff4c",
  "4": "#584cff6f",
  "5": "#5f57ff82",
  "6": "#6663ff91",
  "7": "#6a68ffa7",
  "8": "#6b6affc6",
  "9": "#6359ff",
  "10": "#5e4effef",
  "11": "#a3acff",
  "12": "#dae0ff",
};

export const ctTeal = {
  "1": "#f9fefe",
  "2": "#f1fbfb",
  "3": "#daf9f8",
  "4": "#c3f4f3",
  "5": "#abeceb",
  "6": "#91e1e0",
  "7": "#6cd1d1",
  "8": "#02bdbd",
  "9": "#0bbfbf",
  "10": "#00b3b4",
  "11": "#008080",
  "12": "#003f3f",
};

export const ctTealAlpha = {
  "1": "#00d5d506",
  "2": "#00b7b70e",
  "3": "#00d6cf25",
  "4": "#00d1cc3c",
  "5": "#00c6c354",
  "6": "#00bab86e",
  "7": "#00b0b093",
  "8": "#00bcbcfd",
  "9": "#00bcbcf4",
  "10": "#00b3b4",
  "11": "#008080",
  "12": "#003f3f",
};

export const ctTealDark = {
  "1": "#000",
  "2": "#081515",
  "3": "#042929",
  "4": "#003939",
  "5": "#004747",
  "6": "#005656",
  "7": "#096969",
  "8": "#038181",
  "9": "#0bbfbf",
  "10": "#00b3b4",
  "11": "#37d2d2",
  "12": "#aaefee",
};

export const ctTealDarkAlpha = {
  "1": "#00000000",
  "2": "#62ffff15",
  "3": "#19ffff29",
  "4": "#00ffff39",
  "5": "#00ffff47",
  "6": "#00ffff56",
  "7": "#16ffff69",
  "8": "#06ffff81",
  "9": "#0fffffbf",
  "10": "#00feffb4",
  "11": "#43ffffd2",
  "12": "#b5fffeef",
};

const lightColorSystem = {
  // black & white alpha
  ...makeScale("black", blackA, blackA, "white"),
  ...makeScale("white", whiteA, whiteA, "black"),
  // grays
  ...makeScale("gray", gray, grayA, "white"),
  ...makeScale("mauve", mauve, mauveA, "white"),
  ...makeScale("slate", slate, slateA, "white"),
  ...makeScale("sage", sage, sageA, "white"),
  ...makeScale("olive", olive, oliveA, "white"),
  ...makeScale("sand", sand, sandA, "white"),
  // colors
  ...makeScale("tomato", tomato, tomatoA, "white"),
  ...makeScale("red", red, redA, "white"),
  ...makeScale("ruby", ruby, rubyA, "white"),
  ...makeScale("crimson", crimson, crimsonA, "white"),
  ...makeScale("pink", pink, pinkA, "white"),
  ...makeScale("plum", plum, plumA, "white"),
  ...makeScale("purple", purple, purpleA, "white"),
  ...makeScale("violet", violet, violetA, "white"),
  ...makeScale("iris", iris, irisA, "white"),
  ...makeScale("indigo", indigo, indigoA, "white"),
  ...makeScale("blue", blue, blueA, "white"),
  ...makeScale("cyan", cyan, cyanA, "white"),
  ...makeScale("teal", teal, tealA, "white"),
  ...makeScale("jade", jade, jadeA, "white"),
  ...makeScale("green", green, greenA, "white"),
  ...makeScale("grass", grass, grassA, "white"),
  ...makeScale("bronze", bronze, bronzeA, "white"),
  ...makeScale("gold", gold, goldA, "white"),
  ...makeScale("brown", brown, brownA, "white"),
  ...makeScale("orange", orange, orangeA, "white"),
  // light colors which need a dark contrast color (for step 9 + 10)
  ...makeScale("amber", amber, amberA, "black"),
  ...makeScale("yellow", yellow, yellowA, "black"),
  ...makeScale("lime", lime, limeA, "black"),
  ...makeScale("mint", mint, mintA, "black"),
  ...makeScale("sky", sky, skyA, "black"),

  // CT COLORS
  ...makeScale("ctYellow", ctYellow, ctYellowAlpha, "black"),
  ...makeScale("ctViolet", ctViolet, ctVioletAlpha, "white"),
  ...makeScale("ctTeal", ctTeal, ctTealAlpha, "white"),
  // semantic references
  ...makeSemanticScale("neutral", "gray"),
  ...makeSemanticScale("primary", "ctViolet"),
  ...makeSemanticScale("info", "blue"),
  ...makeSemanticScale("error", "red"),
  ...makeSemanticScale("danger", "orange"),
  ...makeSemanticScale("success", "grass"),
};
const darkColorSystem = {
  // black & white alpha
  ...makeScale("black", blackA, blackA, "white"),
  ...makeScale("white", whiteA, whiteA, "black"),
  // grays
  ...makeScale("gray", grayDark, grayDarkA, "white"),
  ...makeScale("mauve", mauveDark, mauveDarkA, "white"),
  ...makeScale("slate", slateDark, slateDarkA, "white"),
  ...makeScale("sage", sageDark, sageDarkA, "white"),
  ...makeScale("olive", oliveDark, oliveDarkA, "white"),
  ...makeScale("sand", sandDark, sandDarkA, "white"),
  // colors
  ...makeScale("tomato", tomatoDark, tomatoDarkA, "white"),
  ...makeScale("red", redDark, redDarkA, "white"),
  ...makeScale("ruby", rubyDark, rubyDarkA, "white"),
  ...makeScale("crimson", crimsonDark, crimsonDarkA, "white"),
  ...makeScale("pink", pinkDark, pinkDarkA, "white"),
  ...makeScale("plum", plumDark, plumDarkA, "white"),
  ...makeScale("purple", purpleDark, purpleDarkA, "white"),
  ...makeScale("violet", violetDark, violetDarkA, "white"),
  ...makeScale("iris", irisDark, irisDarkA, "white"),
  ...makeScale("indigo", indigoDark, indigoDarkA, "white"),
  ...makeScale("blue", blueDark, blueDarkA, "white"),
  ...makeScale("cyan", cyanDark, cyanDarkA, "white"),
  ...makeScale("teal", tealDark, tealDarkA, "white"),
  ...makeScale("jade", jadeDark, jadeDarkA, "white"),
  ...makeScale("green", greenDark, greenDarkA, "white"),
  ...makeScale("grass", grassDark, grassDarkA, "white"),
  ...makeScale("bronze", bronzeDark, bronzeDarkA, "white"),
  ...makeScale("gold", goldDark, goldDarkA, "white"),
  ...makeScale("brown", brownDark, brownDarkA, "white"),
  ...makeScale("orange", orangeDark, orangeDarkA, "white"),
  // light colors which need a dark contrast color (for step 9 + 10)
  ...makeScale("amber", amberDark, amberDarkA, "black"),
  ...makeScale("yellow", yellowDark, yellowDarkA, "black"),
  ...makeScale("lime", limeDark, limeDarkA, "black"),
  ...makeScale("mint", mintDark, mintDarkA, "black"),
  ...makeScale("sky", skyDark, skyDarkA, "black"),
  // CT COLORS
  ...makeScale("ctYellow", ctYellowDark, ctYellowDarkAlpha, "black"),
  ...makeScale("ctViolet", ctVioletDark, ctVioletDarkAlpha, "white"),
  ...makeScale("ctTeal", ctTealDark, ctTealDarkAlpha, "white"),
  // semantic references
  ...makeSemanticScale("neutral", "gray"),
  ...makeSemanticScale("primary", "ctViolet"),
  ...makeSemanticScale("info", "blue"),
  ...makeSemanticScale("error", "red"),
  ...makeSemanticScale("danger", "orange"),
  ...makeSemanticScale("success", "grass"),
};

export const colors = defineTokens.colors({
  transparent: {
    value: "transparent",
  },
  current: {
    value: "currentColor",
  },
  black: {
    value: "#09090B",
  },
  white: {
    value: "#FFFFFF",
  },

  ...lightColorSystem,
});

export const darkColors = defineTokens.colors({
  transparent: {
    value: "transparent",
  },
  current: {
    value: "currentColor",
  },
  black: {
    value: "#09090B",
  },
  white: {
    value: "#FFFFFF",
  },

  ...darkColorSystem,
});
