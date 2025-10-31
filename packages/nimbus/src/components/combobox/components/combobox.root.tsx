import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useId,
  type ReactNode,
} from "react";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { useListState, type Node, type Key } from "react-stately";
import { ComboBoxCustomContextProvider } from "./combobox.custom-context";
import { ComboBoxRootSlot } from "../combobox.slots";
import type {
  ComboBoxRootProps,
  ComboBoxRootContextValue,
} from "../combobox.types";
import { extractStyleProps } from "@/utils";

/**
 * Default key extractor - uses string/number id or object with id property
 */
const defaultGetKey = <T extends object>(item: T): Key => {
  if (typeof item === "string" || typeof item === "number") {
    return item as Key;
  }
  if ("id" in item) {
    return (item as { id: Key }).id;
  }
  throw new Error("Item must have an 'id' property or provide getKey function");
};

/**
 * Default text value extractor - uses string item or object with name property
 */
const defaultGetTextValue = <T extends object>(item: T): string => {
  if (typeof item === "string") {
    return item;
  }
  if ("name" in item) {
    return String((item as { name: unknown }).name);
  }
  if ("label" in item) {
    return String((item as { label: unknown }).label);
  }
  return String(item);
};

/**
 * Default getNewOptionData - creates an object with id and name
 */
const defaultGetNewOptionData = <T extends object>(inputValue: string): T => {
  return {
    id: inputValue,
    name: inputValue,
  } as T;
};

/**
 * Normalize selectedKeys to Set format
 */
const normalizeSelectedKeys = (
  keys: Key | Key[] | undefined | null
): Set<Key> => {
  if (!keys) return new Set();
  if (keys instanceof Set) return keys;
  return new Set(Array.isArray(keys) ? keys : [keys]);
};

/**
 * Denormalize selectedKeys from Set to single value or array based on selectionMode
 */
const denormalizeSelectedKeys = (
  keys: Set<Key>,
  selectionMode: "single" | "multiple"
): Key | Key[] => {
  const keysArray = Array.from(keys);
  if (selectionMode === "single") {
    return keysArray[0] ?? null;
  }
  return keysArray;
};

/**
 * Default filter implementation - filters by text content
 */
