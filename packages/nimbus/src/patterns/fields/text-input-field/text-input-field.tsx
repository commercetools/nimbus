import { TextInput } from "@/components/text-input";
import type { TextInputFieldProps } from "./text-input-field.types";
import { FormField, FieldErrors } from "@/components";
import { extractStyleProps } from "@/utils";

/**
 * # TextInputField
 *
 * A pre-composed form field component that combines TextInput with FormField features
 * like labels, descriptions, error handling, and validation feedback.
 *
 * This component provides a simple, flat API for common text input use cases and serves
 * as a drop-in replacement for UI-Kit's TextField, maintaining compatibility with the
 * same error format and localized error messages.
 *
 * @example
 * ```tsx
 * <TextInputField
 *   label="Project name"
 *   description="Enter a descriptive name for your project"
 *   placeholder="My Awesome Project"
 *   value={value}
 *   onChange={setValue}
 *   errors={{ missing: true }}
 *   isRequired
 * />
 * ```
 */

export const TextInputField = ({
  label,
  description,
  errors,
  info,
  onChange,
  touched = false,
  isDisabled = false,
  isReadOnly = false,
  value,
  placeholder,
  ...rest
}: TextInputFieldProps) => {
  const [styleProps, functionalProps] = extractStyleProps(rest);
  // Determine if we should show errors
  const hasErrors = touched && errors && Object.values(errors).some(Boolean);

  return (
    <FormField.Root
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isInvalid={hasErrors}
      {...functionalProps}
    >
      <FormField.Label>{label}</FormField.Label>
      <FormField.Input>
        <TextInput
          {...styleProps}
          type="text"
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
          <FieldErrors errors={errors} />
        </FormField.Error>
      )}
      {info && <FormField.InfoBox>{info}</FormField.InfoBox>}
    </FormField.Root>
  );
};

TextInputField.displayName = "TextInputField";
