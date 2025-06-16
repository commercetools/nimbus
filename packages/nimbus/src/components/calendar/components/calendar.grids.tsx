import {
  CalendarGrid as RaCalendarGrid,
  CalendarGridBody as RaCalendarGridBody,
  CalendarGridHeader as RaCalendarGridHeader,
  CalendarHeaderCell as RaCalendarHeaderCell,
  CalendarCell as RaCalendarCell,
  useSlottedContext,
  CalendarContext,
} from "react-aria-components";
import { today, getLocalTimeZone } from "@internationalized/date";
import {
  CalendarCellSlot,
  CalendarGridBodySlot,
  CalendarGridHeaderSlot,
  CalendarGridSlot,
  CalendarGridsSlot,
  CalendarHeaderCellSlot,
} from "../calendar.slots";

export const CalendarGrids = () => {
  const context = useSlottedContext(CalendarContext);
  const arr = new Array(context?.visibleDuration?.months || 1).fill("");
  const todayDate = today(getLocalTimeZone());

  return (
    <CalendarGridsSlot>
      {arr.map((_, index) => (
        <CalendarGridSlot asChild>
          <RaCalendarGrid offset={{ months: index }} weekdayStyle="short">
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
                {(date) => {
                  const isToday = date.compare(todayDate) === 0;
                  return (
                    <CalendarCellSlot asChild data-today={isToday}>
                      <RaCalendarCell date={date} />
                    </CalendarCellSlot>
                  );
                }}
              </RaCalendarGridBody>
            </CalendarGridBodySlot>
          </RaCalendarGrid>
        </CalendarGridSlot>
      ))}
    </CalendarGridsSlot>
  );
};
