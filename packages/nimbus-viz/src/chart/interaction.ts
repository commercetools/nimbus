import { useCallback, useState } from "react";

/** A datum-level event payload shared across chart interaction callbacks. */
export interface DatumEvent<T = unknown> {
  datum: T;
  index: number;
  /** Series id, for multi-series charts. */
  seriesId?: string;
}

export type DatumClickHandler<T = unknown> = (event: DatumEvent<T>) => void;
export type DatumHoverHandler<T = unknown> = (
  event: DatumEvent<T> | null
) => void;
export type SelectionChangeHandler = (selected: ReadonlySet<string>) => void;

/**
 * Datum-level callbacks — the half of the interaction contract every chart
 * with hoverable marks can adopt today. A chart declares
 * `interface XProps extends DatumInteractionProps<Payload>` instead of
 * re-typing the two props, so consumers see one shape across the library.
 *
 * Conventions for `Payload`: a chart with one natural series reports the
 * point plus `seriesId` (`LineChart`); a chart with row/stack semantics reports
 * the whole row and no `seriesId` (`StackedBarChart`, `Heatmap`).
 */
export interface DatumInteractionProps<T = unknown> {
  /** Fired when a mark is clicked (drill-down). */
  onDatumClick?: DatumClickHandler<T>;
  /** Fired when the hovered mark changes; `null` when the pointer leaves. */
  onDatumHover?: DatumHoverHandler<T>;
}

/**
 * Controlled-or-uncontrolled entity selection a parent can share across charts
 * (linked views / crossfilter). Kept separate from `DatumInteractionProps` so a
 * chart that has not implemented selection does not advertise the props.
 */
export interface SelectionProps {
  onSelectionChange?: SelectionChangeHandler;
  /** Controlled selected entity ids. Omit for uncontrolled (internal) state. */
  selection?: ReadonlySet<string>;
}

/**
 * The full interaction contract: datum callbacks plus selection. A chart
 * extends this only once it implements both halves.
 */
export interface InteractionProps<T = unknown>
  extends DatumInteractionProps<T>, SelectionProps {}

/**
 * Controlled/uncontrolled selection state. When `controlled` is provided the
 * component is controlled (the hook never mutates local state); otherwise it
 * manages its own. `onChange` always fires with the next set so a parent can
 * link views regardless of which mode it's in.
 *
 * Returns `[selected, toggle, isolate]`: `toggle(id)` adds/removes one id
 * (a plain legend click); `isolate(id)` replaces the whole selection with
 * just `id` (a shift-click "show only this one" — `LineChart`'s legend uses
 * both for its click-to-toggle / shift-isolate visibility).
 */
export function useControlledSelection(
  controlled?: ReadonlySet<string>,
  onChange?: SelectionChangeHandler
): [ReadonlySet<string>, (id: string) => void, (id: string) => void] {
  const [internal, setInternal] = useState<ReadonlySet<string>>(
    () => new Set()
  );
  const selected = controlled ?? internal;

  const toggle = useCallback(
    (id: string) => {
      const next = new Set(selected);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      if (controlled === undefined) setInternal(next);
      onChange?.(next);
    },
    [selected, controlled, onChange]
  );

  const isolate = useCallback(
    (id: string) => {
      const next = new Set([id]);
      if (controlled === undefined) setInternal(next);
      onChange?.(next);
    },
    [controlled, onChange]
  );

  return [selected, toggle, isolate];
}
