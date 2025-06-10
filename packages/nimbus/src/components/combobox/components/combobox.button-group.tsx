import { useContext } from "react";
import {
  Close as CloseIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Loop as SpinnerIcon,
} from "@commercetools/nimbus-icons";
import { IconButton, Flex, Box } from "@/components";
import { ComboBoxStateContext } from "react-aria-components";
import { ComboBoxButtonGroupSlot } from "../combobox.slots";
import { type ComboBoxButtonGroupProps } from "../combobox.types";

export const ComboBoxButtonGroup = ({
  selectedKeys,
  onSelectionChange,
  onInputChange,
  isDisabled,
  isReadOnly,
  isLoading,
}: ComboBoxButtonGroupProps) => {
  const state = useContext(ComboBoxStateContext);
  return (
    <ComboBoxButtonGroupSlot>
      {state?.selectedKey && (
        <IconButton
          pointerEvents="all"
          slot={null}
          size="2xs"
          variant="ghost"
          tone="primary"
          aria-label="Clear Selection"
          isDisabled={isDisabled || isReadOnly}
          _expanded={{ bg: "primary.1" }}
          onPress={() => state?.setSelectedKey(null)}
          my="auto"
        >
          <CloseIcon />
        </IconButton>
      )}
      {selectedKeys instanceof Set && selectedKeys.size > 0 && (
        <IconButton
          pointerEvents="all"
          slot={null}
          size="2xs"
          variant="ghost"
          tone="primary"
          aria-label="Clear Selection"
          isDisabled={isDisabled || isReadOnly}
          _expanded={{ bg: "primary.1" }}
          onPress={() => {
            onSelectionChange?.(new Set());
            onInputChange?.("");
          }}
          my="auto"
        >
          <CloseIcon />
        </IconButton>
      )}
      {isLoading ? (
        <Flex my="auto" w="600" h="600" pointerEvents="none">
          <Box color="neutral.9" asChild m="auto" w="400" h="400">
            <Box asChild animation="spin" animationDuration="slowest">
              <SpinnerIcon />
            </Box>
          </Box>
        </Flex>
      ) : (
        <IconButton
          size="2xs"
          variant="ghost"
          aria-label="toggle combobox"
          tone="neutral"
          my="auto"
          tabIndex={5}
          isDisabled={isDisabled || isReadOnly}
          _expanded={{ bg: "primary.1" }}
        >
          <KeyboardArrowDownIcon />
        </IconButton>
      )}
    </ComboBoxButtonGroupSlot>
  );
};
