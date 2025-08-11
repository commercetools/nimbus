import { useContext } from "react";
import { useIntl } from "react-intl";
import { Close as CloseIcon } from "@commercetools/nimbus-icons";
import { IconButton } from "@/components";
import { SelectStateContext } from "react-aria-components";
import { ClearPressResponder } from "@react-aria/interactions";

export const SelectClearButton = () => {
  const state = useContext(SelectStateContext);
  const intl = useIntl();

  if (!state?.selectedKey) {
    return null;
  }

  const onPressRequest = () => {
    state?.setSelectedKey(null);
  };

  return (
    <ClearPressResponder>
      <IconButton
        pointerEvents="all"
        size="2xs"
        variant="ghost"
        tone="primary"
        aria-label={intl.formatMessage(messages.clearSelection)}
        onPress={onPressRequest}
      >
        <CloseIcon />
      </IconButton>
    </ClearPressResponder>
  );
};

SelectClearButton.displayName = "Select.ClearButton";
