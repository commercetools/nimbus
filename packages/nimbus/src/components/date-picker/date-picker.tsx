import {
  DatePickerRootSlot,
  DatePickerGroupSlot,
  DatePickerTriggerSlot,
  DatePickerPopoverSlot,
  DatePickerCalendarSlot,
} from "./date-picker.slots";

import { CalendarMonth } from "@commercetools/nimbus-icons";

import {
  DatePicker as ReactAriaDatePicker,
  Group,
  Popover,
  Dialog,
} from "react-aria-components";
import { useSlotRecipe } from "@chakra-ui/react";
import { datePickerRecipe } from "./date-picker.recipe";
import type { DatePickerProps } from "./date-picker.types";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { DateInput, Calendar, IconButton } from "@/components";
import { DatePickerTimeInput } from "./components/date-picker.time-input";
import { DatePickerClearButton } from "./components/date-picker.clear-button";

/**
 * DatePicker
 * ============================================================
 * Combines a DateInput with a Calendar popover for date selection.
 * Users can either type a date directly or select from the calendar.
 */
export const DatePicker = (props: DatePickerProps) => {
  const { size = "md" } = props;
  const recipe = useSlotRecipe({ recipe: datePickerRecipe });
  const [recipeProps, remainingProps] = recipe.splitVariantProps(props);
  const [styleProps, otherProps] = extractStyleProps(remainingProps);

  const calendarButtonSize = size === "md" ? "xs" : "2xs";

  return (
    <DatePickerRootSlot {...recipeProps} {...styleProps} asChild>
      <ReactAriaDatePicker {...otherProps}>
        <DatePickerGroupSlot asChild>
          <Group>
            <DateInput size={size} width="full" />
            <DatePickerTriggerSlot>
              <DatePickerClearButton size={calendarButtonSize} />
              <IconButton
                tone="primary"
                variant="ghost"
                aria-label="Open calendar"
                size={calendarButtonSize}
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
                <Calendar variant="plain" />
              </DatePickerCalendarSlot>
              <DatePickerTimeInput />
            </Dialog>
          </Popover>
        </DatePickerPopoverSlot>
      </ReactAriaDatePicker>
    </DatePickerRootSlot>
  );
};

DatePicker.displayName = "DatePicker";
