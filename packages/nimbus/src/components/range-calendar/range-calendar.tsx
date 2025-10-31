import type { RangeCalendarProps } from "./range-calendar.types";
import type { DateValue } from "@internationalized/date";
import { RangeCalendar as RaRangeCalendar } from "react-aria-components";
import { RangeCalendarRootSlot } from "./range-calendar.slots";
import {
  RangeCalendarCustomContext,
  RangeCalendarHeader,
  RangeCalendarGrids,
} from "./components";
import { rangeCalendarSlotRecipe } from "./range-calendar.recipe";
import { useRecipe } from "@chakra-ui/react/styled-system";
import { extractStyleProps } from "@/utils";

/**
 * RangeCalendar
 * ============================================================
 * Calendar component that displays a grid of days in one or more months
 * and allows users to select a range of dates. Built with React Aria
 * Components for accessibility and WCAG 2.1 AA compliance.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/inputs/rangecalendar}
 *
 * @supportsStylePropsx
 */
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

RangeCalendar.displayName = "RangeCalendar";
