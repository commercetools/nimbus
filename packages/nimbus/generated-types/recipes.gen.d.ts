import type { RecipeDefinition, SlotRecipeDefinition, SystemRecipeFn, SystemSlotRecipeFn } from "../recipe.types"
import type { ConditionalValue } from "../css.types"

export interface NimbusAvatarVariant {
  /** @default "md" */
  size?: "md" | "xs" | "2xs" | undefined
}

export type NimbusAvatarVariantProps = {
  [K in keyof NimbusAvatarVariant]?: ConditionalValue<NimbusAvatarVariant[K]> | undefined
}

export type NimbusAvatarVariantMap = {
  [K in keyof NimbusAvatarVariant]: Array<NimbusAvatarVariant[K]>
}

export interface NimbusBadgeVariant {
  /** @default "md" */
  size?: "2xs" | "xs" | "md" | undefined
}

export type NimbusBadgeVariantProps = {
  [K in keyof NimbusBadgeVariant]?: ConditionalValue<NimbusBadgeVariant[K]> | undefined
}

export type NimbusBadgeVariantMap = {
  [K in keyof NimbusBadgeVariant]: Array<NimbusBadgeVariant[K]>
}

export interface NimbusButtonVariant {
  /** @default "md" */
  size?: "2xs" | "xs" | "md" | undefined
  /** @default "subtle" */
  variant?: "solid" | "subtle" | "outline" | "ghost" | "link" | undefined
}

export type NimbusButtonVariantProps = {
  [K in keyof NimbusButtonVariant]?: ConditionalValue<NimbusButtonVariant[K]> | undefined
}

export type NimbusButtonVariantMap = {
  [K in keyof NimbusButtonVariant]: Array<NimbusButtonVariant[K]>
}

export interface NimbusCodeVariant {
  /** @default "solid" */
  variant?: "solid" | "subtle" | "outline" | "surface" | "plain" | undefined
  /** @default "md" */
  size?: "xs" | "sm" | "md" | "lg" | undefined
}

export type NimbusCodeVariantProps = {
  [K in keyof NimbusCodeVariant]?: ConditionalValue<NimbusCodeVariant[K]> | undefined
}

export type NimbusCodeVariantMap = {
  [K in keyof NimbusCodeVariant]: Array<NimbusCodeVariant[K]>
}

export interface NimbusGroupVariant {}

export type NimbusGroupVariantProps = {
  [K in keyof NimbusGroupVariant]?: ConditionalValue<NimbusGroupVariant[K]> | undefined
}

export type NimbusGroupVariantMap = {
  [K in keyof NimbusGroupVariant]: Array<NimbusGroupVariant[K]>
}

export interface NimbusHeadingVariant {
  /** @default "xl" */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | undefined
}

export type NimbusHeadingVariantProps = {
  [K in keyof NimbusHeadingVariant]?: ConditionalValue<NimbusHeadingVariant[K]> | undefined
}

export type NimbusHeadingVariantMap = {
  [K in keyof NimbusHeadingVariant]: Array<NimbusHeadingVariant[K]>
}

export interface NimbusIconVariant {
  size?: "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | undefined
}

export type NimbusIconVariantProps = {
  [K in keyof NimbusIconVariant]?: ConditionalValue<NimbusIconVariant[K]> | undefined
}

export type NimbusIconVariantMap = {
  [K in keyof NimbusIconVariant]: Array<NimbusIconVariant[K]>
}

export interface NimbusKbdVariant {}

export type NimbusKbdVariantProps = {
  [K in keyof NimbusKbdVariant]?: ConditionalValue<NimbusKbdVariant[K]> | undefined
}

export type NimbusKbdVariantMap = {
  [K in keyof NimbusKbdVariant]: Array<NimbusKbdVariant[K]>
}

export interface NimbusLinkVariant {
  size?: "xs" | "sm" | "md" | undefined
  fontColor?: "primary" | "inherit" | undefined
}

export type NimbusLinkVariantProps = {
  [K in keyof NimbusLinkVariant]?: ConditionalValue<NimbusLinkVariant[K]> | undefined
}

export type NimbusLinkVariantMap = {
  [K in keyof NimbusLinkVariant]: Array<NimbusLinkVariant[K]>
}

export interface NimbusLoadingSpinnerVariant {
  /** @default "sm" */
  size?: "2xs" | "xs" | "sm" | "md" | "lg" | undefined
  colorPalette?: "primary" | "white" | undefined
}

export type NimbusLoadingSpinnerVariantProps = {
  [K in keyof NimbusLoadingSpinnerVariant]?: ConditionalValue<NimbusLoadingSpinnerVariant[K]> | undefined
}

export type NimbusLoadingSpinnerVariantMap = {
  [K in keyof NimbusLoadingSpinnerVariant]: Array<NimbusLoadingSpinnerVariant[K]>
}

export interface NimbusPopoverVariant {}

export type NimbusPopoverVariantProps = {
  [K in keyof NimbusPopoverVariant]?: ConditionalValue<NimbusPopoverVariant[K]> | undefined
}

export type NimbusPopoverVariantMap = {
  [K in keyof NimbusPopoverVariant]: Array<NimbusPopoverVariant[K]>
}

export interface NimbusRadioInputVariant {
  /** @default "vertical" */
  orientation?: "horizontal" | "vertical" | undefined
}

