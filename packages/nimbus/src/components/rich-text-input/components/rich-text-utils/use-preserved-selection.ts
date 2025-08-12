import { useCallback } from "react";
import { Editor, Transforms } from "slate";
import { ReactEditor } from "slate-react";

/**
 * Hook that provides a helper function to preserve selection when toolbar actions are executed.
 * This prevents losing text selection when interacting with toolbar buttons and menus.
 *
 * @param editor - The Slate editor instance
 * @returns A function that wraps actions to preserve selection and focus
 */
export const usePreservedSelection = (editor: Editor) => {
  return useCallback(
    (action: () => void) => {
      return () => {
        // Save the current selection
        const { selection } = editor;

        // Execute the action
        action();

        // Restore selection if it was lost
        if (selection && !editor.selection) {
          Transforms.select(editor, selection);
        }

        // Ensure editor stays focused
        if (!ReactEditor.isFocused(editor)) {
          ReactEditor.focus(editor);
        }
      };
    },
    [editor]
  );
};
