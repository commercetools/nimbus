import { useContext } from "react";
import { DatePickerStateContext } from "react-aria-components";
import { Close } from "@commercetools/nimbus-icons";
import { IconButton, type IconButtonProps } from "@/components";

/**
 * DatePickerClearButton
 * ============================================================
 * Internal component that provides clear functionality for the DatePicker.
 * Uses the DatePickerStateContext to access the setValue method.
 */
export const DatePickerClearButton = ({
  size,
}: {
  size: IconButtonProps["size"];
}) => {
  const datePickerState = useContext(DatePickerStateContext);

  const handleClear = () => {
    if (datePickerState) {
      datePickerState.setValue(null);
    }
  };

  const noValue = datePickerState?.dateValue === null;

  return (
    <IconButton
      tone={noValue ? "neutral" : "primary"}
      variant="ghost"
      aria-label="Clear input"
      size={size}
      slot={null}
      onPress={handleClear}
      isDisabled={noValue}
    >
      <Close />
    </IconButton>
  );
};
