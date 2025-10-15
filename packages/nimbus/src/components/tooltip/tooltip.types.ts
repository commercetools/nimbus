import type { PropsWithChildren } from "react";
import type { TooltipProps as RaTooltipProps } from "react-aria-components";
import type {
  HTMLChakraProps,
  RecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";
import type { ExcludePolymorphicFromProps } from "@/components/utils/type-helpers";

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

type TooltipVariantProps = ExcludePolymorphicFromProps<
  TooltipRootSlotProps & RaTooltipProps
>;

// ============================================================
// MAIN PROPS
// ============================================================

export type TooltipProps = PropsWithChildren<TooltipVariantProps>;