export type NimbusRadioInputVariantProps = {
  [K in keyof NimbusRadioInputVariant]?: ConditionalValue<NimbusRadioInputVariant[K]> | undefined
}

export type NimbusRadioInputVariantMap = {
  [K in keyof NimbusRadioInputVariant]: Array<NimbusRadioInputVariant[K]>
}

export interface NimbusSeparatorVariant {
  /** @default "horizontal" */
  orientation?: "horizontal" | "vertical" | undefined
}

export type NimbusSeparatorVariantProps = {
  [K in keyof NimbusSeparatorVariant]?: ConditionalValue<NimbusSeparatorVariant[K]> | undefined
}

export type NimbusSeparatorVariantMap = {
  [K in keyof NimbusSeparatorVariant]: Array<NimbusSeparatorVariant[K]>
}

export interface NimbusToggleButtonVariant {
  /** @default "md" */
  size?: "2xs" | "xs" | "md" | undefined
  /** @default "outline" */
  variant?: "outline" | "ghost" | undefined
}

export type NimbusToggleButtonVariantProps = {
  [K in keyof NimbusToggleButtonVariant]?: ConditionalValue<NimbusToggleButtonVariant[K]> | undefined
}

export type NimbusToggleButtonVariantMap = {
  [K in keyof NimbusToggleButtonVariant]: Array<NimbusToggleButtonVariant[K]>
}

export interface NimbusToolbarVariant {
  /** @default "md" */
  size?: "xs" | "md" | undefined
  orientation?: "horizontal" | "vertical" | undefined
  /** @default "plain" */
  variant?: "plain" | "outline" | undefined
}

export type NimbusToolbarVariantProps = {
  [K in keyof NimbusToolbarVariant]?: ConditionalValue<NimbusToolbarVariant[K]> | undefined
}

export type NimbusToolbarVariantMap = {
  [K in keyof NimbusToolbarVariant]: Array<NimbusToolbarVariant[K]>
}

export interface NimbusTooltipVariant {}

export type NimbusTooltipVariantProps = {
  [K in keyof NimbusTooltipVariant]?: ConditionalValue<NimbusTooltipVariant[K]> | undefined
}

export type NimbusTooltipVariantMap = {
  [K in keyof NimbusTooltipVariant]: Array<NimbusTooltipVariant[K]>
}

export interface ConfigRecipes {
  nimbusAvatar: SystemRecipeFn<NimbusAvatarVariantProps, NimbusAvatarVariantMap>
  nimbusBadge: SystemRecipeFn<NimbusBadgeVariantProps, NimbusBadgeVariantMap>
  nimbusButton: SystemRecipeFn<NimbusButtonVariantProps, NimbusButtonVariantMap>
  nimbusCode: SystemRecipeFn<NimbusCodeVariantProps, NimbusCodeVariantMap>
  nimbusGroup: SystemRecipeFn<NimbusGroupVariantProps, NimbusGroupVariantMap>
  nimbusHeading: SystemRecipeFn<NimbusHeadingVariantProps, NimbusHeadingVariantMap>
  nimbusIcon: SystemRecipeFn<NimbusIconVariantProps, NimbusIconVariantMap>
  nimbusKbd: SystemRecipeFn<NimbusKbdVariantProps, NimbusKbdVariantMap>
  nimbusLink: SystemRecipeFn<NimbusLinkVariantProps, NimbusLinkVariantMap>
  nimbusLoadingSpinner: SystemRecipeFn<NimbusLoadingSpinnerVariantProps, NimbusLoadingSpinnerVariantMap>
  nimbusPopover: SystemRecipeFn<NimbusPopoverVariantProps, NimbusPopoverVariantMap>
  nimbusRadioInput: SystemRecipeFn<NimbusRadioInputVariantProps, NimbusRadioInputVariantMap>
  nimbusSeparator: SystemRecipeFn<NimbusSeparatorVariantProps, NimbusSeparatorVariantMap>
  nimbusToggleButton: SystemRecipeFn<NimbusToggleButtonVariantProps, NimbusToggleButtonVariantMap>
  nimbusToolbar: SystemRecipeFn<NimbusToolbarVariantProps, NimbusToolbarVariantMap>
  nimbusTooltip: SystemRecipeFn<NimbusTooltipVariantProps, NimbusTooltipVariantMap>
}

// NimbusAccordion

export type NimbusAccordionSlot = "root" | "disclosure" | "trigger" | "panel" | "accordionTitle" | "headerContentRight"

export interface NimbusAccordionVariant {
  /** @default "md" */
  size?: "md" | "sm" | undefined
}

export type NimbusAccordionVariantProps = {
  [K in keyof NimbusAccordionVariant]?: ConditionalValue<NimbusAccordionVariant[K]> | undefined
}

export type NimbusAccordionVariantMap = {
  [K in keyof NimbusAccordionVariant]: Array<NimbusAccordionVariant[K]>
}

// NimbusAlert

export type NimbusAlertSlot = "root" | "title" | "description" | "icon" | "actions" | "dismissButton"

export interface NimbusAlertVariant {
  variant?: "flat" | "outlined" | undefined
}

export type NimbusAlertVariantProps = {
  [K in keyof NimbusAlertVariant]?: ConditionalValue<NimbusAlertVariant[K]> | undefined
}

export type NimbusAlertVariantMap = {
  [K in keyof NimbusAlertVariant]: Array<NimbusAlertVariant[K]>
}

// NimbusCalendar

