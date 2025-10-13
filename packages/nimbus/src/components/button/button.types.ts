import type { AriaButtonProps } from "react-aria";
import type {
  HTMLChakraProps,
  RecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the button element.
 */
type ButtonRecipeProps = {
  size?: RecipeProps<"button">["size"];
  variant?: RecipeProps<"button">["variant"];
  tone?: RecipeProps<"button">["tone"];
} & UnstyledProp;

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
export type ButtonRootProps = Omit<
  HTMLChakraProps<"button", ButtonRecipeProps>,
  "slot"
> & {
  // insure that the `ButtonRoot` component doesn't give a type error
  slot?: string | null | undefined;
};

/** combine chakra-button props with aria-button props */
type FunctionalButtonProps = AriaButtonProps &
  Omit<ButtonRootProps, keyof AriaButtonProps | "slot"> & {
    [key: `data-${string}`]: unknown;
  };

export type ButtonProps = ButtonRootProps &
  FunctionalButtonProps & {
    // we need 'null' as a valid slot value for use with components from react-aria-components,
    // in react-aria slots "An explicit null value indicates that the local props completely override all props received from a parent."
    slot?: string | null | undefined;
    ref?: React.Ref<HTMLButtonElement>;
  };
