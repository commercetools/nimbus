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

// TODO: pass isLoading and onClear as props

export const ComboBoxButtonGroup = ({
  selectedKeys,
  onSelectionChange,
  onInputChange,
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
          aria-expanded={false}
          onPress={() => state?.setSelectedKey(null)}
          my="auto"
          aria-hidden={true}
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
          aria-expanded={false}
          onPress={() => {
            onSelectionChange?.(new Set());
            onInputChange?.("");
          }}
          my="auto"
          aria-hidden={true}
        >
          <CloseIcon />
        </IconButton>
      )}
      <Flex my="auto" w="600" h="600" pointerEvents="none">
        <Box color="neutral.9" asChild m="auto" w="400" h="400">
          {isLoading ? (
            <Box asChild animation="spin" animationDuration="slowest">
              <SpinnerIcon />
            </Box>
          ) : (
            <KeyboardArrowDownIcon />
          )}
        </Box>
      </Flex>
    </ComboBoxButtonGroupSlot>
  );
};