export type NimbusCalendarSlot = "root" | "header" | "grids" | "monthTitle" | "grid" | "gridHeader" | "headerCell" | "gridBody" | "bodyCell"

export interface NimbusCalendarVariant {}

export type NimbusCalendarVariantProps = {
  [K in keyof NimbusCalendarVariant]?: ConditionalValue<NimbusCalendarVariant[K]> | undefined
}

export type NimbusCalendarVariantMap = {
  [K in keyof NimbusCalendarVariant]: Array<NimbusCalendarVariant[K]>
}

// NimbusCard

export type NimbusCardSlot = "root" | "header" | "content"

export interface NimbusCardVariant {
  /** @default "md" */
  cardPadding?: "sm" | "md" | "lg" | undefined
  /** @default "outlined" */
  borderStyle?: "none" | "outlined" | undefined
  /** @default "none" */
  elevation?: "none" | "elevated" | undefined
  /** @default "default" */
  backgroundStyle?: "default" | "muted" | undefined
}

export type NimbusCardVariantProps = {
  [K in keyof NimbusCardVariant]?: ConditionalValue<NimbusCardVariant[K]> | undefined
}

export type NimbusCardVariantMap = {
  [K in keyof NimbusCardVariant]: Array<NimbusCardVariant[K]>
}

// NimbusCheckbox

export type NimbusCheckboxSlot = "root" | "label" | "indicator"

export interface NimbusCheckboxVariant {
  /** @default "md" */
  size?: "md" | undefined
}

export type NimbusCheckboxVariantProps = {
  [K in keyof NimbusCheckboxVariant]?: ConditionalValue<NimbusCheckboxVariant[K]> | undefined
}

export type NimbusCheckboxVariantMap = {
  [K in keyof NimbusCheckboxVariant]: Array<NimbusCheckboxVariant[K]>
}

// NimbusCollapsibleMotion

export type NimbusCollapsibleMotionSlot = "root" | "trigger" | "content"

export interface NimbusCollapsibleMotionVariant {}

export type NimbusCollapsibleMotionVariantProps = {
  [K in keyof NimbusCollapsibleMotionVariant]?: ConditionalValue<NimbusCollapsibleMotionVariant[K]> | undefined
}

export type NimbusCollapsibleMotionVariantMap = {
  [K in keyof NimbusCollapsibleMotionVariant]: Array<NimbusCollapsibleMotionVariant[K]>
}

// NimbusCombobox

export type NimbusComboboxSlot =
  | "root"
  | "trigger"
  | "leadingElement"
  | "content"
  | "tagGroup"
  | "input"
  | "popover"
  | "listBox"
  | "section"
  | "option"
  | "optionIndicator"
  | "optionContent"

export interface NimbusComboboxVariant {
  /** @default "md" */
  size?: "sm" | "md" | undefined
  /** @default "solid" */
  variant?: "solid" | "ghost" | undefined
  /** @default "single" */
  selectionMode?: "multiple" | "single" | "none" | undefined
}

export type NimbusComboboxVariantProps = {
  [K in keyof NimbusComboboxVariant]?: ConditionalValue<NimbusComboboxVariant[K]> | undefined
}

export type NimbusComboboxVariantMap = {
  [K in keyof NimbusComboboxVariant]: Array<NimbusComboboxVariant[K]>
}

// NimbusDataTable

export type NimbusDataTableSlot =
  | "root"
  | "table"
  | "header"
  | "column"
  | "body"
  | "row"
  | "cell"
  | "footer"
  | "selectionCell"
  | "expandButton"
  | "nestedIcon"
  | "headerSortIcon"
  | "columnResizer"

export interface NimbusDataTableVariant {
  truncated?: boolean | undefined
  density?: "default" | "condensed" | undefined
}

export type NimbusDataTableVariantProps = {
  [K in keyof NimbusDataTableVariant]?: ConditionalValue<NimbusDataTableVariant[K]> | undefined
}

export type NimbusDataTableVariantMap = {
  [K in keyof NimbusDataTableVariant]: Array<NimbusDataTableVariant[K]>
}

// NimbusDateInput

export type NimbusDateInputSlot = "root" | "leadingElement" | "trailingElement" | "segmentGroup" | "segment"

export interface NimbusDateInputVariant {
  /** @default "md" */
  size?: "sm" | "md" | undefined
  /** @default "solid" */
  variant?: "solid" | "ghost" | "plain" | undefined
}

export type NimbusDateInputVariantProps = {
  [K in keyof NimbusDateInputVariant]?: ConditionalValue<NimbusDateInputVariant[K]> | undefined
}

export type NimbusDateInputVariantMap = {
  [K in keyof NimbusDateInputVariant]: Array<NimbusDateInputVariant[K]>
}

// NimbusDatePicker

export type NimbusDatePickerSlot = "root" | "group" | "popover" | "calendar" | "calendarHeader" | "calendarGrid" | "calendarCell"

export interface NimbusDatePickerVariant {
  /** @default "md" */
  size?: "sm" | "md" | undefined
  variant?: "solid" | "ghost" | undefined
}

export type NimbusDatePickerVariantProps = {
  [K in keyof NimbusDatePickerVariant]?: ConditionalValue<NimbusDatePickerVariant[K]> | undefined
}

export type NimbusDatePickerVariantMap = {
  [K in keyof NimbusDatePickerVariant]: Array<NimbusDatePickerVariant[K]>
}

