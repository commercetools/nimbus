import React, { useState, useRef } from "react";
import { DataTable } from "./DataTable";
import type { DataTableColumn, DataTableRow } from "./DataTable";
import type { Meta, StoryObj } from "@storybook/react";

interface Stock {
  symbol: string;
  name: string;
  marketCap: string;
  sector: string;
  industry: string;
}

const columns: DataTableColumn<Stock>[] = [
  { id: "symbol", label: "Symbol", allowsSorting: true },
  { id: "name", label: "Name", allowsSorting: true },
  { id: "marketCap", label: "Market Cap", allowsSorting: true },
  { id: "sector", label: "Sector", allowsSorting: true },
  { id: "industry", label: "Industry", allowsSorting: true },
];

const data: DataTableRow<Stock>[] = [
  {
    key: "AAPL",
    symbol: "AAPL",
    name: "Apple Inc.",
    marketCap: "2.1T",
    sector: "Technology",
    industry: "Consumer Electronics",
  },
  {
    key: "MSFT",
    symbol: "MSFT",
    name: "Microsoft Corporation",
    marketCap: "1.9T",
    sector: "Technology",
    industry: "Software",
  },
  {
    key: "GOOGL",
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    marketCap: "1.8T",
    sector: "Technology",
    industry: "Software",
  },
];

const nestedData: DataTableRow<Stock>[] = [
  {
    key: "AAPL",
    symbol: "AAPL",
    name: "Apple Inc.",
    marketCap: "2.1T",
    sector: "Technology",
    industry: "Consumer Electronics",
    children: [
      {
        key: "AAPL-1",
        symbol: "AAPL",
        name: "Apple Retail",
        marketCap: "0.2T",
        sector: "Technology",
        industry: "Retail",
      },
    ],
  },
  {
    key: "MSFT",
    symbol: "MSFT",
    name: "Microsoft Corporation",
    marketCap: "1.9T",
    sector: "Technology",
    industry: "Software",
  },
  {
    key: "GOOGL",
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    marketCap: "1.8T",
    sector: "Technology",
    industry: "Software",
    children: [
      {
        key: "GOOGL-1",
        symbol: "GOOGL",
        name: "Google Cloud",
        marketCap: "0.3T",
        sector: "Technology",
        industry: "Cloud",
      },
      {
        key: "GOOGL-2",
        symbol: "GOOGL",
        name: "YouTube",
        marketCap: "0.1T",
        sector: "Technology",
        industry: "Media",
      },
    ],
  },
];

const meta: Meta<typeof DataTable<Stock>> = {
  title: "components/DataTable",
  component: DataTable,
};
export default meta;

type Story = StoryObj<typeof DataTable<Stock>>;

export const Basic: Story = {
  render: () => <DataTable columns={columns} data={data} />,
};

export const WithSorting: Story = {
  render: () => <DataTable columns={columns} data={nestedData} />,
};

export const WithSelection: Story = {
  render: () => (
    <DataTable columns={columns} data={data} selectionMode="multiple" />
  ),
};

export const WithNestedRows: Story = {
  render: () => <DataTable columns={columns} data={nestedData} />,
};

export const WithCustomCell: Story = {
  render: () => (
    <DataTable
      columns={[
        ...columns.slice(0, 1),
        {
          ...columns[1],
          render: (row) => <span style={{ color: "purple" }}>{row.name}</span>,
        },
        ...columns.slice(2),
      ]}
      data={nestedData}
    />
  ),
};

export const WithColumnVisibility: Story = {
  render: () => (
    <DataTable columns={columns} data={nestedData} showColumnVisibilityDropdown />
  ),
};

export const WithResizableColumns: Story = {
  render: () => {
    const [resizable, setResizable] = React.useState(true);
    return (
      <div>
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="checkbox" checked={resizable} onChange={e => setResizable(e.target.checked)} /> Resizable Columns
          </label>
        </div>
        <DataTable columns={columns} data={nestedData} resizableColumns={resizable} />
      </div>
    );
  },
};

export const DataTableManager: Story = {
  render: () => {
    // State for sticky header
    const [sticky, setSticky] = React.useState<boolean>(true);
    const [resizable, setResizable] = React.useState(true);

    // State for editable cells
    const [editData, setEditData] = React.useState<Record<string, Stock>>(() =>
      Object.fromEntries(nestedData.map(row => [row.key, { ...row }]))
    );
    const handleCellEdit = (row: DataTableRow<Stock>, col: DataTableColumn<Stock>, value: string) => {
      setEditData(data => ({
        ...data,
        [row.key]: { ...data[row.key], [col.id]: value },
      }));
    };
    const editableCell = (row: DataTableRow<Stock>, col: DataTableColumn<Stock>) => (
      <input
        value={editData[row.key]?.[col.id as keyof Stock] ?? (row as any)[col.id]}
        onChange={e => handleCellEdit(row, col, e.target.value)}
        style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none' }}
      />
    );

    // Copyable/clickable rows
    const [copied, setCopied] = React.useState<string | null>(null);
    const handleRowCopy = (row: DataTableRow<Stock>) => {
      navigator.clipboard.writeText(JSON.stringify(row));
      setCopied(row.key);
      setTimeout(() => setCopied(null), 1000);
    };
    const handleRowClick = (row: DataTableRow<Stock>) => {
      alert(`Row clicked: ${row.key}`);
    };

    return (
      <div>
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="checkbox" checked={sticky} onChange={e => setSticky(e.target.checked)} /> Sticky Header
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="checkbox" checked={resizable} onChange={e => setResizable(e.target.checked)} /> Resizable Columns
          </label>
        </div>
        <DataTable
          columns={columns}
          data={nestedData}
          stickyHeader={sticky}
          editableCell={editableCell}
          onCellEdit={handleCellEdit}
          onRowClick={handleRowClick}
          copyableRow
          onRowCopy={handleRowCopy}
          renderRowActions={row => (
            <button onClick={() => handleRowCopy(row)} style={{ fontSize: 12 }}>
              {copied === row.key ? "Copied!" : "Copy"}
            </button>
          )}
          showColumnVisibilityDropdown
          resizableColumns={resizable}
        />
      </div>
    );
  },
};
