# ComboBox Refactor Implementation Plan

## CRITICAL: WAI-ARIA Compliance Requirements

This refactor **MUST manually implement** all ARIA and DOM attributes according to the [WAI-ARIA Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/), specifically following the [Editable Combobox With List Autocomplete Example](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/).

### Required ARIA Attributes

#### On TextInput (Combobox Element)
```typescript
<TextInput
  role="combobox"                              // REQUIRED
  aria-autocomplete="list"                      // REQUIRED
  aria-controls={listboxId}                     // REQUIRED - references listbox
  aria-expanded={isOpen}                        // REQUIRED - tracks popup state
  aria-label={ariaLabel}                        // REQUIRED if no visible label
  aria-labelledby={ariaLabelledBy}              // REQUIRED if using external label (e.g., FormField)
  // Standard input props
  value={inputValue}
  onChange={handleInputChange}
  onKeyDown={handleKeyDown}
  {...props}
/>
```

**Note:** We do NOT manually set `aria-activedescendant` on the input because React Aria's `ListBox` component manages this automatically.

**Labeling:** Use either `aria-label` (when no visible label) OR `aria-labelledby` (when wrapped in FormField or has external label). Do not use both.

#### On Listbox (Popup)
```typescript
<ListBox
  id={listboxId}                    // REQUIRED - referenced by aria-controls
  aria-labelledby={ariaLabelledBy}  // OPTIONAL - references external label if provided
  items={state.collection}
>
  {(item) => (
    <ComboBox.Option>
      {item.rendered}
    </ComboBox.Option>
  )}
</ListBox>
```

**Note:** React Aria's `ListBox` component automatically provides:
- `role="listbox"` on the container
- `role="option"` on each item (via `ListBoxItem`)
- `aria-selected` on selected items
- `aria-activedescendant` management automatically
- Unique IDs for each option automatically
- Keyboard navigation
- Focus management

We only need to manually set:
- `id` on the ListBox (for `aria-controls` reference from the input)

### Focus Management Requirements

**CRITICAL:** DOM focus must stay on the input element at all times. Visual focus in the listbox is managed via `aria-activedescendant` pointing to option IDs. This is fundamentally different from React Aria's default focus management.

---

## Overview

Refactor Nimbus ComboBox to:
- Unify single-select and multi-select into one component
- Move multi-select input from popover to be colocated with selected tags
- Use React Aria Components + Custom Context architecture
- Use useListState from react-stately as state foundation
- Implement proper WAI-ARIA combobox pattern with manual ARIA attributes
- **Follow Composed Children Pattern** for maximum flexibility

## Component Architecture

**CRITICAL:** ComboBox.Root internally renders all UI chrome. Users only declare options as children.

### Public API Components:
- `ComboBox.Root` - Main container, renders everything internally
- `ComboBox.Option` - Individual option (child of Root)
- `ComboBox.Section` - Grouping for options (child of Root)

### Internal Components (NOT in public API):
- Value area (input + tags) - rendered internally by Root
- ButtonGroup (clear/expand buttons) - rendered internally by Root
- Popover wrapper - rendered internally by Root
- ListBox container - rendered internally by Root

### Usage Patterns:

```typescript
// Pattern 1: Automatic rendering with items (simplest)
<ComboBox.Root items={items} selectionMode="single" />

// Pattern 2: Automatic rendering with custom getTextValue
<ComboBox.Root
  items={items}
  getTextValue={(item) => item.displayName}
  selectionMode="single"
/>

// Pattern 3: Custom render function
<ComboBox.Root items={items} selectionMode="multiple">
  {(item) => <ComboBox.Option>{item.name} - {item.description}</ComboBox.Option>}
</ComboBox.Root>

// Pattern 4: Static JSX children
<ComboBox.Root selectionMode="single">
  <ComboBox.Option id="1">Option 1</ComboBox.Option>
  <ComboBox.Option id="2">Option 2</ComboBox.Option>
</ComboBox.Root>

// Pattern 5: With sections
<ComboBox.Root>
  <ComboBox.Section title="Fruits">
    <ComboBox.Option id="apple">Apple</ComboBox.Option>
    <ComboBox.Option id="banana">Banana</ComboBox.Option>
  </ComboBox.Section>
  <ComboBox.Section title="Vegetables">
    <ComboBox.Option id="carrot">Carrot</ComboBox.Option>
  </ComboBox.Section>
</ComboBox.Root>
```

### Key Functions:

- **`getKey`**: Extracts unique key from items (default: `item.key ?? item.id`)
- **`getTextValue`**: Extracts display text from items (default: `item.label ?? item.name ?? String(item)`)
- **`children`**: Only accepts Option/Section components or render function returning Options

---

## Phase 1: Update Type Definitions

### File: `combobox.types.ts`

Replace entire type structure with unified approach:

```typescript
import type { Key, ReactNode } from "react";
import type { ListState } from "react-stately";
import type { HTMLChakraProps, SlotRecipeProps } from "@chakra-ui/react";

// ============================================================
// RECIPE PROPS
// ============================================================

type ComboBoxRecipeProps = SlotRecipeProps<"combobox">;

// ============================================================
// SLOT PROPS
// ============================================================

export type ComboBoxRootSlotProps = HTMLChakraProps<"div", ComboBoxRecipeProps>;
export type ComboBoxValueSlotProps = HTMLChakraProps<"div">;
export type ComboBoxOptionsSlotProps = HTMLChakraProps<"div">; // Will wrap ListBox
export type ComboBoxOptionSlotProps = HTMLChakraProps<"div">; // Will wrap ListBoxItem
export type ComboBoxSectionSlotProps = HTMLChakraProps<"div">; // Will wrap Section

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

export type ComboBoxContextValue<T extends object> = {
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

  /** Clear all selections */
  clearSelection: () => void;

  /** Remove specific key from selection */
  removeKey: (key: Key) => void;

  /** Handle creating a custom option from input value - returns true if created */
  handleCreateOption: () => boolean;

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

  /** Ref to value area element (for popover positioning) */
  triggerRef: React.RefObject<HTMLDivElement>;

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
export type ComboBoxRootProps<T extends object> = ComboBoxRootSlotProps & {
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
   * Render function for each item, or static JSX children.
   * If not provided and `items` is provided, items will be rendered automatically
   * using `getTextValue`.
   *
   * @param item - The item to render
   * @returns ReactNode to display
   * @example
   * ```tsx
   * // Custom rendering with render function
   * <ComboBox.Root items={items}>
   *   {(item) => (
   *     <div>
   *       <strong>{item.name}</strong>
   *       <span>{item.description}</span>
   *     </div>
   *   )}
   * </ComboBox.Root>
   *
   * // Static JSX children
   * <ComboBox.Root>
   *   <ComboBox.Item id="1">Option 1</ComboBox.Item>
   *   <ComboBox.Item id="2">Option 2</ComboBox.Item>
   * </ComboBox.Root>
   *
   * // Automatic rendering (no children needed)
   * <ComboBox.Root items={items} getTextValue={(item) => item.name} />
   * ```
   */
  children?: ((item: T) => ReactNode) | ReactNode;

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
};

/**
 * Props for ComboBox.Value component
 * Renders selected tags (multi) or just input (single)
 *
 * Note: placeholder comes from context, not props
 */
export type ComboBoxValueProps = ComboBoxValueSlotProps;

/**
 * Props for ComboBox.Options component
 * Renders filtered listbox of options
 */
export type ComboBoxOptionsProps = ComboBoxOptionsSlotProps & {
  /**
   * Render function for each option
   * If not provided, uses default renderer
   */
  children?: (item: any) => ReactNode;
};

/**
 * Props for ComboBox.ButtonGroup component
 * Contains clear and expand buttons
 *
 * Note: This is an internal component and is NOT exported in the public API
 */
export type ComboBoxButtonGroupProps = HTMLChakraProps<"div">;

/**
 * Props for ComboBox.Option component
 * Individual option within the combobox listbox
 */
export type ComboBoxOptionProps = Omit<
  ComboBoxOptionSlotProps,
  "children"
> & {
  /**
   * Unique identifier for the option
   */
  id: string;

  /**
   * Text value for the option (used for filtering and accessibility)
   * If not provided, defaults to string representation of children
   */
  textValue?: string;

  /**
   * Option content
   */
  children: ReactNode;
};

/**
 * Props for ComboBox.Section component
 * Groups related options together
 */
export type ComboBoxSectionProps = Omit<
  ComboBoxSectionSlotProps,
  "children"
> & {
  /**
   * Section title displayed as header
   */
  title?: string;

  /**
   * Unique identifier for the section
   */
  id: string;

  /**
   * Option children (should be ComboBox.Option components)
   */
  children: ReactNode;
};
```

---

## Phase 1.5: Update Slots File

### File: `combobox.slots.tsx` (UPDATE)

```typescript
import { createSlotRecipeContext } from "@chakra-ui/react";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "combobox",
});

// Root slot - container for entire combobox
export const ComboBoxRootSlot = withProvider("div", "root");

// Value slot - container for input + tags area
export const ComboBoxValueSlot = withContext("div", "value");

// Options slot - wrapper for listbox
export const ComboBoxOptionsSlot = withContext("div", "options");

// Option slot - individual option wrapper
export const ComboBoxOptionSlot = withContext("div", "option");

// Section slot - section grouping wrapper
export const ComboBoxSectionSlot = withContext("div", "section");
```

