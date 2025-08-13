import { useRef, useEffect, useCallback } from "react";
import { mergeRefs } from "@chakra-ui/react";
import { useRecipe } from "@chakra-ui/react/styled-system";
import { useObjectRef, useTextField } from "react-aria";
import { TextArea } from "react-aria-components";
import { extractStyleProps } from "@/utils/extractStyleProps";

import { MultilineTextInputRootSlot } from "./multiline-text-input.slots";
import type { MultilineTextInputProps } from "./multiline-text-input.types";
import { multilineTextInputRecipe } from "./multiline-text-input.recipe";

/**
 * # Multiline Text Input
 *
 * A multiline text input component for capturing longer text content.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/forms/multiline-text-input}
 */
export const MultilineTextInput = (props: MultilineTextInputProps) => {
  const { ref: forwardedRef, rows = 1, autoGrow = false, ...restProps } = props; // The default `rows` attribute for a textarea is 2, so we need to override it
  const recipe = useRecipe({ recipe: multilineTextInputRecipe });

  const localRef = useRef<HTMLTextAreaElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  const [recipeProps, remainingProps] = recipe.splitVariantProps(restProps);
  const [styleProps, otherProps] = extractStyleProps(remainingProps);
  const { inputProps } = useTextField<"textarea">(otherProps, ref);

  // Auto-grow functionality
  const adjustHeight = useCallback(() => {
    const textarea = ref.current;
    if (!textarea || !autoGrow) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto";

    // Calculate the new height based on content
    const contentHeight = textarea.scrollHeight;

    // Always resize to fit content (both growing and shrinking)
    // This ensures the textarea always fits the content exactly
    const newHeight = contentHeight;

    // Apply maxHeight constraint if specified
    const computedStyle = window.getComputedStyle(textarea);
    const maxHeightPxValue = parseInt(computedStyle.maxHeight);
    const finalHeight = maxHeightPxValue
      ? Math.min(newHeight, maxHeightPxValue)
      : newHeight;

    // Set the new height
    textarea.style.height = `${finalHeight}px`;
  }, [autoGrow, ref]);

  // Set up auto-grow behavior with event listeners
  useEffect(() => {
    const textarea = ref.current;
    if (!textarea || !autoGrow) return;

    // Initial adjustment
    adjustHeight();

    // Add input event listener for real-time adjustments
    const handleInput = () => {
      adjustHeight();
    };

    textarea.addEventListener("input", handleInput);

    // Cleanup
    return () => {
      textarea.removeEventListener("input", handleInput);
    };
  }, [adjustHeight, autoGrow, ref]);

  return (
    <MultilineTextInputRootSlot {...recipeProps} {...styleProps} asChild>
      <TextArea ref={ref} rows={rows} {...inputProps} />
    </MultilineTextInputRootSlot>
  );
};

MultilineTextInput.displayName = "MultilineTextInput";
