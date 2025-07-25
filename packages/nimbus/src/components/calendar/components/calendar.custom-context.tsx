import { getLocalTimeZone } from "@internationalized/date";
import { useContext } from "react";
import {
  Provider,
  ButtonContext,
  CalendarStateContext,
  TextContext,
  useLocale,
} from "react-aria-components";

export const CalendarCustomContext = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { locale } = useLocale();
  const buttonContext = useContext(ButtonContext)!;
  const textContext = useContext(TextContext)!;
  const calendarState = useContext(CalendarStateContext)!;

  /**
   * Button slots
   * ================================
   */
  const buttonSlots = {
    "next-month": {
      onPress: () => calendarState.focusNextSection(),
      "aria-label": "Next month",
    },
    "previous-month": {
      onPress: () => calendarState.focusPreviousSection(),
      "aria-label": "Previous month",
    },
    "next-year": {
      onPress: () => calendarState.focusNextSection(true),
      "aria-label": "Next year",
    },
    "previous-year": {
      onPress: () => calendarState.focusPreviousSection(true),
      "aria-label": "Previous year",
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
