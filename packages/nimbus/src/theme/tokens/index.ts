import { aspectRatios } from "./aspect-ratios";
import { animations } from "./animations";
import { blurs } from "./blurs";
import { borders } from "./borders";
import { colors, darkColors } from "./colors";
import { durations } from "./durations";
import { easings } from "./easings";
import { fonts } from "./fonts";
import { fontSizes } from "./font-sizes";
import { fontWeights } from "./font-weights";
import { letterSpacings } from "./letter-spacings";
import { lineHeights } from "./line-heights";
import { radii } from "./radii";
import { spacing } from "./spacing";
import { sizes } from "./sizes";
import { zIndex } from "./z-index";
import { cursor } from "./cursor";

export const tokens = {
  aspectRatios,
  animations,
  blurs,
  borders,
  colors,
  durations,
  easings,
  fonts,
  fontSizes,
  fontWeights,
  letterSpacings,
  lineHeights,
  radii,
  spacing,
  sizes,
  zIndex,
  cursor,
};

export const darkTokens = {
  aspectRatios,
  animations,
  blurs,
  borders,
  colors: darkColors,
  durations,
  easings,
  fonts,
  fontSizes,
  fontWeights,
  letterSpacings,
  lineHeights,
  radii,
  spacing,
  sizes,
  zIndex,
  cursor,
};
