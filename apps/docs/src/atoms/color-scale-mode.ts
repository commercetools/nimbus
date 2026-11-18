import { atom, useAtom } from "jotai";
import { useColorMode } from "@commercetools/nimbus";

/** The color mode the color scale demos draw. */
export type ColorScaleMode = "light" | "dark";

/**
 * The mode the reader picked. `null` means no pick: the scales follow the color
 * mode of the site. Shared by every color scale on the page.
 */
const pickedModeAtom = atom<ColorScaleMode | null>(null);

/** Mode of the color scales, and a setter that keeps the pick for the page. */
export const useColorScaleMode = () => {
  const { colorMode } = useColorMode();
  const [picked, setPicked] = useAtom(pickedModeAtom);
  const mode: ColorScaleMode =
    picked ?? (colorMode === "dark" ? "dark" : "light");
  return [mode, setPicked] as const;
};
