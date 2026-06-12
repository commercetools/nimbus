import {
  useCallback,
  useContext,
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
  type Selection,
} from "react-aria-components";
import {
  Autocomplete,
  AutocompleteStateContext,
  FieldInputContext,
  SelectableCollectionContext,
} from "react-aria-components/Autocomplete";
import type { AutocompleteState } from "react-aria-components/Autocomplete";
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
 * Internally uses RAC Autocomplete for filtering and virtual focus management.
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
                isReadOnly,
                defaultChildren: null,
              } as T & {
                defaultChildren: null;
                isOpen: boolean;
                isDisabled: boolean;
                isInvalid: boolean;
                isRequired: boolean;
                isReadOnly: boolean;
              })
            : children}
        </ListBoxContext.Provider>
      </ComboBoxRootContext.Provider>
    ),
    [
      children,
      isDisabled,
      isInvalid,
      isReadOnly,
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
 * Inner component that receives the built collection and manages ComboBox behavior.
 *
 * Wraps its output in RAC Autocomplete for filtering and virtual focus management,
 * then uses AutocompleteBridge to merge Autocomplete's FieldInputContext into our
 * InputContext for the existing ComboBox.Input to consume.
 */
const ComboBoxRootInner = <T extends object>(
  props: ComboBoxRootInnerProps<T>
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

  // SELECTION STATE
  const selectedKeysFingerprint = Array.isArray(selectedKeysFromProps)
    ? selectedKeysFromProps.join("\0")
    : String(selectedKeysFromProps ?? "");
  const normalizedSelectedKeysFromProps = useMemo(
    () => normalizeSelectedKeys(selectedKeysFromProps),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedKeysFingerprint]
  );

  const isSelectionControlled = Boolean(onSelectionChange);
  const [internalNormalizedSelectedKeys, setInternalSelectedKeys] = useState(
    normalizedSelectedKeysFromProps
  );
  const normalizedSelectedKeys = isSelectionControlled
    ? normalizedSelectedKeysFromProps
    : internalNormalizedSelectedKeys;

  // INPUT VALUE STATE
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
  // Used when the menu opens from a keyboard shortcut while the collection
  // is not yet mounted (Autocomplete can't forward the key event to it).
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

  // Snapshot the selected item's text so filter doesn't depend on
  // the full normalizedSelectedKeys Set (which changes on every selection toggle).
  const singleSelectedTextValue = useMemo(() => {
    if (selectionMode !== "single") return undefined;
    const keys = Array.from(normalizedSelectedKeys);
    if (keys.length === 0) return undefined;
    return collection.getItem(keys[0])?.textValue;
  }, [selectionMode, normalizedSelectedKeys, collection]);

  // ============================================================
  // AUTOCOMPLETE FILTER ADAPTATION
  // ============================================================
  // RAC Autocomplete expects a per-node boolean filter:
  //   (textValue: string, inputValue: string, node: Node<T>) => boolean
  //
  // The ComboBox public API accepts a collection-level filter:
  //   (nodes: Iterable<Node<T>>, inputValue: string) => Iterable<Node<T>>
  //
  // We adapt between these two signatures.

  // For custom (collection-level) filters, pre-compute the filtered key set
  // so the per-node adapter is a simple Set lookup.
  const filteredKeysSet = useMemo(() => {
    if (!filter) return null;
    if (inputValue.trim() === "") return null; // Show all
    if (selectionMode === "single" && singleSelectedTextValue === inputValue)
      return null;

    const allNodes = Array.from(collection);
    const filteredNodes = Array.from(filter(allNodes, inputValue));
    return new Set(filteredNodes.map((n) => n.key));
  }, [filter, collection, inputValue, selectionMode, singleSelectedTextValue]);

  // The filter function passed to RAC Autocomplete.
  // When no custom filter is provided, use default case-insensitive substring match.
  // When a custom filter is provided, use the pre-computed key set.
  //
  // For async mode, no client-side filtering is needed since the API handles it.
  const autocompleteFilter = useCallback(
    (textValue: string, _inputValue: string, node: Node<T>): boolean => {
      // Async mode: don't filter client-side (the API handles filtering)
      if (asyncConfig) return true;

      // No input: show all items
      if (_inputValue.trim() === "") return true;

      // Single-select UX: if input matches selected item exactly, show full list
      if (
        selectionMode === "single" &&
        singleSelectedTextValue === _inputValue
      ) {
        return true;
      }

      // Custom filter: lookup in pre-computed set
      if (filteredKeysSet) {
        return filteredKeysSet.has(node.key);
      }

      // Default: case-insensitive substring match
      return textValue.toLowerCase().includes(_inputValue.toLowerCase());
    },
    [asyncConfig, selectionMode, singleSelectedTextValue, filteredKeysSet]
  );

  // Compute filtered count for auto-close behavior.
  // Since Autocomplete handles filtering internally and we can't easily read the
  // filtered collection from outside, we compute it ourselves.
  const filteredCount = useMemo(() => {
    if (asyncConfig) return collection.size; // Async: always trust the API results
    if (inputValue.trim() === "") return collection.size;
    if (selectionMode === "single" && singleSelectedTextValue === inputValue)
      return collection.size;

    if (filteredKeysSet) return filteredKeysSet.size;

    // Default filter count
    const lowerInput = inputValue.toLowerCase();
    let count = 0;
    for (const node of collection) {
      if ((node.textValue ?? "").toLowerCase().includes(lowerInput)) count++;
    }
    return count;
  }, [
    asyncConfig,
    collection,
    inputValue,
    selectionMode,
    singleSelectedTextValue,
    filteredKeysSet,
  ]);

  // Selected items for TagGroup (multi-select only)
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

  // Toggle menu open/closed
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

  // Scroll the content area to the bottom so the input stays visible
  const scrollContentToBottom = useCallback(() => {
    const content = triggerRef.current?.querySelector(
      '[class*="nimbus-combobox__content"]'
    );
    if (content) {
      requestAnimationFrame(() => {
        content.scrollTop = content.scrollHeight;
      });
    }
  }, [triggerRef]);

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

      // Multi-select: scroll content to bottom when adding items so input stays visible
      if (
        selectionMode === "multiple" &&
        actualKeys.size > comparisonKeys.size
      ) {
        scrollContentToBottom();
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
      scrollContentToBottom,
    ]
  );

  // React Aria's useListState provides selection management.
  // Note: We pass the FULL (unfiltered) collection here. Filtering is handled
  // by RAC Autocomplete via SelectableCollectionContext.filter, which the ListBox
  // applies internally. The state.collection here is the unfiltered collection,
  // used for looking up selected items, hidden input, etc.
  const state = useListState<T>({
    selectionMode,
    collection,
    selectedKeys: normalizedSelectedKeys,
    onSelectionChange: handleSelectionChange,
    disabledKeys,
  });

  // Clear all selections (and input value)
  const clearSelection = useCallback(() => {
    handleSelectionChange(new Set());

    if (!isInputControlled) {
      setInternalInputValue("");
      prevInputValueRef.current = "";
    }
    onInputChange?.("");

    // Keep menu open after clearing
    setIsOpen(true);

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
      onAddCustomItem?.((prev) => [...prev, newItem]);

      if (asyncConfig && selectionMode === "multiple") {
        onAddAsyncSelectedItem?.((prev) => [...prev, newItem]);
      }

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
  const handleCreateOption = useCallback((): boolean => {
    if (!allowsCustomOptions) return false;

    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return false;

    // Check if option already exists in the UNFILTERED collection
    const matchesExisting = Array.from(collection).some(
      (node) => node.textValue?.toLowerCase() === trimmedInput.toLowerCase()
    );
    if (matchesExisting) return false;

    if (isValidNewOption && !isValidNewOption(trimmedInput)) return false;

    const newItem = getNewOptionData(trimmedInput);
    handleCustomOptionCreated(newItem);

    if (selectionMode === "multiple") {
      if (!isInputControlled) {
        setInternalInputValue("");
        prevInputValueRef.current = "";
      }
      onInputChange?.("");
    } else {
      if (!isInputControlled) {
        setInternalInputValue(trimmedInput);
        prevInputValueRef.current = trimmedInput;
      }
      onInputChange?.(trimmedInput);
    }

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

      handleSelectionChange(newKeys, currentKeys);

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
  // KEYBOARD HANDLING (CUSTOM — complements Autocomplete)
  // ============================================================
  // Autocomplete handles: ArrowUp/Down navigation, Home/End, Enter (select focused item)
  // We handle: Escape (close popover), Backspace (tag removal), Enter (custom options),
  //            ArrowDown/Up when menu is closed (open menu)

  const handleCustomKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "ArrowDown":
          if (!isOpen) {
            // Menu closed: open and focus first item via effect
            e.preventDefault();
            setIsOpen(true);
            setFocusStrategy("first");
          }
          // When menu is open, Autocomplete handles ArrowDown navigation
          break;

        case "ArrowUp":
          if (!isOpen) {
            // Menu closed: open and focus last item via effect
            e.preventDefault();
            setIsOpen(true);
            setFocusStrategy("last");
          }
          // When menu is open, Autocomplete handles ArrowUp navigation
          break;

        case "Enter":
          // We handle Enter ourselves rather than delegating to Autocomplete because
          // our programmatic focusedKey (set via effects) isn't synced to
          // Autocomplete's focusedNodeId, so Autocomplete wouldn't know which item
          // to select.
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
              e.preventDefault();
            }
          }
          // Case 3: No focused key and no option created - allow form submission
          break;

        case "Escape":
          if (isOpen) {
            e.preventDefault();
            setIsOpen(false);
            state.selectionManager.setFocusedKey(null);
          }
          break;

        case "Backspace":
          // When input is empty, backspace removes the last selected tag
          if (inputValue === "") {
            const selectedKeys = Array.from(normalizedSelectedKeys);
            if (selectedKeys.length > 0) {
              e.preventDefault();
              if (selectionMode === "single") {
                handleSelectionChange(new Set());
              } else {
                const newKeys = new Set(selectedKeys);
                newKeys.delete(selectedKeys[selectedKeys.length - 1]);
                handleSelectionChange(newKeys);
              }
            }
          }
          break;
      }
    },
    [
      isOpen,
      setIsOpen,
      setFocusStrategy,
      state.selectionManager,
      allowsCustomOptions,
      handleCreateOption,
      inputValue,
      normalizedSelectedKeys,
      selectionMode,
      handleSelectionChange,
    ]
  );

  // ============================================================
  // FOCUS HANDLERS
  // ============================================================

  const handleFocus = useCallback(() => {
    if (menuTrigger === "focus" && !isDisabled && !isReadOnly) {
      setIsOpen(true);
    }

    // Single-select with existing value: select all text
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

  const handleBlur = useCallback(() => {
    if (!shouldCloseOnBlur) return;

    setTimeout(() => {
      const currentFocus = document.activeElement;
      const inTrigger = triggerRef.current?.contains(currentFocus);
      const inPopover = popoverRef.current?.contains(currentFocus);
      if (!inTrigger && !inPopover) {
        setIsOpen(false);
      }
    }, 150);
  }, [shouldCloseOnBlur, setIsOpen, triggerRef, popoverRef]);

  // ============================================================
  // EFFECTS
  // ============================================================

  const lastSelectedKeyRef = useRef<Key | null>(null);
  const lastNodeFoundRef = useRef<boolean>(false);

  // Auto-focus input on mount
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

    if (
      currentSelectedKey === lastSelectedKeyRef.current &&
      (lastNodeFoundRef.current || currentSelectedKey === null)
    ) {
      return;
    }

    lastSelectedKeyRef.current = currentSelectedKey;
    lastNodeFoundRef.current = nodeFound;

    if (currentSelectedKey !== null && !selectedNode) {
      return;
    }

    const itemText = selectedNode?.textValue ?? "";

    if (!isInputControlled) {
      setInternalInputValue(itemText);
      prevInputValueRef.current = itemText;
    } else {
      onInputChange?.(itemText);
    }
  }, [
    selectionMode,
    state.selectionManager.selectedKeys,
    state.collection,
    isInputControlled,
    onInputChange,
  ]);

  // Manage React Aria's focus mode when menu opens/closes
  useEffect(() => {
    if (isOpen) {
      state.selectionManager.setFocused(true);
    } else {
      state.selectionManager.setFocused(false);
      state.selectionManager.setFocusedKey(null);
    }
  }, [isOpen, state.selectionManager]);

  // Apply focus strategy when menu opens from keyboard (ArrowDown→first, ArrowUp→last).
  // This is needed because when the menu is closed, the collection DOM isn't mounted yet
  // and Autocomplete can't dispatch keyboard events to it. We use the selection manager
  // directly to set the focused key after the menu opens and the collection is available.
  useEffect(() => {
    if (isOpen && focusStrategy) {
      const key =
        focusStrategy === "first"
          ? state.collection.getFirstKey()
          : state.collection.getLastKey();

      state.selectionManager.setFocusedKey(key ?? null);
      setFocusStrategy(null);
    }
  }, [isOpen, focusStrategy, state.collection, state.selectionManager]);

  // Track if collection has been populated at least once
  const collectionPopulatedRef = useRef(false);
  useEffect(() => {
    if (collection.size > 0) {
      collectionPopulatedRef.current = true;
    }
  }, [collection.size]);

  // Auto-close menu when no items match filter
  useEffect(() => {
    if (!isOpen || allowsEmptyMenu) return;
    if (isLoading) return;
    if (!collectionPopulatedRef.current) return;

    if (filteredCount === 0) {
      setIsOpen(false);
    }
  }, [
    isOpen,
    allowsEmptyMenu,
    isLoading,
    filteredCount,
    setIsOpen,
    inputValue,
  ]);

  // Sync menu width with trigger width using ResizeObserver
  useEffect(() => {
    const triggerElement = triggerRef.current;
    if (!triggerElement) return;

    const updateTriggerWidth = () => {
      const width = triggerElement.offsetWidth;
      setTriggerWidth(`${width}px`);
    };

    updateTriggerWidth();

    const resizeObserver = new ResizeObserver(updateTriggerWidth);
    resizeObserver.observe(triggerElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [triggerRef]);

  // ============================================================
  // CONTEXT VALUES (for non-Autocomplete concerns)
  // ============================================================

  // TagGroupContext
  const tagGroupContextValue = useMemo(
    () => ({
      id: tagGroupId,
      "aria-label": msg.format("selectedValues"),
      items: selectedItemsFromState,
      onRemove: removeKey,
    }),
    [tagGroupId, msg, selectedItemsFromState, removeKey]
  );

  // ButtonContext
  const hasSelection = normalizedSelectedKeys.size > 0;
  const buttonContextValue = useMemo(
    () => ({
      slots: {
        toggle: {
          onPress: toggleOpen,
          "aria-label": msg.format("toggleOptions"),
          isDisabled: isDisabled || isReadOnly,
          isPressed: isOpen,
        },
        clear: {
          onPress: clearSelection,
          "aria-label": msg.format("clearSelection"),
          style: hasSelection ? undefined : { display: "none" },
          isDisabled: isDisabled || isReadOnly || !hasSelection,
        },
      },
    }),
    [
      toggleOpen,
      msg,
      isDisabled,
      isReadOnly,
      isOpen,
      clearSelection,
      hasSelection,
    ]
  );

  // PopoverContext
  const handlePopoverOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setIsOpen(false);
      }
    },
    [setIsOpen]
  );

  const popoverStyle = useMemo(
    () =>
      ({
        "--nimbus-combobox-trigger-width": triggerWidth,
      }) as React.CSSProperties,
    [triggerWidth]
  );

  const popoverContextValue = useMemo(
    () => ({
      isOpen: isOpen,
      onOpenChange: handlePopoverOpenChange,
      ref: popoverRef,
      triggerRef: triggerRef,
      scrollRef: listBoxRef,
      isNonModal: true,
      trigger: "ComboBox",
      placement: "bottom start" as const,
      style: popoverStyle,
      clearContexts: [
        LabelContext,
        ButtonContext,
        InputContext,
        GroupContext,
        TextContext,
      ],
    }),
    [
      isOpen,
      handlePopoverOpenChange,
      popoverRef,
      triggerRef,
      listBoxRef,
      popoverStyle,
    ]
  );

  // ListBoxContext
  const listBoxContextValue = useMemo(
    () => ({
      items,
      id: listboxId,
      ref: listBoxRef,
      renderEmptyState,
      shouldFocusWrap,
      "aria-label": msg.format("options"),
    }),
    [items, listboxId, listBoxRef, renderEmptyState, shouldFocusWrap, msg]
  );

  // ============================================================
  // RENDER
  // ============================================================
  // Wrap in RAC Autocomplete for filtering + virtual focus, then use
  // AutocompleteBridge to merge Autocomplete's FieldInputContext
  // into our InputContext.

  return (
    <Autocomplete
      inputValue={inputValue ?? ""}
      onInputChange={handleInputChange}
      filter={autocompleteFilter}
    >
      <AutocompleteBridge
        inputRef={inputRef}
        listboxId={listboxId}
        tagGroupId={tagGroupId}
        selectionMode={selectionMode}
        isOpen={isOpen}
        ariaLabel={ariaLabel}
        ariaLabelledBy={ariaLabelledBy}
        ariaDescribedBy={ariaDescribedBy}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        isRequired={isRequired}
        isInvalid={isInvalid}
        placeholder={placeholder}
        nameAttr={name}
        form={form}
        validationBehavior={validationBehavior}
        validate={validate}
        inputValue={inputValue ?? ""}
        handleInputChange={handleInputChange}
        handleCustomKeyDown={handleCustomKeyDown}
        handleFocus={handleFocus}
        handleBlur={handleBlur}
        tagGroupContextValue={tagGroupContextValue}
        buttonContextValue={buttonContextValue}
        popoverContextValue={popoverContextValue}
        listBoxContextValue={listBoxContextValue}
        listState={state}
        formHiddenInputProps={{
          name,
          form,
          selectedKeys: normalizedSelectedKeys,
          selectionMode,
          formValue,
          allowsCustomOptions,
          collection: state.collection,
          inputValue: inputValue ?? "",
        }}
      >
        {children as React.ReactNode}
      </AutocompleteBridge>
    </Autocomplete>
  );
};

