import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import {
  useListState,
  type Node,
  type Key,
  type Collection,
} from "react-stately";
import { useId } from "react-aria";
import {
  CollectionBuilder,
  ComboBoxContext,
  useContextProps,
  Provider,
  InputContext,
  ButtonContext,
  PopoverContext,
  ListBoxContext,
  TagGroupContext,
  ListStateContext,
  SelectableCollectionContext,
  type Selection,
} from "react-aria-components";
import { useIntl } from "react-intl";
import { extractStyleProps } from "@/utils";
import { ComboBoxRootSlot } from "../combobox.slots";
import type {
  ComboBoxRootProps,
  ComboBoxRootContextValue,
} from "../combobox.types";
import { messages } from "../combobox.i18n";
import {
  defaultGetKey,
  defaultGetTextValue,
  defaultGetNewOptionData,
} from "../utils/collection";
import {
  normalizeSelectedKeys,
  denormalizeSelectedKeys,
} from "../utils/selection";
import {
  ComboBoxRootContext,
  useComboBoxRootContext,
} from "./combobox.root-context";

/**
 * # ComboBox.Root
 *
 * Root component for ComboBox that provides state management and context for all child components.
 * Handles selection state, input filtering, menu open/close, and custom option creation.
 *
 * @example
 * ```tsx
 * <ComboBox.Root
 *   items={items}
 *   getKey={(item) => item.id}
 *   getTextValue={(item) => item.name}
 *   onSelectionChange={(keys) => console.log(keys)}
 * >
 *   <ComboBox.Trigger>
 *     <ComboBox.Input />
 *   </ComboBox.Trigger>
 *   <ComboBox.Popover>
 *     <ComboBox.ListBox>
 *       {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
 *     </ComboBox.ListBox>
 *   </ComboBox.Popover>
 * </ComboBox.Root>
 * ```
 *
 * @supportsStyleProps
 */

export function ComboBoxRoot<T extends object>(props: ComboBoxRootProps<T>) {
  let ref: RefObject<HTMLDivElement | null>;
  [props, ref] = useContextProps(props, null, ComboBoxContext);
  const {
    selectionMode = "single",
    getKey = defaultGetKey,
    getTextValue = defaultGetTextValue,
    children,
    leadingElement,
    isDisabled = false,
    isInvalid = false,
    isRequired = false,
    isReadOnly = false,
  } = props;
  // Split recipe variants first
  const recipe = useSlotRecipe({ key: "combobox" });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(props);

  // Extract style props
  const [styleProps, functionalProps] = extractStyleProps(restRecipeProps);

  // Ref for positioning the popover relative to the value area
  const triggerRef = useRef<HTMLDivElement>(null);

  const rootContextValue: ComboBoxRootContextValue<T> = useMemo(
    () => ({
      selectionMode,
      getKey,
      getTextValue,
      leadingElement,
      triggerRef,
      isDisabled,
      isRequired,
      isInvalid,
      isReadOnly,
    }),
    [
      selectionMode,
      getKey,
      getTextValue,
      leadingElement,
      triggerRef,
      isDisabled,
      isRequired,
      isInvalid,
      isReadOnly,
    ]
  );

  // Creates Collection that can be used by both the Listbox and Taggroup
  const content = useMemo(
    () => (
      <ComboBoxRootContext.Provider
        // Type assertion needed: Context expects object but we have specific type T
        value={rootContextValue as ComboBoxRootContextValue<object>}
      >
        <ListBoxContext.Provider value={{ items: props.items }}>
          {typeof children === "function"
            ? children({
                isOpen: false,
                isDisabled,
                isInvalid,
                isRequired,
                defaultChildren: null,
              } as T & {
                defaultChildren: null;
                isOpen: boolean;
                isDisabled: boolean;
                isInvalid: boolean;
                isRequired: boolean;
              })
            : children}
        </ListBoxContext.Provider>
      </ComboBoxRootContext.Provider>
    ),
    [children, isDisabled, isInvalid, isRequired, props.items, rootContextValue]
  );

  // Provide ListBoxContext with items for the CollectionBuilder
  return (
    <ComboBoxRootContext.Provider
      // Type assertion needed: Context expects object but we have specific type T
      value={rootContextValue as ComboBoxRootContextValue<object>}
    >
      <ComboBoxRootSlot
        ref={ref}
        {...recipeProps}
        {...styleProps}
        data-disabled={isDisabled}
        data-invalid={isInvalid}
        data-required={isRequired}
        data-readonly={isReadOnly}
        data-open={props.isOpen}
      >
        <CollectionBuilder content={content}>
          {(collection) => (
            <ComboBoxRootInner<T>
              {...functionalProps}
              selectionMode={selectionMode}
              getKey={getKey}
              getTextValue={getTextValue}
              isDisabled={isDisabled}
              isRequired={isRequired}
              isInvalid={isInvalid}
              isReadOnly={isReadOnly}
              collection={collection as unknown as Collection<Node<T>>}
            />
          )}
        </CollectionBuilder>
      </ComboBoxRootSlot>
    </ComboBoxRootContext.Provider>
  );
}