// NimbusDateRangePicker

export type NimbusDateRangePickerSlot = "root" | "group" | "trigger" | "popover" | "calendar" | "calendarHeader" | "calendarGrid" | "calendarCell"

export interface NimbusDateRangePickerVariant {
  /** @default "md" */
  size?: "sm" | "md" | undefined
  /** @default "solid" */
  variant?: "solid" | "ghost" | undefined
}

export type NimbusDateRangePickerVariantProps = {
  [K in keyof NimbusDateRangePickerVariant]?: ConditionalValue<NimbusDateRangePickerVariant[K]> | undefined
}

export type NimbusDateRangePickerVariantMap = {
  [K in keyof NimbusDateRangePickerVariant]: Array<NimbusDateRangePickerVariant[K]>
}

// NimbusDialog

export type NimbusDialogSlot = "root" | "trigger" | "modalOverlay" | "modal" | "content" | "title" | "closeTrigger" | "header" | "body" | "footer"

export interface NimbusDialogVariant {
  /** @default "center" */
  placement?: "center" | "top" | "bottom" | undefined
  /** @default "outside" */
  scrollBehavior?: "inside" | "outside" | undefined
}

export type NimbusDialogVariantProps = {
  [K in keyof NimbusDialogVariant]?: ConditionalValue<NimbusDialogVariant[K]> | undefined
}

export type NimbusDialogVariantMap = {
  [K in keyof NimbusDialogVariant]: Array<NimbusDialogVariant[K]>
}

// NimbusDraggableList

export type NimbusDraggableListSlot = "root" | "empty" | "item" | "itemContent"

export interface NimbusDraggableListVariant {
  /** @default "md" */
  size?: "sm" | "md" | undefined
}

export type NimbusDraggableListVariantProps = {
  [K in keyof NimbusDraggableListVariant]?: ConditionalValue<NimbusDraggableListVariant[K]> | undefined
}

export type NimbusDraggableListVariantMap = {
  [K in keyof NimbusDraggableListVariant]: Array<NimbusDraggableListVariant[K]>
}

// NimbusDrawer

export type NimbusDrawerSlot = "root" | "trigger" | "modalOverlay" | "modal" | "content" | "title" | "closeTrigger" | "header" | "body" | "footer"

export interface NimbusDrawerVariant {
  /** @default true */
  showBackdrop?: boolean | undefined
  /** @default "right" */
  placement?: "left" | "right" | "top" | "bottom" | undefined
}

export type NimbusDrawerVariantProps = {
  [K in keyof NimbusDrawerVariant]?: ConditionalValue<NimbusDrawerVariant[K]> | undefined
}

export type NimbusDrawerVariantMap = {
  [K in keyof NimbusDrawerVariant]: Array<NimbusDrawerVariant[K]>
}

// NimbusFieldErrors

export type NimbusFieldErrorsSlot = "root" | "message"

export interface NimbusFieldErrorsVariant {}

export type NimbusFieldErrorsVariantProps = {
  [K in keyof NimbusFieldErrorsVariant]?: ConditionalValue<NimbusFieldErrorsVariant[K]> | undefined
}

export type NimbusFieldErrorsVariantMap = {
  [K in keyof NimbusFieldErrorsVariant]: Array<NimbusFieldErrorsVariant[K]>
}

// NimbusFormField

export type NimbusFormFieldSlot = "root" | "label" | "input" | "description" | "error" | "popover"

export interface NimbusFormFieldVariant {
  /** @default "md" */
  size?: "md" | "sm" | undefined
  /** @default "column" */
  direction?: "column" | "row" | undefined
}

export type NimbusFormFieldVariantProps = {
  [K in keyof NimbusFormFieldVariant]?: ConditionalValue<NimbusFormFieldVariant[K]> | undefined
}

export type NimbusFormFieldVariantMap = {
  [K in keyof NimbusFormFieldVariant]: Array<NimbusFormFieldVariant[K]>
}

// NimbusList

export type NimbusListSlot = "root" | "item" | "indicator"

export interface NimbusListVariant {
  /** @default "marker" */
  variant?: "marker" | "plain" | undefined
  align?: "center" | "start" | "end" | undefined
}

export type NimbusListVariantProps = {
  [K in keyof NimbusListVariant]?: ConditionalValue<NimbusListVariant[K]> | undefined
}

export type NimbusListVariantMap = {
  [K in keyof NimbusListVariant]: Array<NimbusListVariant[K]>
}

// NimbusLocalizedField

export type NimbusLocalizedFieldSlot =
  | "root"
  | "label"
  | "infoDialog"
  | "fieldsContainer"
  | "description"
  | "error"
  | "toggleButtonContainer"
  | "localeFieldRoot"
  | "localeFieldLabel"
  | "localeFieldInput"
  | "localeFieldDescription"
  | "localeFieldError"

export interface NimbusLocalizedFieldVariant {
  size?: "md" | "sm" | undefined
  type?: "text" | "multiLine" | "money" | "richText" | undefined
}

export type NimbusLocalizedFieldVariantProps = {
  [K in keyof NimbusLocalizedFieldVariant]?: ConditionalValue<NimbusLocalizedFieldVariant[K]> | undefined
}

export type NimbusLocalizedFieldVariantMap = {
  [K in keyof NimbusLocalizedFieldVariant]: Array<NimbusLocalizedFieldVariant[K]>
}

// NimbusMenu

