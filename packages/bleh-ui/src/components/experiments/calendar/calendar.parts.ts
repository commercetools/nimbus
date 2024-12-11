"use client";

import {
  createSlotRecipeContext,
  type HTMLChakraProps,
  type RecipeVariantProps,
} from "@chakra-ui/react";
import { calendarSlotRecipe } from "./calendar.recipe.ts";

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: calendarSlotRecipe,
});

interface StyledCalendarProps
  extends HTMLChakraProps<
    "div",
    RecipeVariantProps<typeof calendarSlotRecipe>
  > {}

export const StyledCalendar = withProvider<HTMLDivElement, StyledCalendarProps>(
  "div",
  "calendar"
);

interface StyledCalendarGridProps extends HTMLChakraProps<"div"> {}
export const StyledCalendarGrid = withContext<
  HTMLDivElement,
  StyledCalendarGridProps
>("div", "calendarGrid");

interface StyledCalendarCellProps extends HTMLChakraProps<"div"> {}
export const StyledCalendarCell = withContext<
  HTMLDivElement,
  StyledCalendarCellProps
>("div", "calendarCell");
