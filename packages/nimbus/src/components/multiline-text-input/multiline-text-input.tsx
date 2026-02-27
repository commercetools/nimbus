import { useRef } from "react";
import { mergeRefs } from "@/utils";
import { useRecipe } from "@chakra-ui/react/styled-system";
import { useObjectRef, useTextField } from "react-aria";
import { TextArea } from "react-aria-components";
import { extractStyleProps } from "@/utils";

import {
  MultilineTextInputRootSlot,
  MultilineTextInputLeadingElementSlot,
  MultilineTextInputTextAreaSlot,
} from "./multiline-text-input.slots";
import type { MultilineTextInputProps } from "./multiline-text-input.types";
import { multilineTextInputRecipe } from "./multiline-text-input.recipe";
import { useAutogrow } from "./hooks";

/**
 * # Multiline Text Input
 *
 * A multiline text input component for capturing longer text content.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/forms/multiline-text-input}
 */
export const MultilineTextInput = (props: MultilineTextInputProps) => {
  const {
    ref: forwardedRef,
    leadingElement,
    rows = 1,
    autoGrow = false,
    ...restProps
  } = props; // The default `rows` attribute for a textarea is 2, so we need to override it
  const recipe = useRecipe({ recipe: multilineTextInputRecipe });

  const localRef = useRef<HTMLTextAreaElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  const [recipeProps, remainingProps] = recipe.splitVariantProps(restProps);
  const [styleProps, functionalProps] = extractStyleProps(remainingProps);
  const { inputProps } = useTextField<"textarea">(functionalProps, ref);

  // Use autogrow hook for auto-grow functionality
  useAutogrow(ref, { enabled: autoGrow });

  const additionalRootProps = {
    "data-disabled": restProps.isDisabled ? "true" : undefined,
    "data-invalid": restProps.isInvalid ? "true" : "false",
  };

  return (
    <MultilineTextInputRootSlot
      className={props?.className as string}
      {...recipeProps}
      {...styleProps}
      {...additionalRootProps}
    >
      <>
        {leadingElement && (
          <MultilineTextInputLeadingElementSlot>
            {leadingElement}
          </MultilineTextInputLeadingElementSlot>
        )}
        <MultilineTextInputTextAreaSlot asChild>
          <TextArea ref={ref} rows={rows} {...inputProps} />
        </MultilineTextInputTextAreaSlot>
      </>
    </MultilineTextInputRootSlot>
  );
};

MultilineTextInput.displayName = "MultilineTextInput";
