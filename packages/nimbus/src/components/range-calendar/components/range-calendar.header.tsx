import {
  RangeCalendarContext,
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
import { RangeCalendarHeaderSlot } from "../range-calendar.slots";

/**
 * RangeCalendarHeader - Header component for the RangeCalendar
 *
 * Displays navigation controls for month and year selection with proper
 * internationalization and accessibility support.
 */
export const RangeCalendarHeader = () => {
  const rangeCalendarProps = useSlottedContext(RangeCalendarContext);

  // Needed to decide whether to show a single month or a range
  const visibleDurationMonths =
    rangeCalendarProps?.visibleDuration?.months || 1;
  const showRangeLabel = visibleDurationMonths > 1;

  return (
    <RangeCalendarHeaderSlot>
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
            colorPalette="primary"
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
            colorPalette="primary"
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
            colorPalette="primary"
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
          <IconButton
            slot="next-year"
            size="xs"
            variant="ghost"
            colorPalette="primary"
          >
            <KeyboardArrowRight />
          </IconButton>
        </Stack>
      </Flex>
    </RangeCalendarHeaderSlot>
  );
};
