import { defaultSystem } from "@chakra-ui/react";

/**
 * Extracts chakra-ui style-props from an object, separating them from other props
 * @param props The props object to separate
 * @returns A tuple containing [styleProps, otherProps]
 */
export function extractStyleProps<T extends object>(
  props: T
): [Record<string, unknown>, Omit<T, string>] {
  const styleProps: Record<string, unknown> = {};
  const otherProps = { ...props } as Record<string, unknown>;

  // Process only own properties
  Object.keys(props).forEach((key) => {
    if (
      Object.prototype.hasOwnProperty.call(props, key) &&
      defaultSystem.isValidProperty(key)
    ) {
      styleProps[key] = props[key as keyof T];
      delete otherProps[key];
    }
  });

  return [styleProps, otherProps as Omit<T, string>];
}
