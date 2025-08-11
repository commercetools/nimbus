import { Flex, Text, TimeInput } from "@/components";
import { useContext, useRef, useEffect } from "react";
import { useLocale } from "react-aria";
import { DatePickerStateContext } from "react-aria-components";
import type { DatePickerTimeInputProps } from "../date-picker.types";

export const DatePickerTimeInput = ({
  hideTimeZone,
  hourCycle,
}: DatePickerTimeInputProps) => {
  const { locale } = useLocale();
  const datePickerState = useContext(DatePickerStateContext);
  const { granularity, dateValue } = datePickerState!;
  const timeInputRef = useRef<HTMLDivElement>(null);
  const previousDateRef = useRef(dateValue);

  // do not show up to the party if you're not invited
  if (granularity === "day") {
    return null;
  }

  // Focus the time input when date changes (user selects a date from calendar)
  useEffect(() => {
    // Check if date changed
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

    previousDateRef.current = dateValue;
  }, [dateValue]);

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
      {/* TODO: translate hardcoded string */}
      <Text textStyle="xs" fontWeight="500" color="neutral.12">
        Start time
      </Text>
      <TimeInput
        slot="timeInput"
        locale={locale}
        variant="ghost"
        size="sm"
        hideTimeZone={hideTimeZone}
        hourCycle={hourCycle}
      />
    </Flex>
  );
};
