import { useContext } from "react";
import { Close as CloseIcon } from "@commercetools/nimbus-icons";
import { ComboBoxStateContext } from "react-aria-components";
import { IconButton } from "@/components";

export const ComboBoxTrigger = () => {
  const state = useContext(ComboBoxStateContext);

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
      onPress={onPressRequest}
    >
      <CloseIcon />
    </IconButton>
  );
};

ComboBoxTrigger.displayName = "ComboBox.Trigger";
