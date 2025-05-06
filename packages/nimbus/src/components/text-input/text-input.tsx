import { forwardRef, useRef, type ChangeEvent } from "react";
import { TextInputRootSlot } from "./text-input.slots";
import type { TextInputProps } from "./text-input.types";
import { useObjectRef } from "react-aria";
import { mergeRefs, useRecipe } from "@chakra-ui/react";
import { textInputRecipe } from "./text-input.recipe";
import { Input } from "react-aria-components";
import { useTextField } from "react-aria";
import { extractStyleProps } from "@/utils/extractStyleProps";

/**
 * TextInput
 * ============================================================
 * An input component that takes in a text as input
 *
 * Features:
 *
 * - allows forwarding refs to the underlying DOM element
 * - accepts all native html 'HTMLInputElement' attributes (including aria- & data-attributes)
 * - supports 'variants', 'sizes', etc. configured in the recipe
 * - allows overriding styles by using style-props
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (props, forwardedRef) => {
    const recipe = useRecipe({ recipe: textInputRecipe });
    const localRef = useRef<HTMLInputElement>(null);
    const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

    const [recipeProps, remainingProps] = recipe.splitVariantProps(props);
    const [styleProps, otherProps] = extractStyleProps(remainingProps);

    const { inputProps } = useTextField(otherProps, ref);

    const handleNativeOnChange = (event: ChangeEvent<HTMLInputElement>) => {
      // You can access event.target, event.key, event.preventDefault(), etc.
      // props.onChange might still be called with just the value by inputProps.onChange
      if (props.onNativeChange) {
        props.onNativeChange(event);
      }
    };

    // A practical way to use chain for the event:
    const originalAriaOnChange = inputProps.onChange;

    const chainedOnChange = (event: ChangeEvent<HTMLInputElement>) => {
      // Call your custom handler with the native event
      handleNativeOnChange(event);

      // Ensure React Aria's original onChange logic (which calls your props.onChange with value) still runs
      if (originalAriaOnChange) {
        originalAriaOnChange(event); // React Aria's handler expects the event and extracts the value
      }
    };

    const finalInputProps = {
      ...inputProps,
      onChange: chainedOnChange,
    };

    console.log("finalInputProps", finalInputProps);

    return (
      <TextInputRootSlot {...recipeProps} {...styleProps} asChild>
        <Input ref={ref} {...otherProps} {...finalInputProps} />
      </TextInputRootSlot>
    );
  }
);
TextInput.displayName = "TextInput";
