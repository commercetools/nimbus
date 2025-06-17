import {
  ComboBox as RaComboBox,
  Popover as RaPopover,
} from "react-aria-components";
import { SingleSelectInput } from "./combobox.single-select-input";
import { ComboBoxOptions } from "./combobox.options";
import { ComboBoxSingleSelectButtonGroup } from "./combobox.single-select-button-group";
import type { ComboBoxSingleSelectRootProps } from "../combobox.types";

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
  if (onSubmitCustomValue && (inputValue === undefined || !onInputChange)) {
    // ComboBox has to be controlled to be able to get the input value when user presses enter
    throw new Error(
      'ComboBox: When "onSubmitCustomValue" is provided, "inputValue" must be controlled with "onInputChange"'
    );
  }

  return (
    <RaComboBox
      inputValue={inputValue}
      onInputChange={onInputChange}
      allowsCustomValue={allowsCustomValue}
      {...rest}
      ref={ref}
    >
      <SingleSelectInput
        placeholder={placeholder}
        inputValue={inputValue}
        allowsCustomValue={allowsCustomValue}
        onSubmitCustomValue={onSubmitCustomValue}
        onInputChange={onInputChange}
      />
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
