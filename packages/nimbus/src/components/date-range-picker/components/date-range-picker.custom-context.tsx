import { useContext, type ReactNode } from "react";
import {
  Provider,
  ButtonContext,
  DateRangePickerStateContext,
  TimeFieldContext,
  useSlottedContext,
  useLocale,
} from "react-aria-components";
import type { PressEvent, TimeValue } from "react-aria";
import { dateRangePickerMessages } from "../date-range-picker.messages";

export const DateRangePickerCustomContext = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { locale } = useLocale();
  const buttonContext = useSlottedContext(ButtonContext) || {};
  const dateRangePickerState = useContext(DateRangePickerStateContext);

  // Check if all 6 segments (start: day, month, year; end: day, month, year) have values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hasCompleteRangeDate = (date: any) =>
    date?.day && date?.month && date?.year;

  const incompleteValue =
    !dateRangePickerState?.value ||
    !hasCompleteRangeDate(dateRangePickerState.value.start) ||
    !hasCompleteRangeDate(dateRangePickerState.value.end);

  const { granularity } = dateRangePickerState!;

  // Extract time values from start and end dates separately
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
    const messageKey = type === "start" ? "start" : "end";
    switch (granularity) {
      case "hour":
        return dateRangePickerMessages.getStringLocale(
          `${messageKey}TimeHour` as "startTimeHour" | "endTimeHour",
          locale
        );
      case "minute":
        return dateRangePickerMessages.getStringLocale(
          `${messageKey}TimeHourMinute` as
            | "startTimeHourMinute"
            | "endTimeHourMinute",
          locale
        );
      case "second":
        return dateRangePickerMessages.getStringLocale(
          `${messageKey}TimeHourMinuteSecond` as
            | "startTimeHourMinuteSecond"
            | "endTimeHourMinuteSecond",
          locale
        );
      default:
        return dateRangePickerMessages.getStringLocale(
          `${messageKey}Time` as "startTime" | "endTime",
          locale
        );
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
      // Clear both start and end values
      onPress: () => dateRangePickerState?.setValue(null),
      "aria-label": dateRangePickerMessages.getStringLocale(
        "clearInput",
        locale
      ),
      isDisabled: isDateRangePickerDisabled,
      // Hide the button when there's no value
      style: incompleteValue ? { display: "none" } : undefined,
      "aria-hidden": incompleteValue ? true : undefined,
    },
  };

  /**
   * TimeInput slots
   * ================================
   */

  // Separate time input slots for start and end times
  const timeInputSlots = {
    startTimeInput: {
      value: startTimeValue,
      onChange: (value: TimeValue | null) => {
        if (value !== null && dateRangePickerState?.value?.start) {
          // Update the start date with the new time
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
          // Update the end date with the new time
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
        [TimeFieldContext, { slots: timeInputSlots }],
      ]}
    >
      {children}
    </Provider>
  );
};
