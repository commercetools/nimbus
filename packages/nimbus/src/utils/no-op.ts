/**
 * A no-operation function that does nothing.
 * Useful as a default callback or placeholder function.
 *
 * @example
 * ```tsx
 * const MyComponent = ({ onClick = noop }: { onClick?: () => void }) => (
 *   <button onClick={onClick}>Click me</button>
 * );
 * ```
 */
export const noop = (): void => {
  // Intentionally empty
};
