/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  createSlotRecipeContext,
  type HTMLChakraProps,
  type RecipeVariantProps,
} from "@chakra-ui/react/styled-system";
import { rangeCalendarSlotRecipe } from "./range-calendar.recipe";
import type { RangeCalendarProps } from "react-aria-components";
import type { DateValue } from "@internationalized/date";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "rangeCalendar",
});

export interface RangeCalendarRootSlotProps
  extends HTMLChakraProps<
    "div",
    RecipeVariantProps<typeof rangeCalendarSlotRecipe> &
      RangeCalendarProps<DateValue>
  > {}
export const RangeCalendarRootSlot = withProvider<
  HTMLDivElement,
  RangeCalendarRootSlotProps
>("div", "root");

export interface RangeCalendarHeaderSlotProps extends HTMLChakraProps<"div"> {}
export const RangeCalendarHeaderSlot = withContext<
  HTMLDivElement,
  RangeCalendarHeaderSlotProps
>("div", "header");

export interface RangeCalendarGridsSlotProps extends HTMLChakraProps<"div"> {}
export const RangeCalendarGridsSlot = withContext<
  HTMLDivElement,
  RangeCalendarGridsSlotProps
>("div", "grids");

export interface RangeCalendarMonthTitleSlotProps
  extends HTMLChakraProps<"div"> {}
export const RangeCalendarMonthTitleSlot = withContext<
  HTMLDivElement,
  RangeCalendarMonthTitleSlotProps
>("div", "monthTitle");

export interface RangeCalendarGridSlotProps extends HTMLChakraProps<"table"> {}
export const RangeCalendarGridSlot = withContext<
  HTMLTableElement,
  RangeCalendarGridSlotProps
>("table", "grid");

export interface RangeCalendarGridHeaderSlotProps
  extends HTMLChakraProps<"thead"> {}
export const RangeCalendarGridHeaderSlot = withContext<
  HTMLTableSectionElement,
  RangeCalendarGridHeaderSlotProps
>("thead", "gridHeader");

export interface RangeCalendarHeaderCellSlotProps
  extends HTMLChakraProps<"th"> {}
export const RangeCalendarHeaderCellSlot = withContext<
  HTMLTableCellElement,
  RangeCalendarHeaderCellSlotProps
>("th", "headerCell");

export interface RangeCalendarGridBodySlotProps
  extends HTMLChakraProps<"tbody"> {}
export const RangeCalendarGridBodySlot = withContext<
  HTMLTableSectionElement,
  RangeCalendarGridBodySlotProps
>("tbody", "gridBody");

export interface RangeCalendarCellSlotProps extends HTMLChakraProps<"td"> {}
export const RangeCalendarCellSlot = withContext<
  HTMLTableCellElement,
  RangeCalendarCellSlotProps
>("td", "bodyCell");
