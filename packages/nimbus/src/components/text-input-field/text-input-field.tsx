import { TextInput } from "../text-input";
import type { TextInputFieldProps } from "./text-input-field.types";
import { FormField, FieldErrors } from "@/components";
import { extractStyleProps } from "@/utils/extractStyleProps";

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
  infoBox,
  onChange,
  value,
  placeholder,
  ...rest
}: TextInputFieldProps) => {
  const [styleProps, functionalProps] = extractStyleProps(rest);

  return (
    <FormField.Root {...functionalProps}>
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
      {errors && (
        <FormField.Error>
          <FieldErrors errors={errors} />
        </FormField.Error>
      )}
      {infoBox && <FormField.InfoBox>{infoBox}</FormField.InfoBox>}
    </FormField.Root>
  );
};

TextInputField.displayName = "TextInputField";
