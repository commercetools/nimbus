import type { RangeCalendarProps } from "./range-calendar.types";
import type { DateValue } from "@internationalized/date";

import { RangeCalendar as RaRangeCalendar } from "react-aria-components";

import { RangeCalendarRootSlot } from "./range-calendar.slots";
import { RangeCalendarGrids } from "./components/range-calendar.grids";
import { RangeCalendarHeader } from "./components/range-calendar.header";
import { rangeCalendarSlotRecipe } from "./range-calendar.recipe";
import { useRecipe } from "@chakra-ui/react/styled-system";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { RangeCalendarCustomContext } from "./components/range-calendar.custom-context";

export const RangeCalendar = (props: RangeCalendarProps<DateValue>) => {
  const recipe = useRecipe({ recipe: rangeCalendarSlotRecipe });
  const [recipeProps, remainingProps] = recipe.splitVariantProps(props);
  const [styleProps, otherProps] = extractStyleProps(remainingProps);

  return (
    <RangeCalendarRootSlot {...recipeProps} {...styleProps} asChild>
      <RaRangeCalendar {...otherProps}>
        <RangeCalendarCustomContext>
          <RangeCalendarHeader />
          <RangeCalendarGrids />
        </RangeCalendarCustomContext>
      </RaRangeCalendar>
    </RangeCalendarRootSlot>
  );
};