// ============================================================
// AUTOCOMPLETE BRIDGE COMPONENT
// ============================================================
// This component sits INSIDE <Autocomplete> so it can read
// FieldInputContext and AutocompleteStateContext, then merges
// Autocomplete's keyboard/ARIA props into our InputContext.

type AutocompleteBridgeProps = {
  children: React.ReactNode;
  inputRef: React.RefObject<HTMLInputElement | null>;
  listboxId: string;
  tagGroupId: string;
  selectionMode: "single" | "multiple";
  isOpen: boolean;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  isDisabled: boolean;
  isReadOnly: boolean;
  isRequired: boolean;
  isInvalid: boolean;
  placeholder?: string;
  nameAttr?: string;
  form?: string | HTMLFormElement;
  validationBehavior: "aria" | "native";
  validate?: (value: string | null) => string | string[] | null | undefined;
  inputValue: string;
  handleInputChange: (value: string) => void;
  handleCustomKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleFocus: () => void;
  handleBlur: () => void;
  tagGroupContextValue: object;
  buttonContextValue: object;
  popoverContextValue: object;
  listBoxContextValue: object;
  listState: ReturnType<typeof useListState>;
  formHiddenInputProps: {
    name?: string;
    form?: string | HTMLFormElement;
    selectedKeys: Set<Key>;
    selectionMode: "single" | "multiple";
    formValue?: "key" | "text";
    allowsCustomOptions: boolean;
    collection: Collection<Node<object>>;
    inputValue: string;
  };
};

