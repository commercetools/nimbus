import { createUIResource } from "@mcp-ui/server";

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

  // Escape strings for JavaScript
  const escapedTitle = title?.replace(/'/g, "\\'");

  const headerScript = columns
    .map((col) => {
      const escapedLabel = col.label.replace(/'/g, "\\'");
      return `
    const header${col.key} = document.createElement('nimbus-text');
    header${col.key}.setAttribute('font-weight', 'bold');
    header${col.key}.textContent = '${escapedLabel}';
    headerRow.appendChild(header${col.key});
    `;
    })
    .join("\n");

  const rowsScript = data
    .map((row, rowIdx) => {
      const cellsScript = columns
        .map((col) => {
          const cellValue = String(row[col.key] || "").replace(/'/g, "\\'");
          return `
      const cell${rowIdx}_${col.key} = document.createElement('nimbus-text');
      cell${rowIdx}_${col.key}.textContent = '${cellValue}';
      row${rowIdx}.appendChild(cell${rowIdx}_${col.key});
      `;
        })
        .join("\n");

      return `
    const row${rowIdx} = document.createElement('nimbus-flex');
    row${rowIdx}.setAttribute('gap', '400');
    row${rowIdx}.setAttribute('padding', '300');
    row${rowIdx}.setAttribute('border-bottom', '1px solid');
    row${rowIdx}.setAttribute('border-color', 'neutral.6');
    ${cellsScript}
    tableBody.appendChild(row${rowIdx});
    `;
    })
    .join("\n");

  const remoteDomScript = `
    const card = document.createElement('nimbus-card');
    card.setAttribute('variant', 'elevated');
    card.setAttribute('max-width', '100%');

    const cardBody = document.createElement('nimbus-card-body');

    ${
      title
        ? `
    const heading = document.createElement('nimbus-heading');
    heading.setAttribute('size', 'lg');
    heading.setAttribute('margin-bottom', '400');
    heading.textContent = '${escapedTitle}';
    cardBody.appendChild(heading);
    `
        : ""
    }

    const tableContainer = document.createElement('nimbus-stack');
    tableContainer.setAttribute('direction', 'column');
    tableContainer.setAttribute('gap', '0');

    const headerRow = document.createElement('nimbus-flex');
    headerRow.setAttribute('gap', '400');
    headerRow.setAttribute('padding', '400');
    headerRow.setAttribute('background-color', 'neutral.3');
    headerRow.setAttribute('border-bottom', '2px solid');
    headerRow.setAttribute('border-color', 'neutral.6');

    ${headerScript}

    const tableBody = document.createElement('nimbus-stack');
    tableBody.setAttribute('direction', 'column');
    tableBody.setAttribute('gap', '0');

    ${rowsScript}

    tableContainer.appendChild(headerRow);
    tableContainer.appendChild(tableBody);
    cardBody.appendChild(tableContainer);
    card.appendChild(cardBody);
    root.appendChild(card);
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
