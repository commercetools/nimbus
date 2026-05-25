import { SplitterRoot } from "./components/splitter.root";
import { SplitterPane } from "./components/splitter.pane";
import { SplitterHandle } from "./components/splitter.handle";

/**
 * Compound primitive for a user-resizable 2-pane layout.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
 */
export const Splitter = {
  Root: SplitterRoot,
  Pane: SplitterPane,
  Handle: SplitterHandle,
};

// Underscore-prefixed re-exports exist solely so the react-docgen-typescript
// script can extract per-subcomponent prop tables. Consumers should use the
// namespaced `Splitter.Root` / `Splitter.Pane` / `Splitter.Handle`.
export {
  SplitterRoot as _SplitterRoot,
  SplitterPane as _SplitterPane,
  SplitterHandle as _SplitterHandle,
};
