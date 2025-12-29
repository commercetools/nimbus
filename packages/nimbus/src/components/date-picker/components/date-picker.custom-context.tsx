import { useContext } from "react";
import {
  Provider,
  ButtonContext,
  DatePickerStateContext,
  TimeFieldContext,
  useSlottedContext,
} from "react-aria-components";
import type { PressEvent, TimeValue } from "react-aria";
import { datePickerMessages } from "../date-picker.messages";
import { useLocale } from "react-aria-components";

/**
 * DatePickerCustomContext - Custom context provider for DatePicker
 *
 * Provides React Aria context overrides for button and time input slots,
 * enabling coordinated behavior between DatePicker parts.
 */
export const DatePickerCustomContext = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { locale } = useLocale();
  const buttonContext = useSlottedContext(ButtonContext) || {};
  const datePickerState = useContext(DatePickerStateContext);
  const noInputValue = datePickerState?.dateValue === null;

  const { timeValue, setTimeValue, granularity } = datePickerState!;

  // Try to get disabled state from the button context
  const isDatePickerDisabled = buttonContext?.isDisabled;

  // Generate default aria-label based on granularity if not provided
  const getDefaultTimeInputAriaLabel = () => {
    switch (granularity) {
      case "hour":
        return datePickerMessages.getStringForLocale(
          "Time.enterTimeHour",
          locale
        );
      case "minute":
        return datePickerMessages.getStringForLocale(
          "Time.enterTimeHourMinute",
          locale
        );
      case "second":
        return datePickerMessages.getStringForLocale(
          "Time.enterTimeHourMinuteSecond",
          locale
        );
      default:
        return datePickerMessages.getStringForLocale("Time.enterTime", locale);
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
    /** Clear button that displays when there's a value in each segment - hidden from both visual and screen readers when there's no value */
    clear: {
      onPress: () => datePickerState?.setValue(null),
      "aria-label": datePickerMessages.getStringForLocale("clearInput", locale),
      isDisabled: isDatePickerDisabled,
      // Hide the button when there's no value
      style: noInputValue ? { display: "none" } : undefined,
      "aria-hidden": noInputValue ? true : undefined,
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
