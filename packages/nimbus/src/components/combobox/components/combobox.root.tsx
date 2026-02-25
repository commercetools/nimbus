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
  useAsyncList,
  type Node,
  type Key,
  type Collection,
} from "react-stately";
import { useId } from "react-aria";
import { useDebouncedCallback } from "use-debounce";
import {
  CollectionBuilder,
  ComboBoxContext,
  useContextProps,
  Provider,
  InputContext,
  ButtonContext,
  GroupContext,
  TextContext,
  PopoverContext,
  LabelContext,
  ListBoxContext,
  TagGroupContext,
  ListStateContext,
  SelectableCollectionContext,
  type Selection,
} from "react-aria-components";
import { useLocalizedStringFormatter } from "@/hooks";
import { extractStyleProps } from "@/utils";
import { ComboBoxRootSlot } from "../combobox.slots";
import type {
  ComboBoxRootProps,
  ComboBoxRootContextValue,
  ComboBoxAsyncConfig,
} from "../combobox.types";
import { comboboxMessagesStrings } from "../combobox.messages";
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
import { ComboBoxHiddenInput } from "./combobox.hidden-input";

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
  // Merge props from React Aria's ComboBoxContext if nested in another ComboBox
  let ref: RefObject<HTMLDivElement | null>;
  [props, ref] = useContextProps(props, null, ComboBoxContext);

  const {
    selectionMode = "single",
    size = "md",
    getKey = defaultGetKey,
    getTextValue = defaultGetTextValue,
    children,
    leadingElement,
    inputValue: inputValueFromProps,
    onInputChange: onInputChangeFromProps,
    isLoading: isLoadingFromProps,
    allowsEmptyMenu: allowsEmptyMenuFromProps,
    renderEmptyState: renderEmptyStateFromProps,
    async: asyncConfig,
    filter,
    allowsCustomOptions = false,
    isDisabled = false,
    isInvalid = false,
    isRequired = false,
    isReadOnly = false,
  } = props;

  // Standard pattern: split recipe variants, then extract style props
  const recipe = useSlotRecipe({ key: "nimbusCombobox" });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(props);
  const [styleProps, functionalProps] = extractStyleProps(restRecipeProps);

  // Refs shared with children via context
  // - triggerRef: positions popover relative to trigger element
  // - inputRef: allows trigger to programmatically focus input
  const triggerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ============================================================
  // CUSTOM OPTIONS HANDLING
  // ============================================================
  // Track custom-created items (when allowsCustomOptions=true)
  // Managed in outer component to persist across searches/renders
  const [customCreatedItems, setCustomCreatedItems] = useState<T[]>([]);

  // ============================================================
  // ASYNC MODE HANDLING
  // ============================================================
  // When `async` prop provided: useAsyncList manages loading, debouncing, and fetching
  // Users provide load function + optional config (minSearchLength, debounce, onError)
  const asyncList = useAsyncList<T>({
    getKey,
    async load({ signal, filterText }) {
      if (!asyncConfig) return { items: [] };

      // Check minimum search length
      const minLength = asyncConfig.minSearchLength ?? 0;
      if (!filterText || filterText.length < minLength) {
        return { items: [] };
      }

      try {
        const items = await asyncConfig.load(filterText, signal);
        return { items };
      } catch (err) {
        // Ignore abort errors (expected when request is cancelled)
        if ((err as Error).name === "AbortError") {
          throw err;
        }
        // Call user's error handler if provided
        const error = err as Error;
        asyncConfig.onError?.(error);
        return { items: [] };
      }
    },
  });

  // Async mode state
  const [asyncInputValue, setAsyncInputValue] = useState(inputValueFromProps); // For immediate UI updates
  const [asyncPending, setAsyncPending] = useState(false); // Tracks debounce wait period
  const [asyncSelectedItems, setAsyncSelectedItems] = useState<T[]>([]); // Persist selected items across searches

  // Debounced filter text update (triggers load function after delay)
  const debounceMs = asyncConfig?.debounce ?? 300;
  const debouncedSetFilterText = useDebouncedCallback((value: string) => {
    setAsyncPending(false);
    asyncList.setFilterText(value); // Triggers load function
  }, debounceMs);

  // Input change handler for async mode
  const asyncOnInputChange = useCallback(
    (value: string) => {
      setAsyncInputValue(value); // Immediate display update
      setAsyncPending(true); // Show loading during debounce
      debouncedSetFilterText(value); // Trigger debounced API call
    },
    [debouncedSetFilterText]
  );

  // ============================================================
  // PROP ALIASING
  // ============================================================
  // Route props to async handlers when async mode is enabled

  const inputValue = asyncConfig ? asyncInputValue : inputValueFromProps;
  const onInputChange = asyncConfig
    ? asyncOnInputChange
    : onInputChangeFromProps;

  // Compute loading state from async list or external prop
  const isLoading = asyncConfig
    ? asyncPending ||
      asyncList.loadingState === "loading" ||
      asyncList.loadingState === "loadingMore" ||
      asyncList.loadingState === "filtering"
    : isLoadingFromProps;

  // Keep menu open when empty for async/custom options (required for creating custom options)
  const allowsEmptyMenu =
    asyncConfig || allowsCustomOptions ? true : allowsEmptyMenuFromProps;

  // Default empty state messages
  const asyncDefaultRenderEmptyState = useCallback(() => {
    // TODO: verify wording and styling for empty states
    if (isLoading) {
      return inputValue?.length
        ? `loading results for "${inputValue}"`
        : "loading results";
    }
    if (
      inputValue?.length &&
      asyncConfig?.minSearchLength &&
      inputValue.length >= asyncConfig.minSearchLength
    ) {
      return `no results for "${inputValue}"`;
    }
    if (asyncConfig?.minSearchLength) {
      return `enter at least ${asyncConfig?.minSearchLength} characters`;
    }
    return "type to search";
  }, [asyncConfig?.minSearchLength, isLoading, inputValue]);

  const customDefaultRenderEmptyState = useCallback(() => {
    // TODO: verify wording and styling for empty states
    if (isLoading) {
      return inputValue?.length
        ? `loading results for "${inputValue}"`
        : "loading results";
    }
    return `hit "enter" to create an option`;
  }, [isLoading, inputValue]);

  const defaultRenderEmptyState = allowsCustomOptions
    ? customDefaultRenderEmptyState
    : asyncConfig
      ? asyncDefaultRenderEmptyState
      : undefined;

  const renderEmptyState = defaultRenderEmptyState ?? renderEmptyStateFromProps;

  // ============================================================
  // ITEMS MERGING
  // ============================================================
  // Merge items from all sources: async/static + custom created + selected (async multi-select)
  const items = useMemo(() => {
    const baseItems = asyncConfig ? Array.from(asyncList.items) : props.items;
    const baseItemsArray = baseItems ? Array.from(baseItems) : [];

    // Deduplicate: add custom items not in base
    const existingKeys = new Set(baseItemsArray.map((item) => getKey(item)));
    const customItemsToAdd = customCreatedItems.filter(
      (item) => !existingKeys.has(getKey(item))
    );
    let mergedItems = [...customItemsToAdd, ...baseItemsArray];

    // Async multi-select: add selected items not in current results
    if (
      asyncConfig &&
      selectionMode === "multiple" &&
      asyncSelectedItems.length > 0
    ) {
      const mergedKeys = new Set(mergedItems.map((item) => getKey(item)));
      const selectedItemsToAdd = asyncSelectedItems.filter(
        (item) => !mergedKeys.has(getKey(item))
      );
      mergedItems = [...selectedItemsToAdd, ...mergedItems];
    }

    return mergedItems;
  }, [
    asyncConfig,
    asyncList.items,
    props.items,
    customCreatedItems,
    asyncSelectedItems,
    selectionMode,
    getKey,
  ]);

  // Context value: static configuration and refs shared with all children
  const rootContextValue: ComboBoxRootContextValue<T> = useMemo(
    () => ({
      selectionMode,
      size,
      getKey,
      getTextValue,
      leadingElement,
      triggerRef,
      inputRef,
      isLoading,
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
      inputRef,
      isLoading,
      size,
      isDisabled,
      isRequired,
      isInvalid,
      isReadOnly,
    ]
  );

  // Transform items to add id and textValue properties using getKey and getTextValue
  // This ensures CollectionBuilder can determine keys and the filter can work properly
  const itemsWithMetadata = useMemo(() => {
    if (!items) return undefined;
    return Array.from(items).map((item) => {
      const hasId = "id" in item;
      const hasTextValue = "textValue" in item;

      // If item already has both properties, don't transform it
      if (hasId && hasTextValue) return item;

      // Add missing properties using getKey and getTextValue
      return {
        ...item,
        ...(hasId ? {} : { id: getKey(item) }),
        ...(hasTextValue ? {} : { textValue: getTextValue(item) }),
      };
    });
  }, [items, getKey, getTextValue]);

  // Build content for CollectionBuilder
  //
  // CRITICAL: This content is built in the OUTER component (ComboBoxRoot) and memoized.
  // If built in the inner component, the collection would be rebuilt every time the menu
  // toggles open/closed, causing:
  // - Loss of virtual focus state when menu reopens
  // - Performance issues from re-parsing JSX tree on every toggle
  // - TagGroup losing track of selected items between renders
  //
  // By building here and passing the stable collection down, we ensure:
  // - Collection persists across menu open/close cycles
  // - Virtual focus state is maintained
  // - Selected items in TagGroup remain stable
  //
  // React Aria's CollectionBuilder parses this JSX tree into a Collection object
  // that both ListBox (options menu) and TagGroup (selected tags) can consume.
  const content = useMemo(
    () => (
      <ComboBoxRootContext.Provider
        value={rootContextValue as ComboBoxRootContextValue<object>}
      >
        <ListBoxContext.Provider value={{ items: itemsWithMetadata }}>
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
    [
      children,
      isDisabled,
      isInvalid,
      isRequired,
      itemsWithMetadata,
      rootContextValue,
    ]
  );

  return (
    <Provider
      // clear child contexts so that parent wrappers do not affect this component
      values={[
        [ButtonContext, {}],
        [InputContext, {}],
        [TagGroupContext, {}],
      ]}
    >
      <ComboBoxRootContext.Provider
        value={rootContextValue as ComboBoxRootContextValue<object>}
      >
        <ComboBoxRootSlot
          ref={ref}
          {...recipeProps}
          {...styleProps}
          size={size}
          data-disabled={isDisabled}
          data-invalid={isInvalid}
          data-required={isRequired}
          data-readonly={isReadOnly}
          data-open={props.isOpen}
          role="group"
        >
          {/* CollectionBuilder parses 'content' JSX into a Collection object */}
          <CollectionBuilder content={content}>
            {(collection) => (
              // Pass the built collection to ComboBoxRootInner which handles all behavior
              <ComboBoxRootInner<T>
                {...functionalProps}
                size={size}
                filter={filter}
                selectionMode={selectionMode}
                inputValue={inputValue}
                onInputChange={onInputChange}
                getKey={getKey}
                getTextValue={getTextValue}
                allowsEmptyMenu={allowsEmptyMenu}
                renderEmptyState={renderEmptyState}
                isDisabled={isDisabled}
                isRequired={isRequired}
                isInvalid={isInvalid}
                isReadOnly={isReadOnly}
                collection={collection as unknown as Collection<Node<T>>}
                allowsCustomOptions={allowsCustomOptions}
                asyncConfig={asyncConfig}
                onAsyncSelectedItemsChange={
                  asyncConfig && selectionMode === "multiple"
                    ? setAsyncSelectedItems
                    : undefined
                }
                onAddCustomItem={setCustomCreatedItems}
                onAddAsyncSelectedItem={setAsyncSelectedItems}
              />
            )}
          </CollectionBuilder>
        </ComboBoxRootSlot>
      </ComboBoxRootContext.Provider>
    </Provider>
  );
}

ComboBoxRoot.displayName = "ComboBox.Root";

type ComboBoxRootInnerProps<T extends object> = ComboBoxRootProps<T> & {
  collection: Collection<Node<T>>;
  asyncConfig?: ComboBoxAsyncConfig<T>;
  onAsyncSelectedItemsChange?: (items: T[]) => void;
  onAddCustomItem?: React.Dispatch<React.SetStateAction<T[]>>;
  onAddAsyncSelectedItem?: React.Dispatch<React.SetStateAction<T[]>>;
};

/**
 * Inner component that receives the built collection and renders the ComboBox
 */
const ComboBoxRootInner = <T extends object>(
  props: ComboBoxRootInnerProps<T> & {}
) => {
  const msg = useLocalizedStringFormatter(comboboxMessagesStrings);
  const {
    selectionMode = "single",
    items,
    collection,
    getKey = defaultGetKey,
    children,
    selectedKeys: selectedKeysFromProps = [],
    onSelectionChange,
    disabledKeys,
    inputValue: inputValueFromProps = "",
    onInputChange,
    filter,
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
    "aria-describedby": ariaDescribedBy,
    isDisabled = false,
    isRequired = false,
    isInvalid = false,
    isReadOnly = false,
    shouldFocusWrap = true,
    autoFocus = false,
    name,
    formValue,
    validationBehavior = "aria",
    form,
    validate,
    isLoading,
    asyncConfig,
    onAsyncSelectedItemsChange,
    onAddCustomItem,
    onAddAsyncSelectedItem,
  } = props;

  // ============================================================
  // REFS & IDS
  // ============================================================

  // Get refs from context (shared with outer component)
  const { triggerRef, inputRef } = useComboBoxRootContext();

  // Stable IDs for ARIA relationships
  const listboxId = useId();
  const tagGroupId = useId();

  // DOM refs for scroll positioning and focus management
  const listBoxRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // ============================================================
  // STATE MANAGEMENT
  // ============================================================
  // Controlled/uncontrolled pattern:
  // - Controlled: Parent manages via props (selectedKeys, inputValue, isOpen)
  // - Uncontrolled: Component manages with internal state + defaults

  // SELECTION STATE
  // Selection state (normalized to Set<Key> for consistency)
  const normalizedSelectedKeysFromProps = useMemo(
    () => normalizeSelectedKeys(selectedKeysFromProps),
    [selectedKeysFromProps]
  );

  const isSelectionControlled = Boolean(onSelectionChange);
  const [internalNormalizedSelectedKeys, setInternalSelectedKeys] = useState(
    normalizedSelectedKeysFromProps
  );
  const normalizedSelectedKeys = isSelectionControlled
    ? normalizedSelectedKeysFromProps
    : internalNormalizedSelectedKeys;

  // INPUT VALUE STATE
  // Items are managed in outer component (see ITEMS MERGING section above)

  // Input value state (controlled/uncontrolled)
  const isInputControlled = onInputChange !== undefined;

  const computeInitialInputValue = () => {
    if (inputValueFromProps) return inputValueFromProps;
    if (isInputControlled || selectionMode !== "single") return "";

    // Uncontrolled single-select: initialize from selected item text
    const selectedKeysArray = Array.from(normalizedSelectedKeys);
    if (selectedKeysArray.length === 0) return "";

    const selectedKey = selectedKeysArray[0];
    const selectedNode = collection.getItem(selectedKey);
    return selectedNode?.textValue ?? "";
  };

  const [internalInputValue, setInternalInputValue] = useState(
    computeInitialInputValue
  );
  const inputValue = isInputControlled
    ? inputValueFromProps
    : internalInputValue;

  const prevInputValueRef = useRef(inputValue);

  // Menu open/closed state
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);
  const isOpen = controlledIsOpen ?? internalIsOpen;

  // Focus strategy for menu opening (ArrowDown→first, ArrowUp→last)
  const [focusStrategy, setFocusStrategy] = useState<"first" | "last" | null>(
    null
  );

  // Unified setter for open state
  const setIsOpen = useCallback(
    (open: boolean) => {
      if (controlledIsOpen === undefined) {
        setInternalIsOpen(open);
      }
      onOpenChange?.(open);
    },
    [controlledIsOpen, onOpenChange]
  );

  // ============================================================
  // DERIVED STATE & MEMOIZATION
  // ============================================================

  // Filtered collection based on input value
  // Uses Collection.filter() to preserve navigation methods (getFirstKey, getLastKey, etc.)
  const filteredCollection = useMemo(() => {
    // No input: show all items
    if (inputValue.trim() === "") {
      return collection;
    }

    // Single-select UX: if input matches selected item exactly, show full list
    // Enables workflow: select item → click input → see all options (not just the selected one)
    if (selectionMode === "single") {
      const selectedKeys = Array.from(normalizedSelectedKeys);
      if (selectedKeys.length > 0) {
        const selectedKey = selectedKeys[0];
        const selectedNode = collection.getItem(selectedKey);

        if (selectedNode?.textValue === inputValue) {
          return collection;
        }
      }
    }

    // Custom filter: adapt user-provided filter to Collection.filter() API
    if (filter) {
      const allNodes = Array.from(collection);
      const filteredNodes = Array.from(filter(allNodes, inputValue));
      const filteredKeys = new Set(filteredNodes.map((node) => node.key));

      return (
        collection.filter?.((_nodeValue, node) => {
          return filteredKeys.has(node.key);
        }) ?? collection
      );
    }

    // Default: case-insensitive substring match
    const lowerInput = inputValue.toLowerCase();
    return (
      collection.filter?.((nodeValue) => {
        return nodeValue.toLowerCase().includes(lowerInput);
      }) ?? collection
    );
  }, [collection, inputValue, filter, selectionMode, normalizedSelectedKeys]);

  // Selected items for TagGroup (multi-select only)
  // Extract actual item objects from keys to pass to TagGroup component
  const selectedItemsFromState = useMemo(
    () =>
      selectionMode === "multiple"
        ? Array.from(normalizedSelectedKeys)
            .map((key) => collection.getItem(key)?.value)
            .filter((item): item is T => item !== undefined)
        : [],
    [selectionMode, normalizedSelectedKeys, collection]
  );

  // Menu width state (set via ResizeObserver effect below)
  const [triggerWidth, setTriggerWidth] = useState<string | null>(null);

  // ============================================================
  // EVENT HANDLERS
  // ============================================================

  // Toggle menu open/closed (uses functional update to avoid stale closures)
  const toggleOpen = useCallback(() => {
    const willOpen =
      controlledIsOpen === undefined ? !isOpen : !controlledIsOpen;

    if (controlledIsOpen === undefined) {
      setInternalIsOpen((prev) => !prev);
    } else {
      onOpenChange?.(!controlledIsOpen);
    }

    // When opening: focus input and set focus to first item
    if (willOpen) {
      inputRef.current?.focus();
      setFocusStrategy("first");
    }
  }, [controlledIsOpen, isOpen, onOpenChange, inputRef]);

  // Input change handler (opens menu when menuTrigger="input")
  const handleInputChange = useCallback(
    (value: string) => {
      if (!isInputControlled) {
        setInternalInputValue(value);
      }
      onInputChange?.(value);

      // Open menu on input change (when menuTrigger="input")
      if (menuTrigger === "input" && value !== prevInputValueRef.current) {
        setIsOpen(true);
      }

      prevInputValueRef.current = value;
    },
    [isInputControlled, onInputChange, menuTrigger, setIsOpen]
  );

  // Selection change handler
  // Multi-select: toggle behavior (click to add/remove from selection)
  // Single-select: replace selection and close menu
  const handleSelectionChange = useCallback(
    (keys: Selection, previousKeys?: Set<Key>) => {
      // Convert "all" to actual Set of keys
      let actualKeys =
        keys === "all"
          ? new Set(Array.from(collection).map((node) => node.key))
          : keys;

      const comparisonKeys = previousKeys ?? normalizedSelectedKeys;

      // Multi-select toggle: React Aria sends single-key Set on click,
      // we toggle that key in/out instead of replacing entire selection
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

        const newSelection = new Set(comparisonKeys);
        if (!isAlreadySelected) {
          newSelection.add(clickedKey);
        } else {
          newSelection.delete(clickedKey);
        }
        actualKeys = newSelection;
      }

      // Convert Set<Key> back to array for callback
      const denormalized = denormalizeSelectedKeys(actualKeys);

      if (onSelectionChange) {
        onSelectionChange(denormalized);
      } else {
        setInternalSelectedKeys(actualKeys);
      }

      // Async multi-select: cache selected items to persist across searches
      if (
        asyncConfig &&
        selectionMode === "multiple" &&
        onAsyncSelectedItemsChange
      ) {
        const selectedItems = Array.from(actualKeys)
          .map((key) => collection.getItem(key)?.value)
          .filter((item): item is T => item !== undefined);
        onAsyncSelectedItemsChange(selectedItems);
      }

      // Single-select: sync input value with selection and close menu
      if (selectionMode === "single") {
        const selectedKey = Array.from(actualKeys)[0];

        if (selectedKey !== null) {
          const selectedNode = collection.getItem(selectedKey);
          const textValue = selectedNode?.textValue ?? "";

          // Update input value
          if (!isInputControlled) {
            setInternalInputValue(textValue);
            prevInputValueRef.current = textValue;
          }
          onInputChange?.(textValue);
        }

        // Close menu if shouldCloseOnSelect=true
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
      isInputControlled,
      asyncConfig,
      onAsyncSelectedItemsChange,
    ]
  );

  // React Aria's useListState provides keyboard navigation and selection management
  const state = useListState<T>({
    selectionMode,
    collection: filteredCollection,
    selectedKeys: normalizedSelectedKeys,
    onSelectionChange: handleSelectionChange,
    disabledKeys,
  });

  // Clear all selections (and input value)
  // Menu remains open after clearing to allow continued selection without reopening
  const clearSelection = useCallback(() => {
    // Clear selection through handleSelectionChange for proper state management
    handleSelectionChange(new Set());

    // Explicitly clear input value for both modes
    // Multi-select: clears the filter text
    // Single-select: handleSelectionChange handles this via effect, but we set it explicitly for consistency
    if (!isInputControlled) {
      setInternalInputValue("");
      prevInputValueRef.current = "";
    }
    onInputChange?.("");

    // Keep menu open after clearing (both single and multi-select)
    // This allows user to continue selecting without manually reopening
    setIsOpen(true);

    // Refocus the input field to maintain context
    // Use requestAnimationFrame to ensure DOM updates complete first
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, [
    handleSelectionChange,
    isInputControlled,
    onInputChange,
    setIsOpen,
    inputRef,
  ]);

  // Handle custom option creation (adds item and selects it)
  const handleCustomOptionCreated = useCallback(
    (newItem: T) => {
      // Add to custom items in outer component
      onAddCustomItem?.((prev) => [...prev, newItem]);

      // Also cache in async multi-select mode
      if (asyncConfig && selectionMode === "multiple") {
        onAddAsyncSelectedItem?.((prev) => [...prev, newItem]);
      }

      // Select the new item
      const newKey = getKey(newItem);
      const currentKeys = normalizedSelectedKeys;

      if (selectionMode === "single") {
        handleSelectionChange(new Set([newKey]), currentKeys);
      } else {
        const newSelection = new Set(currentKeys);
        newSelection.add(newKey);
        handleSelectionChange(newSelection, currentKeys);
      }
    },
    [
      onAddCustomItem,
      asyncConfig,
      selectionMode,
      onAddAsyncSelectedItem,
      getKey,
      normalizedSelectedKeys,
      handleSelectionChange,
    ]
  );

  // Handle creating a new custom option from input value
  // Called when user presses Enter with no focused item (allowsCustomOptions=true)
  // Returns true if option was created successfully
  const handleCreateOption = useCallback((): boolean => {
    // Early exit: custom options disabled
    if (!allowsCustomOptions) return false;

    const trimmedInput = inputValue.trim();
    // Early exit: empty input
    if (!trimmedInput) return false;

    // Check if option already exists in the UNFILTERED collection (not state.collection which is filtered)
    // This prevents duplicates even when the current filter hides the existing option
    const matchesExisting = Array.from(collection).some(
      (node) => node.textValue?.toLowerCase() === trimmedInput.toLowerCase()
    );
    if (matchesExisting) {
      return false;
    }

    // Check custom validation if provided
    if (isValidNewOption && !isValidNewOption(trimmedInput)) {
      return false;
    }

    // Create the new item using user-provided factory function
    const newItem = getNewOptionData(trimmedInput);

    // Notify outer component to add to custom items and handle selection internally
    handleCustomOptionCreated(newItem);

    // Clear input for multi-select, set to created text for single-select
    // Note: Selection happens in handleCustomOptionCreated
    if (selectionMode === "multiple") {
      // Multi-select: clear input after creating option
      if (!isInputControlled) {
        setInternalInputValue("");
        prevInputValueRef.current = "";
      }
      onInputChange?.("");
    } else {
      // Single-select: explicitly set input to the created option's text
      // We must set it here because handleSelectionChange cannot find the item
      // in the collection yet (the state update hasn't triggered a re-render,
      // so the collection hasn't been rebuilt to include the new item)
      if (!isInputControlled) {
        setInternalInputValue(trimmedInput);
        prevInputValueRef.current = trimmedInput;
      }
      onInputChange?.(trimmedInput);
    }

    // Notify parent component
    onCreateOption?.(newItem);

    return true;
  }, [
    allowsCustomOptions,
    getNewOptionData,
    isValidNewOption,
    inputValue,
    collection,
    selectionMode,
    onInputChange,
    onCreateOption,
    handleCustomOptionCreated,
    isInputControlled,
    setInternalInputValue,
    prevInputValueRef,
  ]);

  // Remove keys (for tag removal in multi-select)
  const removeKey = useCallback(
    (keysToRemove: Set<Key>) => {
      if (isDisabled || isReadOnly) return;

      const currentKeys = normalizedSelectedKeys;
      const newKeys = new Set(currentKeys);
      keysToRemove.forEach((key) => newKeys.delete(key));

      // Pass currentKeys so handleSelectionChange detects this as removal
      handleSelectionChange(newKeys, currentKeys);

      // Focus input if all tags removed
      if (newKeys.size === 0) {
        inputRef.current?.focus();
      }
    },
    [
      normalizedSelectedKeys,
      handleSelectionChange,
      isDisabled,
      isReadOnly,
      inputRef,
    ]
  );

  // ============================================================
  // KEYBOARD NAVIGATION
  // ============================================================
  // Implements ARIA combobox keyboard interaction pattern
  // https://www.w3.org/WAI/ARIA/apg/patterns/combobox/

  // Handle all keyboard interactions in the input field
  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (!isOpen) {
            // Menu closed: open and focus first item
            setIsOpen(true);
            setFocusStrategy("first");
          } else {
            // Menu open: move focus to next item (or first if nothing focused)
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
            // Menu closed: open and focus last item
            setIsOpen(true);
            setFocusStrategy("last");
          } else {
            // Menu open: move focus to previous item (or last if nothing focused)
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
          // Three cases: focused item selection, custom option creation, or form submission
          if (isOpen && state.selectionManager.focusedKey) {
            // Case 1: Item is focused - select it
            e.preventDefault();
            const focusedKey = state.selectionManager.focusedKey;

            if (selectionMode === "multiple") {
              // Multi-select: toggle focused item in/out of selection
              const newSelection = new Set(normalizedSelectedKeys);
              if (newSelection.has(focusedKey)) {
                newSelection.delete(focusedKey);
              } else {
                newSelection.add(focusedKey);
              }
              handleSelectionChange(newSelection);
              // Keep focus on the same item for further toggling
            } else {
              // Single-select: replace selection and clear focus
              handleSelectionChange(new Set([focusedKey]));
              state.selectionManager.setFocusedKey(null);
            }
          } else if (
            isOpen &&
            !state.selectionManager.focusedKey &&
            allowsCustomOptions
          ) {
            // Case 2: No focused item but custom options enabled - create new option
            const wasCreated = handleCreateOption();
            if (wasCreated) {
              e.preventDefault(); // Only prevent default if option was created
            }
          }
          // Case 3: No focused key and no option created - allow form submission (don't preventDefault)
          break;

        case "Escape":
          if (isOpen) {
            // Close menu and clear focus
            e.preventDefault();
            setIsOpen(false);
            state.selectionManager.setFocusedKey(null);
            // TODO: Revert to last selected value in single-select mode
          }
          break;

        case "Home":
          if (isOpen) {
            // Jump to first item in list
            e.preventDefault();
            const firstKey = state.collection.getFirstKey();
            state.selectionManager.setFocusedKey(firstKey);
          }
          break;

        case "End":
          if (isOpen) {
            // Jump to last item in list
            e.preventDefault();
            const lastKey = state.collection.getLastKey();
            state.selectionManager.setFocusedKey(lastKey);
          }
          break;

        case "Backspace":
          // When input is empty, backspace acts as a "delete selection" shortcut
          if (inputValue === "") {
            const selectedKeys = Array.from(normalizedSelectedKeys);
            if (selectedKeys.length > 0) {
              e.preventDefault();
              if (selectionMode === "single") {
                // Single-select: clear the selection
                handleSelectionChange(new Set());
              } else {
                // Multi-select: remove the last selected item
                const newKeys = new Set(selectedKeys);
                newKeys.delete(selectedKeys[selectedKeys.length - 1]);
                handleSelectionChange(newKeys);
              }
            }
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
      selectionMode,
      inputValue,
      normalizedSelectedKeys,
      allowsCustomOptions,
      handleCreateOption,
    ]
  );

  // ============================================================
  // FOCUS HANDLERS
  // ============================================================

  // Open menu on focus (when menuTrigger="focus")
  // In single select mode with existing value, select all text so cursor goes to beginning
  // and next keypress replaces the value
  const handleFocus = useCallback(() => {
    if (menuTrigger === "focus" && !isDisabled && !isReadOnly) {
      setIsOpen(true);
    }

    // Single-select with existing value: select all text
    // This places cursor at beginning and makes next input replace the value
    if (selectionMode === "single" && inputValue && inputRef.current) {
      inputRef.current.select();
    }
  }, [
    menuTrigger,
    isDisabled,
    isReadOnly,
    setIsOpen,
    selectionMode,
    inputValue,
    inputRef,
  ]);

  // Close menu on blur (with delay to allow option clicks)
  const handleBlur = useCallback(
    (e: React.FocusEvent) => {
      if (!shouldCloseOnBlur) return;

      // Capture currentTarget (React reuses event objects)
      const comboboxRoot = e.currentTarget;

      // Delay closing to allow option clicks to fire first
      setTimeout(() => {
        const currentFocus = document.activeElement;
        if (!comboboxRoot.contains(currentFocus)) {
          setIsOpen(false);
        }
      }, 150);
    },
    [shouldCloseOnBlur, setIsOpen]
  );

  // ============================================================
  // EFFECTS
  // ============================================================

  const lastSelectedKeyRef = useRef<Key | null>(null);
  const lastNodeFoundRef = useRef<boolean>(false);

  // Auto-focus input on mount (when autoFocus=true)
  useEffect(() => {
    if (autoFocus && inputRef.current && !isDisabled) {
      inputRef.current.focus();
    }
  }, [autoFocus, isDisabled, inputRef]);

  // Notify parent of open state changes (uncontrolled mode)
  const prevIsOpenRef = useRef(isOpen);
  useEffect(() => {
    if (controlledIsOpen === undefined && prevIsOpenRef.current !== isOpen) {
      prevIsOpenRef.current = isOpen;
      onOpenChange?.(isOpen);
    }
  }, [isOpen, controlledIsOpen, onOpenChange]);

  // Sync input value with selected item (single-select only)
  useEffect(() => {
    if (selectionMode !== "single") return;

    const selectedKeys = Array.from(state.selectionManager.selectedKeys);
    const currentSelectedKey = selectedKeys.length > 0 ? selectedKeys[0] : null;

    const selectedNode =
      currentSelectedKey !== null
        ? state.collection.getItem(currentSelectedKey)
        : null;

    const nodeFound = selectedNode !== null;

    // Only skip if BOTH:
    // 1. Selection key hasn't changed
    // 2. AND we previously found the node (or there's no selection)
    if (
      currentSelectedKey === lastSelectedKeyRef.current &&
      (lastNodeFoundRef.current || currentSelectedKey === null)
    ) {
      return;
    }

    lastSelectedKeyRef.current = currentSelectedKey;
    lastNodeFoundRef.current = nodeFound;

    // If the selected item is not in the collection yet, it might be a newly created custom option
    // In that case, keep the current input value instead of clearing it
    if (currentSelectedKey !== null && !selectedNode) {
      // Item not in collection yet (likely a just-created custom option)
      // Don't overwrite the input value - it was already set correctly in handleCreateOption
      return;
    }

    const itemText = selectedNode?.textValue ?? "";

    // Update input value (respecting controlled/uncontrolled pattern)
    if (!isInputControlled) {
      // Uncontrolled: update internal state directly
      setInternalInputValue(itemText);
      prevInputValueRef.current = itemText;
    } else {
      // Controlled: notify parent via callback
      onInputChange?.(itemText);
    }
  }, [
    selectionMode,
    state.selectionManager.selectedKeys,
    state.collection,
    isInputControlled,
    onInputChange,
  ]);

  // Effect: Apply focus strategy when menu opens
  // Focus strategy determines whether to focus first or last item
  // Set by ArrowDown (first) vs ArrowUp (last) keyboard shortcuts
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

  // Effect: Manage React Aria's focus mode when menu opens/closes
  // Focus mode enables virtual focus (aria-activedescendant) for keyboard navigation
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
  // Prevents closing menu before initial collection build completes
  const collectionPopulatedRef = useRef(false);
  if (state.collection.size > 0) {
    collectionPopulatedRef.current = true;
  }

  // Effect: Auto-close menu when no items match filter
  // Replicates React Aria's useComboBoxState behavior
  useEffect(() => {
    // Only close if menu is currently open and allowsEmptyMenu is false
    if (!isOpen || allowsEmptyMenu) return;

    // Don't close if currently loading async data
    if (isLoading) return;

    // Only check for empty collection if it has been populated before
    // This prevents closing the menu before CollectionBuilder finishes parsing children
    if (!collectionPopulatedRef.current) return;

    // Check if the collection has any items
    const hasItems = state.collection.size > 0;

    // Close menu if no items match the filter
    if (!hasItems) {
      setIsOpen(false);
    }
  }, [
    isOpen,
    allowsEmptyMenu,
    isLoading,
    state.collection.size,
    setIsOpen,
    inputValue,
  ]);

  // Effect: Sync menu width with trigger width using ResizeObserver
  // Ensures menu stays aligned and properly sized when trigger resizes
  useEffect(() => {
    const triggerElement = triggerRef.current;
    if (!triggerElement) return;

    // Measure and update trigger width
    const updateTriggerWidth = () => {
      const width = triggerElement.offsetWidth;
      setTriggerWidth(`${width}px`);
    };

    // Set initial width
    updateTriggerWidth();

    // Watch for resize events
    const resizeObserver = new ResizeObserver(updateTriggerWidth);
    resizeObserver.observe(triggerElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [triggerRef]);

  // ============================================================
  // CONTEXT PROVIDERS
  // ============================================================
  // React Aria's Provider component distributes props to child components via context
  // Each context value configures a specific part of the ComboBox (Input, ListBox, Popover, etc.)

  const contextValues = [
    // InputContext: Props for ComboBox.Input component
    // Configures the input field with ARIA attributes, event handlers, and validation
    [
      InputContext,
      {
        ref: inputRef,
        role: "combobox" as const, // ARIA role for autocomplete input
        "aria-autocomplete": "list" as const, // Indicates suggestions are in a list
        "aria-controls":
          selectionMode === "multiple"
            ? `${tagGroupId} ${listboxId}` // Multi-select: controls both tags and listbox
            : listboxId, // Single-select: controls only listbox
        "aria-expanded": isOpen, // Announces menu open/closed state
        "aria-activedescendant": state.selectionManager.focusedKey
          ? `${listboxId}-option-${state.selectionManager.focusedKey}` // Virtual focus: announces focused option
          : undefined,
        "aria-describedby":
          selectionMode === "multiple"
            ? `${tagGroupId} ${ariaDescribedBy ?? ""}` // Multi-select: references tag group for context
            : ariaDescribedBy,
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
        name,
        form,
        validationbehavior: validationBehavior,
        validate,
      },
    ],

    // TagGroupContext: Props for ComboBox.TagGroup component (multi-select only)
    // Renders selected items as removable tags
    [
      TagGroupContext,
      {
        id: tagGroupId,
        "aria-label": msg.format("selectedValues"),
        items: selectedItemsFromState, // Selected items to display as tags
        onRemove: removeKey, // Handle tag removal
      },
    ],

    // ButtonContext: Props for toggle and clear buttons
    // Uses "slots" pattern to configure multiple buttons via single context
    [
      ButtonContext,
      {
        slots: {
          toggle: {
            onPress: toggleOpen,
            "aria-label": msg.format("toggleOptions"),
            isDisabled: isDisabled || isReadOnly,
            isPressed: isOpen, // Visual indicator that menu is open
          },
          clear: {
            onPress: clearSelection,
            "aria-label": msg.format("clearSelection"),
            style:
              normalizedSelectedKeys.size > 0 ? undefined : { display: "none" },
            isDisabled:
              isDisabled ||
              isReadOnly ||
              state.selectionManager.selectedKeys.size === 0, // Disabled when nothing selected
          },
        },
      },
    ],

    // PopoverContext: Props for ComboBox.Popover component
    // Controls menu positioning, portal rendering, and open/close behavior
    [
      PopoverContext,
      {
        isOpen: isOpen,
        // Allow React Aria to close the popover (e.g., on scroll, click outside)
        // but we still control opening via toggleOpen/setIsOpen
        onOpenChange: (open: boolean) => {
          if (!open) {
            setIsOpen(false);
          }
        },
        ref: popoverRef,
        triggerRef: triggerRef, // Popover positions relative to this element
        scrollRef: listBoxRef, // Enables scroll-into-view for keyboard navigation
        isNonModal: true, // Non-modal: doesn't trap focus, allows interaction outside
        trigger: "ComboBox", // Identifies this as a combobox popover (not tooltip, dialog, etc.)
        placement: "bottom start", // Default placement below trigger, aligned to start
        style: {
          "--nimbus-combobox-trigger-width": triggerWidth,
        } as React.CSSProperties, // CSS custom property for menu width
        clearContexts: [
          // Clear these contexts so popover content doesn't inherit combobox contexts
          LabelContext,
          ButtonContext,
          InputContext,
          GroupContext,
          TextContext,
        ],
      },
    ],

    // SelectableCollectionContext: Enables virtual focus for keyboard navigation
    // Virtual focus uses aria-activedescendant instead of moving browser focus
    [SelectableCollectionContext, { shouldUseVirtualFocus: true }],

    // ListBoxContext: Props for ComboBox.ListBox component
    // Configures the option list with items, ARIA attributes, and behaviors
    [
      ListBoxContext,
      {
        items, // Items to render (merged from outer component)
        id: listboxId, // ID referenced by aria-controls on input
        ref: listBoxRef, // Ref for scroll positioning
        renderEmptyState, // Custom empty state renderer
        shouldFocusWrap, // Whether to wrap focus from last to first item
        "aria-label": msg.format("options"),
      },
    ],

    // ListStateContext: React Aria's collection state for managing selection and focus
    [ListStateContext, state],
  ];

  // ============================================================
  // RENDER
  // ============================================================
  // Wrap children in React Aria's Provider to distribute context values
  // Provider passes each context to matching child components (Input, ListBox, Popover, etc.)

  return (
    <Provider
      // TypeScript cannot properly infer the complex heterogeneous tuple type required by Provider.
      // The runtime behavior is correct - each context receives its properly typed value.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      values={contextValues as any}
    >
      {/* Hidden input for form submission */}
      {/* Serializes selection state as form data when ComboBox is inside a <form> */}
      <ComboBoxHiddenInput
        name={name}
        form={form}
        selectedKeys={normalizedSelectedKeys}
        selectionMode={selectionMode}
        formValue={formValue}
        allowsCustomOptions={allowsCustomOptions}
        collection={state.collection}
        inputValue={inputValue}
      />
      {/* Render children (ComboBox.Input, ComboBox.ListBox, etc.) */}
      {/* Type assertion needed - CollectionChildren<T> is assignable to ReactNode at runtime */}
      {children as React.ReactNode}
    </Provider>
  );
};
