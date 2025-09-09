import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { radioInputSlotRecipe } from "../radio-input.recipe";
import { RadioGroup as RaRadioGroup } from "react-aria-components";
import { extractStyleProps } from "@/utils/extractStyleProps";
import type { RadioInputRootProps } from "../radio-input.types";
import { RadioInputRootSlot } from "../radio-input.slots";

/**
 * # RadioInput
 *
 * A set of closely related, mutually exclusive or complementary actions that are important enough to be displayed directly in the interface for quick access.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/inputs/radio-input}
 */
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
