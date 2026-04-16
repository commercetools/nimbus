/**
 * Padding style prop keys recognised by Chakra UI.
 * Used to forward padding from a parent slot to an inner slot
 * (e.g. ScrollArea Root → Content).
 */
const PADDING_PROP_KEYS = new Set([
  "p",
  "pt",
  "pr",
  "pb",
  "pl",
  "ps",
  "pe",
  "px",
  "py",
  "padding",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "paddingX",
  "paddingY",
  "paddingInline",
  "paddingBlock",
  "paddingInlineStart",
  "paddingInlineEnd",
  "paddingBlockStart",
  "paddingBlockEnd",
  "paddingStart",
  "paddingEnd",
]);

/**
 * Extracts padding style-props from an object, separating them from other props.
 * Responsive values (arrays and objects like `{ base: "200", md: "400" }`)
 * are supported — they are extracted by key name unchanged.
 * @param props The props object to separate
 * @returns A tuple containing [paddingProps, otherProps]
 */
export function extractPaddingProps<T extends object>(
  props: T
): [Record<string, unknown>, Omit<T, string>] {
  const paddingProps: Record<string, unknown> = {};
  const otherProps = { ...props } as Record<string, unknown>;

  Object.keys(props).forEach((key) => {
    if (
      Object.prototype.hasOwnProperty.call(props, key) &&
      PADDING_PROP_KEYS.has(key)
    ) {
      paddingProps[key] = props[key as keyof T];
      delete otherProps[key];
    }
  });

  return [paddingProps, otherProps as Omit<T, string>];
}
