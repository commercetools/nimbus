import { useContext } from "react";
import {
  today,
  getLocalTimeZone,
  type DateValue,
} from "@internationalized/date";
import {
  CalendarGrid as RaCalendarGrid,
  CalendarGridBody as RaCalendarGridBody,
  CalendarGridHeader as RaCalendarGridHeader,
  CalendarHeaderCell as RaCalendarHeaderCell,
  CalendarCell as RaCalendarCell,
  useSlottedContext,
  RangeCalendarContext,
  RangeCalendarStateContext,
  useLocale,
} from "react-aria-components";
import { Box } from "@/components";

import {
  RangeCalendarCellSlot,
  RangeCalendarGridBodySlot,
  RangeCalendarGridHeaderSlot,
  RangeCalendarGridsSlot,
  RangeCalendarGridSlot,
  RangeCalendarHeaderCellSlot,
  RangeCalendarMonthTitleSlot,
} from "../range-calendar.slots";

export type RangeValue<T> = {
  start: T;
  end: T;
};

export const RangeCalendarGrids = () => {
  const { locale } = useLocale();
  const context = useSlottedContext(RangeCalendarContext);

  const calendarState = useContext(RangeCalendarStateContext)!;
  const visibleMonthsCount = context?.visibleDuration?.months || 1;
  const todayDate = today(getLocalTimeZone());
  const showMonthTitles = visibleMonthsCount > 1;
  const selectedRange = calendarState.value;

  return (
    <RangeCalendarGridsSlot>
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
              <RangeCalendarMonthTitleSlot>
                {monthName}
              </RangeCalendarMonthTitleSlot>
            )}
            <RangeCalendarGridSlot asChild>
              <RaCalendarGrid offset={{ months: index }} weekdayStyle="short">
                <RangeCalendarGridHeaderSlot asChild>
                  <RaCalendarGridHeader>
                    {(day) => (
                      <RangeCalendarHeaderCellSlot asChild>
                        <RaCalendarHeaderCell>{day}</RaCalendarHeaderCell>
                      </RangeCalendarHeaderCellSlot>
                    )}
                  </RaCalendarGridHeader>
                </RangeCalendarGridHeaderSlot>
                <RangeCalendarGridBodySlot asChild>
                  <RaCalendarGridBody>
                    {(date) => {
                      const isToday = date.compare(todayDate) === 0;

                      const isInRange = isDateInRange(date, selectedRange);

                      return (
                        <RangeCalendarCellSlot
                          asChild
                          data-today={isToday}
                          data-in-range={isInRange}
                        >
                          <RaCalendarCell date={date} />
                        </RangeCalendarCellSlot>
                      );
                    }}
                  </RaCalendarGridBody>
                </RangeCalendarGridBodySlot>
              </RaCalendarGrid>
            </RangeCalendarGridSlot>
          </Box>
        );
      })}
    </RangeCalendarGridsSlot>
  );
};

const isDateInRange = (
  date: DateValue,
  range: RangeValue<DateValue> | null
) => {
  if (!range || !range.start || !range.end) return false;
  // Exclude the endpoints
  return date.compare(range.start) > 0 && date.compare(range.end) < 0;
};
