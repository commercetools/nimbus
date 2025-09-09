import { useState, useCallback, useRef, useEffect } from "react";
import { useSlotRecipe } from "@chakra-ui/react";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { RichTextInputRootSlot } from "./rich-text-input.slots";
import {
  RichTextEditor,
  type RichTextEditorRef,
} from "./components/rich-text-editor";
import { RichTextToolbar } from "./components/rich-text-toolbar";
import type { RichTextInputProps } from "./rich-text-input.types";
import {
  toHTML,
  fromHTML,
  createEmptyValue,
  validSlateStateAdapter,
} from "./utils";
import { richTextInputRecipe } from "./rich-text-input.recipe";

/**
 RichTextInput - A rich text input component with formatting capabilities.
 */
export const RichTextInput = (props: RichTextInputProps) => {
  const {
    ref: forwardedRef,
    value,
    defaultValue,
    onChange,
    onFocus,
    onBlur,
    placeholder = "",
    isDisabled = false,
    isReadOnly = false,
    isInvalid = false,
    autoFocus = false,
    ...restProps
  } = props;

  const recipe = useSlotRecipe({ recipe: richTextInputRecipe });
  const [recipeProps, remainingProps] = recipe.splitVariantProps({
    // Only semantic variants go here (none currently defined)
    ...restProps,
  });
  const [styleProps, functionalProps] = extractStyleProps(remainingProps);

  // Data attributes for state-based styling
  const dataAttributes = {
    "data-disabled": isDisabled ? "true" : undefined,
    "data-invalid": isInvalid ? "true" : undefined,
    "data-readonly": isReadOnly ? "true" : undefined,
  };

  // Internal state management
  const [internalValue, setInternalValue] = useState(() => {
    const initialHtml = value ?? defaultValue ?? "";
    try {
      return initialHtml ? fromHTML(initialHtml) : createEmptyValue();
    } catch (error) {
      console.warn("Failed to parse initial HTML, using empty value:", error);
      return createEmptyValue();
    }
  });

  const [serializedValue, setSerializedValue] = useState(() => {
    return value ?? defaultValue ?? "";
  });

  const editorRef = useRef<RichTextEditorRef>(null);

  // Handle controlled value changes
  useEffect(() => {
    if (value !== undefined && value !== serializedValue) {
      const newSlateValue = value ? fromHTML(value) : createEmptyValue();
      setInternalValue(newSlateValue);
      setSerializedValue(value);
    }
  }, [value, serializedValue]);

  const handleChange = useCallback(
    (slateValue: ReturnType<typeof createEmptyValue>) => {
      const newHtml = toHTML(slateValue);
      const hasSerializedValueChanged = newHtml !== serializedValue;

      setInternalValue(slateValue);
      setSerializedValue(newHtml);

      // Only call onChange if the serialized HTML actually changed
      if (hasSerializedValueChanged && onChange) {
        onChange(newHtml);
      }
    },
    [serializedValue, onChange]
  );

  const currentValue = internalValue;

  // Safety check: ensure we always have a valid Slate value
  const safeValue = validSlateStateAdapter(currentValue);

  return (
    <RichTextInputRootSlot
      {...recipeProps}
      {...styleProps}
      {...functionalProps}
      {...dataAttributes}
      ref={forwardedRef}
    >
      <RichTextEditor
        ref={editorRef}
        value={safeValue}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        autoFocus={autoFocus}
        toolbar={
          !isReadOnly ? <RichTextToolbar isDisabled={isDisabled} /> : null
        }
      />
    </RichTextInputRootSlot>
  );
};

RichTextInput.displayName = "RichTextInput";
