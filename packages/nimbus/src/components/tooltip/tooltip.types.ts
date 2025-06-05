import type { PropsWithChildren } from "react";
import type { TooltipProps as RATooltipProps } from "react-aria-components";
import type { TooltipRootProps } from "./tooltip.slots";
import type { RecipeVariantProps } from "@chakra-ui/react";
import { tooltipRecipe } from "./tooltip.recipe";

/**
 * For use in components that use the polymorphic `as` and `asChild` props
 * internally, but do not make them available to the consumer.
 *
 * Long rambling background:
 * React-Aria's components cannot be configured to use `as` and `asChild` internally,
 * and cannot be directly styled by chakra's styledSystem. Therefore components
 * from `react-aria-components` should be wrapped in a chakra `withContext`
 * root component to set the styles onto the `r-a-c` component using `asChild`.
 * This means that we need to allow polymorphism internally, but should not
 * allow it in the external props api since it would not work.
 */
type ExcludePolymorphicFromProps<T> = Omit<T, "as" | "asChild">;

/**
 * Combines the root props with Chakra UI's recipe variant props, and
 * react-aria-component's TooltipProps
 * This allows the component to accept:
 * - structural props from Root
 * - styling variants from the recipe
 * - a11y/state related props from react-aria-components Tooltip
 */
type TooltipVariantProps = ExcludePolymorphicFromProps<
  TooltipRootProps & RecipeVariantProps<typeof tooltipRecipe> & RATooltipProps
>;

/**
 * Main props interface for the Tooltip components
 * Extends TooltipVariantProps to include root props, variant props,
 * and react-aria props, while adding support for React children.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface TooltipProps extends PropsWithChildren<TooltipVariantProps> {}
