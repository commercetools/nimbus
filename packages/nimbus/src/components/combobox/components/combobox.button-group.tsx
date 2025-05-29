import { useContext } from "react";
import {
  Close as CloseIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from "@commercetools/nimbus-icons";
import { IconButton } from "@/components";
import { ComboBoxStateContext } from "react-aria-components";
import { ComboBoxButtonGroupSlot } from "../combobox.slots";
import { type ComboBoxButtonGroupProps } from "../combobox.types";

// TODO: pass isLoading and onClear as props

export const ComboBoxButtonGroup = ({
  selectedKeys,
  onSelectionChange,
  onInputChange,
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
          onPress={() => {
            onSelectionChange?.(new Set());
            onInputChange?.("");
          }}
          my="auto"
        >
          <CloseIcon />
        </IconButton>
      )}
      <IconButton
        size="2xs"
        variant="ghost"
        tone="neutral"
        my="auto"
        aria-label="toggle combobox"
      >
        <KeyboardArrowDownIcon />
      </IconButton>
    </ComboBoxButtonGroupSlot>
  );
};
