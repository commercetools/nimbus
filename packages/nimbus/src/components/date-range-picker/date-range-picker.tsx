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
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { dateRangePickerSlotRecipe } from "./date-range-picker.recipe";
import type { DateRangePickerProps } from "./date-range-picker.types";
import { extractStyleProps } from "@/utils";
import { DateInput, RangeCalendar, IconButton, Text } from "@/components";
import { DateRangePickerTimeInput } from "./components/date-range-picker.time-input";
import { DateRangePickerCustomContext } from "./components/date-range-picker.custom-context";
import { dateRangePickerMessages } from "./date-range-picker.messages";
import { useLocale } from "react-aria-components";

/**
 * DateRangePicker
 * ============================================================
 * Combines a DateInput with a RangeCalendar popover for date range selection.
 * Users can either type a date range directly or select from the calendar.
 *
 * @supportsStyleProps
 */
export const DateRangePicker = (props: DateRangePickerProps) => {
  const { locale } = useLocale();

  // Forward hideTimeZone and hourCycle to child components (footer time inputs)
  const { granularity = "day", hideTimeZone, hourCycle } = props;
  const recipe = useSlotRecipe({ recipe: dateRangePickerSlotRecipe });
  const [recipeProps, remainingProps] = recipe.splitVariantProps(props);

  const [styleProps, otherProps] = extractStyleProps(remainingProps);

  // Extract size and variant from recipe props to pass to DateInputs
  const { size = "md" } = recipeProps;

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
                size={props.size}
                variant="plain"
                width="auto"
                hideTimeZone={hideTimeZone}
                hourCycle={hourCycle}
              />
              <Text
                as="span"
                px="150"
                color="neutral.11"
                userSelect="none"
                aria-hidden="true"
                slot={null}
              >
                –
              </Text>
              <DateInput
                slot="end"
                size={props.size}
                variant="plain"
                width="auto"
                hideTimeZone={hideTimeZone}
                hourCycle={hourCycle}
              />
              <DateRangePickerTriggerSlot>
                <IconButton
                  variant="ghost"
                  size={overlayButtonSize}
                  slot="clear"
                  aria-label={dateRangePickerMessages.getVariableLocale(
                    "clearSelection",
                    locale
                  )}
                >
                  <Close />
                </IconButton>
                <IconButton
                  variant="ghost"
                  size={overlayButtonSize}
                  slot="calendarToggle"
                  aria-label={dateRangePickerMessages.getVariableLocale(
                    "openCalendar",
                    locale
                  )}
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
                <DateRangePickerTimeInput
                  hideTimeZone={hideTimeZone}
                  hourCycle={hourCycle}
                />
              </Dialog>
            </Popover>
          </DateRangePickerPopoverSlot>
        </DateRangePickerCustomContext>
      </ReactAriaDateRangePicker>
    </DateRangePickerRootSlot>
  );
};

DateRangePicker.displayName = "DateRangePicker";
