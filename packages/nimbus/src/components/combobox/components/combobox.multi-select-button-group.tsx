import { useCallback } from "react";
import {
  Close as CloseIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Loop as SpinnerIcon,
} from "@commercetools/nimbus-icons";
import { ClearPressResponder } from "@react-aria/interactions";
import { IconButton, Flex, Box } from "@/components";
import { ComboBoxButtonGroupSlot } from "../combobox.slots";
import { type ComboBoxButtonGroupProps } from "../combobox.types";

export const ComboBoxButtonGroup = ({
  selectedKeys,
  onSelectionChange,
  onInputChange,
  containerRef,
  isDisabled,
  isReadOnly,
  isLoading,
}: ComboBoxButtonGroupProps) => {
  const handleClearSelection = useCallback(() => {
    onSelectionChange?.(new Set());
    onInputChange?.("");
    if (containerRef?.current) {
      containerRef.current.focus();
    }
  }, []);
  return (
    <ComboBoxButtonGroupSlot>
      {/** Clears PressableContext (instantiated in DialogTrigger context),
       * which was passing the same id's to all buttons in the combobox */}
      <ClearPressResponder>
        {selectedKeys instanceof Set && selectedKeys.size > 0 && (
          <IconButton
            pointerEvents="all"
            slot={null}
            size="2xs"
            variant="ghost"
            tone="primary"
            aria-label="Clear Selection"
            isDisabled={isDisabled || isReadOnly}
            onPress={handleClearSelection}
            my="auto"
          >
            <CloseIcon />
          </IconButton>
        )}
      </ClearPressResponder>

      <Flex
        my="auto"
        w="600"
        h="600"
        color="neutral.11"
        opacity={isReadOnly || isDisabled ? "0.5" : undefined}
        cursor={isReadOnly || isDisabled ? "not-allowed" : undefined}
      >
        <Box pointerEvents="none" asChild m="auto" w="400" h="400">
          {isLoading ? (
            <Box
              asChild
              animation="spin"
              animationDuration="slowest"
              data-testid="nimbus-combobox-loading"
            >
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
