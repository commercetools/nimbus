import { forwardRef, useRef, useState } from "react";
import { useSlotRecipe, chakra } from "@chakra-ui/react";
import {
  KeyboardArrowDown as DropdownIndicatorIcon,
  Loop as SpinnerIcon,
} from "@commercetools/nimbus-icons";
import { Flex, Box, Stack } from "@/components";
import {
  Button as RaButton,
  Popover as RaPopover,
  ComboBox as RaComboBox,
  Group as RaGroup,
  Button,
  ListBoxContext,
  type Key as RaKey,
  type Selection as RaSelection,
} from "react-aria-components";

import {
  ComboBoxRootSlot,
  ComboBoxTriggerSlot,
  ComboBoxTagGroupSlot,
} from "../combobox.slots";
import type { ComboBoxRootProps } from "../combobox.types";
import { comboBoxSlotRecipe } from "../combobox.recipe";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { ComboBoxTrigger } from "./combobox.trigger";
import { ComboBoxInput } from "./combobox.input";

export const ComboBoxRoot = forwardRef<HTMLDivElement, ComboBoxRootProps>(
  (
    {
      children,
      isLoading,
      isDisabled,
      selectedKeys: selectedKeysFromProps,
      defaultSelectedKeys,
      allowsEmptyCollection = true,
      onSelectionChange,
      ...props
    },
    ref
  ) => {
    const recipe = useSlotRecipe({ recipe: comboBoxSlotRecipe });
    const [recipeProps, restRecipeProps] = recipe.splitVariantProps(props);
    const [styleProps, restProps] = extractStyleProps(restRecipeProps);

    // Track the open state of the dropdown
    const [isOpen, setIsOpen] = useState(false);
    // Local selection state if not controlled externally
    const [localSelectedKeys, setLocalSelectedKeys] = useState<RaSelection>(
      defaultSelectedKeys || new Set([])
    );
    // For input value in ComboBox
    const [inputValue, setInputValue] = useState("");
    const multiSelectTriggerRef = useRef(null);
    // Reference to the input wrapper for positioning the popover
    const inputWrapperRef = useRef<HTMLDivElement>(null);
    // Reference to the input element for focus management
    const inputRef = useRef<HTMLInputElement>(null);

    // Use controlled or uncontrolled selection
    const selectedKeys =
      selectedKeysFromProps !== undefined
        ? selectedKeysFromProps
        : localSelectedKeys;

    // Handle selection change
    const handleSelectionChange = (key: RaKey | null) => {
      console.log(key);
      if (key && typeof selectedKeys !== "string") {
        // Create a new set with the existing keys
        const newKeys = new Set(selectedKeys);
        console.log(newKeys);
        // Add the key if it doesn't exist, otherwise remove it
        if (newKeys.has(key)) {
          newKeys.delete(key);
        } else {
          newKeys.add(key);
        }

        // Update selection
        if (onSelectionChange) {
          onSelectionChange(newKeys);
        } else {
          setLocalSelectedKeys(newKeys);
        }

        // Clear input value after selection
        setInputValue("");
      }
    };

    // Convert selection to array for easier handling
    const selectedKeysArray =
      typeof selectedKeys !== "string" ? Array.from(selectedKeys || []) : [];

    // Remove a selected item
    const removeItem = (key: RaKey) => {
      if (typeof selectedKeys !== "string") {
        const newKeys = new Set(selectedKeys);
        newKeys.delete(key);

        if (onSelectionChange) {
          onSelectionChange(newKeys);
        } else {
          setLocalSelectedKeys(newKeys);
        }
      }
    };

    // Handle keyboard events
    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // If Backspace is pressed while input is empty, remove the last selected item
      if (
        e.key === "Backspace" &&
        inputValue === "" &&
        typeof selectedKeys !== "string"
      ) {
        const keysArray = Array.from(selectedKeys);
        if (keysArray.length > 0) {
          const lastKey = keysArray[keysArray.length - 1];
          removeItem(lastKey);
          // Prevent default behavior
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    const raComboBoxProps = {
      ...restProps,
      allowsEmptyCollection,
      isDisabled: isLoading || isDisabled,
      ...(Boolean(props.selectionMode === "multiple") && { selectedKey: null }),
    };

    return (
      <ComboBoxRootSlot asChild ref={ref} {...recipeProps} {...styleProps}>
        <RaComboBox
          {...raComboBoxProps}
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSelectionChange={handleSelectionChange}
          onOpenChange={setIsOpen}
        >
          {props.selectionMode === "multiple" ? (
            <ComboBoxTagGroupSlot
              tabIndex={0}
              ref={multiSelectTriggerRef}
              asChild
            >
              <ComboBoxInput ref={inputRef} onKeyDown={handleInputKeyDown} />
            </ComboBoxTagGroupSlot>
          ) : (
            <ComboBoxInput />
          )}
          <RaGroup>
            <Flex position="absolute" top="0" bottom="0" zIndex={1} right="200">
              <Flex width="600">
                <ComboBoxTrigger />
              </Flex>
              <ComboBoxTriggerSlot asChild>
                <RaButton>
                  {isLoading ? (
                    <Box asChild animation="spin" animationDuration="slowest">
                      <SpinnerIcon />
                    </Box>
                  ) : (
                    <DropdownIndicatorIcon />
                  )}
                </RaButton>
              </ComboBoxTriggerSlot>
            </Flex>
          </RaGroup>
          <div>{JSON.stringify(selectedKeysArray)}</div>
          <RaPopover triggerRef={multiSelectTriggerRef}>
            <Stack
              direction="column"
              gap="400"
              alignItems="flex-start"
              background="white"
            >
              <ListBoxContext.Provider
                value={{
                  selectionMode: "multiple",
                  style: { background: "red" },
                  selectedKeys: selectedKeys,
                  disallowEmptySelection: false,
                  disabledKeys: selectedKeysArray,
                  onSelectionChange: () => {},
                }}
              >
                {children}
              </ListBoxContext.Provider>
            </Stack>
          </RaPopover>
        </RaComboBox>
      </ComboBoxRootSlot>
    );
  }
);

ComboBoxRoot.displayName = "ComboBox.Root";
