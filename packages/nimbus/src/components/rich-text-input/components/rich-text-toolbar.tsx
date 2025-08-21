import { useMemo, useCallback } from "react";
import { Editor } from "slate";
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
  Tooltip,
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
  usePreservedSelection,
} from "./rich-text-utils";
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
  const withPreservedSelection = usePreservedSelection(editor);

  // Text style definitions that map to our Slate block types
  const textStyles = [
    {
      id: "paragraph",
      label: "Paragraph",
      props: {
        textStyle: "md",
        fontWeight: "500",
      },
    },
    {
      id: "heading-one",
      label: "Heading 1",
      props: {
        textStyle: "2xl",
        fontWeight: "500",
      },
    },
    {
      id: "heading-two",
      label: "Heading 2",
      props: {
        textStyle: "xl",
        fontWeight: "500",
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
        textStyle: "xs",
        fontWeight: "500",
      },
    },
    {
      id: "block-quote",
      label: "Quote",
      props: {
        textStyle: "md",
        fontWeight: "400",
      },
    },
  ];

  // Get current block type - using useSlate() means this automatically updates
  const currentTextStyle = useMemo(() => {
    const blockTypes = [
      "heading-one",
      "heading-two",
      "heading-three",
      "heading-four",
      "heading-five",
      "block-quote",
    ];
    return (
      blockTypes.find((type) =>
        isBlockActive(editor, type as CustomElement["type"])
      ) || "paragraph"
    );
  }, [editor.selection, editor.children]); // Block types don't need marks

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
  }, [editor.selection, editor.children, Editor.marks(editor)]); // Include marks for pending mark state

  // Get currently selected list formatting key
  const selectedListKeys = useMemo(() => {
    const keys: string[] = [];
    if (isBlockActive(editor, "bulleted-list")) keys.push("bulleted-list");
    if (isBlockActive(editor, "numbered-list")) keys.push("numbered-list");
    return new Set(keys);
  }, [editor.selection, editor.children]); // Block types don't need marks

  // Check history state for undo/redo buttons
  const hasUndos = useMemo(() => {
    return editor.history && editor.history.undos.length > 0;
  }, [editor.selection, editor.children]); // History doesn't need marks

  const hasRedos = useMemo(() => {
    return editor.history && editor.history.redos.length > 0;
  }, [editor.selection, editor.children]); // History doesn't need marks

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
          <Tooltip.Root delay={0} closeDelay={0}>
            <Menu.Trigger
              width="4000"
              aria-label="Text style menu"
              isDisabled={isDisabled}
              onMouseDown={(event) => event.preventDefault()}
            >
              <Box display="flex" alignItems="center" gap="200" px="200">
                <Box display="flex" alignItems="center" gap="200" flexGrow="1">
                  <Text my="auto" textStyle="sm" fontWeight="500">
                    {selectedTextStyleLabel}
                  </Text>
                </Box>
                <KeyboardArrowDown />
              </Box>
            </Menu.Trigger>
            <Tooltip.Content placement="top">Text style</Tooltip.Content>
          </Tooltip.Root>
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
        isDisabled={isDisabled}
      >
        <Tooltip.Root delay={0} closeDelay={0}>
          <IconToggleButton
            id="bold"
            size="xs"
            variant="ghost"
            aria-label="Bold"
            isDisabled={isDisabled}
            onMouseDown={(event) => event.preventDefault()}
            onPress={withPreservedSelection(() => toggleMark(editor, "bold"))}
          >
            <FormatBold />
            <VisuallyHidden>Bold</VisuallyHidden>
          </IconToggleButton>
          <Tooltip.Content placement="top">Bold</Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root delay={0} closeDelay={0}>
          <IconToggleButton
            id="italic"
            size="xs"
            variant="ghost"
            aria-label="Italic"
            isDisabled={isDisabled}
            onMouseDown={(event) => event.preventDefault()}
            onPress={withPreservedSelection(() => toggleMark(editor, "italic"))}
          >
            <FormatItalic />
            <VisuallyHidden>Italic</VisuallyHidden>
          </IconToggleButton>
          <Tooltip.Content placement="top">Italic</Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root delay={0} closeDelay={0}>
          <IconToggleButton
            id="underline"
            size="xs"
            variant="ghost"
            aria-label="Underline"
            isDisabled={isDisabled}
            onMouseDown={(event) => event.preventDefault()}
            onPress={withPreservedSelection(() =>
              toggleMark(editor, "underline")
            )}
          >
            <FormatUnderlined />
            <VisuallyHidden>Underline</VisuallyHidden>
          </IconToggleButton>
          <Tooltip.Content placement="top">Underline</Tooltip.Content>
        </Tooltip.Root>
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
        isDisabled={isDisabled}
      >
        <Tooltip.Root delay={0} closeDelay={0}>
          <IconToggleButton
            id="bulleted-list"
            size="xs"
            variant="ghost"
            aria-label="Bulleted List"
            isDisabled={isDisabled}
            onMouseDown={(event) => event.preventDefault()}
          >
            <FormatListBulleted />
          </IconToggleButton>
          <Tooltip.Content placement="top">Bulleted list</Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root delay={0} closeDelay={0}>
          <IconToggleButton
            id="numbered-list"
            size="xs"
            variant="ghost"
            aria-label="Numbered List"
            isDisabled={isDisabled}
            onMouseDown={(event) => event.preventDefault()}
          >
            <FormatListNumbered />
          </IconToggleButton>
          <Tooltip.Content placement="top">Numbered list</Tooltip.Content>
        </Tooltip.Root>
      </ToggleButtonGroup.Root>

      {/* Spacer to push undo/redo buttons to the right */}
      <Box flexGrow="1" />

      <Group>
        <Tooltip.Root delay={0} closeDelay={0}>
          <IconButton
            size="xs"
            variant="ghost"
            aria-label="Undo"
            isDisabled={!hasUndos || isDisabled}
            onPress={withPreservedSelection(() => editor.undo())}
            onMouseDown={(event) => event.preventDefault()}
          >
            <Undo />
            <VisuallyHidden>Undo</VisuallyHidden>
          </IconButton>
          <Tooltip.Content placement="top">Undo</Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root delay={0} closeDelay={0}>
          <IconButton
            size="xs"
            variant="ghost"
            aria-label="Redo"
            isDisabled={!hasRedos || isDisabled}
            onPress={withPreservedSelection(() => editor.redo())}
            onMouseDown={(event) => event.preventDefault()}
          >
            <Redo />
            <VisuallyHidden>Redo</VisuallyHidden>
          </IconButton>
          <Tooltip.Content placement="top">Redo</Tooltip.Content>
        </Tooltip.Root>
      </Group>
    </Toolbar>
  );
};

RichTextToolbar.displayName = "RichTextToolbar";
