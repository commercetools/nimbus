/**
 * Unit tests for the internal DataTable context hooks.
 *
 * `useStableDataTableContext` intentionally reads only the base
 * `DataTableContext`, so consumers that don't care about selection state stay
 * isolated from selection re-renders. `useDataTableContext` merges in
 * selection state, so it SHOULD re-render when selection changes.
 *
 * This behavior used to be exercised via a Storybook story
 * (`PerfSelectionContextIsolation`) that clicked a checkbox in the browser.
 * That story broke once consumer files (stories) started resolving
 * `DataTable` from the built `@commercetools/nimbus` package while this
 * internal hook (imported from source) kept resolving to source — two
 * different React context instances, so the probe never saw the selection
 * change. An internal `.spec.tsx` resolves everything to source, so it
 * doesn't have that hazard, and it's the right place to test an internal
 * hook's re-render behavior anyway.
 */
import { describe, it, expect } from "vitest";
import React from "react";
import { type Selection } from "react-aria-components";
import { render, screen } from "@/test/utils";
import { NimbusProvider } from "../nimbus-provider";
import { DataTable } from "./data-table";
import {
  useStableDataTableContext,
  useDataTableContext,
} from "./components/data-table.context";
import type { DataTableColumnItem, DataTableRowItem } from "./data-table.types";

const columns: DataTableColumnItem[] = [
  {
    id: "name",
    header: "Name",
    accessor: (row: Record<string, unknown>) => row.name as React.ReactNode,
  },
];

const testRows: DataTableRowItem[] = [
  { id: "1", name: "Row 1" },
  { id: "2", name: "Row 2" },
  { id: "3", name: "Row 3" },
];

const noop = () => {};

/**
 * Reads only the base `DataTableContext` (via `useStableDataTableContext`).
 * Selection-isolated: must NOT re-render when selection changes.
 */
const StableProbe = React.memo(function StableProbe() {
  useStableDataTableContext();
  const renderCount = React.useRef(0);
  renderCount.current++;
  return (
    <div data-testid="stable-probe" data-render-count={renderCount.current} />
  );
});

/**
 * Merges selection state (via `useDataTableContext`).
 * Positive control: SHOULD re-render when selection changes, proving the
 * test can actually detect re-renders.
 */
const SelectionProbe = React.memo(function SelectionProbe() {
  useDataTableContext();
  const renderCount = React.useRef(0);
  renderCount.current++;
  return (
    <div
      data-testid="selection-probe"
      data-render-count={renderCount.current}
    />
  );
});

function Harness({ selectedKeys }: { selectedKeys: Selection }) {
  return (
    <DataTable.Root
      columns={columns}
      rows={testRows}
      selectionMode="multiple"
      selectedKeys={selectedKeys}
      onSelectionChange={noop}
    >
      <StableProbe />
      <SelectionProbe />
    </DataTable.Root>
  );
}

const getRenderCount = (testId: string) =>
  Number(screen.getByTestId(testId).getAttribute("data-render-count"));

describe("data-table.context", () => {
  it("isolates useStableDataTableContext consumers from selection changes, while useDataTableContext consumers re-render", () => {
    const { rerender } = render(<Harness selectedKeys={new Set()} />);

    const initialStableCount = getRenderCount("stable-probe");
    const initialSelectionCount = getRenderCount("selection-probe");

    // Controlled selection change — a new Set reference, same shape of tree.
    rerender(
      <NimbusProvider>
        <Harness selectedKeys={new Set(["1"])} />
      </NimbusProvider>
    );

    // Selection isolation guarantee: a consumer that only reads the base
    // DataTableContext must not re-render when selection changes.
    expect(getRenderCount("stable-probe")).toBe(initialStableCount);

    // Positive control: a consumer that merges selection state does
    // re-render — confirms the harness actually detects re-renders.
    expect(getRenderCount("selection-probe")).toBeGreaterThan(
      initialSelectionCount
    );
  });
});