export type NimbusMenuSlot = "root" | "trigger" | "popover" | "content" | "item" | "section" | "sectionLabel" | "submenu"

export interface NimbusMenuVariant {}

export type NimbusMenuVariantProps = {
  [K in keyof NimbusMenuVariant]?: ConditionalValue<NimbusMenuVariant[K]> | undefined
}

export type NimbusMenuVariantMap = {
  [K in keyof NimbusMenuVariant]: Array<NimbusMenuVariant[K]>
}

// NimbusMoneyInput

export type NimbusMoneyInputSlot = "root" | "container" | "currencySelect" | "currencyLabel" | "amountInput" | "badge"

export interface NimbusMoneyInputVariant {
  /** @default "md" */
  size?: "sm" | "md" | undefined
}

export type NimbusMoneyInputVariantProps = {
  [K in keyof NimbusMoneyInputVariant]?: ConditionalValue<NimbusMoneyInputVariant[K]> | undefined
}

export type NimbusMoneyInputVariantMap = {
  [K in keyof NimbusMoneyInputVariant]: Array<NimbusMoneyInputVariant[K]>
}

// NimbusMultilineTextInput

export type NimbusMultilineTextInputSlot = "root" | "leadingElement" | "textarea"

export interface NimbusMultilineTextInputVariant {
  /** @default "md" */
  size?: "sm" | "md" | undefined
  /** @default "solid" */
  variant?: "solid" | "ghost" | undefined
}

export type NimbusMultilineTextInputVariantProps = {
  [K in keyof NimbusMultilineTextInputVariant]?: ConditionalValue<NimbusMultilineTextInputVariant[K]> | undefined
}

export type NimbusMultilineTextInputVariantMap = {
  [K in keyof NimbusMultilineTextInputVariant]: Array<NimbusMultilineTextInputVariant[K]>
}

// NimbusNumberInput

export type NimbusNumberInputSlot = "root" | "leadingElement" | "trailingElement" | "input" | "incrementButton" | "decrementButton"

export interface NimbusNumberInputVariant {
  /** @default "md" */
  size?: "sm" | "md" | undefined
  /** @default "solid" */
  variant?: "solid" | "ghost" | undefined
}

export type NimbusNumberInputVariantProps = {
  [K in keyof NimbusNumberInputVariant]?: ConditionalValue<NimbusNumberInputVariant[K]> | undefined
}

export type NimbusNumberInputVariantMap = {
  [K in keyof NimbusNumberInputVariant]: Array<NimbusNumberInputVariant[K]>
}

// NimbusProgressBar

export type NimbusProgressBarSlot = "root" | "track" | "fill" | "label" | "value"

export interface NimbusProgressBarVariant {
  /** @default "md" */
  size?: "2xs" | "md" | undefined
  isDynamic?: boolean | undefined
  isIndeterminate?: boolean | undefined
  /** @default "solid" */
  variant?: "solid" | "contrast" | undefined
  /** @default "stacked" */
  layout?: "minimal" | "inline" | "stacked" | undefined
}

export type NimbusProgressBarVariantProps = {
  [K in keyof NimbusProgressBarVariant]?: ConditionalValue<NimbusProgressBarVariant[K]> | undefined
}

export type NimbusProgressBarVariantMap = {
  [K in keyof NimbusProgressBarVariant]: Array<NimbusProgressBarVariant[K]>
}

// NimbusRadioInput

export type NimbusRadioInputSlot = "root" | "option"

export interface NimbusRadioInputVariant {
  /** @default "vertical" */
  orientation?: "horizontal" | "vertical" | undefined
}

export type NimbusRadioInputVariantProps = {
  [K in keyof NimbusRadioInputVariant]?: ConditionalValue<NimbusRadioInputVariant[K]> | undefined
}

export type NimbusRadioInputVariantMap = {
  [K in keyof NimbusRadioInputVariant]: Array<NimbusRadioInputVariant[K]>
}

// NimbusRangeCalendar

export type NimbusRangeCalendarSlot = "root" | "header" | "grids" | "monthTitle" | "grid" | "gridHeader" | "headerCell" | "gridBody" | "bodyCell"

export interface NimbusRangeCalendarVariant {}

export type NimbusRangeCalendarVariantProps = {
  [K in keyof NimbusRangeCalendarVariant]?: ConditionalValue<NimbusRangeCalendarVariant[K]> | undefined
}

export type NimbusRangeCalendarVariantMap = {
  [K in keyof NimbusRangeCalendarVariant]: Array<NimbusRangeCalendarVariant[K]>
}

// NimbusRichTextInput

export type NimbusRichTextInputSlot = "root" | "toolbar" | "editable"

export interface NimbusRichTextInputVariant {}

export type NimbusRichTextInputVariantProps = {
  [K in keyof NimbusRichTextInputVariant]?: ConditionalValue<NimbusRichTextInputVariant[K]> | undefined
}

export type NimbusRichTextInputVariantMap = {
  [K in keyof NimbusRichTextInputVariant]: Array<NimbusRichTextInputVariant[K]>
}

// NimbusScopedSearchInput

export type NimbusScopedSearchInputSlot = "root" | "container" | "selectWrapper" | "searchWrapper"

export interface NimbusScopedSearchInputVariant {
  /** @default "md" */
  size?: "sm" | "md" | undefined
}

