import { useContext } from "react";
import {
  Provider,
  ButtonContext,
  TextContext,
  DatePickerStateContext,
  TimeFieldContext,
} from "react-aria-components";
import type { TimeValue } from "react-aria";

export const DatePickerCustomContext = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const buttonContext = useContext(ButtonContext)!;
  const textContext = useContext(TextContext)!;
  const datePickerState = useContext(DatePickerStateContext);
  const noInputValue = datePickerState?.dateValue === null;

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { timeValue, setTimeValue, granularity } = datePickerState!;

  /**
   * Button slots
   * ================================
   */
  const buttonSlots = {
    /** toggles the calendar popover */
    calendarToggle: buttonContext,
    /** clears the input value */
    clear: {
      onPress: () => datePickerState?.setValue(null),
      "aria-label": "Clear input value",
      isDisabled: noInputValue,
    },
  };

  /**
   * Text slots
   * ================================
   */
  const textSlots = {
    startTime: {
      children: "Start time",
    },
  };

  const timeInputSlots = {
    timeInput: {
      value: timeValue,
      onChange: (value: TimeValue | null) => {
        if (value !== null) {
          setTimeValue(value);
        }
      },
      granularity: granularity === "day" ? undefined : granularity,
    },
  };

  return (
    <Provider
      values={[
        [
          ButtonContext,
          {
            slots: buttonSlots,
          },
        ],
        [
          TextContext,
          {
            ...textContext,
            slots: {
              ...textContext.slots,
              ...textSlots,
            },
          },
        ],
        [TimeFieldContext, { slots: timeInputSlots }],
      ]}
    >
      {children}
    </Provider>
  );
};