**Slot Purposes:**
- `ComboBoxRootSlot` - Applies recipe variants to entire component
- `ComboBoxValueSlot` - Styles the input/tags area with triggerRef for positioning
- `ComboBoxOptionsSlot` - Styles the popover content containing the listbox
- `ComboBoxOptionSlot` - Styles individual options
- `ComboBoxSectionSlot` - Styles section headers and containers

---

## Phase 2: Create Context and Root Component

### File: `combobox-context.tsx` (NEW)

```typescript
import { createContext, useContext } from "react";
import type { ComboBoxContextValue } from "./combobox.types";

export const ComboBoxContext = createContext<ComboBoxContextValue<any> | null>(
  null
);

export const useComboBoxContext = <T extends object>(): ComboBoxContextValue<T> => {
  const context = useContext(ComboBoxContext);
  if (!context) {
    throw new Error("ComboBox components must be used within ComboBox.Root");
  }
  return context as ComboBoxContextValue<T>;
};
```

### File: `components/combobox.root.tsx` (REPLACE)

```typescript
import { useMemo, useState, useCallback, useRef } from "react";
import { useId } from "react-aria";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { useListState } from "react-stately";
import { Item } from "react-aria-components";
import { ComboBoxContext } from "../combobox-context";
import { ComboBoxRootSlot } from "../combobox.slots";
import type { ComboBoxRootProps } from "../combobox.types";
import { extractStyleProps } from "@/utils";

/**
 * Default getKey implementation - tries item.key, item.id
 */
const defaultGetKey = <T extends object>(item: T): Key => {
  if ("key" in item && item.key != null) return item.key as Key;
  if ("id" in item && item.id != null) return item.id as Key;
  throw new Error(
    "Items must have a 'key' or 'id' property, or you must provide a getKey function"
  );
};

/**
 * Default getTextValue implementation - tries item.label, item.name, String(item)
 */
const defaultGetTextValue = <T extends object>(item: T): string => {
  if ("label" in item && typeof item.label === "string") return item.label;
  if ("name" in item && typeof item.name === "string") return item.name;
  return String(item);
};

/**
 * Normalize selectedKeys to Set for internal use (React Stately expects Sets)
 */
const normalizeSelectedKeys = (
  selectedKeys: Key | Key[] | undefined
): Set<Key> => {
  if (selectedKeys === undefined) return new Set();
  if (Array.isArray(selectedKeys)) return new Set(selectedKeys);
  return new Set([selectedKeys]);
};

/**
 * Denormalize Set to array/single key for external API
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

export const ComboBoxRoot = <T extends object>(
  props: ComboBoxRootProps<T>
) => {
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
    getNewOptionData,
    onCreateOption,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    leadingElement,
    isDisabled = false,
    isRequired = false,
    isInvalid = false,
    isReadOnly = false,
    children: rootChildren,
    ref,
    ...restProps
  } = functionalProps;

  // Generate stable ID for listbox (for aria-controls)
  const listboxId = useId();

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
  const [internalInputValue, setInternalInputValue] = useState(defaultInputValue);
  const inputValue = controlledInputValue ?? internalInputValue;

  // Track previous input value to detect changes
  const prevInputValueRef = useRef(inputValue);

  // Open state (controlled vs uncontrolled)
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);
  const isOpen = controlledIsOpen ?? internalIsOpen;

  // Unified setIsOpen that calls both internal state and callback
  const setIsOpen = useCallback((open: boolean) => {
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(open);
    }
    onOpenChange?.(open);
  }, [controlledIsOpen, onOpenChange]);

  // Handle input value changes with menuTrigger logic
  const handleInputChange = useCallback((value: string) => {
    if (onInputChange) {
      onInputChange(value);
    } else {
      setInternalInputValue(value);
    }

    // Open menu on input if menuTrigger is "input" and value changed
    if (menuTrigger === "input" && value !== prevInputValueRef.current) {
      setIsOpen(true);
    }

    prevInputValueRef.current = value;
  }, [onInputChange, menuTrigger, setIsOpen]);

  // Create filter function that captures inputValue
  const filterWithInput = useCallback(
    (nodes: Iterable<Node<T>>) => {
      const filterFn = customFilter ?? defaultFilter;
      return filterFn(nodes, inputValue);
    },
    [customFilter, inputValue]
  );

  // Create default children render function if not provided
  // Following Composed Children Pattern: if children provided, use it; otherwise use getTextValue
  const childrenWithDefault = useMemo(() => {
    // If children provided (function or static JSX), use it
    if (children) {
      return children;
    }

    // If no children but items provided, create default renderer using getTextValue
    if (items) {
      return (item: T) => {
        const textValue = getTextValue(item);
        return <Item textValue={textValue}>{textValue}</Item>;
      };
    }

    // Neither children nor items - will render static JSX children or error
    return undefined;
  }, [children, items, getTextValue]);

  // Sync external items prop with internal items when allowsCustomOptions and items change
  useEffect(() => {
    if (allowsCustomOptions && items) {
      setInternalItems(Array.from(items));
    }
  }, [allowsCustomOptions, items]);

  // Initialize useListState for collection and selection management
  const state = useListState({
    items: effectiveItems,
    children: childrenWithDefault,
    getKey,
    selectionMode,
    selectedKeys: normalizedSelectedKeys,
    onSelectionChange: (keys) => {
      // Denormalize Set back to Key | Key[] for external API
      const denormalized = denormalizeSelectedKeys(keys as Set<Key>, selectionMode);
      onSelectionChange?.(denormalized);

      // Single-select: close menu if shouldCloseOnSelect is true
      if (selectionMode === "single" && shouldCloseOnSelect) {
        setIsOpen(false);
      }

      // Multi-select: always clear input value after selection
      if (selectionMode === "multiple") {
        setInternalInputValue("");
        prevInputValueRef.current = "";
        // Also notify parent if controlled
        onInputChange?.("");
      }
    },
    filter: filterWithInput,
  });

  // Clear all selections
  const clearSelection = useCallback(() => {
    state.selectionManager.setSelectedKeys(new Set());
  }, [state]);

  // Remove specific key from selection
  const removeKey = useCallback(
    (key: Key) => {
      const currentKeys = state.selectionManager.selectedKeys;
      const newSelection = new Set(currentKeys);
      newSelection.delete(key);
      state.selectionManager.setSelectedKeys(newSelection);
    },
    [state]
  );

  // Handle creating a custom option
  // Based on react-select's creatable behavior
  const handleCreateOption = useCallback(() => {
    // Early return if feature is disabled
    if (!allowsCustomOptions) {
      return false;
    }

    // Validate getNewOptionData is provided
    if (!getNewOptionData) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          'ComboBox: allowsCustomOptions is enabled but getNewOptionData prop is not provided. ' +
          'Custom option creation will not work without getNewOptionData.'
        );
      }
      return false;
    }

    // Validate the input value
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) {
      return false;
    }

    // Check if input matches an existing option
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
      setInternalInputValue("");
      prevInputValueRef.current = "";
      onInputChange?.("");
    } else {
      const textValue = getTextValue(newItem);
      setInternalInputValue(textValue);
      prevInputValueRef.current = textValue;
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

  // Handle input focus - open if menuTrigger is "focus"
  const handleFocus = useCallback(() => {
    if (menuTrigger === "focus" && !isDisabled && !isReadOnly) {
      setIsOpen(true);
    }
  }, [menuTrigger, isDisabled, isReadOnly, setIsOpen]);

  // Handle blur - close menu if shouldCloseOnBlur
  const handleBlur = useCallback((e: React.FocusEvent) => {
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
  }, [shouldCloseOnBlur, setIsOpen]);

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
    const itemText = currentSelectedKey != null
      ? state.collection.getItem(currentSelectedKey)?.textValue ?? ''
      : '';

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

  const contextValue: ComboBoxContextValue<T> = useMemo(
    () => ({
      state,
      selectionMode,
      inputValue,
      setInputValue,
      isOpen,
      setIsOpen,
      listboxId,
      clearSelection,
      removeKey,
      handleCreateOption,
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
      setInputValue,
      isOpen,
      listboxId,
      clearSelection,
      removeKey,
      handleCreateOption,
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
    <ComboBoxContext.Provider value={contextValue}>
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
        {/* Internal: Value area (input + tags) - gets triggerRef and placeholder from context */}
        <ComboBoxValue />

        {/* Internal: Button group (clear + expand) */}
        <ComboBoxButtonGroup />

        {/*
          Internal: Popover containing options

          CRITICAL: Positioning strategy for modals/portals
          - positioning="fixed" ensures proper positioning in portals/modals
          - positionReference={triggerRef} keeps popover positioned relative to value area
          - This prevents the popover from floating when scrolling in modals
        */}
        <Popover.Root
          open={isOpen}
          onOpenChange={setIsOpen}
          positioning={{
            strategy: "fixed",
            placement: "bottom-start",
            gutter: 4,
          }}
          positionReference={triggerRef}
        >
          <Popover.Content>
            <ComboBoxOptions>
              {rootChildren}
            </ComboBoxOptions>
          </Popover.Content>
        </Popover.Root>
      </ComboBoxRootSlot>
    </ComboBoxContext.Provider>
  );
};

ComboBoxRoot.displayName = "ComboBox.Root";
```

---

## Phase 3: Create ComboBox.Value Component

### File: `components/combobox.value.tsx` (NEW)

