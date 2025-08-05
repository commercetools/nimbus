import { useContext } from "react";
import { Close as CloseIcon } from "@commercetools/nimbus-icons";
import { IconButton } from "@/components";
import { SelectStateContext } from "react-aria-components";
import { ClearPressResponder } from "@react-aria/interactions";
import { useNimbusIntl } from "@/i18n";

export const SelectClearButton = () => {
  const state = useContext(SelectStateContext);
  const { translate } = useNimbusIntl();

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
        aria-label={translate("select.clearSelection")}
        onPress={onPressRequest}
      >
        <CloseIcon />
      </IconButton>
    </ClearPressResponder>
  );
};

SelectClearButton.displayName = "Select.ClearButton";
