import { forwardRef } from "react";
import { useObjectRef } from "react-aria";
import { css } from "@emotion/css";
import { Tooltip as RATooltip } from "react-aria-components";
import { chakra, useRecipe } from "@chakra-ui/react";
import { tooltipRecipe } from "./tooltip.recipe";
import type { TooltipProps } from "./tooltip.types";

/**
 * Tooltip
 * ============================================================
 * A contextual popup that displays a description for an element.  See https://www.w3.org/TR/wai-aria-1.2/#tooltip
 *
 * Features:
 *
 * - allows forwarding refs to the underlying DOM element
 * - accepts all native html 'HTMLSpanElement' attributes (including aria- & data-attributes)
 * - supports 'variants', 'sizes', etc. configured in the recipe
 * - allows overriding styles by using style-props
 * - supports 'asChild' and 'as' to modify the underlying html-element (polymorphic)
 */

export const Tooltip = ({ children, ...props }: TooltipProps) => {
  const recipe = useRecipe({ recipe: tooltipRecipe });
  const [recipeProps, restProps] = recipe.splitVariantProps(props);
  const styles = recipe(recipeProps);

  console.debug(styles["@layer recipes"]);
  return (
    <RATooltip className={css(styles["@layer recipes"])} {...restProps}>
      {children}
    </RATooltip>
  );
};
Tooltip.displayName = "Tooltip";
