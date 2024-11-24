import { defineSlotRecipe } from "@chakra-ui/react";

export const calendarSlotRecipe = defineSlotRecipe({
  slots: ["calendar", "calendarGrid", "calendarCell"],
  base: {
    calendar: {
      width: "72",
      boxShadow: "md",
      p: "4",
    },
    calendarGrid: {
      width: "full",
    },
    calendarCell: {},
  },
});
