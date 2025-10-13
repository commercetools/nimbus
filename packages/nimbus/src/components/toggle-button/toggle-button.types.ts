import type { HTMLChakraProps, RecipeProps } from "@chakra-ui/react";
import type { ToggleButtonProps as AriaToggleButtonProps } from "react-aria-components";

/**
 * Base recipe props interface.
 */
export type ToggleButtonRecipeProps = {
  size?: RecipeProps<"toggleButton">["size"];
  variant?: RecipeProps<"toggleButton">["variant"];
  tone?: RecipeProps<"toggleButton">["tone"];
};

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
export type ToggleButtonRootProps = HTMLChakraProps<
  "button",
  ToggleButtonRecipeProps
>;

/**
 * Additional properties we want to exclude from the ToggleButton component.
 * These are chakra-ui props we don't want exposed for non-polymorphic components.
 */
type ExcludedProps =
  // chakra-ui props we don't want exposed
  "css" | "colorScheme" | "recipe" | "as" | "asChild";

export type ToggleButtonProps = Omit<
  ToggleButtonRootProps,
  keyof AriaToggleButtonProps | ExcludedProps
> &
  AriaToggleButtonProps & {
    /**
     * Ref to the underlying button element
     */
    ref?: React.Ref<HTMLButtonElement>;
  };
