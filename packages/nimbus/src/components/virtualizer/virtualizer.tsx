import { useMemo } from "react";
import {
  GridLayout,
  ListLayout,
  TableLayout,
  Virtualizer as RaVirtualizer,
  type GridLayoutOptions,
  type ListLayoutOptions,
  type TableLayoutProps,
} from "react-aria-components";
import {
  mapGridLayoutOptions,
  mapListLayoutOptions,
  mapTableLayoutOptions,
} from "./utils/map-layout-options";
import type { VirtualizerProps } from "./virtualizer.types";

type RaLayoutOptions = ListLayoutOptions | GridLayoutOptions | TableLayoutProps;

function mapLayoutOptions(props: VirtualizerProps): RaLayoutOptions {
  switch (props.layout) {
    case "grid":
      return mapGridLayoutOptions(props.layoutOptions);
    case "table":
      return mapTableLayoutOptions(props.layoutOptions);
    default:
      return mapListLayoutOptions(props.layoutOptions);
  }
}

/**
 * React Aria Components layout classes, used unchanged. `GridLayout` and
 * `TableLayout` add `direction` and `columnWidths` through their own
 * `useLayoutOptions()`, which React Aria merges over the options passed here.
 */
const layoutClasses = {
  list: ListLayout,
  grid: GridLayout,
  table: TableLayout,
};

/**
 * # Virtualizer (internal)
 *
 * Renders only the visible items of a large React Aria collection. Not
 * exported: Nimbus collections render it when a consumer sets
 * `isVirtualized`, and pass their defaults merged with the consumer's
 * `virtualizerOptions` as `layoutOptions`.
 *
 * Renders no DOM element of its own: the wrapped collection stays the scroll
 * container. Always sets `shouldObserveItemSize`, so a rendered row that
 * changes size (for example when the user applies a text spacing style) is
 * measured again.
 */
export const Virtualizer = (props: VirtualizerProps) => {
  const layout = props.layout ?? "list";
  const layoutOptions = useMemo(
    () => mapLayoutOptions(props),
    // Recompute only when the layout or its options change, not when children do.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [layout, props.layoutOptions]
  );

  return (
    <RaVirtualizer<RaLayoutOptions>
      layout={layoutClasses[layout]}
      layoutOptions={layoutOptions}
      shouldObserveItemSize
    >
      {props.children}
    </RaVirtualizer>
  );
};

Virtualizer.displayName = "Virtualizer";
