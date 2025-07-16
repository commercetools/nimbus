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
import type { RangeValue } from "../range-calendar.types";

export const RangeCalendarGrids = () => {
  const { locale } = useLocale();
  const context = useSlottedContext(RangeCalendarContext);

  const calendarState = useContext(RangeCalendarStateContext)!;
  const visibleMonthsCount = context?.visibleDuration?.months || 1;
  const todayDate = today(getLocalTimeZone());
  const showMonthTitles = visibleMonthsCount > 1;

  // RangeCalendar-specific: Get the selected date range from calendar state
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

                      // RangeCalendar-specific: Calculate range-specific states
                      const isStartDate =
                        selectedRange?.start &&
                        date.compare(selectedRange.start) === 0;
                      const isEndDate =
                        selectedRange?.end &&
                        date.compare(selectedRange.end) === 0;
                      const isInRange = isDateInRange(date, selectedRange);

                      // During drag, use highlightedRange to determine start/end
                      const isDragStart =
                        calendarState.highlightedRange &&
                        date.compare(calendarState.highlightedRange.start) ===
                          0;
                      const isDragEnd =
                        calendarState.highlightedRange &&
                        date.compare(calendarState.highlightedRange.end) === 0;

                      return (
                        <RangeCalendarCellSlot
                          asChild
                          data-today={isToday}
                          // RangeCalendar-specific: Add range-specific data attributes for styling
                          data-selected={isStartDate || isEndDate}
                          data-in-range={isInRange}
                          data-range-start={isStartDate}
                          data-range-end={isEndDate}
                          data-drag-start={isDragStart}
                          data-drag-end={isDragEnd}
                          data-in-highlighted-range={
                            calendarState.highlightedRange &&
                            date.compare(
                              calendarState.highlightedRange.start
                            ) >= 0 &&
                            date.compare(calendarState.highlightedRange.end) <=
                              0
                          }
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

// RangeCalendar-specific: Helper function to determine if a date is within the selected range
const isDateInRange = (
  date: DateValue,
  range: RangeValue<DateValue> | null
) => {
  if (!range || !range.start || !range.end) return false;
  // Exclude the endpoints (they are data-selected instead)
  return date.compare(range.start) > 0 && date.compare(range.end) < 0;
};
