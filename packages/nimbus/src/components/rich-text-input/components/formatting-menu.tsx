import { useMemo, useCallback } from "react";
import { useSlate } from "slate-react";
import { Editor } from "slate";
import type { Key } from "react-aria";
import { Menu, IconButton, Text, Box, Tooltip } from "@/components";
import {
  MoreHoriz,
  FormatStrikethrough,
  Code,
} from "@commercetools/nimbus-icons";
import {
  focusEditor,
  isMarkActive,
  toggleMark,
  usePreservedSelection,
} from "./rich-text-utils";

export interface FormattingMenuProps {
  isDisabled?: boolean;
}

export const FormattingMenu = ({ isDisabled = false }: FormattingMenuProps) => {
  const editor = useSlate();
  const withPreservedSelection = usePreservedSelection(editor);

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
      onSelectionChange={(args) => {
        handleSelectionChange(args);

        // This is a workaround to ensure the editor is focused when the menu is closed
        requestAnimationFrame(() =>
          setTimeout(() => {
            focusEditor(editor);
          }, 50)
        );
      }}
    >
      <Tooltip.Root delay={0} closeDelay={0}>
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
        <Tooltip.Content placement="top">More styles</Tooltip.Content>
      </Tooltip.Root>
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
