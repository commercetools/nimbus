import { useContext } from "react";
import { Close as CloseIcon } from "@bleh-ui/icons";
import { IconButton } from "@/components";
import { SelectStateContext } from "react-aria-components";

export const SelectClearButton = () => {
  const state = useContext(SelectStateContext);

  if (!state?.selectedKey) {
    return null;
  }

  const onPressRequest = () => {
    state?.setSelectedKey(null);
  };

  return (
    <IconButton
      pointerEvents="all"
      size="2xs"
      variant="ghost"
      tone="primary"
      aria-label="Clear Selection"
      onPress={onPressRequest}
    >
      <CloseIcon />
    </IconButton>
  );
};

SelectClearButton.displayName = "Select.ClearButton";
