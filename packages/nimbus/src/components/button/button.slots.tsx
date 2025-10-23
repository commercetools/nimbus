import { createRecipeContext } from "@chakra-ui/react";
import { buttonRecipe } from "./button.recipe";
import shouldForwardProp from "@emotion/is-prop-valid";
import { system } from "@/theme";
import type { ButtonRootSlotProps } from "./button.types";

const { withContext } = createRecipeContext({
  recipe: buttonRecipe,
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
    /** make sure the `onPress` properties won't end up as attribute on the rendered DOM element */
    shouldForwardProp(prop, variantKeys) {
      const chakraSfp =
        !variantKeys?.includes(prop) && !system.isValidProperty(prop);
      return shouldForwardProp(prop) && chakraSfp && !prop.includes("onPress");
    },
  }
);
