import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "@/type-utils";
import type {
  RangeCalendarRootSlotProps,
  RangeCalendarHeaderSlotProps,
  RangeCalendarGridsSlotProps,
  RangeCalendarMonthTitleSlotProps,
  RangeCalendarGridSlotProps,
  RangeCalendarGridHeaderSlotProps,
  RangeCalendarHeaderCellSlotProps,
  RangeCalendarGridBodySlotProps,
  RangeCalendarCellSlotProps,
} from "./range-calendar.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusRangeCalendar",
});

export const RangeCalendarRootSlot: SlotComponent<
  HTMLDivElement,
  RangeCalendarRootSlotProps
> = withProvider<HTMLDivElement, RangeCalendarRootSlotProps>("div", "root");

export const RangeCalendarHeaderSlot = withContext<
  HTMLDivElement,
  RangeCalendarHeaderSlotProps
>("div", "header");

export const RangeCalendarGridsSlot = withContext<
  HTMLDivElement,
  RangeCalendarGridsSlotProps
>("div", "grids");

export const RangeCalendarMonthTitleSlot = withContext<
  HTMLDivElement,
  RangeCalendarMonthTitleSlotProps
>("div", "monthTitle");

export const RangeCalendarGridSlot = withContext<
  HTMLTableElement,
  RangeCalendarGridSlotProps
>("table", "grid");

export const RangeCalendarGridHeaderSlot = withContext<
  HTMLTableSectionElement,
  RangeCalendarGridHeaderSlotProps
>("thead", "gridHeader");

export const RangeCalendarHeaderCellSlot = withContext<
  HTMLTableCellElement,
  RangeCalendarHeaderCellSlotProps
>("th", "headerCell");

export const RangeCalendarGridBodySlot = withContext<
  HTMLTableSectionElement,
  RangeCalendarGridBodySlotProps
>("tbody", "gridBody");

export const RangeCalendarCellSlot = withContext<
  HTMLTableCellElement,
  RangeCalendarCellSlotProps
>("td", "bodyCell");
