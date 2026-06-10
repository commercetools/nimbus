import { SplitterPaneBase } from "./splitter.pane";
import type { SplitterAsideProps } from "../splitter.types";

/**
 * The configurable pane inside a `Splitter.Root`. Its size is driven by Root's
 * `size` / `defaultSize` (and the `minSize` / `maxSize` / collapse config);
 * carries only its content and an optional `id`. May be placed before or after
 * `Splitter.Main`.
 *
 * @supportsStyleProps
 */
export const SplitterAside = (props: SplitterAsideProps) => (
  <SplitterPaneBase paneRole="aside" {...props} />
);

SplitterAside.displayName = "Splitter.Aside";
