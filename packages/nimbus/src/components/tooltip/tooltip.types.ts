import type { PropsWithChildren } from "react";
import type { TooltipProps as RaTooltipProps } from "react-aria-components";
import type {
  HTMLChakraProps,
  RecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";
import type { OmitUnwantedProps } from "../../type-utils/omit-props";

// ============================================================
// RECIPE PROPS
// ============================================================

type TooltipRecipeProps = RecipeProps<"tooltip"> & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type TooltipRootSlotProps = HTMLChakraProps<"div", TooltipRecipeProps>;

// ============================================================
// HELPER TYPES
// ============================================================

type TooltipVariantProps = OmitUnwantedProps<
  TooltipRootSlotProps & RaTooltipProps
>;

// ============================================================
// MAIN PROPS
// ============================================================

export type TooltipProps = PropsWithChildren<TooltipVariantProps>;
