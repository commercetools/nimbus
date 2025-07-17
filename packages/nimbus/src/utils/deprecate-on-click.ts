/**
 * Utility type to mark onClick as deprecated in favor of onPress
 */
export type WithDeprecatedOnClick<T> = Omit<T, "onClick"> & {
  /**
   * @deprecated Use onPress instead of onClick for consistent cross-platform interactions
   */
  onClick?: React.MouseEventHandler<HTMLElement>;
};
