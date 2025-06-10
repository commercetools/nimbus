import { useState, useRef, useCallback, type KeyboardEvent } from "react";
import { mergeRefs } from "@chakra-ui/react";
import {
  Popover as RaPopover,
  Input as RaInput,
  Autocomplete as RaAutocomplete,
  DialogTrigger as RaDialogTrigger,
  Dialog,
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
  const [isTouched, setIsTouched] = useState(false);

  const [_selectedKeys, _setSelectedKeys] = useState<Selection>();
  const selectedKeys = selectedKeysProp ?? _selectedKeys ?? defaultSelectedKeys;
  const setSelectedKeys = onSelectionChangeProp ?? _setSelectedKeys;

  const [_inputValue, _setInputValue] = useState<string>("");
  const inputValue = inputValueProp ?? _inputValue ?? defaultInputValue;
  const setInputValue = onInputChangeProp ?? _setInputValue;

  const items = itemsProp ?? defaultItems;

  // Handle popover open/close changes
  const handleOpenChange = useCallback(
    (open: boolean) => {
      setOpen(open);
      // Mark as touched when user interacts with the popover
      if (!isTouched) {
        setIsTouched(true);
      }
    },
    [isTouched]
  );

  const handleOpenPopoverWhenEmpty = useCallback(() => {
    // Only open on focus if there are no selected items, popover is currently closed,
    // and the user hasn't interacted with the component yet
    const hasNoSelection =
      !selectedKeys || (selectedKeys instanceof Set && selectedKeys.size === 0);

    if (hasNoSelection && !isOpen && !isTouched) {
      setOpen(true);
    }
  }, [selectedKeys, isOpen, isTouched]);

  const deleteLastSelectedItem = useCallback(() => {
    // Only handle if selectedKeys is a Set (not "all")
    if (selectedKeys !== "all" && selectedKeys instanceof Set) {
      const lastKey = getLastValueInSet(selectedKeys as Set<Key>);
      if (lastKey !== null && lastKey !== undefined) {
        const newSelection = new Set(selectedKeys);
        newSelection.delete(lastKey);
        setSelectedKeys(newSelection);
      }
    }
  }, [selectedKeys, setSelectedKeys]);

  // Enhanced keyboard navigation
  const handleTriggerKeyDown = useCallback((e: KeyboardEvent) => {
    if (
      (e.key === "ArrowDown" || e.key === "ArrowUp") &&
      e.target === triggerRef.current
    ) {
      e.preventDefault();
      setOpen(true);
    }
  }, []);

  const handleInputKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Backspace" && inputValue === "") {
        deleteLastSelectedItem();
        return;
      }

      // Handle Escape key to close popover and return focus
      if (e.key === "Escape") {
        handleOpenChange(false);
        // Focus management - return to trigger after popover closes
        // Use setTimeout to ensure the popover closes before focusing
        setTimeout(() => {
          if (triggerRef.current) {
            triggerRef.current.focus();
          }
        }, 0);
        return; // Prevent any other key handling
      }

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
        // Only submit custom value if the listbox contains no matching results
        onSubmitCustomValue(inputValue);
        setInputValue("");
      }
    },
    [
      inputValue,
      deleteLastSelectedItem,
      handleOpenChange,
      allowsCustomValue,
      onSubmitCustomValue,
      items,
      itemValue,
      itemID,
      selectedKeys,
      setSelectedKeys,
      setInputValue,
    ]
  );

  const filterUtils = useFilter({ sensitivity: "base" });
  const contains = (...args: Parameters<typeof filterUtils.contains>) =>
    filterUtils.contains.apply(undefined, args);

  const triggerRef = useRef<HTMLDivElement>(null);
  const rootRef = mergeRefs(ref, triggerRef);

  //TODO:
  // - resize the popover body to match the input width
  // - styles for disabled, readonly, required, invalid, etc
  // - like, yknow, tests or whatever
  return (
    <RaDialogTrigger isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Pressable>
        <div
          className={className as string}
          tabIndex={0}
          ref={rootRef}
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
          onFocus={handleOpenPopoverWhenEmpty}
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
          placement="bottom start"
          isOpen={isOpen}
          onOpenChange={handleOpenChange}
        >
          <Dialog>
            <RaAutocomplete
              filter={defaultFilter ?? contains}
              inputValue={inputValue}
              onInputChange={setInputValue}
            >
              <ComboBoxMultiSelectInputSlot asChild>
                <TextField
                  autoFocus
                  isDisabled={isDisabled}
                  isReadOnly={isReadOnly}
                  isRequired={isRequired}
                  aria-label="filter combobox options"
                >
                  <RaInput
                    onKeyDown={handleInputKeyDown}
                    placeholder={placeholder}
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
          </Dialog>
        </RaPopover>
      </ComboBoxPopoverSlot>
    </RaDialogTrigger>
  );
};
