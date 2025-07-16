import {
  Table,
  TableHeader,
  TableBody,
  Row,
  Cell,
  Column,
  Button,
} from "react-aria-components";
// import {
//   TableRoot,
//   TableHeaderSlot,
//   TableBodySlot,
//   TableRowSlot,
//   TableColumnHeaderSlot,
//   TableCellSlot,
// } from "./table.slots";

import { useState, useMemo } from "react";

import React from "react";

export type DataTableColumn<T> = {
  id: string;
  label: React.ReactNode;
  render?: (row: T) => React.ReactNode;
  allowsSorting?: boolean;
  isRowHeader?: boolean;
  width?: string;
  onResizeStart?: (e: React.MouseEvent<HTMLSpanElement>) => void;
};

export type DataTableRow<T> = T & {
  key: string;
  children?: DataTableRow<T>[];
};

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: DataTableRow<T>[];
  sortDescriptor?: { column: string; direction: "ascending" | "descending" };
  onSortChange?: (desc: { column: string; direction: "ascending" | "descending" }) => void;
  selectionMode?: "none" | "single" | "multiple";
  onRowClick?: (row: DataTableRow<T>) => void;
  renderRowActions?: (row: DataTableRow<T>) => React.ReactNode;
  stickyHeader?: boolean;
  editableCell?: (row: DataTableRow<T>, col: DataTableColumn<T>) => React.ReactNode;
  onCellEdit?: (row: DataTableRow<T>, col: DataTableColumn<T>, value: any) => void;
  copyableRow?: boolean;
  onRowCopy?: (row: DataTableRow<T>) => void;
  showColumnVisibilityDropdown?: boolean;
  resizableColumns?: boolean;
};

function flattenRows<T>(rows: DataTableRow<T>[], expanded: Set<string>, depth = 0): { row: DataTableRow<T>, depth: number }[] {
  let result: { row: DataTableRow<T>, depth: number }[] = [];
  for (const row of rows) {
    result.push({ row, depth });
    if (row.children && expanded.has(row.key)) {
      result.push(...flattenRows(row.children, expanded, depth + 1));
    }
  }
  return result;
}