export type NimbusScopedSearchInputVariantProps = {
  [K in keyof NimbusScopedSearchInputVariant]?: ConditionalValue<NimbusScopedSearchInputVariant[K]> | undefined
}

export type NimbusScopedSearchInputVariantMap = {
  [K in keyof NimbusScopedSearchInputVariant]: Array<NimbusScopedSearchInputVariant[K]>
}

// NimbusSearchInput

export type NimbusSearchInputSlot = "root" | "leadingElement" | "input"

export interface NimbusSearchInputVariant {
  /** @default "md" */
  size?: "sm" | "md" | undefined
  /** @default "solid" */
  variant?: "solid" | "ghost" | undefined
}

export type NimbusSearchInputVariantProps = {
  [K in keyof NimbusSearchInputVariant]?: ConditionalValue<NimbusSearchInputVariant[K]> | undefined
}

export type NimbusSearchInputVariantMap = {
  [K in keyof NimbusSearchInputVariant]: Array<NimbusSearchInputVariant[K]>
}

// NimbusSelect

export type NimbusSelectSlot = "root" | "leadingElement" | "trigger" | "triggerLabel" | "options" | "optionGroup" | "option"

export interface NimbusSelectVariant {
  /** @default "md" */
  size?: "sm" | "md" | undefined
  /** @default "outline" */
  variant?: "outline" | "ghost" | undefined
  isClearable?: boolean | undefined
}

export type NimbusSelectVariantProps = {
  [K in keyof NimbusSelectVariant]?: ConditionalValue<NimbusSelectVariant[K]> | undefined
}

export type NimbusSelectVariantMap = {
  [K in keyof NimbusSelectVariant]: Array<NimbusSelectVariant[K]>
}

// NimbusSplitButton

export type NimbusSplitButtonSlot = "root" | "buttonGroup" | "primaryButton" | "dropdownTrigger"

export interface NimbusSplitButtonVariant {
  /** @default "solid" */
  variant?: "solid" | "ghost" | "outline" | "subtle" | "link" | undefined
}

export type NimbusSplitButtonVariantProps = {
  [K in keyof NimbusSplitButtonVariant]?: ConditionalValue<NimbusSplitButtonVariant[K]> | undefined
}

export type NimbusSplitButtonVariantMap = {
  [K in keyof NimbusSplitButtonVariant]: Array<NimbusSplitButtonVariant[K]>
}

// NimbusSwitch

export type NimbusSwitchSlot = "root" | "label" | "track" | "thumb"

export interface NimbusSwitchVariant {
  /** @default "md" */
  size?: "sm" | "md" | undefined
}

export type NimbusSwitchVariantProps = {
  [K in keyof NimbusSwitchVariant]?: ConditionalValue<NimbusSwitchVariant[K]> | undefined
}

export type NimbusSwitchVariantMap = {
  [K in keyof NimbusSwitchVariant]: Array<NimbusSwitchVariant[K]>
}

// NimbusTable

export type NimbusTableSlot = "root" | "header" | "body" | "row" | "columnHeader" | "cell" | "footer" | "caption"

export interface NimbusTableVariant {
  interactive?: boolean | undefined
  stickyHeader?: boolean | undefined
  striped?: boolean | undefined
  showColumnBorder?: boolean | undefined
  /** @default "line" */
  variant?: "line" | "outline" | undefined
  /** @default "md" */
  size?: "sm" | "md" | "lg" | undefined
}

export type NimbusTableVariantProps = {
  [K in keyof NimbusTableVariant]?: ConditionalValue<NimbusTableVariant[K]> | undefined
}

export type NimbusTableVariantMap = {
  [K in keyof NimbusTableVariant]: Array<NimbusTableVariant[K]>
}

// NimbusTabs

export type NimbusTabsSlot = "root" | "list" | "tab" | "panels" | "panel" | "trigger"

export interface NimbusTabsVariant {
  /** @default "line" */
  variant?: "line" | "pills" | undefined
  /** @default "horizontal" */
  orientation?: "horizontal" | "vertical" | undefined
  /** @default "start" */
  placement?: "start" | "end" | undefined
  /** @default "md" */
  size?: "sm" | "md" | "lg" | undefined
}

export type NimbusTabsVariantProps = {
  [K in keyof NimbusTabsVariant]?: ConditionalValue<NimbusTabsVariant[K]> | undefined
}

export type NimbusTabsVariantMap = {
  [K in keyof NimbusTabsVariant]: Array<NimbusTabsVariant[K]>
}

// NimbusTagGroup

export type NimbusTagGroupSlot = "root" | "tagList" | "tag"

export interface NimbusTagGroupVariant {
  /** @default "lg" */
  size?: "sm" | "md" | "lg" | undefined
}

export type NimbusTagGroupVariantProps = {
  [K in keyof NimbusTagGroupVariant]?: ConditionalValue<NimbusTagGroupVariant[K]> | undefined
}

export type NimbusTagGroupVariantMap = {
  [K in keyof NimbusTagGroupVariant]: Array<NimbusTagGroupVariant[K]>
}

// NimbusTextInput

export type NimbusTextInputSlot = "root" | "leadingElement" | "input" | "trailingElement"

export interface NimbusTextInputVariant {
  /** @default "md" */
  size?: "sm" | "md" | undefined
  /** @default "solid" */
  variant?: "solid" | "ghost" | undefined
}

export type NimbusTextInputVariantProps = {
  [K in keyof NimbusTextInputVariant]?: ConditionalValue<NimbusTextInputVariant[K]> | undefined
}

