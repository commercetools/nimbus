import { useState, useCallback, useRef, useEffect } from "react";
import { useSlotRecipe } from "@chakra-ui/react";
import { extractStyleProps } from "@/utils/extractStyleProps";
import {
  RichTextInputRootSlot,
  RichTextInputEditorSlot,
} from "./rich-text-input.slots";
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
} from "./components/rich-text-utils";
import { richTextInputRecipe } from "./rich-text-input.recipe";

/**
 # RichTextInput

 A rich text input component with formatting capabilities.

 @see {@link https://nimbus-documentation.vercel.app/components/inputs/rich-text-input}
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
    hasError = false,
    hasWarning = false,
    autoFocus = false,
    ...restProps
  } = props;

  const recipe = useSlotRecipe({ recipe: richTextInputRecipe });
  const [recipeProps, remainingProps] = recipe.splitVariantProps({
    state: hasError ? "error" : hasWarning ? "warning" : undefined,
    disabled: isDisabled,
    readOnly: isReadOnly,
    ...restProps,
  });
  const [styleProps, functionalProps] = extractStyleProps(remainingProps);

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
      const hasInternalSlateValueChanged = internalValue !== slateValue;
      const hasSerializedValueChanged = newHtml !== serializedValue;

      setInternalValue(slateValue);
      setSerializedValue(newHtml);

      // Only call onChange if the serialized HTML actually changed
      if (hasSerializedValueChanged && onChange) {
        onChange(newHtml);
      }

      // Force re-render if only internal state changed (cursor position, selection, etc.)
      if (hasInternalSlateValueChanged && !hasSerializedValueChanged) {
        // React will handle the re-render automatically through state update
      }
    },
    [internalValue, serializedValue, onChange]
  );

  const isControlled = value !== undefined;
  const currentValue = isControlled ? internalValue : internalValue;

  // Safety check: ensure we always have a valid Slate value
  const safeValue =
    Array.isArray(currentValue) && currentValue.length > 0
      ? currentValue
      : createEmptyValue();

  return (
    <RichTextInputRootSlot
      {...recipeProps}
      {...styleProps}
      {...functionalProps}
      ref={forwardedRef}
    >
      <RichTextInputEditorSlot asChild>
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
      </RichTextInputEditorSlot>
    </RichTextInputRootSlot>
  );
};

RichTextInput.displayName = "RichTextInput";
