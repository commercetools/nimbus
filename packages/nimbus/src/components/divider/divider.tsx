import { Separator as RaSeparator } from "react-aria-components";
import { useRecipe } from "@chakra-ui/react";
import { DividerRoot } from "./divider.slots";
import type { DividerProps } from "./divider.types";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { dividerRecipe } from "./divider.recipe";

/**
 * Divider
 * ============================================================
 * A visual separator that divides content sections
 *
 * Features:
 *
 * - allows forwarding refs to the underlying DOM element
 * - accepts all native html 'HTMLDivElement' attributes (including aria- & data-attributes)
 * - supports 'variants', 'orientation', etc. configured in the recipe
 * - allows overriding styles by using style-props
 * - supports 'asChild' and 'as' to modify the underlying html-element (polymorphic)
 * - built with React Aria for accessibility
 */

export const Divider = ({
  ref: forwardedRef,
  orientation = "horizontal",
  ...props
}: DividerProps) => {
  const recipe = useRecipe({ recipe: dividerRecipe });
  const [recipeProps, variantFreeProps] = recipe.splitVariantProps({
    orientation,
    ...props,
  });
  const [styleProps, functionalProps] = extractStyleProps({
    orientation,
    ...variantFreeProps,
  });

  return (
    <DividerRoot asChild {...recipeProps} {...styleProps}>
      <RaSeparator ref={forwardedRef} {...functionalProps} />
    </DividerRoot>
  );
};

Divider.displayName = "Divider";
