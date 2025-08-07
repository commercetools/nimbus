import {
  type HTMLChakraProps,
  type RecipeProps,
  type UnstyledProp,
  createRecipeContext,
} from "@chakra-ui/react/styled-system";
import { buttonRecipe } from "./button.recipe";
import shouldForwardProp from "@emotion/is-prop-valid";
import { system } from "@/theme";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the button element.
 */
interface ButtonRecipeProps extends RecipeProps<"button">, UnstyledProp {}

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
export interface ButtonRootProps
  extends Omit<HTMLChakraProps<"button", ButtonRecipeProps>, "slot"> {
  // insure that the `ButtonRoot` component doesn't give a type error
  slot?: string | null | undefined;
}

const { withContext } = createRecipeContext({
  recipe: buttonRecipe,
});

/**
 * Root component that provides the styling context for the Button component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const ButtonRoot = withContext<HTMLButtonElement, ButtonRootProps>(
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