```typescript
import { useCallback } from "react";
import { TagGroup } from "@/components/tag-group";
import { TextInput } from "@/components/text-input";
import { Stack } from "@/components/stack";
import { useComboBoxContext } from "../combobox-context";
import { ComboBoxValueSlot } from "../combobox.slots";
import type { ComboBoxValueProps } from "../combobox.types";
import { extractStyleProps } from "@/utils";

/**
 * # ComboBox.Value
 *
 * Renders the input area with selected tags (multi-select) or just input (single-select).
 *
 * **CRITICAL ARIA IMPLEMENTATION:**
 * The TextInput element MUST have these manually set attributes:
 * - role="combobox"
 * - aria-autocomplete="list"
 * - aria-controls={listboxId}
 * - aria-expanded={isOpen}
 * - aria-activedescendant={activeDescendantId}
 * - aria-labelledby={labelId}
 *
 * **Implementation Notes:**
 * - Gets triggerRef from context and applies it to the wrapper for popover positioning
 * - Gets placeholder from context
 * - No props needed from parent - all data comes from context
 *
 * @example
 * ```tsx
 * <ComboBox.Root placeholder="Select an option...">
 *   {/* ComboBoxValue is rendered internally by Root */}
 * </ComboBox.Root>
 * ```
 */

/**
 * @supportsStyleProps
 */
export const ComboBoxValue = (props: ComboBoxValueProps) => {
  const {
    state,
    selectionMode,
    inputValue,
    setInputValue,
    isOpen,
    setIsOpen,
    listboxId,
    removeKey,
    handleCreateOption,
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
  } = useComboBoxContext();

  const [styleProps, restProps] = extractStyleProps(props);

  // Get currently focused option key from selectionManager
  // This is used for aria-activedescendant to indicate which option has virtual focus
  const focusedKey = state.selectionManager.focusedKey;

  // Get selected items from state
  const selectedItems = Array.from(state.selectionManager.selectedKeys).map(
    (key) => state.collection.getItem(key)
  );

  // Keyboard handler for input
  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (selectionMode === "multiple") {
        // Backspace: Remove last tag if input is empty
        if (e.key === "Backspace" && inputValue === "" && selectedItems.length > 0) {
          e.preventDefault();
          const lastItem = selectedItems[selectedItems.length - 1];
          removeKey(lastItem.key);
          return;
        }

        // Arrow Left: Move focus to TagGroup if input is empty and at start
        if (
          e.key === "ArrowLeft" &&
          inputValue === "" &&
          (e.target as HTMLInputElement).selectionStart === 0
        ) {
          // Focus will be handled by TagGroup
          // This is a placeholder for focus management
          return;
        }
      }

      // Down Arrow: Open popup
      if (e.key === "ArrowDown" && !isOpen) {
        e.preventDefault();
        setIsOpen(true);
        return;
      }

      // Escape: Close popup
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
        return;
      }

      // Enter: Try to create custom option if no option is focused
      // If an option is focused, React Aria's ListBox will handle selection
      if (e.key === "Enter" && !state.selectionManager.focusedKey) {
        const created = handleCreateOption();
        if (created) {
          e.preventDefault();
          return;
        }
      }
    },
    [
      selectionMode,
      inputValue,
      selectedItems,
      isOpen,
      setIsOpen,
      removeKey,
      handleCreateOption,
      state.selectionManager.focusedKey,
    ]
  );

  // Single-select: Just render input
  if (selectionMode === "single") {
    return (
      <ComboBoxValueSlot ref={triggerRef} {...styleProps} {...restProps}>
        <TextInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          leadingElement={leadingElement}
          isDisabled={isDisabled}
          isRequired={isRequired}
          isInvalid={isInvalid}
          isReadOnly={isReadOnly}

          {/* CRITICAL: Manual ARIA attributes for WAI-ARIA compliance */}
          role="combobox"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={isOpen}
          aria-activedescendant={focusedKey ? String(focusedKey) : undefined}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
        />
      </ComboBoxValueSlot>
    );
  }

  // Multi-select: Render tags + input
  return (
    <ComboBoxValueSlot ref={triggerRef} {...styleProps} {...restProps}>
      <Stack direction="row" gap="200" wrap="wrap" alignItems="center">
        {selectedItems.length > 0 && (
          <TagGroup.Root
            selectionMode="multiple"
            onRemove={(keys) => {
              keys.forEach((key) => removeKey(key));
            }}
          >
            <TagGroup.TagList>
              {selectedItems.map((item) => (
                <TagGroup.Tag key={item.key} id={String(item.key)}>
                  {item.rendered}
                </TagGroup.Tag>
              ))}
            </TagGroup.TagList>
          </TagGroup.Root>
        )}

        <TextInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={selectedItems.length === 0 ? placeholder : undefined}
          leadingElement={leadingElement}
          flex="1 1 auto"
          minWidth="100px"
          isDisabled={isDisabled}
          isRequired={isRequired}
          isInvalid={isInvalid}
          isReadOnly={isReadOnly}

          {/* CRITICAL: Manual ARIA attributes for WAI-ARIA compliance */}
          role="combobox"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={isOpen}
          aria-activedescendant={focusedKey ? String(focusedKey) : undefined}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
        />
      </Stack>
    </ComboBoxValueSlot>
  );
};

ComboBoxValue.displayName = "ComboBox.Value";
```

---

## Phase 4: Create ComboBox.Options Component

### File: `components/combobox.options.tsx` (NEW)

```typescript
import { useCallback } from "react";
import type { Key } from "react";
import { ListBox, type Selection } from "react-aria-components";
import { useComboBoxContext } from "../combobox-context";
import { ComboBoxOptionsSlot } from "../combobox.slots";
import type { ComboBoxOptionsProps } from "../combobox.types";
import { extractStyleProps } from "@/utils";

/**
 * # ComboBox.Options (INTERNAL COMPONENT)
 *
 * Wraps React Aria's ListBox and renders option children.
 * This component is used internally by ComboBoxRoot and is not part of the public API.
 *
 * **CRITICAL ARIA IMPLEMENTATION:**
 * React Aria's ListBox automatically provides:
 * - role="listbox" on the container
 * - role="option" on each item (via ListBoxItem)
 * - aria-selected on selected items
 * - aria-activedescendant management automatically
 * - Unique IDs for each option automatically
 *
 * We only manually set:
 * - id on the ListBox (for aria-controls reference from input)
 */
export const ComboBoxOptions = (props: ComboBoxOptionsProps) => {
  const {
    state,
    listboxId,
    setIsOpen,
    isDisabled,
    isReadOnly,
    "aria-labelledby": ariaLabelledBy,
    renderEmptyState,
  } = useComboBoxContext();

  const [styleProps, functionalProps] = extractStyleProps(props);
  const { children, ...restProps } = functionalProps;

  const handleSelectionChange = useCallback(
    (keys: Selection) => {
      // Prevent selection changes in read-only mode
      if (isReadOnly) return;

      state.selectionManager.setSelectedKeys(keys as Set<Key>);

      // For single-select, close popup after selection
      if (state.selectionManager.selectionMode === "single") {
        setIsOpen(false);
      }
    },
    [state, setIsOpen, isReadOnly]
  );

  return (
    <ComboBoxOptionsSlot asChild {...styleProps}>
      <ListBox
        id={listboxId}
        aria-labelledby={ariaLabelledBy}
        items={state.collection}
        selectionMode={state.selectionManager.selectionMode}
        selectedKeys={state.selectionManager.selectedKeys}
        onSelectionChange={handleSelectionChange}
        isDisabled={isDisabled}  // React Aria handles disabled state
        renderEmptyState={renderEmptyState}  // Pass through to React Aria's ListBox
        {...restProps}
      >
        {children}
      </ListBox>
    </ComboBoxOptionsSlot>
  );
};

ComboBoxOptions.displayName = "ComboBox.Options";
```

---

## Phase 5: Create ComboBox.Option Component

### File: `components/combobox.option.tsx` (NEW)

```typescript
import { ListBoxItem as RaListBoxItem } from "react-aria-components";
import { ComboBoxOptionSlot } from "../combobox.slots";
import type { ComboBoxOptionProps } from "../combobox.types";
import { extractStyleProps } from "@/utils";

/**
 * # ComboBox.Option
 *
 * Individual option within the combobox listbox.
 * Wraps React Aria's ListBoxItem for automatic ARIA management.
 *
 * @example
 * ```tsx
 * <ComboBox.Root>
 *   <ComboBox.Option id="1">Option 1</ComboBox.Option>
 *   <ComboBox.Option id="2">Option 2</ComboBox.Option>
 * </ComboBox.Root>
 * ```
 */

/**
 * @supportsStyleProps
 */
export const ComboBoxOption = (props: ComboBoxOptionProps) => {
  const [styleProps, functionalProps] = extractStyleProps(props);
  const { id, children, textValue, ...restProps } = functionalProps;

  return (
    <ComboBoxOptionSlot asChild {...styleProps}>
      <RaListBoxItem id={id} textValue={textValue} {...restProps}>
        {children}
      </RaListBoxItem>
    </ComboBoxOptionSlot>
  );
};

ComboBoxOption.displayName = "ComboBox.Option";
```

---

## Phase 5.5: Create ComboBox.Section Component

### File: `components/combobox.section.tsx` (NEW)

