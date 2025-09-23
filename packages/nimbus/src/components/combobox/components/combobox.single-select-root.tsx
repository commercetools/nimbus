import { useCallback, useRef } from "react";
import {
  ComboBox as RaComboBox,
  Popover as RaPopover,
} from "react-aria-components";
import { SingleSelectInput } from "./combobox.single-select-input";
import { ComboBoxOptions } from "./combobox.options";
import { ComboBoxSingleSelectButtonGroup } from "./combobox.single-select-button-group";
import type { ComboBoxSingleSelectRootProps } from "../combobox.types";
import { ComboBoxLeadingElement } from "./combobox.leading-element";

export const SingleSelectRoot = <T extends object>({
  children,
  inputValue,
  onInputChange,
  placeholder,
  allowsCustomValue,
  onSubmitCustomValue,
  renderEmptyState,
  shouldFocusWrap = true,
  isLoading,
  leadingElement,
  ref,
  ...rest
}: ComboBoxSingleSelectRootProps<T>) => {
  if (onSubmitCustomValue && (inputValue === undefined || !onInputChange)) {
    // ComboBox has to be controlled to be able to get the input value when user presses enter
    throw new Error(
      'ComboBox: When "onSubmitCustomValue" is provided, "inputValue" must be controlled with "onInputChange"'
    );
  }
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFocus = useCallback(() => {
    // If the input has a value on focus, put the cursor to the beginning of the input so that it can be cleared if the user enters text
    if (inputRef.current && inputRef.current.value) {
      // Chrome will force the cursor to the end if we don't wait for the rendering frame to complete
      requestAnimationFrame(() => inputRef.current?.setSelectionRange(0, 0));
    }
  }, [inputRef]);
  return (
    <RaComboBox
      inputValue={inputValue}
      onInputChange={onInputChange}
      onFocus={handleFocus}
      allowsCustomValue={allowsCustomValue}
      menuTrigger="focus"
      shouldFocusWrap={shouldFocusWrap}
      {...rest}
      ref={ref}
    >
      {leadingElement && (
        <ComboBoxLeadingElement>{leadingElement}</ComboBoxLeadingElement>
      )}
      <SingleSelectInput
        ref={inputRef}
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
