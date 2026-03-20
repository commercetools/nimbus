import { system } from "@/theme";

// Cache for isValidProperty lookups — property names are finite and reused across renders
const validPropertyCache = new Map<string, boolean>();

function isStyleProperty(key: string): boolean {
  let cached = validPropertyCache.get(key);
  if (cached === undefined) {
    cached = system.isValidProperty(key);
    validPropertyCache.set(key, cached);
  }
  return cached;
}

/**
 * Extracts chakra-ui style-props from an object, separating them from other props
 * @param props The props object to separate
 * @returns A tuple containing [styleProps, otherProps]
 */
export function extractStyleProps<T extends object>(
  props: T
): [Record<string, unknown>, Omit<T, string>] {
  const styleProps: Record<string, unknown> = {};
  const otherProps: Record<string, unknown> = {};

  const keys = Object.keys(props);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = (props as Record<string, unknown>)[key];
    if (isStyleProperty(key)) {
      styleProps[key] = value;
    } else {
      otherProps[key] = value;
    }
  }

  return [styleProps, otherProps as Omit<T, string>];
}