```typescript
import { Section as RaSection } from "react-aria-components";
import { ComboBoxSectionSlot } from "../combobox.slots";
import type { ComboBoxSectionProps } from "../combobox.types";
import { extractStyleProps } from "@/utils";

/**
 * # ComboBox.Section
 *
 * Groups related options together with an optional title.
 * Wraps React Aria's Section for automatic ARIA management.
 *
 * @example
 * ```tsx
 * <ComboBox.Root>
 *   <ComboBox.Section title="Fruits" id="fruits">
 *     <ComboBox.Option id="apple">Apple</ComboBox.Option>
 *     <ComboBox.Option id="banana">Banana</ComboBox.Option>
 *   </ComboBox.Section>
 *   <ComboBox.Section title="Vegetables" id="vegetables">
 *     <ComboBox.Option id="carrot">Carrot</ComboBox.Option>
 *   </ComboBox.Section>
 * </ComboBox.Root>
 * ```
 */

/**
 * @supportsStyleProps
 */
export const ComboBoxSection = (props: ComboBoxSectionProps) => {
  const [styleProps, functionalProps] = extractStyleProps(props);
  const { id, title, children, ...restProps } = functionalProps;

  return (
    <ComboBoxSectionSlot asChild {...styleProps}>
      <RaSection id={id} {...restProps}>
        {title && <header>{title}</header>}
        {children}
      </RaSection>
    </ComboBoxSectionSlot>
  );
};

ComboBoxSection.displayName = "ComboBox.Section";
```

---

## Phase 6: Create ComboBox.ButtonGroup Component

### File: `components/combobox.button-group.tsx` (UPDATE)

```typescript
import { useIntl } from "react-intl";
import { IconButton } from "@/components/icon-button";
import { Icons } from "@/icons";
import { useComboBoxContext } from "../combobox-context";
import { messages } from "../combobox.i18n";
import type { ComboBoxButtonGroupProps } from "../combobox.types";
import { extractStyleProps } from "@/utils";

/**
 * # ComboBox.ButtonGroup
 *
 * Renders clear and expand buttons for the combobox.
 * Buttons are removed from tab sequence (tabIndex={-1}) per WAI-ARIA pattern.
 *
 * @supportsStyleProps
 *
 * @example
 * ```tsx
 * <ComboBox.Root>
 *   <ComboBox.Value />
 *   <ComboBox.ButtonGroup />
 * </ComboBox.Root>
 * ```
 */
export const ComboBoxButtonGroup = (props: ComboBoxButtonGroupProps) => {
  const intl = useIntl();
  const { state, isOpen, setIsOpen, clearSelection, isDisabled, isReadOnly } = useComboBoxContext();

  const [styleProps, restProps] = extractStyleProps(props);

  const hasSelection = state.selectionManager.selectedKeys.size > 0;
  const buttonsDisabled = isDisabled || isReadOnly;

  return (
    <div {...styleProps} {...restProps}>
      {hasSelection && (
        <IconButton
          aria-label={intl.formatMessage(messages.clearSelection)}
          size="sm"
          variant="ghost"
          onClick={clearSelection}
          isDisabled={buttonsDisabled}
          tabIndex={-1}  // Remove from tab sequence per WAI-ARIA pattern
        >
          <Icons.Close />
        </IconButton>
      )}

      <IconButton
        aria-label={intl.formatMessage(
          isOpen ? messages.closeOptions : messages.openOptions
        )}
        size="sm"
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        isDisabled={isDisabled}  // Expand button only disabled if isDisabled (not readOnly)
        tabIndex={-1}  // Remove from tab sequence per WAI-ARIA pattern
      >
        <Icons.KeyboardArrowDown />
      </IconButton>
    </div>
  );
};

ComboBoxButtonGroup.displayName = "ComboBox.ButtonGroup";
```

---

## Phase 6.5: Update i18n File

### File: `combobox.i18n.ts` (UPDATE)

```typescript
import { defineMessages } from "react-intl";

export const messages = defineMessages({
  clearSelection: {
    id: "Nimbus.ComboBox.clearSelection",
    description: "aria-label for clear selection button in ComboBox",
    defaultMessage: "Clear selection",
  },
  openOptions: {
    id: "Nimbus.ComboBox.openOptions",
    description: "aria-label for expand button when options are closed",
    defaultMessage: "Open options",
  },
  closeOptions: {
    id: "Nimbus.ComboBox.closeOptions",
    description: "aria-label for expand button when options are open",
    defaultMessage: "Close options",
  },
});
```

**Usage**: These messages are used in `ComboBoxButtonGroup` component to provide accessible labels for the clear and expand buttons.

---

## Phase 7: Create Filter Utilities

### File: `utils/filters.ts` (NEW)

```typescript
import type { Node } from "react-stately";

/**
 * Default text-based filter for combobox items
 * Filters individual items by their text content
 * Does NOT handle sections - use createSectionAwareFilter for that
 */
export const filterByText = <T extends object>(
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
 * Creates a section-aware filter function
 *
 * **Behavior:**
 * - Shows a section if ANY of its items match the filter
 * - Hides sections where NO items match
 * - Filters items within visible sections
 *
 * @param itemFilter - Function to determine if an individual item matches
 * @returns Filter function that handles sections appropriately
 *
 * @example Basic usage
 * ```tsx
 * import { createSectionAwareFilter } from "./utils/filters";
 *
 * const filter = createSectionAwareFilter((node, inputValue) => {
 *   const text = node.textValue?.toLowerCase() ?? "";
 *   return text.includes(inputValue.toLowerCase());
 * });
 *
 * <ComboBox.Root items={items} filter={filter} />
 * ```
 *
 * @example Custom matching logic
 * ```tsx
 * const fuzzyFilter = createSectionAwareFilter((node, inputValue) => {
 *   // Custom fuzzy matching logic
 *   return fuzzyMatch(node.textValue, inputValue);
 * });
 * ```
 */
export const createSectionAwareFilter = <T extends object>(
  itemFilter: (node: Node<T>, inputValue: string) => boolean
) => {
  return (nodes: Iterable<Node<T>>, inputValue: string): Iterable<Node<T>> => {
    if (!inputValue.trim()) return nodes;

    const result: Node<T>[] = [];

    for (const node of nodes) {
      // If this is a section node (has childNodes)
      if (node.type === "section" && node.childNodes) {
        // Filter the section's children
        const matchingChildren = Array.from(node.childNodes).filter((child) =>
          itemFilter(child, inputValue)
        );

        // Only include the section if it has matching children
        if (matchingChildren.length > 0) {
          // VERIFICATION NEEDED: Confirm React Aria respects filtered section nodes
          // This implementation pushes the section node, assuming React Aria's collection
          // system will only render the children that match the filter.
          //
          // During Phase 1 testing, verify:
          // 1. React Aria only renders matching children (not all children)
          // 2. Section titles still display when section has matches
          // 3. Empty sections don't render at all
          //
          // If React Aria renders ALL children regardless of filter, we may need to
          // rebuild the collection using useListState's filter differently
          result.push(node);
        }
      } else {
        // For non-section nodes (regular items), apply the filter directly
        if (itemFilter(node, inputValue)) {
          result.push(node);
        }
      }
    }

    return result;
  };
};

/**
 * Built-in section-aware text filter
 * Filters by text content and handles sections appropriately
 *
 * @example
 * ```tsx
 * import { filterByTextWithSections } from "./utils/filters";
 *
 * <ComboBox.Root
 *   items={items}
 *   filter={filterByTextWithSections}
 * >
 *   <ComboBox.Section title="Fruits">
 *     <ComboBox.Option id="apple">Apple</ComboBox.Option>
 *     <ComboBox.Option id="banana">Banana</ComboBox.Option>
 *   </ComboBox.Section>
 *   <ComboBox.Section title="Vegetables">
 *     <ComboBox.Option id="carrot">Carrot</ComboBox.Option>
 *   </ComboBox.Section>
 * </ComboBox.Root>
 * ```
 */
export const filterByTextWithSections = createSectionAwareFilter(
  <T extends object>(node: Node<T>, inputValue: string) => {
    const text = node.textValue?.toLowerCase() ?? "";
    const input = inputValue.toLowerCase();
    return text.includes(input);
  }
);

/**
 * Creates a filter that searches multiple properties
 *
 * @param getSearchableText - Function to extract all searchable text from an item
 * @returns Section-aware filter function
 *
 * @example
 * ```tsx
 * const filter = createMultiPropertyFilter((item) => {
 *   return [item.name, item.description, item.category].join(" ");
 * });
 *
 * <ComboBox.Root items={products} filter={filter} />
 * ```
 */
export const createMultiPropertyFilter = <T extends object>(
  getSearchableText: (item: T) => string
) => {
  return createSectionAwareFilter<T>((node, inputValue) => {
    if (!node.value) return false;
    const searchText = getSearchableText(node.value as T).toLowerCase();
    return searchText.includes(inputValue.toLowerCase());
  });
};
```

### File: `utils/index.ts` (UPDATE)

```typescript
export {
  filterByText,
  filterByTextWithSections,
  createSectionAwareFilter,
  createMultiPropertyFilter,
} from "./filters";
```

---

## Phase 8: Update Main Export File

### File: `combobox.tsx` (UPDATE)

