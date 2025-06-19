import { useSlotRecipe } from "@chakra-ui/react";
import { radioInputSlotRecipe } from "../radio-input.recipe";
import { RadioGroup as RaRadioGroup } from "react-aria-components";
import { extractStyleProps } from "@/utils/extractStyleProps";
import type { RadioInputRootProps } from "../radio-input.types";
import { RadioInputRootSlot } from "../radio-input.slots";

export const RadioInputRoot = (props: RadioInputRootProps) => {
  const recipe = useSlotRecipe({ recipe: radioInputSlotRecipe });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(props);
  const [styleProps, restProps] = extractStyleProps(restRecipeProps);

  return (
    <RadioInputRootSlot {...recipeProps} {...styleProps} asChild>
      <RaRadioGroup {...restProps}>{props.children}</RaRadioGroup>
    </RadioInputRootSlot>
  );
};

RadioInputRoot.displayName = "RadioInputRoot";
