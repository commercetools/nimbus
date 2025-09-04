import { useEffect, useState, useRef } from "react";
import { Editor } from "slate";

/**
 * Hook that forces re-renders when marks change.
 * This is necessary in Slate 0.118+ where Editor.marks() changes don't automatically
 * trigger React re-renders for pending marks (marks applied before typing).
 *
 * This approach monitors marks on each editor change and forces re-renders when they differ.
 */
export const useMarkUpdates = (editor: Editor) => {
  const [, forceUpdate] = useState({});
  const lastMarksRef = useRef<Record<string, boolean> | null>(null);

  useEffect(() => {
    const checkMarksAndUpdate = () => {
      const currentMarks = Editor.marks(editor);
      const lastMarks = lastMarksRef.current;

      // Compare marks by converting to strings (simple but effective for this use case)
      const currentMarksStr = JSON.stringify(currentMarks || {});
      const lastMarksStr = JSON.stringify(lastMarks || {});

      if (currentMarksStr !== lastMarksStr) {
        lastMarksRef.current = currentMarks;
        forceUpdate({});
      }
    };

    // Check marks on every editor change
    const originalOnChange = editor.onChange;
    editor.onChange = () => {
      originalOnChange.call(editor);
      // Check marks after the change has been processed
      setTimeout(checkMarksAndUpdate, 0);
    };

    // Cleanup: restore original onChange
    return () => {
      editor.onChange = originalOnChange;
    };
  }, [editor]);
};
