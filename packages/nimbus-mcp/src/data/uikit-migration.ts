/**
 * UI Kit to Nimbus migration mapping data.
 *
 * Each entry describes how a UI Kit component maps to its Nimbus equivalent,
 * including import path, mapping type, prop change notes, and breaking changes.
 *
 * Source: migration-mapping.csv cross-referenced with Nimbus docs.
 */

/** The type of migration required for a UI Kit component. */
export type UiKitMappingType =
  | "direct" // 1:1 replacement with the same or very similar API
  | "variant" // Becomes a prop/variant value on a Nimbus component
  | "compound" // Replaced by composing multiple Nimbus components
  | "pattern" // Replaced by a design-token or layout pattern
  | "removed"; // No Nimbus equivalent

/** A single UI Kit → Nimbus migration entry. */
export interface UiKitMigrationEntry {
  /** UI Kit component name (e.g. "PrimaryButton"). */
  uiKitName: string;
  /** Nimbus equivalent component(s), or `null` if removed/no equivalent. */
  nimbusEquivalent: string | null;
  /** npm import path for the Nimbus equivalent (e.g. "@commercetools/nimbus"). */
  importPath: string | null;
  /** How the UI Kit component maps to its Nimbus equivalent. */
  mappingType: UiKitMappingType;
  /** Human-readable notes on key prop changes and usage differences. */
  notes: string;
  /** Specific breaking changes to be aware of during migration. */
  breakingChanges: string[];
}

// ---------------------------------------------------------------------------
// Migration data
// ---------------------------------------------------------------------------