ComboBoxRoot.displayName = "ComboBox.Root";

type ComboBoxRootInnerProps<T extends object> = ComboBoxRootProps<T> & {
  collection: Collection<Node<T>>;
};
/**
 * Inner component that receives the built collection and renders the ComboBox
 */
const ComboBoxRootInner = <T extends object>(
  props: ComboBoxRootInnerProps<T> & {}
) => {
  const intl = useIntl();
  const {
    selectionMode = "single",
    items,
    collection,
    getKey = defaultGetKey,
    getTextValue = defaultGetTextValue,
    children,
    selectedKeys: selectedKeysFromProps = [],
    onSelectionChange,
    inputValue: inputValueFromProps = "",
    onInputChange,
    filter: customFilter,
    placeholder,
    menuTrigger = "input",
    shouldCloseOnBlur = true,
    shouldCloseOnSelect = true,
    isOpen: controlledIsOpen,
    defaultOpen = false,
    onOpenChange,
    allowsEmptyMenu = false,
    renderEmptyState,
    allowsCustomOptions = false,
    isValidNewOption,
    getNewOptionData = defaultGetNewOptionData,
    onCreateOption,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    isDisabled = false,
    isRequired = false,
    isInvalid = false,
    isReadOnly = false,
  } = props;

  // Generate stable IDs for ARIA relationships
  const listboxId = useId();
  const tagGroupId = useId();

  // Create ref for input to enable programmatic focus
  const inputRef = useRef<HTMLInputElement>(null);

  // Normalize selectedKeys to Set
  const normalizedSelectedKeysFromProps = useMemo(
    () => normalizeSelectedKeys(selectedKeysFromProps),
    [selectedKeysFromProps]
  );
  // Selected items state (controlled vs uncontrolled)
  const isSelectionControlled = Boolean(onSelectionChange);
  const [internalNormalizedSelectedKeys, setInternalSelectedKeys] = useState(
    normalizedSelectedKeysFromProps
  );
  const normalizedSelectedKeys = isSelectionControlled
    ? normalizedSelectedKeysFromProps
    : internalNormalizedSelectedKeys;

  // Items state (internal management for allowsCustomOptions)
  const [internalItems, setInternalItems] = useState(() =>
    items ? Array.from(items) : []
  );
  // Use internal items when allowsCustomOptions is enabled, otherwise use prop items
  const effectiveItems = allowsCustomOptions ? internalItems : items;

  // Input value state (controlled vs uncontrolled)
  // Controlled when onInputChange is provided, uncontrolled otherwise
  const isInputControlled = onInputChange !== undefined;

  // Compute initial input value for uncontrolled mode
  // In uncontrolled single-select mode, initialize input from selected item's text
  const computeInitialInputValue = () => {
    // If inputValue provided, use it
    if (inputValueFromProps) return inputValueFromProps;

    // Only compute from selection in uncontrolled single-select mode
    if (isInputControlled || selectionMode !== "single") return "";

    // Get the first selected key
    const selectedKeysArray = Array.from(normalizedSelectedKeys);
    if (selectedKeysArray.length === 0) return "";

    const selectedKey = selectedKeysArray[0];
    // Get the text value from the collection
    const selectedNode = collection.getItem(selectedKey);
    return selectedNode?.textValue ?? "";
  };

  const [internalInputValue, setInternalInputValue] = useState(
    computeInitialInputValue
  );
  const inputValue = isInputControlled
    ? inputValueFromProps
    : internalInputValue;

  // Track previous input value to detect changes
  const prevInputValueRef = useRef(inputValue);

  // Open state (controlled vs uncontrolled)
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);
  const isOpen = controlledIsOpen ?? internalIsOpen;

  // Focus strategy for keyboard navigation (aria-activedescendant pattern)
  // Note: focusedKey is managed by state.selectionManager.focusedKey
  const [focusStrategy, setFocusStrategy] = useState<"first" | "last" | null>(
    null
  );

  // Unified setIsOpen that calls both internal state and callback
  const setIsOpen = useCallback(
    (open: boolean) => {
      if (controlledIsOpen === undefined) {
        setInternalIsOpen(open);
      }
      onOpenChange?.(open);
    },
    [controlledIsOpen, onOpenChange]
  );

  // Toggle function that doesn't rely on captured isOpen value
  const toggleOpen = useCallback(() => {
    const willOpen =
      controlledIsOpen === undefined ? !isOpen : !controlledIsOpen;

    if (controlledIsOpen === undefined) {
      // Uncontrolled: use functional update to avoid stale closure
      // onOpenChange will be called by the useEffect below when isOpen actually changes
      setInternalIsOpen((prev) => !prev);
    } else {
      // Controlled: parent manages state, just notify
      onOpenChange?.(!controlledIsOpen);
    }

    // When opening, focus the input and set focus strategy
    if (willOpen) {
      inputRef.current?.focus();
      setFocusStrategy("first");
    }
  }, [controlledIsOpen, isOpen, onOpenChange]);

  // Call onOpenChange when isOpen changes (for uncontrolled mode)
  // This ensures we only call it once after the state actually updates
  const prevIsOpenRef = useRef(isOpen);
  useEffect(() => {
    if (controlledIsOpen === undefined && prevIsOpenRef.current !== isOpen) {
      prevIsOpenRef.current = isOpen;
      onOpenChange?.(isOpen);
    }
  }, [isOpen, controlledIsOpen, onOpenChange]);

  // Handle input value changes with menuTrigger logic
  const handleInputChange = useCallback(
    (value: string) => {
      if (!isInputControlled) {
        // Uncontrolled: update internal state
        setInternalInputValue(value);
      }
      // Always call callback (works for both modes)
      onInputChange?.(value);

      // Open menu on input if menuTrigger is "input" and value changed
      if (menuTrigger === "input" && value !== prevInputValueRef.current) {
        setIsOpen(true);
      }

      prevInputValueRef.current = value;
    },
    [isInputControlled, onInputChange, menuTrigger, setIsOpen]
  );

  // Create filtered collection using Collection's built-in filter method
  // This preserves all navigation methods (getFirstKey, getLastKey, getKeyBefore, getKeyAfter)
  const filteredCollection = useMemo(() => {
    // Skip filtering if input is empty - show all items
    if (inputValue.trim() === "") {
      return collection;
    }

    // In single-select mode, if input matches a selected item exactly, show all items
    // This allows users to see all options after selecting one
    if (selectionMode === "single") {
      const selectedKeys = Array.from(normalizedSelectedKeys);
      if (selectedKeys.length > 0) {
        const selectedKey = selectedKeys[0];
        const selectedNode = collection.getItem(selectedKey);

        // If input value matches the selected item's text exactly, show all items
        if (selectedNode?.textValue === inputValue) {
          return collection;
        }
      }
    }

    // Apply the filter using Collection's built-in filter method
    // This preserves all navigation methods

    if (customFilter) {
      // If custom filter provided, we need to adapt it
      // Custom filter signature: (nodes: Iterable<Node<T>>, inputValue: string) => Iterable<Node<T>>
      // Collection.filter signature: (nodeValue: string, node: Node<T>) => boolean

      // Convert nodes to array, apply custom filter, then get keys to filter
      const allNodes = Array.from(collection);
      const filteredNodes = Array.from(customFilter(allNodes, inputValue));
      const filteredKeys = new Set(filteredNodes.map((node) => node.key));

      // Use Collection.filter with the filtered keys
      return (
        collection.filter?.((nodeValue, node) => {
          return filteredKeys.has(node.key);
        }) ?? collection
      );
    }

    // Default text-based filtering using Collection's built-in filter
    const lowerInput = inputValue.toLowerCase();
    return (
      collection.filter?.((nodeValue) => {
        return nodeValue.toLowerCase().includes(lowerInput);
      }) ?? collection
    );
  }, [
    collection,
    inputValue,
    customFilter,
    selectionMode,
    normalizedSelectedKeys,
  ]);

  const handleSelectionChange = useCallback(
    (keys: Selection, previousKeys?: Set<Key>) => {
      // Handle "all" selection (convert to actual Set of all keys)
      let actualKeys =
        keys === "all"
          ? new Set(Array.from(collection).map((node) => node.key))
          : keys;

      // Use provided previous keys or fall back to current normalized keys
      const comparisonKeys = previousKeys ?? normalizedSelectedKeys;

      // In multi-select mode, toggle individual item selections when clicking options
      // React Aria sends a Set with one key when clicking an item
      // Only apply toggle logic if the new selection is not a proper subset (which would indicate removal)
      const isProperSubset =
        actualKeys.size > 0 &&
        Array.from(actualKeys).every((key) => comparisonKeys.has(key)) &&
        actualKeys.size < comparisonKeys.size;

      if (
        selectionMode === "multiple" &&
        actualKeys.size === 1 &&
        !isProperSubset
      ) {
        const clickedKey = Array.from(actualKeys)[0];
        const isAlreadySelected = comparisonKeys.has(clickedKey);

        // If clicking an unselected item, add it to selection
        if (!isAlreadySelected) {
          const newSelection = new Set(comparisonKeys);
          newSelection.add(clickedKey);
          actualKeys = newSelection;
        }
        // If clicking a selected item, remove it (toggle off)
        else {
          const newSelection = new Set(comparisonKeys);
          newSelection.delete(clickedKey);
          actualKeys = newSelection;
        }
      }

      // Update selection state
      const denormalized = denormalizeSelectedKeys(actualKeys, selectionMode);

      if (onSelectionChange) {
        // If selection is controlled, send selected keys array to parent
        onSelectionChange(denormalized);
      } else {
        // if selection is uncontrolled, set internal state
        setInternalSelectedKeys(actualKeys);
      }

      // For single-select mode, update input value and close popover
      if (selectionMode === "single") {
        const selectedKey = Array.from(actualKeys)[0];

        if (selectedKey != null) {
          // Get the selected item's text value
          const selectedNode = collection.getItem(selectedKey);
          const textValue = selectedNode?.textValue ?? "";

          // Update input value
          if (!isInputControlled) {
            // Uncontrolled: update internal state
            setInternalInputValue(textValue);
            prevInputValueRef.current = textValue;
          }
          // Always call callback (works for both modes)
          onInputChange?.(textValue);
        }

        // Close the popover if shouldCloseOnSelect is true
        if (shouldCloseOnSelect) {
          setIsOpen(false);
        }
      }
    },
    [
      collection,
      selectionMode,
      normalizedSelectedKeys,
      onSelectionChange,
      onInputChange,
      shouldCloseOnSelect,
      setIsOpen,
    ]
  );

  const state = useListState<T>({
    selectionMode,
    collection: filteredCollection,
    selectedKeys: normalizedSelectedKeys,
    onSelectionChange: handleSelectionChange,
  });

  const selectedItemsFromState = useMemo(
    () =>
      selectionMode === "multiple"
        ? Array.from(state.selectionManager.selectedKeys)
            .map((key) => collection.getItem(key)?.value)
            .filter((item): item is T => item !== undefined)
        : [],
    [
      selectionMode,
      state.selectionManager.selectedKeys,
      collection,
      state.collection,
    ]
  );

  // Clear all selections
  const clearSelection = useCallback(() => {
    state.selectionManager.setSelectedKeys(new Set());

    // Clear input value in single-select mode
    if (selectionMode === "single") {
      if (!isInputControlled) {
        // Uncontrolled: update internal state
        setInternalInputValue("");
        prevInputValueRef.current = "";
      }
      // Always call callback (works for both modes)
      onInputChange?.("");
    }
  }, [state.selectionManager, selectionMode, isInputControlled, onInputChange]);

  // Remove a specific key (for tag removal in multi-select)
  // React Aria's TagGroup onRemove passes a Set of removed keys
  const removeKey = useCallback(
    (keysToRemove: Set<Key>) => {
      const currentKeys = normalizedSelectedKeys;
      const newKeys = new Set(currentKeys);

      // Remove all keys in the set
      keysToRemove.forEach((key) => newKeys.delete(key));

      // Use handleSelectionChange which will detect this as a removal (proper subset)
      // Pass currentKeys as previousKeys so it can properly detect the subset
      handleSelectionChange(newKeys, currentKeys);

      // If no tags remain after removal, move focus to the input
      if (newKeys.size === 0) {
        inputRef.current?.focus();
      }
    },
    [normalizedSelectedKeys, handleSelectionChange]
  );

  // Handle creating a new option from input value
  // TODO: Add to context value once custom options feature is implemented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCreateOption = useCallback((): boolean => {
    if (!allowsCustomOptions) return false;

    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return false;

    // Check if option already exists
    const matchesExisting = Array.from(state.collection).some(
      (node) => node.textValue?.toLowerCase() === trimmedInput.toLowerCase()
    );
    if (matchesExisting) {
      return false;
    }

    // Check custom validation if provided
    if (isValidNewOption && !isValidNewOption(trimmedInput)) {
      return false;
    }

    // Create the new item
    const newItem = getNewOptionData(trimmedInput);
    const newKey = getKey(newItem);

    // Add to internal items array
    setInternalItems((prev) => [...prev, newItem]);

    // Select the new item
    const currentKeys = state.selectionManager.selectedKeys;
    if (selectionMode === "single") {
      // Single-select: replace selection
      state.selectionManager.setSelectedKeys(new Set([newKey]));
    } else {
      // Multi-select: add to selection
      const newSelection = new Set(currentKeys);
      newSelection.add(newKey);
      state.selectionManager.setSelectedKeys(newSelection);
    }

    // Clear input for multi-select, update for single-select
    if (selectionMode === "multiple") {
      if (!isInputControlled) {
        // Uncontrolled: update internal state
        setInternalInputValue("");
        prevInputValueRef.current = "";
      }
      // Always call callback (works for both modes)
      onInputChange?.("");
    } else {
      const textValue = getTextValue(newItem);
      if (!isInputControlled) {
        // Uncontrolled: update internal state
        setInternalInputValue(textValue);
        prevInputValueRef.current = textValue;
      }
      // Always call callback (works for both modes)
      onInputChange?.(textValue);
    }

    // Close menu for single-select
    if (selectionMode === "single" && shouldCloseOnSelect) {
      setIsOpen(false);
    }

    // Notify callback
    onCreateOption?.(trimmedInput);

    return true;
  }, [
    allowsCustomOptions,
    getNewOptionData,
    isValidNewOption,
    inputValue,
    state,
    getKey,
    getTextValue,
    selectionMode,
    shouldCloseOnSelect,
    setIsOpen,
    onInputChange,
    onCreateOption,
  ]);

  // Handle keyboard navigation in the input
  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setFocusStrategy("first");
          } else {
            // Move focus to first/next item
            const currentKey = state.selectionManager.focusedKey;
            const nextKey = currentKey
              ? state.collection.getKeyAfter(currentKey)
              : state.collection.getFirstKey();
            state.selectionManager.setFocusedKey(
              nextKey ?? state.collection.getFirstKey()
            );
          }
          break;

        case "ArrowUp":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setFocusStrategy("last");
          } else {
            // Move focus to last/previous item
            const currentKey = state.selectionManager.focusedKey;
            const prevKey = currentKey
              ? state.collection.getKeyBefore(currentKey)
              : state.collection.getLastKey();
            state.selectionManager.setFocusedKey(
              prevKey ?? state.collection.getLastKey()
            );
          }
          break;

        case "Enter":
          if (isOpen && state.selectionManager.focusedKey) {
            e.preventDefault();
            const focusedKey = state.selectionManager.focusedKey;

            if (selectionMode === "multiple") {
              // In multi-select mode, toggle the focused item
              const newSelection = new Set(normalizedSelectedKeys);
              if (newSelection.has(focusedKey)) {
                newSelection.delete(focusedKey);
              } else {
                newSelection.add(focusedKey);
              }
              handleSelectionChange(newSelection);
              // Keep focus on the same item after selection
            } else {
              // In single-select mode, replace the selection
              handleSelectionChange(new Set([focusedKey]));
              state.selectionManager.setFocusedKey(null);
            }
          }
          // Don't prevent default if no focused key - allows form submission
          break;

        case "Escape":
          if (isOpen) {
            e.preventDefault();
            setIsOpen(false);
            state.selectionManager.setFocusedKey(null);
            // TODO: Revert to last selected value in single-select mode
          }
          break;

        case "Home":
          if (isOpen) {
            e.preventDefault();
            const firstKey = state.collection.getFirstKey();
            state.selectionManager.setFocusedKey(firstKey);
          }
          break;

        case "End":
          if (isOpen) {
            e.preventDefault();
            const lastKey = state.collection.getLastKey();
            state.selectionManager.setFocusedKey(lastKey);
          }
          break;

        default:
          // Regular typing - handled by onChange
          break;
      }
    },
    [
      isOpen,
      state.selectionManager,
      state.collection,
      handleSelectionChange,
      setIsOpen,
      setFocusStrategy,
    ]
  );

  // Handle input focus - open if menuTrigger is "focus"
  const handleFocus = useCallback(() => {
    if (menuTrigger === "focus" && !isDisabled && !isReadOnly) {
      setIsOpen(true);
    }
  }, [menuTrigger, isDisabled, isReadOnly, setIsOpen]);

  // Handle blur - close menu if shouldCloseOnBlur
  const handleBlur = useCallback(
    (e: React.FocusEvent) => {
      if (!shouldCloseOnBlur) return;

      // Capture the currentTarget before setTimeout
      // React reuses synthetic event objects, so e.currentTarget will be null inside setTimeout
      const comboboxRoot = e.currentTarget;

      // Use setTimeout to allow click events to fire first
      // This prevents the menu from closing when clicking an option
      setTimeout(() => {
        // Check if focus moved outside the combobox entirely
        // (React Aria's ListBox will handle keeping focus on input during keyboard nav)
        const currentFocus = document.activeElement;

        if (!comboboxRoot.contains(currentFocus)) {
          setIsOpen(false);
        }
      }, 150); // 150ms delay matches React Aria's useComboBoxState
    },
    [shouldCloseOnBlur, setIsOpen]
  );

  // Track the last selectedKey to detect changes
  const lastSelectedKeyRef = useRef<Key | null>(null);

  // Sync input value with selected item in single-select mode
  // Replicates React Aria's useComboBoxState behavior
  useEffect(() => {
    // Only sync in single-select mode
    if (selectionMode !== "single") return;

    // Get the current selected key
    const selectedKeys = Array.from(state.selectionManager.selectedKeys);
    const currentSelectedKey = selectedKeys.length > 0 ? selectedKeys[0] : null;

    // Only update if selectedKey actually changed
    if (currentSelectedKey === lastSelectedKeyRef.current) return;

    // Update the ref to track this change
    lastSelectedKeyRef.current = currentSelectedKey;

    // Reset input value to match selected item's text
    const itemText =
      currentSelectedKey != null
        ? (state.collection.getItem(currentSelectedKey)?.textValue ?? "")
        : "";

    // Update input value (respecting controlled/uncontrolled pattern)
    if (!isInputControlled) {
      // Uncontrolled: update internal state directly
      setInternalInputValue(itemText);
      prevInputValueRef.current = itemText;
    } else {
      // Controlled: notify parent via onInputChange callback
      onInputChange?.(itemText);
    }
  }, [
    selectionMode,
    state.selectionManager.selectedKeys,
    state.collection,
    isInputControlled,
    onInputChange,
  ]);

  // Apply focus strategy when menu opens
  useEffect(() => {
    if (isOpen && focusStrategy) {
      const key =
        focusStrategy === "first"
          ? state.collection.getFirstKey()
          : state.collection.getLastKey();

      state.selectionManager.setFocusedKey(key ?? null);
      setFocusStrategy(null); // Reset strategy after applying
    }
  }, [isOpen, focusStrategy, state.collection, state.selectionManager]);

  // Manage focus state when menu opens/closes
  useEffect(() => {
    if (isOpen) {
      // Enable focus mode for virtual focus to work
      state.selectionManager.setFocused(true);
    } else {
      // Disable focus mode and clear focused key
      state.selectionManager.setFocused(false);
      state.selectionManager.setFocusedKey(null);
    }
  }, [isOpen, state.selectionManager]);

  // Track if collection has been populated at least once
  const collectionPopulatedRef = useRef(false);
  if (state.collection.size > 0) {
    collectionPopulatedRef.current = true;
  }

  // Close menu when filtered collection is empty (unless allowsEmptyMenu is true)
  // Replicates React Aria's useComboBoxState behavior
  useEffect(() => {
    // Only close if menu is currently open and allowsEmptyMenu is false
    if (!isOpen || allowsEmptyMenu) return;

    // Only check for empty collection if it has been populated before
    // This prevents closing the menu before the collection is built from children
    if (!collectionPopulatedRef.current) return;

    // Check if the collection has any items
    const hasItems = state.collection.size > 0;

    // Close menu if no items match the filter
    if (!hasItems) {
      setIsOpen(false);
    }
  }, [isOpen, allowsEmptyMenu, state.collection.size, setIsOpen, inputValue]);

  const { triggerRef } = useComboBoxRootContext();

  const contextValues = [
    // InputContext - for ComboBox.Input
    [
      InputContext,
      {
        ref: inputRef,
        role: "combobox" as const,
        "aria-autocomplete": "list" as const,
        "aria-controls":
          selectionMode === "multiple"
            ? `${tagGroupId} ${listboxId}`
            : listboxId,
        "aria-expanded": isOpen,
        "aria-activedescendant": state.selectionManager.focusedKey
          ? `${listboxId}-option-${state.selectionManager.focusedKey}`
          : undefined,
        "aria-describedby":
          selectionMode === "multiple" ? tagGroupId : undefined,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        value: inputValue,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
          handleInputChange(e.target.value),
        onKeyDown: handleInputKeyDown,
        onFocus: handleFocus,
        onBlur: handleBlur,
        disabled: isDisabled,
        readOnly: isReadOnly,
        required: isRequired,
        "aria-invalid": isInvalid,
        placeholder,
      },
    ],

    // TagGroupContext - for ComboBox.TagGroup (multi-select)
    [
      TagGroupContext,
      {
        id: tagGroupId,
        items: selectedItemsFromState,
        onRemove: removeKey,
      },
    ],

    // ButtonContext with slots - for toggle and clear buttons
    [
      ButtonContext,
      {
        slots: {
          toggle: {
            onPress: toggleOpen,
            "aria-label": intl.formatMessage(messages.toggleOptions),
            isDisabled: isDisabled,
          },
          clear: {
            onPress: clearSelection,
            "aria-label": intl.formatMessage(messages.clearSelection),
            isDisabled:
              isDisabled || state.selectionManager.selectedKeys.size === 0,
          },
        },
      },
    ],

    // PopoverContext - for ComboBox.Popover
    // NOTE: We pass onOpenChange as a no-op function to signal to React Aria
    // that we're controlling the state, but we don't want it to call back.
    // This prevents React Aria's Popover from managing its own internal state.
    [
      PopoverContext,
      {
        isOpen: isOpen,
        onOpenChange: () => {
          // No-op: We control the state via our toggle button
          // This prevents React Aria from managing its own state
        },
        triggerRef: triggerRef,
        isNonModal: true,
      },
    ],
    [SelectableCollectionContext, { shouldUseVirtualFocus: true }],
    // ListBoxContext - for ComboBox.ListBox
    // Pass listbox props and ref from useListBox hook
    [
      ListBoxContext,
      {
        items: effectiveItems,
        id: listboxId,
        renderEmptyState,
      },
    ],

    [ListStateContext, state],
  ];

  return (
    <Provider
      // TypeScript cannot properly infer the complex heterogeneous tuple type required by Provider.
      // The runtime behavior is correct - each context receives its properly typed value.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      values={contextValues as any}
    >
      {/* Type assertion needed - CollectionChildren<T> is assignable to ReactNode at runtime */}
      {children as React.ReactNode}
    </Provider>
  );
};
