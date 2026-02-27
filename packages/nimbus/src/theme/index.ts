import { createSystem, defineConfig } from "@chakra-ui/react/styled-system";
import { defaultBaseConfig } from "@chakra-ui/react/preset-base";
import { animationStyles } from "./animation-styles";
import { breakpoints } from "./breakpoints";
import { conditions } from "./conditions";
import { globalCss } from "./global-css";
import { keyframes } from "./keyframes";
import { layerStyles } from "./layer-styles";
import { recipes } from "./recipes";
import { semanticTokens } from "./semantic-tokens";
import { slotRecipes } from "./slot-recipes";
import { textStyles } from "./text-styles";
import { tokens } from "./tokens";

const themeConfig = defineConfig({
  preflight: true,
  cssVarsPrefix: "nimbus",
  cssVarsRoot: ":where(:root, :host)",
  globalCss,
  conditions,
  theme: {
    breakpoints,
    keyframes,
    tokens,
    semanticTokens,
    recipes,
    slotRecipes,
    textStyles,
    layerStyles,
    animationStyles,
  },
});

export const system = createSystem(defaultBaseConfig, themeConfig);
