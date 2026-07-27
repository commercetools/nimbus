/**
 * UI Kit to Nimbus migration mapping data.
 *
 * Each entry describes how a UI Kit component maps to its Nimbus equivalent,
 * including import path, mapping type, prop change notes, and breaking changes.
 *
 * Source: migration-mapping.csv cross-referenced with Nimbus docs.
 */

import type { IconWrapper, UiKitMigrationEntry } from "../types.js";

// ---------------------------------------------------------------------------
// Shared icon-wrapper metadata
// ---------------------------------------------------------------------------

const ICON_WRAPPER_BASE: Omit<IconWrapper, "sizeMapping"> = {
  component: "Icon",
  importPath: "@commercetools/nimbus",
  defaultProps: { size: "2xs", color: "neutral.11" },
};

const ICON_SIZE_MAPPING: IconWrapper["sizeMapping"] = [
  { from: "small", to: "2xs" },
  { from: "medium", to: "xs" },
  { from: "big", to: "md" },
  { from: "10", to: "2xs" },
  { from: "20", to: "xs" },
  { from: "30", to: "sm" },
  { from: "40", to: "md" },
];

const ICON_WRAPPER: IconWrapper = {
  ...ICON_WRAPPER_BASE,
  sizeMapping: ICON_SIZE_MAPPING,
};

// ---------------------------------------------------------------------------
// Layout nesting guidance (shared across layout primitives)
// ---------------------------------------------------------------------------

