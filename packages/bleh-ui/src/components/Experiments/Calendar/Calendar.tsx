import { useCalendar, useLocale } from "react-aria";
import { useCalendarState } from "react-stately";
import { createCalendar } from "@internationalized/date";
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
} from "./Calendar.parts";

import { ArrowLeft, ArrowRight } from "@bleh-ui/icons";

const CalendarCell = ({ state, date }) => {
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

  const styledButtonProps = {
    variant: cellProps["aria-selected"] ? "solid" : "ghost",
    colorPalette: cellProps["aria-selected"] ? "primary" : "neutral",
  };

  return (
    <StyledCalendarCell textAlign="center" as="td" {...cellProps}>
      <Button width="8" height="8" size="2xs" asChild {...styledButtonProps}>
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

const CalendarGrid = ({ state, ...props }) => {
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

export const Calendar = (props) => {
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
      <Stack gap="4">
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
