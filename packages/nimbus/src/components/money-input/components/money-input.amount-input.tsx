import { useRef } from "react";
import { mergeRefs } from "@chakra-ui/react";
import { useObjectRef, useTextField } from "react-aria";
import { Input } from "react-aria-components";
import { MoneyInputAmountInputSlot } from "../money-input.slots";
import { useMoneyInputContext } from "../money-input-context";
import type { MoneyInputAmountInputProps } from "../money-input.types";

export const MoneyInputAmountInput = ({
  autoComplete,
  placeholder,
  isAutofocussed,
  ...restProps
}: MoneyInputAmountInputProps) => {
  const context = useMoneyInputContext();
  const localRef = useRef<HTMLInputElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, null));

  const {
    value,
    handleAmountChange,
    handleAmountFocus,
    handleAmountBlur,
    getAmountInputId,
    getAmountInputName,
    isDisabled,
    isReadOnly,
    hasFocus,
    hasHighPrecisionBadge,
    isHighPrecision,
  } = context;

  // Create adapter for React Aria's onChange signature (value: string) => void
  const handleTextFieldChange = (newValue: string) => {
    // React Aria passes value directly, but our handler expects an event
    const fakeEvent = {
      persist: () => {},
      target: {
        id: getAmountInputId(),
        name: getAmountInputName(),
        value: newValue,
      },
    };
    handleAmountChange(fakeEvent as React.ChangeEvent<HTMLInputElement>);
  };

  // Create adapter for React Aria's onBlur signature
  const handleTextFieldBlur = () => {
    // Call the original blur handler
    handleAmountBlur();
  };

  // Use React Aria's useTextField hook to get proper input props
  const { inputProps } = useTextField(
    {
      id: getAmountInputId(),
      name: getAmountInputName(),
      type: "text",
      value: value.amount,
      autoComplete,
      placeholder,
      isDisabled,
      isReadOnly,
      autoFocus: isAutofocussed,
      onFocus: handleAmountFocus,
      onChange: handleTextFieldChange,
      onBlur: handleTextFieldBlur,
      "aria-label": "Amount input",
      ...restProps,
    },
    ref
  );

  return (
    <MoneyInputAmountInputSlot asChild>
      <Input
        ref={ref}
        data-has-focus={hasFocus}
        data-has-high-precision={hasHighPrecisionBadge && isHighPrecision}
        {...inputProps}
      />
    </MoneyInputAmountInputSlot>
  );
};
