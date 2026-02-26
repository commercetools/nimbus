import { Separator as RaSeparator } from "react-aria-components";
import { useRecipe } from "@chakra-ui/react/styled-system";
import { SeparatorRoot } from "./separator.slots";
import type { SeparatorProps } from "./separator.types";
import { extractStyleProps } from "@/utils";
import { separatorRecipe } from "./separator.recipe";

/**
 * Separator
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

export const Separator = ({
  ref: forwardedRef,
  orientation = "horizontal",
  ...props
}: SeparatorProps) => {
  const recipe = useRecipe({ recipe: separatorRecipe });
  const [recipeProps, variantFreeProps] = recipe.splitVariantProps({
    orientation,
    ...props,
  });
  const [styleProps, functionalProps] = extractStyleProps({
    orientation,
    ...variantFreeProps,
  });

  return (
    <SeparatorRoot asChild {...recipeProps} {...styleProps}>
      <RaSeparator ref={forwardedRef} {...functionalProps} />
    </SeparatorRoot>
  );
};

Separator.displayName = "Separator";
