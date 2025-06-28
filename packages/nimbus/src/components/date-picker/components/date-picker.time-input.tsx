import { Flex, Text, TimeInput } from "@/components";
import { useContext, useRef, useEffect } from "react";
import { useLocale } from "react-aria";
import { DatePickerStateContext } from "react-aria-components";

export const DatePickerTimeInput = () => {
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
      // Small delay to ensure the DOM is ready
      setTimeout(() => {
        // Find the first focusable segment within the time input container
        const container = timeInputRef.current;
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
      <Text
        slot="startTime"
        textStyle="xs"
        fontWeight="500"
        color="neutral.12"
      />

      <TimeInput slot="timeInput" locale={locale} variant="ghost" size="sm" />
    </Flex>
  );
};
