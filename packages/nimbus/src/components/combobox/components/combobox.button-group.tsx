import { useContext } from "react";
import {
  Close as CloseIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from "@commercetools/nimbus-icons";
import { IconButton } from "@/components";
import { ComboBoxStateContext } from "react-aria-components";
import { ComboBoxButtonGroupSlot } from "../combobox.slots";

export const ComboBoxButtonGroup = () => {
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

      <IconButton size="2xs" variant="ghost" tone="neutral" my="auto">
        <KeyboardArrowDownIcon />
      </IconButton>
    </ComboBoxButtonGroupSlot>
  );
};
