import type { DataTableRowItem } from "../data-table.types";

/**
 * Resolves the identity of a row.
 *
 * Every key `DataTable` reports or accepts is produced by a resolver of this
 * shape: selection, `disabledKeys`, expansion, pinning, and the key React Aria
 * uses for the collection itself. Having exactly one of these is the point —
 * when identity is derived in more than one place, the places drift apart, and
 * a row ends up selected under one name while being expanded under another.
 */
export type DataTableRowKeyResolver<T extends object> = (
  row: DataTableRowItem<T>
) => string;

/**
 * The default resolver: a row is identified by its `id`, and by nothing else.
 *
 * Deliberately no `row.key` fallback. React Aria resolves a collection key as
 * `rendered.props.id ?? item.key ?? item.id`, so a business `key` field — which
 * commercetools domain objects (customer groups, categories, product types,
 * channels, stores) normally carry — used to win that race and become the row's
 * identity. Reintroducing the fallback here would reinstate that bug.
 */
export const defaultGetRowKey = <T extends object>(
  row: DataTableRowItem<T>
): string => row.id;

/**
 * Describes a problem with the keys a resolver produced for a set of rows.
 *
 * Both cases surface at runtime as React Aria's opaque "Cell count must match
 * column count", which says nothing about the actual cause.
 */
export type RowKeyProblem =
  | { type: "duplicate"; key: string; count: number }
  | { type: "missing"; index: number };

/**
 * Finds rows whose resolved key is duplicated, empty or absent.
 *
 * Pure so it can be unit tested; callers decide whether to report it, and the
 * caller in `DataTable.Root` only does so outside production.
 */
export function findRowKeyProblems<T extends object>(
  rows: DataTableRowItem<T>[],
  getRowKey: DataTableRowKeyResolver<T>
): RowKeyProblem[] {
  const problems: RowKeyProblem[] = [];
  const counts = new Map<string, number>();

  rows.forEach((row, index) => {
    const key = getRowKey(row);
    if (key == null || key === "") {
      problems.push({ type: "missing", index });
      return;
    }
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });

  for (const [key, count] of counts) {
    if (count > 1) {
      problems.push({ type: "duplicate", key, count });
    }
  }

  return problems;
}

/**
 * Formats {@link findRowKeyProblems} output as a single developer-facing
 * message, or returns null when there is nothing to report.
 */
export function formatRowKeyProblems(problems: RowKeyProblem[]): string | null {
  if (problems.length === 0) return null;

  const duplicates = problems
    .filter(
      (p): p is Extract<RowKeyProblem, { type: "duplicate" }> =>
        p.type === "duplicate"
    )
    .map((p) => `"${p.key}" (${p.count} rows)`);
  const missing = problems
    .filter(
      (p): p is Extract<RowKeyProblem, { type: "missing" }> =>
        p.type === "missing"
    )
    .map((p) => `index ${p.index}`);

  const parts = [
    "DataTable: every row needs a unique, non-empty key.",
    duplicates.length ? `Duplicated: ${duplicates.join(", ")}.` : "",
    missing.length ? `Missing or empty at: ${missing.join(", ")}.` : "",
    "Give each row a unique, non-empty `id`.",
  ].filter(Boolean);

  return parts.join(" ");
}
