import { LocalizedFieldRoot } from "./components";
import {
  getLocaleFieldAttribute,
  createLocalizedString,
  isEmpty,
  omitEmptyTranslations,
  isTouched,
  RequiredValueErrorMessage,
  toFieldErrors,
  convertToMoneyValues,
  parseMoneyValues,
  getHighPrecisionCurrencies,
  getEmptyCurrencies,
} from "./utils/localized-field.utils";

/**
 * LocalizedField component with utility methods for managing localized input fields.
 *
 * This component provides a fieldset for managing multiple locale-specific or currency-specific
 * input fields with expand/collapse functionality and integrated validation display.
 *
 * **Utility Methods** (for compatibility with UI Kit):
 * - `getId` / `getName`: Format field attributes with locale suffix
 * - `isTouched`: Check if any locale field has been touched
 * - `isEmpty`: Check if all locale fields are empty
 * - `createLocalizedString`: Create empty localized string object
 * - `omitEmptyTranslations`: Remove empty translations from localized object
 * - `RequiredValueErrorMessage`: Standard error message component
 * - `toFieldErrors`: Convert errors to field error format
 * - `convertToMoneyValues` / `parseMoneyValues`: Money value conversion utilities
 * - `getHighPrecisionCurrencies` / `getEmptyCurrencies`: Currency utilities
 *
 * @example
 * ```tsx
 * <LocalizedField
 *   type="text"
 *   label="Product Name"
 *   defaultLocaleOrCurrency="en"
 *   valuesByLocaleOrCurrency={{ en: "Product", de: "Produkt" }}
 *   onChange={(e) => console.log(e.target.locale, e.target.value)}
 * />
 * ```
 */
export const LocalizedField = Object.assign(LocalizedFieldRoot, {
  // Add util methods here for compat with uikit - see https://github.com/commercetools/ui-kit/blob/e97e0c7e8f3e9393981bf1949573212d7c571c90/packages/components/inputs/localized-text-input/src/localized-text-input.tsx#L396
  getId: getLocaleFieldAttribute,
  getName: getLocaleFieldAttribute,
  isTouched,
  isEmpty,
  createLocalizedString,
  omitEmptyTranslations,
  RequiredValueErrorMessage,
  toFieldErrors,
  convertToMoneyValues,
  parseMoneyValues,
  getHighPrecisionCurrencies,
  getEmptyCurrencies,
});
