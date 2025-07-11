import {
  DateRangePickerRootSlot,
  DateRangePickerGroupSlot,
  DateRangePickerTriggerSlot,
  DateRangePickerPopoverSlot,
  DateRangePickerCalendarSlot,
} from "./date-range-picker.slots";

import { CalendarMonth, Close } from "@commercetools/nimbus-icons";

import {
  DateRangePicker as ReactAriaDateRangePicker,
  Group,
  Popover,
  Dialog,
} from "react-aria-components";
import { useSlotRecipe } from "@chakra-ui/react";
import { dateRangePickerSlotRecipe } from "./date-range-picker.recipe";
import type { DateRangePickerProps } from "./date-range-picker.types";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { DateInput, RangeCalendar, IconButton } from "@/components";
import { DateRangePickerTimeInput } from "./components/date-range-picker.time-input";
import { DateRangePickerCustomContext } from "./components/date-range-picker.custom-context";

/**
 * DateRangePicker
 * ============================================================
 * Combines a DateInput with a RangeCalendar popover for date range selection.
 * Users can either type a date range directly or select from the calendar.
 */
export const DateRangePicker = (props: DateRangePickerProps) => {
  const { granularity = "day", placeholderValue } = props;
  const recipe = useSlotRecipe({ recipe: dateRangePickerSlotRecipe });
  const [recipeProps, remainingProps] = recipe.splitVariantProps(props);

  // --- Nimbus placeholderValue API explanation ---
  // Nimbus's placeholderValue prop is an object: { start, end }
  // This allows consumers to specify separate placeholder values for the start and end date inputs,
  // matching the defaultValue API shape and making the API more ergonomic for date ranges.
  //
  // The underlying React Aria DateRangePicker expects a single DateValue for its placeholderValue prop,
  // NOT an object. Passing our object directly would cause errors.
  //
  // Therefore, we intercept and remove placeholderValue from the props passed to ReactAriaDateRangePicker.
  // We only use placeholderValue for our own child DateInput components.
  //
  // This pattern allows us to provide a better API for Nimbus users while still leveraging React Aria under the hood.
  // ------------------------------------------------
  const { placeholderValue: _ignore, ...restProps } = remainingProps;
  const [styleProps, otherProps] = extractStyleProps(restProps);

  // Extract size and variant from recipe props to pass to DateInputs
  const { size = "md", variant } = recipeProps;

  // the size of the buttons overlaying the input
  const overlayButtonSize = size === "md" ? "xs" : "2xs";

  // When granularity is "day", use the prop value (defaults to true if not provided)
  // For other granularities (time-based), force to false so users can set both date and time
  const shouldCloseOnSelect =
    granularity === "day" ? props.shouldCloseOnSelect : false;

  return (
    <DateRangePickerRootSlot {...recipeProps} {...styleProps} asChild>
      <ReactAriaDateRangePicker
        {...otherProps}
        shouldCloseOnSelect={shouldCloseOnSelect}
        // Nimbus's placeholderValue is an object ({ start, end }) and is NOT compatible with
        // ReactAriaDateRangePicker's placeholderValue prop (which expects a single DateValue).
        // We intentionally do NOT pass it down; it is only used for the child DateInputs.
      >
        <DateRangePickerCustomContext>
          <DateRangePickerGroupSlot asChild>
            <Group>
              <DateInput
                slot="start"
                size={size}
                variant={variant}
                width="auto"
                placeholderValue={placeholderValue?.start}
              />

              {/* TODO: find a more elegant way to do this */}
              <span
                aria-hidden="true"
                style={{
                  padding: "0 5px",
                  userSelect: "none",
                }}
              >
                –
              </span>
              <DateInput
                slot="end"
                size={size}
                variant={variant}
                width="auto"
                placeholderValue={placeholderValue?.end}
              />
              <DateRangePickerTriggerSlot>
                {/* @ts-expect-error react aria is adding the aria-label prop */}
                <IconButton
                  tone="primary"
                  variant="ghost"
                  size={overlayButtonSize}
                  slot="clear"
                >
                  <Close />
                </IconButton>
                {/* @ts-expect-error react aria is adding the aria-label prop */}
                <IconButton
                  tone="primary"
                  variant="ghost"
                  size={overlayButtonSize}
                  slot="calendarToggle"
                >
                  <CalendarMonth />
                </IconButton>
              </DateRangePickerTriggerSlot>
            </Group>
          </DateRangePickerGroupSlot>
          <DateRangePickerPopoverSlot asChild>
            <Popover placement="bottom end">
              <Dialog>
                <DateRangePickerCalendarSlot>
                  <RangeCalendar />
                </DateRangePickerCalendarSlot>
                <DateRangePickerTimeInput />
              </Dialog>
            </Popover>
          </DateRangePickerPopoverSlot>
        </DateRangePickerCustomContext>
      </ReactAriaDateRangePicker>
    </DateRangePickerRootSlot>
  );
};

DateRangePicker.displayName = "DateRangePicker";