```typescript
import { ComboBoxRoot } from "./components/combobox.root";
import { ComboBoxOption } from "./components/combobox.option";
import { ComboBoxSection } from "./components/combobox.section";

/**
 * # ComboBox
 *
 * A unified combobox component supporting both single-select and multi-select modes.
 * Implements the WAI-ARIA Editable Combobox With List Autocomplete pattern.
 *
 * **Architecture:**
 * - Uses React Aria Components with custom context orchestration
 * - Built on useListState from react-stately for collection and selection management
 * - React Aria's ListBox handles aria-activedescendant automatically
 * - DOM focus stays on input; visual focus managed by React Aria
 * - Follows Composed Children Pattern for maximum flexibility
 * - **Root internally renders all UI chrome** (value area, buttons, popover)
 *
 * **Public API:**
 * - ComboBox.Root - Main component with configuration and state
 * - ComboBox.Option - Individual option within listbox
 * - ComboBox.Section - Groups related options with optional title
 *
 * **Internal Components (NOT exported):**
 * - ComboBoxValue - Value area (input + tags for multi-select)
 * - ComboBoxOptions - Options listbox wrapper
 * - ComboBoxButtonGroup - Clear and expand buttons
 *
 * @example Single-select with automatic rendering
 * ```tsx
 * const items = [
 *   { id: 1, name: "Apple" },
 *   { id: 2, name: "Banana" }
 * ];
 *
 * <ComboBox.Root items={items} selectionMode="single" />
 * ```
 *
 * @example Multi-select with custom rendering
 * ```tsx
 * <ComboBox.Root items={items} selectionMode="multiple">
 *   {(item) => <ComboBox.Option id={item.id}>{item.name} - {item.price}</ComboBox.Option>}
 * </ComboBox.Root>
 * ```
 *
 * @example Static JSX children with sections
 * ```tsx
 * <ComboBox.Root selectionMode="single">
 *   <ComboBox.Section title="Fruits">
 *     <ComboBox.Option id="apple">Apple</ComboBox.Option>
 *     <ComboBox.Option id="banana">Banana</ComboBox.Option>
 *   </ComboBox.Section>
 *   <ComboBox.Section title="Vegetables">
 *     <ComboBox.Option id="carrot">Carrot</ComboBox.Option>
 *   </ComboBox.Section>
 * </ComboBox.Root>
 * ```
 */
export const ComboBox = {
  /**
   * # ComboBox.Root
   *
   * Root component providing context, state management, and all UI chrome.
   * Internally renders:
   * - Value area (input + tags for multi-select) - ComboBoxValue component
   * - Button group (clear and expand buttons) - ComboBoxButtonGroup component
   * - Popover containing the options listbox - ComboBoxOptions component
   *
   * **Children Rendering:**
   * - If `children` prop provided (function or JSX): uses it
   * - If `items` provided without `children`: uses `getTextValue` for automatic rendering
   * - Defaults: `getKey` tries `item.key ?? item.id`, `getTextValue` tries `item.label ?? item.name ?? String(item)`
   * - Children should only be ComboBox.Option or ComboBox.Section components
   *
   * **ARIA Implementation:**
   * - Generates unique IDs for listbox and label elements
   * - Manages aria-expanded state
   * - React Aria's ListBox handles aria-activedescendant automatically
   * - Input has role="combobox", aria-autocomplete="list", aria-controls, aria-expanded
   *
   * @example
   * ```tsx
   * <ComboBox.Root items={items} selectionMode="single" />
   * ```
   */
  Root: ComboBoxRoot,

  /**
   * # ComboBox.Option
   *
   * Individual option within the combobox listbox.
   * Wraps React Aria's ListBoxItem for automatic ARIA management.
   *
   * **ARIA Requirements:**
   * - React Aria automatically provides: role="option", aria-selected, unique IDs
   *
   * @example
   * ```tsx
   * <ComboBox.Option id="1">Option 1</ComboBox.Option>
   * ```
   */
  Option: ComboBoxOption,

  /**
   * # ComboBox.Section
   *
   * Groups related options together with an optional title.
   * Wraps React Aria's Section for automatic ARIA management.
   *
   * @example
   * ```tsx
   * <ComboBox.Section title="Fruits">
   *   <ComboBox.Option id="apple">Apple</ComboBox.Option>
   *   <ComboBox.Option id="banana">Banana</ComboBox.Option>
   * </ComboBox.Section>
   * ```
   */
  Section: ComboBoxSection,
};
```

---

## Phase 8: Update Barrel Exports

### File: `index.ts` (UPDATE)

```typescript
export { ComboBox } from "./combobox";
export { useComboBoxContext } from "./combobox-context";
export type {
  ComboBoxRootProps,
  ComboBoxOptionProps,
  ComboBoxSectionProps,
  ComboBoxContextValue,
  ComboBoxFilter,
} from "./combobox.types";
```

**Note:** Exporting `useComboBoxContext` enables advanced use cases:
- Creating custom option components with access to ComboBox state
- Building additional UI elements that react to selection/input state
- Creating extensions on top of ComboBox

Internal component prop types (ComboBoxValueProps, ComboBoxOptionsProps, ComboBoxButtonGroupProps) are kept in types file for internal use but not exported from the public API.

---

## Phase 9: Update Barrel Exports

### File: `index.ts` (UPDATE)

```typescript
export { ComboBox } from "./combobox";
export { useComboBoxContext } from "./combobox-context";
export type {
  ComboBoxRootProps,
  ComboBoxOptionProps,
  ComboBoxSectionProps,
  ComboBoxContextValue,
  ComboBoxFilter,
} from "./combobox.types";

// Filter utilities
export {
  filterByText,
  filterByTextWithSections,
  createSectionAwareFilter,
  createMultiPropertyFilter,
} from "./utils";
```

**Note:** Exporting filter utilities enables users to:
- Use built-in section-aware filtering (`filterByTextWithSections`)
- Create custom filters with section support (`createSectionAwareFilter`)
- Search multiple properties (`createMultiPropertyFilter`)
- Mix and match filtering strategies

---

## Phase 10: Delete Obsolete Files

Remove old single-select/multi-select implementations:

```bash
rm components/combobox.single-select-root.tsx
rm components/combobox.multi-select-root.tsx
rm components/combobox.autocomplete.tsx
rm components/combobox.popover-content.tsx
```

Keep these files (update if needed):
- `combobox.slots.tsx` - Updated in Phase 1.5
- `combobox.recipe.ts` - Update recipe if needed for new slot structure
- `combobox.i18n.ts` - Updated in Phase 6.5

---

## Phase 10.5: Register Recipe in Theme

### File: `packages/nimbus/src/theme/slot-recipes/index.ts` (UPDATE)

```typescript
// ... existing imports

export { comboboxSlotRecipe } from "@/components/combobox/combobox.recipe";

// ... other slot recipe exports
```

---

## ⚠️ CRITICAL: Recipe Registration is MANDATORY ⚠️

**DO NOT SKIP THIS STEP.** Without recipe registration, the ComboBox will render **completely unstyled** with NO visual feedback or error messages. This is an extremely common mistake that causes confusion.

### What Happens Without Registration:
- ❌ ComboBox renders as plain unstyled HTML
- ❌ All recipe variants (size, etc.) have NO effect
- ❌ NO CSS classes are generated
- ❌ NO error messages or warnings in console
- ❌ Component appears broken but code looks correct

### Registration Location:
**File**: `packages/nimbus/src/theme/slot-recipes/index.ts`
**Action**: Add export statement as shown above

### Verification Steps:
After registration, **MUST verify** in browser DevTools:
1. Open inspector on ComboBox element
2. Check for CSS classes with `.nimbus-combobox` prefix
3. Verify recipe variant classes (e.g., `.nimbus-combobox--size-md`)
4. Confirm slot classes on correct elements:
   - `.nimbus-combobox__root`
   - `.nimbus-combobox__value`
   - `.nimbus-combobox__options`
   - `.nimbus-combobox__option`

**If classes are missing**: Recipe is NOT registered. Go back and add the export.

---

---

## Phase 11: Update Stories

### File: `combobox.stories.tsx` (UPDATE)

Create new unified stories showing:
1. **Automatic rendering** - Simple items array with defaults
2. **Custom getTextValue** - Custom property extraction
3. **Custom render function** - Complex item rendering
4. **Static JSX children** - No items array
5. **Single-select basic usage**
6. **Multi-select with tags**
7. **Controlled vs uncontrolled**
8. **Custom filtering**
9. **ComboBox in Modal** - Tests positioning in portal (REGRESSION TEST)
10. **ComboBox in Drawer with Scroll** - Tests positioning when scrolling in portal (REGRESSION TEST)
11. **Keyboard navigation tests** (play functions)
12. **ARIA compliance tests** (play functions)
13. **Positioning validation tests** (play functions) - NEW

### Required Stories for Positioning Bug:

#### Story: ComboBox in Modal

