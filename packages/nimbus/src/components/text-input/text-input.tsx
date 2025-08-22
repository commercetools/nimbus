import { forwardRef, useRef } from "react";
import { mergeRefs, useSlotRecipe } from "@chakra-ui/react";
import { useObjectRef, useTextField } from "react-aria";
import { Input } from "react-aria-components";
import { extractStyleProps } from "@/utils/extractStyleProps";
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
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (props, forwardedRef) => {
    const { leadingElement, trailingElement, ...restProps } = props;

    const recipe = useSlotRecipe({ key: "textInput" });
    const [recipeProps, remainingProps] = recipe.splitVariantProps(restProps);

    const localRef = useRef<HTMLInputElement>(null);
    const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

    const [styleProps, otherProps] = extractStyleProps(remainingProps);
    const { inputProps } = useTextField(otherProps, ref);

    // Focus the input when clicking on the wrapper
    const handleWrapperClick = (e: React.MouseEvent) => {
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
  }
);

TextInput.displayName = "TextInput";
