import { useCallback, useMemo } from "react";
import { useSlate } from "slate-react";
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
  FormatStrikethrough,
  Code,
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
import { Editor } from "slate";
import type { CustomElement } from "./rich-text-utils/types";

type BlockType = CustomElement["type"];

export interface RichTextToolbarProps {
  isDisabled?: boolean;
  className?: string;
  size?: "xs" | "md";
}

export const RichTextToolbar = (props: RichTextToolbarProps) => {
  const { isDisabled = false, className, size = "xs" } = props;
  const editor = useSlate();

  // Map size to proper IconToggleButton sizes
  const buttonSize = size === "md" ? "md" : "xs";

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

  // Get current block type
  const currentTextStyle = useMemo(() => {
    if (isBlockActive(editor, "heading-one")) return "heading-one";
    if (isBlockActive(editor, "heading-two")) return "heading-two";
    if (isBlockActive(editor, "heading-three")) return "heading-three";
    if (isBlockActive(editor, "heading-four")) return "heading-four";
    if (isBlockActive(editor, "heading-five")) return "heading-five";
    if (isBlockActive(editor, "block-quote")) return "block-quote";
    return "paragraph";
  }, [editor, editor.selection, editor.children]);

  const selectedTextStyle = textStyles.find((v) => v.id === currentTextStyle);
  const selectedTextStyleProps = selectedTextStyle?.props || {};
  const selectedTextStyleLabel = selectedTextStyle?.label || "";

  // Handle text style changes
  const handleTextStyleChange = useCallback(
    (styleId: string) => {
      toggleBlock(editor, styleId as BlockType);
    },
    [editor]
  );

  // Handle list formatting
  const handleListToggle = useCallback(
    (selectedKeys: Set<Key>) => {
      const selected = Array.from(selectedKeys)[0] as BlockType | undefined;
      const currentlyActive = isBlockActive(editor, "bulleted-list")
        ? "bulleted-list"
        : isBlockActive(editor, "numbered-list")
          ? "numbered-list"
          : null;

      if (selected) {
        // Always toggle the selected list type
        // If it's the same as currently active, it will deactivate
        // If it's different, it will switch to the new type
        toggleBlock(editor, selected);
      } else if (currentlyActive) {
        // If no selection but there's an active list, toggle it off
        toggleBlock(editor, currentlyActive);
      }
    },
    [editor]
  );

  // Get currently selected formatting keys
  const selectedFormatKeys = useMemo(() => {
    const keys: string[] = [];
    if (isMarkActive(editor, "bold")) keys.push("bold");
    if (isMarkActive(editor, "italic")) keys.push("italic");
    if (isMarkActive(editor, "underline")) keys.push("underline");
    if (isMarkActive(editor, "strikethrough")) keys.push("strikethrough");
    if (isMarkActive(editor, "code")) keys.push("code");
    return new Set(keys);
  }, [editor, editor.selection, editor.children, Editor.marks(editor)]);

  // Get currently selected advanced formatting keys
  const selectedAdvancedFormatKeys = useMemo(() => {
    const keys: string[] = [];
    if (isMarkActive(editor, "superscript")) keys.push("superscript");
    if (isMarkActive(editor, "subscript")) keys.push("subscript");
    return new Set(keys);
  }, [editor, editor.selection, editor.children, Editor.marks(editor)]);

  // Get currently selected list formatting key
  const selectedListKeys = useMemo(() => {
    const keys: string[] = [];
    if (isBlockActive(editor, "bulleted-list")) keys.push("bulleted-list");
    if (isBlockActive(editor, "numbered-list")) keys.push("numbered-list");
    return new Set(keys);
  }, [editor, editor.selection, editor.children]);

  // Check history state for undo/redo buttons
  // cSpell:ignore undos
  const hasUndos = useMemo(() => {
    return editor.history && editor.history.undos.length > 0;
  }, [editor, editor.selection, editor.children]);

  const hasRedos = useMemo(() => {
    return editor.history && editor.history.redos.length > 0;
  }, [editor, editor.selection, editor.children]);

  if (isDisabled) {
    return null;
  }

  return (
    <Toolbar
      className={className}
      orientation="horizontal"
      aria-label="Text formatting"
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
          onPress={() => toggleMark(editor, "bold")}
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
          onPress={() => toggleMark(editor, "italic")}
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
          onPress={() => toggleMark(editor, "underline")}
        >
          <FormatUnderlined />
          <VisuallyHidden>Underline (Cmd+U)</VisuallyHidden>
        </IconToggleButton>
        <IconToggleButton
          id="strikethrough"
          size={buttonSize}
          variant="ghost"
          aria-label="Strikethrough"
          onMouseDown={(event) => event.preventDefault()}
          onPress={() => toggleMark(editor, "strikethrough")}
        >
          <FormatStrikethrough />
          <VisuallyHidden>Strikethrough</VisuallyHidden>
        </IconToggleButton>
        <IconToggleButton
          id="code"
          size={buttonSize}
          variant="ghost"
          aria-label="Code"
          onMouseDown={(event) => event.preventDefault()}
          onPress={() => toggleMark(editor, "code")}
        >
          <Code />
          <VisuallyHidden>Code (Cmd+`)</VisuallyHidden>
        </IconToggleButton>
      </ToggleButtonGroup.Root>

      <Divider orientation="vertical" />

      {/* Advanced Formatting Toggles */}
      <ToggleButtonGroup.Root
        selectionMode="multiple"
        selectedKeys={selectedAdvancedFormatKeys}
      >
        <IconToggleButton
          id="superscript"
          size={buttonSize}
          variant="ghost"
          aria-label="Superscript"
          onMouseDown={(event) => event.preventDefault()}
          onPress={() => toggleMark(editor, "superscript")}
        >
          <span style={{ fontSize: "0.75em", verticalAlign: "super" }}>X²</span>
          <VisuallyHidden>Superscript</VisuallyHidden>
        </IconToggleButton>
        <IconToggleButton
          id="subscript"
          size={buttonSize}
          variant="ghost"
          aria-label="Subscript"
          onMouseDown={(event) => event.preventDefault()}
          onPress={() => toggleMark(editor, "subscript")}
        >
          <span style={{ fontSize: "0.75em", verticalAlign: "sub" }}>X₂</span>
          <VisuallyHidden>Subscript</VisuallyHidden>
        </IconToggleButton>
      </ToggleButtonGroup.Root>

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

      <Divider orientation="vertical" />

      <Group>
        <IconButton
          size="xs"
          variant="ghost"
          aria-label="Undo"
          isDisabled={!hasUndos || isDisabled}
          onPress={() => editor.undo()}
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
          onPress={() => editor.redo()}
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
