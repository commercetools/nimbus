import {
  useMemo,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect,
  type ForwardedRef,
  type FocusEventHandler,
  type ReactNode,
} from "react";
import { createEditor, type Descendant } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import {
  RichTextInputEditableSlot,
  RichTextInputToolbarSlot,
} from "../rich-text-input.slots";
import {
  Element,
  Leaf,
  withLinks,
  focusEditor,
  resetEditor,
} from "../utils/slate-helpers";
import { createEmptyValue } from "../utils/html-serialization";
import { useKeyboardShortcuts } from "../hooks/use-keyboard-shortcuts";
import { EDITOR_DEFAULTS } from "../constants";

export interface RichTextEditorProps {
  value?: Descendant[];
  onChange: (value: Descendant[]) => void;
  onFocus?: FocusEventHandler<HTMLDivElement>;
  onBlur?: FocusEventHandler<HTMLDivElement>;
  placeholder?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  autoFocus?: boolean;
  toolbar?: ReactNode;
}

export interface RichTextEditorRef {
  focus: () => void;
  resetValue: (html: string) => void;
}

export const RichTextEditor = forwardRef<
  RichTextEditorRef,
  RichTextEditorProps
>((props, forwardedRef: ForwardedRef<RichTextEditorRef>) => {
  const {
    value,
    onChange,
    onFocus,
    onBlur,
    placeholder = EDITOR_DEFAULTS.placeholder,
    isDisabled = EDITOR_DEFAULTS.isDisabled,
    isReadOnly = EDITOR_DEFAULTS.isReadOnly,
    autoFocus = EDITOR_DEFAULTS.autoFocus,
    toolbar,
  } = props;

  // Track editor readiness state
  const [isEditorReady, setIsEditorReady] = useState(false);

  // Create editor with plugins
  const editor = useMemo(() => {
    const baseEditor = createEditor();
    return withLinks(withHistory(withReact(baseEditor)));
  }, []);

  // Set editor as ready after initialization
  useEffect(() => {
    // Longer delay to ensure Slate is fully initialized across all environments
    const timeoutId = setTimeout(() => {
      setIsEditorReady(true);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  // Handle keyboard shortcuts using hook
  const { handleKeyDown } = useKeyboardShortcuts({ editor });

  // Handle focus
  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      if (onFocus) {
        onFocus(event);
      }
    },
    [onFocus]
  );

  // Handle blur
  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      if (onBlur) {
        onBlur(event);
      }
    },
    [onBlur]
  );

  // Expose methods through ref
  useImperativeHandle(
    forwardedRef,
    () => ({
      focus: () => focusEditor(editor),
      resetValue: (html: string) => resetEditor(editor, html),
    }),
    [editor]
  );

  // Render element
  const renderElement = useCallback(
    (props: Parameters<typeof Element>[0]) => <Element {...props} />,
    []
  );

  // Render leaf
  const renderLeaf = useCallback(
    (props: Parameters<typeof Leaf>[0]) => <Leaf {...props} />,
    []
  );

  // Ensure we always have a valid value
  const defaultValue = createEmptyValue();
  const safeInitialValue =
    Array.isArray(value) && value.length > 0 ? value : defaultValue;

  return (
    <Slate editor={editor} initialValue={safeInitialValue} onChange={onChange}>
      {toolbar && (
        <RichTextInputToolbarSlot>{toolbar}</RichTextInputToolbarSlot>
      )}
      <RichTextInputEditableSlot asChild>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder={placeholder}
          autoFocus={autoFocus}
          readOnly={isReadOnly || isDisabled}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-label="Rich text editor"
          role="textbox"
          aria-multiline="true"
          data-slate-ready={isEditorReady ? "true" : undefined}
        />
      </RichTextInputEditableSlot>
    </Slate>
  );
});

RichTextEditor.displayName = "RichTextEditor";
