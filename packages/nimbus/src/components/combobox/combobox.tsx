// Export individual components
import { ComboBoxRoot } from "./components/combobox.root";
import { ComboBoxTrigger } from "./components/combobox.trigger";
import { ComboBoxTagGroup } from "./components/combobox.tag-group";
import { ComboBoxInput } from "./components/combobox.input";
import { ComboBoxPopover } from "./components/combobox.popover";
import { ComboBoxListBox } from "./components/combobox.listbox";
import { ComboBoxOption } from "./components/combobox.option";
import { ComboBoxSection } from "./components/combobox.section";
import {
  ComboBoxRootContext,
  useComboBoxRootContext,
} from "./components/combobox.root-context";

/**
 * ComboBox - A searchable, filterable selection component
 *
 * Supports single and multi-select modes with keyboard navigation,
 * custom filtering, and accessible interactions.
 *
 * @example Single-select with clear button
 * ```tsx
 * <ComboBox.Root items={items} selectionMode="single">
 *   <ComboBox.Trigger>
 *     <ComboBox.Input />
 *     <IconButton slot="toggle"><Icons.KeyboardArrowDown /></IconButton>
 *     <IconButton slot="clear"><Icons.Close /></IconButton>
 *   </ComboBox.Trigger>
 *   <ComboBox.Popover>
 *     <ComboBox.ListBox>
 *       {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
 *     </ComboBox.ListBox>
 *   </ComboBox.Popover>
 * </ComboBox.Root>
 * ```
 *
 * @example Multi-select with tags and clear button
 * ```tsx
 * <ComboBox.Root items={items} selectionMode="multiple">
 *   <ComboBox.Trigger>
 *     <ComboBox.TagGroup />
 *     <ComboBox.Input />
 *     <IconButton slot="toggle"><Icons.KeyboardArrowDown /></IconButton>
 *     <IconButton slot="clear"><Icons.Close /></IconButton>
 *   </ComboBox.Trigger>
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
   * Main container providing Nimbus context + React Aria contexts.
   * Does not render UI elements directly - only provides context for children.
   *
   * @example
   * ```tsx
   * <ComboBox.Root items={items}>
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
   */
  Root: ComboBoxRoot,

  /**
   * # ComboBox.Trigger
   *
   * Wrapper for the input trigger area.
   * Contains ComboBox.TagGroup, ComboBox.Input, and IconButton slots.
   *
   * @example
   * ```tsx
   * <ComboBox.Trigger>
   *   <ComboBox.TagGroup />
   *   <ComboBox.Input />
   *   <IconButton slot="toggle"><Icons.KeyboardArrowDown /></IconButton>
   *   <IconButton slot="clear"><Icons.Close /></IconButton>
   * </ComboBox.Trigger>
   * ```
   */
  Trigger: ComboBoxTrigger,

  /**
   * # ComboBox.TagGroup
   *
   * Displays selected tags in multi-select mode.
   * Automatically hidden in single-select mode.
   * Reads TagGroupContext from Nimbus context provider.
   *
   * @example
   * ```tsx
   * <ComboBox.TagGroup />
   * ```
   */
  TagGroup: ComboBoxTagGroup,

  /**
   * # ComboBox.Input
   *
   * Text input field for filtering and selection.
   * Reads InputContext from Nimbus context provider.
   *
   * @example
   * ```tsx
   * <ComboBox.Input />
   * ```
   */
  Input: ComboBoxInput,

  /**
   * # ComboBox.Popover
   *
   * Popover wrapper for the options list.
   * Reads PopoverContext from Nimbus context provider.
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
   * Container for options and option groups.
   * Reads ListBoxContext from Nimbus context provider.
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
   * Individual selectable option.
   *
   * @example
   * ```tsx
   * <ComboBox.Option>Option text</ComboBox.Option>
   * ```
   */
  Option: ComboBoxOption,

  /**
   * # ComboBox.Section
   *
   * Groups related options together with an optional heading.
   *
   * @example
   * ```tsx
   * <ComboBox.Section label="Category">
   *   <ComboBox.Option>Option 1</ComboBox.Option>
   *   <ComboBox.Option>Option 2</ComboBox.Option>
   * </ComboBox.Section>
   * ```
   */
  Section: ComboBoxSection,

  /**
   * # ComboBox.Context
   *
   * React context for providing custom ComboBox state from outside ComboBox.Root.
   * This is an advanced pattern for custom implementations that need to control
   * ComboBox behavior externally. Most use cases should use ComboBox.Root instead.
   *
   * @example
   * ```tsx
   * const customContextValue = {
   *   isOpen: true,
   *   setIsOpen: () => {},
   *   // ... other context values
   * };
   *
   * <ComboBox.Context.Provider value={customContextValue}>
   *  <ComboBox.Root>
   *   <ComboBox.Input />
   *   <ComboBox.Popover>
   *     <ComboBox.ListBox />
   *   </ComboBox.Popover>
   *  </ComboBox.Root>
   * </ComboBox.Context.Provider>
   * ```
   */
  Context: ComboBoxRootContext,

  /**
   * # ComboBox.useContext
   *
   * Hook to access ComboBox context. Must be used within ComboBox.Root or ComboBox.Context.Provider.
   * Throws an error if used outside of a context provider.
   *
   * @example
   * ```tsx
   * const MyCustomTrigger = () => {
   *   const { isOpen, setIsOpen } = ComboBox.useContext();
   *   return (
   *     <button onClick={() => setIsOpen(!isOpen)}>
   *       {isOpen ? 'Close' : 'Open'} Options
   *     </button>
   *   );
   * };
   *
   * <ComboBox.Root>
   *   <MyCustomTrigger />
   * </ComboBox.Root>
   * ```
   */
  useContext: useComboBoxRootContext,
};
