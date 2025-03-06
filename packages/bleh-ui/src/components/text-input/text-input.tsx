import { forwardRef, useRef } from "react";
import { TextInputRoot } from "./text-input.slots";
import type { TextInputProps } from "./text-input.types";
import { useObjectRef } from "react-aria";
import { mergeRefs, useRecipe } from "@chakra-ui/react";
import { textInputRecipe } from "./text-input.recipe";
import { TextField, Input } from "react-aria-components";
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
    const localRef = useRef<HTMLInputElement>(null);
    const ref = useObjectRef(mergeRefs(localRef, forwardedRef));
    const recipe = useRecipe({ recipe: textInputRecipe });
    const [recipeProps, leftOverProps] = recipe.splitVariantProps(props);
    const [styleProps, textfieldProps] = extractStyleProps(leftOverProps);

    return (
      <TextField {...textfieldProps}>
        <TextInputRoot ref={ref} {...recipeProps} {...styleProps} asChild>
          <Input />
        </TextInputRoot>
      </TextField>
    );
  }
);
TextInput.displayName = "TextInput";
