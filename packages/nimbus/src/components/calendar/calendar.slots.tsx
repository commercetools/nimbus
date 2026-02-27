import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "@/type-utils";
import type {
  CalendarCellSlotProps,
  CalendarGridBodySlotProps,
  CalendarGridHeaderSlotProps,
  CalendarGridSlotProps,
  CalendarGridsSlotProps,
  CalendarHeaderCellSlotProps,
  CalendarHeaderSlotProps,
  CalendarMonthTitleSlotProps,
  CalendarRootSlotProps,
} from "./calendar.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusCalendar",
});

export const CalendarRootSlot: SlotComponent<
  HTMLDivElement,
  CalendarRootSlotProps
> = withProvider<HTMLDivElement, CalendarRootSlotProps>("div", "root");

export const CalendarHeaderSlot = withContext<
  HTMLDivElement,
  CalendarHeaderSlotProps
>("div", "header");

export const CalendarGridsSlot = withContext<
  HTMLDivElement,
  CalendarGridsSlotProps
>("div", "grids");

export const CalendarMonthTitleSlot = withContext<
  HTMLDivElement,
  CalendarMonthTitleSlotProps
>("div", "monthTitle");

export const CalendarGridSlot = withContext<
  HTMLTableElement,
  CalendarGridSlotProps
>("table", "grid");

export const CalendarGridHeaderSlot = withContext<
  HTMLTableSectionElement,
  CalendarGridHeaderSlotProps
>("thead", "gridHeader");

export const CalendarHeaderCellSlot = withContext<
  HTMLTableCellElement,
  CalendarHeaderCellSlotProps
>("th", "headerCell");

export const CalendarGridBodySlot = withContext<
  HTMLTableSectionElement,
  CalendarGridBodySlotProps
>("tbody", "gridBody");

export const CalendarCellSlot = withContext<
  HTMLTableCellElement,
  CalendarCellSlotProps
>("td", "bodyCell");
