import { CalendarHeaderSlot } from "../calendar.slots";
import { Box, Flex, IconButton, Stack, Text } from "@/components";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@commercetools/nimbus-icons";
import { CalendarDate, getLocalTimeZone } from "@internationalized/date";
import { useContext } from "react";

import { CalendarStateContext, useLocale } from "react-aria-components";

export const CalendarHeader = () => {
  const state = useContext(CalendarStateContext)!;
  const { locale } = useLocale();

  // Now, use Intl.DateTimeFormat with the dynamic locale
  const monthLabel = new Intl.DateTimeFormat(locale, {
    month: "long",
  }).format(state.focusedDate.toDate(getLocalTimeZone()));

  const yearLabel = new Intl.DateTimeFormat(locale, {
    year: "numeric",
  }).format(state.focusedDate.toDate(getLocalTimeZone()));

  console.log("calendar state", state);
  console.log("focused date", state.focusedDate);

  const goto = {
    nextMonth: () => state.focusNextSection(),
    previousMonth: () => state.focusPreviousSection(),
    nextYear: () => state.focusNextSection(true),
    previousYear: () => state.focusPreviousSection(true),
  };

  return (
    <CalendarHeaderSlot>
      <Flex>
        <Stack direction="row" alignItems="center">
          {/* @ts-expect-error react aria is adding the aria-label prop */}
          <IconButton
            onPress={goto.previousMonth}
            slot={null}
            size="xs"
            variant="ghost"
            tone="primary"
          >
            <KeyboardArrowLeft />
          </IconButton>
          <Text
            textStyle="sm"
            fontWeight="500"
            color="neutral.11"
            width="9ch"
            textAlign="center"
          >
            {monthLabel}
          </Text>
          {/* @ts-expect-error react aria is adding the aria-label prop */}
          <IconButton
            onPress={goto.nextMonth}
            slot={null}
            size="xs"
            variant="ghost"
            tone="primary"
          >
            <KeyboardArrowRight />
          </IconButton>
        </Stack>
        <Box flexGrow="1" />
        <Stack direction="row" alignItems="center">
          {/* @ts-expect-error react aria is adding the aria-label prop */}
          <IconButton
            onPress={goto.previousYear}
            slot={null}
            size="xs"
            variant="ghost"
            tone="primary"
          >
            <KeyboardArrowLeft />
          </IconButton>
          <Text
            textStyle="sm"
            fontWeight="500"
            color="neutral.11"
            width="4ch"
            textAlign="center"
          >
            {yearLabel}
          </Text>
          {/* @ts-expect-error react aria is adding the aria-label prop */}
          <IconButton
            onPress={goto.nextYear}
            slot={null}
            size="xs"
            variant="ghost"
            tone="primary"
          >
            <KeyboardArrowRight />
          </IconButton>
        </Stack>

        {/* <Heading /> */}
      </Flex>
    </CalendarHeaderSlot>
  );
};
