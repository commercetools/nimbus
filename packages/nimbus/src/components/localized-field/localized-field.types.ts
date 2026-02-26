import type { ReactNode, FocusEvent } from "react";
import type {
  MoneyInputValue,
  CustomEvent,
  CurrencyCode,
} from "../money-input/money-input.types";
import type { HTMLChakraProps, SlotRecipeProps } from "@chakra-ui/react/styled-system";
import type { OmitInternalProps } from "../../type-utils/omit-props";

// ============================================================
// RECIPE PROPS
// ============================================================

type LocalizedFieldRecipeProps = {
  /** Size variant of the localized field */
  size?: SlotRecipeProps<"nimbusLocalizedField">["size"];
  /** Input type variant (text, multiLine, richText, money) */
  type?: SlotRecipeProps<"nimbusLocalizedField">["type"];
};

// ============================================================
// SLOT PROPS
// ============================================================

export type LocalizedFieldRootSlotProps = HTMLChakraProps<
  "fieldset",
  LocalizedFieldRecipeProps
>;

export type LocalizedFieldLabelSlotProps = HTMLChakraProps<"label">;

export type LocalizedFieldInfoDialogSlotProps = HTMLChakraProps<"div">;

export type LocalizedFieldFieldsContainerSlotProps = HTMLChakraProps<"div">;

export type LocalizedFieldDescriptionSlotProps = HTMLChakraProps<"div">;

export type LocalizedFieldErrorSlotProps = HTMLChakraProps<"div">;

export type LocalizedFieldToggleButtonContainerSlotProps =
  HTMLChakraProps<"div">;

export type LocalizedFieldLocaleFieldRootSlotProps = HTMLChakraProps<"div">;

export type LocalizedFieldLocaleFieldLabelSlotProps = HTMLChakraProps<"div">;

export type LocalizedFieldLocaleFieldInputSlotProps = HTMLChakraProps<"div">;

// ============================================================
// HELPER TYPES
// ============================================================

type LocalizedFieldRecipeVariantProps = {
  size?: "md" | "sm";
};

/**
 * Object that contains the translation of a string for each locale.
 * Used to define values for "text", "multiLine", and "richText" input types.
 * The locale is specified as the key, and the string is specified as the value, e.g.:
 * { ['en-US']: 'hello', ['zh-Hans']: '你好’ }
 */
export type LocalizedString = { [locale: string]: string | undefined };
/**
 * Object that contains a currency value for each currency.
 * Used to define values for "money" input type
 * The currency code is specified as the key,
 * and an object containing the amount and currencyCode is specified as the value, e.g.:
 * {
 *  EUR: {
 *    amount: '12.00'
 *    currencyCode: 'EUR'
 *   },
 *  USD: {
 *    amount: '10.00'
 *    currencyCode: 'USD'
 *   },
 * }
 */
export type LocalizedCurrency = {
  [currencyCode: string]: MoneyInputValue | undefined;
};
/**
 * Object that maps field data to a specific locale.
 * The locale is specified as the key, and the data is specified as the value, e.g.:
 * { ['en-US']: 'hello', ['zh-Hans']: '你好’ }
 */
export type LocaleFieldData = Record<string, ReactNode>;

/**
 * Standardized change event for localized fields to ensure cross browser consistency
 */
export type LocalizedFieldChangeEvent = {
  target: {
    id?: string;
    name?: string;
    locale?: string;
    currency?: CurrencyCode;
    value: CustomEvent["target"]["value"];
  };
};

// ============================================================
// MAIN PROPS
// ============================================================

