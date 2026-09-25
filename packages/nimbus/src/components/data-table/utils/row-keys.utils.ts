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
