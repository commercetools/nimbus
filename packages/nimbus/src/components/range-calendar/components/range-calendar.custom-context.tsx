import { getLocalTimeZone } from "@internationalized/date";
import { useContext } from "react";
import {
  Provider,
  ButtonContext,
  RangeCalendarStateContext,
  TextContext,
  useLocale,
} from "react-aria-components";
import { rangeCalendarMessages } from "../range-calendar.messages";

export const RangeCalendarCustomContext = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { locale } = useLocale();
  const buttonContext = useContext(ButtonContext)!;
  const textContext = useContext(TextContext)!;
  const calendarState = useContext(RangeCalendarStateContext)!;

  /**
   * Button slots
   * ================================
   */
  const buttonSlots = {
    "next-month": {
      onPress: () => calendarState.focusNextSection(),
      "aria-label": rangeCalendarMessages.getStringLocale("nextMonth", locale),
    },
    "previous-month": {
      onPress: () => calendarState.focusPreviousSection(),
      "aria-label": rangeCalendarMessages.getStringLocale(
        "previousMonth",
        locale
      ),
    },
    "next-year": {
      onPress: () => calendarState.focusNextSection(true),
      "aria-label": rangeCalendarMessages.getStringLocale("nextYear", locale),
    },
    "previous-year": {
      onPress: () => calendarState.focusPreviousSection(true),
      "aria-label": rangeCalendarMessages.getStringLocale(
        "previousYear",
        locale
      ),
    },
  };

  /**
   * Text slots
   * ================================
   */
  const monthLabel = new Intl.DateTimeFormat(locale, {
    month: "long",
  }).format(calendarState.focusedDate.toDate(getLocalTimeZone()));

  const monthRangeLabel = [
    new Intl.DateTimeFormat(locale, {
      month: "long",
    }).format(calendarState.visibleRange.start.toDate(getLocalTimeZone())),
    new Intl.DateTimeFormat(locale, {
      month: "long",
    }).format(calendarState.visibleRange.end.toDate(getLocalTimeZone())),
  ].join(" - ");

  const yearLabel = new Intl.DateTimeFormat(locale, {
    year: "numeric",
  }).format(calendarState.focusedDate.toDate(getLocalTimeZone()));

  const textSlots = {
    month: { children: monthLabel },
    monthRange: { children: monthRangeLabel },
    year: { children: yearLabel },
  };

  return (
    <Provider
      values={[
        [
          ButtonContext,
          {
            ...buttonContext,
            slots: {
              ...(buttonContext &&
              typeof buttonContext === "object" &&
              "slots" in buttonContext
                ? buttonContext.slots
                : {}),
              ...buttonSlots,
            },
          },
        ],
        [
          TextContext,
          {
            ...textContext,
            slots: {
              ...(textContext &&
              typeof textContext === "object" &&
              "slots" in textContext
                ? textContext.slots
                : {}),
              ...textSlots,
            },
          },
        ],
      ]}
    >
      {children}
    </Provider>
  );
};
