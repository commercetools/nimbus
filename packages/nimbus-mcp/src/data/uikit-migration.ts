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
        uiKitProp: "iconPosition",
        nimbusProp: null,
        changeType: "removed",
        notes: "Pass icon as a child.",
      },
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
      "tone prop replaced by colorPalette",
      "tone value 'positive' stays 'positive' (use colorPalette='positive')",
      "tone value 'critical' stays 'critical' (use colorPalette='critical')",
      "tone value 'warning' stays 'warning' (use colorPalette='warning')",
      "tone value 'information' → colorPalette='info'",
      "tone values 'primary' and 'secondary' → colorPalette='primary' or 'neutral'",
      "isCondensed prop replaced by size='xs'",
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
      "Direct replacement. Column definitions use the new columns prop with accessor keys.",
    breakingChanges: [
      "columns prop shape changed to use accessor and header fields",
      "Row selection API updated to use onSelectionChange with a Set of keys",
    ],
    propMappings: [
      {
        uiKitProp: "columns",
        nimbusProp: "columns",
        changeType: "structural",
        notes: "Shape changed to use accessor and header fields.",
      },
      {
        uiKitProp: "onRowClick",
        nimbusProp: "onSelectionChange",
        changeType: "structural",
        notes:
          "Row interaction via onRowClick replaced by onSelectionChange with a Set of keys.",
      },
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
      "onSelect replaced by onAction on Menu.Item or Menu",
    ],
    propMappings: [
      {
        uiKitProp: "children",
        nimbusProp: null,
        changeType: "structural",
        notes: "Compose Menu.Root > Menu.Trigger + Menu.Content > Menu.Item.",
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
    nimbusEquivalent: "Box",
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
    nimbusEquivalent: "Box",
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
  // Icons
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
      'Always wrap icons in the Icon component: <Icon as={SvgAccountCircle} size="2xs" color="neutral.11" />. ' +
      "Import the icon from @commercetools/nimbus-icons and the Icon wrapper from @commercetools/nimbus. " +
      "Never use bare icon components — the unwrapped form skips design-system sizing and color tokens.",
    breakingChanges: [
      "Update import paths to @commercetools/nimbus-icons",
      "Icon names follow Svg prefix convention",
      "Icons must be wrapped in <Icon as={...}> for correct sizing and theming",
    ],
    iconWrapper: {
      ...ICON_WRAPPER_BASE,
      sizeMapping: [
        { from: "small", to: "2xs" },
        { from: "medium", to: "xs" },
        { from: "big", to: "md" },
        { from: "10", to: "2xs" },
        { from: "20", to: "xs" },
        { from: "30", to: "sm" },
        { from: "40", to: "md" },
      ],
    },
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
