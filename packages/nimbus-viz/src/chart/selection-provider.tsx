import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

/**
 * Cross-chart linked-views state: a highlighted entity-set and a brushed
 * x-domain, both shared by every chart mounted under one `SelectionProvider`.
 *
 * Entity ids follow the single convention in `selection/derive-facts.ts`'s
 * `ENTITY_ID_ACCESSOR` table (e.g. `series.id` for `LineChart`'s series) --
 * that's what makes `selected` meaningful across charts of different kinds:
 * two charts sharing an id space (the same series ids, say) stay linked even
 * though their own data shapes differ.
 *
 * `brushedDomain` is a generic `[number, number]` (epoch-ms for a time axis,
 * a plain numeric range otherwise) rather than `[Date, Date]`, so this module
 * stays chart-shape-agnostic; a chart converts at its own boundary.
 */
export interface LinkedSelectionState {
  /** Highlighted entity ids, shared across every chart under this provider. */
  selected: ReadonlySet<string>;
  setSelected: (next: ReadonlySet<string>) => void;
  /** A brushed x-domain, or `null` when no brush is active (show everything). */
  brushedDomain: [number, number] | null;
  setBrushedDomain: (next: [number, number] | null) => void;
}

const SelectionContext = createContext<LinkedSelectionState | null>(null);

export interface SelectionProviderProps {
  children: ReactNode;
}

/**
 * Mount once around a group of charts that should stay linked: an entity
 * selected/toggled in one (e.g. via `LineChart`'s `selection`/
 * `onSelectionChange`, `A3`) or a range brushed in one (via `Brush`) is
 * visible to every chart under the same provider through `useLinkedSelection`.
 * This is deliberately a thin, generic broadcast -- it does not itself know
 * how any particular chart should react to `selected`/`brushedDomain`; each
 * chart decides that for itself (dim/hide unselected series, narrow its own
 * domain, …), the same way `useControlledSelection` leaves that decision to
 * the one chart that calls it.
 */
export function SelectionProvider({ children }: SelectionProviderProps) {
  const [selected, setSelected] = useState<ReadonlySet<string>>(
    () => new Set()
  );
  const [brushedDomain, setBrushedDomain] = useState<[number, number] | null>(
    null
  );

  const value = useMemo<LinkedSelectionState>(
    () => ({ selected, setSelected, brushedDomain, setBrushedDomain }),
    [selected, brushedDomain]
  );

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}

/**
 * Reads the shared linked-selection state. Throws outside a
 * `SelectionProvider` (matching `useChartTheme`'s "throw without a provider"
 * convention) -- a chart or demo composing this is expected to render inside
 * one, the same way every chart expects a `ChartThemeProvider`.
 */
export function useLinkedSelection(): LinkedSelectionState {
  const ctx = useContext(SelectionContext);
  if (!ctx) {
    throw new Error(
      "useLinkedSelection used outside a SelectionProvider: wrap the linked " +
        "charts in <SelectionProvider>…</SelectionProvider>."
    );
  }
  return ctx;
}
