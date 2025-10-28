import { useContext } from "react";
import { useIntl } from "react-intl";
import {
  Close as CloseIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Loop as SpinnerIcon,
} from "@commercetools/nimbus-icons";
import { IconButton, Flex, Box } from "@/components";
import { ComboBoxStateContext } from "react-aria-components";
import { ComboBoxButtonGroupSlot } from "../combobox.slots";
import { type ComboBoxButtonGroupProps } from "../combobox.types";
import { messages } from "../combobox.i18n";

export const ComboBoxSingleSelectButtonGroup = ({
  isDisabled,
  isReadOnly,
  isLoading,
}: ComboBoxButtonGroupProps) => {
  const intl = useIntl();
  const state = useContext(ComboBoxStateContext);
  return (
    <ComboBoxButtonGroupSlot>
      {state?.selectedKey && (
        <IconButton
          pointerEvents="all"
          slot={null}
          size="2xs"
          variant="ghost"
          colorPalette="primary"
          aria-label={intl.formatMessage(messages.clearSelection)}
          isDisabled={isDisabled || isReadOnly}
          _expanded={{ bg: "transparent" }}
          onPress={() => state?.setSelectedKey(null)}
          my="auto"
        >
          <CloseIcon />
        </IconButton>
      )}
      {isLoading ? (
        <Flex my="auto" w="600" h="600">
          <Box color="neutral.11" asChild m="auto" w="400" h="400">
            <Box
              asChild
              animation="spin"
              animationDuration="slowest"
              data-testid="nimbus-combobox-loading"
            >
              <SpinnerIcon />
            </Box>
          </Box>
        </Flex>
      ) : (
        <IconButton
          size="2xs"
          variant="ghost"
          aria-label={intl.formatMessage(messages.toggleCombobox)}
          colorPalette="neutral"
          my="auto"
          isDisabled={isDisabled || isReadOnly}
          _expanded={{ bg: "transparent" }}
        >
          <KeyboardArrowDownIcon />
        </IconButton>
      )}
    </ComboBoxButtonGroupSlot>
  );
};
