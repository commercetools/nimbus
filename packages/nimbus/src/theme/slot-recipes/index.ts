import { dialogSlotRecipe } from "@/components/dialog/dialog.recipe";
import { listSlotRecipe } from "@/components/list/list.recipe";
import { tableSlotRecipe } from "@/components/table/table.recipe";
import { checkboxSlotRecipe } from "@/components/checkbox/checkbox.recipe";
import { selectSlotRecipe } from "@/components/select/select.recipe";
import { accordionSlotRecipe } from "@/components/accordion/accordion.recipe";
import { tagGroupSlotRecipe } from "@/components/tag-group/tag-group.recipe";
import { switchSlotRecipe } from "@/components/switch/switch.recipe";
import { numberInputRecipe } from "@/components/number-input/number-input.recipe";
import { radioInputSlotRecipe } from "@/components/radio-input/radio-input.recipe";
import { comboBoxSlotRecipe } from "@/components/combobox/combobox.recipe";

/**
 * Keys for the slotRecipes object MUST be a valid JS identifier!!!!!!!!!!
 *
 * you MUST be able to access the key with dot notation: ✅ slotRecipes.exampleComponent ✅
 * NOT with bracket notation: ❌ slotRecipes["example-component"] ❌
 *
 * Failure to do so will make it so that `pnpm build-theme-typings` will fail silently
 * due to some truly awful interplay between `@chakra-ui/cli` and `prettier`
 *
 * Silent failure results in there being no generated types for slot recipes, and causes all kinds of
 * false typescript errors that are really hard to debug.
 */ import { calendarSlotRecipe } from "@/components/calendar/calendar.recipe";
import { dateInputSlotRecipe } from "@/components/date-input/date-input.recipe";
import { datePickerSlotRecipe } from "@/components/date-picker/date-picker.recipe";
import { progressBarSlotRecipe } from "@/components/progress-bar/progress-bar.recipe";
import { menuSlotRecipe } from "@/components/menu/menu.recipe";

export const slotRecipes = {
  dialog: dialogSlotRecipe,
  list: listSlotRecipe,
  table: tableSlotRecipe,
  checkbox: checkboxSlotRecipe,
  select: selectSlotRecipe,
  accordion: accordionSlotRecipe,
  taggroup: tagGroupSlotRecipe,
  switch: switchSlotRecipe,
  numberInput: numberInputRecipe,
  calendar: calendarSlotRecipe,
  dateInput: dateInputSlotRecipe,
  datePicker: datePickerSlotRecipe,
  radioInput: radioInputSlotRecipe,
  combobox: comboBoxSlotRecipe,
  progressBar: progressBarSlotRecipe,
  menu: menuSlotRecipe,
};
