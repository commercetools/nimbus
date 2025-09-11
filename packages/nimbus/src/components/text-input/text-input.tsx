import { useRef } from "react";
import { mergeRefs } from "@chakra-ui/react";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { useObjectRef, useTextField } from "react-aria";
import { Input } from "react-aria-components";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { textInputSlotRecipe } from "./text-input.recipe";
import {
  TextInputRootSlot,
  TextInputLeadingElementSlot,
  TextInputInputSlot,
  TextInputTrailingElementSlot,
} from "./text-input.slots";
import type { TextInputProps } from "./text-input.types";

/**
 * # TextInput
 *
 * An input component that takes in a text as input
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/inputs/textinput}
 */
export const TextInput = (props: TextInputProps) => {
  const {
    leadingElement,
    trailingElement,
    ref: forwardedRef,
    ...restProps
  } = props;

  const recipe = useSlotRecipe({ recipe: textInputSlotRecipe });
  const [recipeProps, remainingProps] = recipe.splitVariantProps(restProps);

  const localRef = useRef<HTMLInputElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  const [styleProps, otherProps] = extractStyleProps(remainingProps);
  const { inputProps } = useTextField(otherProps, ref);

  // Focus the input when clicking on the wrapper
  const handleWrapperClick = () => {
    // TODO: reliably ignore interactive elements
    localRef.current?.focus();
  };

  const stateProps = {
    "data-disabled": inputProps.disabled ? "true" : undefined,
    "data-invalid": inputProps["aria-invalid"] ? "true" : "false",
  };

  return (
    <TextInputRootSlot
      {...recipeProps}
      {...styleProps}
      {...stateProps}
      onClick={handleWrapperClick}
    >
      {leadingElement && (
        <TextInputLeadingElementSlot>
          {leadingElement}
        </TextInputLeadingElementSlot>
      )}
      <TextInputInputSlot asChild>
        <Input ref={ref} {...inputProps} />
      </TextInputInputSlot>
      {trailingElement && (
        <TextInputTrailingElementSlot>
          {trailingElement}
        </TextInputTrailingElementSlot>
      )}
    </TextInputRootSlot>
  );
};

TextInput.displayName = "TextInput";
