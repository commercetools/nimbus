import { WindowSplitterRoot } from "./components/window-splitter.root";
import { WindowSplitterPane } from "./components/window-splitter.pane";
import { WindowSplitterSeparator } from "./components/window-splitter.separator";

export const WindowSplitter = {
  Root: WindowSplitterRoot,
  Pane: WindowSplitterPane,
  Separator: WindowSplitterSeparator,
};

// Export context hook for advanced use cases
export { useWindowSplitterContext } from "./hooks/use-window-splitter-context";

export {
  WindowSplitterRoot as Root,
  WindowSplitterPane as Pane,
  WindowSplitterSeparator as Separator,
};
