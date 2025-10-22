import { useSlate } from "slate-react";
import { useIntl } from "react-intl";
import {
  Toolbar,
  Menu,
  VisuallyHidden,
  Separator,
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
import { getTextStyles } from "../constants";
import { FormattingMenu } from "./formatting-menu";
import { messages } from "../rich-text-input.i18n";

export type RichTextToolbarProps = {
  isDisabled?: boolean;
};

export const RichTextToolbar = ({
  isDisabled = false,
}: RichTextToolbarProps) => {
  const intl = useIntl();
  const editor = useSlate();
  const withPreservedSelection = usePreservedSelection(editor);

  // Get localized text styles
  const textStyles = getTextStyles(intl);

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
      aria-label={intl.formatMessage(messages.textFormatting)}
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
              aria-label={intl.formatMessage(messages.textStyleMenu)}
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
              {intl.formatMessage(messages.textStyle)}
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
            aria-label={intl.formatMessage(messages.bold)}
            isDisabled={isDisabled}
            onMouseDown={(event) => event.preventDefault()}
            onPress={withPreservedSelection(() => toggleMark(editor, "bold"))}
          >
            <FormatBold />
            <VisuallyHidden>{intl.formatMessage(messages.bold)}</VisuallyHidden>
          </IconToggleButton>
          <Tooltip.Content placement="top">
            {intl.formatMessage(messages.bold)}
          </Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root delay={0} closeDelay={0}>
          <IconToggleButton
            id="italic"
            size="xs"
            variant="ghost"
            aria-label={intl.formatMessage(messages.italic)}
            isDisabled={isDisabled}
            onMouseDown={(event) => event.preventDefault()}
            onPress={withPreservedSelection(() => toggleMark(editor, "italic"))}
          >
            <FormatItalic />
            <VisuallyHidden>
              {intl.formatMessage(messages.italic)}
            </VisuallyHidden>
          </IconToggleButton>
          <Tooltip.Content placement="top">
            {intl.formatMessage(messages.italic)}
          </Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root delay={0} closeDelay={0}>
          <IconToggleButton
            id="underline"
            size="xs"
            variant="ghost"
            aria-label={intl.formatMessage(messages.underline)}
            isDisabled={isDisabled}
            onMouseDown={(event) => event.preventDefault()}
            onPress={withPreservedSelection(() =>
              toggleMark(editor, "underline")
            )}
          >
            <FormatUnderlined />
            <VisuallyHidden>
              {intl.formatMessage(messages.underline)}
            </VisuallyHidden>
          </IconToggleButton>
          <Tooltip.Content placement="top">
            {intl.formatMessage(messages.underline)}
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
        aria-label={intl.formatMessage(messages.listFormatting)}
        isDisabled={isDisabled}
      >
        <Tooltip.Root delay={0} closeDelay={0}>
          <IconToggleButton
            id="bulleted-list"
            size="xs"
            variant="ghost"
            aria-label={intl.formatMessage(messages.bulletedList)}
            isDisabled={isDisabled}
            onMouseDown={(event) => event.preventDefault()}
          >
            <FormatListBulleted />
          </IconToggleButton>
          <Tooltip.Content placement="top">
            {intl.formatMessage(messages.bulletedList)}
          </Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root delay={0} closeDelay={0}>
          <IconToggleButton
            id="numbered-list"
            size="xs"
            variant="ghost"
            aria-label={intl.formatMessage(messages.numberedList)}
            isDisabled={isDisabled}
            onMouseDown={(event) => event.preventDefault()}
          >
            <FormatListNumbered />
          </IconToggleButton>
          <Tooltip.Content placement="top">
            {intl.formatMessage(messages.numberedList)}
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
            aria-label={intl.formatMessage(messages.undo)}
            isDisabled={!hasUndos || isDisabled}
            onPress={withPreservedSelection(() => editor.undo())}
            onMouseDown={(event) => event.preventDefault()}
          >
            <Undo />
            <VisuallyHidden>{intl.formatMessage(messages.undo)}</VisuallyHidden>
          </IconButton>
          <Tooltip.Content placement="top">
            {intl.formatMessage(messages.undo)}
          </Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root delay={0} closeDelay={0}>
          <IconButton
            size="xs"
            variant="ghost"
            aria-label={intl.formatMessage(messages.redo)}
            isDisabled={!hasRedos || isDisabled}
            onPress={withPreservedSelection(() => editor.redo())}
            onMouseDown={(event) => event.preventDefault()}
          >
            <Redo />
            <VisuallyHidden>{intl.formatMessage(messages.redo)}</VisuallyHidden>
          </IconButton>
          <Tooltip.Content placement="top">
            {intl.formatMessage(messages.redo)}
          </Tooltip.Content>
        </Tooltip.Root>
      </Group>
    </Toolbar>
  );
};

RichTextToolbar.displayName = "RichTextToolbar";
