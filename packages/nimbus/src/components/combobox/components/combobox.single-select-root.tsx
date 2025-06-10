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
  isLoading,
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
      // don't create a custom value if there are results in the listbox
      const target = e.target as Element | null;
      if (target && target.getAttribute("aria-activedescendant")) {
        return;
      }
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
        <Input onKeyDown={handleInputKeyDown} placeholder={placeholder} />
      </ComboBoxValueSlot>
      <ComboBoxButtonGroup
        isLoading={isLoading}
        isDisabled={rest.isDisabled}
        isReadOnly={rest.isReadOnly}
      />
      <RaPopover>
        <ComboBoxOptions renderEmptyState={renderEmptyState}>
          {children}
        </ComboBoxOptions>
      </RaPopover>
    </RaComboBox>
  );
};
