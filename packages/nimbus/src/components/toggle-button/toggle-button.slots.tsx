import { createRecipeContext } from "@chakra-ui/react";
import shouldForwardProp from "@emotion/is-prop-valid";
import { system } from "@/theme";
import type { ToggleButtonRootProps } from "./toggle-button.types";

const { withContext } = createRecipeContext({
  key: "toggleButton",
});

/**
 * Root component that provides the styling context for the ToggleButton component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const ToggleButtonRoot = withContext<
  HTMLButtonElement,
  ToggleButtonRootProps
>("button", {
  defaultProps: {
    type: "button",
  },
  /** make sure the `onPress` properties won't end up as attribute on the rendered DOM element */
  shouldForwardProp(prop, variantKeys) {
    const chakraSfp =
      !variantKeys?.includes(prop) && !system.isValidProperty(prop);
    return shouldForwardProp(prop) && chakraSfp && !prop.includes("onPress");
  },
});
