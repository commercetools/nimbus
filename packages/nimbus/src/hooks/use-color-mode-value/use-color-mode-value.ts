import { useColorMode } from "./../use-color-mode";

/**
 * Hook that returns a value based on the current color mode.
 *
 * @experimental This hook is experimental and may change in future versions.
 *
 * @param light - The value to return when the color mode is light
 * @param dark - The value to return when the color mode is dark
 * @returns The appropriate value based on the current color mode
 */
export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode();
  return colorMode === "light" ? light : dark;
}