const defaultFilter = <T extends object>(
  nodes: Iterable<Node<T>>,
  inputValue: string
): Iterable<Node<T>> => {
  if (!inputValue.trim()) return nodes;

  const lowerInput = inputValue.toLowerCase();
  return Array.from(nodes).filter((node) => {
    const text = node.textValue?.toLowerCase() ?? "";
    return text.includes(lowerInput);
  });
};

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
export const ComboBoxRoot = <T extends object>(props: ComboBoxRootProps<T>) => {
  // Split recipe variants first
  const recipe = useSlotRecipe({ key: "combobox" });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(props);

  // Extract style props
  const [styleProps, functionalProps] = extractStyleProps(restRecipeProps);

  const {
    selectionMode = "single",
    items,
    getKey = defaultGetKey,
    getTextValue = defaultGetTextValue,
    children,
    selectedKeys: controlledSelectedKeys,
    onSelectionChange,
    defaultSelectedKeys,
    inputValue: controlledInputValue,
    defaultInputValue = "",
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
    leadingElement,
    isDisabled = false,
    isRequired = false,
    isInvalid = false,
    isReadOnly = false,
    ref,
    ...restProps
  } = functionalProps as ComboBoxRootProps<T>;

  // Generate stable IDs for ARIA relationships
  const listboxId = useId();
  const tagGroupId = useId();

  // Normalize selectedKeys to Set
  const normalizedSelectedKeys = useMemo(
    () => normalizeSelectedKeys(controlledSelectedKeys ?? defaultSelectedKeys),
    [controlledSelectedKeys, defaultSelectedKeys]
  );

  // Items state (internal management for allowsCustomOptions)
  const [internalItems, setInternalItems] = useState(() =>
    items ? Array.from(items) : []
  );
  // Use internal items when allowsCustomOptions is enabled, otherwise use prop items
  const effectiveItems = allowsCustomOptions ? internalItems : items;

  // Input value state (controlled vs uncontrolled)
  const [internalInputValue, setInternalInputValue] =
    useState(defaultInputValue);
  const inputValue = controlledInputValue ?? internalInputValue;

  // Track previous input value to detect changes
  const prevInputValueRef = useRef(inputValue);

  // Open state (controlled vs uncontrolled)
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);
  const isOpen = controlledIsOpen ?? internalIsOpen;

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

  // Handle input value changes with menuTrigger logic
  const handleInputChange = useCallback(
    (value: string) => {
      if (controlledInputValue === undefined) {
        setInternalInputValue(value);
      }
      onInputChange?.(value);

      // Open menu on input if menuTrigger is "input" and value changed
      if (menuTrigger === "input" && value !== prevInputValueRef.current) {
        setIsOpen(true);
      }

      prevInputValueRef.current = value;
    },
    [controlledInputValue, onInputChange, menuTrigger, setIsOpen]
  );

  // Create filter function that captures inputValue
  const filterWithInput = useCallback(
    (nodes: Iterable<Node<T>>) => {
      const filterFn = customFilter ?? defaultFilter;
      return filterFn(nodes, inputValue);
    },
    [customFilter, inputValue]
  );

  // Initialize useListState with effective items
  const state = useListState<T>({
    selectionMode,
    items: effectiveItems,
    filter: filterWithInput,
    children,
    selectedKeys: normalizedSelectedKeys,
    onSelectionChange: (keys) => {
      // Handle "all" selection (convert to actual Set of all keys)
      const actualKeys =
        keys === "all"
          ? new Set(Array.from(state.collection).map((node) => node.key))
          : keys;
      const denormalized = denormalizeSelectedKeys(actualKeys, selectionMode);
      onSelectionChange?.(denormalized);
    },
  });

  // Clear all selections
  const clearSelection = useCallback(() => {
    state.selectionManager.setSelectedKeys(new Set());

    // Clear input value in single-select mode
    if (selectionMode === "single") {
      if (controlledInputValue === undefined) {
        setInternalInputValue("");
        prevInputValueRef.current = "";
      }
      onInputChange?.("");
    }
  }, [
    state.selectionManager,
    selectionMode,
    controlledInputValue,
    onInputChange,
  ]);

  // Remove a specific key (for tag removal in multi-select)
  const removeKey = useCallback(
    (key: Key) => {
      const currentKeys = state.selectionManager.selectedKeys;
      const newKeys = new Set(currentKeys);
      newKeys.delete(key);
      state.selectionManager.setSelectedKeys(newKeys);
    },
    [state.selectionManager]
  );

  // Handle creating a new option from input value
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
      if (controlledInputValue === undefined) {
        setInternalInputValue("");
        prevInputValueRef.current = "";
      }
      onInputChange?.("");
    } else {
      const textValue = getTextValue(newItem);
      if (controlledInputValue === undefined) {
        setInternalInputValue(textValue);
        prevInputValueRef.current = textValue;
      }
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
    controlledInputValue,
    onInputChange,
    onCreateOption,
  ]);

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

      // Use setTimeout to allow click events to fire first
      // This prevents the menu from closing when clicking an option
      setTimeout(() => {
        // Check if focus moved outside the combobox entirely
        // (React Aria's ListBox will handle keeping focus on input during keyboard nav)
        const currentFocus = document.activeElement;
        const comboboxRoot = e.currentTarget;

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
    if (controlledInputValue === undefined) {
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
    controlledInputValue,
    onInputChange,
  ]);

  // Close menu when filtered collection is empty (unless allowsEmptyMenu is true)
  // Replicates React Aria's useComboBoxState behavior
  useEffect(() => {
    // Only close if menu is currently open and allowsEmptyMenu is false
    if (!isOpen || allowsEmptyMenu) return;

    // Check if the collection has any items
    const hasItems = state.collection.size > 0;

    // Close menu if no items match the filter
    if (!hasItems) {
      setIsOpen(false);
    }
  }, [isOpen, allowsEmptyMenu, state.collection.size, setIsOpen]);

  // Ref for positioning the popover relative to the value area
  const triggerRef = useRef<HTMLDivElement>(null);

  const contextValue: ComboBoxRootContextValue<T> = useMemo(
    () => ({
      state,
      selectionMode,
      inputValue,
      setInputValue: handleInputChange,
      isOpen,
      setIsOpen,
      listboxId,
      tagGroupId,
      clearSelection,
      removeKey,
      handleCreateOption,
      getKey,
      getTextValue,
      isDisabled,
      isRequired,
      isInvalid,
      isReadOnly,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      leadingElement,
      triggerRef,
      placeholder,
      handleFocus,
      handleBlur,
      renderEmptyState,
    }),
    [
      state,
      selectionMode,
      inputValue,
      handleInputChange,
      isOpen,
      listboxId,
      tagGroupId,
      clearSelection,
      removeKey,
      handleCreateOption,
      getKey,
      getTextValue,
      isDisabled,
      isRequired,
      isInvalid,
      isReadOnly,
      ariaLabel,
      ariaLabelledBy,
      leadingElement,
      placeholder,
      handleFocus,
      handleBlur,
      renderEmptyState,
    ]
  );

  return (
    <ComboBoxCustomContextProvider value={contextValue}>
      <ComboBoxRootSlot
        ref={ref}
        {...recipeProps}
        {...styleProps}
        data-disabled={isDisabled}
        data-invalid={isInvalid}
        data-required={isRequired}
        data-readonly={isReadOnly}
        data-open={isOpen}
        {...restProps}
      >
        {/* Type assertion needed - CollectionChildren<T> is assignable to ReactNode at runtime */}
        {children as ReactNode}
      </ComboBoxRootSlot>
    </ComboBoxCustomContextProvider>
  );
};

ComboBoxRoot.displayName = "ComboBox.Root";
