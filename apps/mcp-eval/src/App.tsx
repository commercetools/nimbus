import React, { useEffect, useState } from "react";

// ---------------------------------------------------------------------------
// Types (matching run-eval.ts output)
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
  typeNotes?: string[];
  hint?: string;
  breakingChanges: string[];
  notes: string;
}

interface FileMigrationResult {
  source: string;
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

interface ComponentLookupResult {
  source: string;
  name: string;
  data: Record<string, unknown>;
  hasStyleProps: boolean;
  fields: string[];
}

interface MigrationDimension {
  kind: "migration";
  source: string;
  label: string;
  fileMigrations: FileMigrationResult[];
  componentLookups: ComponentLookupResult[];
}

interface ComponentDocResult {
  name: string;
  hasStyleProps: boolean;
  styleProps?: string;
  sections: string[];
  hasDescription: boolean;
}

interface ComponentDocsDimension {
  kind: "component-docs";
  label: string;
  components: ComponentDocResult[];
}

interface DocsPageCheck {
  path: string;
  label: string;
  hasStyleProps: boolean;
  contentLength: number;
  extra?: Record<string, unknown>;
}

interface DocsPagesDimension {
  kind: "docs-pages";
  label: string;
  pages: DocsPageCheck[];
}

type EvalDimension =
  MigrationDimension | ComponentDocsDimension | DocsPagesDimension;

interface StylePropCategory {
  name: string;
  path: string;
  props: string[];
}

interface EvalResults {
  timestamp: string;
  dimensions: EvalDimension[];
  stylePropCategories: StylePropCategory[];
}

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------

const c = {
  bg: "#0d1117",
  card: "#161b22",
  deep: "#0d1117",
  border: "#30363d",
  row: "#21262d",
  h1: "#f0f6fc",
  body: "#c9d1d9",
  muted: "#8b949e",
  dim: "#484f58",
  green: "#3fb950",
  blue: "#58a6ff",
  purple: "#a371f7",
  orange: "#f0883e",
  red: "#f85149",
};

// ---------------------------------------------------------------------------
// Tiny components
// ---------------------------------------------------------------------------

function Badge({
  color,
  children,
}: {
  color: string;
  children: React.ReactNode;
}) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 12,
        fontSize: 11,
        fontWeight: 500,
        background: color + "22",
        color,
        border: `1px solid ${color}44`,
        marginRight: 4,
      }}
    >
      {children}
    </span>
  );
}

function Stat({
  value,
  label,
  color,
}: {
  value: number | string;
  label: string;
  color: string;
}) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 32, fontWeight: 700, color, lineHeight: 1.1 }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: c.muted, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function Bar({
  pct,
  color,
  width = 100,
}: {
  pct: number;
  color: string;
  width?: number;
}) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span
        style={{
          width,
          height: 6,
          borderRadius: 3,
          background: c.row,
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
      <span style={{ fontSize: 11, color: c.muted, minWidth: 30 }}>
        {Math.round(pct)}%
      </span>
    </span>
  );
}

function Chip({
  children,
  color = c.muted,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "1px 6px",
        borderRadius: 4,
        fontSize: 10,
        background: c.row,
        color,
        marginRight: 3,
        marginBottom: 2,
      }}
    >
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Summary section (always visible at top)
// ---------------------------------------------------------------------------

