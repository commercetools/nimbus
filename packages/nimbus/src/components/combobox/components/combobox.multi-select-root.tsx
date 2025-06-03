import { useState, useRef, type KeyboardEvent } from "react";
import { mergeRefs } from "@chakra-ui/react";
import {
  Popover as RaPopover,
  Input as RaInput,
  Autocomplete as RaAutocomplete,
  DialogTrigger as RaDialogTrigger,
  type Selection,
  type Key,
  TextField,
  useFilter,
  Pressable,
} from "react-aria-components";

import { MultiSelectTagGroup } from "./combobox.multi-select-tag-group";
import { ComboBoxOptions } from "./combobox.options";
import { ComboBoxButtonGroup } from "./combobox.button-group";
import {
  ComboBoxPopoverSlot,
  ComboBoxMultiSelectInputSlot,
} from "../combobox.slots";
import type { ComboBoxMultiSelect } from "../combobox.types";

function getLastValueInSet(set: Set<Key>) {
  let value;
  for (value of set);
  return value;
}

export const MultiSelectRoot = <T extends object>({
  children,
  defaultFilter,
  inputValue: inputValueProp,
  defaultInputValue,
  onInputChange: onInputChangeProp,
  defaultSelectedKeys = new Set(),
  selectedKeys: selectedKeysProp,
  onSelectionChange: onSelectionChangeProp,
  disabledKeys,
  items: itemsProp,
  defaultItems,
  itemID = "id",
  itemValue = "name",
  isLoading,
  isDisabled,
  isReadOnly,
  isRequired,
  isInvalid,
  className,
  placeholder,
  size = "md",
  allowsCustomValue,
  onSubmitCustomValue,
  renderEmptyState,
  ref,
  ...props
}: ComboBoxMultiSelect<T>) => {
  const [isOpen, setOpen] = useState(false);

  const [_selectedKeys, _setSelectedKeys] = useState<Selection>();
  const selectedKeys = selectedKeysProp ?? _selectedKeys ?? defaultSelectedKeys;
  const setSelectedKeys = onSelectionChangeProp ?? _setSelectedKeys;

  const [_inputValue, _setInputValue] = useState<string>("");
  const inputValue = inputValueProp ?? _inputValue ?? defaultInputValue;
  const setInputValue = onInputChangeProp ?? _setInputValue;

  const items = itemsProp ?? defaultItems;

  const deleteLastSelectedItem = () => {
    // Only handle if selectedKeys is a Set (not "all")
    if (selectedKeys !== "all" && selectedKeys instanceof Set) {
      const lastKey = getLastValueInSet(selectedKeys as Set<Key>);
      if (lastKey !== null && lastKey !== undefined) {
        const newSelection = new Set(selectedKeys);
        newSelection.delete(lastKey);
        setSelectedKeys(newSelection);
      }
    }
  };

  // Enhanced keyboard navigation
  const handleTriggerKeyDown = (e: KeyboardEvent) => {
    if (
      (e.key === "ArrowDown" || e.key === "ArrowUp") &&
      e.target === triggerRef.current
    ) {
      e.preventDefault();
      setOpen(true);
    }
  };

  const handleInputKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Backspace" && inputValue === "") {
      deleteLastSelectedItem();
    }
    // Handle Escape key to close popover and return focus
    if (e.key === "Escape") {
      setOpen(false);
      // Focus management - return to trigger
      setTimeout(() => triggerRef.current?.focus(), 0);
    }

    if (
      e.key === "Enter" &&
      inputValue.trim() !== "" &&
      allowsCustomValue &&
      onSubmitCustomValue
    ) {
      // Find matching item from the collection
      const matchingItem =
        items &&
        Array.from(items).find((item) => {
          const itemText = String(item[itemValue as keyof T]).toLowerCase();
          return itemText === inputValue.toLowerCase().trim();
        });

      if (matchingItem) {
        // Select the matching item
        const itemKey = matchingItem[itemID as keyof T] as Key;
        if (selectedKeys instanceof Set) {
          const newSelection = new Set(selectedKeys);
          newSelection.add(itemKey);
          setSelectedKeys(newSelection);
        }
        setInputValue("");
      } else {
        // Only submit custom value if it doesn't match any existing items
        // TODO: show how you can use this value to pop it onto the items array
        onSubmitCustomValue(inputValue);
        setInputValue("");
      }
    }
  };

  const filterUtils = useFilter({ sensitivity: "base" });
  const contains = (...args: Parameters<typeof filterUtils.contains>) =>
    filterUtils.contains.apply(undefined, args);

  const triggerRef = useRef<HTMLDivElement>(null);

  const mergedRef = mergeRefs(ref, triggerRef);

  //TODO:
  // - resize the popover body to match the input width
  // - styles for disabled, readonly, required, invalid, etc
  // - like, yknow, tests or whatever
  return (
    <RaDialogTrigger isOpen={isOpen} onOpenChange={setOpen}>
      <Pressable>
        <div
          className={className as string}
          tabIndex={0}
          ref={mergedRef}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-disabled={isDisabled}
          aria-readonly={isReadOnly}
          aria-required={isRequired}
          aria-invalid={isInvalid}
          data-disabled={isDisabled}
          data-invalid={isInvalid}
          data-required={isRequired}
          data-open={isOpen}
          role="combobox"
          onKeyDown={handleTriggerKeyDown}
          {...props}
        >
          <MultiSelectTagGroup
            items={items}
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            itemID={itemID}
            itemValue={itemValue}
            placeholder={placeholder}
            size={size}
            isDisabled={isDisabled}
            isReadOnly={isReadOnly}
          />

          <ComboBoxButtonGroup
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            onInputChange={setInputValue}
            isDisabled={isDisabled}
            isReadOnly={isReadOnly}
            isLoading={isLoading}
          />
        </div>
      </Pressable>

      <ComboBoxPopoverSlot asChild>
        <RaPopover
          triggerRef={triggerRef}
          trigger="ComboBox"
          placement="bottom start"
        >
          <RaAutocomplete
            filter={defaultFilter ?? contains}
            inputValue={inputValue}
            onInputChange={setInputValue}
          >
            <ComboBoxMultiSelectInputSlot asChild>
              <TextField
                isDisabled={isDisabled}
                isReadOnly={isReadOnly}
                isRequired={isRequired}
              >
                <RaInput
                  autoFocus
                  onKeyDown={handleInputKeyDown}
                  placeholder={placeholder}
                  aria-label="filter combobox options"
                />
              </TextField>
            </ComboBoxMultiSelectInputSlot>
            <ComboBoxOptions
              items={items}
              selectionMode="multiple"
              onSelectionChange={setSelectedKeys}
              selectedKeys={selectedKeys}
              shouldFocusWrap={true}
              disabledKeys={isDisabled ? "all" : disabledKeys}
              escapeKeyBehavior="none"
              aria-label="combobox options"
              renderEmptyState={renderEmptyState}
            >
              {children}
            </ComboBoxOptions>
          </RaAutocomplete>
        </RaPopover>
      </ComboBoxPopoverSlot>
    </RaDialogTrigger>
  );
};
