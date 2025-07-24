import { useContext } from "react";
import {
  Provider,
  ButtonContext,
  DatePickerStateContext,
  TimeFieldContext,
  useSlottedContext,
} from "react-aria-components";
import type { PressEvent, TimeValue } from "react-aria";

export const DatePickerCustomContext = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const buttonContext = useSlottedContext(ButtonContext) || {};
  const datePickerState = useContext(DatePickerStateContext);
  const noInputValue = datePickerState?.dateValue === null;

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { timeValue, setTimeValue, granularity } = datePickerState!;

  // Try to get disabled state from the button context
  const isDatePickerDisabled = buttonContext?.isDisabled;

  // Generate default aria-label based on granularity if not provided
  const getDefaultTimeInputAriaLabel = () => {
    switch (granularity) {
      case "hour":
        return "Enter time (hour)";
      case "minute":
        return "Enter time (hour and minute)";
      case "second":
        return "Enter time (hour, minute, and second)";
      default:
        return "Enter time";
    }
  };

  /**
   * Button slots
   * ================================
   */
  const buttonSlots = {
    /** toggles the calendar popover */
    calendarToggle: {
      ...buttonContext,
      onPress: (event: PressEvent) => {
        // Ensure any active input (e.g., date picker segment) loses focus
        // because blurring the input will close the popover if it's open (or was just opened)
        const activeElement = document?.activeElement as HTMLElement | null;

        if (activeElement) {
          activeElement.blur();
        }

        buttonContext.onPress?.(event);
      },
    },
    /** clears the input value */
    clear: {
      onPress: () => datePickerState?.setValue(null),
      "aria-label": "Clear input value",
      isDisabled: noInputValue || isDatePickerDisabled,
    },
  };

  /**
   * TimeInput slots
   * ================================
   */

  const timeInputSlots = {
    timeInput: {
      value: timeValue,
      onChange: (value: TimeValue | null) => {
        if (value !== null) {
          setTimeValue(value);
        }
      },
      granularity: granularity === "day" ? undefined : granularity,
      "aria-label": getDefaultTimeInputAriaLabel(),
    },
  };

  return (
    <Provider
      values={[
        [
          ButtonContext,
          {
            slots: buttonSlots,
          },
        ],
        [TimeFieldContext, { slots: timeInputSlots }],
      ]}
    >
      {children}
    </Provider>
  );
};
