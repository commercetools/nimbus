import { forwardRef, useRef } from "react";
import { Box, mergeRefs, useRecipe } from "@chakra-ui/react";
import { useObjectRef, useTextField } from "react-aria";
import { Input } from "react-aria-components";
import { extractStyleProps } from "@/utils/extractStyleProps";

import { TextInputRootSlot } from "./text-input.slots";
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
    const { 
      leadingElement, 
      trailingElement,
      ...restProps 
    } = props;
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
      <Box position="relative" width={styleProps.width || "100%"} onClick={handleWrapperClick}>
        {leadingElement && (
          <Box 
            position="absolute"
            top="50%"
            transform="translateY(-50%)"
            left={400}
            zIndex={1}
            className="nimbus-text-input-leading-element"
            data-slot="leading-element"
            _rtl={{
              left: "auto",
              right: "400"
            }}
          >
            {leadingElement}
          </Box>
        )}
        
        <TextInputRootSlot 
          {...recipeProps} 
          {...styleProps} 
          className={`${styleProps.className || ""} ${leadingElement ? 'has-leading-element' : ''} ${trailingElement ? 'has-trailing-element' : ''}`}
          asChild
        >
          <Input ref={ref} {...inputProps} />
        </TextInputRootSlot>
        
        {trailingElement && (
          <Box 
            position="absolute"
            top="50%"
            right={400}
            transform="translateY(-50%)"
            zIndex={1}
            className="nimbus-text-input-trailing-element"
            data-slot="trailing-element"
            _rtl={{
              right: "auto",
              left: "400"
            }}
          >
            {trailingElement}
          </Box>
        )}
      </Box>
    );
  }
);

TextInput.displayName = "TextInput";
