import type { CalendarProps } from "./calendar.types";
import type { DateValue } from "react-aria";

import { Calendar as RaCalendar } from "react-aria-components";

import { CalendarRootSlot } from "./calendar.slots";
import { CalendarGrids } from "./components/calendar.grids";
import { CalendarHeader } from "./components/calendar.header";
import { calendarSlotRecipe } from "./calendar.recipe";
import { useRecipe } from "@chakra-ui/react/styled-system";
import { extractStyleProps } from "@/utils";
import { CalendarCustomContext } from "./components/calendar.custom-context";

/**
 * # Calendar
 *
 * Calendars display a grid of days in one or more months and allow users to select a single date.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/inputs/calendar}
 */
export const Calendar = (props: CalendarProps<DateValue>) => {
  const recipe = useRecipe({ recipe: calendarSlotRecipe });
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
