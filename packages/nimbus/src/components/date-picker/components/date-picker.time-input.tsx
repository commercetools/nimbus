import { Flex, Text, TimeInput } from "@/components";
import { useContext } from "react";
import { useLocale } from "react-aria";
import { DatePickerStateContext } from "react-aria-components";

export const DatePickerTimeInput = () => {
  const { locale } = useLocale();
  const datePickerState = useContext(DatePickerStateContext);
  const { granularity } = datePickerState!;

  // do not show up to the party if you're not invited
  if (granularity === "day") {
    return null;
  }

  return (
    <Flex
      borderTop="1px solid"
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
