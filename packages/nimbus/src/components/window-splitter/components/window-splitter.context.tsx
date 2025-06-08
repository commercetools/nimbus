import { createContext, useContext } from "react";

export interface WindowSplitterContextValue {
  /** Current value of the splitter (0-100) */
  value: number;
  /** Callback to update the value */
  setValue: (value: number) => void;
  /** The orientation of the splitter */
  orientation: "horizontal" | "vertical";
  /** Whether the splitter is disabled */
  isDisabled: boolean;
  /** Minimum value for the primary pane */
  minValue: number;
  /** Maximum value for the primary pane */
  maxValue: number;
  /** Step size for keyboard navigation */
  step: number;
  /** ID of the primary pane for aria-controls */
  primaryPaneId?: string;
  /** Set the primary pane ID */
  setPrimaryPaneId: (id: string) => void;
}

export const WindowSplitterContext = createContext<
  WindowSplitterContextValue | undefined
>(undefined);

export const useWindowSplitterContext = () => {
  const context = useContext(WindowSplitterContext);
  if (!context) {
    throw new Error(
      "useWindowSplitterContext must be used within a WindowSplitter.Root"
    );
  }
  return context;
};