export function DataTable<T extends object>({
  columns,
  data,
  sortDescriptor: controlledSort,
  onSortChange,
  selectionMode = "none",
  onRowClick,
  renderRowActions,
  stickyHeader,
  editableCell,
  onCellEdit,
  copyableRow,
  onRowCopy,
  showColumnVisibilityDropdown = false,
  resizableColumns = false,
}: DataTableProps<T>) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [sortDescriptor, setSortDescriptor] = useState<{ column: string; direction: "ascending" | "descending" }>(
    controlledSort || { column: columns[0]?.id, direction: "ascending" }
  );

  // Selection state
  const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(new Set());
  const isSelected = (key: string) => selectedKeys.has(key);
  const handleSelect = (key: string) => {
    if (selectionMode === "multiple") {
      setSelectedKeys(prev => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        return next;
      });
    } else if (selectionMode === "single") {
      setSelectedKeys(new Set([key]));
    }
  };

  // Sorting
  const sortedData = useMemo(() => {
    let items = [...data];
    if (sortDescriptor?.column) {
      items.sort((a, b) => {
        const first = (a as any)[sortDescriptor.column];
        const second = (b as any)[sortDescriptor.column];
        let cmp = String(first).localeCompare(String(second));
        if (sortDescriptor.direction === "descending") cmp *= -1;
        return cmp;
      });
    }
    return items;
  }, [data, sortDescriptor]);

  // Flatten for rendering
  const flatRows = useMemo(() => flattenRows(sortedData, expanded, 0), [sortedData, expanded]);

  // Handle expand/collapse
  const toggleExpand = (key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // Handle sort change
  const handleSortChange = (desc: any) => {
    setSortDescriptor(desc);
    onSortChange?.(desc);
  };

  // Column resizing state and handlers
  const [widths, setWidths] = React.useState<Record<string, string>>(() =>
    Object.fromEntries(columns.map(col => [col.id, col.width || "160px"]))
  );
  const resizingCol = React.useRef<{ colId: string; startX: number; startWidth: number } | null>(null);
  const handleMouseDown = (colId: string) => (e: React.MouseEvent<HTMLSpanElement>) => {
    resizingCol.current = { colId, startX: e.clientX, startWidth: parseInt(widths[colId]) };
    document.addEventListener("mousemove", onMouseMove as any);
    document.addEventListener("mouseup", onMouseUp as any);
  };
  const onMouseMove = (e: MouseEvent) => {
    if (!resizingCol.current) return;
    const { colId, startX, startWidth } = resizingCol.current;
    const delta = e.clientX - startX;
    setWidths(w => ({ ...w, [colId]: Math.max(60, startWidth + delta) + "px" }));
  };
  const onMouseUp = () => {
    resizingCol.current = null;
    document.removeEventListener("mousemove", onMouseMove as any);
    document.removeEventListener("mouseup", onMouseUp as any);
  };

  // Compose columns with resize handles if enabled
  const computedColumns = React.useMemo(() => {
    if (!resizableColumns) return columns.map(col => ({ ...col, width: widths[col.id] }));
    return columns.map((col, idx) => ({
      ...col,
      width: widths[col.id],
      onResizeStart: idx < columns.length - 1 ? handleMouseDown(col.id) : undefined,
    }));
  }, [columns, widths, resizableColumns]);

  // Find if any column has a resize handler (for storybook integration)
  const hasResize = columns.some((col: any) => typeof col.onResizeStart === 'function');

  const [clipboardFeedback, setClipboardFeedback] = React.useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = React.useState<string | null>(null);

  const handleCopy = (row: DataTableRow<T>) => {
    navigator.clipboard.writeText(JSON.stringify(row));
    setClipboardFeedback(row.key);
    if (onRowCopy) onRowCopy(row);
    setTimeout(() => setClipboardFeedback(null), 1000);
  };

  // Column visibility state
  const [visible, setVisible] = React.useState(() => columns.map((col) => col.id));
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const handleToggle = (id: string) => {
    setVisible((v) =>
      v.includes(id) ? v.filter((x) => x !== id) : [...v, id]
    );
  };
  const visibleColumns = computedColumns.filter((col) => visible.includes(col.id));

  // Close dropdown on outside click
  React.useEffect(() => {
    if (!dropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  // Helper to render a row (handles recursion for children)
  function renderRow(item: DataTableRow<T>, depth = 0) {
    const isChild = depth > 0;
    const selected = isSelected(item.key);
    return (
      <Row
        key={item.key}
        data-selected={selected ? 'true' : undefined}
        data-child={isChild ? 'true' : undefined}
        style={selected ? { background: '#e0e7ff' } : {}}
      >
        {/* Selection cell */}
        {selectionMode !== "none" && (
          <Cell>
            {selectionMode === "multiple" ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => handleSelect(item.key)}
                  onClick={e => e.stopPropagation()}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <input
                  type="radio"
                  name="datatable-selection"
                  checked={selected}
                  onChange={() => handleSelect(item.key)}
                  onClick={e => e.stopPropagation()}
                />
              </div>
            )}
          </Cell>
        )}
        {/* Expand/collapse cell if nested */}
        {item.children ? (
          <Cell>
            <div
              className="nimbus-table-expand-cell"
              onClick={onRowClick ? () => onRowClick(item) : undefined}
              onMouseEnter={() => setHoveredRow(item.key)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <button
                aria-label={expanded.has(item.key) ? "Collapse" : "Expand"}
                onClick={() => toggleExpand(item.key)}
                className="nimbus-table-expand-btn"
                style={{ marginRight: 12 }}
              >
                {expanded.has(item.key) ? "-" : "+"}
              </button>
              {visibleColumns[0]?.render ? visibleColumns[0].render(item) : (item as any)[visibleColumns[0]?.id]}
            </div>
          </Cell>
        ) : (
          <Cell>
            <div
              className="nimbus-table-child-cell"
              onClick={onRowClick ? () => onRowClick(item) : undefined}
              onMouseEnter={() => setHoveredRow(item.key)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              {isChild && <span className="nimbus-table-child-arrow">↳</span>}
              {visibleColumns[0]?.render ? visibleColumns[0].render(item) : (item as any)[visibleColumns[0]?.id]}
            </div>
          </Cell>
        )}
        {/* Other cells */}
        {visibleColumns.slice(1).map((col, colIdx) => (
          <Cell key={col.id}>
            {editableCell ? editableCell(item, col) : (col.render ? col.render(item) : (item as any)[col.id])}
          </Cell>
        ))}
        {/* Row actions */}
        {renderRowActions ? <Cell>{renderRowActions(item)}</Cell> : null}
        {/* Clipboard button on row hover */}
        {copyableRow ? (
          <Cell>
            {hoveredRow === item.key ? (
              <button
                onClick={e => { e.stopPropagation(); handleCopy(item); }}
                className="nimbus-table-clipboard-btn"
                title="Copy row"
              >
                {clipboardFeedback === item.key ? '✔️' : '📋'}
              </button>
            ) : null}
          </Cell>
        ) : null}
      </Row>
    );
  }

  const selectAllRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (selectionMode === 'multiple' && selectAllRef.current) {
      const allSelected = flatRows.length > 0 && flatRows.every(({ row }) => isSelected(row.key));
      const someSelected = flatRows.some(({ row }) => isSelected(row.key));
      selectAllRef.current.indeterminate = someSelected && !allSelected;
    }
  }, [selectionMode, flatRows, selectedKeys]);

  return (
    <div style={{ width: '100%' }}>
      {showColumnVisibilityDropdown && (
        <div style={{ marginBottom: 16, position: 'relative', display: 'inline-block' }}>
          <button
            type="button"
            onClick={() => setDropdownOpen((open) => !open)}
            style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #ccc', background: '#f8fafc', cursor: 'pointer' }}
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            Columns ▾
          </button>
          {dropdownOpen && (
            <div
              ref={dropdownRef}
              style={{
                position: 'absolute',
                top: '110%',
                left: 0,
                zIndex: 9999,
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: 4,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                padding: 8,
                minWidth: 160,
              }}
              role="menu"
            >
              <strong style={{ fontSize: 13, display: 'block', marginBottom: 6 }}>Show/Hide Columns</strong>
              {columns.map((col) => (
                <label
                  key={col.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 14,
                    padding: '2px 0',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={visible.includes(col.id)}
                    onChange={() => handleToggle(col.id)}
                  />
                  {col.label}
                </label>
              ))}
            </div>
          )}
        </div>
      )}
      <Table style={{ width: '100%' }}>
        <TableHeader>
          <Row>
            {/* Selection column header */}
            {selectionMode !== "none" && (
              <Column style={{ width: 40, minWidth: 40, maxWidth: 40, textAlign: "center" }}>
                {selectionMode === "multiple" && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <input
                      type="checkbox"
                      aria-label="Select all rows"
                      ref={selectAllRef}
                      checked={flatRows.length > 0 && flatRows.every(({ row }) => isSelected(row.key))}
                      onChange={e => {
                        const allSelected = flatRows.length > 0 && flatRows.every(({ row }) => isSelected(row.key));
                        if (allSelected) {
                          setSelectedKeys(new Set());
                        } else {
                          setSelectedKeys(new Set(flatRows.map(({ row }) => row.key)));
                        }
                      }}
                    />
                  </div>
                )}
              </Column>
            )}
            {visibleColumns.map((col, colIdx) => {
              const isSorted = sortDescriptor?.column === col.id;
              const isSortable = !!col.allowsSorting;
              return (
                <Column
                  key={col.id}
                  style={{
                    ...(col.width ? { width: col.width, minWidth: col.width, maxWidth: col.width } : {}),
                    position: stickyHeader ? 'sticky' : undefined,
                    top: stickyHeader ? 0 : undefined,
                    zIndex: stickyHeader ? 10 : undefined,
                    background: stickyHeader ? '#f1f5f9' : '#e2e8f0',
                    padding: 0,
                  }}
                >
                  <div
                    style={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%', position: 'relative', cursor: isSortable ? 'pointer' : undefined, userSelect: isSortable ? 'none' : undefined }}
                    onClick={isSortable ? () => {
                      let direction: 'ascending' | 'descending' = 'ascending';
                      if (isSorted) {
                        direction = sortDescriptor.direction === 'ascending' ? 'descending' : 'ascending';
                      }
                      handleSortChange({ column: col.id, direction });
                    } : undefined}
                  >
                    <span style={{ flex: 1, padding: '0 12px', display: 'flex', alignItems: 'center', gap: 4 }}>
                      {col.label}
                      {isSortable && (
                        <span style={{ fontSize: 12, marginLeft: 4, color: isSorted ? '#2563eb' : '#aaa' }}>
                          {isSorted ? (sortDescriptor.direction === 'ascending' ? '▲' : '▼') : '↕'}
                        </span>
                      )}
                    </span>
                    {/* Render resize handle except for last column and actions */}
                    {typeof (col as any).onResizeStart === 'function' && colIdx < visibleColumns.length - 1 && (
                      <span
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          height: '100%',
                          width: 12,
                          cursor: 'col-resize',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 2,
                          userSelect: 'none',
                        }}
                        onMouseDown={(e) => { e.stopPropagation(); (col as any).onResizeStart(e); }}
                      >
                        <span style={{ color: '#aaa', fontWeight: 600, fontSize: 18 }}>|</span>
                      </span>
                    )}
                  </div>
                </Column>
              );
            })}
            {renderRowActions && (
              <Column
                key="actions"
                style={{
                  position: stickyHeader ? 'sticky' : undefined,
                  top: stickyHeader ? 0 : undefined,
                  zIndex: stickyHeader ? 10 : undefined,
                  background: stickyHeader ? '#f1f5f9' : '#e2e8f0',
                }}
              >
                Actions
              </Column>
            )}
            {copyableRow && (
              <Column
                key="clipboard"
                style={{ width: 40, minWidth: 40, maxWidth: 40, textAlign: 'center', background: stickyHeader ? '#f1f5f9' : '#e2e8f0' }}
              >
                {/* Clipboard */}
              </Column>
            )}
          </Row>
        </TableHeader>
        <TableBody>
          {flatRows.map(({ row, depth }) => renderRow(row, depth))}
        </TableBody>
      </Table>
    </div>
  );
} 