import { SplitterRoot } from "./components/splitter.root";
import { SplitterPane } from "./components/splitter.pane";
import { SplitterSeparator } from "./components/splitter.separator";

export const Splitter = {
  Root: SplitterRoot,
  Pane: SplitterPane,
  Separator: SplitterSeparator,
};

// Export context hook for advanced use cases
export { useSplitterContext } from "./hooks/use-splitter-context";

// Underscore-prefixed re-exports exist solely so the react-docgen-typescript
// script can extract per-subcomponent prop tables. Consumers should use the
// namespaced `Splitter.Root` / `Splitter.Pane` / `Splitter.Separator`.
export {
  SplitterRoot as _SplitterRoot,
  SplitterPane as _SplitterPane,
  SplitterSeparator as _SplitterSeparator,
};
