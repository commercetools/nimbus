import { SplitterPaneBase } from "./splitter.pane";
import type { SplitterMainProps } from "../splitter.types";

/**
 * The primary content pane inside a `Splitter.Root`. Always takes the space the
 * aside does not (`100 − size`); never configured directly. Carries only its
 * content and an optional `id`. May be placed before or after `Splitter.Aside`.
 *
 * @supportsStyleProps
 */
export const SplitterMain = (props: SplitterMainProps) => (
  <SplitterPaneBase paneRole="main" {...props} />
);

SplitterMain.displayName = "Splitter.Main";
