import { system } from "@/theme";

// Cache for isValidProperty lookups — property names are finite and reused across renders
// Using Object.create(null) for prototype-free lookup (faster than Map for string keys)
const validPropertyCache: Record<string, boolean> = Object.create(null);

function isStyleProperty(key: string): boolean {
  if (key in validPropertyCache) {
    return validPropertyCache[key];
  }
  const result = system.isValidProperty(key);
  validPropertyCache[key] = result;
  return result;
}

/**
 * Extracts chakra-ui style-props from an object, separating them from other props
 * @param props The props object to separate
 * @returns A tuple containing [styleProps, otherProps]
 */
const EMPTY_STYLE_PROPS: Record<string, unknown> = {};

export function extractStyleProps<T extends object>(
  props: T
): [Record<string, unknown>, Omit<T, string>] {
  const keys = Object.keys(props);
  if (keys.length === 0) {
    return [EMPTY_STYLE_PROPS, props as Omit<T, string>];
  }

  let styleProps: Record<string, unknown> | undefined;
  const otherProps: Record<string, unknown> = {};

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = (props as Record<string, unknown>)[key];
    if (isStyleProperty(key)) {
      if (!styleProps) styleProps = {};
      styleProps[key] = value;
    } else {
      otherProps[key] = value;
    }
  }

  return [styleProps ?? EMPTY_STYLE_PROPS, otherProps as Omit<T, string>];
}