const MIGRATION_DATA: UiKitMigrationEntry[] = [
  // -------------------------------------------------------------------------
  // Buttons
  // -------------------------------------------------------------------------
  {
    uiKitName: "AccessibleButton",
    nimbusEquivalent: "Button",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      "Use <Button> directly. Nimbus Button is accessible by default; no wrapper needed. " +
      "UI Kit used a required label prop for button text; Nimbus uses children.",
    breakingChanges: [
      "Remove AccessibleButton wrapper, use <Button> directly",
      "label prop replaced by children",
    ],
  },
  {
    uiKitName: "FlatButton",
    nimbusEquivalent: "Button",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Button variant="ghost"> or <Button variant="plain"> for flat styling. ' +
      "UI Kit tone prop ('primary'|'secondary'|'inverted'|'critical') maps to Nimbus colorScheme/variant.",
    breakingChanges: [
      "Replace FlatButton with <Button>",
      "label prop replaced by children",
      "tone prop replaced by variant/colorScheme",
      "iconPosition prop removed; use leftIcon/rightIcon slots",
    ],
  },
  {
    uiKitName: "LinkButton",
    nimbusEquivalent: "Button",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Button variant="plain" asChild> wrapping a router Link, or use <Button as="a" href="...">. ' +
      "UI Kit used a to prop (React Router LocationDescriptor); Nimbus uses href or asChild pattern.",
    breakingChanges: [
      "Replace LinkButton with <Button asChild> or <Button as='a'>",
      "label prop replaced by children",
      "to prop replaced by href (or use asChild with router Link)",
      "isExternal prop replaced by target='_blank' rel='noopener noreferrer'",
      "iconLeft prop replaced by leftIcon slot",
    ],
  },
  {
    uiKitName: "PrimaryButton",
    nimbusEquivalent: "Button",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Button variant="solid"> (the default variant). ' +
      "UI Kit used a required label prop; Nimbus uses children for button text.",
    breakingChanges: [
      "Replace PrimaryButton with <Button>",
      "label prop replaced by children",
      "iconLeft/iconRight props replaced by leftIcon/rightIcon slots",
      "tone prop ('urgent'|'primary'|'critical') replaced by colorScheme",
    ],
  },
  {
    uiKitName: "SecondaryButton",
    nimbusEquivalent: "Button",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Button variant="outline"> for the secondary style. ' +
      "UI Kit used a required label prop; Nimbus uses children.",
    breakingChanges: [
      "Replace SecondaryButton with <Button variant='outline'>",
      "label prop replaced by children",
      "iconLeft/iconRight props replaced by leftIcon/rightIcon slots",
      "theme prop ('default'|'info') replaced by colorScheme",
    ],
  },
  {
    uiKitName: "IconButton",
    nimbusEquivalent: "IconButton",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "Direct replacement. UI Kit passed the icon via an icon prop and used label for accessibility; " +
      "Nimbus passes icon as children and uses aria-label.",
    breakingChanges: [
      "label prop replaced by aria-label",
      "icon prop replaced by icon as children",
      "theme prop replaced by variant/colorScheme",
    ],
  },
  {
    uiKitName: "SecondaryIconButton",
    nimbusEquivalent: "IconButton",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <IconButton variant="outline"> or equivalent. ' +
      "UI Kit used a color prop ('solid'|'primary'|'info'); Nimbus uses variant/colorScheme.",
    breakingChanges: [
      "Replace SecondaryIconButton with <IconButton>",
      "color prop ('solid'|'primary'|'info') replaced by variant/colorScheme",
      "icon prop replaced by icon as children",
      "label prop replaced by aria-label",
    ],
  },
  {
    uiKitName: "PrimaryActionDropdown",
    nimbusEquivalent: "SplitButton",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "SplitButton combines a primary action button with a dropdown menu. Compose using SplitButton + Menu.",
    breakingChanges: [
      "Rename to SplitButton",
      "Menu items now use Nimbus Menu composition pattern",
    ],
  },

  // -------------------------------------------------------------------------
  // Form inputs — text
  // -------------------------------------------------------------------------
  {
    uiKitName: "TextInput",
    nimbusEquivalent: "TextInput",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "Direct replacement. UI Kit onChange was ChangeEvent<HTMLInputElement>; " +
      "Nimbus (React Aria) onChange receives a string value directly. " +
      "hasError/hasWarning replaced by isInvalid. isAutofocussed replaced by autoFocus.",
    breakingChanges: [
      "onChange now receives a string value instead of ChangeEvent<HTMLInputElement>",
      "hasError prop replaced by isInvalid",
      "hasWarning prop removed",
      "isAutofocussed replaced by autoFocus",
      "isCondensed prop removed",
    ],
  },
  {
    uiKitName: "TextField",
    nimbusEquivalent: "TextInputField",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "TextInputField wraps TextInput with label, description, and error message slots. " +
      "UI Kit used title for the label text, hint for helper text, and errors (Record) for validation.",
    breakingChanges: [
      "Rename to TextInputField",
      "title prop renamed to label",
      "hint prop renamed to description",
      "errors (Record<string, boolean>) replaced by errorMessage (string | ReactNode)",
      "warnings prop removed",
      "touched prop removed",
      "onChange now receives a string value instead of ChangeEvent<HTMLInputElement>",
    ],
  },
  {
    uiKitName: "MultilineTextInput",
    nimbusEquivalent: "MultilineTextInput",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "Direct replacement. UI Kit onChange was ChangeEvent<HTMLTextAreaElement>; " +
      "Nimbus onChange receives a string value. hasError replaced by isInvalid.",
    breakingChanges: [
      "onChange now receives a string value instead of ChangeEvent<HTMLTextAreaElement>",
      "hasError prop replaced by isInvalid",
      "hasWarning prop removed",
      "isAutofocussed replaced by autoFocus",
    ],
  },
  {
    uiKitName: "MultilineTextField",
    nimbusEquivalent: "MultilineTextInputField",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "Wraps MultilineTextInput with label, description, and error message. " +
      "UI Kit used title for the label text and hint for helper text.",
    breakingChanges: [
      "Rename to MultilineTextInputField",
      "title prop renamed to label",
      "hint prop renamed to description",
      "errors (Record) replaced by errorMessage (string | ReactNode)",
      "warnings prop removed",
      "onChange now receives a string value instead of ChangeEvent<HTMLTextAreaElement>",
    ],
  },
  {
    uiKitName: "PasswordInput",
    nimbusEquivalent: "PasswordInput",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "Direct replacement. Toggle visibility button is built in. " +
      "UI Kit onChange was ChangeEvent<HTMLInputElement>; Nimbus onChange receives a string.",
    breakingChanges: [
      "onChange now receives a string value instead of ChangeEvent<HTMLInputElement>",
      "hasError prop replaced by isInvalid",
      "isAutofocussed replaced by autoFocus",
    ],
  },
  {
    uiKitName: "PasswordField",
    nimbusEquivalent: "PasswordInputField",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes: "Wraps PasswordInput with label and error message slots.",
    breakingChanges: [
      "Rename to PasswordInputField",
      "title prop renamed to label",
      "hint prop renamed to description",
      "errors (Record) replaced by errorMessage",
    ],
  },
  {
    uiKitName: "SearchSelectInput",
    nimbusEquivalent: "SearchInput",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "SearchInput provides a text input with built-in search icon and clear button.",
    breakingChanges: [
      "Rename to SearchInput",
      "options prop removed; filtering is handled by parent state",
      "onInputChange replaced by onChange",
    ],
  },
  {
    uiKitName: "SearchSelectField",
    nimbusEquivalent: "SearchInputField",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes: "Wraps SearchInput with label and error message.",
    breakingChanges: ["Rename to SearchInputField"],
  },
  {
    uiKitName: "SelectableSearchInput",
    nimbusEquivalent: "ScopedSearchInput",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "ScopedSearchInput adds a scope/category selector alongside the search field.",
    breakingChanges: [
      "Rename to ScopedSearchInput",
      "scope options now use items prop with ScopedSearchInput.Item children",
    ],
  },

  // -------------------------------------------------------------------------
  // Form inputs — select / combobox
  // -------------------------------------------------------------------------
  {
    uiKitName: "SelectInput",
    nimbusEquivalent: "Select",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "Select uses a composable items pattern. Options become Select.Item children. " +
      "UI Kit onChange received a TCustomEvent with target.value (string); Nimbus onChange receives the selected key directly. " +
      "UI Kit option shape: { value: string, label: ReactNode, isDisabled?: boolean }.",
    breakingChanges: [
      "Rename to Select",
      "options array ({value, label}) replaced by Select.Item children",
      "onChange received TCustomEvent (target.value); now receives selected key directly",
      "isMulti support changed; check Nimbus Select API for multi-select",
      "appearance prop ('default'|'quiet'|'filter') replaced by variant",
    ],
  },
  {
    uiKitName: "CreatableSelectInput",
    nimbusEquivalent: "ComboBox",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "ComboBox supports both selection and free-text entry. Use allowsCustomValue prop for creatable behavior. " +
      "UI Kit onCreateOption callback is replaced by handling new values in onInputChange.",
    breakingChanges: [
      "Rename to ComboBox",
      "options array replaced by ComboBox.Item children",
      "onCreateOption replaced by allowsCustomValue + custom onInputChange logic",
      "onChange received TCustomEvent; now receives selected key directly",
    ],
  },
  {
    uiKitName: "AsyncCreatableSelectInput",
    nimbusEquivalent: "ComboBox",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      "Use ComboBox with allowsCustomValue and manage async loading via onInputChange + external state. " +
      "UI Kit provided a loadOptions callback; in Nimbus this is managed externally.",
    breakingChanges: [
      "Rename to ComboBox",
      "loadOptions callback replaced by onInputChange + external async fetch + items state",
      "onCreateOption replaced by allowsCustomValue + custom logic",
      "onChange received TCustomEvent; now receives selected key directly",
    ],
  },
  {
    uiKitName: "AsyncSelectInput",
    nimbusEquivalent: "ComboBox",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      "Use ComboBox and manage async options loading via onInputChange + external state. " +
      "UI Kit provided a loadOptions callback; in Nimbus this is managed externally.",
    breakingChanges: [
      "Rename to ComboBox",
      "loadOptions callback replaced by onInputChange + external async fetch + items state",
      "onChange received TCustomEvent; now receives selected key directly",
    ],
  },

  // -------------------------------------------------------------------------
  // Form inputs — number / money
  // -------------------------------------------------------------------------
  {
    uiKitName: "NumberInput",
    nimbusEquivalent: "NumberInput",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "Direct replacement. UI Kit value was string|number and onChange was ChangeEvent<HTMLInputElement>; " +
      "Nimbus value is a number and onChange receives a number directly. min/max/step prop names unchanged.",
    breakingChanges: [
      "onChange now receives a number instead of ChangeEvent<HTMLInputElement>",
      "value was string|number; now must be a number",
      "hasError prop replaced by isInvalid",
      "isAutofocussed replaced by autoFocus",
    ],
  },
  {
    uiKitName: "NumberField",
    nimbusEquivalent: "NumberInputField",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "Wraps NumberInput with label, description, and error message. " +
      "UI Kit used title for the label text and hint for helper text.",
    breakingChanges: [
      "Rename to NumberInputField",
      "title prop renamed to label",
      "hint prop renamed to description",
      "errors (Record) replaced by errorMessage",
    ],
  },
  {
    uiKitName: "MoneyInput",
    nimbusEquivalent: "MoneyInput",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "Direct replacement. Currency selector and amount field are composed internally. " +
      "UI Kit value shape was { amount: string, currencyCode: string }; Nimbus keeps the same shape. " +
      "UI Kit onChange received a TCustomEvent (not a plain object); check Nimbus onChange signature.",
    breakingChanges: [
      "onChange received TCustomEvent; now receives { amount, currencyCode } directly",
      "currencies prop for available currency options unchanged",
      "hasError prop replaced by isInvalid",
    ],
  },
  {
    uiKitName: "MoneyField",
    nimbusEquivalent: "MoneyInputField",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "Wraps MoneyInput with label, description, and error message. " +
      "UI Kit used title for the label text and hint for helper text.",
    breakingChanges: [
      "Rename to MoneyInputField",
      "title prop renamed to label",
      "hint prop renamed to description",
      "errors (Record) replaced by errorMessage",
    ],
  },

  // -------------------------------------------------------------------------
  // Form inputs — date / time
  // -------------------------------------------------------------------------
  {
    uiKitName: "DateInput",
    nimbusEquivalent: "DatePicker",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "DatePicker uses @internationalized/date value types (CalendarDate). " +
      "UI Kit value was a string ('YYYY-MM-DD' or ''); onChange received a TCustomEvent with a string value. " +
      "Nimbus value is a CalendarDate object and onChange receives a CalendarDate.",
    breakingChanges: [
      "Rename to DatePicker",
      "value changed from 'YYYY-MM-DD' string to CalendarDate from @internationalized/date",
      "onChange received TCustomEvent with string; now receives CalendarDate directly",
      "minValue/maxValue changed from strings to CalendarDate objects",
    ],
  },
  {
    uiKitName: "DateTimeInput",
    nimbusEquivalent: "DatePicker",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      "Use DatePicker with granularity='minute' or 'second' to include time selection.",
    breakingChanges: [
      "Rename to DatePicker",
      "value must be a ZonedDateTime or CalendarDateTime",
      "Use granularity prop to enable time fields",
    ],
  },
  {
    uiKitName: "DateRangeInput",
    nimbusEquivalent: "DateRangePicker",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "DateRangePicker uses { start: CalendarDate, end: CalendarDate } value shape.",
    breakingChanges: [
      "Rename to DateRangePicker",
      "value shape changed to { start, end } using CalendarDate",
    ],
  },
  {
    uiKitName: "DateRangeField",
    nimbusEquivalent: "DateRangePickerField",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes: "Wraps DateRangePicker with label and error message.",
    breakingChanges: ["Rename to DateRangePickerField"],
  },
  {
    uiKitName: "TimeInput",
    nimbusEquivalent: "TimeInput",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "Direct replacement. value must be a Time object from @internationalized/date.",
    breakingChanges: ["value must be a Time from @internationalized/date"],
  },

  // -------------------------------------------------------------------------
  // Form inputs — checkbox / radio / toggle
  // -------------------------------------------------------------------------
  {
    uiKitName: "CheckboxInput",
    nimbusEquivalent: "Checkbox",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "Rename to Checkbox. UI Kit used isChecked and onChange: ChangeEventHandler<HTMLInputElement>; " +
      "Nimbus uses isSelected and onChange receives a boolean directly.",
    breakingChanges: [
      "Rename to Checkbox",
      "isChecked prop renamed to isSelected",
      "onChange received ChangeEvent<HTMLInputElement>; now receives boolean isSelected directly",
    ],
  },
  {
    uiKitName: "RadioInput",
    nimbusEquivalent: "RadioInput",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "Direct replacement. Group radios with RadioGroup parent for accessible keyboard navigation.",
    breakingChanges: ["Wrap in RadioGroup for group behavior"],
  },
  {
    uiKitName: "ToggleInput",
    nimbusEquivalent: "Switch",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "Rename to Switch. UI Kit used isChecked and onChange: ChangeEventHandler<HTMLInputElement> (target.checked); " +
      "Nimbus Switch uses isSelected and onChange receives a boolean directly.",
    breakingChanges: [
      "Rename to Switch",
      "isChecked prop renamed to isSelected",
      "onChange received ChangeEvent (target.checked); now receives boolean isSelected directly",
      "size prop ('small'|'big') replaced by Nimbus size tokens",
    ],
  },

  // -------------------------------------------------------------------------
  // Form inputs — localized
  // -------------------------------------------------------------------------
  {
    uiKitName: "LocalizedTextInput",
    nimbusEquivalent: "LocalizedField",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes: "Use LocalizedField wrapping TextInput children for each locale.",
    breakingChanges: [
      "Replace LocalizedTextInput with LocalizedField + TextInput composition",
      "selectedLanguage prop replaced by locale prop",
    ],
  },
  {
    uiKitName: "LocalizedTextField",
    nimbusEquivalent: "LocalizedField",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      "Use LocalizedField wrapping TextInputField children for each locale.",
    breakingChanges: [
      "Replace LocalizedTextField with LocalizedField + TextInputField composition",
    ],
  },
  {
    uiKitName: "LocalizedMultilineTextField",
    nimbusEquivalent: "LocalizedField",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes: "Use LocalizedField wrapping MultilineTextInputField children.",
    breakingChanges: [
      "Replace LocalizedMultilineTextField with LocalizedField + MultilineTextInputField",
    ],
  },
  {
    uiKitName: "LocalizedMoneyInput",
    nimbusEquivalent: "LocalizedField",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes: "Use LocalizedField wrapping MoneyInput children for each locale.",
    breakingChanges: [
      "Replace LocalizedMoneyInput with LocalizedField + MoneyInput composition",
    ],
  },
  {
    uiKitName: "LocalizedRichTextInput",
    nimbusEquivalent: "LocalizedField",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      "Use LocalizedField wrapping RichTextInput children for each locale.",
    breakingChanges: [
      "Replace LocalizedRichTextInput with LocalizedField + RichTextInput composition",
    ],
  },

  // -------------------------------------------------------------------------
  // Form structure
  // -------------------------------------------------------------------------
  {
    uiKitName: "FieldErrors",
    nimbusEquivalent: "FieldErrors",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "Direct replacement. Used inside *Field components for error display.",
    breakingChanges: [],
  },
  {
    uiKitName: "AdditionalInfoMessage",
    nimbusEquivalent: "Text + FormField",
    importPath: "@commercetools/nimbus",
    mappingType: "compound",
    notes:
      "Compose FormField with a description prop, or use <Text size='sm' color='neutral.500'>.",
    breakingChanges: [
      "Replace AdditionalInfoMessage with FormField description prop or Text component",
    ],
  },
  {
    uiKitName: "ErrorMessage",
    nimbusEquivalent: "Text + FormField",
    importPath: "@commercetools/nimbus",
    mappingType: "compound",
    notes:
      "Use FormField errorMessage prop or <Text color='danger.500'> for standalone error text.",
    breakingChanges: [
      "Replace ErrorMessage with FormField errorMessage prop or Text",
    ],
  },
  {
    uiKitName: "WarningMessage",
    nimbusEquivalent: "Text + FormField",
    importPath: "@commercetools/nimbus",
    mappingType: "compound",
    notes:
      "Use <Text color='warning.500'> or a FormField description for warnings.",
    breakingChanges: [
      "Replace WarningMessage with Text + appropriate color token",
    ],
  },

  // -------------------------------------------------------------------------
  // Rich text
  // -------------------------------------------------------------------------
  {
    uiKitName: "RichTextInput",
    nimbusEquivalent: "RichTextInput",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes: "Direct replacement. Editor toolbar configuration API has changed.",
    breakingChanges: [
      "toolbar configuration prop shape has changed; consult Nimbus docs",
    ],
  },

  // -------------------------------------------------------------------------
  // Data display
  // -------------------------------------------------------------------------
  {
    uiKitName: "Avatar",
    nimbusEquivalent: "Avatar",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes: "Direct replacement. name prop is still used for initials fallback.",
    breakingChanges: [],
  },
  {
    uiKitName: "Stamp",
    nimbusEquivalent: "Badge",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "Rename to Badge. Both use a tone prop, but the tone values differ. " +
      "UI Kit tones: 'critical'|'warning'|'positive'|'information'|'primary'|'secondary'. " +
      "Nimbus tones: 'danger'|'warning'|'success'|'info'.",
    breakingChanges: [
      "Rename to Badge",
      "tone value 'critical' → 'danger'",
      "tone value 'positive' → 'success'",
      "tone value 'information' → 'info'",
      "tone values 'primary' and 'secondary' have no direct equivalent; use 'neutral' or default",
      "isCondensed prop removed; use size prop instead",
    ],
  },
  {
    uiKitName: "Tag",
    nimbusEquivalent: "TagGroup",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      "Use TagGroup with a single TagGroup.Item for a standalone tag. TagGroup manages selection/removal state.",
    breakingChanges: [
      "Wrap single Tag in <TagGroup><TagGroup.Item></TagGroup.Item></TagGroup>",
      "onRemove now receives a key-based Set",
    ],
  },
  {
    uiKitName: "TagList",
    nimbusEquivalent: "TagGroup",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "Replace TagList with TagGroup. Each tag becomes a TagGroup.Item child.",
    breakingChanges: [
      "Rename to TagGroup",
      "items array replaced by TagGroup.Item children",
    ],
  },
  {
    uiKitName: "ProgressBar",
    nimbusEquivalent: "ProgressBar",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes: "Direct replacement. value is a 0–100 number.",
    breakingChanges: [],
  },
  {
    uiKitName: "LoadingSpinner",
    nimbusEquivalent: "LoadingSpinner",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes: "Direct replacement.",
    breakingChanges: [],
  },
  {
    uiKitName: "DataTable",
    nimbusEquivalent: "DataTable",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "Direct replacement. Column definitions use the new columns prop with accessor keys.",
    breakingChanges: [
      "columns prop shape changed to use accessor and header fields",
      "Row selection API updated to use onSelectionChange with a Set of keys",
    ],
  },
  {
    uiKitName: "DataTableManager",
    nimbusEquivalent: "DataTableManager",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "Direct replacement. Works alongside DataTable for column management.",
    breakingChanges: [],
  },

  // -------------------------------------------------------------------------
  // Navigation
  // -------------------------------------------------------------------------
  {
    uiKitName: "Link",
    nimbusEquivalent: "Link",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes: "Direct replacement. Use asChild for router library integration.",
    breakingChanges: [
      "isExternal prop renamed to target='_blank' + rel='noopener'",
    ],
  },
  {
    uiKitName: "DropdownMenu",
    nimbusEquivalent: "Menu",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "Rename to Menu. Uses composable Menu.Trigger, Menu.Content, and Menu.Item children.",
    breakingChanges: [
      "Rename to Menu",
      "options array replaced by Menu.Item children composition",
      "onSelect replaced by onAction on Menu.Item or Menu",
    ],
  },
  {
    uiKitName: "Pagination",
    nimbusEquivalent: "Pagination",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes: "Direct replacement. page/totalPages prop names are unchanged.",
    breakingChanges: ["onPageChange receives a page number directly"],
  },

  // -------------------------------------------------------------------------
  // Overlays
  // -------------------------------------------------------------------------
  {
    uiKitName: "Tooltip",
    nimbusEquivalent: "Tooltip",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "Tooltip wraps a trigger element. Use Tooltip.Trigger and Tooltip.Content composition.",
    breakingChanges: [
      "Compositional API: replace single prop with Tooltip.Trigger + Tooltip.Content",
    ],
  },

  // -------------------------------------------------------------------------
  // Feedback
  // -------------------------------------------------------------------------
  {
    uiKitName: "ContentNotification",
    nimbusEquivalent: "Alert",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes: "Rename to Alert. tone prop replaces type prop for semantic intent.",
    breakingChanges: [
      "Rename to Alert",
      "type prop replaced by tone ('info', 'success', 'warning', 'danger')",
    ],
  },

  // -------------------------------------------------------------------------
  // Layout
  // -------------------------------------------------------------------------
  {
    uiKitName: "Grid",
    nimbusEquivalent: "Grid",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "Direct replacement. Uses Chakra UI Grid props (columns, gap, etc.).",
    breakingChanges: [],
  },
  {
    uiKitName: "Constraints.Horizontal",
    nimbusEquivalent: "Design tokens",
    importPath: "@commercetools/nimbus-tokens",
    mappingType: "pattern",
    notes:
      "Replace Constraints.Horizontal with maxWidth design tokens or the Box/Container component.",
    breakingChanges: [
      "Remove Constraints.Horizontal",
      "Use maxWidth prop with design token values on Box or Container",
    ],
  },
  {
    uiKitName: "Spacings.Inline",
    nimbusEquivalent: "Stack",
    importPath: "@commercetools/nimbus",
    mappingType: "pattern",
    notes: 'Use <Stack direction="row" gap={...}> with nimbus spacing tokens.',
    breakingChanges: [
      "Replace Spacings.Inline with <Stack direction='row'>",
      "Spacing values use design token scale (e.g. gap='300')",
    ],
  },
  {
    uiKitName: "Spacings.Inset",
    nimbusEquivalent: "Stack",
    importPath: "@commercetools/nimbus",
    mappingType: "pattern",
    notes:
      "Use <Box padding={...}> with nimbus spacing tokens for inset padding.",
    breakingChanges: [
      "Replace Spacings.Inset with padding prop on Box",
      "Spacing values use design token scale",
    ],
  },
  {
    uiKitName: "Spacings.InsetSquish",
    nimbusEquivalent: "Stack",
    importPath: "@commercetools/nimbus",
    mappingType: "pattern",
    notes:
      "Use <Box paddingX={...} paddingY={...}> with asymmetric nimbus spacing tokens.",
    breakingChanges: [
      "Replace Spacings.InsetSquish with paddingX/paddingY props on Box",
    ],
  },
  {
    uiKitName: "Spacings.Stack",
    nimbusEquivalent: "Stack",
    importPath: "@commercetools/nimbus",
    mappingType: "pattern",
    notes:
      'Use <Stack direction="column" gap={...}> with nimbus spacing tokens.',
    breakingChanges: [
      "Replace Spacings.Stack with <Stack direction='column'>",
      "Spacing values use design token scale",
    ],
  },

  // -------------------------------------------------------------------------
  // Structure / containers
  // -------------------------------------------------------------------------
  {
    uiKitName: "Card",
    nimbusEquivalent: "Card",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "Direct replacement. Composable with Card.Header, Card.Body, Card.Footer.",
    breakingChanges: [
      "Adopt compositional slot API (Card.Header, Card.Body, etc.)",
    ],
  },
  {
    uiKitName: "CollapsiblePanel",
    nimbusEquivalent: "Accordion",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "Rename to Accordion. Uses Accordion.Item, Accordion.Trigger, Accordion.Content composition. " +
      "UI Kit used isClosed (controlled) + onToggle; the header was a prop, not a child slot.",
    breakingChanges: [
      "Rename to Accordion",
      "Adopt compositional slot API (Accordion.Item, Accordion.Trigger, Accordion.Content)",
      "isClosed prop replaced by React Aria controlled/uncontrolled pattern",
      "header prop replaced by Accordion.Trigger child",
      "condensed prop removed",
      "tone prop ('urgent'|'primary') replaced by Nimbus design tokens",
    ],
  },
  {
    uiKitName: "CollapsibleMotion",
    nimbusEquivalent: "CollapsibleMotion",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "Direct replacement. Wraps children with animated height transition.",
    breakingChanges: [],
  },

  // -------------------------------------------------------------------------
  // Typography
  // -------------------------------------------------------------------------
  {
    uiKitName: "Text.Body",
    nimbusEquivalent: "Text",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes: 'Use <Text size="md"> (default size).',
    breakingChanges: ["Replace Text.Body with <Text> (default size is body)"],
  },
  {
    uiKitName: "Text.Caption",
    nimbusEquivalent: "Text",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes: 'Use <Text size="xs"> for caption-sized text.',
    breakingChanges: ["Replace Text.Caption with <Text size='xs'>"],
  },
  {
    uiKitName: "Text.Detail",
    nimbusEquivalent: "Text",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes: 'Use <Text size="sm"> for detail/small text.',
    breakingChanges: ["Replace Text.Detail with <Text size='sm'>"],
  },
  {
    uiKitName: "Text.Headline",
    nimbusEquivalent: "Text",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes: 'Use <Text size="2xl" fontWeight="bold"> or the Heading component.',
    breakingChanges: [
      "Replace Text.Headline with <Text size='2xl' fontWeight='bold'> or <Heading>",
    ],
  },
  {
    uiKitName: "Text.Subheadline",
    nimbusEquivalent: "Text",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes: 'Use <Text size="xl">.',
    breakingChanges: ["Replace Text.Subheadline with <Text size='xl'>"],
  },
  {
    uiKitName: "Text.Wrap",
    nimbusEquivalent: "Text",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes: "Use <Text> with the wrapping element set via the as prop.",
    breakingChanges: [
      "Replace Text.Wrap with <Text> and control wrapping via CSS/props",
    ],
  },
  {
    uiKitName: "Label",
    nimbusEquivalent: "Text",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Text as="label" size="sm" fontWeight="medium"> or FormField label prop.',
    breakingChanges: [
      "Replace Label with <Text as='label'> or use FormField label prop",
    ],
  },

  // -------------------------------------------------------------------------
  // Icons
  // -------------------------------------------------------------------------
  {
    uiKitName: "CustomIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      "Use <Icon> component wrapping an SVG, or use InlineSvg for custom SVGs.",
    breakingChanges: [
      "Replace CustomIcon with <Icon> or <InlineSvg>",
      "SVG must be passed as a child or via as prop",
    ],
  },
  {
    uiKitName: "LeadingIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      "Pass icon as a child to the parent component (e.g. Button leftIcon slot) rather than using a wrapper.",
    breakingChanges: [
      "Remove LeadingIcon wrapper",
      "Pass icon directly to the parent component's icon slot",
    ],
  },
  {
    uiKitName: "InlineSvg",
    nimbusEquivalent: "InlineSvg",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes: "Direct replacement for custom SVG icons not in the icon library.",
    breakingChanges: [],
  },
  {
    uiKitName: "Icon Library",
    nimbusEquivalent: "Material Icon Library",
    importPath: "@commercetools/nimbus-icons",
    mappingType: "pattern",
    notes:
      "Import icons from @commercetools/nimbus-icons. Icons are named SvgIconName (e.g. SvgAccountCircle).",
    breakingChanges: [
      "Update import paths to @commercetools/nimbus-icons",
      "Icon names follow Svg prefix convention",
    ],
  },

  // -------------------------------------------------------------------------
  // Accessibility utilities
  // -------------------------------------------------------------------------
  {
    uiKitName: "HiddenInput",
    nimbusEquivalent: "VisuallyHidden",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "VisuallyHidden renders content that is visually hidden but accessible to screen readers.",
    breakingChanges: ["Rename to VisuallyHidden"],
  },
  {
    uiKitName: "AccessibleHidden",
    nimbusEquivalent: "VisuallyHidden",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      "Use VisuallyHidden for content that should be screen-reader accessible only.",
    breakingChanges: ["Replace AccessibleHidden with VisuallyHidden"],
  },

  // -------------------------------------------------------------------------
  // Provider
  // -------------------------------------------------------------------------
  {
    uiKitName: "ThemeProvider",
    nimbusEquivalent: "NimbusProvider",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "Rename to NimbusProvider. Wrap your app root once; passes theme and i18n context.",
    breakingChanges: [
      "Rename to NimbusProvider",
      "theme prop configuration has changed; see NimbusProvider docs",
    ],
  },
];

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

