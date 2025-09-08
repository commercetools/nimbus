import { useRef } from "react";
import { mergeRefs } from "@chakra-ui/react";
import { useRecipe } from "@chakra-ui/react/styled-system";
import { useObjectRef, useTextField } from "react-aria";
import { Input } from "react-aria-components";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { TextInputRootSlot } from "./text-input.slots";
import type { TextInputProps } from "./text-input.types";
import { textInputRecipe } from "./text-input.recipe";

/**
 * # TextInput
 *
 * An input component that takes in a text as input
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/inputs/textinput}
 */
export const TextInput = (props: TextInputProps) => {
  const { ref: forwardedRef, ...restProps } = props;
  const recipe = useRecipe({ recipe: textInputRecipe });

  const localRef = useRef<HTMLInputElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  const [recipeProps, remainingProps] = recipe.splitVariantProps(restProps);
  const [styleProps, otherProps] = extractStyleProps(remainingProps);
  const { inputProps } = useTextField(otherProps, ref);

  return (
    <TextInputRootSlot
      className={props?.className as string}
      {...recipeProps}
      {...styleProps}
      asChild
    >
      <Input ref={ref} {...inputProps} />
    </TextInputRootSlot>
  );
};

TextInput.displayName = "TextInput";
