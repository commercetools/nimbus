/**
 * Hook for managing formatting menu state with mutual exclusion logic
 *
 * Used by:
 * - components/formatting-menu.tsx: Manages complex formatting state and interactions
 *
 * Purpose:
 * - Handles mutual exclusion between superscript and subscript formatting
 * - Manages state for all formatting options in the "More Options" menu
 * - Processes complex selection changes with custom logic
 * - Extracted from formatting-menu.tsx to improve organization and testability
 * - Separates complex business logic from UI rendering
 *
 * @param withPreservedSelection - Function for preserving editor selection during operations
 * @returns Object containing formatting state and selection change handler
 */
import { useMemo, useCallback } from "react";
import { Editor } from "slate";
import { useSlate, useSlateSelection } from "slate-react";
import type { Key } from "react-aria";
import { BASIC_FORMATTING, SCRIPT_FORMATTING } from "../constants";
import { isMarkActive, toggleMark } from "../utils/slate-helpers";

export type UseFormattingStateProps = {
  withPreservedSelection: (fn: () => void) => () => void;
};

export const useFormattingState = ({
  withPreservedSelection,
}: UseFormattingStateProps) => {
  const editor = useSlate();
  // Subscribe to selection changes properly
  const selection = useSlateSelection();

  // Get currently selected formatting keys (strikethrough and code)
  const selectedKeys = useMemo(() => {
    const keys: string[] = [];
    BASIC_FORMATTING.forEach((format) => {
      if (isMarkActive(editor, format)) keys.push(format);
    });
    return new Set(keys);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection, editor.children, Editor.marks(editor)]);

  // Get currently selected script formatting key (superscript or subscript - mutually exclusive)
  const selectedScriptKeys = useMemo(() => {
    const keys: string[] = [];
    SCRIPT_FORMATTING.forEach((format) => {
      if (isMarkActive(editor, format)) keys.push(format);
    });
    return new Set(keys);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection, editor.children, Editor.marks(editor)]);

  // Combine all selected keys for display purposes
  const allSelectedKeys = useMemo(() => {
    return new Set([
      ...Array.from(selectedKeys),
      ...Array.from(selectedScriptKeys),
    ]);
  }, [selectedKeys, selectedScriptKeys]);

  // Handle all selection changes with custom logic for mutual exclusion
  const handleAllSelectionChange = useCallback(
    (keys: "all" | Set<Key>) => {
      if (keys === "all") return;

      const keyArray = Array.from(keys) as string[];
      const currentKeys = Array.from(allSelectedKeys);

      // Find newly selected keys (toggle on)
      const newlySelected = keyArray.filter(
        (key) => !currentKeys.includes(key)
      );
      // Find newly deselected keys (toggle off)
      const newlyDeselected = currentKeys.filter(
        (key) => !keyArray.includes(key)
      );

      // Handle changes for each key
      [...newlySelected, ...newlyDeselected].forEach((key) => {
        if (key === "superscript" || key === "subscript") {
          // Handle script formatting with mutual exclusion
          withPreservedSelection(() => {
            const currentlyActive = isMarkActive(editor, "superscript")
              ? "superscript"
              : isMarkActive(editor, "subscript")
                ? "subscript"
                : null;

            if (newlySelected.includes(key)) {
              // If selecting a script format, deactivate the other one first
              if (currentlyActive && currentlyActive !== key) {
                toggleMark(editor, currentlyActive);
              }
              toggleMark(editor, key);
            } else {
              // Deselecting
              toggleMark(editor, key);
            }
          })();
        } else {
          // Handle regular formatting (strikethrough, code)
          withPreservedSelection(() => toggleMark(editor, key))();
        }
      });
    },
    [editor, allSelectedKeys, withPreservedSelection]
  );

  return {
    selectedKeys,
    selectedScriptKeys,
    allSelectedKeys,
    handleAllSelectionChange,
  };
};
