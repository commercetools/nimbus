import { useState, useRef, type KeyboardEvent } from "react";
import { chakra, mergeRefs } from "@chakra-ui/react";

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

import { MultiSelectValue } from "./combobox.multi-select-tag-group";
import { ComboBoxOptions } from "./combobox.options";
import { ComboBoxButtonGroup } from "./combobox.button-group";
import { ComboBoxMultiSelectInputSlot } from "../combobox.slots";
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
  onInputChange: onInputChangeProp,
  defaultSelectedKeys = new Set(),
  selectedKeys: selectedKeysProp,
  onSelectionChange: onSelectionChangeProp,
  disabledKeys,
  items,
  itemID = "id",
  itemValue = "name",
  // isLoading,
  // isDisabled,
  // isReadOnly,
  // isRequired,
  // isInvalid,
  className,
  placeholder,
  ref,
  ...props
}: ComboBoxMultiSelect<T>) => {
  const [isOpen, setOpen] = useState(false);

  const [_selectedKeys, _setSelectedKeys] = useState<Selection>();
  const selectedKeys = selectedKeysProp ?? _selectedKeys ?? defaultSelectedKeys;
  const setSelectedKeys = onSelectionChangeProp ?? _setSelectedKeys;

  const [_inputValue, _setInputValue] = useState<string>("");
  const inputValue = inputValueProp ?? _inputValue;
  const setInputValue = onInputChangeProp ?? _setInputValue;

  const deleteLastSelectedItem = () => {
    // Only handle if selectedKeys is a Set (not "all")
    if (selectedKeys !== "all") {
      const lastKey = getLastValueInSet(selectedKeys as Set<Key>);
      if (lastKey !== null && lastKey !== undefined) {
        setSelectedKeys(
          (selectedKeys as Set<Key>).difference(new Set([lastKey]))
        );
      }
    }
  };

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
  };

  const filterUtils = useFilter({ sensitivity: "base" });
  const contains = (...args: Parameters<typeof filterUtils.contains>) =>
    filterUtils.contains.apply(undefined, args);

  const triggerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const mergedRef = mergeRefs(ref, triggerRef);

  //TODO:
  // - mechanism to know which item key to use in the tag to display the selected item
  // - better control of opening/closing the popover - up/down keys trigger open, open on focus of down arrow button, etc
  // - types in general, esp around items, etc
  // - sections: will they even work here?
  // - styling: input in popover, better focus styling on options, etc
  // - props for empty states for the tag group and listbox
  // - resize the popover body to match the input width
  // - disabled, read only, etc states
  // Omit autoFocus and any other props not supported by RaGroup

  return (
    <RaDialogTrigger isOpen={isOpen} onOpenChange={setOpen}>
      <Pressable>
        <div
          className={className as string}
          tabIndex={0}
          ref={mergedRef}
          aria-label={props["aria-label"]}
          role="combobox"
          onKeyDown={handleTriggerKeyDown}
        >
          <MultiSelectValue
            items={items}
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            itemID={itemID}
            itemValue={itemValue}
            placeholder={placeholder}
          />

          <ComboBoxButtonGroup
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            onInputChange={setInputValue}
          />
        </div>
      </Pressable>
      <chakra.div bg="bg" borderRadius="200" boxShadow="5" asChild>
        <RaPopover
          triggerRef={triggerRef}
          scrollRef={scrollRef}
          placement="bottom start"
        >
          <RaAutocomplete
            aria-label="nimbus-combobox-autocomplete"
            filter={defaultFilter ?? contains}
            inputValue={inputValue}
            onInputChange={setInputValue}
          >
            <ComboBoxMultiSelectInputSlot asChild>
              <TextField aria-label="combobox input">
                <RaInput
                  autoFocus
                  onKeyDownCapture={handleInputKeyDown}
                  placeholder={placeholder}
                />
              </TextField>
            </ComboBoxMultiSelectInputSlot>
            <ComboBoxOptions
              ref={scrollRef}
              items={items}
              selectionMode={"multiple"}
              onSelectionChange={setSelectedKeys}
              selectedKeys={selectedKeys}
              shouldFocusWrap={true}
              disabledKeys={disabledKeys}
              escapeKeyBehavior="none"
            >
              {children}
            </ComboBoxOptions>
          </RaAutocomplete>
        </RaPopover>
      </chakra.div>
    </RaDialogTrigger>
  );
};
