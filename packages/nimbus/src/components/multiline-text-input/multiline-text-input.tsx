import { useRef } from "react";
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
 */
export const MultilineTextInput = (props: MultilineTextInputProps) => {
  const { ref: forwardedRef, rows = 1, ...restProps } = props; // The default `rows` attribute for a textarea is 2, so we need to override it
  const recipe = useRecipe({ recipe: multilineTextInputRecipe });

  const localRef = useRef<HTMLTextAreaElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  const [recipeProps, remainingProps] = recipe.splitVariantProps(restProps);
  const [styleProps, otherProps] = extractStyleProps(remainingProps);
  const { inputProps } = useTextField<"textarea">(otherProps, ref);

  return (
    <MultilineTextInputRootSlot {...recipeProps} {...styleProps} asChild>
      <TextArea ref={ref} rows={rows} {...otherProps} {...inputProps} />
    </MultilineTextInputRootSlot>
  );
};

MultilineTextInput.displayName = "MultilineTextInput";
