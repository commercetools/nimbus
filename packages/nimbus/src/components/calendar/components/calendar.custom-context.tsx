import { useContext } from "react";
import {
  Provider,
  ButtonContext,
  CalendarStateContext,
} from "react-aria-components";

export const CalendarCustomContext = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const buttonContext = useContext(ButtonContext)!;
  const calendarState = useContext(CalendarStateContext)!;

  const slots = {
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

  return (
    <Provider
      values={[
        [
          ButtonContext,
          {
            ...buttonContext,
            slots: {
              ...buttonContext.slots,
              ...slots,
            },
          },
        ],
      ]}
    >
      {children}
    </Provider>
  );
};
