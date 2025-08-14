import { useMemo, useCallback } from "react";
import { Editor, Transforms } from "slate";
import { useSlate, ReactEditor } from "slate-react";
import type { Key } from "react-aria";
import {
  Toolbar,
  Menu,
  VisuallyHidden,
  Divider,
  ToggleButtonGroup,
  IconToggleButton,
  IconButton,
  Text,
  Box,
} from "@/components";
import { Group } from "@/components/group";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  KeyboardArrowDown,
  Undo,
  Redo,
} from "@commercetools/nimbus-icons";
import {
  isMarkActive,
  isBlockActive,
  toggleMark,
  toggleBlock,
} from "./rich-text-utils/slate-helpers";
import type { CustomElement } from "./rich-text-utils/types";
import { FormattingMenu } from "./formatting-menu";

type BlockType = CustomElement["type"];

export interface RichTextToolbarProps {
  isDisabled?: boolean;
}

export const RichTextToolbar = ({
  isDisabled = false,
}: RichTextToolbarProps) => {
  const editor = useSlate();

  // Helper function to preserve selection when toolbar buttons are clicked
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

  const buttonSize = "xs";

  // Text style definitions that map to our Slate block types
  const textStyles = [
    {
      id: "paragraph",
      label: "Paragraph",
      props: {
        textStyle: "md",
        color: "neutral.11",
      },
    },
    {
      id: "heading-one",
      label: "Heading 1",
      props: {
        textStyle: "2xl",
        fontWeight: "700",
      },
    },
    {
      id: "heading-two",
      label: "Heading 2",
      props: {
        textStyle: "xl",
        fontWeight: "600",
      },
    },
    {
      id: "heading-three",
      label: "Heading 3",
      props: {
        textStyle: "lg",
        fontWeight: "500",
      },
    },
    {
      id: "heading-four",
      label: "Heading 4",
      props: {
        textStyle: "md",
        fontWeight: "500",
      },
    },
    {
      id: "heading-five",
      label: "Heading 5",
      props: {
        textStyle: "sm",
        fontWeight: "500",
      },
    },
    {
      id: "block-quote",
      label: "Quote",
      props: {
        textStyle: "md",
        fontStyle: "italic",
      },
    },
  ];

  // Get current block type - using useSlate() means this automatically updates
  const currentTextStyle = useMemo(() => {
    if (isBlockActive(editor, "heading-one")) return "heading-one";
    if (isBlockActive(editor, "heading-two")) return "heading-two";
    if (isBlockActive(editor, "heading-three")) return "heading-three";
    if (isBlockActive(editor, "heading-four")) return "heading-four";
    if (isBlockActive(editor, "heading-five")) return "heading-five";
    if (isBlockActive(editor, "block-quote")) return "block-quote";
    return "paragraph";
  }, [editor.selection, editor.children]); // Block types don't need marks

  const selectedTextStyle = textStyles.find((v) => v.id === currentTextStyle);
  const selectedTextStyleProps = selectedTextStyle?.props || {};
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
  }, [editor.selection, editor.children, Editor.marks(editor)]); // Include marks for pending mark state

  // Get currently selected list formatting key
  const selectedListKeys = useMemo(() => {
    const keys: string[] = [];
    if (isBlockActive(editor, "bulleted-list")) keys.push("bulleted-list");
    if (isBlockActive(editor, "numbered-list")) keys.push("numbered-list");
    return new Set(keys);
  }, [editor.selection, editor.children]); // Block types don't need marks

  // Check history state for undo/redo buttons
  // cSpell:ignore undos
  const hasUndos = useMemo(() => {
    return editor.history && editor.history.undos.length > 0;
  }, [editor.selection, editor.children]); // History doesn't need marks

  const hasRedos = useMemo(() => {
    return editor.history && editor.history.redos.length > 0;
  }, [editor.selection, editor.children]); // History doesn't need marks

  if (isDisabled) {
    return null;
  }

  return (
    <Toolbar
      orientation="horizontal"
      aria-label="Text formatting"
      width="full"
      overflow="hidden"
    >
      {/* Text Style Menu */}
      <Group>
        <Menu.Root
          onAction={(styleId) => handleTextStyleChange(String(styleId))}
        >
          <Menu.Trigger
            width="4000"
            aria-label="Text style menu"
            alignSelf="stretch"
            onMouseDown={(event) => event.preventDefault()}
          >
            <Box display="flex" alignItems="center" gap="200" px="200">
              <Box display="flex" alignItems="center" gap="200" flexGrow="1">
                <Text my="auto" {...selectedTextStyleProps}>
                  {selectedTextStyleLabel}
                </Text>
              </Box>
              <KeyboardArrowDown />
            </Box>
          </Menu.Trigger>
          <Menu.Content>
            {textStyles.map((style) => (
              <Menu.Item
                key={style.id}
                id={style.id}
                {...(currentTextStyle === style.id && {
                  "data-state": "checked",
                })}
              >
                <Text {...style.props}>{style.label}</Text>
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Root>
      </Group>

      <Divider orientation="vertical" />

      {/* Text Formatting Toggles */}
      <ToggleButtonGroup.Root
        selectionMode="multiple"
        selectedKeys={selectedFormatKeys}
      >
        <IconToggleButton
          id="bold"
          size={buttonSize}
          variant="ghost"
          aria-label="Bold"
          onMouseDown={(event) => event.preventDefault()}
          onPress={withPreservedSelection(() => toggleMark(editor, "bold"))}
        >
          <FormatBold />
          <VisuallyHidden>Bold (Cmd+B)</VisuallyHidden>
        </IconToggleButton>
        <IconToggleButton
          id="italic"
          size={buttonSize}
          variant="ghost"
          aria-label="Italic"
          onMouseDown={(event) => event.preventDefault()}
          onPress={withPreservedSelection(() => toggleMark(editor, "italic"))}
        >
          <FormatItalic />
          <VisuallyHidden>Italic (Cmd+I)</VisuallyHidden>
        </IconToggleButton>
        <IconToggleButton
          id="underline"
          size={buttonSize}
          variant="ghost"
          aria-label="Underline"
          onMouseDown={(event) => event.preventDefault()}
          onPress={withPreservedSelection(() =>
            toggleMark(editor, "underline")
          )}
        >
          <FormatUnderlined />
          <VisuallyHidden>Underline (Cmd+U)</VisuallyHidden>
        </IconToggleButton>
      </ToggleButtonGroup.Root>

      {/* Formatting Menu for additional options */}
      <FormattingMenu isDisabled={isDisabled} />

      <Divider orientation="vertical" />

      {/* Lists & Indentation */}
      <ToggleButtonGroup.Root
        selectionMode="single"
        selectedKeys={selectedListKeys}
        onSelectionChange={handleListToggle}
        aria-label="List formatting"
      >
        <IconToggleButton
          id="bulleted-list"
          size={buttonSize}
          variant="ghost"
          aria-label="Bulleted List"
          onMouseDown={(event) => event.preventDefault()}
        >
          <FormatListBulleted />
        </IconToggleButton>
        <IconToggleButton
          id="numbered-list"
          size={buttonSize}
          variant="ghost"
          aria-label="Numbered List"
          onMouseDown={(event) => event.preventDefault()}
        >
          <FormatListNumbered />
        </IconToggleButton>
      </ToggleButtonGroup.Root>

      {/* Spacer to push undo/redo buttons to the right */}
      <Box flexGrow="1" />

      <Group>
        <IconButton
          size="xs"
          variant="ghost"
          aria-label="Undo"
          isDisabled={!hasUndos || isDisabled}
          onPress={withPreservedSelection(() => editor.undo())}
          onMouseDown={(event) => event.preventDefault()}
        >
          <Undo />
          <VisuallyHidden>Undo (Cmd+Z)</VisuallyHidden>
        </IconButton>
        <IconButton
          size="xs"
          variant="ghost"
          aria-label="Redo"
          isDisabled={!hasRedos || isDisabled}
          onPress={withPreservedSelection(() => editor.redo())}
          onMouseDown={(event) => event.preventDefault()}
        >
          <Redo />
          <VisuallyHidden>Redo (Cmd+Shift+Z)</VisuallyHidden>
        </IconButton>
      </Group>
    </Toolbar>
  );
};

RichTextToolbar.displayName = "RichTextToolbar";
