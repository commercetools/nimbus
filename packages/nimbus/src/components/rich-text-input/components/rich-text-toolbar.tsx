import { useSlate } from "slate-react";
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
import { toggleMark } from "../utils/slate-helpers";
import { usePreservedSelection } from "../hooks/use-preserved-selection";
import { useToolbarState } from "../hooks/use-toolbar-state";
import { textStyles } from "../constants";
import { FormattingMenu } from "./formatting-menu";

export interface RichTextToolbarProps {
  isDisabled?: boolean;
}

export const RichTextToolbar = ({
  isDisabled = false,
}: RichTextToolbarProps) => {
  const editor = useSlate();
  const withPreservedSelection = usePreservedSelection(editor);

  // Use the toolbar state hook for all state management
  const {
    currentTextStyle,
    selectedTextStyleLabel,
    handleTextStyleChange,
    handleListToggle,
    selectedFormatKeys,
    selectedListKeys,
    hasUndos,
    hasRedos,
  } = useToolbarState({ withPreservedSelection });

  return (
    <Toolbar
      orientation="horizontal"
      aria-label="Text formatting"
      width="full"
      overflow="hidden"
      size="xs"
    >
      {/* Text Style Menu */}
      <Group>
        <Menu.Root
          onAction={(styleId) => handleTextStyleChange(String(styleId))}
        >
          <Tooltip.Root delay={0} closeDelay={0}>
            {/* Menu trigger styles mimic the Select component */}
            <Menu.Trigger
              height="800"
              width="4000"
              bg="primary.1"
              borderRadius="200"
              _hover={{ bg: "primary.2" }}
              isDisabled={isDisabled}
              onMouseDown={(event) => event.preventDefault()}
              aria-label="Text style menu"
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
