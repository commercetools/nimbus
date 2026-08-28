import { useChartTheme } from "../../theme";

export interface DataTableProps {
  /** Column headers, left-to-right. */
  columns: string[];
  /** Row-major cells. Ragged rows are padded; extra cells are ignored. */
  rows: (string | number)[][];
  /** Shown as a small banner above the table — e.g. why the resolver fell back. */
  reason?: string;
  /** Optional table caption. */
  caption?: string;
}

/**
 * The guaranteed fallback (docs/06: "If the filter empties, fall back to the
 * guaranteed DataTable"). A lean, themed HTML table — every color comes from
 * the chart theme roles, so it sits correctly on a card in light and dark.
 *
 * It renders defensively and NEVER throws: empty rows show an empty-state row,
 * ragged rows are padded, and any non-finite cell (`NaN` / `Infinity`) renders
 * as an em dash.
 *
 * Follow-up: graduate this to the real `@commercetools/nimbus` DataTable once
 * Nimbus is built in this checkout (it isn't today — see docs/09 "Deferred
 * integrations"). The props are intentionally primitive so that swap is a
 * drop-in.
 */
export function DataTable({ columns, rows, reason, caption }: DataTableProps) {
  const theme = useChartTheme();

  const cell = (value: string | number | undefined): string => {
    if (value === undefined) return "—";
    if (typeof value === "number")
      return Number.isFinite(value) ? String(value) : "—";
    return value;
  };

  const colCount = Math.max(1, columns.length);

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        color: theme.ink,
        background: theme.surface,
        overflowX: "auto",
        maxWidth: "100%",
      }}
    >
      {reason && (
        <div
          role="note"
          style={{
            fontSize: 12,
            lineHeight: 1.4,
            color: theme.mutedInk,
            background: theme.surfacePage,
            border: `1px solid ${theme.grid}`,
            borderRadius: 6,
            padding: "6px 10px",
            marginBottom: 8,
          }}
        >
          {reason}
        </div>
      )}
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          fontSize: 12,
        }}
      >
        {caption && (
          <caption
            style={{
              captionSide: "top",
              textAlign: "left",
              color: theme.mutedInk,
              fontSize: 12,
              paddingBottom: 6,
            }}
          >
            {caption}
          </caption>
        )}
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th
                key={`${col}-${i}`}
                scope="col"
                style={{
                  textAlign: "left",
                  fontWeight: 600,
                  color: theme.mutedInk,
                  borderBottom: `2px solid ${theme.grid}`,
                  padding: "6px 10px",
                  whiteSpace: "nowrap",
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={colCount}
                style={{
                  padding: "12px 10px",
                  color: theme.mutedInk,
                  textAlign: "center",
                }}
              >
                No rows to display.
              </td>
            </tr>
          ) : (
            rows.map((row, r) => (
              <tr key={r}>
                {columns.map((_, c) => (
                  <td
                    key={c}
                    style={{
                      borderBottom: `1px solid ${theme.grid}`,
                      padding: "6px 10px",
                      whiteSpace: "nowrap",
                      color: theme.ink,
                    }}
                  >
                    {cell(row[c])}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
