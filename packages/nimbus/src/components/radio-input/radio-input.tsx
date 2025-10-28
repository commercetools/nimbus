import {
  RadioInputRoot as _RadioInputRoot,
  RadioInputOption as _RadioInputOption,
} from "./components";

export const RadioInput = {
  /**
   * # RadioInput.Root
   *
   * The root container for a radio input group that manages the selection state and provides context for radio options.
   * Handles keyboard navigation, accessibility attributes, and mutually exclusive selection behavior.
   *
   * @example
   * ```tsx
   * <RadioInput.Root name="selection" defaultValue="option1">
   *   <RadioInput.Option value="option1">First Choice</RadioInput.Option>
   *   <RadioInput.Option value="option2">Second Choice</RadioInput.Option>
   * </RadioInput.Root>
   * ```
   */
  Root: _RadioInputRoot,

  /**
   * # RadioInput.Option
   *
   * An individual radio option within a RadioInput group that can be selected.
   * Provides visual feedback for selection state and supports keyboard interaction.
   *
   * @example
   * ```tsx
   * <RadioInput.Root name="choice">
   *   <RadioInput.Option value="yes">Yes</RadioInput.Option>
   *   <RadioInput.Option value="no">No</RadioInput.Option>
   * </RadioInput.Root>
   * ```
   */
  Option: _RadioInputOption,
};

export { _RadioInputRoot, _RadioInputOption };
