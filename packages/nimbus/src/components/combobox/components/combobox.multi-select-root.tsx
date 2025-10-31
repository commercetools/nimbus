import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type KeyboardEvent,
} from "react";
import React from "react";
import { useIntl } from "react-intl";
import { mergeRefs } from "@chakra-ui/react";
import {
  Popover as RaPopover,
  Input as RaInput,
  Autocomplete as RaAutocomplete,
  DialogTrigger as RaDialogTrigger,
  Dialog as RaDialog,
  TextField as RaTextField,
  Pressable as RaPressable,
  type Selection,
  type Key,
  useFilter,
} from "react-aria-components";
import { MultiSelectTagGroup } from "./combobox.multi-select-tag-group";
import { ComboBoxOptions } from "./combobox.options";
import { ComboBoxButtonGroup } from "./combobox.multi-select-button-group";
import {
  ComboBoxPopoverSlot,
  ComboBoxMultiSelectInputSlot,
} from "../combobox.slots";
import type { ComboBoxMultiSelect } from "../combobox.types";
import { ComboBoxLeadingElement } from "./combobox.leading-element";
import { messages } from "../combobox.i18n";

function getLastValueInSet(set: Set<Key>) {
  let value;
  for (value of set);
  return value;
}

/**
 * Internal multi-select root implementation for ComboBox
 *
 * @supportsStyleProps
 */
