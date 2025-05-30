import { useState, useRef, type KeyboardEvent } from "react";
import { useSlotRecipe } from "@chakra-ui/react";
import {
  Popover as RaPopover,
  Group as RaGroup,
  Input as RaInput,
  Autocomplete as RaAutocomplete,
  DialogTrigger as RaDialogTrigger,
  type Selection,
  type Key,
  TextField,
  useFilter,
} from "react-aria-components";

import { MultiSelectValue } from "./combobox.multi-select-tag-group";
import { ComboBoxOptions } from "./combobox.options";
import { ComboBoxButtonGroup } from "./combobox.button-group";
import { comboBoxSlotRecipe } from "../combobox.recipe";
import { ComboBoxRootSlot } from "../combobox.slots";
import type { ComboBoxMultiSelectRootProps } from "../combobox.types";

import { extractStyleProps } from "@/utils/extractStyleProps";

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
  ref,
  ...props
}: ComboBoxMultiSelectRootProps<T>) => {
  const recipe = useSlotRecipe({ recipe: comboBoxSlotRecipe });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(props);
  const [styleProps] = extractStyleProps(restRecipeProps);

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

  const handleInputKeyDown = (e: KeyboardEvent) => {
    console.log(e.key, inputValue);
    if (e.key === "Backspace" && inputValue === "") {
      deleteLastSelectedItem();
    }
  };

  const filterUtils = useFilter({ sensitivity: "base" });
  const contains = (...args: Parameters<typeof filterUtils.contains>) =>
    filterUtils.contains.apply(undefined, args);

  const triggerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  //TODO:
  // - mechanism to know which item key to use in the tag to display the selected item
  // - better control of opening/closing the popover - up/down keys trigger open, open on focus of down arrow button, etc
  // - types in general, esp around items, etc
  // - sections: will they even work here?
  // - styling: input in popover, better focus styling on options, etc
  // - props for empty states for the tag group and listbox
  // - resize the popover body to match the input width
  // - disabled, read only, etc states
  return (
    <ComboBoxRootSlot
      selectionMode="multiple"
      asChild
      ref={ref}
      {...recipeProps}
      {...styleProps}
    >
      <RaGroup ref={triggerRef}>
        <RaDialogTrigger>
          <MultiSelectValue
            items={items}
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            itemID={itemID}
            itemValue={itemValue}
          />
          <ComboBoxButtonGroup
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            onInputChange={setInputValue}
          />
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
              {...props}
            >
              <TextField aria-label="combobox input">
                <RaInput
                  autoFocus
                  onKeyDownCapture={handleInputKeyDown}
                  placeholder="search..."
                />
              </TextField>
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
        </RaDialogTrigger>
      </RaGroup>
    </ComboBoxRootSlot>
  );
};
