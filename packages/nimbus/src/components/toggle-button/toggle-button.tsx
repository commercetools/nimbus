import { useRecipe } from "@chakra-ui/react";
import { ToggleButton as RaToggleButton } from "react-aria-components";
import { extractStyleProps } from "@/utils/extractStyleProps";

import { ToggleButtonRoot } from "./toggle-button.slots";
import type { ToggleButtonProps } from "./toggle-button.types";
import { toggleButtonRecipe } from "./toggle-button.recipe";

/**
 * ToggleButton
 * ============================================================
 * A button that can be toggled between selected and not selected states
 *
 * Features:
 *
 * - allows forwarding refs to the underlying DOM element
 * - accepts all react-aria ToggleButton props
 * - supports controlled and uncontrolled modes
 * - integrates with ToggleButtonContext for use in groups
 * - supports 'variants', 'sizes', 'tones' configured in the recipe
 * - allows overriding styles by using style-props
 */
export const ToggleButton = (props: ToggleButtonProps) => {
  const recipe = useRecipe({ recipe: toggleButtonRecipe });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(props);
  const [styleProps, functionalProps] = extractStyleProps(restRecipeProps);

  return (
    <ToggleButtonRoot {...recipeProps} {...styleProps} asChild>
      <RaToggleButton {...functionalProps}>{props.children}</RaToggleButton>
    </ToggleButtonRoot>
  );
};

ToggleButton.displayName = "ToggleButton";
