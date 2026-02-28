import { accordionSlotRecipe } from "@/components/accordion/accordion.recipe";
import { detailPageSlotRecipe } from "@/components/detail-page/detail-page.recipe";
import { stepsSlotRecipe } from "@/components/steps/steps.recipe";
import { alertRecipe } from "@/components/alert/alert.recipe";
import { calendarSlotRecipe } from "@/components/calendar/calendar.recipe";
import { cardRecipe } from "@/components/card/card.recipe";
import { checkboxSlotRecipe } from "@/components/checkbox/checkbox.recipe";
import { collapsibleMotionSlotRecipe } from "@/components/collapsible-motion/collapsible-motion.recipe";
import { comboBoxSlotRecipe } from "@/components/combobox/combobox.recipe";
import { dataTableSlotRecipe } from "@/components/data-table/data-table.recipe";
import { dateInputSlotRecipe } from "@/components/date-input/date-input.recipe";
import { datePickerSlotRecipe } from "@/components/date-picker/date-picker.recipe";
import { dateRangePickerSlotRecipe } from "@/components/date-range-picker/date-range-picker.recipe";
import { dialogSlotRecipe } from "@/components/dialog/dialog.recipe";
import { draggableListSlotRecipe } from "@/components/draggable-list/draggable-list.recipe";
import { drawerSlotRecipe } from "@/components/drawer/drawer.recipe";
import { fieldErrorsRecipe } from "@/components/field-errors/field-errors.recipe";
import { formFieldRecipe } from "@/components/form-field/form-field.recipe";
import { listSlotRecipe } from "@/components/list/list.recipe";
import { localizedFieldSlotRecipe } from "@/components/localized-field/localized-field.recipe";
import { menuSlotRecipe } from "@/components/menu/menu.recipe";
import { pageContentRecipe } from "@/components/page-content/page-content.recipe";
import { moneyInputRecipe } from "@/components/money-input/money-input.recipe";
import { multilineTextInputRecipe } from "@/components/multiline-text-input/multiline-text-input.recipe";
import { numberInputRecipe } from "@/components/number-input/number-input.recipe";
import { progressBarSlotRecipe } from "@/components/progress-bar/progress-bar.recipe";
import { radioInputSlotRecipe } from "@/components/radio-input/radio-input.recipe";
import { rangeCalendarSlotRecipe } from "@/components/range-calendar/range-calendar.recipe";
import { richTextInputRecipe } from "@/components/rich-text-input/rich-text-input.recipe";
import { scopedSearchInputSlotRecipe } from "@/components/scoped-search-input/scoped-search-input.recipe";
import { searchInputSlotRecipe } from "@/components/search-input/search-input.recipe";
import { selectSlotRecipe } from "@/components/select/select.recipe";
import { splitButtonSlotRecipe } from "@/components/split-button/split-button.recipe";
import { switchSlotRecipe } from "@/components/switch/switch.recipe";
import { tableSlotRecipe } from "@/components/table/table.recipe";
import { tabsSlotRecipe } from "@/components/tabs/tabs.recipe";
import { tagGroupSlotRecipe } from "@/components/tag-group/tag-group.recipe";
import { textInputSlotRecipe } from "@/components/text-input/text-input.recipe";
import { timeInputRecipe } from "@/components/time-input/time-input.recipe";
import { toastRecipe } from "@/components/toast/toast.recipe";
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
/**
 * Slot Recipes for Nimbus Components
 *
 * IMPORTANT: All recipe keys are prefixed with `nimbus` to avoid naming collisions
 * with Chakra UI's built-in recipes. This ensures that Nimbus's custom variant types
 * are correctly generated and don't conflict with Chakra's default types.
 *
 * Without this prefix, generated TypeScript interfaces (e.g., `DrawerVariant`) would
 * collide with Chakra's defaults, causing incorrect type inference in consumer applications.
 *
 * @example
 * // Correct: Use nimbus prefix
 * nimbusDrawer: drawerSlotRecipe
 *
 * // Wrong: No prefix causes collision
 * drawer: drawerSlotRecipe  // ❌ Collides with Chakra's drawer
 */
export const slotRecipes = {
  nimbusAccordion: accordionSlotRecipe,
  nimbusAlert: alertRecipe,
  nimbusCalendar: calendarSlotRecipe,
  nimbusCard: cardRecipe,
  nimbusCheckbox: checkboxSlotRecipe,
  nimbusCollapsibleMotion: collapsibleMotionSlotRecipe,
  nimbusCombobox: comboBoxSlotRecipe,
  nimbusDataTable: dataTableSlotRecipe,
  nimbusDetailPage: detailPageSlotRecipe,
  nimbusDateInput: dateInputSlotRecipe,
  nimbusDatePicker: datePickerSlotRecipe,
  nimbusDateRangePicker: dateRangePickerSlotRecipe,
  nimbusDialog: dialogSlotRecipe,
  nimbusDraggableList: draggableListSlotRecipe,
  nimbusDrawer: drawerSlotRecipe,
  nimbusFieldErrors: fieldErrorsRecipe,
  nimbusFormField: formFieldRecipe,
  nimbusList: listSlotRecipe,
  nimbusLocalizedField: localizedFieldSlotRecipe,
  nimbusMenu: menuSlotRecipe,
  nimbusMoneyInput: moneyInputRecipe,
  nimbusMultilineTextInput: multilineTextInputRecipe,
  nimbusNumberInput: numberInputRecipe,
  nimbusPageContent: pageContentRecipe,
  nimbusProgressBar: progressBarSlotRecipe,
  nimbusRadioInput: radioInputSlotRecipe,
  nimbusRangeCalendar: rangeCalendarSlotRecipe,
  nimbusRichTextInput: richTextInputRecipe,
  nimbusScopedSearchInput: scopedSearchInputSlotRecipe,
  nimbusSearchInput: searchInputSlotRecipe,
  nimbusSelect: selectSlotRecipe,
  nimbusSplitButton: splitButtonSlotRecipe,
  nimbusSwitch: switchSlotRecipe,
  nimbusTable: tableSlotRecipe,
  nimbusTabs: tabsSlotRecipe,
  nimbusTagGroup: tagGroupSlotRecipe,
  nimbusTextInput: textInputSlotRecipe,
  nimbusTimeInput: timeInputRecipe,
  // NOTE: intentionally NOT prefixed with "nimbus" — the "toast" key overrides
  // Chakra's built-in toast recipe so that useToastStyles() in ToastOutlet resolves
  // Nimbus styles through Chakra's recipe system. Adding the nimbus prefix would
  // break style resolution. This is the only Nimbus recipe that is an override.
  toast: toastRecipe,
  nimbusToggleButtonGroup: buttonGroupRecipe,
  nimbusSteps: stepsSlotRecipe,
};
