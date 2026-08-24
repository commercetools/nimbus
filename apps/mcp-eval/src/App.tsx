import React, { useEffect, useState } from "react";

// ---------------------------------------------------------------------------
// Types matching run-eval.ts output
// ---------------------------------------------------------------------------

interface MappingResult {
  uiKitName: string;
  nimbusEquivalent: string | null;
  importPath: string | null;
  mappingType: string;
  styleProps?: string;
  propMappings?: unknown[];
  callbackAdapters?: unknown[];
  propShapeTransforms?: unknown[];
  codeReduction?: unknown;
  propMigrations?: unknown[];
  iconWrapper?: unknown;
  layoutGuidance?: string;
  typeNotes?: string[];
  hint?: string;
  breakingChanges: string[];
  notes: string;
}

interface FileMigrationResult {
  fixture: string;
  mappings: MappingResult[];
  unmapped: Array<{
    name: string;
    suggestion?: { name: string; confidence: string };
  }>;
  layoutGuidance?: string;
  coverage: number;
  stylePropsCount: number;
}

interface ComponentResult {
  name: string;
  data: Record<string, unknown>;
  hasStyleProps: boolean;
  fields: string[];
}

interface EvalResults {
  timestamp: string;
  fileMigrations: FileMigrationResult[];
  componentLookups: ComponentResult[];
  stylePropsPage: { categoryCount: number; content: string };
  componentStyleProps: Array<{
    name: string;
    hasStyleProps: boolean;
    styleProps?: string;
  }>;
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = {
  body: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    margin: 0,
    padding: "24px 32px",
    background: "#0d1117",
    color: "#c9d1d9",
    minHeight: "100vh",
  } as React.CSSProperties,
  h1: {
    fontSize: 28,
    fontWeight: 600,
    color: "#f0f6fc",
    margin: "0 0 4px",
  } as React.CSSProperties,
  subtitle: {
    fontSize: 13,
    color: "#8b949e",
    margin: "0 0 24px",
  } as React.CSSProperties,
  section: {
    marginBottom: 32,
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: "#f0f6fc",
    margin: "0 0 12px",
    borderBottom: "1px solid #21262d",
    paddingBottom: 8,
  } as React.CSSProperties,
  card: {
    background: "#161b22",
    border: "1px solid #30363d",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  } as React.CSSProperties,
  cardTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: "#f0f6fc",
    margin: "0 0 8px",
  } as React.CSSProperties,
  stat: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 500,
    marginRight: 8,
    marginBottom: 4,
  } as React.CSSProperties,
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: 13,
  },
  th: {
    textAlign: "left" as const,
    padding: "8px 12px",
    borderBottom: "1px solid #30363d",
    color: "#8b949e",
    fontWeight: 500,
    fontSize: 12,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  },
  td: {
    padding: "6px 12px",
    borderBottom: "1px solid #21262d",
  } as React.CSSProperties,
  badge: (color: string) =>
    ({
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: 12,
      fontSize: 11,
      fontWeight: 500,
      background: color + "22",
      color: color,
      border: `1px solid ${color}44`,
    }) as React.CSSProperties,
  chip: {
    display: "inline-block",
    padding: "2px 6px",
    borderRadius: 4,
    fontSize: 11,
    background: "#30363d",
    color: "#8b949e",
    marginRight: 4,
    marginBottom: 2,
  } as React.CSSProperties,
  bar: (pct: number, color: string) =>
    ({
      height: 6,
      borderRadius: 3,
      background: "#21262d",
      position: "relative" as const,
      overflow: "hidden",
      width: 120,
      display: "inline-block",
      verticalAlign: "middle",
      marginRight: 8,
      "&::after": {},
    }) as React.CSSProperties,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const RICH_FIELDS = [
  "propMappings",
  "callbackAdapters",
  "propShapeTransforms",
  "codeReduction",
  "propMigrations",
  "iconWrapper",
  "typeNotes",
] as const;

