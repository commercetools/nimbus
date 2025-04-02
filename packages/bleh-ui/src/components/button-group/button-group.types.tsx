import type {
  HTMLChakraProps,
  RecipeProps,
  RecipeVariantProps,
  UnstyledProp,
} from "@chakra-ui/react";
import { buttonGroupRecipe } from "./button-group.recipe";
import type {
  AriaToggleButtonGroupProps,
  AriaToggleButtonProps,
} from "react-aria";
import type { PropsWithChildren } from "react";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the `div` element.
 */
interface ButtonGroupRecipeProps extends RecipeProps<"button">, UnstyledProp {}
/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
export type ButtonGroupRootSlotProps = HTMLChakraProps<
  "div",
  ButtonGroupRecipeProps
>;

export type ButtonGroupButtonSlotProps = HTMLChakraProps<
  "button",
  ButtonGroupRecipeProps
>;

export type ButtonGroupRootProps = ButtonGroupRootSlotProps &
  AriaToggleButtonGroupProps;

export type ButtonGroupButtonProps = ButtonGroupButtonSlotProps &
  AriaToggleButtonProps;

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
type ButtonGroupVariantProps = ButtonGroupRootProps &
  RecipeVariantProps<typeof buttonGroupRecipe>;

/**
 * Main props type for the ButtonGroup component.
 * Extends ButtonGroupVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export type ButtonGroupProps = PropsWithChildren<ButtonGroupVariantProps>;
