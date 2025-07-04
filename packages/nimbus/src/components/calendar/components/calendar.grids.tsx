import { useContext } from "react";
import { today, getLocalTimeZone } from "@internationalized/date";
import {
  CalendarGrid as RaCalendarGrid,
  CalendarGridBody as RaCalendarGridBody,
  CalendarGridHeader as RaCalendarGridHeader,
  CalendarHeaderCell as RaCalendarHeaderCell,
  CalendarCell as RaCalendarCell,
  useSlottedContext,
  CalendarContext,
  CalendarStateContext,
  useLocale,
} from "react-aria-components";

import { Box } from "@/components";

import {
  CalendarCellSlot,
  CalendarGridBodySlot,
  CalendarGridHeaderSlot,
  CalendarGridSlot,
  CalendarGridsSlot,
  CalendarHeaderCellSlot,
  CalendarMonthTitleSlot,
} from "../calendar.slots";

export const CalendarGrids = () => {
  const { locale } = useLocale();
  const context = useSlottedContext(CalendarContext);
  const calendarState = useContext(CalendarStateContext)!;
  const visibleMonthsCount = context?.visibleDuration?.months || 1;
  const todayDate = today(getLocalTimeZone());
  const showMonthTitles = visibleMonthsCount > 1;

  return (
    <CalendarGridsSlot>
      {Array.from({ length: visibleMonthsCount }, (_, index) => {
        const gridDate = calendarState.visibleRange.start.add({
          months: index,
        });
        const monthName = new Intl.DateTimeFormat(locale, {
          month: "long",
        }).format(gridDate.toDate(getLocalTimeZone()));

        return (
          <Box
            key={monthName}
            width={visibleMonthsCount == 1 ? "full" : "auto"}
          >
            {showMonthTitles && (
              <CalendarMonthTitleSlot>{monthName}</CalendarMonthTitleSlot>
            )}
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
          </Box>
        );
      })}
    </CalendarGridsSlot>
  );
};