/** O(1) lookup map keyed by UI Kit component name. */
const MIGRATION_MAP = new Map<string, UiKitMigrationEntry>(
  MIGRATION_DATA.map((entry) => [entry.uiKitName, entry])
);

/**
 * Returns the migration entry for a given UI Kit component name.
 *
 * @example
 * const entry = getUiKitMigration("PrimaryButton");
 * // { uiKitName: "PrimaryButton", nimbusEquivalent: "Button", ... }
 */
export function getUiKitMigration(
  uiKitName: string
): UiKitMigrationEntry | undefined {
  return MIGRATION_MAP.get(uiKitName);
}

/**
 * Returns all UI Kit migration entries.
 */
export function getAllUiKitMigrations(): UiKitMigrationEntry[] {
  return MIGRATION_DATA;
}

/** Pre-built map of compound root names to their sub-component entries. */
const COMPOUND_ROOT_MAP = new Map<string, UiKitMigrationEntry[]>();
for (const entry of MIGRATION_DATA) {
  const dotIdx = entry.uiKitName.indexOf(".");
  if (dotIdx > 0) {
    const root = entry.uiKitName.slice(0, dotIdx);
    const existing = COMPOUND_ROOT_MAP.get(root);
    if (existing) {
      existing.push(entry);
    } else {
      COMPOUND_ROOT_MAP.set(root, [entry]);
    }
  }
}

/**
 * Returns all sub-component migration entries for a compound root name.
 * e.g. "Spacings" → [Spacings.Stack, Spacings.Inline, Spacings.Inset, ...]
 *      "Text" → [Text.Body, Text.Caption, Text.Detail, ...]
 *
 * Returns undefined if the name is not a compound root.
 */
export function getUiKitCompoundMigrations(
  rootName: string
): UiKitMigrationEntry[] | undefined {
  return COMPOUND_ROOT_MAP.get(rootName);
}