export const MultiSelectRoot = <T extends object>({
  children,
  defaultFilter,
  inputValue: inputValueProp,
  defaultInputValue,
  onInputChange: onInputChangeProp,
  defaultSelectedKeys = new Set(),
  selectedKeys: selectedKeysProp,
  onSelectionChange: onSelectionChangeProp,
  onOpenChange: onOpenChangeProp,
  disabledKeys,
  items: itemsProp,
  defaultItems,
  itemId = "id",
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
  leadingElement,
  ...props
}: ComboBoxMultiSelect<T>) => {
  const intl = useIntl();
  // Internal state for popover, enables opening on first focus
  const [isOpen, setOpen] = useState(false);
  const preventNextFocusOpen = useRef(false);

  // Internal state for selected keys
  const [_selectedKeys, _setSelectedKeys] = useState<Selection>();
  // Prefer selected keys from props (controlled), otherwise from internal state and falls back to default (uncontrolled)
  const selectedKeys = selectedKeysProp ?? _selectedKeys ?? defaultSelectedKeys;
  // Prefer selection handler from props (controlled), otherwise use internal state (uncontrolled)
  const setSelectedKeys = onSelectionChangeProp ?? _setSelectedKeys;

  // Internal state for input
  const [_inputValue, _setInputValue] = useState<string>("");
  // Prefer input value from props (controlled), otherwise from internal state and falls back to default (uncontrolled)
  const inputValue = inputValueProp ?? _inputValue ?? defaultInputValue;
  // Prefer input handler from props (controlled), otherwise use internal state (uncontrolled)
  const setInputValue = onInputChangeProp ?? _setInputValue;
  // Prefer items (controlled), fallback to defaultItems (uncontrolled)
  const items = itemsProp ?? defaultItems;

  const filterUtils = useFilter({ sensitivity: "base" });
  const contains = (...args: Parameters<typeof filterUtils.contains>) =>
    filterUtils.contains.apply(undefined, args);

  // Handle popover open/close changes
  const handleOpenChange = useCallback(
    (open: boolean) => {
      // The popover should not be able to open if it is disabled or readonly
      if (isDisabled || isReadOnly) {
        // Close the dialog if its open
        if (isOpen) setOpen(false);
        return;
      }
      // Call onOpenChange prop supplied from props
      if (onOpenChangeProp) {
        onOpenChangeProp?.(open);
      }
      // Set state value
      setOpen(open);
      // When popover goes from open to closed, prevent immediate focus from opening it again (eg when esc key hit, or click outside popover)
      // Use requestAnimationFrame + setTimeout to ensure focus events have completed
      if (!open) {
        preventNextFocusOpen.current = true;
        // Use RAF to wait for the current frame to complete, then add a small buffer
        requestAnimationFrame(() => {
          setTimeout(() => {
            preventNextFocusOpen.current = false;
          }, 50);
        });
      }
    },
    [isDisabled, isReadOnly, onOpenChangeProp, isOpen]
  );

  // if disabled or readonly after mount, update component
  useEffect(() => {
    if (isDisabled || isReadOnly) {
      handleOpenChange(false);
    }
  }, [isDisabled, isReadOnly]);

  // Handle focus - open popover unless recently closed by user
  const handleOpenPopoverOnFocus = useCallback(
    (e: React.FocusEvent) => {
      // Don't open if disabled or readonly
      if (isDisabled || isReadOnly) {
        return;
      }
      // Only open popover if focus is directly on the main container, not on child elements
      if (e.target !== e.currentTarget) {
        return;
      }
      if (!isOpen && !preventNextFocusOpen.current) {
        handleOpenChange(true);
      }
    },
    [isOpen]
  );

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
  const handleWrapperKeyDown = useCallback((e: KeyboardEvent) => {
    if (
      (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") &&
      e.target === triggerRef.current
    ) {
      e.preventDefault();
      handleOpenChange(true);
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
        if (triggerRef.current) {
          triggerRef.current.focus();
        }
        return; // Prevent any other key handling
      }

      if (
        e.key === "Enter" &&
        inputValue.trim() !== "" &&
        allowsCustomValue &&
        onSubmitCustomValue
      ) {
        e.stopPropagation();
        // Use items and filter function to check if input matches any existing item
        if (items) {
          const inputValueTrimmed = inputValue.trim();
          // Find the item that matches the input exactly (case insensitive)
          const matchingItem = Array.from(items).find((item) => {
            // Get the text value from the item using itemValue prop
            const itemText =
              typeof item === "object" && item !== null && itemValue in item
                ? String((item as Record<string, unknown>)[itemValue])
                : JSON.stringify(item);
            return itemText.toLowerCase() === inputValueTrimmed.toLowerCase();
          });
          if (matchingItem) {
            // get the matching item's key
            const itemKey =
              typeof matchingItem === "object" &&
              matchingItem !== null &&
              itemId in matchingItem
                ? ((matchingItem as Record<string, unknown>)[itemId] as Key)
                : (matchingItem as unknown as Key);
            // add key to previously selected items
            const nextSelection = new Set(selectedKeys);
            nextSelection.add(itemKey);
            setSelectedKeys(nextSelection);
            setInputValue("");
          } else {
            // Only create custom value if no exact match exists
            onSubmitCustomValue(inputValue);
            setInputValue("");
          }
        } else {
          // Fallback: if no items, create the custom value
          onSubmitCustomValue(inputValue);
          setInputValue("");
        }
      }
    },
    [
      inputValue,
      deleteLastSelectedItem,
      allowsCustomValue,
      onSubmitCustomValue,
      items,
      itemValue,
      itemId,
      selectedKeys,
      setSelectedKeys,
      setInputValue,
    ]
  );

  const triggerRef = useRef<HTMLDivElement>(null);
  const rootRef = mergeRefs(ref, triggerRef);

  return (
    <RaDialogTrigger isOpen={isOpen} onOpenChange={handleOpenChange}>
      <RaPressable allowTextSelectionOnPress={true}>
        <div
          className={className as string}
          tabIndex={isDisabled ? -1 : 0}
          ref={rootRef}
          role="combobox"
          onKeyDown={handleWrapperKeyDown}
          onFocus={handleOpenPopoverOnFocus}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-disabled={isDisabled}
          aria-readonly={isReadOnly}
          aria-required={isRequired}
          aria-invalid={isInvalid}
          data-disabled={isDisabled}
          data-invalid={isInvalid}
          data-required={isRequired}
          data-open={isOpen}
          {...props}
        >
          {leadingElement && (
            <ComboBoxLeadingElement>{leadingElement}</ComboBoxLeadingElement>
          )}
          <MultiSelectTagGroup
            items={items}
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            itemId={itemId}
            itemValue={itemValue}
            placeholder={placeholder}
            size={size}
            containerRef={triggerRef}
            isDisabled={isDisabled}
            isReadOnly={isReadOnly}
          />
          <ComboBoxButtonGroup
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            onInputChange={setInputValue}
            containerRef={triggerRef}
            isDisabled={isDisabled}
            isReadOnly={isReadOnly}
            isLoading={isLoading}
          />
        </div>
      </RaPressable>
      <ComboBoxPopoverSlot asChild>
        <RaPopover triggerRef={triggerRef} placement="bottom start">
          <RaDialog aria-label={intl.formatMessage(messages.comboboxDialog)}>
            <RaAutocomplete
              filter={defaultFilter ?? contains}
              inputValue={inputValue}
              onInputChange={setInputValue}
            >
              <ComboBoxMultiSelectInputSlot asChild>
                <RaTextField
                  autoFocus
                  isDisabled={isDisabled}
                  isReadOnly={isReadOnly}
                  isRequired={isRequired}
                  aria-label={intl.formatMessage(messages.filterOptions)}
                >
                  <RaInput
                    onKeyDownCapture={handleInputKeyDown}
                    placeholder={placeholder}
                  />
                </RaTextField>
              </ComboBoxMultiSelectInputSlot>
              <ComboBoxOptions
                items={items}
                selectionMode="multiple"
                onSelectionChange={setSelectedKeys}
                selectedKeys={selectedKeys}
                shouldFocusWrap={true}
                disabledKeys={isDisabled ? "all" : disabledKeys}
                escapeKeyBehavior="none"
                aria-label={intl.formatMessage(messages.options)}
                renderEmptyState={renderEmptyState}
              >
                {children}
              </ComboBoxOptions>
            </RaAutocomplete>
          </RaDialog>
        </RaPopover>
      </ComboBoxPopoverSlot>
    </RaDialogTrigger>
  );
};