function Summary({ data }: { data: EvalResults }) {
  const migDim = data.dimensions.find(
    (d): d is MigrationDimension => d.kind === "migration"
  );
  const docDim = data.dimensions.find(
    (d): d is ComponentDocsDimension => d.kind === "component-docs"
  );
  if (!migDim) return null;

  const totalMapped = migDim.fileMigrations.reduce(
    (s, f) => s + f.mappings.length,
    0
  );
  const totalUnmapped = migDim.fileMigrations.reduce(
    (s, f) => s + f.unmapped.length,
    0
  );
  const totalStyleProps = migDim.fileMigrations.reduce(
    (s, f) => s + f.stylePropsCount,
    0
  );
  const avgCoverage =
    migDim.fileMigrations.reduce((s, f) => s + f.coverage, 0) /
    migDim.fileMigrations.length;
  const hasLayout = migDim.fileMigrations.some((f) => f.layoutGuidance);
  const docStyleProps =
    docDim?.components.filter((c) => c.hasStyleProps).length ?? 0;

  // Action items
  const actions: Array<{
    icon: string;
    text: string;
    severity: "info" | "warn" | "good";
  }> = [];

  if (totalUnmapped > 0) {
    const names = migDim.fileMigrations.flatMap((f) =>
      f.unmapped.map((u) => u.name)
    );
    const unique = [...new Set(names)];
    actions.push({
      icon: "⚠️",
      text: `${unique.length} unmapped imports: ${unique.join(", ")}`,
      severity: "warn",
    });
  }

  const noStyleButNimbus = migDim.fileMigrations.flatMap((f) =>
    f.mappings.filter(
      (m) =>
        !m.styleProps &&
        m.importPath === "@commercetools/nimbus" &&
        m.nimbusEquivalent
    )
  );
  if (noStyleButNimbus.length > 0) {
    const uniqueTargets = [
      ...new Set(noStyleButNimbus.map((m) => m.nimbusEquivalent)),
    ];
    actions.push({
      icon: "📋",
      text: `${uniqueTargets.length} Nimbus targets without styleProps: ${uniqueTargets.join(", ")}`,
      severity: "info",
    });
  }

  if (hasLayout) {
    actions.push({
      icon: "✅",
      text: "layoutGuidance hoisted for nested Spacings/Constraints",
      severity: "good",
    });
  }

  if (totalStyleProps > 0) {
    actions.push({
      icon: "✅",
      text: `${totalStyleProps} mappings include styleProps hint`,
      severity: "good",
    });
  }

  const sevColor = { info: c.blue, warn: c.orange, good: c.green };

  return (
    <div
      style={{
        background: c.card,
        border: `1px solid ${c.border}`,
        borderRadius: 8,
        padding: 20,
        marginBottom: 24,
      }}
    >
      {/* Stats row */}
      <div
        style={{
          display: "flex",
          gap: 40,
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <Stat
          value={`${Math.round(avgCoverage * 100)}%`}
          label="coverage"
          color={c.green}
        />
        <Stat value={totalMapped} label="mapped" color={c.body} />
        <Stat
          value={totalUnmapped}
          label="unmapped"
          color={totalUnmapped > 0 ? c.orange : c.muted}
        />
        <Stat
          value={totalStyleProps}
          label="styleProps hints"
          color={c.purple}
        />
        <Stat
          value={docStyleProps}
          label="components w/ styleProps"
          color={c.purple}
        />
        <Stat
          value={data.stylePropCategories.length}
          label="style prop categories"
          color={c.muted}
        />
      </div>
      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {actions.map((a, i) => (
          <div
            key={i}
            style={{
              fontSize: 13,
              color: sevColor[a.severity],
              display: "flex",
              gap: 8,
              alignItems: "flex-start",
            }}
          >
            <span>{a.icon}</span>
            <span>{a.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Side-by-side view with style props detail
// ---------------------------------------------------------------------------

function SideBySideView({
  dim,
  categories,
}: {
  dim: MigrationDimension;
  categories: StylePropCategory[];
}) {
  const [selectedFixture, setSelectedFixture] = useState(0);
  const [expandedComponent, setExpandedComponent] = useState<string | null>(
    null
  );
  const fm = dim.fileMigrations[selectedFixture];
  if (!fm) return <p>No fixtures.</p>;

  const withSP = fm.mappings.filter((m) => m.styleProps);
  const withoutSP = fm.mappings.filter((m) => !m.styleProps);

  return (
    <div>
      {dim.fileMigrations.length > 1 && (
        <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
          {dim.fileMigrations.map((f, i) => (
            <span
              key={f.fixture}
              onClick={() => setSelectedFixture(i)}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                background: i === selectedFixture ? c.border : "transparent",
                color: i === selectedFixture ? c.h1 : c.muted,
                border: `1px solid ${i === selectedFixture ? c.border : "transparent"}`,
              }}
            >
              {f.fixture}
            </span>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Left: accepts style props */}
        <div
          style={{
            background: c.card,
            border: `1px solid ${c.border}`,
            borderRadius: 8,
            padding: 16,
            borderLeft: `3px solid ${c.purple}`,
          }}
        >
          <h3
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: c.purple,
              margin: "0 0 12px",
            }}
          >
            ✅ Accepts Style Props ({withSP.length})
          </h3>
          <div style={{ fontSize: 11, color: c.muted, marginBottom: 12 }}>
            These Nimbus targets accept all{" "}
            {categories.reduce((s, cat) => s + cat.props.length, 0)} style
            props. Click a component to see which categories are available.
          </div>
          {withSP.map((m) => {
            const isExpanded = expandedComponent === m.uiKitName;
            return (
              <div
                key={m.uiKitName}
                style={{ borderBottom: `1px solid ${c.row}` }}
              >
                <div
                  onClick={() =>
                    setExpandedComponent(isExpanded ? null : m.uiKitName)
                  }
                  style={{
                    padding: "8px 0",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <code style={{ fontSize: 13, color: c.h1 }}>
                      {m.uiKitName}
                    </code>
                    <span style={{ color: c.dim, margin: "0 6px" }}>→</span>
                    <code style={{ fontSize: 13, color: c.blue }}>
                      {m.nimbusEquivalent}
                    </code>
                  </div>
                  <Badge
                    color={
                      m.mappingType === "direct"
                        ? c.green
                        : m.mappingType === "variant"
                          ? c.blue
                          : c.purple
                    }
                  >
                    {m.mappingType}
                  </Badge>
                </div>
                {isExpanded && (
                  <div style={{ padding: "0 0 12px", fontSize: 12 }}>
                    <div style={{ color: c.purple, marginBottom: 8 }}>
                      {m.styleProps}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {categories.map((cat) => (
                        <span
                          key={cat.name}
                          title={cat.props.join(", ")}
                          style={{
                            padding: "3px 8px",
                            borderRadius: 4,
                            fontSize: 10,
                            fontWeight: 500,
                            background: c.purple + "18",
                            color: c.purple,
                            cursor: "help",
                          }}
                        >
                          {cat.name} ({cat.props.length})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: no style props */}
        <div
          style={{
            background: c.card,
            border: `1px solid ${c.border}`,
            borderRadius: 8,
            padding: 16,
            borderLeft: `3px solid ${c.muted}`,
          }}
        >
          <h3
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: c.muted,
              margin: "0 0 12px",
            }}
          >
            No Style Props ({withoutSP.length})
          </h3>
          <div style={{ fontSize: 11, color: c.muted, marginBottom: 12 }}>
            These components use recipe-based styling. Wrap in Box to add
            spacing/layout.
          </div>
          {withoutSP.map((m) => {
            const rich = [
              "propMappings",
              "callbackAdapters",
              "propShapeTransforms",
              "codeReduction",
              "propMigrations",
              "iconWrapper",
              "typeNotes",
            ].filter((f) => m[f as keyof MappingResult] !== undefined);
            return (
              <div
                key={m.uiKitName}
                style={{ padding: "8px 0", borderBottom: `1px solid ${c.row}` }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <code style={{ fontSize: 13, color: c.h1 }}>
                      {m.uiKitName}
                    </code>
                    <span style={{ color: c.dim, margin: "0 6px" }}>→</span>
                    <code style={{ fontSize: 13, color: c.blue }}>
                      {m.nimbusEquivalent || "—"}
                    </code>
                  </div>
                  <Badge
                    color={
                      m.mappingType === "direct"
                        ? c.green
                        : m.mappingType === "variant"
                          ? c.blue
                          : m.mappingType === "compound"
                            ? c.orange
                            : c.purple
                    }
                  >
                    {m.mappingType}
                  </Badge>
                </div>
                {rich.length > 0 && (
                  <div style={{ marginTop: 4 }}>
                    {rich.map((f) => (
                      <Chip key={f}>{f}</Chip>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {fm.unmapped.length > 0 && (
            <div
              style={{
                marginTop: 12,
                paddingTop: 8,
                borderTop: `1px solid ${c.border}`,
              }}
            >
              <div style={{ fontSize: 12, color: c.orange, marginBottom: 6 }}>
                Unmapped ({fm.unmapped.length})
              </div>
              {fm.unmapped.map((u) => (
                <div
                  key={u.name}
                  style={{ fontSize: 12, color: c.orange, padding: "2px 0" }}
                >
                  {u.name}
                  {u.suggestion && (
                    <span style={{ color: c.muted }}>
                      {" "}
                      → maybe {u.suggestion.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Overview table (compact)
// ---------------------------------------------------------------------------

function OverviewTable({ dim }: { dim: MigrationDimension }) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  return (
    <div>
      {dim.fileMigrations.map((fm) => (
        <div
          key={fm.fixture}
          style={{
            background: c.card,
            border: `1px solid ${c.border}`,
            borderRadius: 8,
            padding: 16,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <h3
              style={{ fontSize: 14, fontWeight: 600, color: c.h1, margin: 0 }}
            >
              {fm.fixture}
            </h3>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Bar pct={fm.coverage * 100} color={c.green} />
              <span style={{ fontSize: 11, color: c.purple }}>
                {fm.stylePropsCount} styleProps
              </span>
            </div>
          </div>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "6px 8px",
                    borderBottom: `1px solid ${c.border}`,
                    color: c.muted,
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Source → Target
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "6px 8px",
                    borderBottom: `1px solid ${c.border}`,
                    color: c.muted,
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    width: 60,
                  }}
                >
                  Type
                </th>
                <th
                  style={{
                    textAlign: "center",
                    padding: "6px 8px",
                    borderBottom: `1px solid ${c.border}`,
                    color: c.muted,
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    width: 30,
                  }}
                >
                  SP
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "6px 8px",
                    borderBottom: `1px solid ${c.border}`,
                    color: c.muted,
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Data
                </th>
              </tr>
            </thead>
            <tbody>
              {fm.mappings.map((m) => {
                const rich = [
                  "propMappings",
                  "callbackAdapters",
                  "propShapeTransforms",
                  "codeReduction",
                  "propMigrations",
                  "iconWrapper",
                  "typeNotes",
                ].filter((f) => m[f as keyof MappingResult] !== undefined);
                return (
                  <React.Fragment key={m.uiKitName}>
                    <tr
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setExpandedRow(
                          expandedRow === `${fm.fixture}:${m.uiKitName}`
                            ? null
                            : `${fm.fixture}:${m.uiKitName}`
                        )
                      }
                    >
                      <td
                        style={{
                          padding: "4px 8px",
                          borderBottom: `1px solid ${c.row}`,
                        }}
                      >
                        <code style={{ color: c.body }}>{m.uiKitName}</code>
                        <span style={{ color: c.dim }}> → </span>
                        <code style={{ color: c.blue }}>
                          {m.nimbusEquivalent || "—"}
                        </code>
                      </td>
                      <td
                        style={{
                          padding: "4px 8px",
                          borderBottom: `1px solid ${c.row}`,
                        }}
                      >
                        <Badge
                          color={
                            m.mappingType === "direct"
                              ? c.green
                              : m.mappingType === "variant"
                                ? c.blue
                                : m.mappingType === "compound"
                                  ? c.orange
                                  : c.purple
                          }
                        >
                          {m.mappingType}
                        </Badge>
                      </td>
                      <td
                        style={{
                          padding: "4px 8px",
                          borderBottom: `1px solid ${c.row}`,
                          textAlign: "center",
                        }}
                      >
                        {m.styleProps ? (
                          <span style={{ color: c.purple }}>✅</span>
                        ) : (
                          <span style={{ color: c.dim }}>—</span>
                        )}
                      </td>
                      <td
                        style={{
                          padding: "4px 8px",
                          borderBottom: `1px solid ${c.row}`,
                        }}
                      >
                        {rich.map((f) => (
                          <Chip key={f}>{f}</Chip>
                        ))}
                      </td>
                    </tr>
                    {expandedRow === `${fm.fixture}:${m.uiKitName}` && (
                      <tr>
                        <td
                          colSpan={4}
                          style={{
                            padding: 12,
                            background: c.deep,
                            borderBottom: `1px solid ${c.row}`,
                          }}
                        >
                          <pre
                            style={{
                              fontSize: 10,
                              margin: 0,
                              whiteSpace: "pre-wrap",
                              color: c.muted,
                              maxHeight: 300,
                              overflow: "auto",
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
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

type TabKey = "side-by-side" | "overview" | "component-docs" | "docs-pages";

export function App() {
  const [data, setData] = useState<EvalResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<TabKey>("side-by-side");

  useEffect(() => {
    fetch("/eval-results.json")
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error)
    return (
      <div
        style={{
          fontFamily: "sans-serif",
          background: c.bg,
          color: c.body,
          padding: 32,
          minHeight: "100vh",
        }}
      >
        <h1 style={{ color: c.h1 }}>MCP Eval Dashboard</h1>
        <p style={{ color: c.red }}>
          Failed to load. Run: <code>pnpm --filter mcp-eval eval:json</code>
        </p>
      </div>
    );
  if (!data)
    return (
      <div
        style={{
          fontFamily: "sans-serif",
          background: c.bg,
          color: c.h1,
          padding: 32,
          minHeight: "100vh",
        }}
      >
        <h1>Loading…</h1>
      </div>
    );

  const migDims = data.dimensions.filter(
    (d): d is MigrationDimension => d.kind === "migration"
  );
  const docDim = data.dimensions.find(
    (d): d is ComponentDocsDimension => d.kind === "component-docs"
  );
  const pagesDim = data.dimensions.find(
    (d): d is DocsPagesDimension => d.kind === "docs-pages"
  );

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: "side-by-side", label: "Side by Side" },
    { key: "overview", label: "Full Detail" },
    { key: "component-docs", label: "Component Docs" },
    { key: "docs-pages", label: "Docs Pages" },
  ];

  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        background: c.bg,
        color: c.body,
        padding: "24px 32px",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          fontSize: 28,
          fontWeight: 600,
          color: c.h1,
          margin: "0 0 4px",
        }}
      >
        MCP Eval Dashboard
      </h1>
      <p style={{ fontSize: 13, color: c.muted, margin: "0 0 20px" }}>
        {new Date(data.timestamp).toLocaleString()} — {data.dimensions.length}{" "}
        dimensions
      </p>

      {/* Actionable summary — always visible */}
      <Summary data={data} />

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
        {tabs.map((t) => (
          <span
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              background: tab === t.key ? c.border : "transparent",
              color: tab === t.key ? c.h1 : c.muted,
              border: `1px solid ${tab === t.key ? c.border : "transparent"}`,
            }}
          >
            {t.label}
          </span>
        ))}
      </div>

      {/* Tab content */}
      {tab === "side-by-side" &&
        migDims.map((dim) => (
          <SideBySideView
            key={dim.source}
            dim={dim}
            categories={data.stylePropCategories}
          />
        ))}

      {tab === "overview" &&
        migDims.map((dim) => <OverviewTable key={dim.source} dim={dim} />)}

      {tab === "component-docs" && docDim && (
        <div
          style={{
            background: c.card,
            border: `1px solid ${c.border}`,
            borderRadius: 8,
            padding: 16,
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {docDim.components.map((comp) => (
              <span
                key={comp.name}
                title={comp.styleProps || "No style props"}
                style={{
                  padding: "4px 10px",
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 500,
                  background: (comp.hasStyleProps ? c.purple : c.dim) + "22",
                  color: comp.hasStyleProps ? c.purple : c.dim,
                  border: `1px solid ${(comp.hasStyleProps ? c.purple : c.dim) + "44"}`,
                }}
              >
                {comp.hasStyleProps ? "✅ " : ""}
                {comp.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {tab === "docs-pages" && pagesDim && (
        <div
          style={{
            background: c.card,
            border: `1px solid ${c.border}`,
            borderRadius: 8,
            padding: 16,
          }}
        >
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "6px 8px",
                    borderBottom: `1px solid ${c.border}`,
                    color: c.muted,
                    fontSize: 10,
                    textTransform: "uppercase",
                  }}
                >
                  Page
                </th>
                <th
                  style={{
                    textAlign: "center",
                    padding: "6px 8px",
                    borderBottom: `1px solid ${c.border}`,
                    color: c.muted,
                    fontSize: 10,
                    textTransform: "uppercase",
                    width: 80,
                  }}
                >
                  Style Props
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "6px 8px",
                    borderBottom: `1px solid ${c.border}`,
                    color: c.muted,
                    fontSize: 10,
                    textTransform: "uppercase",
                    width: 100,
                  }}
                >
                  Content
                </th>
              </tr>
            </thead>
            <tbody>
              {pagesDim.pages.map((p) => (
                <tr key={p.path}>
                  <td
                    style={{
                      padding: "6px 8px",
                      borderBottom: `1px solid ${c.row}`,
                    }}
                  >
                    {p.label}{" "}
                    <code style={{ fontSize: 10, color: c.dim }}>{p.path}</code>
                    {p.extra &&
                      Object.entries(p.extra).map(([k, v]) => (
                        <Chip key={k} color={c.purple}>
                          {k}: {String(v)}
                        </Chip>
                      ))}
                  </td>
                  <td
                    style={{
                      padding: "6px 8px",
                      borderBottom: `1px solid ${c.row}`,
                      textAlign: "center",
                    }}
                  >
                    {p.hasStyleProps ? (
                      <span style={{ color: c.purple }}>✅</span>
                    ) : (
                      <span style={{ color: c.dim }}>—</span>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "6px 8px",
                      borderBottom: `1px solid ${c.row}`,
                      textAlign: "right",
                      color: c.muted,
                    }}
                  >
                    {(p.contentLength / 1000).toFixed(1)}k
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
