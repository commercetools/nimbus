import { useCallback } from "react";
import {
  FormField,
  TextInput,
  MoneyInput,
  type TCustomEvent,
  MultilineTextInput,
  RichTextInput,
  type TValue,
  type TCurrencyCode,
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
  inputValue: inputValueFromProps,
  description,
  warning,
  error,
  onChange,
  onBlur,
  onFocus,
  isRequired,
  isReadOnly,
  isDisabled,
  isInvalid,
  touched,
  ...otherProps
}: LocalizedFieldLocaleFieldProps) => {
  let InputComponent:
    | typeof TextInput
    | typeof MultilineTextInput
    | typeof MoneyInput
    | typeof RichTextInput;
  switch (type) {
    case "text":
    default:
      InputComponent = TextInput;
      break;
    case "multiLine":
      InputComponent = MultilineTextInput;
      break;
    case "money":
      InputComponent = MoneyInput;
      break;
    case "richText":
      InputComponent = RichTextInput;
      break;
  }

  const getInputValue = () => {
    if (type === "money") {
      return inputValueFromProps
        ? (inputValueFromProps as TValue)
        : ({ amount: "", currencyCode: localeOrCurrency } as TValue);
    }
    return inputValueFromProps ? inputValueFromProps : "";
  };

  const inputValue = getInputValue();

  const handleChange = useCallback(
    (value: string | TCustomEvent | undefined) => {
      // The `MoneyInput` onChange event value is a custom value,
      // and the `MoneyInput` modifies the input id and name since it is in a `group`,
      // so we need to build a separate return object for the MoneInput to return
      // the expected values
      const isMoneyInputEvent = typeof value === "object";
      const changeValue = {
        target: isMoneyInputEvent
          ? {
              id: value.target.id,
              name: value.target.name,
              locale: undefined,
              currency: localeOrCurrency as TCurrencyCode,
              value: value.target.value,
            }
          : { id, name, locale: localeOrCurrency, currency: undefined, value },
      };
      onChange(changeValue);
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
        <LocalizedFieldLocaleFieldLabelSlot
          display={type === "money" ? "none" : undefined}
          {...(isDisabled && { "data-disabled": isDisabled })}
          asChild
        >
          <FormField.Label>
            {localeOrCurrency.toLocaleUpperCase()}
          </FormField.Label>
        </LocalizedFieldLocaleFieldLabelSlot>
        <FormField.Input>
          <LocalizedFieldLocaleFieldInputSlot
            aria-required={isRequired}
            asChild
          >
            <InputComponent
              {...otherProps}
              size={size}
              value={inputValue as string & TValue}
              onChange={handleChange}
              onBlur={(e: React.FocusEvent | TCustomEvent) =>
                onBlur?.(e, localeOrCurrency)
              }
              onFocus={(e: React.FocusEvent | TCustomEvent) =>
                onFocus?.(e, localeOrCurrency)
              }
              isRequired={isRequired}
              isDisabled={isDisabled}
              isReadOnly={isReadOnly}
              isInvalid={isInvalid || !!error}
            />
          </LocalizedFieldLocaleFieldInputSlot>
        </FormField.Input>
        {(description || (warning && touched)) && (
          <FormField.Description
            role={warning && touched ? "status" : undefined}
          >
            {warning && touched ? warning : description}
          </FormField.Description>
        )}
        {error && touched && <FormField.Error>{error}</FormField.Error>}
      </FormField.Root>
    </LocalizedFieldLocaleFieldRootSlot>
  );
};
