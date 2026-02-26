import { createRecipeContext } from "@chakra-ui/react/styled-system";
import shouldForwardProp from "@emotion/is-prop-valid";
import { system } from "@/theme";
import type { ToggleButtonRootSlotProps } from "./toggle-button.types";

const { withContext } = createRecipeContext({
  key: "nimbusToggleButton",
});

/**
 * Root component that provides the styling context for the ToggleButton component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const ToggleButtonRoot = withContext<
  HTMLButtonElement,
  ToggleButtonRootSlotProps
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
