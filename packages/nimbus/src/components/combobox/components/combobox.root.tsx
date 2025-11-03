import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useId,
  type RefObject,
} from "react";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import {
  useListState,
  type Node,
  type Key,
  type Collection,
} from "react-stately";
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
  type Selection,
} from "react-aria-components";
import { useIntl } from "react-intl";

import { ComboBoxRootSlot } from "../combobox.slots";
import type {
  ComboBoxRootProps,
  ComboBoxRootContextValue,
} from "../combobox.types";
import { messages } from "../combobox.i18n";
import { extractStyleProps } from "@/utils";
import {
  ComboBoxRootContext,
  useComboBoxRootContext,
} from "./combobox.root-context";
/**
 * Default key extractor - uses string/number id or object with id property
 */
function defaultGetKey<T extends object>(item: T): Key {
  if (typeof item === "string" || typeof item === "number") {
    return item as Key;
  }
  if ("id" in item) {
    return (item as { id: Key }).id;
  }
  throw new Error("Item must have an 'id' property or provide getKey function");
}

//TODO: should this be exported as a util in the combobox namespace?
/**
 * Default text value extractor - uses string item or object with name property
 */
export function defaultGetTextValue<T extends object>(item: T): string {
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
}

/**
 * Default getNewOptionData - creates an object with id and name
 */
function defaultGetNewOptionData<T extends object>(inputValue: string): T {
  return {
    id: inputValue,
    name: inputValue,
  } as T;
}

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
function defaultFilter<T extends object>(
  nodes: Iterable<Node<T>>,
  inputValue: string
): Iterable<Node<T>> {
  if (!inputValue.trim()) return nodes;

  const lowerInput = inputValue.toLowerCase();
  return Array.from(nodes).filter((node) => {
    const text = node.textValue?.toLowerCase() ?? "";
    return text.includes(lowerInput);
  });
}

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

  // Close menu when filtered collection is empty (unless allowsEmptyMenu is true)
  // Replicates React Aria's useComboBoxState behavior
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
    isDisabled = false,
    isRequired = false,
    isInvalid = false,
    isReadOnly = false,
  } = props;

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

  // Toggle function that doesn't rely on captured isOpen value
  const toggleOpen = useCallback(() => {
    if (controlledIsOpen === undefined) {
      // Uncontrolled: use functional update to avoid stale closure
      // onOpenChange will be called by the useEffect below when isOpen actually changes
      setInternalIsOpen((prev) => !prev);
    } else {
      // Controlled: parent manages state, just notify
      onOpenChange?.(!controlledIsOpen);
    }
  }, [controlledIsOpen, onOpenChange]);

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

  // Create filtered collection following React Aria's useComboBoxState pattern
  // This applies filtering to the collection nodes before passing to useListState
  const filteredCollection = useMemo(() => {
    console.log("filteredCollection memo:", {
      inputValue,
      collectionSize: collection.size,
    });

    // Skip filtering if input is empty - show all items
    if (inputValue.trim() === "") {
      console.log("Skipping filter: empty input");
      return collection;
    }

    const filterFn = customFilter ?? defaultFilter;

    // In single-select mode, if input matches a selected item exactly, show all items
    // This allows users to see all options after selecting one
    if (selectionMode === "single") {
      const selectedKeys = Array.from(normalizedSelectedKeys);
      if (selectedKeys.length > 0) {
        const selectedKey = selectedKeys[0];
        const selectedNode = collection.getItem(selectedKey);

        // If input value matches the selected item's text exactly, show all items
        if (selectedNode?.textValue === inputValue) {
          console.log("Skipping filter: exact match with selected item");
          return collection;
        }
      }
    }

    // Apply the filter to the collection nodes
    console.log("Applying filter to collection");
    // Pass the collection itself (which is iterable) to the filter function
    const allNodes = Array.from(collection);
    console.log(
      "All nodes before filter:",
      allNodes.length,
      allNodes.map((n) => n.textValue)
    );
    const filteredNodes = filterFn(allNodes, inputValue);
    const filteredArray = Array.from(filteredNodes);
    console.log(
      "Filtered nodes count:",
      filteredArray.length,
      filteredArray.map((n) => n.textValue)
    );

    // Create a new collection with filtered nodes
    // We need to return the original collection type structure
    return {
      ...collection,
      *[Symbol.iterator]() {
        yield* filteredArray;
      },
      get size() {
        return filteredArray.length;
      },
      getKeys() {
        return filteredArray.map((node) => node.key);
      },
      getItem(key: Key) {
        return filteredArray.find((node) => node.key === key);
      },
    } as Collection<Node<T>>;
  }, [
    collection,
    inputValue,
    customFilter,
    selectionMode,
    normalizedSelectedKeys,
  ]);

  const handleSelectionChange = useCallback(
    (keys: Selection) => {
      // Handle "all" selection (convert to actual Set of all keys)
      const actualKeys =
        keys === "all"
          ? new Set(Array.from(collection).map((node) => node.key))
          : keys;

      // Update selection state
      const denormalized = denormalizeSelectedKeys(actualKeys, selectionMode);
      onSelectionChange?.(denormalized);

      // For single-select mode, update input value and close popover
      if (selectionMode === "single") {
        const selectedKey = Array.from(actualKeys)[0];

        if (selectedKey != null) {
          // Get the selected item's text value
          const selectedNode = collection.getItem(selectedKey);
          const textValue = selectedNode?.textValue ?? "";

          // Update input value
          if (controlledInputValue === undefined) {
            setInternalInputValue(textValue);
            prevInputValueRef.current = textValue;
          }
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
      onSelectionChange,
      controlledInputValue,
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
      handleSelectionChange(new Set([key]));
    },
    [state.selectionManager]
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
      console.log("Closing menu because collection is empty");
      setIsOpen(false);
    }
  }, [isOpen, allowsEmptyMenu, state.collection.size, setIsOpen, inputValue]);

  const { triggerRef } = useComboBoxRootContext();

  const contextValues = [
    // InputContext - for ComboBox.Input
    [
      InputContext,
      {
        role: "combobox" as const,
        "aria-autocomplete": "list" as const,
        "aria-controls":
          selectionMode === "multiple"
            ? `${tagGroupId} ${listboxId}`
            : listboxId,
        "aria-expanded": isOpen,
        "aria-describedby":
          selectionMode === "multiple" ? tagGroupId : undefined,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        value: inputValue,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
          handleInputChange(e.target.value),
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
        items:
          selectionMode === "multiple"
            ? Array.from(state.selectionManager.selectedKeys).map((key) =>
                state.collection.getItem(key)
              )
            : [],
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
