import { useEffect, useRef } from "react";
import { mergeRefs } from "@chakra-ui/react";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { useObjectRef, useTextField } from "react-aria";
import { Input } from "react-aria-components";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { textInputSlotRecipe } from "./text-input.recipe";
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
export const TextInput = (props: TextInputProps) => {
  const {
    leadingElement,
    trailingElement,
    ref: forwardedRef,
    ...restProps
  } = props;

  const recipe = useSlotRecipe({ recipe: textInputSlotRecipe });
  const [recipeProps, remainingProps] = recipe.splitVariantProps(restProps);

  const rootRef = useRef<HTMLDivElement>(null);
  const localRef = useRef<HTMLInputElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  const [styleProps, otherProps] = extractStyleProps(remainingProps);
  const { inputProps } = useTextField(otherProps, ref);

  const stateProps = {
    "data-disabled": inputProps.disabled ? "true" : undefined,
    "data-invalid": inputProps["aria-invalid"] ? "true" : "false",
  };

  // Using a useEffect instead of "onClick" on the element, to preserve
  // the `onClick` prop for consumers.
  useEffect(() => {
    const handleRootClick = (event: MouseEvent) => {
      // Only focus if the click is inside the root element,
      // not on the input itself, and not on an interactive element
      if (
        rootRef.current &&
        rootRef.current.contains(event.target as Node) &&
        localRef.current &&
        event.target !== localRef.current
      ) {
        localRef.current.focus();
      }
    };
    document.addEventListener("click", handleRootClick);
    return () => {
      document.removeEventListener("click", handleRootClick);
    };
  }, []);

  return (
    <TextInputRootSlot
      ref={rootRef}
      className={props?.className as string}
      {...recipeProps}
      {...styleProps}
      {...stateProps}
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
};

TextInput.displayName = "TextInput";
