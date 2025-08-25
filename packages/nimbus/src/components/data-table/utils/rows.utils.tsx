import type {
  DataTableColumnItem,
  DataTableRowItem as DataTableRowType,
  SortDescriptor,
} from "../data-table.types";
// Utility functions
export function filterRows<T extends object>(
  rows: DataTableRowType<T>[],
  search: string,
  columns: DataTableColumnItem<T>[],
  nestedKey?: string
): DataTableRowType<T>[] {
  if (!search) return rows;
  const lowerCaseSearch = search.toLowerCase();
  return rows
    .map((row) => {
      const match = columns.some((col) => {
        const value = col.accessor(row);
        return (
          typeof value === "string" &&
          value.toLowerCase().includes(lowerCaseSearch)
        );
      });

      if (nestedKey && row[nestedKey]) {
        let nestedContent = row[nestedKey];
        if (Array.isArray(row[nestedKey])) {
          nestedContent = filterRows(
            row[nestedKey],
            search,
            columns,
            nestedKey
          );
          if (
            match ||
            (nestedContent &&
              Array.isArray(nestedContent) &&
              nestedContent.length > 0)
          ) {
            return { ...row, [nestedKey]: nestedContent };
          }
        } else {
          if (match) {
            return { ...row, [nestedKey]: nestedContent };
          }
        }
        return null;
      } else {
        return match ? row : null;
      }
    })
    .filter(Boolean) as DataTableRowType<T>[];
}

export function sortRows<T extends object>(
  rows: DataTableRowType<T>[],
  sortDescriptor: SortDescriptor | undefined,
  columns: DataTableColumnItem<T>[],
  nestedKey?: string
): DataTableRowType<T>[] {
  if (!sortDescriptor) return rows;

  const column = columns.find((col) => col.id === sortDescriptor.column);
  if (!column) return rows;

  const sortedRows = [...rows].sort((a, b) => {
    const aValue = column.accessor(a);
    const bValue = column.accessor(b);

    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    let aSortValue = aValue;
    let bSortValue = bValue;

    if (typeof aValue === "number" && typeof bValue === "number") {
      aSortValue = aValue;
      bSortValue = bValue;
    } else {
      aSortValue = String(aValue).toLowerCase();
      bSortValue = String(bValue).toLowerCase();
    }

    if (aSortValue < bSortValue)
      return sortDescriptor.direction === "ascending" ? -1 : 1;
    if (aSortValue > bSortValue)
      return sortDescriptor.direction === "ascending" ? 1 : -1;
    return 0;
  });

  return sortedRows.map((row) => {
    if (!nestedKey || !row[nestedKey]) {
      return row;
    }
    return {
      ...row,
      [nestedKey]: Array.isArray(row[nestedKey])
        ? sortRows(row[nestedKey], sortDescriptor, columns, nestedKey)
        : row[nestedKey],
    };
  });
}

export function hasExpandableRows<T extends object>(
  rows: DataTableRowType<T>[],
  nestedKey?: string
): boolean {
  if (!nestedKey) return false;
  return rows.some(
    (row) =>
      (row[nestedKey] &&
        (Array.isArray(row[nestedKey]) ? row[nestedKey].length > 0 : true)) ||
      (Array.isArray(row[nestedKey]) &&
        hasExpandableRows(row[nestedKey], nestedKey))
  );
}
