import type { FC, Ref } from "react";
import type {
  HTMLChakraProps,
  RecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";
import { type ToolbarProps as RaToolbarProps } from "react-aria-components";

/**
 * Base recipe props type that combines Chakra UI's recipe props
 * with the unstyled prop option for the toolbar recipe.
 */
type ToolbarRecipeProps = {
  size?: RecipeProps<"toolbar">["size"];
  orientation?: RecipeProps<"toolbar">["orientation"];
  variant?: RecipeProps<"toolbar">["variant"];
} & UnstyledProp;

/**
 * Root props type that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
export type ToolbarSlotProps = Omit<
  HTMLChakraProps<"div", ToolbarRecipeProps>,
  "translate"
> & {
  translate?: "yes" | "no";
};

type DefaultExcludedProps = "css" | "asChild" | "as";

// Root toolbar component
export type ToolbarProps = Omit<
  ToolbarSlotProps,
  DefaultExcludedProps | "children" | "slot"
> &
  // Some RA props are incompatible / not supported
  // orientation: can change based on breakpoint
  // className & style: RA accepts a fn (a pattern we don't want to support, yet)
  Omit<RaToolbarProps, "orientation" | "className" | "style"> & {
    ref?: Ref<HTMLDivElement>;
  };

export type ToolbarComponent = FC<ToolbarProps>;
