import type { CalendarProps } from "./calendar.types";
import type { DateValue } from "react-aria";

import { Calendar as RaCalendar } from "react-aria-components";

import { CalendarRootSlot } from "./calendar.slots";
import {
  CalendarGrids,
  CalendarHeader,
  CalendarCustomContext,
} from "./components";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { extractStyleProps } from "@/utils";

/**
 * # Calendar
 *
 * Calendars display a grid of days in one or more months and allow users to select a single date.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/inputs/calendar}
 */
export const Calendar = (props: CalendarProps<DateValue>) => {
  const recipe = useSlotRecipe({ key: "calendar" });
  const [recipeProps, remainingProps] = recipe.splitVariantProps(props);
  const [styleProps, otherProps] = extractStyleProps(remainingProps);

  return (
    <CalendarRootSlot {...recipeProps} {...styleProps} asChild>
      <RaCalendar {...otherProps}>
        <CalendarCustomContext>
          <CalendarHeader />
          <CalendarGrids />
        </CalendarCustomContext>
      </RaCalendar>
    </CalendarRootSlot>
  );
};
