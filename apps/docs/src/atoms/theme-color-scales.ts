import { atom } from "jotai";
import { system } from "@nimbus/react";

/**
 * Retrieves the color scales from the system tokens.
 * @returns The color scales.
 */
const getColorScales = () => {
  return system.tokens.categoryMap.get("colors");
};

/**
 * Atom to manage the theme color scales state.
 * @returna atom containing all colors of the system theme
 */
export const themeColorScalesAtom = atom(getColorScales());
