import { LocalizedField as LocalizedFieldRoot } from "./components/localized-field.root";
import {
  getLocaleFieldAttribute,
  createLocalizedString,
  isEmpty,
  omitEmptyTranslations,
  isTouched,
} from "./utils/localized-field.utils";

export const LocalizedField = Object.assign(LocalizedFieldRoot, {
  // Add util methods here for compat with uikit - see https://github.com/commercetools/ui-kit/blob/e97e0c7e8f3e9393981bf1949573212d7c571c90/packages/components/inputs/localized-text-input/src/localized-text-input.tsx#L396
  getId: getLocaleFieldAttribute,
  getName: getLocaleFieldAttribute,
  isTouched,
  isEmpty,
  createLocalizedString,
  omitEmptyTranslations,
});
