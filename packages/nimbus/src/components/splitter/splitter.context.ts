import { createContext } from "react";
import type { SplitterContextValue } from "./splitter.types";

/**
 * Internal context shared between `Splitter.Root`, `Splitter.Pane`, and
 * `Splitter.Handle`. Carries the id-keyed sizes record, pane registration,
 * commands, and the configuration needed by the handle to compute its
 * keyboard behavior and ARIA attributes.
 *
 * @internal
 */
export const SplitterContext = createContext<SplitterContextValue | undefined>(
  undefined
);
