import {
  useMemo,
  useCallback,
  useImperativeHandle,
  forwardRef,
  type ForwardedRef,
  type FocusEventHandler,
  type ReactNode,
} from "react";
import { createEditor, type Descendant } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import isHotkey from "is-hotkey";
import {
  RichTextInputEditableSlot,
  RichTextInputToolbarSlot,
} from "../rich-text-input.slots";
import {
  Element,
  Leaf,
  withLinks,
  toggleMark,
  focusEditor,
  resetEditor,
  Softbreaker,
} from "./rich-text-utils/slate-helpers";
import { createEmptyValue } from "./rich-text-utils/html-serialization";

// Keyboard shortcuts
const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
} as const;

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
    placeholder = "Start typing...",
    isDisabled = false,
    isReadOnly = false,
    autoFocus = false,
    toolbar,
  } = props;

  // Create editor with plugins
  const editor = useMemo(() => {
    const baseEditor = createEditor();
    return withLinks(withHistory(withReact(baseEditor)));
  }, []);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      // Handle undo/redo shortcuts
      if ((event.metaKey || event.ctrlKey) && event.key === "z") {
        event.preventDefault();
        if (event.shiftKey) {
          editor.redo();
        } else {
          editor.undo();
        }
        return;
      }

      // Handle formatting shortcuts
      for (const hotkey in HOTKEYS) {
        if (isHotkey(hotkey, event)) {
          event.preventDefault();
          const mark = HOTKEYS[hotkey as keyof typeof HOTKEYS];
          toggleMark(editor, mark);
          return;
        }
      }

      // Handle soft line breaks (Shift+Enter)
      if (event.shiftKey && event.key === "Enter") {
        event.preventDefault();
        editor.insertText(Softbreaker.placeholderCharacter);
        return;
      }
    },
    [editor]
  );

  // Handle focus
  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      if (onFocus) {
        onFocus(event);
      }
    },
    [onFocus, editor]
  );

  // Handle blur
  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      if (onBlur) {
        onBlur(event);
      }
    },
    [onBlur, editor]
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
    <Slate editor={editor} value={safeInitialValue} onChange={onChange}>
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
        />
      </RichTextInputEditableSlot>
    </Slate>
  );
});

RichTextEditor.displayName = "RichTextEditor";