```typescript
export const InModal: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const items = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      name: `Option ${i + 1}`,
    }));

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
          <Dialog.Content>
            <Dialog.Title>Select an Option</Dialog.Title>
            <Dialog.Description>
              The ComboBox should stay positioned relative to the input when
              scrolling the modal content.
            </Dialog.Description>

            <Stack direction="column" gap="400">
              <ComboBox.Root
                items={items}
                placeholder="Select an option..."
                selectionMode="single"
              />

              {/* Spacer to create scrollable content */}
              <div style={{ height: "800px", backgroundColor: "#f0f0f0" }}>
                Scrollable content area
              </div>
            </Stack>

            <Dialog.Actions>
              <Button onClick={() => setIsOpen(false)}>Close</Button>
            </Dialog.Actions>
          </Dialog.Content>
        </Dialog.Root>
      </>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Open modal", async () => {
      const openButton = canvas.getByRole("button", { name: "Open Modal" });
      await userEvent.click(openButton);

      await waitFor(() => {
        const dialog = within(document.body).getByRole("dialog");
        expect(dialog).toBeInTheDocument();
      });
    });

    await step("Open ComboBox popover", async () => {
      const dialog = within(document.body).getByRole("dialog");
      const combobox = within(dialog).getByRole("combobox");

      await userEvent.click(combobox);

      await waitFor(() => {
        const listbox = within(document.body).getByRole("listbox");
        expect(listbox).toBeInTheDocument();
      });
    });

    await step("Verify popover is positioned near combobox", async () => {
      const dialog = within(document.body).getByRole("dialog");
      const combobox = within(dialog).getByRole("combobox");
      const listbox = within(document.body).getByRole("listbox");

      const comboboxRect = combobox.getBoundingClientRect();
      const listboxRect = listbox.getBoundingClientRect();

      // Listbox should be positioned below combobox (within reasonable distance)
      const verticalDistance = listboxRect.top - comboboxRect.bottom;
      expect(verticalDistance).toBeGreaterThanOrEqual(0);
      expect(verticalDistance).toBeLessThan(20); // Gutter + small margin

      // Listbox should be horizontally aligned with combobox
      const horizontalDistance = Math.abs(listboxRect.left - comboboxRect.left);
      expect(horizontalDistance).toBeLessThan(5);
    });

    await step("Scroll modal and verify popover stays positioned", async () => {
      const dialog = within(document.body).getByRole("dialog");
      const combobox = within(dialog).getByRole("combobox");
      const listbox = within(document.body).getByRole("listbox");

      // Get initial positions
      const initialComboboxRect = combobox.getBoundingClientRect();
      const initialListboxRect = listbox.getBoundingClientRect();

      // Scroll the dialog content
      const dialogContent = dialog.querySelector('[role="dialog"] > div');
      if (dialogContent) {
        dialogContent.scrollTop = 100;
      }

      // Wait for position to update
      await waitFor(() => {
        const newComboboxRect = combobox.getBoundingClientRect();
        const newListboxRect = listbox.getBoundingClientRect();

        // After scroll, both should move together
        // The vertical distance between them should remain consistent
        const initialGap = initialListboxRect.top - initialComboboxRect.bottom;
        const newGap = newListboxRect.top - newComboboxRect.bottom;

        expect(Math.abs(newGap - initialGap)).toBeLessThan(2);
      });
    });
  },
};
```

#### Story: ComboBox in Drawer with Scroll

```typescript
export const InDrawerWithScroll: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const items = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      name: `Item ${i + 1}`,
    }));

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Drawer</Button>
        <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Filter Items</Drawer.Title>
            </Drawer.Header>

            <Drawer.Body>
              <Stack direction="column" gap="400">
                <Text>Scroll down to see ComboBox behavior</Text>

                {/* Spacer */}
                <div style={{ height: "400px" }} />

                <FormField label="Select Items">
                  <ComboBox.Root
                    items={items}
                    placeholder="Type to filter..."
                    selectionMode="multiple"
                  />
                </FormField>

                {/* More content */}
                <div style={{ height: "800px", backgroundColor: "#f0f0f0" }}>
                  More scrollable content
                </div>
              </Stack>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Root>
      </>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Open drawer", async () => {
      const openButton = canvas.getByRole("button", { name: "Open Drawer" });
      await userEvent.click(openButton);

      await waitFor(() => {
        const drawer = within(document.body).getByRole("dialog");
        expect(drawer).toBeInTheDocument();
      });
    });

    await step("Scroll to ComboBox", async () => {
      const drawer = within(document.body).getByRole("dialog");
      const drawerBody = drawer.querySelector('[data-part="body"]');

      if (drawerBody) {
        drawerBody.scrollTop = 400;
      }

      await waitFor(() => {
        const combobox = within(drawer).getByRole("combobox");
        expect(combobox).toBeVisible();
      });
    });

    await step("Open ComboBox and verify positioning", async () => {
      const drawer = within(document.body).getByRole("dialog");
      const combobox = within(drawer).getByRole("combobox");

      // Record position before opening
      const comboboxRect = combobox.getBoundingClientRect();

      await userEvent.click(combobox);

      await waitFor(() => {
        const listbox = within(document.body).getByRole("listbox");
        expect(listbox).toBeInTheDocument();

        const listboxRect = listbox.getBoundingClientRect();

        // Verify listbox is positioned relative to combobox
        const verticalDistance = listboxRect.top - comboboxRect.bottom;
        expect(verticalDistance).toBeGreaterThanOrEqual(0);
        expect(verticalDistance).toBeLessThan(20);
      });
    });

    await step("Scroll drawer and verify popover follows", async () => {
      const drawer = within(document.body).getByRole("dialog");
      const drawerBody = drawer.querySelector('[data-part="body"]');
      const listbox = within(document.body).getByRole("listbox");

      // Listbox should stay visible and positioned
      expect(listbox).toBeVisible();

      // Scroll drawer
      if (drawerBody) {
        drawerBody.scrollTop = 500;
      }

      // Verify listbox is still properly positioned after scroll
      await waitFor(() => {
        const combobox = within(drawer).getByRole("combobox");
        const comboboxRect = combobox.getBoundingClientRect();
        const listboxRect = listbox.getBoundingClientRect();

        const verticalDistance = listboxRect.top - comboboxRect.bottom;
        expect(verticalDistance).toBeGreaterThanOrEqual(0);
        expect(verticalDistance).toBeLessThan(20);
      });
    });
  },
};
```

### Key Test Scenarios:

**Functional Tests:**
- Verify aria-expanded changes when popup opens/closes
- Verify aria-activedescendant updates on option hover
- Verify aria-selected on selected options
- Verify role attributes on all elements
- Verify keyboard navigation (Arrow keys, Enter, Escape)
- Verify focus stays on input while navigating options

**Positioning Regression Tests (NEW):**
- Verify popover is positioned below combobox trigger
- Verify popover maintains horizontal alignment with trigger
- Verify popover stays positioned when scrolling in modal/drawer
- Verify popover updates position when trigger moves
- Verify popover uses fixed positioning strategy in portals
- Verify visual relationship between trigger and popover is maintained

---

## Phase 12: Update Documentation

### File: `combobox.mdx` (UPDATE)

Document:
- New unified API (single prop: `selectionMode`)
- Children rendering pattern (Composed Children Pattern)
- getKey and getTextValue functions
- Unified selectedKeys API (accepts Key or Set<Key>)
- WAI-ARIA compliance details
- Keyboard interactions
- Accessibility features
- Migration guide from old two-component approach

Include explicit section on ARIA implementation showing which attributes are required and why.

---

## Children Rendering Examples for Documentation

### Example 1: Automatic Rendering (Simplest)

```tsx
const items = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Banana" },
  { id: 3, name: "Orange" },
];

// Uses default getKey (item.id) and default getTextValue (item.name)
// Root internally renders value area, buttons, and popover
<ComboBox.Root items={items} placeholder="Select a fruit..." />
```

### Example 2: Custom getTextValue

```tsx
const items = [
  { productId: "prod-1", displayName: "MacBook Pro" },
  { productId: "prod-2", displayName: "iPad Air" },
];

const getKey = useCallback((item) => item.productId, []);
const getTextValue = useCallback((item) => item.displayName, []);

<ComboBox.Root
  items={items}
  getKey={getKey}
  getTextValue={getTextValue}
  placeholder="Select a product..."
/>
```

### Example 3: Custom Render Function

```tsx
const items = [
  { id: 1, name: "Apple", color: "red", price: "$1.99" },
  { id: 2, name: "Banana", color: "yellow", price: "$0.99" },
];

<ComboBox.Root items={items} placeholder="Select a fruit...">
  {(item) => (
    <ComboBox.Option id={item.id}>
      <Stack direction="row" gap="200" alignItems="center">
        <Badge colorPalette={item.color}>{item.name}</Badge>
        <Text>{item.price}</Text>
      </Stack>
    </ComboBox.Option>
  )}
</ComboBox.Root>
```

### Example 4: Static JSX Children

```tsx
<ComboBox.Root placeholder="Select a size...">
  <ComboBox.Option id="small">Small</ComboBox.Option>
  <ComboBox.Option id="medium">Medium</ComboBox.Option>
  <ComboBox.Option id="large">Large</ComboBox.Option>
</ComboBox.Root>
```

### Example 5: With FormField (Automatic Labeling)

```tsx
<FormField label="Product" description="Select a product">
  <ComboBox.Root
    items={products}
    placeholder="Select a product..."
    // No need to pass aria-labelledby or aria-label
    // FormField automatically provides aria-labelledby via context and cloneElement
  />
</FormField>
```

**How FormField Integration Works:**
- FormField provides label ID through React context
- FormField uses `React.cloneElement` to inject `aria-labelledby` prop automatically
- ComboBox receives the proper label connection without manual configuration
- This ensures labels are always correctly connected

### Example 6: Without FormField (aria-label)

```tsx
<ComboBox.Root
  items={items}
  aria-label="Select product"  // Use when no visible label exists
  placeholder="Select a product..."
/>
```

### Example 7: With Leading Element (Search Icon)

```tsx
<ComboBox.Root
  items={products}
  aria-label="Search products"
  placeholder="Search..."
  leadingElement={<Icons.Search />}
  selectionMode="single"
/>
```

### Example 8: Multi-select with Leading Element

```tsx
<ComboBox.Root
  items={products}
  aria-labelledby="products-label"
  placeholder="Select products..."
  leadingElement={<Icons.FilterList />}
  selectionMode="multiple"
/>
// Leading element stays visible even when tags are shown
```

### Example 9: Section-Aware Filtering

```tsx
import { filterByTextWithSections } from "@commercetools/nimbus";

<ComboBox.Root
  items={items}
  filter={filterByTextWithSections}
  placeholder="Search..."
>
  <ComboBox.Section title="Fruits">
    <ComboBox.Option id="apple">Apple</ComboBox.Option>
    <ComboBox.Option id="banana">Banana</ComboBox.Option>
    <ComboBox.Option id="orange">Orange</ComboBox.Option>
  </ComboBox.Section>
  <ComboBox.Section title="Vegetables">
    <ComboBox.Option id="carrot">Carrot</ComboBox.Option>
    <ComboBox.Option id="broccoli">Broccoli</ComboBox.Option>
  </ComboBox.Section>
</ComboBox.Root>
// Typing "app" shows only "Fruits" section with "Apple"
// "Vegetables" section is hidden because no items match
```

