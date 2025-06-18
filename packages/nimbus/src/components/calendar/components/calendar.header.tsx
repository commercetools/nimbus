import { CalendarHeaderSlot } from "../calendar.slots";
import {
  Box,
  Flex,
  IconButton,
  Stack,
  Text,
  VisuallyHidden,
} from "@/components";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@commercetools/nimbus-icons";
import { getLocalTimeZone } from "@internationalized/date";
import { useContext } from "react";

import {
  CalendarContext,
  CalendarStateContext,
  Heading,
  useLocale,
} from "react-aria-components";

export const CalendarHeader = () => {
  const { locale } = useLocale();

  const calendarState = useContext(CalendarStateContext)!;
  const calendarProps = useContext(CalendarContext)!;

  // Needed to decide wether to show a single month or a range
  const visibleDurationMonths = calendarProps.visibleDuration?.months || 1;
  const showRangeLabel = visibleDurationMonths > 1;

  // Now, use Intl.DateTimeFormat with the dynamic locale
  const monthLabel = new Intl.DateTimeFormat(locale, {
    month: "long",
  }).format(calendarState.focusedDate.toDate(getLocalTimeZone()));

  const monthRangeLabel = [
    new Intl.DateTimeFormat(locale, {
      month: "long",
    }).format(calendarState.visibleRange.start.toDate(getLocalTimeZone())),
    new Intl.DateTimeFormat(locale, {
      month: "long",
    }).format(calendarState.visibleRange.end.toDate(getLocalTimeZone())),
  ].join(" - ");

  const yearLabel = new Intl.DateTimeFormat(locale, {
    year: "numeric",
  }).format(calendarState.focusedDate.toDate(getLocalTimeZone()));

  return (
    <CalendarHeaderSlot>
      <Flex>
        <Stack direction="row" alignItems="center">
          {/** a11y issues without RA's heading */}
          <VisuallyHidden>
            <Heading />
          </VisuallyHidden>
          {/* @ts-expect-error react aria is adding the aria-label prop */}
          <IconButton
            slot={showRangeLabel ? "previous" : "previous-month"}
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
            width={showRangeLabel ? "18ch" : "9ch"}
            textAlign="center"
            aria-hidden="true"
          >
            {showRangeLabel ? monthRangeLabel : monthLabel}
          </Text>
          {/* @ts-expect-error react aria is adding the aria-label prop */}
          <IconButton
            slot={showRangeLabel ? "next" : "next-month"}
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
            slot="previous-year"
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
            width="5ch"
            textAlign="center"
            aria-hidden="true"
          >
            {yearLabel}
          </Text>
          {/* @ts-expect-error react aria is adding the aria-label prop */}
          <IconButton slot="next-year" size="xs" variant="ghost" tone="primary">
            <KeyboardArrowRight />
          </IconButton>
        </Stack>

        {/* <Heading /> */}
      </Flex>
    </CalendarHeaderSlot>
  );
};
