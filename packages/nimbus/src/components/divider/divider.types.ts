import type {
  RecipeProps,
  UnstyledProp,
  HTMLChakraProps,
  RecipeVariantProps,
} from "@chakra-ui/react/styled-system";
import { dividerRecipe } from "./divider.recipe";
import type { SeparatorProps } from "react-aria";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the div element.
 */
export interface DividerRecipeProps extends RecipeProps<"div">, UnstyledProp {}

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DividerRootProps
  extends HTMLChakraProps<"div", DividerRecipeProps> {}

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
type DividerVariantProps = DividerRootProps &
  RecipeVariantProps<typeof dividerRecipe> & {
    [key: `data-${string}`]: unknown;
  };

/**
 * Main props interface for the Divider component.
 * Extends DividerVariantProps to include both root props and variant props,
 * while adding support for React Aria separator props.
 */
export interface DividerProps
  extends Omit<DividerVariantProps, "orientation">,
    Pick<SeparatorProps, "orientation"> {
  /** The orientation of the divider */
  orientation?: "horizontal" | "vertical";
  /** Reference to the divider element */
  ref?: React.Ref<HTMLDivElement>;
}
