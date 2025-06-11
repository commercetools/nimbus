import { CalendarCell as RaCalendarCell } from "react-aria-components";
import { CalendarCellSlot } from "../calendar.slots";
import type { CalendarDate } from "@internationalized/date";
import { chakra } from "@chakra-ui/react";

export const CalendarCell = ({ date }: { date: CalendarDate }) => (
  <CalendarCellSlot asChild>
    <RaCalendarCell date={date}>
      {({ formattedDate }) => <chakra.span>{formattedDate}</chakra.span>}
    </RaCalendarCell>
  </CalendarCellSlot>
);
