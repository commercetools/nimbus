import { useCalendar, useLocale } from "react-aria";
import { type RangeValue } from "@react-types/shared";
import { useCalendarState, type CalendarState } from "react-stately";
import {
  CalendarDate,
  createCalendar,
  type DateValue,
} from "@internationalized/date";
import { Button, Flex, Heading, Stack, Text } from "@/components";
import { Button as AriaButton } from "react-aria-components";

import { useCalendarGrid } from "react-aria";
import { getWeeksInMonth } from "@internationalized/date";

import { useCalendarCell } from "react-aria";
import { useRef } from "react";
import {
  StyledCalendar,
  StyledCalendarCell,
  StyledCalendarGrid,
} from "./calendar.parts.ts";

import { ArrowLeft, ArrowRight } from "@bleh-ui/icons";

const CalendarCell = ({
  state,
  date,
}: {
  state: CalendarState;
  date: CalendarDate;
}) => {
  let ref = useRef(null);
  let {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    isUnavailable,
    formattedDate,
  } = useCalendarCell({ date }, state, ref);

  return (
    <StyledCalendarCell textAlign="center" as="td" {...cellProps}>
      <Button
        width="8"
        height="8"
        size="2xs"
        asChild
        {...{
          variant: cellProps["aria-selected"] ? "solid" : "ghost",
          colorPalette: cellProps["aria-selected"] ? "primary" : "neutral",
        }}
      >
        <button
          {...buttonProps}
          ref={ref}
          hidden={isOutsideVisibleRange}
          className={`cell ${isSelected ? "selected" : ""} ${
            isDisabled ? "disabled" : ""
          } ${isUnavailable ? "unavailable" : ""}`}
        >
          {formattedDate}
        </button>
      </Button>
    </StyledCalendarCell>
  );
};

const CalendarGrid = ({ state, ...props }: { state: CalendarState }) => {
  let { locale } = useLocale();
  let { gridProps, headerProps, weekDays } = useCalendarGrid(props, state);

  // Get the number of weeks in the month so we can render the proper number of rows.
  let weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale);

  return (
    <StyledCalendarGrid as="table" {...gridProps}>
      <thead {...headerProps}>
        <tr>
          {weekDays.map((day, index) => (
            <Text as="th" key={index} fontWeight="semibold">
              {day}
            </Text>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <tr key={weekIndex}>
            {state
              .getDatesInWeek(weekIndex)
              .map((date, i) =>
                date ? (
                  <CalendarCell key={i} state={state} date={date} />
                ) : (
                  <td key={i} />
                )
              )}
          </tr>
        ))}
      </tbody>
    </StyledCalendarGrid>
  );
};

type CalendarProps = {
  /** The currently selected date. */
  value?: CalendarDate | null;
  /**Whether the calendar is disabled. */
  isDisabled?: boolean;
  /** Whether the calendar is in a read only state. */
  isReadOnly?: boolean;
  /** The date range that is currently visible in the calendar. */
  visibleRange?: RangeValue<CalendarDate>;
  /** The time zone of the dates currently being displayed. */
  timeZone?: string;
  /**Whether the calendar is invalid. */
  isValueInvalid?: boolean;
  /**The currently focused date. */
  focusedDate?: CalendarDate;
  /** Whether focus is currently within the calendar. */
  isFocused?: boolean;
  /** The minimum allowed date that a user may select. */
  minValue?: DateValue | null;
  /** The maximum allowed date that a user may select. */
  maxValue?: DateValue | null;
};

export const Calendar = (props: CalendarProps) => {
  let { locale } = useLocale();
  let state = useCalendarState({
    ...props,
    locale,
    createCalendar,
  });

  let { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar(
    props,
    state
  );

  return (
    <StyledCalendar {...calendarProps} className="calendar">
      <Stack gap="8">
        <Flex alignItems="center">
          <Button size="2xs" colorPalette="primary" variant="ghost" asChild>
            <AriaButton {...prevButtonProps}>
              <ArrowLeft />
            </AriaButton>
          </Button>
          <Heading as="h2" size="md" textAlign="center" flexGrow="1">
            {title}
          </Heading>
          <Button size="2xs" colorPalette="primary" variant="ghost" asChild>
            <AriaButton {...nextButtonProps}>
              <ArrowRight />
            </AriaButton>
          </Button>
        </Flex>
        <CalendarGrid state={state} />
      </Stack>
    </StyledCalendar>
  );
};
