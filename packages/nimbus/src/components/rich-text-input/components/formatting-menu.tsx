import { useSlate } from "slate-react";
import { useIntl } from "react-intl";
import { Menu, IconButton, Text, Box, Tooltip } from "@/components";
import {
  MoreHoriz,
  FormatStrikethrough,
  Code,
} from "@commercetools/nimbus-icons";
import { usePreservedSelection } from "../hooks/use-preserved-selection";
import { useFormattingState } from "../hooks/use-formatting-state";
import { messages } from "../rich-text-input.i18n";

export type FormattingMenuProps = {
  isDisabled?: boolean;
};

export const FormattingMenu = ({ isDisabled = false }: FormattingMenuProps) => {
  const intl = useIntl();
  const editor = useSlate();
  const withPreservedSelection = usePreservedSelection(editor);

  // Use the formatting state hook for all state management
  const { allSelectedKeys, handleAllSelectionChange } = useFormattingState({
    withPreservedSelection,
  });

  return (
    <Menu.Root
      selectionMode="multiple"
      selectedKeys={allSelectedKeys}
      onSelectionChange={handleAllSelectionChange}
    >
      <Tooltip.Root delay={0} closeDelay={0}>
        <Menu.Trigger asChild>
          <IconButton
            size="xs"
            variant="ghost"
            aria-label={intl.formatMessage(messages.moreFormattingOptions)}
            isDisabled={isDisabled}
            onMouseDown={(event) => event.preventDefault()}
          >
            <MoreHoriz />
          </IconButton>
        </Menu.Trigger>
        <Tooltip.Content placement="top">
          {intl.formatMessage(messages.moreStyles)}
        </Tooltip.Content>
      </Tooltip.Root>
      <Menu.Content>
        <Menu.Item id="strikethrough">
          <Box slot="label" display="flex" alignItems="center" gap="200">
            <FormatStrikethrough />
            <Text textStyle="sm">
              {intl.formatMessage(messages.strikethrough)}
            </Text>
          </Box>
        </Menu.Item>
        <Menu.Item id="code">
          <Box slot="label" display="flex" alignItems="center" gap="200">
            <Code />
            <Text textStyle="sm">{intl.formatMessage(messages.code)}</Text>
          </Box>
        </Menu.Item>
        <Menu.Item id="superscript">
          <Box slot="label" display="flex" alignItems="center" gap="200">
            <Text>X²</Text>
            <Text textStyle="sm">
              {intl.formatMessage(messages.superscript)}
            </Text>
          </Box>
        </Menu.Item>
        <Menu.Item id="subscript">
          <Box slot="label" display="flex" alignItems="center" gap="200">
            <Text>X₂</Text>
            <Text textStyle="sm">{intl.formatMessage(messages.subscript)}</Text>
          </Box>
        </Menu.Item>
      </Menu.Content>
    </Menu.Root>
  );
};
