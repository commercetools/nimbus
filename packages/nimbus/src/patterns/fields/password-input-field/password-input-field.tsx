import { PasswordInput } from "@/components/password-input/password-input";
import type { PasswordInputFieldProps } from "./password-input-field.types";
import { FormField, FieldErrors } from "@/components";

/**
 * # PasswordInputField
 *
 * A pre-composed form field component that combines PasswordInput with FormField features
 * like labels, descriptions, error handling, and validation feedback.
 *
 * This component provides a simple, flat API for password input use cases and serves
 * as a drop-in replacement for UI-Kit's PasswordField, maintaining compatibility with the
 * same error format and localized error messages.
 *
 * @example
 * ```tsx
 * <PasswordInputField
 *   label="Password"
 *   description="Enter a secure password"
 *   placeholder="********"
 *   value={value}
 *   onChange={setValue}
 *   errors={{ missing: true }}
 *   isRequired
 * />
 * ```
 */

export const PasswordInputField = ({
  id,
  label,
  description,
  info,
  errors,
  onChange,
  renderError,
  touched = false,
  isRequired = false,
  isDisabled = false,
  isReadOnly = false,
  isInvalid = false,
  size = "md",
  value,
  placeholder,
  ...rest
}: PasswordInputFieldProps) => {
  // Determine if we should show errors
  const hasErrors = touched && errors && Object.values(errors).some(Boolean);

  return (
    <FormField.Root
      id={id}
      size={size}
      isRequired={isRequired}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isInvalid={hasErrors || isInvalid}
    >
      <FormField.Label>{label}</FormField.Label>
      <FormField.Input>
        <PasswordInput
          {...rest}
          size={size}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
        />
      </FormField.Input>
      {description && (
        <FormField.Description>{description}</FormField.Description>
      )}
      {hasErrors && (
        <FormField.Error>
          <FieldErrors errors={errors} renderError={renderError} />
        </FormField.Error>
      )}
      {info && <FormField.InfoBox>{info}</FormField.InfoBox>}
    </FormField.Root>
  );
};

PasswordInputField.displayName = "PasswordInputField";
