import { useCallback } from "react";
import {
  FormField,
  TextInput,
  NumberInput,
  MultilineTextInput,
  RichTextInput,
} from "@/components";
import {
  LocalizedFieldLocaleFieldRootSlot,
  LocalizedFieldLocaleFieldInputSlot,
  LocalizedFieldLocaleFieldLabelSlot,
} from "../localized-field.slots";
import type { LocalizedFieldLocaleFieldProps } from "../localized-field.types";

export const LocalizedFieldLocaleField = ({
  type,
  size,
  localeOrCurrency,
  id,
  name,
  inputValue = "",
  description,
  warning,
  error,
  onChange,
  onBlur,
  onFocus,
  isReadOnly,
  isDisabled,
  isInvalid,
  ...otherProps
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
    case "money":
      InputComponent = NumberInput;
      break;
    case "richText":
      InputComponent = RichTextInput;
      break;
  }

  const handleChange = useCallback(
    (value: string | number) => {
      onChange({
        target: {
          id,
          name,
          locale: type !== "money" ? localeOrCurrency : undefined,
          currency: type === "money" ? localeOrCurrency : undefined,
          value,
        },
      });
    },
    [id, name, localeOrCurrency, onChange]
  );

  return (
    <LocalizedFieldLocaleFieldRootSlot asChild>
      <FormField.Root
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        isInvalid={isInvalid || !!error}
        direction="row"
        size={size}
        id={id}
      >
        <LocalizedFieldLocaleFieldLabelSlot asChild>
          <FormField.Label>
            {localeOrCurrency.toLocaleUpperCase()}
          </FormField.Label>
        </LocalizedFieldLocaleFieldLabelSlot>
        <FormField.Input>
          <LocalizedFieldLocaleFieldInputSlot asChild>
            <InputComponent
              {...otherProps}
              size={size}
              locale={localeOrCurrency}
              currency={localeOrCurrency}
              // @ts-expect-error: the 'value' should be a string for everything but the number/money input, which must be a number
              // in its' infinite wisdom, ts interprets the union type as 'undefined' because of course it does
              value={inputValue}
              onChange={handleChange}
              onBlur={(e: React.FocusEvent) => onBlur?.(e, localeOrCurrency)}
              onFocus={(e: React.FocusEvent) => onFocus?.(e, localeOrCurrency)}
              isDisabled={isDisabled}
              isReadOnly={isReadOnly}
              isInvalid={isInvalid || !!error}
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
