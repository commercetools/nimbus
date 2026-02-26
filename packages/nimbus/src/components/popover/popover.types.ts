import type { PopoverProps as RaPopoverProps } from "react-aria-components";
import { Popover as RaPopover } from "react-aria-components";
import type {
  HTMLChakraProps,
  RecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";
import type { FC } from "react";

// ============================================================
// RECIPE PROPS
// ============================================================

type PopoverRecipeProps = RecipeProps<"nimbusPopover"> & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type PopoverRootSlotProps = HTMLChakraProps<"div", PopoverRecipeProps>;

// ============================================================
// MAIN PROPS
// ============================================================

export type PopoverProps = RaPopoverProps &
  Omit<PopoverRootSlotProps, keyof RaPopoverProps> & {
    /**
     * Reference to the popover element
     */
    ref?: React.Ref<typeof RaPopover>;
  };

/**
 * Type signature for the Popover component.
 */
export type PopoverComponent = FC<PopoverProps>;
