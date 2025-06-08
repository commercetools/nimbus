import { WindowSplitterRoot } from "./components/window-splitter.root";
import { WindowSplitterPane } from "./components/window-splitter.pane";
import { WindowSplitterSeparator } from "./components/window-splitter.separator";

export const WindowSplitter = {
  Root: WindowSplitterRoot,
  Pane: WindowSplitterPane,
  Separator: WindowSplitterSeparator,
};

// Export types for consumers
export type {
  WindowSplitterRootProps,
  WindowSplitterPaneProps,
  WindowSplitterSeparatorProps,
} from "./window-splitter.types";

// Export context hook for advanced use cases
export { useWindowSplitterContext } from "./components/window-splitter.context";
