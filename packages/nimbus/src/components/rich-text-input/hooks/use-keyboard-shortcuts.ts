/**
 * Hook for handling keyboard shortcuts in the rich text editor
 *
 * Used by:
 * - components/rich-text-editor.tsx: Attaches keyboard event handler to the editor
 *
 * Purpose:
 * - Centralizes all keyboard shortcut logic for the editor
 * - Handles formatting shortcuts (Cmd+B, Cmd+I, etc.)
 * - Manages undo/redo keyboard combinations
 * - Processes soft line breaks (Shift+Enter)
 * - Extracted from rich-text-editor.tsx to improve organization and testability
 *
 * @param editor - The Slate editor instance for applying changes
 * @returns Object containing the keyboard event handler
 */
import { useCallback } from "react";
import { Editor } from "slate";
import isHotkey from "is-hotkey";
import { HOTKEYS } from "../constants";
import { toggleMark } from "../utils/slate-helpers";
import { Softbreaker } from "../utils/slate-helpers";

export interface UseKeyboardShortcutsProps {
  editor: Editor;
}

export const useKeyboardShortcuts = ({ editor }: UseKeyboardShortcutsProps) => {
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

  return { handleKeyDown };
};
