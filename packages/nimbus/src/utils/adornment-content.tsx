import {
  Provider,
  ButtonContext,
  GroupContext,
  InputContext,
  LabelContext,
  TextContext,
} from "react-aria-components";

/**
 * Isolates consumer-provided field adornments (`leadingElement` /
 * `trailingElement`) from the React Aria contexts a field component provides to
 * its own children.
 *
 * Composite fields such as `SearchField`, `ComboBox` and `Select` publish props
 * to their internal parts through context. Consumer content rendered inside the
 * field would pick those props up:
 *
 * - a button passed to `SearchInput` inherits the clear button's props via
 *   `ButtonContext`, rendering with `tabindex="-1"` and clearing the field
 *   instead of running its own handler
 * - a button passed to `ComboBox` hits a `ButtonContext` configured with the
 *   `slots` pattern, which requires a matching `slot` prop the consumer has no
 *   reason to pass
 *
 * The context list matches the one ComboBox already clears for its popover
 * content, so field subtrees that must not inherit field props are treated
 * consistently.
 *
 * @internal
 */
export const AdornmentContent = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <Provider
    values={[
      [LabelContext, null],
      [ButtonContext, null],
      [InputContext, null],
      [GroupContext, null],
      [TextContext, null],
    ]}
  >
    {children}
  </Provider>
);
