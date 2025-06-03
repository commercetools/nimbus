import { useState, type KeyboardEvent } from "react";
import {
  ComboBox as RaComboBox,
  Popover as RaPopover,
  Input,
} from "react-aria-components";
import { ComboBoxOptions } from "./combobox.options";
import { ComboBoxButtonGroup } from "./combobox.button-group";

import type { ComboBoxSingleSelectRootProps } from "../combobox.types";
import { ComboBoxValueSlot } from "../combobox.slots";

export const SingleSelectRoot = <T extends object>({
  children,
  inputValue: inputValueProp,
  defaultInputValue,
  onInputChange: onInputChangeProp,
  placeholder,
  allowsCustomValue,
  onSubmitCustomValue,
  renderEmptyState,
  ref,
  ...rest
}: ComboBoxSingleSelectRootProps<T>) => {
  const [_inputValue, _setInputValue] = useState<string>("");
  const inputValue = inputValueProp ?? _inputValue ?? defaultInputValue;
  const setInputValue = onInputChangeProp ?? _setInputValue;

  const handleInputKeyDown = (e: KeyboardEvent) => {
    if (
      e.key === "Enter" &&
      inputValue.trim() !== "" &&
      allowsCustomValue &&
      onSubmitCustomValue
    ) {
      onSubmitCustomValue(inputValue);
      setInputValue("");
    }
  };

  return (
    <RaComboBox
      inputValue={inputValue}
      onInputChange={setInputValue}
      {...rest}
      ref={ref}
    >
      <ComboBoxValueSlot asChild>
        <Input
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          disabled={rest.isDisabled}
          readOnly={rest.isReadOnly}
        />
      </ComboBoxValueSlot>
      <ComboBoxButtonGroup />
      <RaPopover>
        <ComboBoxOptions renderEmptyState={renderEmptyState}>
          {children}
        </ComboBoxOptions>
      </RaPopover>
    </RaComboBox>
  );
};
