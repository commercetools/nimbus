import {
  type HTMLChakraProps,
  type RecipeVariantProps,
  type UnstyledProp,
  createRecipeContext,
} from "@chakra-ui/react/styled-system";
import { toggleButtonRecipe } from "./toggle-button.recipe";
import shouldForwardProp from "@emotion/is-prop-valid";
import { system } from "@/theme";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the toggle button element.
 */
export interface ToggleButtonRecipeProps
  extends RecipeVariantProps<typeof toggleButtonRecipe>,
    UnstyledProp {}

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
export type ToggleButtonRootProps = HTMLChakraProps<
  "button",
  ToggleButtonRecipeProps
>;

const { withContext } = createRecipeContext({
  recipe: toggleButtonRecipe,
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