export type NimbusTextInputVariantMap = {
  [K in keyof NimbusTextInputVariant]: Array<NimbusTextInputVariant[K]>
}

// NimbusTimeInput

export type NimbusTimeInputSlot = "root" | "leadingElement" | "trailingElement" | "segmentGroup" | "segment"

export interface NimbusTimeInputVariant {
  /** @default "md" */
  size?: "sm" | "md" | undefined
  /** @default "solid" */
  variant?: "solid" | "ghost" | undefined
}

export type NimbusTimeInputVariantProps = {
  [K in keyof NimbusTimeInputVariant]?: ConditionalValue<NimbusTimeInputVariant[K]> | undefined
}

export type NimbusTimeInputVariantMap = {
  [K in keyof NimbusTimeInputVariant]: Array<NimbusTimeInputVariant[K]>
}

// NimbusToggleButtonGroup

export type NimbusToggleButtonGroupSlot = "root" | "button"

export interface NimbusToggleButtonGroupVariant {
  /** @default "md" */
  size?: "xs" | "md" | undefined
  colorPalette?: "primary" | "critical" | "neutral" | undefined
}

export type NimbusToggleButtonGroupVariantProps = {
  [K in keyof NimbusToggleButtonGroupVariant]?: ConditionalValue<NimbusToggleButtonGroupVariant[K]> | undefined
}

export type NimbusToggleButtonGroupVariantMap = {
  [K in keyof NimbusToggleButtonGroupVariant]: Array<NimbusToggleButtonGroupVariant[K]>
}

export interface ConfigSlotRecipes {
  nimbusAccordion: SystemSlotRecipeFn<NimbusAccordionSlot, NimbusAccordionVariantProps, NimbusAccordionVariantMap>
  nimbusAlert: SystemSlotRecipeFn<NimbusAlertSlot, NimbusAlertVariantProps, NimbusAlertVariantMap>
  nimbusCalendar: SystemSlotRecipeFn<NimbusCalendarSlot, NimbusCalendarVariantProps, NimbusCalendarVariantMap>
  nimbusCard: SystemSlotRecipeFn<NimbusCardSlot, NimbusCardVariantProps, NimbusCardVariantMap>
  nimbusCheckbox: SystemSlotRecipeFn<NimbusCheckboxSlot, NimbusCheckboxVariantProps, NimbusCheckboxVariantMap>
  nimbusCollapsibleMotion: SystemSlotRecipeFn<NimbusCollapsibleMotionSlot, NimbusCollapsibleMotionVariantProps, NimbusCollapsibleMotionVariantMap>
  nimbusCombobox: SystemSlotRecipeFn<NimbusComboboxSlot, NimbusComboboxVariantProps, NimbusComboboxVariantMap>
  nimbusDataTable: SystemSlotRecipeFn<NimbusDataTableSlot, NimbusDataTableVariantProps, NimbusDataTableVariantMap>
  nimbusDateInput: SystemSlotRecipeFn<NimbusDateInputSlot, NimbusDateInputVariantProps, NimbusDateInputVariantMap>
  nimbusDatePicker: SystemSlotRecipeFn<NimbusDatePickerSlot, NimbusDatePickerVariantProps, NimbusDatePickerVariantMap>
  nimbusDateRangePicker: SystemSlotRecipeFn<NimbusDateRangePickerSlot, NimbusDateRangePickerVariantProps, NimbusDateRangePickerVariantMap>
  nimbusDialog: SystemSlotRecipeFn<NimbusDialogSlot, NimbusDialogVariantProps, NimbusDialogVariantMap>
  nimbusDraggableList: SystemSlotRecipeFn<NimbusDraggableListSlot, NimbusDraggableListVariantProps, NimbusDraggableListVariantMap>
  nimbusDrawer: SystemSlotRecipeFn<NimbusDrawerSlot, NimbusDrawerVariantProps, NimbusDrawerVariantMap>
  nimbusFieldErrors: SystemSlotRecipeFn<NimbusFieldErrorsSlot, NimbusFieldErrorsVariantProps, NimbusFieldErrorsVariantMap>
  nimbusFormField: SystemSlotRecipeFn<NimbusFormFieldSlot, NimbusFormFieldVariantProps, NimbusFormFieldVariantMap>
  nimbusList: SystemSlotRecipeFn<NimbusListSlot, NimbusListVariantProps, NimbusListVariantMap>
  nimbusLocalizedField: SystemSlotRecipeFn<NimbusLocalizedFieldSlot, NimbusLocalizedFieldVariantProps, NimbusLocalizedFieldVariantMap>
  nimbusMenu: SystemSlotRecipeFn<NimbusMenuSlot, NimbusMenuVariantProps, NimbusMenuVariantMap>
  nimbusMoneyInput: SystemSlotRecipeFn<NimbusMoneyInputSlot, NimbusMoneyInputVariantProps, NimbusMoneyInputVariantMap>
  nimbusMultilineTextInput: SystemSlotRecipeFn<NimbusMultilineTextInputSlot, NimbusMultilineTextInputVariantProps, NimbusMultilineTextInputVariantMap>
  nimbusNumberInput: SystemSlotRecipeFn<NimbusNumberInputSlot, NimbusNumberInputVariantProps, NimbusNumberInputVariantMap>
  nimbusProgressBar: SystemSlotRecipeFn<NimbusProgressBarSlot, NimbusProgressBarVariantProps, NimbusProgressBarVariantMap>
  nimbusRadioInput: SystemSlotRecipeFn<NimbusRadioInputSlot, NimbusRadioInputVariantProps, NimbusRadioInputVariantMap>
  nimbusRangeCalendar: SystemSlotRecipeFn<NimbusRangeCalendarSlot, NimbusRangeCalendarVariantProps, NimbusRangeCalendarVariantMap>
  nimbusRichTextInput: SystemSlotRecipeFn<NimbusRichTextInputSlot, NimbusRichTextInputVariantProps, NimbusRichTextInputVariantMap>
  nimbusScopedSearchInput: SystemSlotRecipeFn<NimbusScopedSearchInputSlot, NimbusScopedSearchInputVariantProps, NimbusScopedSearchInputVariantMap>
  nimbusSearchInput: SystemSlotRecipeFn<NimbusSearchInputSlot, NimbusSearchInputVariantProps, NimbusSearchInputVariantMap>
  nimbusSelect: SystemSlotRecipeFn<NimbusSelectSlot, NimbusSelectVariantProps, NimbusSelectVariantMap>
  nimbusSplitButton: SystemSlotRecipeFn<NimbusSplitButtonSlot, NimbusSplitButtonVariantProps, NimbusSplitButtonVariantMap>
  nimbusSwitch: SystemSlotRecipeFn<NimbusSwitchSlot, NimbusSwitchVariantProps, NimbusSwitchVariantMap>
  nimbusTable: SystemSlotRecipeFn<NimbusTableSlot, NimbusTableVariantProps, NimbusTableVariantMap>
  nimbusTabs: SystemSlotRecipeFn<NimbusTabsSlot, NimbusTabsVariantProps, NimbusTabsVariantMap>
  nimbusTagGroup: SystemSlotRecipeFn<NimbusTagGroupSlot, NimbusTagGroupVariantProps, NimbusTagGroupVariantMap>
  nimbusTextInput: SystemSlotRecipeFn<NimbusTextInputSlot, NimbusTextInputVariantProps, NimbusTextInputVariantMap>
  nimbusTimeInput: SystemSlotRecipeFn<NimbusTimeInputSlot, NimbusTimeInputVariantProps, NimbusTimeInputVariantMap>
  nimbusToggleButtonGroup: SystemSlotRecipeFn<NimbusToggleButtonGroupSlot, NimbusToggleButtonGroupVariantProps, NimbusToggleButtonGroupVariantMap>
}

