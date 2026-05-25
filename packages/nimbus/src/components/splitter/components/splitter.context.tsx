import { createContext } from "react";
import type { SplitterPaneConfig } from "../splitter.types";

/**
 * Internal context shared between `Splitter.Root`, `Splitter.Pane`, and
 * `Splitter.Handle`. Carries the id-keyed sizes record, pane registration,
 * commands, and the configuration needed by the handle to compute its
 * keyboard behavior and ARIA attributes.
 *
 * @internal
 */
export type SplitterContextValue = {
  /** Current sizes record, keyed by pane id, summing to 100. */
  sizes: Record<string, number>;
  /** Replace the sizes record (used by drag, keyboard, and imperative API). */
  setSizes: (sizes: Record<string, number>) => void;
  /** Splitter orientation. Determines layout axis and active arrow keys. */
  orientation: "horizontal" | "vertical";
  /** Keyboard step in percentage points per arrow-key press. */
  keyboardStep: number;
  /** When true, the handle ignores double-clicks. */
  disableDoubleClick: boolean;

  /** Look up the configuration for a given pane id. */
  getPaneConfig: (paneId: string) => SplitterPaneConfig;

  /** Ordered ids of the two registered panes, in DOM order. */
  paneOrder: string[];
  /** Map from pane id to the DOM id rendered on the pane element. */
  paneDomIds: Record<string, string>;
  /** Register a pane with the splitter. Returns a stable DOM id. */
  registerPane: (paneId: string, domId: string) => void;
  /** Unregister a pane on unmount. */
  unregisterPane: (paneId: string) => void;

  /** Collapse a collapsible pane to its `collapsedSize`. */
  collapsePane: (paneId: string) => void;
  /** Expand a collapsed pane back to its `defaultSize`. */
  expandPane: (paneId: string) => void;
  /** True if the pane's current size is at or below its `collapsedSize`. */
  isCollapsed: (paneId: string) => boolean;
};

export const SplitterContext = createContext<SplitterContextValue | undefined>(
  undefined
);
