import { accordionSlotRecipe } from "@/components/accordion/accordion.recipe";
import { alertRecipe } from "@/components/alert/alert.recipe";
import { calendarSlotRecipe } from "@/components/calendar/calendar.recipe";
import { cardRecipe } from "@/components/card/card.recipe";
import { checkboxSlotRecipe } from "@/components/checkbox/checkbox.recipe";
import { comboBoxSlotRecipe } from "@/components/combobox/combobox.recipe";
import { dataTableSlotRecipe } from "@/components/data-table/data-table.recipe";
import { dateInputSlotRecipe } from "@/components/date-input/date-input.recipe";
import { datePickerSlotRecipe } from "@/components/date-picker/date-picker.recipe";
import { dateRangePickerSlotRecipe } from "@/components/date-range-picker/date-range-picker.recipe";
import { drawerSlotRecipe } from "@/components/drawer/drawer.recipe";
import { dialogSlotRecipe } from "@/components/dialog/dialog.recipe";
import { fieldErrorsRecipe } from "@/components/field-errors/field-errors.recipe";
import { formFieldRecipe } from "@/components/form-field/form-field.recipe";
import { listSlotRecipe } from "@/components/list/list.recipe";
import { localizedFieldSlotRecipe } from "@/components/localized-field/localized-field.recipe";
import { moneyInputRecipe } from "@/components/money-input/money-input.recipe";
import { multilineTextInputRecipe } from "@/components/multiline-text-input/multiline-text-input.recipe";
import { numberInputRecipe } from "@/components/number-input/number-input.recipe";
import { radioInputSlotRecipe } from "@/components/radio-input/radio-input.recipe";
import { rangeCalendarSlotRecipe } from "@/components/range-calendar/range-calendar.recipe";
import { richTextInputRecipe } from "@/components/rich-text-input/rich-text-input.recipe";
import { scopedSearchInputSlotRecipe } from "@/components/scoped-search-input/scoped-search-input.recipe";
import { draggableListSlotRecipe } from "@/components/draggable-list/draggable-list.recipe";
import { progressBarSlotRecipe } from "@/components/progress-bar/progress-bar.recipe";
import { menuSlotRecipe } from "@/components/menu/menu.recipe";
import { textInputSlotRecipe } from "@/components/text-input/text-input.recipe";
import { splitButtonSlotRecipe } from "@/components/split-button/split-button.recipe";
import { collapsibleMotionSlotRecipe } from "@/components/collapsible-motion/collapsible-motion.recipe";
import { searchInputSlotRecipe } from "@/components/search-input/search-input.recipe";
import { selectSlotRecipe } from "@/components/select/select.recipe";
import { switchSlotRecipe } from "@/components/switch/switch.recipe";
import { tableSlotRecipe } from "@/components/table/table.recipe";
import { tabsSlotRecipe } from "@/components/tabs/tabs.recipe";
import { tagGroupSlotRecipe } from "@/components/tag-group/tag-group.recipe";
import { timeInputRecipe } from "@/components/time-input/time-input.recipe";
import { buttonGroupRecipe } from "@/components/toggle-button-group/toggle-button-group.recipe";

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
 * false typescript errors that are really hard to debug. */
export const slotRecipes = {
  calendar: calendarSlotRecipe,
  rangeCalendar: rangeCalendarSlotRecipe,
  dateInput: dateInputSlotRecipe,
  dateRangePicker: dateRangePickerSlotRecipe,
  datePicker: datePickerSlotRecipe,
  dataTable: dataTableSlotRecipe,
  radioInput: radioInputSlotRecipe,
  progressBar: progressBarSlotRecipe,
  textInput: textInputSlotRecipe,
  splitButton: splitButtonSlotRecipe,
  localizedField: localizedFieldSlotRecipe,
  collapsibleMotion: collapsibleMotionSlotRecipe,
  fieldErrors: fieldErrorsRecipe,
  formField: formFieldRecipe,
  moneyInput: moneyInputRecipe,
  multilineTextInput: multilineTextInputRecipe,
  richTextInput: richTextInputRecipe,
  scopedSearchInput: scopedSearchInputSlotRecipe,
  draggableList: draggableListSlotRecipe,
  searchInput: searchInputSlotRecipe,
  taggroup: tagGroupSlotRecipe,
  timeInput: timeInputRecipe,
  toggleButtonGroup: buttonGroupRecipe,
  /**
   * These recipe keys are prefixed with `nimbus` to avoid collisions with Chakra's built-in recipe names.
   *
   * Without this prefix, the generated TypeScript interfaces (e.g. `DrawerVariant`) would collide with
   * Chakra's default interfaces, causing incorrect type inference in consumer applications.
   * */
  nimbusAccordion: accordionSlotRecipe,
  nimbusAlert: alertRecipe,
  nimbusCard: cardRecipe,
  nimbusCheckbox: checkboxSlotRecipe,
  nimbusCombobox: comboBoxSlotRecipe,
  nimbusDialog: dialogSlotRecipe,
  nimbusDrawer: drawerSlotRecipe,
  nimbusList: listSlotRecipe,
  nimbusMenu: menuSlotRecipe,
  nimbusNumberInput: numberInputRecipe,
  nimbusSelect: selectSlotRecipe,
  nimbusSwitch: switchSlotRecipe,
  nimbusTable: tableSlotRecipe,
  nimbusTabs: tabsSlotRecipe,
};
