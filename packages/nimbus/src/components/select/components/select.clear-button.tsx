import { useContext } from "react";
import { Close as CloseIcon } from "@commercetools/nimbus-icons";
import { IconButton } from "@/components";
import { SelectStateContext } from "react-aria-components";
import { ClearPressResponder } from "@react-aria/interactions";
import messages from "../select.i18n";
import { useIntl } from "react-intl";

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
        slot={null}
        pointerEvents="all"
        size="2xs"
        variant="ghost"
        aria-label={intl.formatMessage(messages.clearSelection)}
        aria-labelledby=""
        onPress={onPressRequest}
        slot={null}
      >
        <CloseIcon />
      </IconButton>
    </ClearPressResponder>
  );
};

SelectClearButton.displayName = "Select.ClearButton";
