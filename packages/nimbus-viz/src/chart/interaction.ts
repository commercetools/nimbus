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
 * The one interaction contract charts opt into, so drill-down and linked
 * (crossfilter) dashboards are expressible: click/hover a datum, and a
 * controlled-or-uncontrolled entity selection that a parent can share across
 * charts.
 */
export interface InteractionProps<T = unknown> {
  onDatumClick?: DatumClickHandler<T>;
  onDatumHover?: DatumHoverHandler<T>;
  onSelectionChange?: SelectionChangeHandler;
  /** Controlled selected entity ids. Omit for uncontrolled (internal) state. */
  selection?: ReadonlySet<string>;
}

/**
 * Controlled/uncontrolled selection state. When `controlled` is provided the
 * component is controlled (the hook never mutates local state); otherwise it
 * manages its own. `onChange` always fires with the next set so a parent can
 * link views regardless of which mode it's in.
 */
export function useControlledSelection(
  controlled?: ReadonlySet<string>,
  onChange?: SelectionChangeHandler
): [ReadonlySet<string>, (id: string) => void] {
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

  return [selected, toggle];
}