function Bar({ pct, color }: { pct: number; color: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span
        style={{
          width: 120,
          height: 6,
          borderRadius: 3,
          background: "#21262d",
          display: "inline-block",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            display: "block",
            borderRadius: 3,
          }}
        />
      </span>
      <span style={{ fontSize: 12, color: "#8b949e" }}>{Math.round(pct)}%</span>
    </span>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <span style={{ ...styles.stat, background: color + "18", color }}>
      {value} {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

function FileMigrationSection({ data }: { data: FileMigrationResult }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div style={styles.card}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <h3 style={styles.cardTitle}>{data.fixture}</h3>
        <div>
          <Stat label="mapped" value={data.mappings.length} color="#3fb950" />
          <Stat
            label="unmapped"
            value={data.unmapped.length}
            color={data.unmapped.length > 0 ? "#f0883e" : "#8b949e"}
          />
          <Stat
            label="styleProps"
            value={data.stylePropsCount}
            color="#a371f7"
          />
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: "#8b949e", marginRight: 8 }}>
          Coverage
        </span>
        <Bar pct={data.coverage * 100} color="#3fb950" />
        <span
          style={{
            fontSize: 12,
            color: "#8b949e",
            marginLeft: 8,
            marginRight: 16,
          }}
        >
          Style props
        </span>
        <Bar
          pct={(data.stylePropsCount / data.mappings.length) * 100}
          color="#a371f7"
        />
      </div>

      {data.layoutGuidance && (
        <div
          style={{
            ...styles.badge("#58a6ff"),
            marginBottom: 8,
            display: "inline-block",
          }}
        >
          ✓ layoutGuidance
        </div>
      )}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>UI Kit</th>
            <th style={styles.th}>Nimbus</th>
            <th style={styles.th}>Type</th>
            <th style={styles.th}>Style Props</th>
            <th style={styles.th}>Rich Data</th>
          </tr>
        </thead>
        <tbody>
          {data.mappings.map((m) => {
            const richFields = RICH_FIELDS.filter(
              (f) => m[f as keyof MappingResult] !== undefined
            );
            return (
              <React.Fragment key={m.uiKitName}>
                <tr
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setExpanded(expanded === m.uiKitName ? null : m.uiKitName)
                  }
                >
                  <td style={styles.td}>
                    <code style={{ fontSize: 12 }}>{m.uiKitName}</code>
                  </td>
                  <td style={styles.td}>
                    <code style={{ fontSize: 12, color: "#79c0ff" }}>
                      {m.nimbusEquivalent || "—"}
                    </code>
                  </td>
                  <td style={styles.td}>
                    <span
                      style={styles.badge(
                        m.mappingType === "direct"
                          ? "#3fb950"
                          : m.mappingType === "variant"
                            ? "#58a6ff"
                            : m.mappingType === "compound"
                              ? "#f0883e"
                              : m.mappingType === "pattern"
                                ? "#a371f7"
                                : "#8b949e"
                      )}
                    >
                      {m.mappingType}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {m.styleProps ? (
                      <span style={{ color: "#a371f7" }}>✅</span>
                    ) : (
                      <span style={{ color: "#484f58" }}>—</span>
                    )}
                  </td>
                  <td style={styles.td}>
                    {richFields.map((f) => (
                      <span key={f} style={styles.chip}>
                        {f}
                      </span>
                    ))}
                  </td>
                </tr>
                {expanded === m.uiKitName && (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        ...styles.td,
                        background: "#0d1117",
                        padding: 16,
                      }}
                    >
                      <pre
                        style={{
                          fontSize: 11,
                          margin: 0,
                          whiteSpace: "pre-wrap",
                          color: "#8b949e",
                        }}
                      >
                        {JSON.stringify(m, null, 2)}
                      </pre>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      {data.unmapped.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 12, color: "#f0883e", marginBottom: 4 }}>
            Unmapped ({data.unmapped.length}):
          </div>
          {data.unmapped.map((u) => (
            <span
              key={u.name}
              style={{
                ...styles.chip,
                borderColor: "#f0883e44",
                color: "#f0883e",
              }}
            >
              {u.name}
              {u.suggestion && (
                <span style={{ color: "#8b949e" }}>
                  {" "}
                  → {u.suggestion.name}?
                </span>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function ComponentLookupsSection({ data }: { data: ComponentResult[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div style={styles.card}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Component</th>
            <th style={styles.th}>Style Props</th>
            <th style={styles.th}>Fields Present</th>
          </tr>
        </thead>
        <tbody>
          {data.map((c) => (
            <React.Fragment key={c.name}>
              <tr
                style={{ cursor: "pointer" }}
                onClick={() => setExpanded(expanded === c.name ? null : c.name)}
              >
                <td style={styles.td}>
                  <code style={{ fontSize: 12 }}>{c.name}</code>
                </td>
                <td style={styles.td}>
                  {c.hasStyleProps ? (
                    <span style={{ color: "#a371f7" }}>✅</span>
                  ) : (
                    <span style={{ color: "#484f58" }}>—</span>
                  )}
                </td>
                <td style={styles.td}>
                  {c.fields
                    .filter(
                      (f) =>
                        ![
                          "uiKitName",
                          "nimbusEquivalent",
                          "importPath",
                          "mappingType",
                          "notes",
                          "breakingChanges",
                        ].includes(f)
                    )
                    .map((f) => (
                      <span key={f} style={styles.chip}>
                        {f}
                      </span>
                    ))}
                </td>
              </tr>
              {expanded === c.name && (
                <tr>
                  <td
                    colSpan={3}
                    style={{ ...styles.td, background: "#0d1117", padding: 16 }}
                  >
                    <pre
                      style={{
                        fontSize: 11,
                        margin: 0,
                        whiteSpace: "pre-wrap",
                        color: "#8b949e",
                      }}
                    >
                      {JSON.stringify(c.data, null, 2)}
                    </pre>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StylePropsGrid({
  data,
}: {
  data: EvalResults["componentStyleProps"];
}) {
  const withSP = data.filter((c) => c.hasStyleProps);
  const withoutSP = data.filter((c) => !c.hasStyleProps);

  return (
    <div style={styles.card}>
      <div style={{ display: "flex", gap: 24, marginBottom: 12 }}>
        <Stat label="with styleProps" value={withSP.length} color="#a371f7" />
        <Stat label="without" value={withoutSP.length} color="#8b949e" />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {data.map((c) => (
          <span
            key={c.name}
            style={{
              ...styles.badge(c.hasStyleProps ? "#a371f7" : "#484f58"),
              fontSize: 12,
              padding: "4px 10px",
            }}
            title={c.styleProps || "No style props"}
          >
            {c.hasStyleProps ? "✅ " : ""}
            {c.name}
          </span>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

export function App() {
  const [data, setData] = useState<EvalResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/eval-results.json")
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status} — run 'pnpm eval:json' first`);
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div style={styles.body}>
        <h1 style={styles.h1}>MCP Eval Dashboard</h1>
        <div style={{ ...styles.card, borderColor: "#f8514966" }}>
          <p style={{ color: "#f85149" }}>
            Failed to load eval results: {error}
          </p>
          <p style={{ color: "#8b949e", fontSize: 13 }}>
            Run <code>pnpm --filter mcp-eval eval:json</code> to generate the
            data.
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={styles.body}>
        <h1 style={styles.h1}>Loading...</h1>
      </div>
    );
  }

  return (
    <div style={styles.body}>
      <h1 style={styles.h1}>MCP Eval Dashboard</h1>
      <p style={styles.subtitle}>
        Generated {new Date(data.timestamp).toLocaleString()} — nimbus-mcp tool
        response quality
      </p>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          File Migrations ({data.fileMigrations.length} fixtures)
        </h2>
        {data.fileMigrations.map((fm) => (
          <FileMigrationSection key={fm.fixture} data={fm} />
        ))}
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          get_component — Style Props Coverage
        </h2>
        <StylePropsGrid data={data.componentStyleProps} />
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          Component Lookups ({data.componentLookups.length} scenarios)
        </h2>
        <ComponentLookupsSection data={data.componentLookups} />
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Style Props Landing Page</h2>
        <div style={styles.card}>
          <Stat
            label="categories in index"
            value={data.stylePropsPage.categoryCount}
            color="#a371f7"
          />
        </div>
      </div>
    </div>
  );
}
