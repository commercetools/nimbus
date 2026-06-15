import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
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

  // The first render (server + client hydration) always starts from an empty
  // editor so the server-rendered output matches the client's initial render.
  // The actual `value`/`defaultValue` HTML is parsed and injected once after
  // mount (see effect below): HTML parsing relies on the browser-only DOMParser,
  // which is unavailable during SSR. Deferring it keeps SSR safe and avoids
  // hydration mismatches.
  const initialSlateValue = useMemo(() => createEmptyValue(), []);

  // Track the current serialized value for change detection
  const [serializedValue, setSerializedValue] = useState(() => {
    return value ?? defaultValue ?? "";
  });

  // Track if we're in the middle of an internal change to avoid loops
  const isInternalChangeRef = useRef(false);

  // Set while the deferred initial population triggers a synthetic onChange, so
  // that change is not surfaced to the consumer's onChange callback.
  const suppressNextOnChangeRef = useRef(false);

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

  // Populate the editor from the initial `value`/`defaultValue` after mount.
  // The initial render starts empty (see `initialSlateValue` above) so SSR and
  // the first client render agree; the real content is parsed and injected here
  // once the DOM is available, immediately after hydration.
  useEffect(() => {
    const initialHtml = value ?? defaultValue ?? "";
    if (!initialHtml) {
      return;
    }

    const validatedValue = validSlateStateAdapter(fromHTML(initialHtml));

    // Replace editor content directly (Slate pattern, mirrors the controlled
    // value effect above).
    editor.children = validatedValue;
    editor.selection = null;
    if (editor.history) {
      editor.history.undos = [];
      editor.history.redos = [];
    }

    // The onChange this triggers is initial population, not user input — keep
    // the flag set only for the duration of the synchronous onChange call.
    suppressNextOnChangeRef.current = true;
    editor.onChange();
    suppressNextOnChangeRef.current = false;
    // Run once on mount; the initial value is captured intentionally.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = useCallback(
    (slateValue: ReturnType<typeof createEmptyValue>) => {
      const newHtml = toHTML(slateValue);
      const hasSerializedValueChanged = newHtml !== serializedValue;

      if (!hasSerializedValueChanged) {
        return;
      }

      // Deferred initial population triggers a synthetic onChange: keep our
      // tracked value in sync, but don't surface it to the consumer and don't
      // flag it as an internal edit (so a later controlled update isn't skipped).
      if (suppressNextOnChangeRef.current) {
        setSerializedValue(newHtml);
        return;
      }

      // Mark this as an internal change to prevent useEffect from overwriting
      isInternalChangeRef.current = true;
      setSerializedValue(newHtml);

      // Call onChange if the serialized HTML actually changed
      if (onChange) {
        onChange(newHtml);
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
