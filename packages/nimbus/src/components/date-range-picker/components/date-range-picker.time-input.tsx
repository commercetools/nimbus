import { Flex, Text, TimeInput } from "@/components";
import { useContext, useRef, useEffect } from "react";
import { useLocale } from "react-aria";
import { DateRangePickerStateContext } from "react-aria-components";

export const DateRangePickerTimeInput = () => {
  const { locale } = useLocale();
  const dateRangePickerState = useContext(DateRangePickerStateContext);
  const { granularity, value } = dateRangePickerState!;
  const timeInputRef = useRef<HTMLDivElement>(null);
  const previousValueRef = useRef(value);

  // do not show up to the party if you're not invited
  if (granularity === "day") {
    return null;
  }

  // Focus the time input when date range changes (user selects dates from calendar)
  useEffect(() => {
    // Check if date range changed
    const hasValueChanged =
      (value?.start &&
        previousValueRef.current?.start?.compare(value.start) !== 0) ||
      (value?.end && previousValueRef.current?.end?.compare(value.end) !== 0);

    if (hasValueChanged) {
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
      gap="600"
      direction="column"
    >
      {/* Start DateInput */}
      <Flex alignItems="center" gap="200" width="full">
        <Text
          slot="startTime"
          textStyle="xs"
          fontWeight="500"
          color="neutral.12"
          minWidth="fit-content"
        />
        <TimeInput locale={locale} />
      </Flex>

      {/* End DateInput */}
      <Flex alignItems="center" gap="200" width="full">
        <Text
          slot="endTime"
          textStyle="xs"
          fontWeight="500"
          color="neutral.12"
          minWidth="fit-content"
        />
        <TimeInput locale={locale} />
      </Flex>
    </Flex>
  );
};
