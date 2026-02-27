import type { PropsWithChildren } from "react";
import type { TooltipProps as RaTooltipProps } from "react-aria-components";
import type {
  HTMLChakraProps,
  RecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";
import type { OmitInternalProps } from "../../type-utils/omit-props";

// ============================================================
// RECIPE PROPS
// ============================================================

type TooltipRecipeProps = RecipeProps<"nimbusTooltip"> & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type TooltipRootSlotProps = HTMLChakraProps<"div", TooltipRecipeProps>;

// ============================================================
// HELPER TYPES
// ============================================================

type TooltipVariantProps = OmitInternalProps<
  TooltipRootSlotProps & RaTooltipProps
>;

// ============================================================
// MAIN PROPS
// ============================================================

export type TooltipProps = PropsWithChildren<TooltipVariantProps>;
