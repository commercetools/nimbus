import { createUIResource } from "@mcp-ui/server";
import type { ElementDefinition } from "../types/remote-dom.js";
import {
  buildCardElement,
  buildCardHeaderElement,
  buildCardContentElement,
  buildHeadingElement,
} from "../elements/index.js";

export interface ColumnDef {
  key: string;
  label: string;
}

export interface DataTableArgs {
  title?: string;
  columns: ColumnDef[];
  data: Record<string, unknown>[];
  ariaLabel: string;
}

export function createDataTable(args: DataTableArgs) {
  const { title, columns, data, ariaLabel } = args;

  // ✅ Transform column definitions to DataTable format
  const dataTableColumns = columns.map((col) => ({
    id: col.key,
    header: col.label,
    accessor: `(row) => row['${col.key}']`,
  }));

  // Transform data rows to include id field
  const dataTableRows = data.map((row, idx) => ({
    id: `row-${idx}`,
    ...row,
  }));

  // ✅ Build DataTable element - use convenience component tag
  const dataTable: ElementDefinition = {
    tagName: "nimbus-data-table",
    attributes: {
      columns: JSON.stringify(dataTableColumns), // Client will parse
      rows: JSON.stringify(dataTableRows), // Client will parse
      allowsSorting: true,
      density: "default",
      width: "100%",
      "aria-label": ariaLabel, // Keep kebab for aria
    },
  };

  // Wrap in card if title provided
  const element = title
    ? buildCardElement({
        elevation: "elevated",
        borderStyle: "outlined",
        width: "100%",
        maxWidth: "100%",
        children: [
          buildCardHeaderElement({
            children: [
              buildHeadingElement({
                content: title,
                size: "lg",
              }),
            ],
          }),
          buildCardContentElement({
            children: [dataTable],
          }),
        ],
      })
    : dataTable;

  return createUIResource({
    uri: `ui://data-table/${Date.now()}`,
    content: {
      type: "remoteDom",
      script: JSON.stringify({
        type: "structuredDom",
        element,
        framework: "react",
      }),
      framework: "react",
    },
    encoding: "text",
    metadata: {
      title: "Data Table",
      description: title || "Data table component",
      created: new Date().toISOString(),
    },
  });
}
