import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useSlotRecipe } from "@chakra-ui/react";
import { createEditor } from "slate";
import { withReact } from "slate-react";
import { withHistory } from "slate-history";
import { extractStyleProps } from "@/utils";
import { RichTextInputRootSlot } from "./rich-text-input.slots";
import {
  RichTextEditor,
  RichTextToolbar,
  type RichTextEditorRef,
} from "./components";
import type { RichTextInputProps } from "./rich-text-input.types";
import {
  toHTML,
  fromHTML,
  createEmptyValue,
  validSlateStateAdapter,
  withLinks,
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

  // Create editor instance - lifted from RichTextEditor for controlled value support
  // In Slate, the editor is uncontrolled and initialValue is only used on mount.
  // By owning the editor here, we can directly update editor.children for controlled updates.
  const editor = useMemo(() => {
    const baseEditor = createEditor();
    return withLinks(withHistory(withReact(baseEditor)));
  }, []);

  // Compute initial value once for the Slate component's initialValue prop
  const initialSlateValue = useMemo(() => {
    const initialHtml = value ?? defaultValue ?? "";
    try {
      return initialHtml ? fromHTML(initialHtml) : createEmptyValue();
    } catch (error) {
      console.warn("Failed to parse initial HTML, using empty value:", error);
      return createEmptyValue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only compute once on mount

  // Track the current serialized value for change detection
  const [serializedValue, setSerializedValue] = useState(() => {
    return value ?? defaultValue ?? "";
  });

  // Track if we're in the middle of an internal change to avoid loops
  const isInternalChangeRef = useRef(false);

  const editorRef = useRef<RichTextEditorRef>(null);

  // Handle controlled value changes from parent
  // In Slate, we must directly update editor.children since the component is uncontrolled
  useEffect(() => {
    // Skip if this is an internal change (user typing) or if value matches
    if (
      isInternalChangeRef.current ||
      value === undefined ||
      value === serializedValue
    ) {
      isInternalChangeRef.current = false;
      return;
    }

    // External value change - update editor content directly
    const newSlateValue = value ? fromHTML(value) : createEmptyValue();
    const validatedValue = validSlateStateAdapter(newSlateValue);

    // Replace editor content directly (Slate pattern)
    // Set children and selection atomically before triggering onChange
    editor.children = validatedValue;

    // Reset selection to null first, then set to start after DOM sync
    // This avoids "Cannot resolve a DOM point" errors
    editor.selection = null;

    // Clear history since this is an external reset - preserves clean undo state
    if (editor.history) {
      editor.history.undos = [];
      editor.history.redos = [];
    }

    // Update our tracked value
    setSerializedValue(value);

    // Trigger a re-render to sync DOM with new state
    editor.onChange();
  }, [value, serializedValue, editor]);

  const handleChange = useCallback(
    (slateValue: ReturnType<typeof createEmptyValue>) => {
      const newHtml = toHTML(slateValue);
      const hasSerializedValueChanged = newHtml !== serializedValue;

      // Mark this as an internal change to prevent useEffect from overwriting
      if (hasSerializedValueChanged) {
        isInternalChangeRef.current = true;
        setSerializedValue(newHtml);

        // Call onChange if the serialized HTML actually changed
        if (onChange) {
          onChange(newHtml);
        }
      }
    },
    [serializedValue, onChange]
  );

  // Safety check: ensure we always have a valid Slate value for initial render
  const safeInitialValue = validSlateStateAdapter(initialSlateValue);

  return (
    <RichTextInputRootSlot
      role="group"
      {...recipeProps}
      {...styleProps}
      {...functionalProps}
      {...dataAttributes}
      ref={forwardedRef}
    >
      <RichTextEditor
        ref={editorRef}
        editor={editor}
        initialValue={safeInitialValue}
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
