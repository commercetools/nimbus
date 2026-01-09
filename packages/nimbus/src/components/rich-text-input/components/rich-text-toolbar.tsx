import { useSlate } from "slate-react";
import {
  Toolbar,
  Menu,
  VisuallyHidden,
  Separator,
  ToggleButtonGroup,
  IconButton,
  Text,
  Box,
  Tooltip,
} from "@/components";
import { IconToggleButton } from "@/components/icon-toggle-button/icon-toggle-button";
import { Group } from "@/components/group/group";
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
import { getTextStyles } from "../constants";
import { FormattingMenu } from "./formatting-menu";
import { useLocalizedStringFormatter } from "@/hooks";
import { richTextInputMessagesStrings } from "../rich-text-input.messages";

export type RichTextToolbarProps = {
  isDisabled?: boolean;
};

export const RichTextToolbar = ({
  isDisabled = false,
}: RichTextToolbarProps) => {
  const msg = useLocalizedStringFormatter(richTextInputMessagesStrings);
  const editor = useSlate();
  const withPreservedSelection = usePreservedSelection(editor);

  // Get localized text styles
  const textStyles = getTextStyles(msg.format);

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
  } = useToolbarState({ withPreservedSelection, textStyles });

  return (
    <Toolbar
      orientation="horizontal"
      aria-label={msg.format("textFormatting")}
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
              aria-label={msg.format("textStyleMenu")}
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
            <Tooltip.Content placement="top">
              {msg.format("textStyle")}
            </Tooltip.Content>
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

      <Separator orientation="vertical" />

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
            aria-label={msg.format("bold")}
            isDisabled={isDisabled}
            onMouseDown={(event) => event.preventDefault()}
            onPress={withPreservedSelection(() => toggleMark(editor, "bold"))}
          >
            <FormatBold />
            <VisuallyHidden>{msg.format("bold")}</VisuallyHidden>
          </IconToggleButton>
          <Tooltip.Content placement="top">
            {msg.format("bold")}
          </Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root delay={0} closeDelay={0}>
          <IconToggleButton
            id="italic"
            size="xs"
            variant="ghost"
            aria-label={msg.format("italic")}
            isDisabled={isDisabled}
            onMouseDown={(event) => event.preventDefault()}
            onPress={withPreservedSelection(() => toggleMark(editor, "italic"))}
          >
            <FormatItalic />
            <VisuallyHidden>{msg.format("italic")}</VisuallyHidden>
          </IconToggleButton>
          <Tooltip.Content placement="top">
            {msg.format("italic")}
          </Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root delay={0} closeDelay={0}>
          <IconToggleButton
            id="underline"
            size="xs"
            variant="ghost"
            aria-label={msg.format("underline")}
            isDisabled={isDisabled}
            onMouseDown={(event) => event.preventDefault()}
            onPress={withPreservedSelection(() =>
              toggleMark(editor, "underline")
            )}
          >
            <FormatUnderlined />
            <VisuallyHidden>{msg.format("underline")}</VisuallyHidden>
          </IconToggleButton>
          <Tooltip.Content placement="top">
            {msg.format("underline")}
          </Tooltip.Content>
        </Tooltip.Root>
      </ToggleButtonGroup.Root>

      {/* Formatting Menu for additional options */}
      <FormattingMenu isDisabled={isDisabled} />

      <Separator orientation="vertical" />

      {/* Lists & Indentation */}
      <ToggleButtonGroup.Root
        selectionMode="single"
        selectedKeys={selectedListKeys}
        onSelectionChange={handleListToggle}
        aria-label={msg.format("listFormatting")}
        isDisabled={isDisabled}
      >
        <Tooltip.Root delay={0} closeDelay={0}>
          <IconToggleButton
            id="bulleted-list"
            size="xs"
            variant="ghost"
            aria-label={msg.format("bulletedList")}
            isDisabled={isDisabled}
            onMouseDown={(event) => event.preventDefault()}
          >
            <FormatListBulleted />
          </IconToggleButton>
          <Tooltip.Content placement="top">
            {msg.format("bulletedList")}
          </Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root delay={0} closeDelay={0}>
          <IconToggleButton
            id="numbered-list"
            size="xs"
            variant="ghost"
            aria-label={msg.format("numberedList")}
            isDisabled={isDisabled}
            onMouseDown={(event) => event.preventDefault()}
          >
            <FormatListNumbered />
          </IconToggleButton>
          <Tooltip.Content placement="top">
            {msg.format("numberedList")}
          </Tooltip.Content>
        </Tooltip.Root>
      </ToggleButtonGroup.Root>

      {/* Spacer to push undo/redo buttons to the right */}
      <Box flexGrow="1" />

      <Group>
        <Tooltip.Root delay={0} closeDelay={0}>
          <IconButton
            size="xs"
            variant="ghost"
            aria-label={msg.format("undo")}
            isDisabled={!hasUndos || isDisabled}
            onPress={withPreservedSelection(() => editor.undo())}
            onMouseDown={(event) => event.preventDefault()}
          >
            <Undo />
            <VisuallyHidden>{msg.format("undo")}</VisuallyHidden>
          </IconButton>
          <Tooltip.Content placement="top">
            {msg.format("undo")}
          </Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root delay={0} closeDelay={0}>
          <IconButton
            size="xs"
            variant="ghost"
            aria-label={msg.format("redo")}
            isDisabled={!hasRedos || isDisabled}
            onPress={withPreservedSelection(() => editor.redo())}
            onMouseDown={(event) => event.preventDefault()}
          >
            <Redo />
            <VisuallyHidden>{msg.format("redo")}</VisuallyHidden>
          </IconButton>
          <Tooltip.Content placement="top">
            {msg.format("redo")}
          </Tooltip.Content>
        </Tooltip.Root>
      </Group>
    </Toolbar>
  );
};

RichTextToolbar.displayName = "RichTextToolbar";
