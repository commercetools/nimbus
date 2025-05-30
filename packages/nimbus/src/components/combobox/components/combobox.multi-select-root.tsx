import { useState, useRef, type ForwardedRef } from "react";
import { useSlotRecipe } from "@chakra-ui/react";
// import { Flex } from "@/components";
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
import { TagGroup } from "@/components";
import { ComboBoxOptions } from "./combobox.options";
import { ComboBoxButtonGroup } from "./combobox.button-group";
import { comboBoxSlotRecipe } from "../combobox.recipe";
import { ComboBoxRootSlot } from "../combobox.slots";
import type { ComboBoxMultiSelectRootProps } from "../combobox.types";
import { ComboBoxValueSlot } from "../combobox.slots";
import { fixedForwardRef } from "@/utils/fixedForwardRef";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { useListData } from "react-stately";
function getLastValueInSet(set: Set<Key>) {
  let value;
  for (value of set);
  return value;
}

export const MultiSelectRoot = fixedForwardRef(
  <T extends object>(
    {
      children,
      defaultFilter,
      inputValue,
      onInputChange,
      selectedKeys,
      onSelectionChange,
      disabledKeys,
      items,
      ...props
    }: ComboBoxMultiSelectRootProps<T>,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const recipe = useSlotRecipe({ recipe: comboBoxSlotRecipe });
    const [recipeProps, restRecipeProps] = recipe.splitVariantProps(props);
    const [styleProps] = extractStyleProps(restRecipeProps);
    const selectedList = useListData<T>({
      initialItems: [],
    });

    const itemsList = useListData<T>({
      initialItems: items,
      initialSelectedKeys: selectedKeys,
    });

    const [inputState, setInputState] = useState<string>(inputValue ?? "");

    const handleRemove = (keys: Set<Key>) => {
      console.log(keys);

      const key = keys.values().next().value;
      if (key !== undefined) {
        const item = selectedList.getItem(key);
        console.log(item);
        if (item !== undefined) {
          selectedList.remove(key);
          let nextSelected = new Set(itemsList.selectedKeys);
          if (itemsList.selectedKeys === "all") {
            nextSelected = new Set(items && items.map((item) => item.id));
          }
          nextSelected.delete(key);
          itemsList.setSelectedKeys(nextSelected);
        }
      }
    };
    const handleSelectionChange = (keys: Selection) => {
      setInputState("");

      if (onSelectionChange) {
        onSelectionChange(keys);
      }
      // get keys for currently selected items
      const selectedListKeys = selectedList.items
        .slice()
        .map((item) => item.id);
      if (keys === "all") {
        // there is no good way to clear the useListData set, so remove all current keys, then add all items from the list
        selectedListKeys.map((key) => selectedList.remove(key));
        selectedList.append(itemsList.items);
      } else if (keys.size === 0) {
        // if there are no selected keys, remove all keys from the selectedList
        selectedListKeys.map((key) => selectedList.remove(key));
      } else {
        selectedListKeys.forEach((id) => {
          // if an existing selected item is not in the selected keys array, remove it
          if (!keys.has(id)) {
            console.log("remove existing selected item", id);
            selectedList.remove(id);
          }
        });
        keys.forEach((key) => {
          // if a selected key is not in the selectedList, add the item from the itemsList to the selected list
          if (!selectedList.getItem(key)) {
            console.log("adding selected item");
            const item = itemsList.getItem(key);
            if (item !== undefined) {
              selectedList.append(item);
            }
          }
        });
      }

      itemsList.setSelectedKeys(keys);
    };
    const handleInputChange = (value: string) => {
      if (onInputChange) onInputChange(value);
      setInputState(value);
    };

    const deleteLastSelectedItem = () => {
      // eslint-ignore
      const lastKey = getLastValueInSet(itemsList.selectedKeys);
      if (lastKey !== null) {
        console.log(lastKey, selectedList.getItem(lastKey));
        handleRemove(new Set([lastKey]));
      }
    };

    const handleInputKeyDown = (e) => {
      console.log(e.key, inputState);
      if (e.key === "Backspace" && inputState === "") {
        deleteLastSelectedItem();
      }
    };

    const { contains } = useFilter({ sensitivity: "base" });

    const triggerRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    //TODO:
    // - mechanism to know which item key to use in the tag to display the selected item
    // - better control of opening/closing the popover
    // - types in general, esp around items, etc
    // - sections: will they even work here?
    // - styling: input in popover, better focus styling on options, etc
    // - props for empty states for the tag group and listbox
    // - resize the popover body to match the input width

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
            <ComboBoxValueSlot
              asChild
              alignItems="space-between"
              justifyContent="center"
            >
              <TagGroup.Root
                size="md"
                onRemove={handleRemove}
                aria-label="nimbus-combobox"
              >
                <TagGroup.TagList
                  items={selectedList.items}
                  renderEmptyState={() => "select an animal "}
                >
                  {(item) => <TagGroup.Tag>{item.name}</TagGroup.Tag>}
                </TagGroup.TagList>
              </TagGroup.Root>
            </ComboBoxValueSlot>
            <ComboBoxButtonGroup />

            <RaPopover
              triggerRef={triggerRef}
              scrollRef={scrollRef}
              shouldCloseOnInteractOutside={(element) => {
                console.log(element);
                return true;
              }}
              placement="bottom start"
            >
              <RaAutocomplete
                aria-label="nimbus-combobox-autocomplete"
                filter={defaultFilter ?? contains}
                inputValue={inputState}
                onInputChange={handleInputChange}
                {...props}
              >
                <TextField>
                  <RaInput
                    autoFocus
                    onKeyDownCapture={handleInputKeyDown}
                    aria-label="nimbus-combobox-input"
                  />
                </TextField>
                <ComboBoxOptions
                  ref={scrollRef}
                  items={itemsList.items}
                  selectionMode={"multiple"}
                  onSelectionChange={handleSelectionChange}
                  selectedKeys={itemsList.selectedKeys}
                  shouldFocusWrap={true}
                  disabledKeys={disabledKeys}
                >
                  {children}
                </ComboBoxOptions>
              </RaAutocomplete>
            </RaPopover>
          </RaDialogTrigger>
        </RaGroup>
      </ComboBoxRootSlot>
    );
  }
);