### Example 10: Custom Section-Aware Filter

```tsx
import { createSectionAwareFilter } from "@commercetools/nimbus";

// Custom fuzzy matching filter
const fuzzyFilter = createSectionAwareFilter((node, inputValue) => {
  const text = node.textValue?.toLowerCase() ?? "";
  const input = inputValue.toLowerCase();

  // Simple fuzzy match: all input characters must appear in order
  let textIndex = 0;
  for (const char of input) {
    textIndex = text.indexOf(char, textIndex);
    if (textIndex === -1) return false;
    textIndex++;
  }
  return true;
});

<ComboBox.Root items={items} filter={fuzzyFilter} />
// Typing "apl" matches "Apple" (fuzzy match)
```

### Example 11: Multi-Property Search

```tsx
import { createMultiPropertyFilter } from "@commercetools/nimbus";

const products = [
  { id: 1, name: "MacBook Pro", category: "Laptops", sku: "MBP-2023" },
  { id: 2, name: "iPad Air", category: "Tablets", sku: "IPA-2023" },
];

const filter = createMultiPropertyFilter((item) => {
  // Search across name, category, and SKU
  return [item.name, item.category, item.sku].join(" ");
});

<ComboBox.Root items={products} filter={filter} placeholder="Search products..." />
// Typing "laptop" matches by category
// Typing "MBP" matches by SKU
// Typing "MacBook" matches by name
```

### Example 12: Empty State with allowsEmptyMenu

```tsx
const products = [
  { id: "1", name: "MacBook Pro" },
  { id: "2", name: "iPad Air" },
];

// Default: menu closes when no results
<ComboBox.Root
  items={products}
  placeholder="Search products..."
  // allowsEmptyMenu={false} is the default
/>

// Show custom empty state message when no results
<ComboBox.Root
  items={products}
  placeholder="Search products..."
  allowsEmptyMenu={true}
  renderEmptyState={() => (
    <Box padding="400" textAlign="center">
      <Text color="fg.muted">No results found</Text>
      <Text color="fg.muted" fontSize="350">
        Try a different search term
      </Text>
    </Box>
  )}
/>
```

### Example 13: Creating Custom Options (Creatable)

```tsx
const [tags, setTags] = useState([
  { id: "1", label: "React" },
  { id: "2", label: "TypeScript" },
  { id: "3", label: "JavaScript" },
]);

// Basic creatable - allow creating any tag
<ComboBox.Root
  items={tags}
  selectionMode="multiple"
  placeholder="Add tags..."
  allowsCustomOptions={true}
  getNewOptionData={(inputValue) => ({
    id: `tag-${Date.now()}`,
    label: inputValue,
  })}
  onCreateOption={(inputValue) => {
    console.log(`Created new tag: ${inputValue}`);
    // Optionally persist to API
    // createTagAPI({ label: inputValue });
  }}
/>

// With custom validation - only allow hashtags
<ComboBox.Root
  items={tags}
  selectionMode="multiple"
  placeholder="Add hashtags..."
  allowsCustomOptions={true}
  isValidNewOption={(inputValue) => {
    return inputValue.startsWith('#') && inputValue.length > 1;
  }}
  getNewOptionData={(inputValue) => ({
    id: `tag-${Date.now()}`,
    label: inputValue,
  })}
  onCreateOption={(inputValue) => {
    toast.success(`Created hashtag: ${inputValue}`);
  }}
  renderEmptyState={() => (
    <Box padding="400" textAlign="center">
      <Text color="fg.muted">Type a hashtag and press Enter to create</Text>
      <Text color="fg.muted" fontSize="350">
        Hashtags must start with #
      </Text>
    </Box>
  )}
  allowsEmptyMenu={true}
/>

// Single-select creatable
<ComboBox.Root
  items={countries}
  selectionMode="single"
  placeholder="Select or create country..."
  allowsCustomOptions={true}
  getNewOptionData={(inputValue) => ({
    id: `country-${Date.now()}`,
    name: inputValue,
    code: inputValue.substring(0, 2).toUpperCase(),
  })}
  getTextValue={(item) => item.name}
  onCreateOption={async (inputValue) => {
    // Persist to backend
    await createCountryAPI({ name: inputValue });
    toast.success(`Added ${inputValue} to the database`);
  }}
/>
```

**How Custom Options Work:**
- When `allowsCustomOptions` is enabled, items are managed internally
- Press Enter on non-matching input to create new option
- New items are automatically added to the collection and selected
- Single-select: replaces selection and closes menu
- Multi-select: adds as tag, clears input, keeps menu open
- Use `isValidNewOption` to validate input before creation
- Use `getNewOptionData` to transform input into item object
- Use `onCreateOption` for side effects (API calls, notifications)

---

## Migration Guide for Consumers

### Before (Old API - Two Components):

```tsx
// Single-select
<ComboBox.SingleSelect items={items} />

// Multi-select
<ComboBox.MultiSelect items={items} />
```

### After (New API - Unified):

```tsx
// Single-select
<ComboBox.Root items={items} selectionMode="single" />

// Multi-select
<ComboBox.Root items={items} selectionMode="multiple" />
```

### API Changes Examples:

**Before (Sets):**
```tsx
const [selectedKeys, setSelectedKeys] = useState(new Set(["1", "2"]));

<ComboBox.MultiSelect
  selectedKeys={selectedKeys}
  onSelectionChange={(keys: Set<Key>) => {
    setSelectedKeys(keys);
    // Need to convert to array for JSON serialization
    const array = Array.from(keys);
  }}
/>
```

**After (Arrays):**
```tsx
const [selectedKeys, setSelectedKeys] = useState(["1", "2"]);

<ComboBox.Root
  selectionMode="multiple"
  selectedKeys={selectedKeys}
  onSelectionChange={(keys: Key[]) => {
    setSelectedKeys(keys);
    // Already an array - ready for JSON, localStorage, etc.
  }}
/>
```

### Breaking Changes:

1. **No more separate SingleSelect/MultiSelect components** - use `selectionMode` prop
2. **All UI chrome rendered internally** - no need to declare Value, ButtonGroup, or Popover components
3. **Children only accept Options/Sections** - Root internally handles all UI structure
4. **selectedKeys now uses arrays** - accepts `Key | Key[]`, returns `Key | Key[]` in callback (not Sets)
   - Single-select: `selectedKeys="id"` → `onSelectionChange(key: Key)`
   - Multi-select: `selectedKeys={["id1", "id2"]}` → `onSelectionChange(keys: Key[])`
5. **Input moved outside popover** for multi-select (automatically handled)
6. **getKey and getTextValue functions** instead of itemId/itemValue properties
7. **Children rendering pattern** - follows Composed Children Pattern for flexible rendering
8. **React Aria's ListBox** - properly implements WAI-ARIA combobox pattern with automatic aria-activedescendant
9. **Label handling via ARIA** - use `aria-label` or `aria-labelledby` instead of `label` prop

---

## Testing Checklist

### Functional Tests:
- [ ] Single-select: select item, clear, reselect
- [ ] **Single-select input sync**: Input value updates to match selected item's text when selection changes
- [ ] **Single-select clear**: Input value clears when selection is removed
- [ ] **Single-select controlled**: onInputChange called with selected item's text when selection changes in controlled mode
- [ ] Multi-select: add tags, remove tags, clear all
- [ ] **Multi-select input clear**: Input value clears after selecting an option (both controlled and uncontrolled)
- [ ] Filtering: type to filter options
- [ ] **allowsEmptyMenu=false** (default): Menu closes when filtered results are empty
- [ ] **allowsEmptyMenu=true**: Menu stays open even when filtered results are empty
- [ ] **renderEmptyState**: Custom empty state message displays when allowsEmptyMenu=true and no results
- [ ] **renderEmptyState**: Empty state NOT shown when allowsEmptyMenu=false (menu closes instead)
- [ ] Keyboard: Arrow keys, Enter, Escape, Backspace, Tab
- [ ] Focus management: focus stays on input
- [ ] Automatic rendering with default functions
- [ ] Custom getTextValue rendering
- [ ] Custom render function
- [ ] Static JSX children

### Custom Options (allowsCustomOptions) Tests:
- [ ] **Basic creation**: Enter key on non-matching input creates new option
- [ ] **Item addition**: New item added to internal items array
- [ ] **Single-select behavior**: New item selected, input updated to item text, menu closes
- [ ] **Multi-select behavior**: New item added as tag, input cleared, menu stays open
- [ ] **Duplicate prevention**: Enter on matching existing option text does NOT create duplicate
- [ ] **Empty input**: Enter on empty/whitespace-only input does NOT create option
- [ ] **isValidNewOption validation**: Only creates option when validation returns true
- [ ] **isValidNewOption rejection**: Does not create option when validation returns false
- [ ] **getNewOptionData transform**: Input value correctly transformed to item object
- [ ] **onCreateOption callback**: Called with input value when option created
- [ ] **No callback**: Works without onCreateOption (optional callback)
- [ ] **Focused option priority**: Enter key selects focused option instead of creating when option is focused
- [ ] **getKey integration**: New items use getKey function to extract unique keys
- [ ] **getTextValue integration**: New items use getTextValue for display and matching
- [ ] **Case-insensitive matching**: "apple" matches existing "Apple" (no duplicate)
- [ ] **External items sync**: When items prop changes, internal items update
- [ ] **Without allowsCustomOptions**: Enter key does NOT create options (feature disabled)
- [ ] **Missing getNewOptionData**: Does not create options even if allowsCustomOptions=true

