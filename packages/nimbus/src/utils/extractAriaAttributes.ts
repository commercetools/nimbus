/**
 * Extracts aria attributes from an object, separating them from other props
 * @param props The props object to separate
 * @returns A tuple containing [ariaAttributes, otherProps]
 */

const regexpData = /^aria-/;

export function extractAriaAttributes<T extends object>(
  props: T
): [Record<string, unknown>, Omit<T, string>] {
  const ariaAttributes: Record<string, unknown> = {};
  const otherProps = { ...props } as Record<string, unknown>;

  // Process only own properties
  Object.keys(props).forEach((key) => {
    if (
      Object.prototype.hasOwnProperty.call(props, key) &&
      regexpData.test(key)
    ) {
      ariaAttributes[key] = props[key as keyof T];
      delete otherProps[key];
    }
  });

  return [ariaAttributes, otherProps as Omit<T, string>];
}
