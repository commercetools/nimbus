import { Flex, Text, TimeInput } from "@/components";
import { useContext, useRef, useEffect } from "react";
import { DateRangePickerStateContext } from "react-aria-components";
import { useLocalizedStringFormatter } from "@/hooks";
import { dateRangePickerMessagesStrings } from "../date-range-picker.messages";
import type { DateRangePickerTimeInputProps } from "../date-range-picker.types";

export const DateRangePickerTimeInput = ({
  hideTimeZone,
  hourCycle,
}: DateRangePickerTimeInputProps) => {
  const msg = useLocalizedStringFormatter(dateRangePickerMessagesStrings);
  const dateRangePickerState = useContext(DateRangePickerStateContext);
  const { granularity, value } = dateRangePickerState!;
  const timeInputRef = useRef<HTMLDivElement>(null);
  const previousValueRef = useRef(value);

  // Focus the time input when date range changes (user selects dates from calendar)
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    // Check if date range changed by comparing start and end dates
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
        timeoutId = setTimeout(() => {
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

    previousValueRef.current = value;

    // Cleanup timeout on effect re-run or unmount to prevent memory leaks
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [value]);

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
      {/* Start DateInput with separate label */}
      <Flex alignItems="center" gap="200">
        <Text
          textStyle="xs"
          fontWeight="500"
          color="neutral.12"
          minWidth="fit-content"
        >
          {msg.format("startTimeLabel")}
        </Text>
        <TimeInput
          slot="startTimeInput"
          variant="ghost"
          size="sm"
          hideTimeZone={hideTimeZone}
          hourCycle={hourCycle}
        />
      </Flex>

      {/* End DateInput with separate label */}
      <Flex alignItems="center" gap="200">
        <Text
          textStyle="xs"
          fontWeight="500"
          color="neutral.12"
          minWidth="fit-content"
        >
          {msg.format("endTimeLabel")}
        </Text>
        <TimeInput
          slot="endTimeInput"
          variant="ghost"
          size="sm"
          hideTimeZone={hideTimeZone}
          hourCycle={hourCycle}
        />
      </Flex>
    </Flex>
  );
};
