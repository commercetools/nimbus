import { useContext } from "react";
import { Close as CloseIcon } from "@commercetools/nimbus-icons";
import { IconButton } from "@/components";
import { SelectStateContext } from "react-aria-components";
import { ClearPressResponder } from "@react-aria/interactions";
import { useLocalizedStringFormatter } from "@/hooks";
import { selectMessagesStrings } from "../select.messages";

/**
 * Select.ClearButton - Internal button component for clearing selected values
 *
 * @supportsStyleProps
 */
export const SelectClearButton = () => {
  const msg = useLocalizedStringFormatter(selectMessagesStrings);
  const state = useContext(SelectStateContext);
  if (!state?.selectedKey) {
    return null;
  }

  const onPressRequest = () => {
    state?.setSelectedKey(null);
  };

  return (
    <ClearPressResponder>
      <IconButton
        slot={null}
        pointerEvents="all"
        size="2xs"
        variant="ghost"
        aria-label={msg.format("clearSelection")}
        aria-labelledby=""
        onPress={onPressRequest}
      >
        <CloseIcon />
      </IconButton>
    </ClearPressResponder>
  );
};

SelectClearButton.displayName = "Select.ClearButton";
