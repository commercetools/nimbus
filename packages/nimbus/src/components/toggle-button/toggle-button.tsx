import { useRecipe } from "@chakra-ui/react/styled-system";
import { ToggleButton as RaToggleButton } from "react-aria-components";
import { extractStyleProps } from "@/utils";

import { ToggleButtonRoot } from "./toggle-button.slots";
import { useToggleButtonContext } from "./toggle-button.context";
import type { ToggleButtonProps } from "./toggle-button.types";

/**
 * # ToggleButton
 *
 * A toggleable button component that can be pressed to switch between
 * selected and unselected states.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/inputs/togglebutton}
 * @supportsStyleProps
 */
export const ToggleButton = ({
  ref: forwardedRef,
  ...props
}: ToggleButtonProps) => {
  const context = useToggleButtonContext();
  const recipe = useRecipe({ key: "nimbusToggleButton" });

  const { variant, activeFillStyle, size, colorPalette, ...rest } = props;
  const propsWithContextDefaults = {
    ...rest,
    variant: variant ?? context?.variant,
    activeFillStyle: activeFillStyle ?? context?.activeFillStyle,
    size: size ?? context?.size,
    colorPalette: colorPalette ?? context?.colorPalette,
  };

  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(
    propsWithContextDefaults
  );
  const [styleProps, functionalProps] = extractStyleProps(restRecipeProps);

  return (
    <ToggleButtonRoot {...recipeProps} {...styleProps} asChild>
      <RaToggleButton ref={forwardedRef} {...functionalProps} />
    </ToggleButtonRoot>
  );
};

ToggleButton.displayName = "ToggleButton";
