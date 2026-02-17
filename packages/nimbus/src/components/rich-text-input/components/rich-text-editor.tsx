import {
  useCallback,
  useImperativeHandle,
  useRef,
  type FocusEventHandler,
  type ReactNode,
} from "react";
import { useObjectRef } from "react-aria";
import { mergeRefs } from "@chakra-ui/react";
import { type Descendant, type Editor } from "slate";
import { Slate, Editable } from "slate-react";
import {
  RichTextInputEditableSlot,
  RichTextInputToolbarSlot,
} from "../rich-text-input.slots";
import {
  Element,
  Leaf,
  focusEditor,
  resetEditor,
} from "../utils/slate-helpers";
import { createEmptyValue } from "../utils/html-serialization";
import { useKeyboardShortcuts } from "../hooks/use-keyboard-shortcuts";
import { EDITOR_DEFAULTS } from "../constants";

export type RichTextEditorProps = {
  /**
   * The Slate editor instance - created by parent for controlled value support
   */
  editor: Editor;
  /**
   * Initial value for the editor
   */
  initialValue: Descendant[];
  onChange: (value: Descendant[]) => void;
  onFocus?: FocusEventHandler<HTMLDivElement>;
  onBlur?: FocusEventHandler<HTMLDivElement>;
  placeholder?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  autoFocus?: boolean;
  toolbar?: ReactNode;
  /**
   * React ref to be forwarded to the editor
   */
  ref?: React.Ref<RichTextEditorRef>;
};

export type RichTextEditorRef = {
  focus: () => void;
  resetValue: (html: string) => void;
};

export const RichTextEditor = function RichTextEditor({
  ref: forwardedRef,
  editor,
  initialValue,
  onChange,
  onFocus,
  onBlur,
  placeholder = EDITOR_DEFAULTS.placeholder,
  isDisabled = EDITOR_DEFAULTS.isDisabled,
  isReadOnly = EDITOR_DEFAULTS.isReadOnly,
  autoFocus = EDITOR_DEFAULTS.autoFocus,
  toolbar,
}: RichTextEditorProps) {
  const localRef = useRef<RichTextEditorRef>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

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
    ref,
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

  // Ensure we always have a valid initial value
  const defaultValue = createEmptyValue();
  const safeInitialValue =
    Array.isArray(initialValue) && initialValue.length > 0
      ? initialValue
      : defaultValue;

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
        />
      </RichTextInputEditableSlot>
    </Slate>
  );
};

RichTextEditor.displayName = "RichTextEditor";
