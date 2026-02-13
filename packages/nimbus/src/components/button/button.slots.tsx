import { createRecipeContext } from "@chakra-ui/react";
import shouldForwardProp from "@emotion/is-prop-valid";
import { system } from "@/theme";
import type { ButtonRootSlotProps } from "./button.types";

const { withContext } = createRecipeContext({
  key: "nimbusButton",
});

/**
 * Root component that provides the styling context for the Button component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const ButtonRoot = withContext<HTMLButtonElement, ButtonRootSlotProps>(
  "button",
  {
    defaultProps: {
      type: "button",
    },
    /**
     * Standard Chakra shouldForwardProp with @emotion/is-prop-valid as safety net.
     * React Aria logical props (onPress, isDisabled, etc.) are already filtered
     * at the component level in button.tsx. This function serves as defense-in-depth
     * in case any non-DOM props leak through (e.g., from external ButtonContext providers).
     */
    shouldForwardProp(prop, variantKeys) {
      const chakraSfp =
        !variantKeys?.includes(prop) && !system.isValidProperty(prop);
      return shouldForwardProp(prop) && chakraSfp;
    },
  }
);
