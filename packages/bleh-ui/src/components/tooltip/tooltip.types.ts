import type { PropsWithChildren } from "react";
import type { TooltipProps as RATooltipProps } from "react-aria-components";
import type { TooltipRootProps } from "./tooltip.slots";
import type { RecipeVariantProps } from "@chakra-ui/react";
import { tooltipRecipe } from "./tooltip.recipe";

/**
 * Combines the root props with Chakra UI's recipe variant props, and
 * react-aria-component's TooltipProps
 * This allows the component to accept:
 * - structural props from Root
 * - styling variants from the recipe
 * - a11y/state related props from react-aria-components Tooltip
 */
type TooltipVariantProps = TooltipRootProps &
  RecipeVariantProps<typeof tooltipRecipe> &
  Omit<RATooltipProps, "children">;

/**
 * Main props interface for the Tooltip component.
 * Extends TooltipVariantProps to include root props, variant props,
 * and react-aria props, while adding support for React children.
 */
export interface TooltipProps extends PropsWithChildren<TooltipVariantProps> {}
