import { type KeyboardEvent, useContext, useCallback } from "react";
import {
  Input as RaInput,
  ComboBoxStateContext,
  InputContext,
  useContextProps,
} from "react-aria-components";
import type { SingleSelectInputProps } from "../combobox.types";
import { ComboBoxValueSlot } from "../combobox.slots";

export const SingleSelectInput = (props: SingleSelectInputProps) => {
  const {
    placeholder,
    inputValue,
    allowsCustomValue,
    onSubmitCustomValue,
    onInputChange,
    ref,
  } = props;

  // Get input props from ComboBox InputContext and merge with local props
  const [inputProps, inputRef] = useContextProps({}, ref || null, InputContext);
  // This component exists because it has to be a child of the root to get the combobox state
  const state = useContext(ComboBoxStateContext);

  const handleInputKeyDown = useCallback(
    // This method clears the input if the user has focused on a pre-populated combobox and starts typing
    (e: KeyboardEvent) => {
      if (
        state?.selectedKey &&
        inputRef.current &&
        // cursor is at the beginning of input...
        inputRef.current.selectionStart === 0 &&
        inputRef.current.selectionEnd === 0 &&
        // ...and it has a value, which can only happen on focus
        inputRef.current.value.length > 0 &&
        e.key.length === 1 && // Single character key
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        e.preventDefault();
        e.stopPropagation();
        // Set the input value to the typed key (which clears the previous value)
        state.setInputValue(e.key);
        return;
      }
      // This method checks the inputValue against the textValue of every item in the collection, and if it doesnt match any items, sets a custom value
      if (
        e.key === "Enter" &&
        inputValue &&
        inputValue?.trim() !== "" &&
        onInputChange &&
        allowsCustomValue &&
        onSubmitCustomValue &&
        state
      ) {
        // Check if the inputValue matches any textValue in the collection
        if (state.collection) {
          const collectionItems = Array.from(state.collection);
          const matchingItem = collectionItems.find((item) => {
            return item.textValue.toLowerCase() === inputValue.toLowerCase();
          });

          if (matchingItem) {
            // If input value matches an existing item, select that item
            state.setSelectedKey(matchingItem.key);
          } else {
            // Only submit custom value if it doesn't already exist
            onSubmitCustomValue(inputValue);
          }
        } else {
          // Fallback: if no collection available, submit the custom value
          onSubmitCustomValue(inputValue);
        }
      }
    },
    [inputValue, onInputChange, allowsCustomValue, onSubmitCustomValue, state]
  );

  return (
    <ComboBoxValueSlot asChild>
      <RaInput
        ref={inputRef}
        {...inputProps}
        onKeyDown={handleInputKeyDown}
        placeholder={placeholder}
      />
    </ComboBoxValueSlot>
  );
};
