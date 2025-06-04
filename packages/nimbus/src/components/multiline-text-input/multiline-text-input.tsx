import { useRef, useEffect, useCallback } from "react";
import { mergeRefs, useRecipe } from "@chakra-ui/react";
import { useObjectRef, useTextField } from "react-aria";
import { TextArea } from "react-aria-components";
import { extractStyleProps } from "@/utils/extractStyleProps";

import { MultilineTextInputRootSlot } from "./multiline-text-input.slots";
import type { MultilineTextInputProps } from "./multiline-text-input.types";
import { multilineTextInputRecipe } from "./multiline-text-input.recipe";

/**
 * MultilineTextInput
 * ============================================================
 * A textarea component that takes in multiline text as input
 *
 * Features:
 *
 * - allows forwarding refs to the underlying DOM element
 * - accepts all native html 'HTMLTextAreaElement' attributes (including aria- & data-attributes)
 * - supports 'variants', 'sizes', etc. configured in the recipe
 * - allows overriding styles by using style-props
 * - supports auto-growing height based on content when `autoGrow` is enabled
 */
export const MultilineTextInput = (props: MultilineTextInputProps) => {
  const {
    ref: forwardedRef,
    rows = 1,
    autoGrow = false,
    maxHeight,
    ...restProps
  } = props; // The default `rows` attribute for a textarea is 2, so we need to override it
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

    // Store the current manually set height (if any) to compare
    const currentHeight = textarea.clientHeight;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto";

    // Calculate the new height based on content
    const contentHeight = textarea.scrollHeight;

    // Auto-grow should ensure content is always visible, even if user manually resized smaller
    const newHeight = Math.max(contentHeight, currentHeight);

    // Apply maxHeight constraint if specified
    const finalHeight = maxHeight ? Math.min(newHeight, maxHeight) : newHeight;

    // Set the new height
    textarea.style.height = `${finalHeight}px`;

    // Content needs to be scrollable
    textarea.style.overflowY = "auto";
  }, [autoGrow, maxHeight, ref]);

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
