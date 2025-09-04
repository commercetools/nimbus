/**
 * Hook for managing rich text toolbar state and interactions
 *
 * Used by:
 * - components/rich-text-toolbar.tsx: Manages all toolbar state and event handlers
 *
 * Purpose:
 * - Centralizes complex toolbar state management logic
 * - Handles text style changes, list toggling, format detection
 * - Manages undo/redo button states
 * - Extracted from rich-text-toolbar.tsx to improve organization and testability
 * - Provides clean separation between UI and business logic
 *
 * @param withPreservedSelection - Function for preserving editor selection during operations
 * @returns Object containing all toolbar state and event handlers
 */
import { useMemo, useCallback } from "react";
import { useSlate } from "slate-react";
import type { Key } from "react-aria";
import { textStyles, blockTypes, type BlockType } from "../constants";
import {
  isMarkActive,
  isBlockActive,
  toggleBlock,
} from "../utils/slate-helpers";
import type { CustomElement } from "../utils/types";

export interface UseToolbarStateProps {
  withPreservedSelection: (fn: () => void) => () => void;
}

export const useToolbarState = ({
  withPreservedSelection,
}: UseToolbarStateProps) => {
  const editor = useSlate();

  // Get current block type - using useSlate() means this automatically updates
  const currentTextStyle = useMemo(() => {
    return (
      blockTypes.find((type) =>
        isBlockActive(editor, type as CustomElement["type"])
      ) || "paragraph"
    );
  }, [editor.selection, editor.children]);

  const selectedTextStyle = textStyles.find((v) => v.id === currentTextStyle);
  const selectedTextStyleLabel = selectedTextStyle?.label || "";

  // Handle text style changes
  const handleTextStyleChange = useCallback(
    (styleId: string) => {
      withPreservedSelection(() => {
        toggleBlock(editor, styleId as BlockType);
      })();
    },
    [editor, withPreservedSelection]
  );

  // Handle list formatting
  const handleListToggle = useCallback(
    (selectedKeys: Set<Key>) => {
      withPreservedSelection(() => {
        const selected = Array.from(selectedKeys)[0] as BlockType | undefined;
        const currentlyActive = isBlockActive(editor, "bulleted-list")
          ? "bulleted-list"
          : isBlockActive(editor, "numbered-list")
            ? "numbered-list"
            : null;

        if (selected) {
          toggleBlock(editor, selected);
        } else if (currentlyActive) {
          toggleBlock(editor, currentlyActive);
        }
      })();
    },
    [editor, withPreservedSelection]
  );

  // Get currently selected formatting keys - simplified deps
  const selectedFormatKeys = useMemo(() => {
    const keys: string[] = [];
    if (isMarkActive(editor, "bold")) keys.push("bold");
    if (isMarkActive(editor, "italic")) keys.push("italic");
    if (isMarkActive(editor, "underline")) keys.push("underline");
    return new Set(keys);
    // Include editor.marks to detect pending marks changes
  }, [editor.selection, editor.children, editor.marks]);

  // Get currently selected list formatting key
  const selectedListKeys = useMemo(() => {
    const keys: string[] = [];
    if (isBlockActive(editor, "bulleted-list")) keys.push("bulleted-list");
    if (isBlockActive(editor, "numbered-list")) keys.push("numbered-list");
    return new Set(keys);
  }, [editor.selection, editor.children]);

  // Check history state for undo/redo buttons
  const hasUndos = useMemo(() => {
    return editor.history && editor.history.undos.length > 0;
  }, [editor.selection, editor.children]);

  const hasRedos = useMemo(() => {
    return editor.history && editor.history.redos.length > 0;
  }, [editor.selection, editor.children]);

  return {
    currentTextStyle,
    selectedTextStyle,
    selectedTextStyleLabel,
    handleTextStyleChange,
    handleListToggle,
    selectedFormatKeys,
    selectedListKeys,
    hasUndos,
    hasRedos,
  };
};
