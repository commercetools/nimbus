import {
  createSystem,
  defaultBaseConfig,
  defineConfig,
} from "@chakra-ui/react";
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

// Re-export Chakra UI type augmentations for Nimbus's custom theme.
// This ensures the module augmentation is included in the build chain
// and consumers get TypeScript support for Nimbus recipes, tokens, etc.
export * from "./chakra-types.gen";
