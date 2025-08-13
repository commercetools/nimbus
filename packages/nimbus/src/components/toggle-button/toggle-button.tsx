import { useRecipe } from "@chakra-ui/react/styled-system";
import { ToggleButton as RaToggleButton } from "react-aria-components";
import { extractStyleProps } from "@/utils/extractStyleProps";

import { ToggleButtonRoot } from "./toggle-button.slots";
import type { ToggleButtonProps } from "./toggle-button.types";

/**
 * # ToggleButton
 *
 * A toggleable button component that can be pressed to switch between
 * selected and unselected states.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/inputs/togglebutton}
 */
export const ToggleButton = ({
  ref: forwardedRef,
  ...props
}: ToggleButtonProps) => {
  const recipe = useRecipe({ key: "toggleButton" });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(props);
  const [styleProps, functionalProps] = extractStyleProps(restRecipeProps);

  return (
    <ToggleButtonRoot {...recipeProps} {...styleProps} asChild>
      <RaToggleButton ref={forwardedRef} {...functionalProps} />
    </ToggleButtonRoot>
  );
};

ToggleButton.displayName = "ToggleButton";
