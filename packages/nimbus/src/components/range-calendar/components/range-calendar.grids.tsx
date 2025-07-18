import { useContext, useEffect, useRef } from "react";
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

  // Track previous anchor date to detect immediate clicks
  const previousAnchorRef = useRef<DateValue | null>(null);

  // Custom range clearing logic - detect when anchorDate changes outside current range
  useEffect(() => {
    const currentAnchor = calendarState.anchorDate;
    const previousAnchor = previousAnchorRef.current;

    // Only process if anchorDate actually changed
    if (
      currentAnchor &&
      (!previousAnchor || currentAnchor.compare(previousAnchor) !== 0)
    ) {
      // If we have a complete range, any click should clear it and start fresh
      if (selectedRange?.start && selectedRange?.end) {
        // Clear the existing range by setting null, then setting new start date only
        calendarState.setValue(null);
        // Small delay to ensure the null state is processed, then set new start date
        setTimeout(() => {
          calendarState.setValue({
            start: currentAnchor,
            end: currentAnchor,
          });
        }, 0);
      }
    }

    // Update previous anchor reference
    previousAnchorRef.current = currentAnchor;
  }, [calendarState.anchorDate, selectedRange, calendarState]);

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

                      /* Calculate column position (0-6) based on day of week and firstDayOfWeek setting
                       This IS locale-agnostic because we convert TS day numbers to column positions
                      relative to the firstDayOfWeek setting from React Aria
                      Examples:
                      - US locale (firstDayOfWeek="sun"): Sun=col0, Mon=col1, ..., Sat=col6
                      - German locale (firstDayOfWeek="mon"): Mon=col0, Tue=col1, ..., Sun=col6 
                      */
                      const dayOfWeek = date
                        .toDate(getLocalTimeZone())
                        .getDay();
                      const firstDayOfWeek = context?.firstDayOfWeek || "sun";
                      const firstDayNum =
                        firstDayOfWeek === "sun"
                          ? 0
                          : firstDayOfWeek === "mon"
                            ? 1
                            : firstDayOfWeek === "tue"
                              ? 2
                              : firstDayOfWeek === "wed"
                                ? 3
                                : firstDayOfWeek === "thu"
                                  ? 4
                                  : firstDayOfWeek === "fri"
                                    ? 5
                                    : 6;
                      // Convert TS day number to column position (0=leftmost, 6=rightmost)
                      const columnPosition = (dayOfWeek - firstDayNum + 7) % 7;

                      const isFirstColumn = columnPosition === 0;
                      const isLastColumn = columnPosition === 6;

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
                          // Add column position data attributes
                          {...(isFirstColumn && { "data-first-column": "" })}
                          {...(isLastColumn && { "data-last-column": "" })}
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