export interface ConfigRecipeSlots {
  nimbusAccordion: NimbusAccordionSlot
  nimbusAlert: NimbusAlertSlot
  nimbusCalendar: NimbusCalendarSlot
  nimbusCard: NimbusCardSlot
  nimbusCheckbox: NimbusCheckboxSlot
  nimbusCollapsibleMotion: NimbusCollapsibleMotionSlot
  nimbusCombobox: NimbusComboboxSlot
  nimbusDataTable: NimbusDataTableSlot
  nimbusDateInput: NimbusDateInputSlot
  nimbusDatePicker: NimbusDatePickerSlot
  nimbusDateRangePicker: NimbusDateRangePickerSlot
  nimbusDialog: NimbusDialogSlot
  nimbusDraggableList: NimbusDraggableListSlot
  nimbusDrawer: NimbusDrawerSlot
  nimbusFieldErrors: NimbusFieldErrorsSlot
  nimbusFormField: NimbusFormFieldSlot
  nimbusList: NimbusListSlot
  nimbusLocalizedField: NimbusLocalizedFieldSlot
  nimbusMenu: NimbusMenuSlot
  nimbusMoneyInput: NimbusMoneyInputSlot
  nimbusMultilineTextInput: NimbusMultilineTextInputSlot
  nimbusNumberInput: NimbusNumberInputSlot
  nimbusProgressBar: NimbusProgressBarSlot
  nimbusRadioInput: NimbusRadioInputSlot
  nimbusRangeCalendar: NimbusRangeCalendarSlot
  nimbusRichTextInput: NimbusRichTextInputSlot
  nimbusScopedSearchInput: NimbusScopedSearchInputSlot
  nimbusSearchInput: NimbusSearchInputSlot
  nimbusSelect: NimbusSelectSlot
  nimbusSplitButton: NimbusSplitButtonSlot
  nimbusSwitch: NimbusSwitchSlot
  nimbusTable: NimbusTableSlot
  nimbusTabs: NimbusTabsSlot
  nimbusTagGroup: NimbusTagGroupSlot
  nimbusTextInput: NimbusTextInputSlot
  nimbusTimeInput: NimbusTimeInputSlot
  nimbusToggleButtonGroup: NimbusToggleButtonGroupSlot
}

export type SlotRecipeRecord<T, K> = T extends keyof ConfigRecipeSlots ? Record<ConfigRecipeSlots[T], K> : Record<string, K>

export type SlotRecipeProps<T> = T extends keyof ConfigSlotRecipes
  ? ConfigSlotRecipes[T]["__type"] & { recipe?: SlotRecipeDefinition | undefined }
  : { recipe?: SlotRecipeDefinition | undefined }

export type RecipeProps<T> = T extends keyof ConfigRecipes
  ? ConfigRecipes[T]["__type"] & { recipe?: RecipeDefinition | undefined }
  : { recipe?: RecipeDefinition | undefined }
