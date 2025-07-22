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
  // Forward hideTimeZone to child components (footer time inputs)
  const { granularity = "day", hideTimeZone } = props;
  const recipe = useSlotRecipe({ recipe: dateRangePickerSlotRecipe });
  const [recipeProps, remainingProps] = recipe.splitVariantProps(props);

  const [styleProps, otherProps] = extractStyleProps(remainingProps);

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
      >
        <DateRangePickerCustomContext>
          <DateRangePickerGroupSlot asChild>
            <Group>
              <DateInput
                slot="start"
                size={size}
                variant="plain"
                width="auto"
                hideTimeZone={hideTimeZone}
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
                variant="plain"
                width="auto"
                hideTimeZone={hideTimeZone}
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
                <DateRangePickerTimeInput hideTimeZone={hideTimeZone} />
              </Dialog>
            </Popover>
          </DateRangePickerPopoverSlot>
        </DateRangePickerCustomContext>
      </ReactAriaDateRangePicker>
    </DateRangePickerRootSlot>
  );
};

DateRangePicker.displayName = "DateRangePicker";