### Open/Close Behavior Tests:
- [ ] **menuTrigger="focus"**: Menu opens when input receives focus
- [ ] **menuTrigger="input"** (default): Menu opens when user types
- [ ] **menuTrigger="manual"**: Menu only opens via button or ArrowDown key
- [ ] **shouldCloseOnBlur=true** (default): Menu closes when focus leaves combobox
- [ ] **shouldCloseOnBlur=false**: Menu stays open when clicking outside
- [ ] **shouldCloseOnSelect=true** (default, single-select): Menu closes after selecting option
- [ ] **shouldCloseOnSelect=false** (single-select): Menu stays open after selecting option
- [ ] **Multi-select**: Menu always stays open after selection (ignores shouldCloseOnSelect)
- [ ] **Controlled open state**: `isOpen` prop controls menu visibility
- [ ] **Uncontrolled open state**: `defaultOpen` prop sets initial state
- [ ] **onOpenChange callback**: Called when menu open state changes
- [ ] **Blur delay**: 150ms delay allows click events before closing menu
- [ ] **ArrowDown key**: Opens menu when closed
- [ ] **Escape key**: Closes menu when open

### ARIA Compliance Tests:
- [ ] Input has role="combobox"
- [ ] Input has aria-autocomplete="list"
- [ ] Input has aria-controls referencing listbox ID
- [ ] Input has aria-expanded tracking popup state
- [ ] **aria-activedescendant points to currently focused option ID**
- [ ] **aria-activedescendant value matches focusedKey from state.selectionManager**
- [ ] **aria-activedescendant updates as user navigates with arrow keys (up/down)**
- [ ] **aria-activedescendant is undefined when no option is focused**
- [ ] **aria-activedescendant value matches actual DOM id attribute of focused ListBoxItem**
- [ ] Listbox has role="listbox"
- [ ] Listbox has stable ID
- [ ] Options have role="option"
- [ ] Options have unique IDs
- [ ] Options have aria-selected attribute
- [ ] Buttons have tabindex="-1"
- [ ] Label relationship established via aria-labelledby
- [ ] Input without aria-label or aria-labelledby should warn (console)
- [ ] Focus stays on input during keyboard navigation
- [ ] Escape key closes popup and returns focus to input

### Accessibility Tests:
- [ ] Screen reader announces combobox role
- [ ] Screen reader announces popup state
- [ ] Screen reader announces active option
- [ ] Screen reader announces selection changes
- [ ] Keyboard-only navigation works
- [ ] Focus indicators visible

### Positioning Regression Tests (Bug Fix):
- [ ] **ComboBox in Modal**: Popover positioned correctly when opened in modal
- [ ] **ComboBox in Modal with Scroll**: Popover stays positioned when scrolling modal content
- [ ] **ComboBox in Drawer**: Popover positioned correctly when opened in drawer
- [ ] **ComboBox in Drawer with Scroll**: Popover follows combobox when scrolling drawer
- [ ] **Vertical Positioning**: Popover positioned below combobox with correct gutter spacing
- [ ] **Horizontal Alignment**: Popover left-aligned with combobox trigger
- [ ] **Position Updates**: Popover updates position when trigger element moves
- [ ] **Fixed Positioning Strategy**: Popover uses fixed positioning in portals
- [ ] **Visual Relationship**: Clear visual connection between trigger and popover maintained
- [ ] **Scroll Container Detection**: Works correctly in nested scroll containers

---

## Implementation Notes

### Key Technical Decisions:

1. **useListState Foundation** - Provides automatic collection building, selection management, and filtering
2. **Custom Context** - Orchestrates communication between Value, Options, and ButtonGroup
3. **Array-based API** - Public API uses arrays (`Key[]`), internally converts to/from Sets for React Stately
   - Better DX (more familiar, JSON serializable)
   - Normalizes `Key | Key[]` → `Set<Key>` on input
   - Denormalizes `Set<Key>` → `Key | Key[]` on callback (based on selectionMode)
4. **Composed Children Pattern** - Flexible children rendering with getKey/getTextValue functions
5. **React Aria's ListBox** - Properly implements WAI-ARIA combobox pattern with automatic aria-activedescendant
6. **Focus Management** - DOM focus stays on input, visual focus managed by React Aria
7. **Fixed Positioning for Portals** - Popover uses `strategy: "fixed"` with `positionReference` to maintain correct positioning in modals/drawers
   - **Bug Fix**: Prevents popover from floating when ComboBox is in a portal/modal/drawer
   - `triggerRef` on value area provides positioning reference
   - Popover automatically updates position on scroll/resize
   - Maintains visual relationship between trigger and options list
8. **Enhanced Open/Close State Management** - Replicates React Aria's useComboBoxState behavior
   - **menuTrigger modes**: "focus" (opens on focus), "input" (opens on typing), "manual" (button/key only)
   - **Controlled/Uncontrolled patterns**: Supports both `isOpen`/`onOpenChange` and `defaultOpen`
   - **shouldCloseOnBlur**: Controls blur behavior with 150ms delay to allow click events
   - **shouldCloseOnSelect**: Controls close-on-select for single-select (multi-select always stays open)
   - **Keyboard navigation**: ArrowDown opens menu, Escape closes it
   - **Blur delay mechanism**: 150ms setTimeout prevents premature closing when clicking options
9. **Input Value Synchronization** - Handles input value updates based on selection changes
   - **Single-select**: When selectedKey changes, input value automatically updates to selected item's textValue
     - Ref-based change detection via `lastSelectedKeyRef`
     - Respects controlled/uncontrolled pattern
     - Clears input when selection is removed
   - **Multi-select**: Input value always clears after selecting an option
     - Clears internal state directly (always)
     - Also calls `onInputChange("")` to notify parent in controlled mode
     - Keeps input separate from tag list for better UX
10. **Empty Menu Handling** - Controls menu behavior when filtered results are empty
   - **allowsEmptyMenu=false** (default): Menu automatically closes when `state.collection.size === 0`
   - **allowsEmptyMenu=true**: Menu stays open to show empty state content or messaging
   - Replicates React Aria's `allowsEmptyCollection` behavior
   - **renderEmptyState prop**: Custom render function passed through to React Aria's ListBox
     - Only renders when `allowsEmptyMenu=true` and collection is empty
     - Use Nimbus components (Box, Text) for consistent styling
     - Useful for showing "No results found" messages or search suggestions
11. **Custom Options Creation (allowsCustomOptions)** - Enables creating options on-the-fly based on react-select's creatable API
   - **Internal Items Management**: When enabled, items are managed internally in state
     - External `items` prop synced to internal state via useEffect
     - New items automatically added to internal array
     - Eliminates need for separate controlled/uncontrolled items arrays
   - **Three-prop API Pattern** (mirrors react-select):
     - `allowsCustomOptions`: Enable/disable custom option creation
     - `isValidNewOption(inputValue)`: Validate input before creation (optional)
     - `getNewOptionData(inputValue)`: Transform input to item object (required)
     - `onCreateOption(inputValue)`: Side effect callback (optional)
   - **Creation Logic**:
     - Enter key with no focused option triggers creation
     - Validates: non-empty, trimmed input
     - Checks for existing match (case-insensitive textValue comparison)
     - Calls isValidNewOption if provided
     - Creates item using getNewOptionData
     - Adds to internal items and selects automatically
   - **Selection Behavior**:
     - Single-select: replaces selection, updates input, closes menu
     - Multi-select: adds as tag, clears input, keeps menu open
   - **Integration with Existing Features**:
     - Uses component's getKey/getTextValue functions
     - Works with both controlled and uncontrolled selection
     - Focused option always takes priority (React Aria handles selection)

### Critical ARIA Requirements Summary:

```
Combobox Container (Value):
  └─ TextInput: role="combobox"
                aria-autocomplete="list"
                aria-controls={listboxId}
                aria-expanded={isOpen}
                aria-activedescendant={activeDescendantId}
                aria-labelledby={labelId}

Listbox Container (Options):
  └─ ul: id={listboxId}
         role="listbox"
         aria-labelledby={labelId}
    └─ li: id={optionId}
           role="option"
           aria-selected={boolean}
```

This structure ensures proper assistive technology support and WAI-ARIA compliance.

### aria-activedescendant Implementation:

The combobox input uses `aria-activedescendant` to indicate which option has virtual focus while the actual DOM focus remains on the input element.

**Implementation:**
```typescript
// In ComboBoxValue component
const focusedKey = state.selectionManager.focusedKey;

<TextInput
  aria-activedescendant={focusedKey ? String(focusedKey) : undefined}
  // ... other ARIA props
/>
```

**How it works:**
- `state.selectionManager.focusedKey` tracks which option currently has visual/virtual focus
- This value is automatically updated by React Aria's ListBox when user navigates with arrow keys
- The focusedKey is converted to string and used as the aria-activedescendant value
- When no option is focused (popup closed or no keyboard navigation yet), aria-activedescendant is undefined

**ID Pattern Verification Required:** During Phase 0 research, verify what ID pattern React Aria's `ListBoxItem` component uses for its DOM elements. The aria-activedescendant value must match the actual DOM `id` attribute of the focused option. If ListBoxItem doesn't automatically set IDs, explicitly set them in ComboBoxOption component.
