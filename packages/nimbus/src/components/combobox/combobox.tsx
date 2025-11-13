import {
  ComboBoxRoot,
  ComboBoxOptionGroup,
  ComboBoxOption,
} from "./components";

export const ComboBox = {
  /**
   * # ComboBox.Root
   *
   * The root container for the combobox component. Provides state management and configuration
   * for all child parts. Supports both single and multiple selection modes.
   *
   * @example
   * ```tsx
   * <ComboBox.Root>
   *   <ComboBox.Option>Option 1</ComboBox.Option>
   *   <ComboBox.Option>Option 2</ComboBox.Option>
   * </ComboBox.Root>
   * ```
   */
  Root: ComboBoxRoot,
  /**
   * # ComboBox.OptionGroup
   *
   * Groups related options together with an optional label. Used to organize options into
   * logical sections within the combobox dropdown.
   *
   * @example
   * ```tsx
   * <ComboBox.Root>
   *   <ComboBox.OptionGroup label="Fruits">
   *     <ComboBox.Option>Apple</ComboBox.Option>
   *     <ComboBox.Option>Banana</ComboBox.Option>
   *   </ComboBox.OptionGroup>
   * </ComboBox.Root>
   * ```
   */
  OptionGroup: ComboBoxOptionGroup,
  /**
   * # ComboBox.Option
   *
   * An individual selectable option within the combobox. Displays a checkbox indicator
   * in multiple selection mode and supports custom content rendering.
   *
   * @example
   * ```tsx
   * <ComboBox.Root>
   *   <ComboBox.Option>Option 1</ComboBox.Option>
   *   <ComboBox.Option>Option 2</ComboBox.Option>
   * </ComboBox.Root>
   * ```
   */
  Option: ComboBoxOption,
};