const AutocompleteBridge = (props: AutocompleteBridgeProps) => {
  const {
    children,
    inputRef,
    listboxId,
    tagGroupId,
    selectionMode,
    isOpen,
    ariaLabel,
    ariaLabelledBy,
    ariaDescribedBy,
    isDisabled,
    isReadOnly,
    isRequired,
    isInvalid,
    placeholder,
    nameAttr,
    form,
    validationBehavior,
    validate,
    inputValue,
    handleInputChange,
    handleCustomKeyDown,
    handleFocus,
    handleBlur,
    tagGroupContextValue,
    buttonContextValue,
    popoverContextValue,
    listBoxContextValue,
    listState,
    formHiddenInputProps,
  } = props;

  // Read Autocomplete's contexts (available because we're inside <Autocomplete>)
  const fieldInputCtx = useContext(FieldInputContext);
  const autocompleteState = useContext(
    AutocompleteStateContext
  ) as AutocompleteState | null;
  // Read Autocomplete's SelectableCollectionContext so we can re-provide it
  // through our Provider (ensuring it crosses the Popover portal boundary).
  const selectableCollectionCtx = useContext(SelectableCollectionContext);

  // Build InputContext by merging Autocomplete's props with our custom props.
  // Autocomplete provides via FieldInputContext:
  //   - onKeyDown (keyboard forwarding to collection)
  //   - aria-activedescendant (virtual focus tracking)
  //   - aria-controls (collection id)
  //   - aria-autocomplete
  //   - value, onChange
  //   - onFocus, onBlur
  // We override/augment with our custom props.
  const inputContextValue = useMemo(() => {
    // Extract Autocomplete's keyboard handler for merging
    const acKeyDown =
      fieldInputCtx && "onKeyDown" in fieldInputCtx
        ? (fieldInputCtx as { onKeyDown?: (e: React.KeyboardEvent) => void })
            .onKeyDown
        : undefined;

    // Get aria-activedescendant from Autocomplete state or selection manager.
    // Autocomplete tracks focusedNodeId (a DOM element ID) when it handles keyboard nav.
    // The selection manager tracks focusedKey (a collection key) when we set focus
    // programmatically (e.g., on menu open via ArrowDown/Up).
    // Only set aria-activedescendant when the menu is open (the DOM element must exist).
    const focusedKey = listState.selectionManager.focusedKey;
    let activedescendant: string | undefined;
    if (isOpen) {
      activedescendant =
        autocompleteState?.focusedNodeId ??
        (focusedKey != null ? `${listboxId}-option-${focusedKey}` : undefined);
    }

    return {
      ref: inputRef,
      role: "combobox" as const,
      "aria-autocomplete": "list" as const,
      "aria-controls":
        selectionMode === "multiple" ? `${tagGroupId} ${listboxId}` : listboxId,
      "aria-expanded": isOpen,
      "aria-activedescendant": activedescendant,
      "aria-describedby":
        selectionMode === "multiple"
          ? `${tagGroupId} ${ariaDescribedBy ?? ""}`
          : ariaDescribedBy,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      value: inputValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        handleInputChange(e.target.value),
      onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Run our custom handlers first (Escape, Backspace, Enter for custom opts)
        handleCustomKeyDown(e);
        // If not handled, delegate to Autocomplete's keyboard handler
        // (ArrowUp/Down navigation, Enter for selection, Home/End, etc.)
        if (!e.defaultPrevented && acKeyDown) {
          acKeyDown(e);
        }
      },
      onFocus: handleFocus,
      onBlur: handleBlur,
      disabled: isDisabled,
      readOnly: isReadOnly,
      required: isRequired,
      "aria-invalid": isInvalid,
      placeholder,
      name: nameAttr,
      form,
      validationbehavior: validationBehavior,
      validate,
    };
  }, [
    fieldInputCtx,
    autocompleteState?.focusedNodeId,
    listState.selectionManager.focusedKey,
    inputRef,
    selectionMode,
    tagGroupId,
    listboxId,
    isOpen,
    ariaDescribedBy,
    ariaLabel,
    ariaLabelledBy,
    inputValue,
    handleInputChange,
    handleCustomKeyDown,
    handleFocus,
    handleBlur,
    isDisabled,
    isReadOnly,
    isRequired,
    isInvalid,
    placeholder,
    nameAttr,
    form,
    validationBehavior,
    validate,
  ]);

  // Assemble context values array for React Aria's Provider
  // Note: We do NOT provide SelectableCollectionContext here because
  // Re-provide SelectableCollectionContext from Autocomplete (with filter function
  // and shouldUseVirtualFocus). If not available from Autocomplete, provide a
  // fallback with shouldUseVirtualFocus: true for proper virtual focus behavior.
  const selectableCollectionValue = selectableCollectionCtx ?? {
    shouldUseVirtualFocus: true,
  };
  const contextValues = [
    [InputContext, inputContextValue],
    [TagGroupContext, tagGroupContextValue],
    [ButtonContext, buttonContextValue],
    [PopoverContext, popoverContextValue],
    [SelectableCollectionContext, selectableCollectionValue],
    [ListBoxContext, listBoxContextValue],
    [ListStateContext, listState],
  ];

  return (
    <Provider
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      values={contextValues as any}
    >
      <ComboBoxHiddenInput {...formHiddenInputProps} />
      {children}
    </Provider>
  );
};
