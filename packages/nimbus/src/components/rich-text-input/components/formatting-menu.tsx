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

  // Get currently selected formatting keys (strikethrough and code)
  const selectedKeys = useMemo(() => {
    const keys: string[] = [];
    if (isMarkActive(editor, "strikethrough")) keys.push("strikethrough");
    if (isMarkActive(editor, "code")) keys.push("code");
    return new Set(keys);
  }, [editor.selection, editor.children, Editor.marks(editor)]); // Include marks for pending mark state

  // Get currently selected script formatting key (superscript or subscript - mutually exclusive)
  const selectedScriptKeys = useMemo(() => {
    const keys: string[] = [];
    if (isMarkActive(editor, "superscript")) keys.push("superscript");
    if (isMarkActive(editor, "subscript")) keys.push("subscript");
    return new Set(keys);
  }, [editor.selection, editor.children, Editor.marks(editor)]); // Include marks for pending mark state

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

  return (
    <Menu.Root
      selectionMode="multiple"
      selectedKeys={allSelectedKeys}
      onSelectionChange={(args) => {
        // This is a workaround to ensure the editor is focused when the menu is closed
        handleAllSelectionChange(args);
        requestAnimationFrame(() => {
          setTimeout(() => {
            focusEditor(editor);
          }, 50);
        });
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
