import {
  DatePickerRootSlot,
  DatePickerGroupSlot,
  DatePickerTriggerSlot,
  DatePickerPopoverSlot,
  DatePickerCalendarSlot,
} from "./date-picker.slots";

import { CalendarMonth, Close } from "@commercetools/nimbus-icons";

import {
  DatePicker as ReactAriaDatePicker,
  Group,
  Popover,
  Dialog,
} from "react-aria-components";
import { useSlotRecipe } from "@chakra-ui/react";
import { datePickerSlotRecipe } from "./date-picker.recipe";
import type { DatePickerProps } from "./date-picker.types";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { DateInput, Calendar, IconButton } from "@/components";
import { DatePickerTimeInput } from "./components/date-picker.time-input";
import { DatePickerCustomContext } from "./components/date-picker.custom-context";

/**
 * # DatePicker
 * 
 * a UI component for users to enter or select a specific calendar date.
 * 
 * @see {@link https://nimbus-documentation.vercel.app/components/inputs/datepicker}
 */
export const DatePicker = (props: DatePickerProps) => {
  const {
    size = "md",
    variant,
    granularity = "day",
    hideTimeZone,
    hourCycle,
  } = props;
  const recipe = useSlotRecipe({ recipe: datePickerSlotRecipe });
  const [recipeProps, remainingProps] = recipe.splitVariantProps(props);
  const [styleProps, otherProps] = extractStyleProps(remainingProps);

  // the size of the buttons overlaying the input
  const overlayButtonSize = size === "md" ? "xs" : "2xs";

  // When granularity is "day", use the prop value (defaults to true if not provided)
  // For other granularities (time-based), force to false so users can set both date and time
  const shouldCloseOnSelect =
    granularity === "day" ? props.shouldCloseOnSelect : false;

  return (
    <DatePickerRootSlot {...recipeProps} {...styleProps} asChild>
      <ReactAriaDatePicker
        {...otherProps}
        shouldCloseOnSelect={shouldCloseOnSelect}
      >
        <DatePickerCustomContext>
          <DatePickerGroupSlot asChild>
            <Group>
              <DateInput
                size={size}
                variant={variant}
                width="full"
                hideTimeZone={hideTimeZone}
                hourCycle={hourCycle}
              />
              <DatePickerTriggerSlot>
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
              </DatePickerTriggerSlot>
            </Group>
          </DatePickerGroupSlot>
          <DatePickerPopoverSlot asChild>
            <Popover placement="bottom end">
              <Dialog>
                <DatePickerCalendarSlot>
                  <Calendar />
                </DatePickerCalendarSlot>
                <DatePickerTimeInput
                  hideTimeZone={hideTimeZone}
                  hourCycle={hourCycle}
                />
              </Dialog>
            </Popover>
          </DatePickerPopoverSlot>
        </DatePickerCustomContext>
      </ReactAriaDatePicker>
    </DatePickerRootSlot>
  );
};

DatePicker.displayName = "DatePicker";
