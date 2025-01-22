import {
  createSystem,
  defaultBaseConfig,
  defineConfig,
} from "@chakra-ui/react";
import { animationStyles } from "./animation-styles";
import { breakpoints } from "./breakpoints";
import { globalCss } from "./global-css";
import { keyframes } from "./keyframes";
import { layerStyles } from "./layer-styles";
import { recipes } from "./recipes";
import { semanticTokens } from "./semantic-tokens";
import { slotRecipes } from "./slot-recipes";
import { textStyles } from "./text-styles";
import { darkTokens } from "./tokens";

const themeConfig = defineConfig({
  preflight: true,
  cssVarsPrefix: "bleh-ui",
  cssVarsRoot: ":where(:root, :host)",
  globalCss,
  theme: {
    breakpoints,
    keyframes,
    tokens: darkTokens,
    semanticTokens,
    recipes,
    slotRecipes,
    textStyles,
    layerStyles,
    animationStyles,
  },
});

export const system = createSystem(defaultBaseConfig, themeConfig);
