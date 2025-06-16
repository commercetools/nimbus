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

export const slotRecipes = {
  dialog: dialogSlotRecipe,
  list: listSlotRecipe,
  table: tableSlotRecipe,
  checkbox: checkboxSlotRecipe,
  select: selectSlotRecipe,
  accordion: accordionSlotRecipe,
  taggroup: tagGroupSlotRecipe,
  switch: switchSlotRecipe,
  "number-input": numberInputRecipe,
  radioInput: radioInputSlotRecipe,
  combobox: comboBoxSlotRecipe,
};
