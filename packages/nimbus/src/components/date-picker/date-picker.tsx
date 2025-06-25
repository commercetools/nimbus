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
 * DatePicker
 * ============================================================
 * Combines a DateInput with a Calendar popover for date selection.
 * Users can either type a date directly or select from the calendar.
 */
export const DatePicker = (props: DatePickerProps) => {
  const { size = "md", variant, granularity = "day" } = props;
  const recipe = useSlotRecipe({ recipe: datePickerSlotRecipe });
  const [recipeProps, remainingProps] = recipe.splitVariantProps(props);
  const [styleProps, otherProps] = extractStyleProps(remainingProps);

  // the size of the buttons overlaying the input
  const overlayButtonSize = size === "md" ? "xs" : "2xs";

  // Determine if popover should close on select based on granularity
  // If time selection is needed, keep popover open
  const shouldCloseOnSelect =
    props.shouldCloseOnSelect || granularity === "day";

  return (
    <DatePickerRootSlot {...recipeProps} {...styleProps} asChild>
      <ReactAriaDatePicker
        {...otherProps}
        shouldCloseOnSelect={shouldCloseOnSelect}
      >
        <DatePickerCustomContext>
          <DatePickerGroupSlot asChild>
            <Group>
              <DateInput size={size} variant={variant} width="full" />
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
                <DatePickerTimeInput />
              </Dialog>
            </Popover>
          </DatePickerPopoverSlot>
        </DatePickerCustomContext>
      </ReactAriaDatePicker>
    </DatePickerRootSlot>
  );
};

DatePicker.displayName = "DatePicker";
