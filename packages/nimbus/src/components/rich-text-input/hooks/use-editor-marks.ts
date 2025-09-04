/**
 * Custom hook to track editor marks changes for newer Slate.js versions
 *
 * This hook works around issues in Slate.js 0.118+ where Editor.marks()
 * changes don't trigger re-renders properly for pending marks.
 */
import { useState, useEffect, useRef } from "react";
import { Editor } from "slate";
import { useSlate } from "slate-react";

// WeakMap to store the last marks string for each editor instance
const editorMarksCache = new WeakMap<Editor, string | null>();

export const useEditorMarks = () => {
  const editor = useSlate();
  const [, forceUpdate] = useState({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check for marks changes, but debounce to avoid excessive re-renders
  useEffect(() => {
    const checkMarksChange = () => {
      const marks = Editor.marks(editor);
      const marksString = marks ? JSON.stringify(marks) : null;

      // Check if marks have changed since last render
      const lastMarksString = editorMarksCache.get(editor);
      if (lastMarksString !== marksString) {
        editorMarksCache.set(editor, marksString);
        forceUpdate({});
      }
    };

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Check immediately for marks changes
    checkMarksChange();

    // Also check after a short delay to catch delayed mark updates
    timeoutRef.current = setTimeout(checkMarksChange, 0);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  });

  return Editor.marks(editor) || {};
};
