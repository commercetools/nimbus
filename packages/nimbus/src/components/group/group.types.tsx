import type { FC, Ref } from "react";
import {
  Group as RaGroup,
  type GroupProps as RaGroupProps,
} from "react-aria-components";
import type {
  HTMLChakraProps,
  RecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the div element.
 */
type GroupRecipeProps = RecipeProps<"group"> & UnstyledProp;

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
export type GroupSlotProps = HTMLChakraProps<"div", GroupRecipeProps>;

type DefaultExcludedProps = "css" | "asChild" | "as" | "colorScheme";

export interface GroupProps
  extends Omit<GroupSlotProps, DefaultExcludedProps>,
    // Manually picking all the supported props
    Pick<
      RaGroupProps,
      | "isDisabled"
      | "isInvalid"
      | "onHoverChange"
      | "onHoverStart"
      | "onHoverEnd"
    > {
  ref?: Ref<typeof RaGroup>;
}

/** Type signature for the main `Group` component. */
export type GroupComponent = FC<GroupProps>;
