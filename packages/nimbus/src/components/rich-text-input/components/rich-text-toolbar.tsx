import { useCallback, useMemo, type RefObject } from "react";
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
  FormatQuote,
  FormatListBulleted,
  FormatListNumbered,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
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
import type { CustomElement, CustomText } from "./rich-text-utils/types";

type FormatType = keyof CustomText;
type BlockType = CustomElement["type"];
import type { RichTextEditorRef } from "./rich-text-editor";

export interface RichTextToolbarProps {
  editorRef?: RefObject<RichTextEditorRef>;
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
  }, [editor, editor.selection]);

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

  // Handle formatting toggles
  const handleFormatToggle = useCallback(
    (selectedKeys: Set<Key>) => {
      const formats = Array.from(selectedKeys) as FormatType[];
      const allFormats: FormatType[] = [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "code",
      ];

      allFormats.forEach((format) => {
        const shouldBeActive = formats.includes(format);
        const isCurrentlyActive = isMarkActive(editor, format);

        if (shouldBeActive !== isCurrentlyActive) {
          toggleMark(editor, format);
        }
      });
    },
    [editor]
  );

  // Handle advanced formatting toggles
  const handleAdvancedFormatToggle = useCallback(
    (selectedKeys: Set<Key>) => {
      const formats = Array.from(selectedKeys) as FormatType[];
      const advancedFormats: FormatType[] = ["superscript", "subscript"];

      advancedFormats.forEach((format) => {
        const shouldBeActive = formats.includes(format);
        const isCurrentlyActive = isMarkActive(editor, format);

        if (shouldBeActive !== isCurrentlyActive) {
          toggleMark(editor, format);
        }
      });
    },
    [editor]
  );

  // Handle list formatting
  const handleListToggle = useCallback(
    (selectedKeys: Set<Key>) => {
      const selected = Array.from(selectedKeys)[0] as BlockType | undefined;
      if (selected) {
        toggleBlock(editor, selected);
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
  }, [editor, editor.selection]);

  // Get currently selected advanced formatting keys
  const selectedAdvancedFormatKeys = useMemo(() => {
    const keys: string[] = [];
    if (isMarkActive(editor, "superscript")) keys.push("superscript");
    if (isMarkActive(editor, "subscript")) keys.push("subscript");
    return new Set(keys);
  }, [editor, editor.selection]);

  // Get currently selected list formatting key
  const selectedListKeys = useMemo(() => {
    const keys: string[] = [];
    if (isBlockActive(editor, "bulleted-list")) keys.push("bulleted-list");
    if (isBlockActive(editor, "numbered-list")) keys.push("numbered-list");
    return new Set(keys);
  }, [editor, editor.selection]);

  // Check history state for undo/redo buttons
  const hasUndos = useMemo(() => {
    return editor.history && editor.history.undos.length > 0;
  }, [editor, editor.selection]);

  const hasRedos = useMemo(() => {
    return editor.history && editor.history.redos.length > 0;
  }, [editor, editor.selection]);

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
            borderRadius="200"
            overflow="hidden"
            border="1px solid"
            borderColor="neutral.6"
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
        onSelectionChange={handleFormatToggle}
      >
        <IconToggleButton
          id="bold"
          size={buttonSize}
          variant="ghost"
          aria-label="Bold"
          onMouseDown={(event) => event.preventDefault()}
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
        onSelectionChange={handleAdvancedFormatToggle}
      >
        <IconToggleButton
          id="superscript"
          size={buttonSize}
          variant="ghost"
          aria-label="Superscript"
          onMouseDown={(event) => event.preventDefault()}
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
        >
          <span style={{ fontSize: "0.75em", verticalAlign: "sub" }}>X₂</span>
          <VisuallyHidden>Subscript</VisuallyHidden>
        </IconToggleButton>
      </ToggleButtonGroup.Root>

      <Divider orientation="vertical" />

      {/* Quote Button */}
      <Group>
        <IconButton
          size={buttonSize}
          variant="ghost"
          aria-label="Quote"
          onMouseDown={(event) => event.preventDefault()}
          onPress={() => toggleBlock(editor, "block-quote")}
          bg={
            isBlockActive(editor, "block-quote") ? "neutral.3" : "transparent"
          }
        >
          <FormatQuote />
          <VisuallyHidden>Quote</VisuallyHidden>
        </IconButton>
      </Group>

      <Divider orientation="vertical" />

      {/* Text Alignment Toggle Group */}
      <Group>
        <ToggleButtonGroup.Root
          selectionMode="single"
          defaultSelectedKeys={["left"]}
          aria-label="Text alignment"
        >
          <IconToggleButton
            id="left"
            size={buttonSize}
            variant="ghost"
            aria-label="Align Left"
            onMouseDown={(event) => event.preventDefault()}
          >
            <FormatAlignLeft />
          </IconToggleButton>
          <IconToggleButton
            id="center"
            size={buttonSize}
            variant="ghost"
            aria-label="Align Center"
            onMouseDown={(event) => event.preventDefault()}
          >
            <FormatAlignCenter />
          </IconToggleButton>
          <IconToggleButton
            id="right"
            size={buttonSize}
            variant="ghost"
            aria-label="Align Right"
            onMouseDown={(event) => event.preventDefault()}
          >
            <FormatAlignRight />
          </IconToggleButton>
        </ToggleButtonGroup.Root>
      </Group>

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
