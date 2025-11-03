import type { PopoverProps as RaPopoverProps } from "react-aria-components";
import type {
  HTMLChakraProps,
  RecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";

// ============================================================
// RECIPE PROPS
// ============================================================

type PopoverRecipeProps = RecipeProps<"popover"> & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type PopoverRootSlotProps = HTMLChakraProps<"div", PopoverRecipeProps>;

// ============================================================
// MAIN PROPS
// ============================================================

export type PopoverProps = RaPopoverProps &
  Omit<PopoverRootSlotProps, keyof RaPopoverProps>;
