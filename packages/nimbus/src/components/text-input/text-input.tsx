import { forwardRef, useRef } from "react";
import { mergeRefs, useRecipe } from "@chakra-ui/react";
import { useObjectRef, useTextField } from "react-aria";
import { Input } from "react-aria-components";
import { extractStyleProps } from "@/utils/extractStyleProps";
import {
  TextInputRootSlot,
  TextInputLeadingElementSlot,
  TextInputTrailingElementSlot,
} from "./text-input.slots";
import type { TextInputProps } from "./text-input.types";
import { textInputRecipe } from "./text-input.recipe";

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
    const recipe = useRecipe({ recipe: textInputRecipe });

    const localRef = useRef<HTMLInputElement>(null);
    const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

    const [recipeProps, remainingProps] = recipe.splitVariantProps(restProps);
    const [styleProps, otherProps] = extractStyleProps(remainingProps);
    const { inputProps } = useTextField(otherProps, ref);

    // Focus the input when clicking on the wrapper
    const handleWrapperClick = (e: React.MouseEvent) => {
      // Don't trigger if clicked on a child with onClick handler
      if ((e.target as HTMLElement).onclick) {
        return;
      }

      // Only focus if we clicked the wrapper directly, not an interactive element inside
      if (e.currentTarget === e.target) {
        localRef.current?.focus();
      }
    };

    return (
      <TextInputRootSlot
        {...recipeProps}
        {...styleProps}
        className={`${styleProps.className || ""}`}
        onClick={handleWrapperClick}
        // data-has-leading={leadingElement ? "true" : "false"}
        // data-has-trailing={trailingElement ? "true" : "false"}
      >
        <div className="nimbus-text-input-container">
          {leadingElement && (
            <TextInputLeadingElementSlot className="leading-element">
              {leadingElement}
            </TextInputLeadingElementSlot>
          )}
          <Input ref={ref} {...inputProps} data-part="input" />
          {trailingElement && (
            <TextInputTrailingElementSlot className="trailing-element">
              {trailingElement}
            </TextInputTrailingElementSlot>
          )}
        </div>
      </TextInputRootSlot>
    );
  }
);

TextInput.displayName = "TextInput";
