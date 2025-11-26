import { MultilineTextInput } from "@/components/multiline-text-input/multiline-text-input";
import type { MultilineTextInputFieldProps } from "./multiline-text-input-field.types";
import { FormField, FieldErrors } from "@/components";

/**
 * # MultilineTextInputField
 *
 * A pre-composed form field component that combines MultilineTextInput with FormField features
 * like labels, descriptions, error handling, and validation feedback.
 *
 * This component provides a simple, flat API for common text area use cases and serves
 * as a drop-in replacement for UI-Kit's MultilineTextField, maintaining compatibility with the
 * same error format and localized error messages.
 *
 * @example
 * ```tsx
 * <MultilineTextInputField
 *   label="Project description"
 *   description="Enter a descriptive summary for your project"
 *   placeholder="Describe your project..."
 *   value={value}
 *   onChange={setValue}
 *   errors={{ missing: true }}
 *   isRequired
 *   rows={4}
 *   autoGrow
 * />
 * ```
 */

export const MultilineTextInputField = ({
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
}: MultilineTextInputFieldProps) => {
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
        <MultilineTextInput
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

MultilineTextInputField.displayName = "MultilineTextInputField";
