import {
  DatePickerInputRootSlot,
  DatePickerInputGroupSlot,
  DatePickerInputTriggerSlot,
  DatePickerInputPopoverSlot,
  DatePickerInputCalendarSlot,
} from "./date-picker-input.slots";

import { CalendarMonth } from "@commercetools/nimbus-icons";

import { DatePicker, Group, Popover, Dialog } from "react-aria-components";
import { useSlotRecipe } from "@chakra-ui/react";
import { datePickerInputRecipe } from "./date-picker-input.recipe";
import type { DatePickerInputProps } from "./date-picker-input.types";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { Flex, DateInput, Calendar, IconButton, Text } from "@/components";
import { DatePickerTimeInput } from "./components/date-picker.time-input";

/**
 * DatePickerInput
 * ============================================================
 * Combines a DateInput with a Calendar popover for date selection.
 * Users can either type a date directly or select from the calendar.
 */
export const DatePickerInput = (props: DatePickerInputProps) => {
  const { size = "md" } = props;
  const recipe = useSlotRecipe({ recipe: datePickerInputRecipe });
  const [recipeProps, remainingProps] = recipe.splitVariantProps(props);
  const [styleProps, otherProps] = extractStyleProps(remainingProps);

  const calendarButtonSize = size === "md" ? "xs" : "2xs";

  return (
    <DatePickerInputRootSlot {...recipeProps} {...styleProps}>
      <DatePicker {...otherProps}>
        <DatePickerInputGroupSlot asChild>
          <Group>
            <DateInput
              size={size}
              width="full"
              locale={props.locale}
              createCalendar={props.createCalendar}
            />
            <DatePickerInputTriggerSlot>
              <IconButton
                tone="primary"
                variant="ghost"
                aria-label="Open calendar"
                size={calendarButtonSize}
              >
                <CalendarMonth />
              </IconButton>
            </DatePickerInputTriggerSlot>
          </Group>
        </DatePickerInputGroupSlot>

        <DatePickerInputPopoverSlot asChild>
          <Popover>
            <Dialog>
              <DatePickerInputCalendarSlot>
                <Calendar />
              </DatePickerInputCalendarSlot>
              <Flex>
                <Text>Start Time</Text>
                <DatePickerTimeInput />
              </Flex>
            </Dialog>
          </Popover>
        </DatePickerInputPopoverSlot>
      </DatePicker>
    </DatePickerInputRootSlot>
  );
};

DatePickerInput.displayName = "DatePickerInput";
