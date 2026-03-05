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
import { Editor } from "slate";
import { useSlate, useSlateSelection } from "slate-react";
import type { Key } from "react-aria";
import {
  blockTypes,
  type BlockType,
  type TextStyleDefinition,
} from "../constants";
import {
  isMarkActive,
  isBlockActive,
  toggleBlock,
} from "../utils/slate-helpers";
import type { CustomElement } from "../utils/types";

export type UseToolbarStateProps = {
  withPreservedSelection: (fn: () => void) => () => void;
  textStyles: TextStyleDefinition[];
};

export const useToolbarState = ({
  withPreservedSelection,
  textStyles,
}: UseToolbarStateProps) => {
  const editor = useSlate();
  // Subscribe to selection changes properly
  const selection = useSlateSelection();

  // Get current block type - using useSlateSelection() means this automatically updates
  const currentTextStyle = useMemo(() => {
    return (
      blockTypes.find((type) =>
        isBlockActive(editor, type as CustomElement["type"])
      ) || "paragraph"
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection, editor.children]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection, editor.children, Editor.marks(editor)]);

  // Get currently selected list formatting key
  const selectedListKeys = useMemo(() => {
    const keys: string[] = [];
    if (isBlockActive(editor, "bulleted-list")) keys.push("bulleted-list");
    if (isBlockActive(editor, "numbered-list")) keys.push("numbered-list");
    return new Set(keys);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection, editor.children]);

  // Check history state for undo/redo buttons
  const hasUndos = useMemo(() => {
    return editor.history && editor.history.undos.length > 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection, editor.children]);

  const hasRedos = useMemo(() => {
    return editor.history && editor.history.redos.length > 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection, editor.children]);

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
