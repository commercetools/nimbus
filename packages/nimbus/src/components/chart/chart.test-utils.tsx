import { useEffect, useRef, type ReactNode } from "react";
import { Box, useColorMode } from "@commercetools/nimbus";
import { waitFor } from "storybook/test";

/**
 * Helpers shared by the chart stories. Only stories import this file; it is
 * not exported from any `index.ts`, and the `.test-` name keeps it out of the
 * generated type declarations.
 */

/** The Recharts svg, once the chart has been measured */
export const findSvg = (canvasElement: HTMLElement) =>
  waitFor(() => {
    const svg = canvasElement.querySelector("svg.recharts-surface");
    if (!svg) throw new Error("chart not drawn yet");
    return svg;
  });

/** The tooltip element, or null when none is shown */
export const tooltipText = (root: HTMLElement) =>
  root.querySelector(".nimbus-chart__tooltip");

/** Red channel of the legend text color: low in light mode, high in dark mode */
export const legendRed = (root: HTMLElement): number => {
  const legend = root.querySelector<HTMLElement>(".nimbus-chart__legend")!;
  return Number(getComputedStyle(legend).color.match(/\d+/)![0]);
};

/**
 * Switches the color mode to dark while mounted, with the same hook an app
 * uses. The Storybook theme decorator lets next-themes own the mode class on
 * the document root, so adding a `dark` class by hand would leave both
 * `light` and `dark` there and the light tokens would win.
 */
export const DarkMode = ({ children }: { children: ReactNode }) => {
  const { colorMode, setColorMode } = useColorMode();
  // The setter gets a new identity on every mode change, so hold it in a ref
  // and switch the mode only once, on mount.
  const setColorModeRef = useRef(setColorMode);
  setColorModeRef.current = setColorMode;
  const initialMode = useRef(colorMode);
  useEffect(() => {
    const previousMode = initialMode.current ?? "light";
    setColorModeRef.current("dark");
    return () => setColorModeRef.current(previousMode);
  }, []);
  return (
    <Box bg="bg" p="400">
      {children}
    </Box>
  );
};

/**
 * The x axis labels with their position, and the bounds of the chart svg.
 * Used to check that every label is drawn and none is cut off at an edge.
 */
export const xAxisLabels = (root: HTMLElement) => {
  const svg = root
    .querySelector("svg.recharts-surface")!
    .getBoundingClientRect();
  return {
    svgLeft: svg.left,
    svgRight: svg.right,
    labels: Array.from(
      root.querySelectorAll(".recharts-cartesian-axis-tick-label text")
    ).map((text) => {
      const box = text.getBoundingClientRect();
      return { text: text.textContent ?? "", left: box.left, right: box.right };
    }),
  };
};
