import { TextInput } from "../text-input";
import type { TextInputFieldProps } from "./text-input-field.types";
import { FormField } from "@/components";

export const TextInputField = ({
  label,
  description,
  errors,
  infoBox,
  onChange,
  value,
  placeholder,
  isRequired,
  isInvalid,
  isDisabled,
  isReadOnly,
  id,
  ...rest
}: TextInputFieldProps) => (
  <FormField.Root
    isRequired={isRequired}
    isInvalid={isInvalid}
    isDisabled={isDisabled}
    isReadOnly={isReadOnly}
    id={id}
  >
    {label && <FormField.Label>{label}</FormField.Label>}
    <FormField.Input>
      <TextInput
        {...rest}
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      />
    </FormField.Input>
    {description && (
      <FormField.Description>{description}</FormField.Description>
    )}
    {errors &&
      errors.map((error) => <FormField.Error>{error}</FormField.Error>)}
    {infoBox && <FormField.InfoBox>{infoBox}</FormField.InfoBox>}
  </FormField.Root>
);

TextInputField.displayName = "TextInputField";
