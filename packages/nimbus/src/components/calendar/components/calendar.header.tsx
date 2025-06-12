import { useSlottedContext, CalendarContext } from "react-aria-components";
import { CalendarHeaderSlot } from "../calendar.slots";
import { Box, Flex, IconButton, Stack, Text } from "@/components";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@commercetools/nimbus-icons";

export const CalendarHeader = () => {
  const context = useSlottedContext(CalendarContext);

  console.log("CalendarContext", context);

  const monthLabel = "January";
  const yearLabel = "2025";

  return (
    <CalendarHeaderSlot>
      <Flex>
        <Stack direction="row" alignItems="center">
          {/* @ts-expect-error react aria is adding the aria-label prop */}
          <IconButton size="xs" variant="ghost" tone="primary" slot="previous">
            <KeyboardArrowLeft />
          </IconButton>
          <Text>{monthLabel}</Text>
          {/* @ts-expect-error react aria is adding the aria-label prop */}
          <IconButton size="xs" variant="ghost" tone="primary" slot="next">
            <KeyboardArrowRight />
          </IconButton>
        </Stack>
        <Box flexGrow="1" />
        <Stack direction="row" alignItems="center">
          {/* @ts-expect-error react aria is adding the aria-label prop */}
          <IconButton size="xs" variant="ghost" tone="primary" slot="previous">
            <KeyboardArrowLeft />
          </IconButton>
          <Text>{yearLabel}</Text>
          {/* @ts-expect-error react aria is adding the aria-label prop */}
          <IconButton size="xs" variant="ghost" tone="primary" slot="next">
            <KeyboardArrowRight />
          </IconButton>
        </Stack>

        {/* <Heading /> */}
      </Flex>
    </CalendarHeaderSlot>
  );
};
