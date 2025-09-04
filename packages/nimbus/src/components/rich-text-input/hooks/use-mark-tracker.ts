import { useLayoutEffect, useState, useRef } from "react";
import { Editor } from "slate";

/**
 * Hook that tracks mark changes and forces re-renders when marks are added or removed.
 *
 * This is necessary due to a breaking change in Slate 0.118+ where elements no longer
 * automatically re-render due to selection changes. Specifically, this addresses the
 * issue with "pending marks" (marks applied before typing) not triggering re-renders.
 *
 * From Slate's breaking change documentation:
 * "Elements no longer re-render due to selection changes. To re-render whenever
 * the selection changes anywhere in the editor, subscribe to useSlateSelection."
 *
 * However, the suggested hooks (useSelected, useSlateSelection, useSlateSelector) don't
 * address the specific case of pending marks, which require tracking mark additions/removals
 * via editor.addMark/removeMark rather than selection changes.
 *
 * @see https://github.com/ianstormtaylor/slate/releases/tag/slate-react%400.100.0
 */
export const useMarkTracker = (editor: Editor) => {
  const [updateCounter, setUpdateCounter] = useState(0);
  const interceptedRef = useRef(false);

  useLayoutEffect(() => {
    // Only set up interception once per editor instance
    if (interceptedRef.current) return;
    interceptedRef.current = true;

    // Store original methods
    const originalAddMark = editor.addMark;
    const originalRemoveMark = editor.removeMark;

    // Intercept addMark
    editor.addMark = (key: string, value: boolean) => {
      originalAddMark.call(editor, key, value);
      // Increment counter to force re-render only if marks actually changed
      setUpdateCounter((prev) => prev + 1);
    };

    // Intercept removeMark
    editor.removeMark = (key: string) => {
      originalRemoveMark.call(editor, key);
      // Increment counter to force re-render only if marks actually changed
      setUpdateCounter((prev) => prev + 1);
    };

    // Cleanup
    return () => {
      if (editor.addMark === originalAddMark) return; // Already cleaned up
      editor.addMark = originalAddMark;
      editor.removeMark = originalRemoveMark;
      interceptedRef.current = false;
    };
  }, [editor]);

  // Return the update counter for dependency arrays (always changes when marks change)
  return updateCounter;
};
