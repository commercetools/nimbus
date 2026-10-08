import {
  Size,
  type GridLayoutOptions,
  type ListLayoutOptions,
  type TableLayoutProps,
} from "react-aria-components";
import type {
  VirtualizerGridLayoutOptions,
  VirtualizerListLayoutOptions,
  VirtualizerSize,
  VirtualizerTableLayoutOptions,
} from "../virtualizer.types";
import { resolveSpacing } from "./resolve-spacing";

/**
 * Drop keys whose value is `undefined`, so the result only carries options
 * that were set and React Aria applies its own defaults to the rest.
 */
function definedOnly<T extends object>(options: T): T {
  return Object.fromEntries(
    Object.entries(options).filter(([, value]) => value !== undefined)
  ) as T;
}

function toSize(size: VirtualizerSize | undefined): Size | undefined {
  return size ? new Size(size.width, size.height) : undefined;
}

/**
 * Map Nimbus list options to React Aria `ListLayout` options. React Aria
 * renamed the height options to sizes (`rowHeight` → `rowSize`); this is the
 * only place that knows the React Aria names.
 */
export function mapListLayoutOptions(
  options: VirtualizerListLayoutOptions = {}
): ListLayoutOptions {
  return definedOnly({
    rowSize: options.rowHeight,
    estimatedRowSize: options.estimatedRowHeight,
    headingSize: options.headingHeight,
    estimatedHeadingSize: options.estimatedHeadingHeight,
    loaderSize: options.loaderHeight,
    gap: resolveSpacing(options.gap),
    padding: resolveSpacing(options.padding),
  });
}

/**
 * Map Nimbus table options to React Aria `TableLayout` options. Never sets
 * `columnWidths`: React Aria's `TableLayout` supplies it from the column
 * resize state and would be overridden otherwise.
 */
export function mapTableLayoutOptions(
  options: VirtualizerTableLayoutOptions = {}
): TableLayoutProps {
  return definedOnly({
    rowHeight: options.rowHeight,
    estimatedRowHeight: options.estimatedRowHeight,
    headingHeight: options.headingHeight,
    estimatedHeadingHeight: options.estimatedHeadingHeight,
    loaderHeight: options.loaderHeight,
    gap: resolveSpacing(options.gap),
    padding: resolveSpacing(options.padding),
  });
}

/**
 * Map Nimbus grid options to React Aria `GridLayout` options. Never sets
 * `direction`: React Aria's `GridLayout` supplies it from the locale and would
 * be overridden otherwise.
 */
export function mapGridLayoutOptions(
  options: VirtualizerGridLayoutOptions = {}
): GridLayoutOptions {
  return definedOnly({
    minItemSize: toSize(options.minItemSize),
    maxItemSize: toSize(options.maxItemSize),
    minSpace: toSize(options.minSpace),
    maxHorizontalSpace: options.maxHorizontalSpace,
    maxColumns: options.maxColumns,
    preserveAspectRatio: options.preserveAspectRatio,
    loaderHeight: options.loaderHeight,
  });
}
