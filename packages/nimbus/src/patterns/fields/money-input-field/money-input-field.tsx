import { MoneyInput } from "@/components/money-input/money-input";
import { FormField, FieldErrors } from "@/components";
import type { MoneyInputFieldProps } from "./money-input-field.types";

/**
 * # MoneyInputField
 *
 * A pre-composed form field component that combines MoneyInput with FormField features
 * like labels, descriptions, error handling, and validation feedback.
 *
 * This component provides a simple, flat API for monetary input use cases, combining
 * a currency selector and amount input into a single field.
 *
 * Contains two focusable inputs: currency selector and amount input.
 *
 * @supportsStyleProps
 *
 * @example
 * ```tsx
 * <MoneyInputField
 *   label="Product Price"
 *   description="Enter the product price with currency"
 *   currencies={["USD", "EUR", "GBP", "JPY"]}
 *   value={{ amount: "99.99", currencyCode: "USD" }}
 *   onValueChange={setValue}
 *   errors={{ missing: true }}
 *   touched={touched}
 *   isRequired
 * />
 * ```
 */

export const MoneyInputField = ({
  id,
  label,
  description,
  info,
  errors,
  renderError,
  touched = false,
  isRequired = false,
  isDisabled = false,
  isReadOnly = false,
  isInvalid = false,
  size = "md",
  ...moneyInputProps
}: MoneyInputFieldProps) => {
  // Determine if we should show errors
  const hasErrors = touched && errors && Object.values(errors).some(Boolean);

  return (
    <FormField.Root
      id={id}
      size={size}
      isInvalid={hasErrors || isInvalid}
      isRequired={isRequired}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
    >
      <FormField.Label>{label}</FormField.Label>
      <FormField.Input>
        <MoneyInput size={size} {...moneyInputProps} />
      </FormField.Input>

      {description && (
        <FormField.Description>{description}</FormField.Description>
      )}

      {info && <FormField.InfoBox>{info}</FormField.InfoBox>}
      {hasErrors && (
        <FormField.Error>
          <FieldErrors
            id={`${id}-errors`}
            errors={errors}
            renderError={renderError}
          />
        </FormField.Error>
      )}
    </FormField.Root>
  );
};

MoneyInputField.displayName = "MoneyInputField";
