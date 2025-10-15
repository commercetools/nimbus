import { CHAKRA_STYLE_PROPS } from "../constants";
import type { PropItem } from "../types";

/**
 * Checks if a prop name is a Chakra UI style prop
 */
export const isChakraStyleProp = (propName: string): boolean => {
  return CHAKRA_STYLE_PROPS.has(propName);
};

/**
 * Checks if any props in the array are Chakra UI style props
 */
export const hasChakraStyleProps = (props: PropItem[]): boolean => {
  return props.some((prop) => isChakraStyleProp(prop.name));
};

/**
 * Filters out Chakra UI style props from the props array
 */
export const filterStyleProps = (props: PropItem[]): PropItem[] => {
  return props.filter((prop) => !isChakraStyleProp(prop.name));
};