const LAYOUT_NESTING_GUIDANCE =
  "When you encounter nested layout components (e.g. Constraints wrapping Spacings wrapping Card), " +
  "do NOT migrate each component independently. Instead, analyze the full nesting structure and migrate " +
  "it as a single unit. Nimbus layout primitives (Stack, Box, Grid) can often collapse multiple nested " +
  "UIKit wrappers into fewer elements. For example, a Constraints.Horizontal > Spacings.Stack > " +
  "Spacings.Inset chain can become a single <Box maxWidth={...} gap={...} padding={...}>.";

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
    propMappings: [
      {
        uiKitProp: "label",
        nimbusProp: null,
        changeType: "structural",
        notes: "Use children instead.",
      },
    ],
    propMigrations: [{ from: "label", to: "children" }],
  },
  {
    uiKitName: "FlatButton",
    nimbusEquivalent: "Button",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Button variant="ghost"> for flat styling. ' +
      "UI Kit tone prop ('primary'|'secondary'|'inverted'|'critical') maps to Nimbus colorPalette/variant.",
    breakingChanges: [
      "Replace FlatButton with <Button>",
      "Default color changed: UI Kit FlatButton was blue (tone='primary') by default; Nimbus Button defaults to colorPalette='neutral' (gray). Add colorPalette='primary' to preserve the blue appearance.",
      "label prop replaced by children",
      "tone prop replaced by variant/colorPalette",
      "iconPosition prop removed; pass icon as a child of <Button>",
    ],
    propMappings: [
      {
        uiKitProp: "_component",
        nimbusProp: "variant",
        changeType: "value-mapping",
        fixedValue: "ghost",
      },
      {
        uiKitProp: "label",
        nimbusProp: null,
        changeType: "structural",
        notes: "Use children instead.",
      },
      {
        uiKitProp: "tone",
        nimbusProp: "colorPalette",
        changeType: "value-mapping",
        valueMapping: [
          { from: "primary", to: "primary" },
          { from: "secondary", to: "neutral" },
          { from: "critical", to: "critical" },
        ],
        notes: "'inverted' has no direct equivalent; use variant/colorPalette.",
      },
      {
        uiKitProp: "icon",
        nimbusProp: null,
        changeType: "structural",
        notes: "Pass icon as a child.",
      },
      {
        uiKitProp: "iconPosition",
        nimbusProp: null,
        changeType: "removed",
        notes: "Pass icon as a child.",
      },
    ],
    propMigrations: [
      { from: "label", to: "children" },
      { from: "icon", to: "children", position: "before" },
    ],
  },
  {
    uiKitName: "LinkButton",
    nimbusEquivalent: "Button",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Button variant="link" asChild> wrapping a router Link, or use <Button as="a" href="...">. ' +
      "UI Kit used a to prop (React Router LocationDescriptor); Nimbus uses href or asChild pattern.",
    breakingChanges: [
      "Replace LinkButton with <Button asChild> or <Button as='a'>",
      "label prop replaced by children",
      "to prop replaced by href (or use asChild with router Link)",
      "isExternal prop replaced by target='_blank' rel='noopener noreferrer'",
      "iconLeft prop removed; pass icon as a child of <Button>",
    ],
    propMappings: [
      {
        uiKitProp: "_component",
        nimbusProp: "variant",
        changeType: "value-mapping",
        fixedValue: "link",
      },
      {
        uiKitProp: "label",
        nimbusProp: null,
        changeType: "structural",
        notes: "Use children instead.",
      },
      { uiKitProp: "to", nimbusProp: "href", changeType: "rename" },
      {
        uiKitProp: "isExternal",
        nimbusProp: null,
        changeType: "removed",
        notes: "Use target='_blank' rel='noopener noreferrer' instead.",
      },
      {
        uiKitProp: "iconLeft",
        nimbusProp: null,
        changeType: "removed",
        notes: "Pass icon as a child.",
      },
    ],
    propMigrations: [
      { from: "label", to: "children" },
      { from: "iconLeft", to: "children", position: "before" },
    ],
  },
  {
    uiKitName: "PrimaryButton",
    nimbusEquivalent: "Button",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Button variant="solid">. Note: the default Button variant is "subtle", so variant="solid" must be set explicitly. ' +
      "UI Kit used a required label prop; Nimbus uses children for button text.",
    breakingChanges: [
      "Replace PrimaryButton with <Button variant='solid'>",
      "Default color changed: UI Kit PrimaryButton was blue (tone='primary') by default; Nimbus Button defaults to colorPalette='neutral' (gray). Add colorPalette='primary' to preserve the blue appearance.",
      "label prop replaced by children",
      "iconLeft/iconRight props removed; pass icon as a child of <Button>",
      "tone prop ('urgent'|'primary'|'critical') replaced by colorPalette",
    ],
    propMappings: [
      {
        uiKitProp: "_component",
        nimbusProp: "variant",
        changeType: "value-mapping",
        fixedValue: "solid",
      },
      {
        uiKitProp: "label",
        nimbusProp: null,
        changeType: "structural",
        notes: "Use children instead.",
      },
      {
        uiKitProp: "tone",
        nimbusProp: "colorPalette",
        changeType: "value-mapping",
        valueMapping: [
          { from: "primary", to: "primary" },
          { from: "urgent", to: "critical" },
          { from: "critical", to: "critical" },
        ],
      },
      {
        uiKitProp: "iconLeft",
        nimbusProp: null,
        changeType: "removed",
        notes: "Pass icon as a child.",
      },
      {
        uiKitProp: "iconRight",
        nimbusProp: null,
        changeType: "removed",
        notes: "Pass icon as a child.",
      },
    ],
    propMigrations: [
      { from: "label", to: "children" },
      { from: "iconLeft", to: "children", position: "before" },
      { from: "iconRight", to: "children", position: "after" },
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
      "Default color changed: UI Kit SecondaryButton was blue (theme='default') by default; Nimbus Button defaults to colorPalette='neutral' (gray). Add colorPalette='primary' to preserve the blue appearance.",
      "label prop replaced by children",
      "iconLeft/iconRight props removed; pass icon as a child of <Button>",
      "theme prop ('default'|'info') replaced by colorPalette",
    ],
    propMappings: [
      {
        uiKitProp: "_component",
        nimbusProp: "variant",
        changeType: "value-mapping",
        fixedValue: "outline",
      },
      {
        uiKitProp: "label",
        nimbusProp: null,
        changeType: "structural",
        notes: "Use children instead.",
      },
      {
        uiKitProp: "theme",
        nimbusProp: "colorPalette",
        changeType: "value-mapping",
        valueMapping: [
          { from: "default", to: "primary" },
          { from: "info", to: "info" },
        ],
      },
      {
        uiKitProp: "iconLeft",
        nimbusProp: null,
        changeType: "removed",
        notes: "Pass icon as a child.",
      },
      {
        uiKitProp: "iconRight",
        nimbusProp: null,
        changeType: "removed",
        notes: "Pass icon as a child.",
      },
    ],
    propMigrations: [
      { from: "label", to: "children" },
      { from: "iconLeft", to: "children", position: "before" },
      { from: "iconRight", to: "children", position: "after" },
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
      "theme prop replaced by variant/colorPalette",
    ],
    propMappings: [
      { uiKitProp: "label", nimbusProp: "aria-label", changeType: "rename" },
      {
        uiKitProp: "icon",
        nimbusProp: null,
        changeType: "structural",
        notes: "Pass icon as children.",
      },
      {
        uiKitProp: "theme",
        nimbusProp: "variant",
        changeType: "structural",
        notes: "UIKit theme maps to both variant and colorPalette in Nimbus.",
      },
    ],
    propMigrations: [{ from: "icon", to: "children" }],
  },
  {
    uiKitName: "SecondaryIconButton",
    nimbusEquivalent: "IconButton",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <IconButton variant="outline"> or equivalent. ' +
      "UI Kit used a color prop ('solid'|'primary'|'info'); Nimbus uses variant/colorPalette.",
    breakingChanges: [
      "Replace SecondaryIconButton with <IconButton>",
      "color prop ('solid'|'primary'|'info') replaced by variant/colorPalette",
      "icon prop replaced by icon as children",
      "label prop replaced by aria-label",
    ],
    propMappings: [
      {
        uiKitProp: "color",
        nimbusProp: "variant",
        changeType: "value-mapping",
        valueMapping: [
          { from: "solid", to: "solid" },
          { from: "primary", to: "outline" },
          { from: "info", to: "outline" },
        ],
        notes:
          "Defaults to variant='outline' when no color prop is specified. " +
          "'primary'/'info' also imply a colorPalette; set colorPalette separately.",
      },
      {
        uiKitProp: "icon",
        nimbusProp: null,
        changeType: "structural",
        notes: "Pass icon as children.",
      },
      { uiKitProp: "label", nimbusProp: "aria-label", changeType: "rename" },
    ],
    propMigrations: [{ from: "icon", to: "children" }],
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
      "Default color changed: UI Kit PrimaryActionDropdown was blue by default; Nimbus SplitButton defaults to colorPalette='neutral' (gray). Add colorPalette='primary' to preserve the blue appearance.",
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
      "isCondensed prop replaced by size='sm'",
    ],
    propMappings: [
      { uiKitProp: "hasError", nimbusProp: "isInvalid", changeType: "rename" },
      { uiKitProp: "hasWarning", nimbusProp: null, changeType: "removed" },
      {
        uiKitProp: "isAutofocussed",
        nimbusProp: "autoFocus",
        changeType: "rename",
      },
      {
        uiKitProp: "isCondensed",
        nimbusProp: "size",
        changeType: "value-mapping",
        valueMapping: [{ from: "true", to: "sm" }],
      },
      {
        uiKitProp: "onChange",
        nimbusProp: "onChange",
        changeType: "structural",
        notes: "Receives string value instead of ChangeEvent.",
      },
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
      "errors (Record<string, boolean>) replaced by passing <FieldErrors> to the errorMessage prop",
      "warnings prop removed",
      "touched prop removed",
      "onChange now receives a string value instead of ChangeEvent<HTMLInputElement>",
    ],
    propMappings: [
      { uiKitProp: "title", nimbusProp: "label", changeType: "rename" },
      {
        uiKitProp: "hint",
        nimbusProp: "description",
        changeType: "rename",
      },
      {
        uiKitProp: "errors",
        nimbusProp: "errors",
        changeType: "structural",
        notes:
          "Now expects FieldErrorsData (from FieldErrors) instead of a Record<string, boolean>.",
      },
      { uiKitProp: "warnings", nimbusProp: null, changeType: "removed" },
      { uiKitProp: "touched", nimbusProp: null, changeType: "removed" },
      {
        uiKitProp: "onChange",
        nimbusProp: "onChange",
        changeType: "structural",
        notes: "Receives string value instead of ChangeEvent.",
      },
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
    propMappings: [
      { uiKitProp: "hasError", nimbusProp: "isInvalid", changeType: "rename" },
      { uiKitProp: "hasWarning", nimbusProp: null, changeType: "removed" },
      {
        uiKitProp: "isAutofocussed",
        nimbusProp: "autoFocus",
        changeType: "rename",
      },
      {
        uiKitProp: "onChange",
        nimbusProp: "onChange",
        changeType: "structural",
        notes: "Receives string value instead of ChangeEvent.",
      },
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
      "errors (Record) replaced by passing <FieldErrors> to the errorMessage prop",
      "warnings prop removed",
      "onChange now receives a string value instead of ChangeEvent<HTMLTextAreaElement>",
    ],
    propMappings: [
      { uiKitProp: "title", nimbusProp: "label", changeType: "rename" },
      {
        uiKitProp: "hint",
        nimbusProp: "description",
        changeType: "rename",
      },
      {
        uiKitProp: "errors",
        nimbusProp: "errors",
        changeType: "structural",
        notes:
          "Now expects FieldErrorsData (from FieldErrors) instead of a Record<string, boolean>.",
      },
      { uiKitProp: "warnings", nimbusProp: null, changeType: "removed" },
      {
        uiKitProp: "onChange",
        nimbusProp: "onChange",
        changeType: "structural",
        notes: "Receives string value instead of ChangeEvent.",
      },
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
    propMappings: [
      { uiKitProp: "hasError", nimbusProp: "isInvalid", changeType: "rename" },
      {
        uiKitProp: "isAutofocussed",
        nimbusProp: "autoFocus",
        changeType: "rename",
      },
      {
        uiKitProp: "onChange",
        nimbusProp: "onChange",
        changeType: "structural",
        notes: "Receives string value instead of ChangeEvent.",
      },
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
      "errors (Record) replaced by passing <FieldErrors> to the errorMessage prop",
    ],
    propMappings: [
      { uiKitProp: "title", nimbusProp: "label", changeType: "rename" },
      {
        uiKitProp: "hint",
        nimbusProp: "description",
        changeType: "rename",
      },
      {
        uiKitProp: "errors",
        nimbusProp: "errors",
        changeType: "structural",
        notes:
          "Now expects FieldErrorsData (from FieldErrors) instead of a Record<string, boolean>.",
      },
    ],
  },
  {
    uiKitName: "SearchSelectInput",
    nimbusEquivalent: "ComboBox",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "Use ComboBox for a searchable select dropdown. Pass options via the items prop " +
      "and render each with ComboBox.Item. ComboBox handles filtering natively.",
    breakingChanges: [
      "Rename to ComboBox",
      "options array replaced by items prop with ComboBox.Item render function",
      "onChange received TCustomEvent; now receives selected key directly",
    ],
    propMappings: [
      {
        uiKitProp: "loadOptions",
        nimbusProp: null,
        changeType: "structural",
        notes:
          "Replace loadOptions callback with items prop + ComboBox.Item render function.",
      },
      {
        uiKitProp: "onChange",
        nimbusProp: "onSelectionChange",
        changeType: "structural",
        notes: "Receives the selected key directly instead of a TCustomEvent.",
      },
    ],
  },
  {
    uiKitName: "SearchSelectField",
    nimbusEquivalent: "ComboBox + FormField",
    importPath: "@commercetools/nimbus",
    mappingType: "compound",
    notes:
      "Wrap ComboBox in a FormField to add label, description, and error message. " +
      "There is no standalone ComboBoxField component.",
    breakingChanges: [
      "Compose FormField + ComboBox manually",
      "title prop replaced by FormField label",
      "hint prop replaced by FormField description",
      "errors (Record) replaced by passing <FieldErrors> as a child of FormField.Error",
    ],
    propMappings: [
      {
        uiKitProp: "title",
        nimbusProp: null,
        changeType: "structural",
        notes: "Use the FormField label prop instead.",
      },
      {
        uiKitProp: "hint",
        nimbusProp: null,
        changeType: "structural",
        notes: "Use the FormField description prop instead.",
      },
      {
        uiKitProp: "errors",
        nimbusProp: null,
        changeType: "structural",
        notes: "Pass <FieldErrors> as a child of FormField.Error.",
      },
    ],
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
    propMappings: [
      {
        uiKitProp: "options",
        nimbusProp: "options",
        changeType: "structural",
        notes:
          "Shape changed to ScopedSearchInputOption[] | ScopedSearchInputOptionGroup[].",
      },
    ],
  },
  {
    uiKitName: "SearchTextInput",
    nimbusEquivalent: "SearchInput",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "Direct replacement. Nimbus SearchInput provides built-in clear button and search icon.",
    breakingChanges: [
      "Rename to SearchInput",
      "onChange receives a string value instead of ChangeEvent",
      "onSubmit replaced by onClear for the clear action",
    ],
    propMappings: [
      {
        uiKitProp: "onChange",
        nimbusProp: "onChange",
        changeType: "structural",
        notes: "Receives string value instead of ChangeEvent.",
      },
      {
        uiKitProp: "onSubmit",
        nimbusProp: "onClear",
        changeType: "structural",
        notes:
          "UIKit onSubmit (search action) has no direct equivalent. Use onClear for the clear button action.",
      },
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
      "Select accepts an items prop with a Select.Item render function. " +
      "UI Kit onChange received a TCustomEvent with target.value (string); Nimbus onChange receives the selected key directly. " +
      "UI Kit option shape: { value: string, label: ReactNode, isDisabled?: boolean }.",
    breakingChanges: [
      "Rename to Select",
      "options array ({value, label}) replaced by items prop with Select.Item render function",
      "onChange received TCustomEvent (target.value); now receives selected key directly",
      "isMulti support changed; check Nimbus Select API for multi-select",
      "appearance prop ('default'|'quiet'|'filter') replaced by variant",
    ],
    propMappings: [
      {
        uiKitProp: "appearance",
        nimbusProp: "variant",
        changeType: "value-mapping",
        valueMapping: [
          { from: "default", to: "outline" },
          { from: "quiet", to: "ghost" },
        ],
        notes: "appearance='filter' has no direct equivalent.",
      },
      {
        uiKitProp: "options",
        nimbusProp: null,
        changeType: "structural",
        notes: "Replace with Select.Option children inside Select.Options.",
      },
      {
        uiKitProp: "onChange",
        nimbusProp: "onChange",
        changeType: "structural",
        notes: "Receives selected key instead of TCustomEvent.",
      },
    ],
    callbackAdapters: [
      {
        prop: "onChange",
        from: "(event: TCustomEvent) => void — access event.target.value",
        to: "(value: Key | null) => void — single selection only",
      },
    ],
    typeNotes: [
      "Key type is string | number from @react-types/shared; Nimbus Select is single-selection only — for multi-select use cases, migrate to ComboBox instead",
    ],
  },
  {
    uiKitName: "CreatableSelectInput",
    nimbusEquivalent: "ComboBox",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "ComboBox supports both selection and free-text entry. Use allowsCustomOptions prop for creatable behavior. " +
      "UI Kit onCreateOption callback is replaced by handling new values in onInputChange.",
    breakingChanges: [
      "Rename to ComboBox",
      "options array replaced by items prop with ComboBox.Item render function",
      "onCreateOption replaced by allowsCustomOptions + custom onInputChange logic",
      "onChange received TCustomEvent; now receives selected key directly",
    ],
    propMappings: [
      {
        uiKitProp: "options",
        nimbusProp: "items",
        changeType: "structural",
        notes:
          "Options array replaced by items collection with a ComboBox.Item render function.",
      },
      {
        uiKitProp: "onCreateOption",
        nimbusProp: null,
        changeType: "removed",
        notes:
          "Use allowsCustomOptions plus custom onInputChange logic instead.",
      },
      {
        uiKitProp: "onChange",
        nimbusProp: "onSelectionChange",
        changeType: "structural",
        notes: "Receives the selected key directly instead of a TCustomEvent.",
      },
    ],
  },
  {
    uiKitName: "AsyncCreatableSelectInput",
    nimbusEquivalent: "ComboBox",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      "Use ComboBox with allowsCustomOptions and manage async loading via onInputChange + external state. " +
      "UI Kit provided a loadOptions callback; in Nimbus this is managed externally.",
    breakingChanges: [
      "Rename to ComboBox",
      "loadOptions callback replaced by onInputChange + external async fetch + items state",
      "onCreateOption replaced by allowsCustomOptions + custom logic",
      "onChange received TCustomEvent; now receives selected key directly",
    ],
    propMappings: [
      {
        uiKitProp: "loadOptions",
        nimbusProp: null,
        changeType: "removed",
        notes:
          "Use onInputChange plus an external async fetch that updates the items state.",
      },
      {
        uiKitProp: "onCreateOption",
        nimbusProp: null,
        changeType: "removed",
        notes:
          "Use allowsCustomOptions plus custom onInputChange logic instead.",
      },
      {
        uiKitProp: "onChange",
        nimbusProp: "onSelectionChange",
        changeType: "structural",
        notes: "Receives the selected key directly instead of a TCustomEvent.",
      },
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
    propMappings: [
      {
        uiKitProp: "loadOptions",
        nimbusProp: null,
        changeType: "removed",
        notes:
          "Use onInputChange plus an external async fetch that updates the items state.",
      },
      {
        uiKitProp: "onChange",
        nimbusProp: "onSelectionChange",
        changeType: "structural",
        notes: "Receives the selected key directly instead of a TCustomEvent.",
      },
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
    propMappings: [
      { uiKitProp: "hasError", nimbusProp: "isInvalid", changeType: "rename" },
      {
        uiKitProp: "isAutofocussed",
        nimbusProp: "autoFocus",
        changeType: "rename",
      },
      {
        uiKitProp: "onChange",
        nimbusProp: "onChange",
        changeType: "structural",
        notes: "Receives a number instead of ChangeEvent.",
      },
      {
        uiKitProp: "value",
        nimbusProp: "value",
        changeType: "structural",
        notes: "Was string|number; now must be a number.",
      },
    ],
    callbackAdapters: [
      {
        prop: "onChange",
        from: "(event: ChangeEvent<HTMLInputElement>) => void — event.target.value is a string",
        to: "(value: number) => void",
      },
    ],
    typeNotes: [
      "value was string | number, now must be number; empty string '' is no longer valid — use NaN or conditional rendering",
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
      "errors prop accepts FieldErrorsData; convert UIKit Record<string, boolean> via <FieldErrors>",
    ],
    propMappings: [
      { uiKitProp: "title", nimbusProp: "label", changeType: "rename" },
      {
        uiKitProp: "hint",
        nimbusProp: "description",
        changeType: "rename",
      },
      {
        uiKitProp: "errors",
        nimbusProp: "errors",
        changeType: "structural",
        notes:
          "Convert UIKit Record<string, boolean> to FieldErrorsData and pass to the errors prop.",
      },
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
    propMappings: [
      { uiKitProp: "hasError", nimbusProp: "isInvalid", changeType: "rename" },
      {
        uiKitProp: "onChange",
        nimbusProp: "onChange",
        changeType: "structural",
        notes:
          "Receives { amount, currencyCode } directly instead of a TCustomEvent.",
      },
    ],
    callbackAdapters: [
      {
        prop: "onChange",
        from: "(event: TCustomEvent) => void — access event.target.value",
        to: "(event: CustomEvent) => void — legacy; prefer onValueChange: (value: MoneyInputValue) => void",
      },
    ],
    typeNotes: [
      "Prefer onValueChange over onChange; also available: onAmountChange: (amount: string) => void and onCurrencyChange: (currencyCode: CurrencyCode) => void",
      "MoneyInputValue = { amount: string, currencyCode: CurrencyCode | '' }",
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
      "errors (Record) replaced by passing <FieldErrors> to the errorMessage prop",
    ],
    propMappings: [
      { uiKitProp: "title", nimbusProp: "label", changeType: "rename" },
      {
        uiKitProp: "hint",
        nimbusProp: "description",
        changeType: "rename",
      },
      {
        uiKitProp: "errors",
        nimbusProp: "errors",
        changeType: "structural",
        notes:
          "Now expects FieldErrorsData (from FieldErrors) instead of a Record<string, boolean>.",
      },
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
    propMappings: [
      {
        uiKitProp: "value",
        nimbusProp: "value",
        changeType: "structural",
        notes:
          "Changed from a 'YYYY-MM-DD' string to a CalendarDate from @internationalized/date.",
      },
      {
        uiKitProp: "onChange",
        nimbusProp: "onChange",
        changeType: "structural",
        notes:
          "Receives a CalendarDate directly instead of a TCustomEvent with a string.",
      },
    ],
    callbackAdapters: [
      {
        prop: "onChange",
        from: "(event: TCustomEvent) => void — event.target.value is a 'YYYY-MM-DD' string",
        to: "(value: CalendarDate | null) => void",
      },
    ],
    typeNotes: [
      "import { CalendarDate } from '@internationalized/date' is required; value and onChange use CalendarDate, not strings",
      "minValue/maxValue also changed from strings to CalendarDate objects",
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
    propMappings: [
      {
        uiKitProp: "_component",
        nimbusProp: "granularity",
        changeType: "value-mapping",
        fixedValue: "minute",
        notes: "Use 'second' instead if second-level precision is required.",
      },
      {
        uiKitProp: "value",
        nimbusProp: "value",
        changeType: "structural",
        notes:
          "Must be a ZonedDateTime or CalendarDateTime from @internationalized/date.",
      },
    ],
    callbackAdapters: [
      {
        prop: "onChange",
        from: "(event: TCustomEvent) => void — string-based date-time value",
        to: "(value: CalendarDateTime | ZonedDateTime | null) => void",
      },
    ],
    typeNotes: [
      "import { CalendarDateTime, ZonedDateTime } from '@internationalized/date' is required; use CalendarDateTime for local times, ZonedDateTime for timezone-aware values",
      "Set granularity='minute' or 'second' on DatePicker to enable time fields",
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
    propMappings: [
      {
        uiKitProp: "value",
        nimbusProp: "value",
        changeType: "structural",
        notes: "Shape changed to { start, end } using CalendarDate.",
      },
      {
        uiKitProp: "onChange",
        nimbusProp: "onChange",
        changeType: "structural",
        notes: "Receives the { start, end } CalendarDate range directly.",
      },
    ],
    callbackAdapters: [
      {
        prop: "onChange",
        from: "(event: TCustomEvent) => void — string-based date range",
        to: "(value: RangeValue<CalendarDate> | null) => void — where RangeValue<T> = { start: T, end: T }",
      },
    ],
    typeNotes: [
      "import { CalendarDate } from '@internationalized/date' and RangeValue from '@react-types/shared' are required",
      "Value type is RangeValue<CalendarDate> = { start: CalendarDate, end: CalendarDate } | null",
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
    propMappings: [
      {
        uiKitProp: "value",
        nimbusProp: "value",
        changeType: "structural",
        notes: "Must be a Time object from @internationalized/date.",
      },
    ],
    callbackAdapters: [
      {
        prop: "onChange",
        from: "(event: ChangeEvent<HTMLInputElement>) => void — event.target.value is a time string",
        to: "(value: Time | null) => void",
      },
    ],
    typeNotes: [
      "import { Time } from '@internationalized/date' is required; value and onChange use Time objects, not strings",
    ],
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
    propMappings: [
      {
        uiKitProp: "isChecked",
        nimbusProp: "isSelected",
        changeType: "rename",
      },
      {
        uiKitProp: "onChange",
        nimbusProp: "onChange",
        changeType: "structural",
        notes: "Receives boolean isSelected instead of ChangeEvent.",
      },
    ],
    callbackAdapters: [
      {
        prop: "onChange",
        from: "(event: ChangeEvent<HTMLInputElement>) => void — access event.target.checked",
        to: "(isSelected: boolean) => void",
      },
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
    propMappings: [
      {
        uiKitProp: "isChecked",
        nimbusProp: "isSelected",
        changeType: "rename",
      },
      {
        uiKitProp: "onChange",
        nimbusProp: "onChange",
        changeType: "structural",
        notes: "Receives boolean isSelected instead of ChangeEvent.",
      },
      {
        uiKitProp: "size",
        nimbusProp: "size",
        changeType: "value-mapping",
        valueMapping: [
          { from: "small", to: "sm" },
          { from: "big", to: "md" },
        ],
      },
    ],
    callbackAdapters: [
      {
        prop: "onChange",
        from: "(event: ChangeEvent<HTMLInputElement>) => void — access event.target.checked",
        to: "(isSelected: boolean) => void",
      },
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
    notes:
      'Use <LocalizedField type="text"> (the default type). ' +
      "LocalizedField manages all locale inputs internally via its type prop.",
    breakingChanges: [
      "Replace LocalizedTextInput with <LocalizedField> (type='text' is the default)",
      "selectedLanguage prop replaced by defaultLocaleOrCurrency",
      "value per locale replaced by valuesByLocaleOrCurrency object",
      "onChange receives a LocalizedFieldChangeEvent with target.locale",
    ],
    propMappings: [
      {
        uiKitProp: "_component",
        nimbusProp: "type",
        changeType: "value-mapping",
        fixedValue: "text",
      },
      {
        uiKitProp: "selectedLanguage",
        nimbusProp: "defaultLocaleOrCurrency",
        changeType: "rename",
      },
      {
        uiKitProp: "value",
        nimbusProp: "valuesByLocaleOrCurrency",
        changeType: "structural",
        notes:
          "Per-locale value replaced by a single valuesByLocaleOrCurrency object.",
      },
      {
        uiKitProp: "onChange",
        nimbusProp: "onChange",
        changeType: "structural",
        notes: "Receives a LocalizedFieldChangeEvent with target.locale.",
      },
    ],
    callbackAdapters: [
      {
        prop: "onChange",
        from: "(event: ChangeEvent<HTMLLocalizedInputElement>) => void — event.target.language identifies the locale",
        to: "(event: LocalizedFieldChangeEvent) => void — event.target.locale identifies which locale changed",
      },
    ],
    typeNotes: [
      "LocalizedFieldChangeEvent has target.locale (string), target.value (string | string[] | null), and optional target.id/name",
    ],
  },
  {
    uiKitName: "LocalizedTextField",
    nimbusEquivalent: "LocalizedField",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <LocalizedField type="text"> with label, description, and error props. ' +
      "LocalizedField is already a field-level component with built-in label and error slots.",
    breakingChanges: [
      "Replace LocalizedTextField with <LocalizedField> (type='text' is the default)",
      "title prop renamed to label",
      "hint prop renamed to description",
      "errors (Record) replaced by errorsByLocaleOrCurrency",
      "onChange receives a LocalizedFieldChangeEvent with target.locale",
    ],
    propMappings: [
      { uiKitProp: "title", nimbusProp: "label", changeType: "rename" },
      {
        uiKitProp: "hint",
        nimbusProp: "description",
        changeType: "rename",
      },
      {
        uiKitProp: "errors",
        nimbusProp: "errorsByLocaleOrCurrency",
        changeType: "structural",
        notes: "Record<string, boolean> replaced by errorsByLocaleOrCurrency.",
      },
    ],
  },
  {
    uiKitName: "LocalizedMultilineTextInput",
    nimbusEquivalent: "LocalizedField",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <LocalizedField type="multiLine">. ' +
      "The type prop controls the input variant; no child composition needed.",
    breakingChanges: [
      "Replace LocalizedMultilineTextInput with <LocalizedField type='multiLine'>",
      "selectedLanguage prop replaced by defaultLocaleOrCurrency",
      "value per locale replaced by valuesByLocaleOrCurrency object",
      "onChange receives a LocalizedFieldChangeEvent with target.locale",
    ],
    propMappings: [
      {
        uiKitProp: "_component",
        nimbusProp: "type",
        changeType: "value-mapping",
        fixedValue: "multiLine",
      },
      {
        uiKitProp: "selectedLanguage",
        nimbusProp: "defaultLocaleOrCurrency",
        changeType: "rename",
      },
      {
        uiKitProp: "value",
        nimbusProp: "valuesByLocaleOrCurrency",
        changeType: "structural",
        notes:
          "Per-locale value replaced by a single valuesByLocaleOrCurrency object.",
      },
      {
        uiKitProp: "onChange",
        nimbusProp: "onChange",
        changeType: "structural",
        notes: "Receives a LocalizedFieldChangeEvent with target.locale.",
      },
    ],
    callbackAdapters: [
      {
        prop: "onChange",
        from: "(event: ChangeEvent<HTMLLocalizedInputElement>) => void — event.target.language identifies the locale",
        to: "(event: LocalizedFieldChangeEvent) => void — event.target.locale identifies which locale changed",
      },
    ],
    typeNotes: [
      "LocalizedFieldChangeEvent has target.locale (string), target.value (string | string[] | null), and optional target.id/name",
    ],
  },
  {
    uiKitName: "LocalizedMultilineTextField",
    nimbusEquivalent: "LocalizedField",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <LocalizedField type="multiLine"> with label, description, and error props. ' +
      "LocalizedField is already a field-level component with built-in label and error slots.",
    breakingChanges: [
      "Replace LocalizedMultilineTextField with <LocalizedField type='multiLine'>",
      "title prop renamed to label",
      "hint prop renamed to description",
      "errors (Record) replaced by errorsByLocaleOrCurrency",
      "onChange receives a LocalizedFieldChangeEvent with target.locale",
    ],
    propMappings: [
      { uiKitProp: "title", nimbusProp: "label", changeType: "rename" },
      {
        uiKitProp: "hint",
        nimbusProp: "description",
        changeType: "rename",
      },
      {
        uiKitProp: "errors",
        nimbusProp: "errorsByLocaleOrCurrency",
        changeType: "structural",
        notes: "Record<string, boolean> replaced by errorsByLocaleOrCurrency.",
      },
    ],
  },
  {
    uiKitName: "LocalizedMoneyInput",
    nimbusEquivalent: "LocalizedField",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <LocalizedField type="money">. ' +
      "valuesByLocaleOrCurrency accepts a LocalizedCurrency object keyed by currency code.",
    breakingChanges: [
      "Replace LocalizedMoneyInput with <LocalizedField type='money'>",
      "selectedLanguage prop replaced by defaultLocaleOrCurrency (currency code)",
      "value per currency replaced by valuesByLocaleOrCurrency object",
      "onChange receives a LocalizedFieldChangeEvent with target.currency",
    ],
    propMappings: [
      {
        uiKitProp: "_component",
        nimbusProp: "type",
        changeType: "value-mapping",
        fixedValue: "money",
      },
      {
        uiKitProp: "selectedCurrency",
        nimbusProp: "defaultLocaleOrCurrency",
        changeType: "rename",
        notes: "Represents the default currency code for LocalizedMoneyInput.",
      },
      {
        uiKitProp: "value",
        nimbusProp: "valuesByLocaleOrCurrency",
        changeType: "structural",
        notes:
          "Per-currency value replaced by a single valuesByLocaleOrCurrency object.",
      },
      {
        uiKitProp: "onChange",
        nimbusProp: "onChange",
        changeType: "structural",
        notes: "Receives a LocalizedFieldChangeEvent with target.currency.",
      },
    ],
    callbackAdapters: [
      {
        prop: "onChange",
        from: "(event: ChangeEvent<HTMLLocalizedInputElement>) => void — event.target.language identifies the currency",
        to: "(event: LocalizedFieldChangeEvent) => void — event.target.currency identifies which currency changed",
      },
    ],
    typeNotes: [
      "LocalizedFieldChangeEvent has target.currency (CurrencyCode), target.value (string | string[] | null), and optional target.id/name",
    ],
  },
  {
    uiKitName: "LocalizedRichTextInput",
    nimbusEquivalent: "LocalizedField",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <LocalizedField type="richText">. ' +
      "The type prop controls the input variant; no child composition needed.",
    breakingChanges: [
      "Replace LocalizedRichTextInput with <LocalizedField type='richText'>",
      "selectedLanguage prop replaced by defaultLocaleOrCurrency",
      "value per locale replaced by valuesByLocaleOrCurrency object",
      "onChange receives a LocalizedFieldChangeEvent with target.locale",
    ],
    propMappings: [
      {
        uiKitProp: "_component",
        nimbusProp: "type",
        changeType: "value-mapping",
        fixedValue: "richText",
      },
      {
        uiKitProp: "selectedLanguage",
        nimbusProp: "defaultLocaleOrCurrency",
        changeType: "rename",
      },
      {
        uiKitProp: "value",
        nimbusProp: "valuesByLocaleOrCurrency",
        changeType: "structural",
        notes:
          "Per-locale value replaced by a single valuesByLocaleOrCurrency object.",
      },
      {
        uiKitProp: "onChange",
        nimbusProp: "onChange",
        changeType: "structural",
        notes: "Receives a LocalizedFieldChangeEvent with target.locale.",
      },
    ],
    callbackAdapters: [
      {
        prop: "onChange",
        from: "(event: ChangeEvent<HTMLLocalizedInputElement>) => void — event.target.language identifies the locale",
        to: "(event: LocalizedFieldChangeEvent) => void — event.target.locale identifies which locale changed",
      },
    ],
    typeNotes: [
      "LocalizedFieldChangeEvent has target.locale (string), target.value (string | string[] | null), and optional target.id/name",
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
    propMappings: [
      {
        uiKitProp: "children",
        nimbusProp: null,
        changeType: "structural",
        notes: "Use as the FormField description prop, or as Text children.",
      },
    ],
  },
  {
    uiKitName: "ErrorMessage",
    nimbusEquivalent: "Text + FormField",
    importPath: "@commercetools/nimbus",
    mappingType: "compound",
    notes:
      "Use <FieldErrors> passed to a *Field component's errorMessage prop, or as a child of FormField.Error.",
    breakingChanges: [
      "Replace ErrorMessage with <FieldErrors> inside a Field errorMessage prop or FormField.Error",
    ],
    propMappings: [
      {
        uiKitProp: "children",
        nimbusProp: null,
        changeType: "structural",
        notes:
          "Use <FieldErrors> as a child of FormField.Error, or pass to a Field's errorMessage/errors prop.",
      },
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
    propMappings: [
      {
        uiKitProp: "children",
        nimbusProp: null,
        changeType: "removed",
        notes:
          "Use <Text color='warning.500'> with the message as children instead.",
      },
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
      "Rename to Badge. UI Kit used a tone prop; Nimbus uses colorPalette instead. " +
      "UI Kit tones: 'critical'|'warning'|'positive'|'information'|'primary'|'secondary'. " +
      "Nimbus colorPalette values: 'critical'|'warning'|'positive'|'info'|'primary'|'neutral'.",
    breakingChanges: [
      "Rename to Badge",
      "Default color changed: UI Kit Stamp was blue (tone='information') by default; Nimbus Badge defaults to colorPalette='neutral' (gray). Add colorPalette='info' to preserve the blue appearance.",
      "tone prop replaced by colorPalette",
      "tone value 'positive' stays 'positive' (use colorPalette='positive')",
      "tone value 'critical' stays 'critical' (use colorPalette='critical')",
      "tone value 'warning' stays 'warning' (use colorPalette='warning')",
      "tone value 'information' → colorPalette='info'",
      "tone values 'primary' and 'secondary' → colorPalette='primary' or 'neutral'",
      "isCondensed prop replaced by size='xs'",
      "label and icon props removed; pass label text and optionally an icon as children",
    ],
    propMappings: [
      {
        uiKitProp: "tone",
        nimbusProp: "colorPalette",
        changeType: "value-mapping",
        valueMapping: [
          { from: "critical", to: "critical" },
          { from: "warning", to: "warning" },
          { from: "positive", to: "positive" },
          { from: "information", to: "info" },
          { from: "primary", to: "primary" },
          { from: "secondary", to: "neutral" },
        ],
      },
      {
        uiKitProp: "isCondensed",
        nimbusProp: "size",
        changeType: "value-mapping",
        valueMapping: [{ from: "true", to: "xs" }],
        notes: "Default size is 'md'.",
      },
    ],
    propMigrations: [
      { from: "label", to: "children" },
      { from: "icon", to: "children", position: "before" },
    ],
  },
  {
    uiKitName: "Tag",
    nimbusEquivalent: "TagGroup",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      "Use TagGroup.Root with TagGroup.TagList and a single TagGroup.Tag for a standalone tag. TagGroup manages selection/removal state.",
    breakingChanges: [
      "Wrap single Tag in <TagGroup.Root><TagGroup.TagList><TagGroup.Tag>...</TagGroup.Tag></TagGroup.TagList></TagGroup.Root>",
      "onRemove now receives a key-based Set",
    ],
    propMappings: [
      {
        uiKitProp: "children",
        nimbusProp: null,
        changeType: "structural",
        notes:
          "Restructure into TagGroup.Root > TagGroup.TagList > TagGroup.Tag.",
      },
    ],
    callbackAdapters: [
      {
        prop: "onRemove",
        from: "(event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => void — DOM event from remove button",
        to: "(keys: Set<Key>) => void — set of removed tag keys",
      },
    ],
    typeNotes: [
      "onRemove receives Set<Key> (where Key = string | number), not a single key; must iterate the set or use Set.has()",
    ],
  },
  {
    uiKitName: "TagList",
    nimbusEquivalent: "TagGroup",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "Replace TagList with TagGroup.Root + TagGroup.TagList. Each tag becomes a TagGroup.Tag child.",
    breakingChanges: [
      "Rename to TagGroup (use TagGroup.Root, TagGroup.TagList, TagGroup.Tag)",
      "items array replaced by TagGroup.Tag children inside TagGroup.TagList",
    ],
    propMappings: [
      {
        uiKitProp: "children",
        nimbusProp: null,
        changeType: "structural",
        notes: "Replace with TagGroup.Tag children inside TagGroup.TagList.",
      },
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
      "Direct replacement. Column definitions require DataTableColumnItem<RowType>[] generic typing. Sort and selection callbacks have new signatures.",
    breakingChanges: [
      "columns prop shape changed: key→id, label→header, accessor and render fields added",
      "DataTableColumnItem<T> is generic — without <T> accessors return unknown and TS rejects them as ReactNode",
      "onSortChange signature changed from (key, order) to (descriptor: { column, direction })",
      "Selection type is 'all' | Set<Key> — missing the 'all' branch silently drops select-all clicks",
    ],
    propMappings: [
      {
        uiKitProp: "columns",
        nimbusProp: "columns",
        changeType: "structural",
        notes:
          "Shape changed: key→id, label→header, accessor required. Must use DataTableColumnItem<RowType>[].",
      },
      {
        uiKitProp: "onRowClick",
        nimbusProp: "onSelectionChange",
        changeType: "structural",
        notes:
          "Row interaction via onRowClick replaced by onSelectionChange with Selection = 'all' | Set<Key>.",
      },
      {
        uiKitProp: "onSortChange",
        nimbusProp: "onSortChange",
        changeType: "structural",
        notes:
          "Signature changed from (key, order) to (descriptor: { column, direction: 'ascending' | 'descending' }).",
      },
    ],
    propShapeTransforms: [
      {
        prop: "columns",
        rename: { key: "id", label: "header" },
        addRequired: ["accessor"],
        addOptional: ["render"],
        drop: ["width if string-typed (Nimbus uses pixels)"],
        genericRequired: "DataTableColumnItem<RowType>[]",
      },
    ],
    callbackAdapters: [
      {
        prop: "onSortChange",
        from: "(key: string, order: 'asc' | 'desc')",
        to: "(descriptor: { column: string, direction: 'ascending' | 'descending' })",
      },
    ],
    typeNotes: [
      "Selection = 'all' | Set<Key>; handle 'all' explicitly — missing the 'all' branch silently drops the select-all header click",
    ],
    codeReduction: {
      type: "selection-model-collapse",
      deletableFiles: [
        "**/*-selection-column-cell.tsx",
        "**/*-selection-column-label.tsx",
      ],
      rationale:
        "Nimbus DataTable provides built-in selection via selectionMode='multiple'.",
    },
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
      "Default color changed: UI Kit Link was blue (tone='primary') by default; Nimbus Link defaults to neutral (dark text). Use fontColor='primary' to preserve blue link styling.",
      "isExternal prop renamed to target='_blank' + rel='noopener'",
    ],
    propMappings: [
      {
        uiKitProp: "isExternal",
        nimbusProp: null,
        changeType: "removed",
        notes: "Use target='_blank' rel='noopener' instead.",
      },
    ],
  },
  {
    uiKitName: "DropdownMenu",
    nimbusEquivalent: "Menu",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "Rename to Menu. Uses composable Menu.Root, Menu.Trigger, Menu.Content, and Menu.Item.",
    breakingChanges: [
      "Rename to Menu (use Menu.Root, Menu.Trigger, Menu.Content, Menu.Item)",
      "options array replaced by Menu.Item children inside Menu.Content",
      "per-item onClick replaced by onAction on Menu.Item or Menu (receives key)",
    ],
    propMappings: [
      {
        uiKitProp: "children",
        nimbusProp: null,
        changeType: "structural",
        notes: "Compose Menu.Root > Menu.Trigger + Menu.Content > Menu.Item.",
      },
    ],
    callbackAdapters: [
      {
        prop: "onClick",
        from: "per-item onClick: () => void — no arguments, set on each DropdownMenu.ListMenuItem",
        to: "onAction: (key: Key) => void — receives the item's key; set on Menu or individual Menu.Item",
      },
    ],
  },
  {
    uiKitName: "Pagination",
    nimbusEquivalent: "Pagination",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes: "Direct replacement. page/totalPages prop names are unchanged.",
    breakingChanges: ["onPageChange receives a page number directly"],
    propMappings: [
      {
        uiKitProp: "onPageChange",
        nimbusProp: "onPageChange",
        changeType: "structural",
        notes: "Receives the page number directly.",
      },
    ],
  },

  {
    uiKitName: "ViewSwitcher",
    nimbusEquivalent: "ToggleButtonGroup",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "Replace ViewSwitcher.Group with ToggleButtonGroup and ViewSwitcher.Button with ToggleButton. " +
      "Nimbus ToggleButtonGroup uses selectionMode='single' for exclusive view switching.",
    breakingChanges: [
      "Replace ViewSwitcher.Group with <ToggleButtonGroup selectionMode='single'>",
      "Replace ViewSwitcher.Button with <ToggleButton>",
      "isActive prop replaced by selection state managed via selectedKeys/onSelectionChange",
    ],
    propMappings: [
      {
        uiKitProp: "isActive",
        nimbusProp: "selectedKeys",
        changeType: "structural",
        notes:
          "ViewSwitcher.Button isActive is replaced by ToggleButtonGroup's selectedKeys/onSelectionChange controlled state.",
      },
      {
        uiKitProp: "onClick",
        nimbusProp: "onSelectionChange",
        changeType: "structural",
        notes:
          "ViewSwitcher.Button onClick is replaced by ToggleButtonGroup's onSelectionChange callback.",
      },
    ],
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
      "Tooltip wraps a trigger element. Use Tooltip.Root (wraps the trigger child) and Tooltip.Content composition.",
    breakingChanges: [
      "Compositional API: replace single prop with Tooltip.Root + Tooltip.Content",
    ],
    propMappings: [
      {
        uiKitProp: "children",
        nimbusProp: null,
        changeType: "structural",
        notes:
          "Restructure into Tooltip.Root (wrapping the trigger) + Tooltip.Content.",
      },
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
    notes:
      "Rename to Alert. colorPalette prop replaces type prop for semantic intent.",
    breakingChanges: [
      "Rename to Alert",
      "type prop replaced by colorPalette ('info', 'positive', 'warning', 'critical')",
    ],
    propMappings: [
      {
        uiKitProp: "type",
        nimbusProp: "colorPalette",
        changeType: "value-mapping",
        valueMapping: [
          { from: "info", to: "info" },
          { from: "success", to: "positive" },
          { from: "warning", to: "warning" },
          { from: "danger", to: "critical" },
        ],
      },
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
    layoutGuidance: LAYOUT_NESTING_GUIDANCE,
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
    layoutGuidance: LAYOUT_NESTING_GUIDANCE,
  },
  {
    uiKitName: "Spacings.Inset",
    nimbusEquivalent: "Box",
    importPath: "@commercetools/nimbus",
    mappingType: "pattern",
    notes:
      "Use <Box padding={...}> with nimbus spacing tokens for inset padding.",
    breakingChanges: [
      "Replace Spacings.Inset with padding prop on Box",
      "Spacing values use design token scale",
    ],
    layoutGuidance: LAYOUT_NESTING_GUIDANCE,
  },
  {
    uiKitName: "Spacings.InsetSquish",
    nimbusEquivalent: "Box",
    importPath: "@commercetools/nimbus",
    mappingType: "pattern",
    notes:
      "Use <Box paddingX={...} paddingY={...}> with asymmetric nimbus spacing tokens.",
    breakingChanges: [
      "Replace Spacings.InsetSquish with paddingX/paddingY props on Box",
    ],
    layoutGuidance: LAYOUT_NESTING_GUIDANCE,
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
    layoutGuidance: LAYOUT_NESTING_GUIDANCE,
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
      "Direct replacement. Composable with Card.Root, Card.Header, Card.Body, Card.Footer.",
    breakingChanges: [
      "Adopt compositional slot API (Card.Root, Card.Header, Card.Body, Card.Footer)",
    ],
    propMappings: [
      {
        uiKitProp: "children",
        nimbusProp: null,
        changeType: "structural",
        notes:
          "Restructure into Card.Root > Card.Header + Card.Body + Card.Footer slots.",
      },
    ],
  },
  {
    uiKitName: "CollapsiblePanel",
    nimbusEquivalent: "Accordion",
    importPath: "@commercetools/nimbus",
    mappingType: "direct",
    notes:
      "Rename to Accordion. Uses Accordion.Root, Accordion.Item, Accordion.Header, Accordion.Content composition. " +
      "UI Kit used isClosed (controlled) + onToggle; the header was a prop, not a child slot.",
    breakingChanges: [
      "Rename to Accordion",
      "Adopt compositional slot API (Accordion.Root, Accordion.Item, Accordion.Header, Accordion.Content)",
      "isClosed prop replaced by React Aria controlled/uncontrolled pattern",
      "header prop replaced by Accordion.Header child",
      "condensed prop removed",
      "tone prop ('urgent'|'primary') replaced by Nimbus design tokens",
    ],
    propMappings: [
      {
        uiKitProp: "isClosed",
        nimbusProp: null,
        changeType: "structural",
        notes:
          "Use Accordion.Root's expandedKeys/defaultExpandedKeys + onExpandedChange (React Aria controlled/uncontrolled pattern).",
      },
      {
        uiKitProp: "header",
        nimbusProp: null,
        changeType: "structural",
        notes: "Use an Accordion.Header child instead of a prop.",
      },
      { uiKitProp: "condensed", nimbusProp: null, changeType: "removed" },
      { uiKitProp: "tone", nimbusProp: null, changeType: "removed" },
    ],
    callbackAdapters: [
      {
        prop: "onToggle",
        from: "() => void — simple toggle callback",
        to: "onExpandedChange: (keys: Set<Key>) => void — receives the full set of expanded item keys",
      },
    ],
    typeNotes: [
      "Controlled state uses expandedKeys: Iterable<Key> + onExpandedChange: (keys: Set<Key>) => void; each Accordion.Item needs a value (string) prop as its key",
      "Key type is string | number from @react-types/shared",
    ],
  },
  {
    uiKitName: "CollapsibleMotion",
    nimbusEquivalent: "CollapsibleMotion",
    importPath: "@commercetools/nimbus",
    mappingType: "compound",
    notes:
      "Uses compound pattern: CollapsibleMotion.Root, CollapsibleMotion.Trigger, CollapsibleMotion.Content. " +
      "UI Kit used a render prop with isClosed/toggle; Nimbus manages state internally.",
    breakingChanges: [
      "Adopt compositional API (CollapsibleMotion.Root, CollapsibleMotion.Trigger, CollapsibleMotion.Content)",
      "Render prop pattern replaced by compound component children",
    ],
    propMappings: [
      {
        uiKitProp: "children",
        nimbusProp: null,
        changeType: "structural",
        notes:
          "Render prop (isClosed/toggle) replaced by CollapsibleMotion.Root/Trigger/Content composition.",
      },
    ],
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
    propMappings: [
      {
        uiKitProp: "_component",
        nimbusProp: null,
        changeType: "value-mapping",
        fixedValue: "md",
        notes: "size='md' is Text's default, so it can usually be omitted.",
      },
    ],
  },
  {
    uiKitName: "Text.Caption",
    nimbusEquivalent: "Text",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes: 'Use <Text size="xs"> for caption-sized text.',
    breakingChanges: ["Replace Text.Caption with <Text size='xs'>"],
    propMappings: [
      {
        uiKitProp: "_component",
        nimbusProp: null,
        changeType: "value-mapping",
        fixedValue: "xs",
      },
    ],
  },
  {
    uiKitName: "Text.Detail",
    nimbusEquivalent: "Text",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes: 'Use <Text size="sm"> for detail/small text.',
    breakingChanges: ["Replace Text.Detail with <Text size='sm'>"],
    propMappings: [
      {
        uiKitProp: "_component",
        nimbusProp: null,
        changeType: "value-mapping",
        fixedValue: "sm",
      },
    ],
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
    propMappings: [
      {
        uiKitProp: "_component",
        nimbusProp: null,
        changeType: "value-mapping",
        fixedValue: "2xl",
        notes: "Also set fontWeight='bold', or use <Heading> instead.",
      },
    ],
  },
  {
    uiKitName: "Text.Subheadline",
    nimbusEquivalent: "Text",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes: 'Use <Text size="xl">.',
    breakingChanges: ["Replace Text.Subheadline with <Text size='xl'>"],
    propMappings: [
      {
        uiKitProp: "_component",
        nimbusProp: null,
        changeType: "value-mapping",
        fixedValue: "xl",
      },
    ],
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
  // Icons — specific UI Kit icon → Nimbus icon mappings
  // -------------------------------------------------------------------------
  {
    uiKitName: "AngleDownIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={KeyboardArrowDown} /> from @commercetools/nimbus-icons. Import: import { KeyboardArrowDown } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace AngleDownIcon with <Icon as={KeyboardArrowDown} />",
      "Import KeyboardArrowDown from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "AngleThinLeftIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={ChevronLeft} /> from @commercetools/nimbus-icons. Import: import { ChevronLeft } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace AngleThinLeftIcon with <Icon as={ChevronLeft} />",
      "Import ChevronLeft from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "AngleThinRightIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={ChevronRight} /> from @commercetools/nimbus-icons. Import: import { ChevronRight } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace AngleThinRightIcon with <Icon as={ChevronRight} />",
      "Import ChevronRight from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "AngleUpDownIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={UnfoldMore} /> from @commercetools/nimbus-icons. Import: import { UnfoldMore } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace AngleUpDownIcon with <Icon as={UnfoldMore} />",
      "Import UnfoldMore from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "AngleUpIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={ExpandLess} /> from @commercetools/nimbus-icons. Import: import { ExpandLess } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace AngleUpIcon with <Icon as={ExpandLess} />",
      "Import ExpandLess from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "ArrowDownIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={ArrowDownward} /> from @commercetools/nimbus-icons. Import: import { ArrowDownward } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace ArrowDownIcon with <Icon as={ArrowDownward} />",
      "Import ArrowDownward from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "ArrowLeftIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={ArrowLeft} /> from @commercetools/nimbus-icons. Import: import { ArrowLeft } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace ArrowLeftIcon with <Icon as={ArrowLeft} />",
      "Import ArrowLeft from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "ArrowLongDownIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={South} /> from @commercetools/nimbus-icons. Import: import { South } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace ArrowLongDownIcon with <Icon as={South} />",
      "Import South from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "ArrowRightIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={ArrowRight} /> from @commercetools/nimbus-icons. Import: import { ArrowRight } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace ArrowRightIcon with <Icon as={ArrowRight} />",
      "Import ArrowRight from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "ArrowsIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={SwapVert} /> from @commercetools/nimbus-icons. Import: import { SwapVert } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace ArrowsIcon with <Icon as={SwapVert} />",
      "Import SwapVert from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "ArrowsMinimizeIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={UnfoldLess} /> from @commercetools/nimbus-icons. Import: import { UnfoldLess } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace ArrowsMinimizeIcon with <Icon as={UnfoldLess} />",
      "Import UnfoldLess from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "ArrowTriangleDownIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={ArrowDropDown} /> from @commercetools/nimbus-icons. Import: import { ArrowDropDown } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace ArrowTriangleDownIcon with <Icon as={ArrowDropDown} />",
      "Import ArrowDropDown from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "ArrowTriangleUpIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={ArrowDropUp} /> from @commercetools/nimbus-icons. Import: import { ArrowDropUp } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace ArrowTriangleUpIcon with <Icon as={ArrowDropUp} />",
      "Import ArrowDropUp from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "ArrowUpIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={ArrowUpward} /> from @commercetools/nimbus-icons. Import: import { ArrowUpward } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace ArrowUpIcon with <Icon as={ArrowUpward} />",
      "Import ArrowUpward from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "BackIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={ArrowBack} /> from @commercetools/nimbus-icons. Import: import { ArrowBack } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace BackIcon with <Icon as={ArrowBack} />",
      "Import ArrowBack from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "BagIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={ShoppingBag} /> from @commercetools/nimbus-icons. Import: import { ShoppingBag } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace BagIcon with <Icon as={ShoppingBag} />",
      "Import ShoppingBag from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "BidirectionalArrowIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={SwapHoriz} /> from @commercetools/nimbus-icons. Import: import { SwapHoriz } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace BidirectionalArrowIcon with <Icon as={SwapHoriz} />",
      "Import SwapHoriz from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "BinFilledIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Delete} /> from @commercetools/nimbus-icons. Import: import { Delete } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace BinFilledIcon with <Icon as={Delete} />",
      "Import Delete from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "BoxIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Inventory} /> from @commercetools/nimbus-icons. Import: import { Inventory } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace BoxIcon with <Icon as={Inventory} />",
      "Import Inventory from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "BrainIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Psychology} /> from @commercetools/nimbus-icons. Import: import { Psychology } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace BrainIcon with <Icon as={Psychology} />",
      "Import Psychology from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "CalendarIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={CalendarToday} /> from @commercetools/nimbus-icons. Import: import { CalendarToday } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace CalendarIcon with <Icon as={CalendarToday} />",
      "Import CalendarToday from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "CameraIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={CameraAlt} /> from @commercetools/nimbus-icons. Import: import { CameraAlt } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace CameraIcon with <Icon as={CameraAlt} />",
      "Import CameraAlt from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "CaretDownIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={ArrowDropDown} /> from @commercetools/nimbus-icons. Import: import { ArrowDropDown } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace CaretDownIcon with <Icon as={ArrowDropDown} />",
      "Import ArrowDropDown from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "CaretDownSmallIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={ArrowDropDown} /> from @commercetools/nimbus-icons. Import: import { ArrowDropDown } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace CaretDownSmallIcon with <Icon as={ArrowDropDown} />",
      "Import ArrowDropDown from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "CaretUpIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={ArrowDropUp} /> from @commercetools/nimbus-icons. Import: import { ArrowDropUp } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace CaretUpIcon with <Icon as={ArrowDropUp} />",
      "Import ArrowDropUp from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "CaretUpSmallIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={ArrowDropUp} /> from @commercetools/nimbus-icons. Import: import { ArrowDropUp } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace CaretUpSmallIcon with <Icon as={ArrowDropUp} />",
      "Import ArrowDropUp from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "CartIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={ShoppingCart} /> from @commercetools/nimbus-icons. Import: import { ShoppingCart } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace CartIcon with <Icon as={ShoppingCart} />",
      "Import ShoppingCart from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "ChainBrokenIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={LinkOff} /> from @commercetools/nimbus-icons. Import: import { LinkOff } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace ChainBrokenIcon with <Icon as={LinkOff} />",
      "Import LinkOff from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "ChainIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Link} /> from @commercetools/nimbus-icons. Import: import { Link } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace ChainIcon with <Icon as={Link} />",
      "Import Link from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "CheckActiveIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={CheckCircle} /> from @commercetools/nimbus-icons. Import: import { CheckCircle } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace CheckActiveIcon with <Icon as={CheckCircle} />",
      "Import CheckCircle from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "CheckBoldIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Check} /> from @commercetools/nimbus-icons. Import: import { Check } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace CheckBoldIcon with <Icon as={Check} />",
      "Import Check from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "CheckInactiveIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={RadioButtonUnchecked} /> from @commercetools/nimbus-icons. Import: import { RadioButtonUnchecked } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace CheckInactiveIcon with <Icon as={RadioButtonUnchecked} />",
      "Import RadioButtonUnchecked from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "CheckThinIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Done} /> from @commercetools/nimbus-icons. Import: import { Done } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace CheckThinIcon with <Icon as={Done} />",
      "Import Done from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "CircleIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={FiberManualRecord} /> from @commercetools/nimbus-icons. Import: import { FiberManualRecord } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace CircleIcon with <Icon as={FiberManualRecord} />",
      "Import FiberManualRecord from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "ClipboardIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={ContentPaste} /> from @commercetools/nimbus-icons. Import: import { ContentPaste } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace ClipboardIcon with <Icon as={ContentPaste} />",
      "Import ContentPaste from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "ClockIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Schedule} /> from @commercetools/nimbus-icons. Import: import { Schedule } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace ClockIcon with <Icon as={Schedule} />",
      "Import Schedule from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "ClockWithArrowIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={History} /> from @commercetools/nimbus-icons. Import: import { History } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace ClockWithArrowIcon with <Icon as={History} />",
      "Import History from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "CloseBoldIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Close} /> from @commercetools/nimbus-icons. Import: import { Close } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace CloseBoldIcon with <Icon as={Close} />",
      "Import Close from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "CloseIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Close} /> from @commercetools/nimbus-icons. Import: import { Close } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace CloseIcon with <Icon as={Close} />",
      "Import Close from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "CodeViewIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Code} /> from @commercetools/nimbus-icons. Import: import { Code } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace CodeViewIcon with <Icon as={Code} />",
      "Import Code from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "CoinsIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={MonetizationOn} /> from @commercetools/nimbus-icons. Import: import { MonetizationOn } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace CoinsIcon with <Icon as={MonetizationOn} />",
      "Import MonetizationOn from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "ColumnsIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={ViewColumn} /> from @commercetools/nimbus-icons. Import: import { ViewColumn } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace ColumnsIcon with <Icon as={ViewColumn} />",
      "Import ViewColumn from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "ConnectedSquareIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={DeviceHub} /> from @commercetools/nimbus-icons. Import: import { DeviceHub } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace ConnectedSquareIcon with <Icon as={DeviceHub} />",
      "Import DeviceHub from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "ConnectedTriangleIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Share} /> from @commercetools/nimbus-icons. Import: import { Share } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace ConnectedTriangleIcon with <Icon as={Share} />",
      "Import Share from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "CopyIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={ContentCopy} /> from @commercetools/nimbus-icons. Import: import { ContentCopy } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace CopyIcon with <Icon as={ContentCopy} />",
      "Import ContentCopy from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "CtCheckoutIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={ShoppingCartCheckout} /> from @commercetools/nimbus-icons. Import: import { ShoppingCartCheckout } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace CtCheckoutIcon with <Icon as={ShoppingCartCheckout} />",
      "Import ShoppingCartCheckout from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "CubeIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={ViewInAr} /> from @commercetools/nimbus-icons. Import: import { ViewInAr } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace CubeIcon with <Icon as={ViewInAr} />",
      "Import ViewInAr from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "CubesIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Widgets} /> from @commercetools/nimbus-icons. Import: import { Widgets } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace CubesIcon with <Icon as={Widgets} />",
      "Import Widgets from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "DiamondIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Diamond} /> from @commercetools/nimbus-icons. Import: import { Diamond } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace DiamondIcon with <Icon as={Diamond} />",
      "Import Diamond from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "DomainIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Domain} /> from @commercetools/nimbus-icons. Import: import { Domain } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace DomainIcon with <Icon as={Domain} />",
      "Import Domain from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "DotIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={FiberManualRecord} /> from @commercetools/nimbus-icons. Import: import { FiberManualRecord } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace DotIcon with <Icon as={FiberManualRecord} />",
      "Import FiberManualRecord from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "DownloadIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Download} /> from @commercetools/nimbus-icons. Import: import { Download } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace DownloadIcon with <Icon as={Download} />",
      "Import Download from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "EditIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Edit} /> from @commercetools/nimbus-icons. Import: import { Edit } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace EditIcon with <Icon as={Edit} />",
      "Import Edit from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "ErrorIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Error} /> from @commercetools/nimbus-icons. Import: import { Error } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace ErrorIcon with <Icon as={Error} />",
      "Import Error from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "ExpandIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={OpenInFull} /> from @commercetools/nimbus-icons. Import: import { OpenInFull } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace ExpandIcon with <Icon as={OpenInFull} />",
      "Import OpenInFull from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "ExternalLinkIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={OpenInNew} /> from @commercetools/nimbus-icons. Import: import { OpenInNew } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace ExternalLinkIcon with <Icon as={OpenInNew} />",
      "Import OpenInNew from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "EyeCrossedIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={VisibilityOff} /> from @commercetools/nimbus-icons. Import: import { VisibilityOff } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace EyeCrossedIcon with <Icon as={VisibilityOff} />",
      "Import VisibilityOff from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "EyeIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Visibility} /> from @commercetools/nimbus-icons. Import: import { Visibility } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace EyeIcon with <Icon as={Visibility} />",
      "Import Visibility from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "FilterAndListIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={FilterList} /> from @commercetools/nimbus-icons. Import: import { FilterList } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace FilterAndListIcon with <Icon as={FilterList} />",
      "Import FilterList from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "FilterIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={FilterAlt} /> from @commercetools/nimbus-icons. Import: import { FilterAlt } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace FilterIcon with <Icon as={FilterAlt} />",
      "Import FilterAlt from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "FlagFilledIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Flag} /> from @commercetools/nimbus-icons. Import: import { Flag } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace FlagFilledIcon with <Icon as={Flag} />",
      "Import Flag from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "FlagLinearIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={OutlinedFlag} /> from @commercetools/nimbus-icons. Import: import { OutlinedFlag } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace FlagLinearIcon with <Icon as={OutlinedFlag} />",
      "Import OutlinedFlag from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "FlameIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Whatshot} /> from @commercetools/nimbus-icons. Import: import { Whatshot } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace FlameIcon with <Icon as={Whatshot} />",
      "Import Whatshot from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "FractionDigitsIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Svg123} /> from @commercetools/nimbus-icons. Import: import { Svg123 } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace FractionDigitsIcon with <Icon as={Svg123} />",
      "Import Svg123 from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "FrontendStudioIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Web} /> from @commercetools/nimbus-icons. Import: import { Web } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace FrontendStudioIcon with <Icon as={Web} />",
      "Import Web from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "GearIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Settings} /> from @commercetools/nimbus-icons. Import: import { Settings } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace GearIcon with <Icon as={Settings} />",
      "Import Settings from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "GraduationCapIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={School} /> from @commercetools/nimbus-icons. Import: import { School } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace GraduationCapIcon with <Icon as={School} />",
      "Import School from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "GraphIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Analytics} /> from @commercetools/nimbus-icons. Import: import { Analytics } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace GraphIcon with <Icon as={Analytics} />",
      "Import Analytics from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "GridIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={GridView} /> from @commercetools/nimbus-icons. Import: import { GridView } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace GridIcon with <Icon as={GridView} />",
      "Import GridView from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "GroupAddIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={GroupAdd} /> from @commercetools/nimbus-icons. Import: import { GroupAdd } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace GroupAddIcon with <Icon as={GroupAdd} />",
      "Import GroupAdd from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "HeartIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Favorite} /> from @commercetools/nimbus-icons. Import: import { Favorite } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace HeartIcon with <Icon as={Favorite} />",
      "Import Favorite from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "HomeIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Home} /> from @commercetools/nimbus-icons. Import: import { Home } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace HomeIcon with <Icon as={Home} />",
      "Import Home from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "HubIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Hub} /> from @commercetools/nimbus-icons. Import: import { Hub } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace HubIcon with <Icon as={Hub} />",
      "Import Hub from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "InfoIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Info} /> from @commercetools/nimbus-icons. Import: import { Info } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace InfoIcon with <Icon as={Info} />",
      "Import Info from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "LayersIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Layers} /> from @commercetools/nimbus-icons. Import: import { Layers } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace LayersIcon with <Icon as={Layers} />",
      "Import Layers from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "ListIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={List} /> from @commercetools/nimbus-icons. Import: import { List } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace ListIcon with <Icon as={List} />",
      "Import List from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "ListWithSearchIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={ManageSearch} /> from @commercetools/nimbus-icons. Import: import { ManageSearch } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace ListWithSearchIcon with <Icon as={ManageSearch} />",
      "Import ManageSearch from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "LocationIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Place} /> from @commercetools/nimbus-icons. Import: import { Place } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace LocationIcon with <Icon as={Place} />",
      "Import Place from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "LockIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Lock} /> from @commercetools/nimbus-icons. Import: import { Lock } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace LockIcon with <Icon as={Lock} />",
      "Import Lock from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "LogoutIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Logout} /> from @commercetools/nimbus-icons. Import: import { Logout } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace LogoutIcon with <Icon as={Logout} />",
      "Import Logout from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "MailIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Mail} /> from @commercetools/nimbus-icons. Import: import { Mail } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace MailIcon with <Icon as={Mail} />",
      "Import Mail from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "MinimizeIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={CloseFullscreen} /> from @commercetools/nimbus-icons. Import: import { CloseFullscreen } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace MinimizeIcon with <Icon as={CloseFullscreen} />",
      "Import CloseFullscreen from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "NestedViewIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={AccountTree} /> from @commercetools/nimbus-icons. Import: import { AccountTree } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace NestedViewIcon with <Icon as={AccountTree} />",
      "Import AccountTree from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "OperationsIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Engineering} /> from @commercetools/nimbus-icons. Import: import { Engineering } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace OperationsIcon with <Icon as={Engineering} />",
      "Import Engineering from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "PageGearIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={SettingsApplications} /> from @commercetools/nimbus-icons. Import: import { SettingsApplications } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace PageGearIcon with <Icon as={SettingsApplications} />",
      "Import SettingsApplications from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "PagesIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Pages} /> from @commercetools/nimbus-icons. Import: import { Pages } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace PagesIcon with <Icon as={Pages} />",
      "Import Pages from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "PaidIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Paid} /> from @commercetools/nimbus-icons. Import: import { Paid } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace PaidIcon with <Icon as={Paid} />",
      "Import Paid from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "PaperBillInvertedIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Receipt} /> from @commercetools/nimbus-icons. Import: import { Receipt } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace PaperBillInvertedIcon with <Icon as={Receipt} />",
      "Import Receipt from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "PaperclipIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={AttachFile} /> from @commercetools/nimbus-icons. Import: import { AttachFile } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace PaperclipIcon with <Icon as={AttachFile} />",
      "Import AttachFile from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "PinFilledIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={PushPin} /> from @commercetools/nimbus-icons. Import: import { PushPin } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace PinFilledIcon with <Icon as={PushPin} />",
      "Import PushPin from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "PinLinearIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={PushPin} /> from @commercetools/nimbus-icons. Import: import { PushPin } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace PinLinearIcon with <Icon as={PushPin} />",
      "Import PushPin from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "PluginIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Extension} /> from @commercetools/nimbus-icons. Import: import { Extension } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace PluginIcon with <Icon as={Extension} />",
      "Import Extension from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "PlusThinIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Add} /> from @commercetools/nimbus-icons. Import: import { Add } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace PlusThinIcon with <Icon as={Add} />",
      "Import Add from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "PrivacyPolicyIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Policy} /> from @commercetools/nimbus-icons. Import: import { Policy } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace PrivacyPolicyIcon with <Icon as={Policy} />",
      "Import Policy from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "RestoreIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={SettingsBackupRestore} /> from @commercetools/nimbus-icons. Import: import { SettingsBackupRestore } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace RestoreIcon with <Icon as={SettingsBackupRestore} />",
      "Import SettingsBackupRestore from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "ReviewIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={RateReview} /> from @commercetools/nimbus-icons. Import: import { RateReview } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace ReviewIcon with <Icon as={RateReview} />",
      "Import RateReview from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "RightTriangleFilledIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={PlayArrow} /> from @commercetools/nimbus-icons. Import: import { PlayArrow } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace RightTriangleFilledIcon with <Icon as={PlayArrow} />",
      "Import PlayArrow from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "RightTriangleLinearIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={PlayCircleOutline} /> from @commercetools/nimbus-icons. Import: import { PlayCircleOutline } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace RightTriangleLinearIcon with <Icon as={PlayCircleOutline} />",
      "Import PlayCircleOutline from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "RocketIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={RocketLaunch} /> from @commercetools/nimbus-icons. Import: import { RocketLaunch } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace RocketIcon with <Icon as={RocketLaunch} />",
      "Import RocketLaunch from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "ScreenGearIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={DisplaySettings} /> from @commercetools/nimbus-icons. Import: import { DisplaySettings } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace ScreenGearIcon with <Icon as={DisplaySettings} />",
      "Import DisplaySettings from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "ScreenUserIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={PersonalVideo} /> from @commercetools/nimbus-icons. Import: import { PersonalVideo } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace ScreenUserIcon with <Icon as={PersonalVideo} />",
      "Import PersonalVideo from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "SdkIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Terminal} /> from @commercetools/nimbus-icons. Import: import { Terminal } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace SdkIcon with <Icon as={Terminal} />",
      "Import Terminal from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "SidebarCollapseIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={MenuOpen} /> from @commercetools/nimbus-icons. Import: import { MenuOpen } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace SidebarCollapseIcon with <Icon as={MenuOpen} />",
      "Import MenuOpen from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "SidebarExpandIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Menu} /> from @commercetools/nimbus-icons. Import: import { Menu } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace SidebarExpandIcon with <Icon as={Menu} />",
      "Import Menu from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "SortingIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={SwapVert} /> from @commercetools/nimbus-icons. Import: import { SwapVert } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace SortingIcon with <Icon as={SwapVert} />",
      "Import SwapVert from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "SparklesIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={AutoAwesome} /> from @commercetools/nimbus-icons. Import: import { AutoAwesome } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace SparklesIcon with <Icon as={AutoAwesome} />",
      "Import AutoAwesome from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "SpeechBubbleIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={ChatBubble} /> from @commercetools/nimbus-icons. Import: import { ChatBubble } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace SpeechBubbleIcon with <Icon as={ChatBubble} />",
      "Import ChatBubble from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "SpeedometerIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Speed} /> from @commercetools/nimbus-icons. Import: import { Speed } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace SpeedometerIcon with <Icon as={Speed} />",
      "Import Speed from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "SplitIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={CallSplit} /> from @commercetools/nimbus-icons. Import: import { CallSplit } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace SplitIcon with <Icon as={CallSplit} />",
      "Import CallSplit from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "StackIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Layers} /> from @commercetools/nimbus-icons. Import: import { Layers } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace StackIcon with <Icon as={Layers} />",
      "Import Layers from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "StarIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Star} /> from @commercetools/nimbus-icons. Import: import { Star } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace StarIcon with <Icon as={Star} />",
      "Import Star from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "SubdirectoryArrowIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={SubdirectoryArrowRight} /> from @commercetools/nimbus-icons. Import: import { SubdirectoryArrowRight } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace SubdirectoryArrowIcon with <Icon as={SubdirectoryArrowRight} />",
      "Import SubdirectoryArrowRight from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "SupportIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={SupportAgent} /> from @commercetools/nimbus-icons. Import: import { SupportAgent } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace SupportIcon with <Icon as={SupportAgent} />",
      "Import SupportAgent from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "SwitcherIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={SwapHoriz} /> from @commercetools/nimbus-icons. Import: import { SwapHoriz } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace SwitcherIcon with <Icon as={SwapHoriz} />",
      "Import SwapHoriz from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "TableIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={TableChart} /> from @commercetools/nimbus-icons. Import: import { TableChart } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace TableIcon with <Icon as={TableChart} />",
      "Import TableChart from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "TagIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Label} /> from @commercetools/nimbus-icons. Import: import { Label } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace TagIcon with <Icon as={Label} />",
      "Import Label from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "TagMultiIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Sell} /> from @commercetools/nimbus-icons. Import: import { Sell } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace TagMultiIcon with <Icon as={Sell} />",
      "Import Sell from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "TagStackedIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Bookmarks} /> from @commercetools/nimbus-icons. Import: import { Bookmarks } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace TagStackedIcon with <Icon as={Bookmarks} />",
      "Import Bookmarks from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "TerminalIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Terminal} /> from @commercetools/nimbus-icons. Import: import { Terminal } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace TerminalIcon with <Icon as={Terminal} />",
      "Import Terminal from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "TruckIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={LocalShipping} /> from @commercetools/nimbus-icons. Import: import { LocalShipping } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace TruckIcon with <Icon as={LocalShipping} />",
      "Import LocalShipping from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "TuneIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Tune} /> from @commercetools/nimbus-icons. Import: import { Tune } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace TuneIcon with <Icon as={Tune} />",
      "Import Tune from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "UserFilledIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Person} /> from @commercetools/nimbus-icons. Import: import { Person } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace UserFilledIcon with <Icon as={Person} />",
      "Import Person from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "UserLinearIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={PersonOutline} /> from @commercetools/nimbus-icons. Import: import { PersonOutline } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace UserLinearIcon with <Icon as={PersonOutline} />",
      "Import PersonOutline from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "UsersIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Group} /> from @commercetools/nimbus-icons. Import: import { Group } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace UsersIcon with <Icon as={Group} />",
      "Import Group from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "VerifiedIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Verified} /> from @commercetools/nimbus-icons. Import: import { Verified } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace VerifiedIcon with <Icon as={Verified} />",
      "Import Verified from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "ViewGridPlusIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={DashboardCustomize} /> from @commercetools/nimbus-icons. Import: import { DashboardCustomize } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace ViewGridPlusIcon with <Icon as={DashboardCustomize} />",
      "Import DashboardCustomize from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "WindowEyeIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Preview} /> from @commercetools/nimbus-icons. Import: import { Preview } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace WindowEyeIcon with <Icon as={Preview} />",
      "Import Preview from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },
  {
    uiKitName: "WorldIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      'Use <Icon as={Public} /> from @commercetools/nimbus-icons. Import: import { Public } from "@commercetools/nimbus-icons";',
    breakingChanges: [
      "Replace WorldIcon with <Icon as={Public} />",
      "Import Public from @commercetools/nimbus-icons",
      "Wrap with <Icon> component from @commercetools/nimbus",
    ],
    iconWrapper: ICON_WRAPPER,
  },

  // -------------------------------------------------------------------------
  // Icons — generic
  // -------------------------------------------------------------------------
  {
    uiKitName: "CustomIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      "Use <Icon as={YourSvg}> or <Icon><YourSvg /></Icon> to wrap custom SVGs with design-system sizing and color tokens. Use InlineSvg for raw SVG markup.",
    breakingChanges: [
      "Replace CustomIcon with <Icon as={YourSvg}> or <InlineSvg>",
      "Prefer the as prop for the shorthand form; children also works",
    ],
    propMappings: [
      {
        uiKitProp: "children",
        nimbusProp: "children",
        changeType: "structural",
        notes:
          "Prefer the as prop: <Icon as={YourSvg} />. Passing as children also works: <Icon><YourSvg /></Icon>.",
      },
    ],
    // Numeric-only sizes: CustomIcon only accepts "10"–"40", not the named aliases ("small"/"medium"/"big").
    iconWrapper: {
      ...ICON_WRAPPER_BASE,
      sizeMapping: [
        { from: "10", to: "2xs" },
        { from: "20", to: "xs" },
        { from: "30", to: "sm" },
        { from: "40", to: "md" },
      ],
    },
  },
  {
    uiKitName: "LeadingIcon",
    nimbusEquivalent: "Icon",
    importPath: "@commercetools/nimbus",
    mappingType: "variant",
    notes:
      "Pass icon as a child to the parent component (e.g. as a child of <Button>) rather than using a wrapper.",
    breakingChanges: [
      "Remove LeadingIcon wrapper",
      "Pass icon directly to the parent component's icon slot",
    ],
    propMappings: [
      {
        uiKitProp: "children",
        nimbusProp: null,
        changeType: "structural",
        notes:
          "Remove the LeadingIcon wrapper and pass the icon directly as a child of the parent component.",
      },
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
    nimbusEquivalent: "Nimbus Icon Library",
    importPath: "@commercetools/nimbus-icons",
    mappingType: "pattern",
    notes:
      'Always wrap icons in the Icon component: <Icon as={AccountCircle} size="2xs" color="neutral.11" />. ' +
      "Import the icon from @commercetools/nimbus-icons and the Icon wrapper from @commercetools/nimbus. " +
      "Never use bare icon components — the unwrapped form skips design-system sizing and color tokens.",
    breakingChanges: [
      "Update import paths to @commercetools/nimbus-icons",
      "Icon names are PascalCase (e.g. Add, ChevronLeft); only icons starting with numbers use a Svg prefix (e.g. Svg123)",
      "Icons must be wrapped in <Icon as={...}> for correct sizing and theming",
    ],
    iconWrapper: ICON_WRAPPER,
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
    propMappings: [
      {
        uiKitProp: "theme",
        nimbusProp: null,
        changeType: "structural",
        notes:
          "Theme configuration shape changed; see NimbusProvider's themes/forcedTheme/defaultTheme props.",
      },
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
