import {
  CalendarGrid as RaCalendarGrid,
  CalendarGridHeader as RaCalendarGridHeader,
  CalendarGridBody as RaCalendarGridBody,
  CalendarHeaderCell as RaCalendarHeaderCell,
} from "react-aria-components";
import {
  CalendarGridSlot,
  CalendarGridHeaderSlot,
  CalendarGridBodySlot,
  CalendarHeaderCellSlot,
} from "../calendar.slots";
import { CalendarCell } from "./calendar.cell";

export const CalendarGrid = () => (
  <CalendarGridSlot asChild>
    <RaCalendarGrid>
      <CalendarGridHeaderSlot asChild>
        <RaCalendarGridHeader>
          {(day) => (
            <CalendarHeaderCellSlot asChild>
              <RaCalendarHeaderCell>{day}</RaCalendarHeaderCell>
            </CalendarHeaderCellSlot>
          )}
        </RaCalendarGridHeader>
      </CalendarGridHeaderSlot>
      <CalendarGridBodySlot asChild>
        <RaCalendarGridBody>
          {(date) => <CalendarCell date={date} />}
        </RaCalendarGridBody>
      </CalendarGridBodySlot>
    </RaCalendarGrid>
  </CalendarGridSlot>
);
