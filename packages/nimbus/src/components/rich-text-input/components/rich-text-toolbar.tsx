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
import { richTextInputMessages } from "../rich-text-input.messages";
import { useLocale } from "react-aria-components";

export type RichTextToolbarProps = {
  isDisabled?: boolean;
};

export const RichTextToolbar = ({
  isDisabled = false,
}: RichTextToolbarProps) => {
  const { locale } = useLocale();
  const editor = useSlate();
  const withPreservedSelection = usePreservedSelection(editor);

  // Get localized text styles
  const textStyles = getTextStyles(locale);

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
      aria-label={richTextInputMessages.getStringLocale(
        "textFormatting",
        locale
      )}
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
              aria-label={richTextInputMessages.getStringLocale(
                "textStyleMenu",
                locale
              )}
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
              {richTextInputMessages.getStringLocale("textStyle", locale)}
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
            aria-label={richTextInputMessages.getStringLocale("bold", locale)}
            isDisabled={isDisabled}
            onMouseDown={(event) => event.preventDefault()}
            onPress={withPreservedSelection(() => toggleMark(editor, "bold"))}
          >
            <FormatBold />
            <VisuallyHidden>
              {richTextInputMessages.getStringLocale("bold", locale)}
            </VisuallyHidden>
          </IconToggleButton>
          <Tooltip.Content placement="top">
            {richTextInputMessages.getStringLocale("bold", locale)}
          </Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root delay={0} closeDelay={0}>
          <IconToggleButton
            id="italic"
            size="xs"
            variant="ghost"
            aria-label={richTextInputMessages.getStringLocale("italic", locale)}
            isDisabled={isDisabled}
            onMouseDown={(event) => event.preventDefault()}
            onPress={withPreservedSelection(() => toggleMark(editor, "italic"))}
          >
            <FormatItalic />
            <VisuallyHidden>
              {richTextInputMessages.getStringLocale("italic", locale)}
            </VisuallyHidden>
          </IconToggleButton>
          <Tooltip.Content placement="top">
            {richTextInputMessages.getStringLocale("italic", locale)}
          </Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root delay={0} closeDelay={0}>
          <IconToggleButton
            id="underline"
            size="xs"
            variant="ghost"
            aria-label={richTextInputMessages.getStringLocale(
              "underline",
              locale
            )}
            isDisabled={isDisabled}
            onMouseDown={(event) => event.preventDefault()}
            onPress={withPreservedSelection(() =>
              toggleMark(editor, "underline")
            )}
          >
            <FormatUnderlined />
            <VisuallyHidden>
              {richTextInputMessages.getStringLocale("underline", locale)}
            </VisuallyHidden>
          </IconToggleButton>
          <Tooltip.Content placement="top">
            {richTextInputMessages.getStringLocale("underline", locale)}
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
        aria-label={richTextInputMessages.getStringLocale(
          "listFormatting",
          locale
        )}
        isDisabled={isDisabled}
      >
        <Tooltip.Root delay={0} closeDelay={0}>
          <IconToggleButton
            id="bulleted-list"
            size="xs"
            variant="ghost"
            aria-label={richTextInputMessages.getStringLocale(
              "bulletedList",
              locale
            )}
            isDisabled={isDisabled}
            onMouseDown={(event) => event.preventDefault()}
          >
            <FormatListBulleted />
          </IconToggleButton>
          <Tooltip.Content placement="top">
            {richTextInputMessages.getStringLocale("bulletedList", locale)}
          </Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root delay={0} closeDelay={0}>
          <IconToggleButton
            id="numbered-list"
            size="xs"
            variant="ghost"
            aria-label={richTextInputMessages.getStringLocale(
              "numberedList",
              locale
            )}
            isDisabled={isDisabled}
            onMouseDown={(event) => event.preventDefault()}
          >
            <FormatListNumbered />
          </IconToggleButton>
          <Tooltip.Content placement="top">
            {richTextInputMessages.getStringLocale("numberedList", locale)}
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
            aria-label={richTextInputMessages.getStringLocale("undo", locale)}
            isDisabled={!hasUndos || isDisabled}
            onPress={withPreservedSelection(() => editor.undo())}
            onMouseDown={(event) => event.preventDefault()}
          >
            <Undo />
            <VisuallyHidden>
              {richTextInputMessages.getStringLocale("undo", locale)}
            </VisuallyHidden>
          </IconButton>
          <Tooltip.Content placement="top">
            {richTextInputMessages.getStringLocale("undo", locale)}
          </Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root delay={0} closeDelay={0}>
          <IconButton
            size="xs"
            variant="ghost"
            aria-label={richTextInputMessages.getStringLocale("redo", locale)}
            isDisabled={!hasRedos || isDisabled}
            onPress={withPreservedSelection(() => editor.redo())}
            onMouseDown={(event) => event.preventDefault()}
          >
            <Redo />
            <VisuallyHidden>
              {richTextInputMessages.getStringLocale("redo", locale)}
            </VisuallyHidden>
          </IconButton>
          <Tooltip.Content placement="top">
            {richTextInputMessages.getStringLocale("redo", locale)}
          </Tooltip.Content>
        </Tooltip.Root>
      </Group>
    </Toolbar>
  );
};

RichTextToolbar.displayName = "RichTextToolbar";
