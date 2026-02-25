import { Flex, Text, TimeInput } from "@/components";
import { useContext, useRef, useEffect } from "react";
import { DatePickerStateContext } from "react-aria-components";
import type { DatePickerTimeInputProps } from "../date-picker.types";
import { useLocalizedStringFormatter } from "@/hooks";
import { datePickerMessagesStrings } from "../date-picker.messages";

/**
 * DatePickerTimeInput - Time input component displayed in DatePicker popover footer
 *
 * Only renders when granularity requires time selection (hour, minute, second).
 * Automatically focuses when user selects a date from the calendar.
 *
 * @supportsStyleProps
 */
export const DatePickerTimeInput = ({
  hideTimeZone,
  hourCycle,
}: DatePickerTimeInputProps) => {
  const msg = useLocalizedStringFormatter(datePickerMessagesStrings);
  const datePickerState = useContext(DatePickerStateContext);
  const { granularity, dateValue } = datePickerState!;
  const timeInputRef = useRef<HTMLDivElement>(null);
  const previousDateRef = useRef(dateValue);

  // Focus the time input when date changes (user selects a date from calendar)
  useEffect(() => {
    // Check if date changed
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (dateValue && previousDateRef.current?.compare(dateValue) !== 0) {
      // Only auto-focus if no time input segment currently has focus
      // This prevents stealing focus during user interaction with time segments
      const container = timeInputRef.current;
      const activeElement = document.activeElement;
      const hasTimeSegmentFocus =
        container?.contains(activeElement) &&
        activeElement?.getAttribute("role") === "spinbutton";

      if (!hasTimeSegmentFocus) {
        // Small delay to ensure the DOM is ready
        timeoutId = setTimeout(() => {
          // Find the first focusable segment within the time input container
          if (container) {
            const firstSegment = container.querySelector(
              '[role="spinbutton"]'
            ) as HTMLElement;
            firstSegment?.focus();
          }
        }, 50);
      }
    }

    previousDateRef.current = dateValue;

    // Cleanup timeout on effect re-run or unmount to prevent memory leaks
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [dateValue]);

  // do not show up to the party if you're not invited
  if (granularity === "day") {
    return null;
  }

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
      <Text textStyle="xs" fontWeight="500" color="neutral.12">
        {msg.format("Time.startTime")}
      </Text>
      <TimeInput
        slot="timeInput"
        variant="ghost"
        size="sm"
        hideTimeZone={hideTimeZone}
        hourCycle={hourCycle}
      />
    </Flex>
  );
};
