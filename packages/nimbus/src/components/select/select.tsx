import { SelectRoot as _SelectRoot } from "./components/select.root";
import { SelectOptions as _SelectOptions } from "./components/select.options";
import { SelectOption as _SelectOption } from "./components/select.option";
import { SelectOptionGroup as _SelectOptionGroup } from "./components/select.option-group";

/**
 * Select
 * ============================================================
 * A versatile select component for choosing one or more options from a list.
 * Built with React Aria Components for accessibility and WCAG 2.1 AA compliance.
 *
 * Features:
 * - Single and multiple selection modes
 * - Searchable with filtering support
 * - Keyboard navigation and shortcuts
 * - Loading states and async data
 * - Grouped options
 * - Clear button functionality
 * - Customizable variants and sizes
 * - Portal rendering for dropdown
 *
 * @example
 * ```tsx
 * <Select.Root>
 *   <Select.Options placeholder="Select an option">
 *     <Select.Option id="1">Option 1</Select.Option>
 *     <Select.Option id="2">Option 2</Select.Option>
 *     <Select.Option id="3">Option 3</Select.Option>
 *   </Select.Options>
 * </Select.Root>
 * ```
 *
 * @see https://react-spectrum.adobe.com/react-aria/Select.html
 */
export const Select = {
  /**
   * # Select.Root
   *
   * The root component that provides context and state management for the select.
   * Uses React Aria's Select for accessibility and keyboard interaction.
   *
   * This component must wrap all select parts (Options, Option, etc.) and provides
   * the select state, variant styling context, and selection management.
   *
   * @example
   * ```tsx
   * <Select.Root>
   *   <Select.Options placeholder="Choose...">
   *     <Select.Option id="apple">Apple</Select.Option>
   *     <Select.Option id="orange">Orange</Select.Option>
   *   </Select.Options>
   * </Select.Root>
   * ```
   */
  Root: _SelectRoot,
  /**
   * # Select.Options
   *
   * The trigger button and dropdown container for select options.
   * Displays the selected value and opens the options list when activated.
   *
   * This component handles the visual presentation of the select, including
   * the trigger button, selected value display, dropdown icon, and the
   * popover containing options.
   *
   * @example
   * ```tsx
   * <Select.Root>
   *   <Select.Options
   *     placeholder="Select fruit"
   *     label="Favorite Fruit"
   *   >
   *     <Select.Option id="apple">Apple</Select.Option>
   *     <Select.Option id="banana">Banana</Select.Option>
   *   </Select.Options>
   * </Select.Root>
   * ```
   */
  Options: _SelectOptions,
  /**
   * # Select.Option
   *
   * An individual selectable option within the select dropdown.
   * Represents a single choice that can be selected by the user.
   *
   * Options automatically handle selection state, keyboard navigation,
   * and visual feedback for hover and selection states.
   *
   * @example
   * ```tsx
   * <Select.Options>
   *   <Select.Option id="red" textValue="Red">
   *     🔴 Red
   *   </Select.Option>
   *   <Select.Option id="blue" textValue="Blue">
   *     🔵 Blue
   *   </Select.Option>
   * </Select.Options>
   * ```
   */
  Option: _SelectOption,
  /**
   * # Select.OptionGroup
   *
   * A container for grouping related options with an optional label.
   * Provides visual separation and semantic grouping of options.
   *
   * Option groups help organize large lists of options into logical
   * categories with proper accessibility support.
   *
   * @example
   * ```tsx
   * <Select.Options>
   *   <Select.OptionGroup label="Fruits">
   *     <Select.Option id="apple">Apple</Select.Option>
   *     <Select.Option id="banana">Banana</Select.Option>
   *   </Select.OptionGroup>
   *   <Select.OptionGroup label="Vegetables">
   *     <Select.Option id="carrot">Carrot</Select.Option>
   *     <Select.Option id="broccoli">Broccoli</Select.Option>
   *   </Select.OptionGroup>
   * </Select.Options>
   * ```
   */
  OptionGroup: _SelectOptionGroup,
};

/**
 * todo: get rid of this, this is needed for the react-docgen-typescript script
 * that is parsing the typescript types for our documentation. The _ underscores
 * serve as a reminder that this exports are awkward and should not be used.
 */
export { _SelectRoot, _SelectOptions, _SelectOption, _SelectOptionGroup };
