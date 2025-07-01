/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  createSlotRecipeContext,
  type HTMLChakraProps,
  type RecipeVariantProps,
} from "@chakra-ui/react";
import { calendarSlotRecipe } from "./calendar.recipe";
import type { CalendarProps } from "react-aria-components";
import type { DateValue } from "@internationalized/date";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "calendar",
});

export interface CalendarRootSlotProps
  extends HTMLChakraProps<
    "div",
    RecipeVariantProps<typeof calendarSlotRecipe> & CalendarProps<DateValue>
  > {}
export const CalendarRootSlot = withProvider<
  HTMLDivElement,
  CalendarRootSlotProps
>("div", "root");

export interface CalendarHeaderSlotProps extends HTMLChakraProps<"div"> {}
export const CalendarHeaderSlot = withContext<
  HTMLDivElement,
  CalendarHeaderSlotProps
>("div", "header");

export interface CalendarGridsSlotProps extends HTMLChakraProps<"div"> {}
export const CalendarGridsSlot = withContext<
  HTMLDivElement,
  CalendarGridsSlotProps
>("div", "grids");

export interface CalendarMonthTitleSlotProps extends HTMLChakraProps<"div"> {}
export const CalendarMonthTitleSlot = withContext<
  HTMLDivElement,
  CalendarMonthTitleSlotProps
>("div", "monthTitle");

export interface CalendarGridSlotProps extends HTMLChakraProps<"table"> {}
export const CalendarGridSlot = withContext<
  HTMLTableElement,
  CalendarGridSlotProps
>("table", "grid");

export interface CalendarGridHeaderSlotProps extends HTMLChakraProps<"thead"> {}
export const CalendarGridHeaderSlot = withContext<
  HTMLTableSectionElement,
  CalendarGridHeaderSlotProps
>("thead", "gridHeader");

export interface CalendarHeaderCellSlotProps extends HTMLChakraProps<"th"> {}
export const CalendarHeaderCellSlot = withContext<
  HTMLTableCellElement,
  CalendarHeaderCellSlotProps
>("th", "headerCell");

export interface CalendarGridBodySlotProps extends HTMLChakraProps<"tbody"> {}
export const CalendarGridBodySlot = withContext<
  HTMLTableSectionElement,
  CalendarGridBodySlotProps
>("tbody", "gridBody");

export interface CalendarCellSlotProps extends HTMLChakraProps<"td"> {}
export const CalendarCellSlot = withContext<
  HTMLTableCellElement,
  CalendarCellSlotProps
>("td", "bodyCell");
