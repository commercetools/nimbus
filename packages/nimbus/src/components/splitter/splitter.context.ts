import { createContext } from "react";
import type { SplitterContextValue } from "./splitter.types";

/**
 * Internal context shared between `Splitter.Root`, the pane components
 * (`Splitter.Aside` / `Splitter.Main`), and `Splitter.Handle`. Carries the
 * single aside `size`, role-based pane registration, commands, and the
 * configuration needed by the handle to compute its keyboard behavior and ARIA
 * attributes.
 *
 * @internal
 */
export const SplitterContext = createContext<SplitterContextValue | undefined>(
  undefined
);
