import { createUIResource } from "@mcp-ui/server";
import { escapeForJS } from "./shared-types.js";

export interface ColumnDef {
  key: string;
  label: string;
}

export interface DataTableArgs {
  title?: string;
  columns: ColumnDef[];
  data: Record<string, unknown>[];
}

export function createDataTable(args: DataTableArgs) {
  const { title, columns, data } = args;

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

  // Serialize for JSON and escape for JavaScript template literal
  // Must escape backslashes first, then double quotes
  const columnsJson = JSON.stringify(dataTableColumns)
    .replace(/\\/g, "\\\\") // Escape backslashes first
    .replace(/"/g, '\\"'); // Then escape double quotes
  const rowsJson = JSON.stringify(dataTableRows)
    .replace(/\\/g, "\\\\") // Escape backslashes first
    .replace(/"/g, '\\"'); // Then escape double quotes
  const escapedTitle = title ? escapeForJS(title) : undefined;

  const remoteDomScript = `
    ${
      title
        ? `
    // Wrap in card with title
    const card = document.createElement('nimbus-card-root');
    card.setAttribute('elevation', 'elevated');
    card.setAttribute('border-style', 'outlined');
    card.setAttribute('width', '100%');
    card.setAttribute('max-width', '100%');

    const cardHeader = document.createElement('nimbus-card-header');
    const heading = document.createElement('nimbus-heading');
    heading.setAttribute('size', 'lg');
    heading.textContent = '${escapedTitle}';
    cardHeader.appendChild(heading);
    card.appendChild(cardHeader);

    const cardContent = document.createElement('nimbus-card-content');
    `
        : ""
    }

    // Create DataTable structure
    // Note: Only create the root element - the wrapper will render Table, Header, and Body
    const dataTableRoot = document.createElement('nimbus-data-table-root');
    dataTableRoot.setAttribute('columns', "${columnsJson}");
    dataTableRoot.setAttribute('rows', "${rowsJson}");
    dataTableRoot.setAttribute('allows-sorting', 'true');
    dataTableRoot.setAttribute('density', 'default');
    dataTableRoot.setAttribute('max-width', '100%');

    ${
      title
        ? `
    cardContent.appendChild(dataTableRoot);
    card.appendChild(cardContent);
    root.appendChild(card);
    `
        : `
    root.appendChild(dataTableRoot);
    `
    }
  `;

  return createUIResource({
    uri: `ui://data-table/${Date.now()}`,
    content: {
      type: "remoteDom",
      script: remoteDomScript,
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
