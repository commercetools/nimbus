import { Flex, Text, TimeInput } from "@/components";
import { useContext } from "react";
import { useLocale } from "react-aria";
import { DatePickerStateContext } from "react-aria-components";

export const DatePickerTimeInput = () => {
  const { locale } = useLocale();
  const datePickerState = useContext(DatePickerStateContext);
  const { timeValue, setTimeValue, granularity } = datePickerState;

  // do not show up to the party if you're not required

  console.log("granularity", granularity);

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
      gap="100"
    >
      <Text textStyle="xs" fontWeight="500" color="neutral.12">
        Start Time
      </Text>
      <TimeInput
        locale={locale}
        value={timeValue}
        granularity={granularity}
        variant="ghost"
        size="sm"
        onChange={(v) => v && setTimeValue(v)}
      />
    </Flex>
  );
};
