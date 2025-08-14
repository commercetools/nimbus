import { useMemo, useCallback } from "react";
import { useSlate, ReactEditor } from "slate-react";
import { Transforms, Editor } from "slate";
import type { Key } from "react-aria";
import { Menu, IconButton, Text, Box } from "@/components";
import {
  MoreHoriz,
  FormatStrikethrough,
  Code,
} from "@commercetools/nimbus-icons";
import { isMarkActive, toggleMark } from "./rich-text-utils/slate-helpers";

export interface FormattingMenuProps {
  isDisabled?: boolean;
}

export const FormattingMenu = ({ isDisabled = false }: FormattingMenuProps) => {
  const editor = useSlate();

  // Helper function to preserve selection when menu items are clicked
  const withPreservedSelection = useCallback(
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

  // Get currently selected formatting keys
  const selectedKeys = useMemo(() => {
    const keys: string[] = [];
    if (isMarkActive(editor, "strikethrough")) keys.push("strikethrough");
    if (isMarkActive(editor, "code")) keys.push("code");
    if (isMarkActive(editor, "superscript")) keys.push("superscript");
    if (isMarkActive(editor, "subscript")) keys.push("subscript");
    return new Set(keys);
  }, [editor.selection, editor.children, Editor.marks(editor)]); // Include marks for pending mark state

  const handleSelectionChange = useCallback(
    (keys: "all" | Set<Key>) => {
      if (keys === "all") return;

      const keyArray = Array.from(keys) as string[];
      const currentKeys = Array.from(selectedKeys);

      // Find newly selected keys (toggle on)
      const newlySelected = keyArray.filter(
        (key) => !currentKeys.includes(key)
      );
      // Find newly deselected keys (toggle off)
      const newlyDeselected = currentKeys.filter(
        (key) => !keyArray.includes(key)
      );

      // Apply toggles
      [...newlySelected, ...newlyDeselected].forEach((key) => {
        withPreservedSelection(() => toggleMark(editor, key))();
      });
    },
    [editor, selectedKeys, withPreservedSelection]
  );

  return (
    <Menu.Root
      selectionMode="multiple"
      selectedKeys={selectedKeys}
      onSelectionChange={handleSelectionChange}
    >
      <Menu.Trigger asChild>
        <IconButton
          size="xs"
          variant="ghost"
          aria-label="More formatting options"
          isDisabled={isDisabled}
          onMouseDown={(event) => event.preventDefault()}
        >
          <MoreHoriz />
        </IconButton>
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Item id="strikethrough">
          <Box slot="label" display="flex" alignItems="center" gap="200">
            <FormatStrikethrough />
            <Text textStyle="sm">Strikethrough</Text>
          </Box>
        </Menu.Item>
        <Menu.Item id="code">
          <Box slot="label" display="flex" alignItems="center" gap="200">
            <Code />
            <Text textStyle="sm">Code</Text>
          </Box>
        </Menu.Item>
        <Menu.Item id="superscript">
          <Box slot="label" display="flex" alignItems="center" gap="200">
            <Text>X²</Text>
            <Text textStyle="sm">Superscript</Text>
          </Box>
        </Menu.Item>
        <Menu.Item id="subscript">
          <Box slot="label" display="flex" alignItems="center" gap="200">
            <Text>X₂</Text>
            <Text textStyle="sm">Subscript</Text>
          </Box>
        </Menu.Item>
      </Menu.Content>
    </Menu.Root>
  );
};
