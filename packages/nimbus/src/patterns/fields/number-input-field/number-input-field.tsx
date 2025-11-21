import { NumberInput } from "@/components/number-input/number-input";
import { FormField, FieldErrors } from "@/components";
import type { NumberInputFieldProps } from "./number-input-field.types";

/**
 * # NumberInputField
 *
 * A pre-composed form field component that combines NumberInput with FormField features
 * like labels, descriptions, error handling, and validation feedback.
 *
 * This component provides a simple, flat API for numeric input use cases with
 * increment/decrement controls, locale-aware formatting, and proper validation.
 *
 * @supportsStyleProps
 *
 * @example
 * ```tsx
 * <NumberInputField
 *   label="Quantity"
 *   description="Enter the product quantity"
 *   value={quantity}
 *   onChange={setQuantity}
 *   minValue={1}
 *   maxValue={100}
 *   errors={{ missing: true }}
 *   touched={touched}
 *   isRequired
 * />
 * ```
 */

export const NumberInputField = ({
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
  ...numberInputProps
}: NumberInputFieldProps) => {
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
        <NumberInput size={size} {...numberInputProps} />
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

NumberInputField.displayName = "NumberInputField";
