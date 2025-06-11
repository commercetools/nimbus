import { type KeyboardEvent } from "react";
import {
  ComboBox as RaComboBox,
  Popover as RaPopover,
  Input,
} from "react-aria-components";
import { ComboBoxOptions } from "./combobox.options";
import { ComboBoxSingleSelectButtonGroup } from "./combobox.single-select-button-group";

import type { ComboBoxSingleSelectRootProps } from "../combobox.types";
import { ComboBoxValueSlot } from "../combobox.slots";

export const SingleSelectRoot = <T extends object>({
  children,
  inputValue,
  onInputChange,
  placeholder,
  allowsCustomValue,
  onSubmitCustomValue,
  renderEmptyState,
  isLoading,
  ref,
  ...rest
}: ComboBoxSingleSelectRootProps<T>) => {
  if (onSubmitCustomValue && (!inputValue || !onInputChange)) {
    // ComboBox has to be controlled to be able to get the input value when user presses enter
    throw new Error(
      'ComboBox: When "onSubmitCustomValue" is provided, "inputValue" must be controlled with "onInputChange"'
    );
  }

  const handleInputKeyDown = (e: KeyboardEvent) => {
    if (
      e.key === "Enter" &&
      inputValue &&
      inputValue?.trim() !== "" &&
      onInputChange &&
      allowsCustomValue &&
      onSubmitCustomValue
    ) {
      // don't create a custom value if there are results in the listbox
      const target = e.target as Element | null;
      if (target && target.getAttribute("aria-activedescendant")) {
        return;
      }
      onSubmitCustomValue(inputValue);
      onInputChange("");
    }
  };

  return (
    <RaComboBox
      inputValue={inputValue}
      onInputChange={onInputChange}
      {...rest}
      ref={ref}
      allowsEmptyCollection={true}
    >
      <ComboBoxValueSlot asChild>
        <Input onKeyDown={handleInputKeyDown} placeholder={placeholder} />
      </ComboBoxValueSlot>
      <ComboBoxSingleSelectButtonGroup
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
