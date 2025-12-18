// Export individual components
import {
  ComboBoxRoot,
  ComboBoxTrigger,
  ComboBoxPopover,
  ComboBoxListBox,
  ComboBoxOption,
  ComboBoxSection,
} from "./components";

// Export filter utilities
import {
  filterByText,
  filterByStartsWith,
  filterByCaseSensitive,
  filterByWordBoundary,
  filterByFuzzy,
  createMultiPropertyFilter,
  createRankedFilter,
  createMultiTermFilter,
  createSectionAwareFilter,
} from "./utils/filters";

/**
 * # ComboBox
 * ============================================================
 *
 * A searchable, filterable selection component with single and multi-select support.
 * Built with React Aria Components for accessibility and keyboard navigation.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/inputs/combobox}
 *
 * @example
 * ```tsx
 * <ComboBox.Root items={items}>
 *   <ComboBox.Trigger />
 *   <ComboBox.Popover>
 *     <ComboBox.ListBox>
 *       {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
 *     </ComboBox.ListBox>
 *   </ComboBox.Popover>
 * </ComboBox.Root>
 * ```
 */
export const ComboBox = {
  /**
   * # ComboBox.Root
   *
   * The root component that provides state management and context for the combobox.
   * Handles selection state, input filtering, popover open/close, and keyboard navigation.
   *
   * @example
   * ```tsx
   * <ComboBox.Root items={items}>
   *   <ComboBox.Trigger />
   *   <ComboBox.Popover>
   *     <ComboBox.ListBox>
   *       {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
   *     </ComboBox.ListBox>
   *   </ComboBox.Popover>
   * </ComboBox.Root>
   * ```
   */
  Root: ComboBoxRoot,

  /**
   * # ComboBox.Trigger
   *
   * The trigger element that contains the input field and controls for the combobox.
   * Automatically renders tag group (multi-select), input field, toggle button, and clear button.
   *
   * @example
   * ```tsx
   * <ComboBox.Root items={items}>
   *   <ComboBox.Trigger />
   *   <ComboBox.Popover>...</ComboBox.Popover>
   * </ComboBox.Root>
   * ```
   */
  Trigger: ComboBoxTrigger,

  /**
   * # ComboBox.Popover
   *
   * The popover container that displays the dropdown options list.
   * Renders in a React portal and handles positioning relative to the trigger.
   *
   * @example
   * ```tsx
   * <ComboBox.Popover>
   *   <ComboBox.ListBox>
   *     {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
   *   </ComboBox.ListBox>
   * </ComboBox.Popover>
   * ```
   */
  Popover: ComboBoxPopover,

  /**
   * # ComboBox.ListBox
   *
   * The container for dropdown options that displays filtered results.
   *
   * Use the render prop pattern - do **NOT** manually map over items as this is less performant.
   *
   * @example
   * ```tsx
   * <ComboBox.ListBox>
   *   {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
   * </ComboBox.ListBox>
   * ```
   */
  ListBox: ComboBoxListBox,

  /**
   * # ComboBox.Option
   *
   * An individual selectable option within the listbox.
   * Displays a checkmark indicator for selected items in multi-select mode.
   *
   * @example
   * ```tsx
   * <ComboBox.Option>Option text</ComboBox.Option>
   * ```
   *
   * @example Render prop pattern
   * ```tsx
   * <ComboBox.Option>
   *   {({ isSelected }) => (
   *     <span>Option 1 {isSelected && "✓"}</span>
   *   )}
   * </ComboBox.Option>
   * ```
   */
  Option: ComboBoxOption,

  /**
   * # ComboBox.Section
   *
   * Groups related options together with an optional heading.
   * Supports render prop pattern for dynamic option rendering within sections.
   *
   * @example
   * ```tsx
   * <ComboBox.Section label="Category Name">
   *   <ComboBox.Option id="opt-1">Option 1</ComboBox.Option>
   *   <ComboBox.Option id="opt-2">Option 2</ComboBox.Option>
   * </ComboBox.Section>
   * ```
   *
   * @example Render prop pattern
   * ```tsx
   * <ComboBox.Section items={categoryItems}>
   *   {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
   * </ComboBox.Section>
   * ```
   */
  Section: ComboBoxSection,

  /**
   * # ComboBox.filters
   *
   * Built-in filter functions and utilities for customizing ComboBox filtering behavior.
   * These filters can be passed to the `filter` prop on ComboBox.Root to control how options are filtered based on user input.
   *
   * **Available Filters:**
   * - `filterByText`: Default substring matching (case-insensitive)
   * - `filterByStartsWith`: Prefix matching
   * - `filterByCaseSensitive`: Exact case substring matching
   * - `filterByWordBoundary`: Word boundary matching
   * - `filterByFuzzy`: Fuzzy matching (characters in order)
   * - `createMultiPropertyFilter`: Search across multiple object properties
   * - `createRankedFilter`: Custom scoring/ranking logic
   * - `createMultiTermFilter`: OR logic for multiple search terms
   * - `createSectionAwareFilter`: Preserves section structure while filtering
   *
   * @example Basic filter usage
   * ```tsx
   * import { ComboBox } from '@commercetools/nimbus';
   *
   * function MyComponent() {
   *   return (
   *     <ComboBox.Root
   *       items={items}
   *       filter={ComboBox.filters.filterByStartsWith}
   *     >
   *       <ComboBox.Trigger />
   *       <ComboBox.Popover>
   *         <ComboBox.ListBox>
   *           {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
   *         </ComboBox.ListBox>
   *       </ComboBox.Popover>
   *     </ComboBox.Root>
   *   );
   * }
   * ```
   *
   * @example Multi-property search
   * ```tsx
   * const productFilter = ComboBox.filters.createMultiPropertyFilter<Product>([
   *   'name',
   *   'category',
   *   'description'
   * ]);
   *
   * function ProductSearch() {
   *   return (
   *     <ComboBox.Root items={products} filter={productFilter}>
   *       <ComboBox.Trigger />
   *       <ComboBox.Popover>
   *         <ComboBox.ListBox>
   *           {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
   *         </ComboBox.ListBox>
   *       </ComboBox.Popover>
   *     </ComboBox.Root>
   *   );
   * }
   * ```
   *
   * @example Section-aware filtering
   * ```tsx
   * const sectionFilter = ComboBox.filters.createSectionAwareFilter(
   *   ComboBox.filters.filterByFuzzy
   * );
   *
   * function SectionedSearch() {
   *   return (
   *     <ComboBox.Root items={sectionsWithItems} filter={sectionFilter}>
   *       <ComboBox.Trigger />
   *       <ComboBox.Popover>
   *         <ComboBox.ListBox>
   *           {(section) => (
   *             <ComboBox.Section>
   *               {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
   *             </ComboBox.Section>
   *           )}
   *         </ComboBox.ListBox>
   *       </ComboBox.Popover>
   *     </ComboBox.Root>
   *   );
   * }
   * ```
   */
  filters: {
    filterByText,
    filterByStartsWith,
    filterByCaseSensitive,
    filterByWordBoundary,
    filterByFuzzy,
    createMultiPropertyFilter,
    createRankedFilter,
    createMultiTermFilter,
    createSectionAwareFilter,
  },
};
