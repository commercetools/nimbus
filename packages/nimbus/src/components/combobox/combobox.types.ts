import type { ReactNode, Ref } from "react";
import type { ListState, Node, Key } from "react-stately";
import type { CollectionChildren } from "@react-types/shared";
import type {
  ListBoxItemProps as RaListBoxItemProps,
  ListBoxSectionProps as RaListBoxSectionProps,
} from "react-aria-components";
import type { HTMLChakraProps, SlotRecipeProps } from "@chakra-ui/react";

// ============================================================
// RECIPE PROPS
// ============================================================

type ComboBoxRecipeProps = SlotRecipeProps<"combobox">;

// ============================================================
// SLOT PROPS
// ============================================================

export type ComboBoxRootSlotProps = HTMLChakraProps<"div", ComboBoxRecipeProps>;
export type ComboBoxTriggerSlotProps = HTMLChakraProps<"div">;
export type ComboBoxLeadingElementSlotProps = HTMLChakraProps<"div">;
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

// ============================================================
// CONTEXT VALUE
// ============================================================

export type ComboBoxRootContextValue<T extends object> = {
  /** React Stately list state managing collection and selection */
  state: ListState<T>;

  /** Selection mode determines single vs multi-select behavior */
  selectionMode: "single" | "multiple";

  /** Current input value for filtering */
  inputValue: string;

  /** Update input value */
  setInputValue: (value: string) => void;

  /** Whether popup is open */
  isOpen: boolean;

  /** Update popup open state */
  setIsOpen: (open: boolean) => void;

  /** Unique ID for listbox element (for aria-controls) */
  listboxId: string;

  /** Unique ID for tagGroup element (for aria-controls and aria-describedby) */
  tagGroupId: string;

  /** Clear all selections */
  clearSelection: () => void;

  /** Remove specific key from selection */
  removeKey: (key: Key) => void;

  /** Handle creating a custom option from input value - returns true if created */
  handleCreateOption: () => boolean;

  /** Extract key from item for TagGroup */
  getKey: (item: T) => Key;

  /** Extract text value from item for TagGroup */
  getTextValue: (item: T) => string;

  /** Whether component is disabled */
  isDisabled: boolean;

  /** Whether component is required */
  isRequired: boolean;

  /** Whether component is invalid */
  isInvalid: boolean;

  /** Whether component is read-only */
  isReadOnly: boolean;

  /** Accessible label for the combobox (when no visible label) */
  "aria-label"?: string;

  /** ID of external label element (typically from FormField) */
  "aria-labelledby"?: string;

  /** Leading visual element (e.g., search icon) rendered before the input */
  leadingElement?: ReactNode;

  /** Ref to trigger element (for popover positioning) */
  triggerRef: React.RefObject<HTMLDivElement | null>;

  /** Placeholder text for input */
  placeholder?: string;

  /** Handle input focus - opens menu if menuTrigger is "focus" */
  handleFocus: () => void;

  /** Handle input blur - closes menu if shouldCloseOnBlur is true */
  handleBlur: (e: React.FocusEvent) => void;

  /** Custom render function for empty state (passed to ListBox) */
  renderEmptyState?: () => ReactNode;
};

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Root component props for unified ComboBox
 */
export type ComboBoxRootProps<T extends object> = Omit<
  ComboBoxRootSlotProps,
  "children"
> & {
  /**
   * Render function for each item, or static JSX children.
   * Must be React Aria collection elements (Section/Item components).
   */
  children?: CollectionChildren<T>;

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
  selectedKeys?: Key | Key[];

  /**
   * Callback when selection changes
   * Single-select: receives a single Key
   * Multi-select: receives Key[]
   */
  onSelectionChange?: (keys: Key | Key[]) => void;

  /**
   * Default selected keys for uncontrolled mode
   * Single-select: pass a Key
   * Multi-select: pass a Key[]
   */
  defaultSelectedKeys?: Key | Key[];

  /**
   * Controlled input value
   *
   * When using controlled mode, you **MUST** update this prop in response to `onInputChange`
   * to see input value changes. This includes:
   * - User typing in the input
   * - Automatic sync on selection changes (single-select mode)
   * - Input clearing after selection (multi-select mode)
   *
   * If you don't update `inputValue` when `onInputChange` fires, the input will appear frozen.
   *
   * @example
   * ```tsx
   * // ✅ Correct: Update inputValue in response to onInputChange
   * const [inputValue, setInputValue] = useState("");
   * <ComboBox.Root
   *   inputValue={inputValue}
   *   onInputChange={setInputValue}
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
   * Default input value for uncontrolled mode
   * @default ""
   */
  defaultInputValue?: string;

  /**
   * Callback when input value changes
   *
   * Called when:
   * - User types in the input
   * - Selection changes in single-select mode (input syncs to selected item's text)
   * - Option selected in multi-select mode (input clears)
   *
   * In controlled mode (`inputValue` prop provided), you must update `inputValue`
   * in this callback for changes to be visible.
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
   * - `filterByText` - Basic case-insensitive text filtering
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
   * @param inputValue - The input value that was used to create the option
   * @example
   * ```tsx
   * onCreateOption={async (inputValue) => {
   *   // Make API call to persist
   *   await createTagAPI({ name: inputValue });
   *
   *   // Show notification
   *   toast.success(`Created tag: ${inputValue}`);
   * }}
   * ```
   */
  onCreateOption?: (inputValue: string) => void;

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
  children: ReactNode;
};

/**
 * Props for ComboBox.TagGroup component
 * Displays selected items as tags (multi-select only)
 * Gets props from TagGroupContext provided by Nimbus context
 */
export type ComboBoxTagGroupProps = ComboBoxTagGroupSlotProps;

/**
 * Props for ComboBox.Input component
 * Text input field for filtering and typing
 * Gets props from InputContext provided by Nimbus context
 */
export type ComboBoxInputProps = ComboBoxInputSlotProps;

/**
 * Props for ComboBox.Popover component
 * Popover wrapper for options list
 * Gets props from PopoverContext provided by Nimbus context
 */
export type ComboBoxPopoverProps = ComboBoxPopoverSlotProps & {
  /**
   * Children should be ComboBox.ListBox
   */
  children: ReactNode;
};

/**
 * Props for ComboBox.ListBox component
 * Container for options
 * Gets props from ListBoxContext provided by Nimbus context
 */
export type ComboBoxListBoxProps = ComboBoxListBoxSlotProps & {
  /**
   * Render function for each option or static JSX children
   * If not provided with items, uses default renderer
   */
  children?: ((item: object) => ReactNode) | ReactNode;
};

/**
 * Props for ComboBox.Option component
 * Individual option within the combobox listbox
 * Supports both static children and render prop pattern
 */
export type ComboBoxOptionProps<T extends object> = RaListBoxItemProps<T> &
  Omit<ComboBoxOptionSlotProps, keyof RaListBoxItemProps<T>> & {
    ref?: Ref<HTMLDivElement>;
  };

/**
 * Props for ComboBox.Section component
 * Groups related options together
 * Supports both static children and collection rendering
 */
export type ComboBoxSectionProps<T extends object> = RaListBoxSectionProps<T> &
  Omit<ComboBoxSectionSlotProps, keyof RaListBoxSectionProps<T>> & {
    /**
     * Section label displayed as header
     */
    label?: ReactNode;

    ref?: Ref<HTMLDivElement>;
  };
