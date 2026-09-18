import type { FC, Ref } from "react";
import {
  Group as RaGroup,
  type GroupProps as RaGroupProps,
} from "react-aria-components";
import type {
  HTMLChakraProps,
  RecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";

// ============================================================
// RECIPE PROPS
// ============================================================

type GroupRecipeProps = RecipeProps<"nimbusGroup"> & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type GroupRootSlotProps = HTMLChakraProps<"div", GroupRecipeProps>;

// ============================================================
// HELPER TYPES
// ============================================================

type DefaultExcludedProps = "css" | "asChild" | "as" | "colorScheme";

// ============================================================
// MAIN PROPS
// ============================================================

export interface GroupProps
  extends
    Omit<GroupRootSlotProps, DefaultExcludedProps>,
    Pick<
      RaGroupProps,
      | "isDisabled"
      | "isInvalid"
      | "onHoverChange"
      | "onHoverStart"
      | "onHoverEnd"
    > {
  /**
   * Ref forwarding to the root element
   */
  ref?: Ref<typeof RaGroup>;
}

/**
 * Type signature for the main Group component.
 */
export type GroupComponent = FC<GroupProps>;
