import { FormField, TextInput } from "@/components";
import {
  // LocalizedFieldLocaleFieldDescriptionSlot,
  // LocalizedFieldLocaleFieldErrorSlot,
  // LocalizedFieldLocaleFieldInputSlot,
  LocalizedFieldLocaleFieldLabelSlot,
} from "../localized-field.slots";
import type { LocalizedFieldProps } from "../localized-field.types";
import type { AllDataForLocale } from "./localized-field.root";

export const LocalizedFieldLocaleField = ({
  locale,
  inputValue,
  placeholder,
  description,
  warning,
  error,
  onChange,
  onBlur,
  onFocus,
}: AllDataForLocale &
  Pick<LocalizedFieldProps, "onChange" | "onBlur" | "onFocus" | "id">) => {
  console.log(inputValue);
  return (
    <FormField.Root>
      <LocalizedFieldLocaleFieldLabelSlot asChild>
        <FormField.Label>{locale}</FormField.Label>
      </LocalizedFieldLocaleFieldLabelSlot>

      <FormField.Input>
        <TextInput
          value={inputValue}
          placeholder={placeholder}
          onChange={(v) => onChange(v, locale)}
          onBlur={(e) => onBlur?.(e, locale)}
          onFocus={(e) => onFocus?.(e, locale)}
        />
      </FormField.Input>
      {description && !warning && (
        <FormField.Description>{description}</FormField.Description>
      )}

      {warning && (
        <FormField.Description role="status">{warning}</FormField.Description>
      )}
      {error && <FormField.Error>{error}</FormField.Error>}
    </FormField.Root>
  );
};
