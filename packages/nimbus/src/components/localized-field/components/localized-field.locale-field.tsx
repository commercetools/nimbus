import {
  FormField,
  TextInput,
  NumberInput,
  MultilineTextInput,
  RichTextInput,
} from "@/components";
import {
  LocalizedFieldLocaleFieldRootSlot,
  // LocalizedFieldLocaleFieldDescriptionSlot,
  // LocalizedFieldLocaleFieldErrorSlot,
  LocalizedFieldLocaleFieldInputSlot,
  LocalizedFieldLocaleFieldLabelSlot,
} from "../localized-field.slots";
import type { LocalizedFieldLocaleFieldProps } from "../localized-field.types";

export const LocalizedFieldLocaleField = ({
  type,
  size,
  locale,
  inputValue = "",
  placeholder,
  description,
  warning,
  error,
  onChange,
  onBlur,
  onFocus,
  isReadOnly,
  isDisabled,
  isInvalid,
}: LocalizedFieldLocaleFieldProps) => {
  let InputComponent;
  switch (type) {
    case "text":
    default:
      InputComponent = TextInput;
      break;
    case "multiLine":
      InputComponent = MultilineTextInput;
      break;
    // case "money":
    //   InputComponent = NumberInput;
    //   break;
    case "richText":
      InputComponent = RichTextInput;
      break;
  }

  return (
    <LocalizedFieldLocaleFieldRootSlot asChild>
      <FormField.Root
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        isInvalid={isInvalid || !!error}
        direction="row"
        size={size}
      >
        <LocalizedFieldLocaleFieldLabelSlot asChild>
          <FormField.Label>{locale.toLocaleUpperCase()}</FormField.Label>
        </LocalizedFieldLocaleFieldLabelSlot>
        <FormField.Input>
          <LocalizedFieldLocaleFieldInputSlot asChild>
            <InputComponent
              // @ts-expect-error: the 'value' should be a string for everything but the number/money input, which must be a number
              // in its' infinite wisdom, ts interprets the union type as 'undefined' because of course it does
              value={inputValue}
              placeholder={placeholder}
              onChange={(v: string | number) => onChange(v, locale)}
              onBlur={(e: React.FocusEvent) => onBlur?.(e, locale)}
              onFocus={(e: React.FocusEvent) => onFocus?.(e, locale)}
              isDisabled={isDisabled}
              isReadOnly={isReadOnly}
              isInvalid={isInvalid || !!error}
              // size={size}
            />
          </LocalizedFieldLocaleFieldInputSlot>
        </FormField.Input>
        {description && !warning && (
          <FormField.Description>{description}</FormField.Description>
        )}
        {warning && (
          <FormField.Description role="status">{warning}</FormField.Description>
        )}
        {error && <FormField.Error>{error}</FormField.Error>}
      </FormField.Root>
    </LocalizedFieldLocaleFieldRootSlot>
  );
};
