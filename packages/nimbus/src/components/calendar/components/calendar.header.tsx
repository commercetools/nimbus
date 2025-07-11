import {
  CalendarContext,
  Heading,
  useSlottedContext,
} from "react-aria-components";
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
import { CalendarHeaderSlot } from "../calendar.slots";

export const CalendarHeader = () => {
  const calendarProps = useSlottedContext(CalendarContext);

  // Needed to decide wether to show a single month or a range
  const visibleDurationMonths = calendarProps?.visibleDuration?.months || 1;
  const showRangeLabel = visibleDurationMonths > 1;

  return (
    <CalendarHeaderSlot>
      <Flex>
        <Stack direction="row" alignItems="center">
          {/** solely for screen readers, if not present, a11y issues are raised */}
          <VisuallyHidden>
            <Heading />
          </VisuallyHidden>
          {/* @ts-expect-error - custom-context will add aria-label via the "slot" prop */}
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
            width={showRangeLabel ? "4000" : "2000"}
            textAlign="center"
            aria-hidden="true"
            slot={showRangeLabel ? "monthRange" : "month"}
          />
          {/* @ts-expect-error - custom-context will add aria-label via the "slot" prop */}
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
          {/* @ts-expect-error - custom-context will add aria-label via the "slot" prop */}
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
            width="1400"
            textAlign="center"
            aria-hidden="true"
            slot="year"
          />
          {/* @ts-expect-error - custom-context will add aria-label via the "slot" prop */}
          <IconButton slot="next-year" size="xs" variant="ghost" tone="primary">
            <KeyboardArrowRight />
          </IconButton>
        </Stack>
      </Flex>
    </CalendarHeaderSlot>
  );
};
