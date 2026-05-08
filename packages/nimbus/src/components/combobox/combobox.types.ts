import type { ReactNode, Ref } from "react";
import type { Node, Key, Collection } from "react-stately";
import type {
  ComboBoxRenderProps,
  InputProps as RaInputProps,
  ListBoxProps as RaListBoxProps,
  ListBoxItemProps as RaListBoxItemProps,
  ListBoxSectionProps as RaListBoxSectionProps,
} from "react-aria-components";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";
import type { TagGroupProps as NimbusTagGroupProps } from "../tag-group/tag-group.types";
import type { PopoverProps as NimbusPopoverProps } from "../popover/popover.types";
import type { OmitInternalProps } from "../../type-utils/omit-props";

// ============================================================
// RECIPE PROPS
// ============================================================

type ComboBoxRecipeProps = {
  /**
   * Size variant of combobox
   * @default "md"
   */
  size?: SlotRecipeProps<"nimbusCombobox">["size"];
  /**
   * Variant of combobox
   * @default "solid"
   */
  variant?: SlotRecipeProps<"nimbusCombobox">["variant"];
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type ComboBoxRootSlotProps = HTMLChakraProps<"div", ComboBoxRecipeProps>;
export type ComboBoxTriggerSlotProps = HTMLChakraProps<"div">;
export type ComboBoxLeadingElementSlotProps = HTMLChakraProps<"div">;
export type ComboBoxContentSlotProps = HTMLChakraProps<"div">; // Flex wrapper for tags and input
export type ComboBoxTagGroupSlotProps = HTMLChakraProps<"div">;
export type ComboBoxInputSlotProps = HTMLChakraProps<"div">; // Wraps React Aria Input
export type ComboBoxPopoverSlotProps = HTMLChakraProps<"div">;
export type ComboBoxListBoxSlotProps = HTMLChakraProps<"div">; // Will wrap React Aria ListBox
export type ComboBoxOptionSlotProps = HTMLChakraProps<"div">; // Will wrap React Aria ListBoxItem
export type ComboBoxOptionIndicatorSlotProps = HTMLChakraProps<"div">; // Indicator for selected state (multi-select)
export type ComboBoxOptionContentSlotProps = HTMLChakraProps<"div">; // Content wrapper for option text
export type ComboBoxSectionSlotProps = HTMLChakraProps<"div">; // Will wrap React Aria Section

// ============================================================
// HELPER TYPES
// ============================================================

/**
 * Filter function for collection items
 *
 * @param nodes - Collection nodes to filter (includes sections and items)
 * @param inputValue - Current filter text from input
 * @returns Filtered collection nodes
 */
export type ComboBoxFilter<T extends object> = (
  nodes: Iterable<Node<T>>,
  inputValue: string
) => Iterable<Node<T>>;

/**
 * Async configuration for ComboBox with built-in useAsyncList integration
 *
 * @template T - Type for item data returned by the load function
 */
export type ComboBoxAsyncConfig<T extends object> = {
  /**
   * Async function to load items based on filter text.
   * Automatically receives an AbortSignal for request cancellation.
   *
   * @param filterText - Current input value to filter by
   * @param signal - AbortSignal for cancelling the request
   * @returns Promise resolving to array of items
   *
   * @example
   * ```tsx
   * async: {{
   *   load: async (filterText, signal) => {
   *     const response = await fetch(
   *       `/api/search?q=${encodeURIComponent(filterText)}`,
   *       { signal }
   *     );
   *     const data = await response.json();
   *     return data.results;
   *   }
   * }}
   * ```
   */
  load: (filterText: string, signal: AbortSignal) => Promise<T[]>;

  /**
   * Minimum number of characters required before triggering a load.
   * Prevents unnecessary API calls for very short queries.
   *
   * @default 0
   *
   * @example
   * ```tsx
   * async: {{ load, minSearchLength: 2 }} // Only search after typing 2+ chars
   * ```
   */
  minSearchLength?: number;

  /**
   * Debounce delay in milliseconds before triggering load.
   * Prevents excessive API calls while user is typing.
   *
   * @default 300
   *
   * @example
   * ```tsx
   * async: {{ load, debounce: 500 }} // Wait 500ms after typing stops
   * ```
   */
  debounce?: number;

  /**
   * Callback when an error occurs during loading.
   * Receives the error object for custom error handling.
   *
   * @param error - The error that occurred
   *
   * @example
   * ```tsx
   * async: {{
   *   load,
   *   onError: (error) => {
   *     console.error('Failed to load:', error);
   *     toast.error('Search failed. Please try again.');
   *   }
   * }}
   * ```
   */
  onError?: (error: Error) => void;
};

// ============================================================
// CONTEXT VALUE
// ============================================================

export type ComboBoxRootContextValue<T> = {
  /** Selection mode determines single vs multi-select behavior */
  selectionMode: "single" | "multiple";

  /** variant size */
  size?: SlotRecipeProps<"nimbusCombobox">["size"];

  /** Extract key from item for TagGroup */
  getKey: (item: T) => Key;

  /** Extract text value from item for TagGroup */
  getTextValue: (item: T) => string;

  /** Leading visual element (e.g., search icon) rendered before the input */
  leadingElement?: ReactNode;

  /** Ref to trigger element (for popover positioning) */
  triggerRef: React.RefObject<HTMLDivElement | null>;

  /** Ref to input element (for programmatic focus) */
  inputRef: React.RefObject<HTMLInputElement | null>;

  /** Whether component is disabled */
  isDisabled: boolean;

  /** Whether component is required */
  isRequired: boolean;

  /** Whether component is invalid */
  isInvalid: boolean;

  /** Whether component is read-only */
  isReadOnly: boolean;

  /** Loading state */
  isLoading?: boolean;
};

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Root component props for unified ComboBox
 *
 * @template T - Type for item data displayed in the combobox menu. Items array type is `T[]`.
 */
export type ComboBoxRootProps<T extends object> = Omit<
  ComboBoxRootSlotProps,
  "children"
> & {
  /**
   * Render function for each item, or static JSX children.
   * Must be React Aria collection elements (Section/Item components).
   */
  children?:
    | ReactNode
    | ((
        values: T & {
          defaultChildren: ReactNode | undefined;
        } & ComboBoxRenderProps
      ) => ReactNode);

  /**
   * Selection mode - determines single vs multi-select behavior
   * @default "single"
   */
  selectionMode?: "single" | "multiple";

  /**
   * Collection items to display.
   * If `children` is not provided, each item will be rendered using `getTextValue`.
   *
   * When `allowsCustomOptions` is enabled:
   * - New items created via Enter key are automatically added to the collection
   * - Both the items array and selection state are managed internally
   * - Use `onCreateOption` callback for side effects (API calls, notifications, etc.)
   */
  items?: Iterable<T>;

  /**
   * Function to extract unique key from each item when items do not have a `key` or `id` field.
   * Defaults to using `item.key` or `item.id`.
   *
   * **Important:** Wrap this function in `useCallback` to prevent unnecessary
   * re-synchronization of the list state.
   *
   * @param item - The item to extract the key from
   * @returns The unique key for the item
   * @default useCallback((item) => (item.key ?? item.id), [])
   * @example
   * ```tsx
   * // ✅ Good: Memoized with useCallback
   * const getKey = useCallback((item) => item.productId, []);
   * <ComboBox.Root items={items} getKey={getKey} />
   *
   * // ❌ Bad: Inline function creates new identity on every render
   * <ComboBox.Root items={items} getKey={(item) => item.productId} />
   * ```
   */
  getKey?: (item: T) => Key;

  /**
   * Function to extract display text from each item when `children` is not provided.
   * Used for both rendering and filtering.
   * Defaults to `item.label ?? item.name ?? String(item)`.
   *
   * **Important:** Wrap this function in `useCallback` for optimal performance.
   *
   * @param item - The item to extract text from
   * @returns The display text for the item
   * @default useCallback((item) => item.label ?? item.name ?? String(item), [])
   * @example
   * ```tsx
   * // ✅ Good: Memoized with useCallback
   * const getTextValue = useCallback((item) => item.displayName, []);
   * <ComboBox.Root items={items} getTextValue={getTextValue} />
   *
   * // ❌ Bad: Inline function creates new identity on every render
   * <ComboBox.Root items={items} getTextValue={(item) => item.displayName} />
   * ```
   */
  getTextValue?: (item: T) => string;

  /**
   * Controlled selected keys (unified for single/multi)
   * Single-select: pass a Key
   * Multi-select: pass a Key[]
   *
   * Internally normalized to Set<Key> for React Stately
   */
  selectedKeys?: Key[];

  /**
   * Callback when selection changes
   * Always receives an array of keys regardless of selection mode:
   * - Single-select: `[selectedKey]` or `[]` if nothing selected
   * - Multi-select: `[key1, key2, ...]` or `[]` if nothing selected
   */
  onSelectionChange?: (keys: Key[]) => void;

  /**
   * Keys of items that should be disabled and not selectable.
   * Disabled items are still visible but cannot be selected or focused.
   *
   * @example
   * ```tsx
   * <ComboBox.Root
   *   items={items}
   *   disabledKeys={['item-2', 'item-5']}
   * />
   * ```
   */
  disabledKeys?: Iterable<Key>;

  /**
   * Input value for controlled mode
   *
   * **Controlled Mode:** When `onInputChange` is provided, you manage the input value.
   * You **MUST** update this prop in response to `onInputChange` for changes to be visible:
   * - User typing in the input
   * - Automatic sync on selection changes (single-select mode)
   * - Input clearing after selection (multi-select mode)
   *
   * **Uncontrolled Mode:** When `onInputChange` is NOT provided, the component manages
   * the input value internally. You can still pass `inputValue` to set the initial value.
   *
   * @example
   * ```tsx
   * // ✅ Controlled: Update inputValue in response to onInputChange
   * const [inputValue, setInputValue] = useState("");
   * <ComboBox.Root
   *   inputValue={inputValue}
   *   onInputChange={setInputValue}
   * />
   *
   * // ✅ Uncontrolled: Component manages input internally
   * <ComboBox.Root
   *   inputValue="initial search text"
   *   // No onInputChange - component handles updates
   * />
   *
   * // ❌ Wrong: Controlled prop but never updated
   * <ComboBox.Root
   *   inputValue="fixed"
   *   onInputChange={(v) => console.log(v)} // Input will be frozen
   * />
   * ```
   */
  inputValue?: string;

  /**
   * Callback when input value changes
   *
   * **When provided:** Enables controlled input mode. You must update `inputValue` prop
   * in this callback for the input to update.
   *
   * **When NOT provided:** Component uses uncontrolled input mode and manages value internally.
   *
   * Called when:
   * - User types in the input
   * - Selection changes in single-select mode (input syncs to selected item's text)
   * - Option selected in multi-select mode (input clears)
   *
   * @param value - The new input value
   */
  onInputChange?: (value: string) => void;

  /**
   * Custom filter function for collection.
   * If not provided, uses default text-based filter.
   *
   * **Important:** Wrap this function in `useCallback` to prevent
   * unnecessary re-filtering of the collection on every render.
   *
   * @param nodes - Collection nodes to filter (includes sections and items)
   * @param inputValue - Current filter text from input
   * @returns Filtered collection nodes
   *
   * @example
   * ```tsx
   * // ✅ Good: Memoized with useCallback
   * const customFilter = useCallback((nodes, inputValue) => {
   *   if (!inputValue) return nodes;
   *   return Array.from(nodes).filter(node =>
   *     node.textValue?.toLowerCase().includes(inputValue.toLowerCase())
   *   );
   * }, []);
   *
   * <ComboBox.Root items={items} filter={customFilter} />
   *
   * // ❌ Bad: Inline function creates new identity on every render
   * <ComboBox.Root
   *   items={items}
   *   filter={(nodes, input) => ...}  // Will cause re-filtering on every render
   * />
   * ```
   *
   * **Built-in Utilities:** For common patterns, use the exported filter utilities:
   * - `filterByTextWithSections` - Section-aware filtering
   * - `createSectionAwareFilter` - Factory for custom section-aware filters
   * - `createMultiPropertyFilter` - Multi-property search filtering
   */
  filter?: ComboBoxFilter<T>;

  /**
   * Placeholder text for input
   */
  placeholder?: string;

  /**
   * Controls when the menu opens.
   * - "focus": Opens when input receives focus
   * - "input": Opens when user types (input value changes)
   * - "manual": Only opens via button click or arrow down key
   * @default "input"
   */
  menuTrigger?: "focus" | "input" | "manual";

  /**
   * Whether the menu should close when the combobox loses focus.
   * Set to false to keep menu open when clicking outside.
   * @default true
   */
  shouldCloseOnBlur?: boolean;

  /**
   * Whether to close the menu after an item is selected (single-select only).
   * Multi-select always keeps menu open after selection.
   * @default true
   */
  shouldCloseOnSelect?: boolean;

  /**
   * Controlled open state of the menu
   */
  isOpen?: boolean;

  /**
   * Default open state for uncontrolled mode
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * Callback when menu open state changes
   */
  onOpenChange?: (isOpen: boolean) => void;

  /**
   * Whether to keep the menu open when the filtered collection is empty.
   * When false (default), the menu automatically closes when no items match the filter.
   * When true, the menu stays open and can show empty state content.
   * @default false
   */
  allowsEmptyMenu?: boolean;

  /**
   * Custom render function for empty state when no items match the filter.
   * Only shown when `allowsEmptyMenu` is true and collection is empty.
   * Passed through to React Aria's ListBox renderEmptyState prop.
   * @example
   * ```tsx
   * <ComboBox.Root
   *   allowsEmptyMenu={true}
   *   renderEmptyState={() => (
   *     <Box padding="400" textAlign="center">
   *       <Text color="fg.muted">No results found</Text>
   *     </Box>
   *   )}
   * />
   * ```
   */
  renderEmptyState?: () => ReactNode;

  /**
   * External loading state for displaying loading indicators.
   * Useful when managing async data loading externally with React Stately's useAsyncList.
   *
   * **Note:** When using the built-in `async` prop, loading state is managed automatically.
   * This prop is only needed for external async management.
   *
   * @example
   * ```tsx
   * // External async control with useAsyncList
   * const asyncList = useAsyncList({
   *   async load({ filterText, signal }) {
   *     const res = await fetch(`/api/search?q=${filterText}`, { signal });
   *     return { items: await res.json() };
   *   }
   * });
   *
   * <ComboBox.Root
   *   items={asyncList.items}
   *   isLoading={asyncList.loadingState === 'loading'}
   *   inputValue={asyncList.filterText}
   *   onInputChange={(value) => asyncList.setFilterText(value)}
   * >
   *   {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
   * </ComboBox.Root>
   * ```
   */
  isLoading?: boolean;

  /**
   * Built-in async loading configuration with automatic state management.
   *
   * When provided, ComboBox automatically handles:
   * - Loading state management
   * - Request debouncing (300ms default)
   * - Request cancellation on input changes
   * - Automatic filter bypass (since API handles filtering)
   * - Minimum search length validation
   * - Error handling with optional callback
   *
   * **Important:** When using `async`, do NOT provide `items`, `isLoading`, `inputValue`, or `onInputChange`.
   * These are managed automatically by the internal useAsyncList integration.
   *
   * @example
   * ```tsx
   * // Simple async search
   * <ComboBox.Root
   *   async={{
   *     load: async (filterText, signal) => {
   *       const response = await fetch(
   *         `/api/search?q=${encodeURIComponent(filterText)}`,
   *         { signal }
   *       );
   *       return response.json();
   *     }
   *   }}
   * >
   *   {(item: SearchResult) => (
   *     <ComboBox.Option>{item.name}</ComboBox.Option>
   *   )}
   * </ComboBox.Root>
   *
   * // With configuration and error handling
   * <ComboBox.Root
   *   async={{
   *     load: async (filterText, signal) => {
   *       const response = await fetch(`/api/search?q=${filterText}`, { signal });
   *       const data = await response.json();
   *       return data.results;
   *     },
   *     minSearchLength: 2,
   *     debounce: 500,
   *     onError: (error) => {
   *       console.error('Search failed:', error);
   *       toast.error('Failed to load results');
   *     }
   *   }}
   * />
   * ```
   */
  async?: ComboBoxAsyncConfig<T>;

  /**
   * Whether to allow creating custom options that don't exist in the items collection.
   * When enabled and input doesn't match any existing option, pressing Enter will create
   * a new option using `getNewOptionData`.
   *
   * Requires providing `getNewOptionData` to transform input value into item object.
   * @default false
   * @example
   * ```tsx
   * <ComboBox.Root
   *   items={tags}
   *   allowsCustomOptions={true}
   *   getNewOptionData={(inputValue) => ({
   *     id: `tag-${Date.now()}`,
   *     label: inputValue,
   *   })}
   *   onCreateOption={(inputValue) => {
   *     console.log('Created new tag:', inputValue);
   *   }}
   * />
   * ```
   */
  allowsCustomOptions?: boolean;

  /**
   * Function to validate whether the current input value is valid for creating a new option.
   * If not provided, any non-empty input that doesn't match an existing option is valid.
   *
   * Based on react-select's isValidNewOption API.
   * @param inputValue - The current input value
   * @returns True if the input is valid for creating a new option
   * @example
   * ```tsx
   * // Only allow creating tags that start with '#'
   * isValidNewOption={(inputValue) => {
   *   return inputValue.startsWith('#') && inputValue.length > 1;
   * }}
   *
   * // Only allow email addresses
   * isValidNewOption={(inputValue) => {
   *   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue);
   * }}
   * ```
   */
  isValidNewOption?: (inputValue: string) => boolean;

  /**
   * Function to transform the input value into a new item object when creating a custom option.
   * Required when `allowsCustomValue` is true.
   *
   * The returned item must be compatible with your items type and have properties
   * that `getKey` and `getTextValue` can extract.
   *
   * Based on react-select's getNewOptionData API.
   * @param inputValue - The input value to transform
   * @returns A new item object to add to the collection
   * @example
   * ```tsx
   * // Simple tag creation
   * getNewOptionData={(inputValue) => ({
   *   id: `tag-${Date.now()}`,
   *   label: inputValue,
   * })}
   *
   * // Product creation with additional fields
   * getNewOptionData={(inputValue) => ({
   *   id: `product-${Date.now()}`,
   *   name: inputValue,
   *   category: 'uncategorized',
   *   createdAt: new Date(),
   * })}
   * ```
   */
  getNewOptionData?: (inputValue: string) => T;

  /**
   * Callback when a new option is created via Enter key on valid input.
   * Called after the item is added to the collection and selected.
   *
   * Use this for side effects like API calls, analytics, or notifications.
   *
   * Based on react-select's onCreateOption API.
   * Note: Unlike react-select, selection changes are still handled by `onSelectionChange`.
   * @param newOption - The option that was created
   * @example
   * ```tsx
   * onCreateOption={async (newOption) => {
   *   // Make API call to persist
   *   await createTagAPI(newOption);
   *
   *   // Show notification
   *   toast.success(`Created tag: ${newOption.value}`);
   * }}
   * ```
   */
  onCreateOption?: (newOption: T) => void;

  /**
   * Accessible label for the combobox (when no visible label exists)
   * @example "Select a product"
   */
  "aria-label"?: string;

  /**
   * ID of external label element (typically from FormField)
   * Use this when the combobox is wrapped in a FormField component
   * @example "product-combobox-label"
   */
  "aria-labelledby"?: string;

  /**
   * Leading visual element rendered before the input
   * Common use cases: search icon, category indicator
   *
   * **Accessibility**: Ensure decorative elements have aria-hidden="true".
   * If the element is functional (clickable), it needs its own aria-label.
   *
   * @example
   * ```tsx
   * // Decorative icon (recommended)
   * <ComboBox.Root leadingElement={<Icons.Search aria-hidden="true" />} />
   *
   * // Functional element (needs aria-label)
   * <ComboBox.Root leadingElement={<Button aria-label="Clear search"><Icons.Close /></Button>} />
   * ```
   */
  leadingElement?: ReactNode;

  /**
   * Whether component is disabled
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Whether component is required
   * @default false
   */
  isRequired?: boolean;

  /**
   * Whether component is invalid
   * @default false
   */
  isInvalid?: boolean;

  /**
   * Whether component is read-only
   * @default false
   */
  isReadOnly?: boolean;

  /**
   * Whether keyboard focus should wrap around when navigating through options.
   * When true, pressing ArrowDown on the last option moves focus to the first option,
   * and pressing ArrowUp on the first option moves focus to the last option.
   * @default true
   */
  shouldFocusWrap?: boolean;

  /**
   * Whether to automatically focus the input when the component mounts.
   * @default false
   */
  autoFocus?: boolean;

  /**
   * The name of the input element, used when submitting an HTML form.
   * @see https://react-spectrum.adobe.com/react-aria/forms.html
   */
  name?: string;

  /**
   * The current value of the hidden input element for form submission.
   * By default, the selected key is submitted. Use this to customize the submitted value.
   * @see https://react-spectrum.adobe.com/react-aria/forms.html
   */
  formValue?: "key" | "text";

  /**
   * Whether to use native HTML form validation to prevent form submission
   * when the value is missing or invalid, or mark the field as required
   * or invalid via ARIA.
   * @default 'aria'
   */
  validationBehavior?: "aria" | "native";

  /**
   * The form element to associate the input with.
   * Accepts either an HTML form element or the id of a form element.
   */
  form?: string | HTMLFormElement;

  /**
   * A function that validates the current value and returns an error message if invalid.
   * Called when the value changes and on form submission.
   * @see https://react-spectrum.adobe.com/react-aria/forms.html#validation
   */
  validate?: (value: string | null) => string | string[] | null | undefined;

  /**
   * Ref to the root element
   */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Props for ComboBox.Trigger component
 * Wrapper for the input trigger area (contains Input, TagGroup, and IconButtons)
 */
export type ComboBoxTriggerProps = ComboBoxTriggerSlotProps & {
  /**
   * Children should be ComboBox.Input, ComboBox.TagGroup, and IconButton components
   */
  children?: ReactNode;
};

/**
 * Props for ComboBox.TagGroup component
 * Displays selected items as tags (multi-select only)
 * Gets props from TagGroupContext provided by Nimbus context
 */
export type ComboBoxTagGroupProps = ComboBoxTagGroupSlotProps &
  NimbusTagGroupProps;

/**
 * Props for ComboBox.Input component
 * Text input field for filtering and typing
 * Gets props from InputContext provided by Nimbus context
 */
export type ComboBoxInputProps = ComboBoxInputSlotProps & RaInputProps;

/**
 * Props for ComboBox.Popover component
 * Popover wrapper for options list
 * Gets props from PopoverContext provided by Nimbus context
 */
export type ComboBoxPopoverProps = NimbusPopoverProps &
  Omit<ComboBoxPopoverSlotProps, keyof NimbusPopoverProps>;

/**
 * Props for ComboBox.ListBox component
 * Container for options
 * Gets props from ListBoxContext provided by Nimbus context
 *
 * @template T - Type for item data displayed in the list. Items array type is `T[]`.
 *
 * **Type Inference Limitation:**
 * Due to TypeScript limitations with generic types in compound components,
 * the item type cannot be automatically inferred from ComboBox.Root.
 * When using a render function, you may need to explicitly type the item parameter:
 *
 * @example
 * ```tsx
 * // ✅ Explicit typing (recommended for type safety)
 * <ComboBox.ListBox>
 *   {(item: MyItemType) => <ComboBox.Option>{item.name}</ComboBox.Option>}
 * </ComboBox.ListBox>
 *
 * // ⚠️ Without explicit typing, TypeScript defaults to 'object'
 * <ComboBox.ListBox>
 *   {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>} // Type error on item.name
 * </ComboBox.ListBox>
 * ```
 */
export type ComboBoxListBoxProps<T extends object> = RaListBoxProps<T> &
  Omit<ComboBoxListBoxSlotProps, keyof RaListBoxProps<T>> & {
    ref?: Ref<HTMLDivElement>;
  };

/**
 * Props for ComboBox.Option component
 * Individual option within the combobox listbox
 * Supports both static children and render prop pattern
 *
 *  @template T - Type for item data displayed in the option. Items array type is `T[]`.
 */
export type ComboBoxOptionProps<T extends object> = RaListBoxItemProps<T> &
  OmitInternalProps<ComboBoxOptionSlotProps, keyof RaListBoxItemProps<T>> & {
    ref?: Ref<HTMLDivElement>;
  };

/**
 * Props for ComboBox.Section component
 * Groups related options together
 * Supports both static children and collection rendering
 *
 *  @template T - Type for item data displayed in the section. Items array type is `T[]`.
 */
export type ComboBoxSectionProps<T extends object> = RaListBoxSectionProps<T> &
  Omit<ComboBoxSectionSlotProps, keyof RaListBoxSectionProps<T>> & {
    /**
     * Section label displayed as header
     */
    label?: ReactNode;

    ref?: Ref<HTMLDivElement>;
  };

/**
 * Props for the ComboBoxHiddenInput component
 */
export type ComboBoxHiddenInputProps<T extends object> = {
  /** Name attribute for form submission */
  name?: string;
  /** Form element to associate with */
  form?: string | HTMLFormElement;
  /** Selected keys from state */
  selectedKeys: Set<Key>;
  /** Selection mode (single or multiple) */
  selectionMode: "single" | "multiple";
  /** What to submit: "key" (default) or "text" */
  formValue?: "key" | "text";
  /** Whether custom options are allowed (affects default formValue behavior) */
  allowsCustomOptions?: boolean;
  /** Collection of items */
  collection: Collection<Node<T>>;
  /** Current input value (used as fallback for custom options) */
  inputValue: string;
};
