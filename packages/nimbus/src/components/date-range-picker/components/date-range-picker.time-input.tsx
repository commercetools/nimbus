import { Flex, Text, TimeInput } from "@/components";
import { useContext, useRef, useEffect } from "react";
import { useLocale } from "react-aria";
import { DateRangePickerStateContext } from "react-aria-components";
import type { DateRangePickerTimeInputProps } from "../date-range-picker.types";

export const DateRangePickerTimeInput = ({
  hideTimeZone,
  hourCycle,
}: DateRangePickerTimeInputProps) => {
  const { locale } = useLocale();
  const dateRangePickerState = useContext(DateRangePickerStateContext);
  const { granularity, value } = dateRangePickerState!;
  const timeInputRef = useRef<HTMLDivElement>(null);
  const previousValueRef = useRef(value);

  // do not show up to the party if you're not invited
  if (granularity === "day") {
    return null;
  }

  // DateRangePicker-specific: Focus the time input when date range changes (user selects dates from calendar)
  useEffect(() => {
    // DateRangePicker-specific: Check if date range changed by comparing start and end dates
    const hasValueChanged =
      (value?.start &&
        previousValueRef.current?.start?.compare(value.start) !== 0) ||
      (value?.end && previousValueRef.current?.end?.compare(value.end) !== 0);

    if (hasValueChanged) {
      // Only auto-focus if no time input segment currently has focus
      // This prevents stealing focus during user interaction with time segments
      const container = timeInputRef.current;
      const activeElement = document.activeElement;
      const hasTimeSegmentFocus =
        container?.contains(activeElement) &&
        activeElement?.getAttribute("role") === "spinbutton";

      if (!hasTimeSegmentFocus) {
        // Small delay to ensure the DOM is ready
        setTimeout(() => {
          // Find the first focusable segment within the time input container
          if (container) {
            const firstSegment = container.querySelector(
              '[role="spinbutton"]'
            ) as HTMLElement;

            if (firstSegment) {
              firstSegment.focus();
            }
          }
        }, 50);
      }
    }

    // DateRangePicker-specific: Update previous value reference for range comparison
    previousValueRef.current = value;
  }, [value]);

  return (
    <Flex
      ref={timeInputRef}
      borderTop="solid-25"
      borderColor="neutral.3"
      py="300"
      px="400"
      alignItems="center"
      justifyContent="center"
      gap="200"
    >
      {/* DateRangePicker-specific: Start DateInput with separate label */}
      <Flex alignItems="center" gap="200">
        {/* TODO: translate hardcoded string */}
        <Text
          textStyle="xs"
          fontWeight="500"
          color="neutral.12"
          minWidth="fit-content"
        >
          Start time
        </Text>
        <TimeInput
          slot="startTimeInput"
          locale={locale}
          variant="ghost"
          size="sm"
          hideTimeZone={hideTimeZone}
          hourCycle={hourCycle}
        />
      </Flex>

      {/* DateRangePicker-specific: End DateInput with separate label */}
      <Flex alignItems="center" gap="200">
        {/* TODO: translate hardcoded string */}
        <Text
          textStyle="xs"
          fontWeight="500"
          color="neutral.12"
          minWidth="fit-content"
        >
          End time
        </Text>
        <TimeInput
          slot="endTimeInput"
          locale={locale}
          variant="ghost"
          size="sm"
          hideTimeZone={hideTimeZone}
          hourCycle={hourCycle}
        />
      </Flex>
    </Flex>
  );
};
