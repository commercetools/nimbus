import type { ReactNode, FocusEvent } from "react";
import type { LocalizedFieldRootSlotProps } from "./localized-field.slots";

/**
 * Object that maps input data to a specific locale.
 * The locale is specified as the key, and the data is specified as the value, e.g.:
 * { ['en-US']: 'hello', ['zh-Hans']: '你好’ }
 */
export type LocaleInputData = Record<string, string>;
/**
 * Object that maps field data to a specific locale.
 * The locale is specified as the key, and the data is specified as the value, e.g.:
 * { ['en-US']: 'hello', ['zh-Hans']: '你好’ }
 */
export type LocaleFieldData = Record<string, ReactNode>;

export interface LocalizedFieldProps
  extends Omit<LocalizedFieldRootSlotProps, "onChange" | "onBlur" | "onFocus"> {
  /** locale whose input field is displayed when field group is collapsed */
  defaultLocale: string;
  /** input values for each locale*/
  valuesByLocale: LocaleInputData;
  /** input placeholders for each locale */
  placeholdersByLocale?: LocaleInputData;
  /** field decriptions for each locale */
  descriptionsByLocale?: LocaleFieldData;
  /** field warnings for each locale */
  warningsByLocale?: LocaleFieldData;
  /** field errors for each locale */
  errorsByLocale?: LocaleFieldData;
  /**
   * label for field group (all locales).
   * if a label is not provided, you must provide an `aria-label`
   */
  label?: ReactNode;
  /** infoBox (hint/help tooltip) for field group (all locales) */
  infoBox?: ReactNode;
  /** description for field group (all locales) */
  description?: ReactNode;
  /** error for field group (all locales) */
  error?: ReactNode;
  /** warning for field group (all locales) */
  warning?: ReactNode;
  /** true if the field is a required field */
  isRequired?: boolean;
  /** true if all locale field inputs are invalid */
  isInvalid?: boolean;
  /** true if the field is disabled */
  isDisabled?: boolean;
  /** true, if the field is read only  */
  isReadOnly?: boolean;
  /** change handler for each locale's input */
  onChange: (value: string, locale: string) => void;
  /** blur handler for each locale's input */
  onBlur?: (e: FocusEvent<HTMLInputElement, Element>, locale: string) => void;
  /** focus handler for each locale's input */
  onFocus?: (e: FocusEvent<HTMLInputElement, Element>, locale: string) => void;
  /**
   * controls whether field group is expanded on mount.
   * default: `false` (closed)
   */
  defaultExpanded?: boolean;
  /**
   * controls whether all locale input fields should be displayed.
   * removes show/hide toggle controls and displays all locales if `true`.
   * default: `false`
   */
  displayAllLocales?: boolean;
}
