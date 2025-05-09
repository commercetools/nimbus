import { forwardRef, useRef, type ChangeEvent } from "react";
import { mergeRefs, useRecipe } from "@chakra-ui/react";
import { useObjectRef, useTextField } from "react-aria";
import { Input } from "react-aria-components";
import { extractStyleProps } from "@/utils/extractStyleProps";

import { TextInputRootSlot } from "./text-input.slots";
import type { TextInputProps } from "./text-input.types";
import { textInputRecipe } from "./text-input.recipe";

/**
 * TextInput
 * ============================================================
 * An input component that takes in text as input
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

    return (
      <TextInputRootSlot
        {...recipeProps}
        {...styleProps}
        {...otherProps}
        asChild
      >
        <Input ref={ref} {...inputProps} />
      </TextInputRootSlot>
    );
  }
);

TextInput.displayName = "TextInput";
