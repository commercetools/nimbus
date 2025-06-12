import {
  CalendarGrid as RaCalendarGrid,
  CalendarGridBody as RaCalendarGridBody,
  CalendarGridHeader as RaCalendarGridHeader,
  CalendarHeaderCell as RaCalendarHeaderCell,
  CalendarCell as RaCalendarCell,
  useSlottedContext,
  CalendarContext,
  Calendar,
} from "react-aria-components";
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

  return (
    <CalendarGridsSlot>
      {arr.map((_, index) => (
        <CalendarGridSlot asChild>
          <RaCalendarGrid offset={{ months: index }}>
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
                {(date) => (
                  <CalendarCellSlot asChild>
                    <RaCalendarCell date={date} />
                  </CalendarCellSlot>
                )}
              </RaCalendarGridBody>
            </CalendarGridBodySlot>
          </RaCalendarGrid>
        </CalendarGridSlot>
      ))}
    </CalendarGridsSlot>
  );
};
