import { useCallback, type RefObject } from "react";
import { useSlate, ReactEditor } from "slate-react";
import type { Editor as SlateEditor } from "slate";
import {
  Toolbar,
  ToggleButton,
  Menu,
  Button,
  VisuallyHidden,
} from "@/components";
import { Group } from "@/components/group";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatStrikethrough,
  Code,
  Link,
  FormatQuote,
  FormatListBulleted,
  FormatListNumbered,
} from "@commercetools/nimbus-icons";
import {
  isMarkActive,
  isBlockActive,
  toggleMark,
  toggleBlock,
} from "./rich-text-utils/slate-helpers";
import type { FormatType, BlockType } from "./rich-text-utils/types";
import type { RichTextEditorRef } from "./rich-text-editor";

export interface RichTextToolbarProps {
  editorRef?: RefObject<RichTextEditorRef>;
  isDisabled?: boolean;
  className?: string;
}

export const RichTextToolbar = (props: RichTextToolbarProps) => {
  const { editorRef, isDisabled = false, className } = props;
  const editor = useSlate();

  const handleMarkToggle = useCallback(
    (format: FormatType) => {
      toggleMark(editor, format);
    },
    [editor]
  );

  const handleBlockToggle = useCallback(
    (format: BlockType) => {
      toggleBlock(editor, format);
    },
    [editor]
  );

  const handleHeadingSelect = useCallback(
    (heading: BlockType) => {
      toggleBlock(editor, heading);
    },
    [editor]
  );

  if (isDisabled) {
    return null;
  }

  return (
    <Toolbar className={className} orientation="horizontal">
      {/* Text Formatting Group */}
      <Group>
        <ToggleButton
          size="sm"
          isSelected={isMarkActive(editor, "bold")}
          onMouseDown={(event) => {
            // Prevent the button from taking focus away from the editor
            event.preventDefault();
          }}
          onPress={() => {
            handleMarkToggle("bold");
          }}
          aria-label="Bold"
        >
          <FormatBold />
          <VisuallyHidden>Bold (Cmd+B)</VisuallyHidden>
        </ToggleButton>

        <ToggleButton
          size="sm"
          isSelected={isMarkActive(editor, "italic")}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onPress={() => {
            handleMarkToggle("italic");
          }}
          aria-label="Italic"
        >
          <FormatItalic />
          <VisuallyHidden>Italic (Cmd+I)</VisuallyHidden>
        </ToggleButton>

        <ToggleButton
          size="sm"
          isSelected={isMarkActive(editor, "underline")}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onPress={() => {
            handleMarkToggle("underline");
          }}
          aria-label="Underline"
        >
          <FormatUnderlined />
          <VisuallyHidden>Underline (Cmd+U)</VisuallyHidden>
        </ToggleButton>

        <ToggleButton
          size="sm"
          isSelected={isMarkActive(editor, "strikethrough")}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onPress={() => {
            handleMarkToggle("strikethrough");
          }}
          aria-label="Strikethrough"
        >
          <FormatStrikethrough />
          <VisuallyHidden>Strikethrough</VisuallyHidden>
        </ToggleButton>

        <ToggleButton
          size="sm"
          isSelected={isMarkActive(editor, "code")}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onPress={() => {
            handleMarkToggle("code");
          }}
          aria-label="Code"
        >
          <Code />
          <VisuallyHidden>Code (Cmd+`)</VisuallyHidden>
        </ToggleButton>
      </Group>

      {/* Advanced Formatting Group */}
      <Group>
        <ToggleButton
          size="sm"
          isSelected={isMarkActive(editor, "superscript")}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onPress={() => {
            handleMarkToggle("superscript");
          }}
          aria-label="Superscript"
        >
          <span style={{ fontSize: "0.75em", verticalAlign: "super" }}>X²</span>
          <VisuallyHidden>Superscript</VisuallyHidden>
        </ToggleButton>

        <ToggleButton
          size="sm"
          isSelected={isMarkActive(editor, "subscript")}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onPress={() => {
            handleMarkToggle("subscript");
          }}
          aria-label="Subscript"
        >
          <span style={{ fontSize: "0.75em", verticalAlign: "sub" }}>X₂</span>
          <VisuallyHidden>Subscript</VisuallyHidden>
        </ToggleButton>
      </Group>

      {/* Headings Menu */}
      <Group>
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button size="sm" variant="outline">
              Heading
            </Button>
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Item onAction={() => handleHeadingSelect("paragraph")}>
              Normal text
            </Menu.Item>
            <Menu.Separator />
            <Menu.Item onAction={() => handleHeadingSelect("heading-one")}>
              Heading 1
            </Menu.Item>
            <Menu.Item onAction={() => handleHeadingSelect("heading-two")}>
              Heading 2
            </Menu.Item>
            <Menu.Item onAction={() => handleHeadingSelect("heading-three")}>
              Heading 3
            </Menu.Item>
            <Menu.Item onAction={() => handleHeadingSelect("heading-four")}>
              Heading 4
            </Menu.Item>
            <Menu.Item onAction={() => handleHeadingSelect("heading-five")}>
              Heading 5
            </Menu.Item>
          </Menu.Content>
        </Menu.Root>
      </Group>

      {/* Block Formatting Group */}
      <Group>
        <ToggleButton
          size="sm"
          isSelected={isBlockActive(editor, "block-quote")}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onPress={() => {
            handleBlockToggle("block-quote");
          }}
          aria-label="Quote"
        >
          <FormatQuote />
          <VisuallyHidden>Quote</VisuallyHidden>
        </ToggleButton>

        <ToggleButton
          size="sm"
          isSelected={isBlockActive(editor, "bulleted-list")}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onPress={() => {
            handleBlockToggle("bulleted-list");
          }}
          aria-label="Bullet List"
        >
          <FormatListBulleted />
          <VisuallyHidden>Bullet List</VisuallyHidden>
        </ToggleButton>

        <ToggleButton
          size="sm"
          isSelected={isBlockActive(editor, "numbered-list")}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onPress={() => {
            handleBlockToggle("numbered-list");
          }}
          aria-label="Numbered List"
        >
          <FormatListNumbered />
          <VisuallyHidden>Numbered List</VisuallyHidden>
        </ToggleButton>
      </Group>
    </Toolbar>
  );
};

RichTextToolbar.displayName = "RichTextToolbar";