export type LocalizedFieldProps = LocalizedFieldRecipeVariantProps &
  OmitInternalProps<
    LocalizedFieldRootSlotProps,
    "onChange" | "onBlur" | "onFocus" | "size"
  > & {
    /**
     * Type of input displayed in locale fields
     * default: 'text'
     */
    type?: "text" | "multiLine" | "richText" | "money";
    /**
     * HTML `id` property for field group.
     * Each locale field's `id` will be suffixed with its' locale, e.g.:
     * `${id}.${lang}` i.e. `foo.en`
     */
    id?: string;
    /**
     * HTML `name` property for field group.
     * Each locale field's `name` will be suffixed with its' locale, e.g.:
     * `${name}.${lang}` i.e. `foo.en`
     */
    name?: string;
    /** Locale or currency whose input field is displayed when field group is collapsed */
    defaultLocaleOrCurrency: string | CurrencyCode;
    /** Input values for each locale or currency */
    valuesByLocaleOrCurrency: LocalizedString | LocalizedCurrency;
    /** Input placeholders for each locale or currency */
    placeholdersByLocaleOrCurrency?: LocalizedString;
    /** Field decriptions for each locale or currency */
    descriptionsByLocaleOrCurrency?: LocaleFieldData;
    /** Field warnings for each locale or currency */
    warningsByLocaleOrCurrency?: LocaleFieldData;
    /** Field errors for each locale or currency */
    errorsByLocaleOrCurrency?: LocaleFieldData;
    /**
     * Label for field group (all locales).
     * If a label is not provided, you must provide an `aria-label`
     */
    label?: ReactNode;
    /** Hint/help tooltip (infoBox) for field group (all locales) */
    hint?: ReactNode;
    /** Description for field group (all locales) */
    description?: ReactNode;
    /** Warning for field group (all locales) */
    warning?: ReactNode;
    /**
     * For compatibility with UI Kit FieldWarnings
     * A map of warnings. Warning messages for known warnings are rendered automatically.
     * <br/>
     * Unknown warnings will be forwarded to renderWarning.
     */
    warnings?: Record<string, boolean>;
    /**
     * For compatibility with UI Kit FieldWarnings
     * Called with custom warnings, as renderWarning(key, warning). This function can return a message which will be wrapped in a WarningMessage.
     * <br />
     * It can also return null to show no warning.
     */
    renderWarning?: (key: string, warning?: boolean) => ReactNode;
    /** Error for field group (all locales) */
    error?: ReactNode;
    /**
     * For compatibility with UI Kit FieldErrors
     * A map of errors. Error messages for known errors are rendered automatically.
     * <br />
     * Unknown errors will be forwarded to `renderError`
     */
    errors?: Record<string, boolean>;
    /**
     * For compatibility with UI Kit FieldErrors
     * Called with custom errors. This function can return a message which will be wrapped in an ErrorMessage. It can also return null to show no error.
     */
    renderError?: (key: string, error?: boolean) => ReactNode;
    /**
     * Indicates whether the field was touched.
     * Errors will only be shown when the field was touched.
     */
    touched?: boolean;
    /** True if the field is a required field */
    isRequired?: boolean;
    /** True if the field is disabled */
    isDisabled?: boolean;
    /** True if the field is read only  */
    isReadOnly?: boolean;
    /** Change handler for each locale's input */
    onChange: (e: LocalizedFieldChangeEvent) => void;
    /** Blur handler for each locale's input */
    onBlur?: (
      e: FocusEvent<Element, Element> | CustomEvent,
      locale: string
    ) => void;
    /** Focus handler for each locale's input */
    onFocus?: (
      e: FocusEvent<Element, Element> | CustomEvent,
      locale: string
    ) => void;
    /**
     * Controls whether field group is expanded on mount.
     * Default: `false` (closed)
     */
    defaultExpanded?: boolean;
    /**
     * Controls whether all locale or currency input fields should be displayed.
     * Removes show/hide toggle controls and displays all locales if `true`.
     * Default: `false`
     */
    displayAllLocalesOrCurrencies?: boolean;
    /**
     * HTML `data-` attributes for locale fields.
     * Each field's `data-` attribute will be suffixed with its' locale, e.g.:
     * `${name}.${lang}` i.e. `foo.en`
     */
    ["data-test"]?: string;
    ["data-testid"]?: string;
    ["data-track-component"]?: string;
    // TODO: do we need `hasHighPrecisionBadge` for type="money"
  };

/** internal type for object containing all data for a single locale */
export type MergedLocaleFieldData = {
  localeOrCurrency: string | CurrencyCode;
  inputValue: string | MoneyInputValue | undefined;
  placeholder?: string;
  description?: ReactNode;
  warning?: ReactNode;
  error?: ReactNode;
  autoFocus?: boolean;
};

export type LocalizedFieldLocaleFieldProps = LocalizedFieldRecipeVariantProps &
  MergedLocaleFieldData &
  Pick<
    LocalizedFieldProps,
    | "onChange"
    | "onBlur"
    | "onFocus"
    | "id"
    | "name"
    | "label"
    | "touched"
    | "isRequired"
    | "isDisabled"
    | "isReadOnly"
    | "type"
    | "data-test"
    | "data-testid"
    | "data-track-component"
  > & {
    isInvalid?: boolean;
  };
