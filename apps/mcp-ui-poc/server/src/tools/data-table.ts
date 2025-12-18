import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ElementDefinition } from "../types/remote-dom.js";
import {
  buildCardElement,
  buildCardHeaderElement,
  buildCardContentElement,
  buildHeadingElement,
} from "../elements/index.js";
import { createRemoteDomResource } from "../utils/create-remote-dom-resource.js";

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

  // Transform column definitions to DataTable format
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

  // Build DataTable element - use convenience component tag
  const dataTable: ElementDefinition = {
    tagName: "nimbus-data-table",
    attributes: {
      columns: JSON.stringify(dataTableColumns), // Client will parse
      rows: JSON.stringify(dataTableRows), // Client will parse
      allowsSorting: true,
      density: "default",
      width: "100%",
      "aria-label": ariaLabel,
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

  return createRemoteDomResource(element, {
    name: "data-table",
    title: "Data Table",
    description: title || "Data table component",
  });
}

export function registerDataTableTool(server: McpServer) {
  server.registerTool(
    "createDataTable",
    {
      title: "Create Data Table",
      description:
        "Creates a data table UI component with headers and rows using Nimbus design system components. IMPORTANT: Always provide a descriptive aria-label for accessibility.",
      inputSchema: z.object({
        title: z.string().optional().describe("Table title"),
        columns: z
          .array(
            z.object({
              key: z.string().describe("Column key (matches data object keys)"),
              label: z.string().describe("Column header label"),
            })
          )
          .describe("Array of column definitions"),
        data: z.array(z.record(z.any())).describe("Array of data objects"),
        ariaLabel: z
          .string()
          .describe(
            "Accessible label for the table (REQUIRED for accessibility)"
          ),
      }),
    },
    async (args) => {
      const uiResource = createDataTable(args);
      return {
        content: [uiResource],
      };
    }
  );
}
