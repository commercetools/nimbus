import { useContext } from "react";
import { DatePickerStateContext } from "react-aria-components";
import { Close } from "@commercetools/nimbus-icons";
import { IconButton } from "@/components";

/**
 * DatePickerClearButton
 * ============================================================
 * Internal component that provides clear functionality for the DatePicker.
 * Uses the DatePickerStateContext to access the setValue method.
 */
export const DatePickerClearButton = ({ size }: { size: "xs" | "2xs" }) => {
  const datePickerState = useContext(DatePickerStateContext);

  const handleClear = () => {
    if (datePickerState) {
      datePickerState.setValue(null);
    }
  };

  return (
    <IconButton
      tone="primary"
      variant="ghost"
      aria-label="Clear input"
      size={size}
      slot={null}
      onPress={handleClear}
    >
      <Close />
    </IconButton>
  );
};
