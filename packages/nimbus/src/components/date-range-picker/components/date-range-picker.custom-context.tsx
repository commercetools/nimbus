import { useContext, type ReactNode } from "react";
import {
  Provider,
  ButtonContext,
  TextContext,
  DateRangePickerStateContext,
  TimeFieldContext,
  useSlottedContext,
} from "react-aria-components";
import type { PressEvent, TimeValue } from "react-aria";

export const DateRangePickerCustomContext = ({
  children,
}: {
  children: ReactNode;
}) => {
  const buttonContext = useSlottedContext(ButtonContext) || {};
  const textContext = useContext(TextContext)!;
  const dateRangePickerState = useContext(DateRangePickerStateContext);

  // DateRangePicker-specific: Check if both start and end values are empty for clear button state
  const noInputValue =
    !dateRangePickerState?.value ||
    (!dateRangePickerState.value.start && !dateRangePickerState.value.end);

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { granularity } = dateRangePickerState!;

  // DateRangePicker-specific: Extract time values from start and end dates separately
  const startTimeValue =
    dateRangePickerState?.value?.start &&
    "hour" in dateRangePickerState.value.start
      ? dateRangePickerState.value.start
      : null;
  const endTimeValue =
    dateRangePickerState?.value?.end && "hour" in dateRangePickerState.value.end
      ? dateRangePickerState.value.end
      : null;

  // Try to get disabled state from the button context
  const isDateRangePickerDisabled = buttonContext?.isDisabled;

  // Generate default aria-label based on granularity if not provided
  const getDefaultTimeInputAriaLabel = (type: "start" | "end") => {
    const prefix = type === "start" ? "Start" : "End";
    switch (granularity) {
      case "hour":
        return `${prefix} time (hour)`;
      case "minute":
        return `${prefix} time (hour and minute)`;
      case "second":
        return `${prefix} time (hour, minute, and second)`;
      default:
        return `${prefix} time`;
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
      // DateRangePicker-specific: Clear both start and end values
      onPress: () => dateRangePickerState?.setValue(null),
      "aria-label": "Clear input value",
      isDisabled: noInputValue || isDateRangePickerDisabled,
    },
  };

  /**
   * Text slots
   * ================================
   */
  const textSlots = {
    // startTime and endTime slots are now provided directly in the popover
  };

  // DateRangePicker-specific: Separate time input slots for start and end times
  const timeInputSlots = {
    startTimeInput: {
      value: startTimeValue,
      onChange: (value: TimeValue | null) => {
        if (value !== null && dateRangePickerState?.value?.start) {
          // DateRangePicker-specific: Update the start date with the new time
          const currentValue = dateRangePickerState.value;
          const startDate = currentValue.start;
          const endDate = currentValue.end;
          if (startDate && endDate) {
            const newStartDate = startDate.set({
              hour: value.hour,
              minute: value.minute || 0,
              second: value.second || 0,
              millisecond: value.millisecond || 0,
            });

            dateRangePickerState.setValue({
              start: newStartDate,
              end: endDate,
            });
          }
        }
      },
      granularity: granularity === "day" ? undefined : granularity,
      "aria-label": getDefaultTimeInputAriaLabel("start"),
    },
    endTimeInput: {
      value: endTimeValue,
      onChange: (value: TimeValue | null) => {
        if (value !== null && dateRangePickerState?.value?.end) {
          // DateRangePicker-specific: Update the end date with the new time
          const currentValue = dateRangePickerState.value;
          const startDate = currentValue.start;
          const endDate = currentValue.end;
          if (startDate && endDate) {
            const newEndDate = endDate.set({
              hour: value.hour,
              minute: value.minute || 0,
              second: value.second || 0,
              millisecond: value.millisecond || 0,
            });

            dateRangePickerState.setValue({
              start: startDate,
              end: newEndDate,
            });
          }
        }
      },
      granularity: granularity === "day" ? undefined : granularity,
      "aria-label": getDefaultTimeInputAriaLabel("end"),
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
        [
          TextContext,
          {
            ...textContext,
            slots: {
              ...(textContext &&
              typeof textContext === "object" &&
              "slots" in textContext
                ? textContext.slots
                : {}),
              ...textSlots,
            },
          },
        ],
        [TimeFieldContext, { slots: timeInputSlots }],
      ]}
    >
      {children}
    </Provider>
  );
};
