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
import { datePickerRecipe } from "./date-picker.recipe";
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
  const { size = "md", variant } = props;
  const recipe = useSlotRecipe({ recipe: datePickerRecipe });
  const [recipeProps, remainingProps] = recipe.splitVariantProps(props);
  const [styleProps, otherProps] = extractStyleProps(remainingProps);

  // the size of the buttons overlaying the input
  const overlayButtonSize = size === "md" ? "xs" : "2xs";

  return (
    <DatePickerRootSlot {...recipeProps} {...styleProps} asChild>
      <ReactAriaDatePicker {...otherProps}>
        <DatePickerCustomContext>
          <DatePickerGroupSlot asChild>
            <Group>
              <DateInput size={size} variant={variant} width="full" />
              <DatePickerTriggerSlot>
                <IconButton
                  tone="primary"
                  variant="ghost"
                  aria-label="Clear input"
                  size={overlayButtonSize}
                  slot="clear"
                >
                  <Close />
                </IconButton>
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
