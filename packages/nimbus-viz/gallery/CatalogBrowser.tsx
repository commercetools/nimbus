import { Component, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  chartRegistry,
  ResponsiveContainer,
  resolveByName,
  useChartTheme,
} from "../src";
import type { ChartRegistryEntry, Intent } from "../src";
import {
  channels,
  cohortPeriods,
  cohorts,
  composition,
  funnel,
  plan,
  revenueForecast,
  revenueSeries,
  scatter,
} from "./datasets";

// Representative data per concrete DataKind, so ANY entry in the catalog can be
// previewed. Series/category carry a generous options bag (target, range,
// benchmark, band, errors) so overlay-bearing presets render their overlays.
const SAMPLE: Record<
  string,
  { data: unknown; options?: Record<string, unknown> }
> = {
  series: {
    data: revenueSeries,
    options: {
      target: 200,
      rangeLow: 160,
      rangeHigh: 210,
      benchmark: plan,
      band: revenueForecast,
    },
  },
  category: {
    data: channels,
    options: {
      target: 3000,
      errors: [
        { x: 0, low: 3800, high: 4600 },
        { x: 1, low: 2800, high: 3400 },
        { x: 2, low: 1500, high: 2100 },
        { x: 3, low: 1000, high: 1400 },
        { x: 4, low: 500, high: 780 },
      ],
    },
  },
  "stack-row": { data: composition },
  scatter: { data: scatter },
  "heat-row": { data: cohorts, options: { columnLabels: cohortPeriods } },
  funnel: { data: funnel },
};

/** A local boundary so one throwing preview never blanks the whole browser. */
class PreviewBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function Meta({ label, value }: { label: string; value: ReactNode }) {
  const t = useChartTheme();
  return (
    <div style={{ display: "flex", gap: 8, fontSize: 12, lineHeight: 1.6 }}>
      <span style={{ color: t.mutedInk, minWidth: 96 }}>{label}</span>
      <span style={{ color: t.ink }}>{value}</span>
    </div>
  );
}

export function CatalogBrowser() {
  const t = useChartTheme();
  const entries = useMemo(() => [...chartRegistry.values()], []);
  const [selected, setSelected] = useState(entries[0]?.metadata.name ?? "");
  const [query, setQuery] = useState("");

  // Group by base component, filtered by a free-text query over name/question/persona.
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const match = (e: ChartRegistryEntry) =>
      !q ||
      e.metadata.name.toLowerCase().includes(q) ||
      e.metadata.questionString.toLowerCase().includes(q) ||
      (e.metadata.persona ?? "").toLowerCase().includes(q);
    const m = new Map<string, ChartRegistryEntry[]>();
    for (const e of entries) {
      if (!match(e)) continue;
      const arr = m.get(e.metadata.baseComponent) ?? [];
      arr.push(e);
      m.set(e.metadata.baseComponent, arr);
    }
    return [...m.entries()];
  }, [entries, query]);

  const entry = entries.find((e) => e.metadata.name === selected);
  const kind = entry?.dataKinds[0] ?? "series";
  const sample = SAMPLE[kind];
  const intent: Intent = entry?.metadata.intents[0]?.intent ?? "TREND";
  const visible = groups.reduce((sum, [, list]) => sum + list.length, 0);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(280px, 360px) 1fr",
        gap: 16,
        alignItems: "start",
      }}
    >
      {/* ── list of every entry, grouped by base ── */}
      <div
        style={{
          border: `1px solid ${t.grid}`,
          borderRadius: 12,
          background: t.surface,
          display: "flex",
          flexDirection: "column",
          maxHeight: "78vh",
        }}
      >
        <div style={{ padding: 10, borderBottom: `1px solid ${t.grid}` }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Filter ${entries.length} entries…`}
            style={{
              width: "100%",
              boxSizing: "border-box",
              border: `1px solid ${t.grid}`,
              borderRadius: 8,
              background: t.surfacePage,
              color: t.ink,
              padding: "6px 10px",
              fontSize: 13,
            }}
          />
          <div style={{ fontSize: 11, color: t.mutedInk, marginTop: 6 }}>
            {visible} shown · ★ = canonical
          </div>
        </div>
        <div style={{ overflow: "auto", padding: 8 }}>
          {groups.map(([base, list]) => (
            <div key={base} style={{ marginBottom: 8 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: t.mutedInk,
                  padding: "6px 8px",
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                }}
              >
                {base} · {list.length}
              </div>
              {list.map((e) => {
                const active = e.metadata.name === selected;
                const isCanonical = e.canonical !== false;
                return (
                  <button
                    key={e.metadata.name}
                    type="button"
                    onClick={() => setSelected(e.metadata.name)}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      padding: "6px 8px",
                      marginBottom: 2,
                      background: active ? t.accent : "transparent",
                      color: active ? t.surface : t.ink,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "ui-monospace, SFMono-Regular, monospace",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {e.metadata.name}
                      {isCanonical ? " ★" : ""}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: active ? t.surface : t.mutedInk,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {e.metadata.questionString}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ── preview + metadata for the selected entry ── */}
      <div
        style={{
          border: `1px solid ${t.grid}`,
          borderRadius: 12,
          background: t.surface,
          padding: 16,
        }}
      >
        {entry && sample ? (
          <>
            <div style={{ marginBottom: 4 }}>
              <span
                style={{
                  fontFamily: "ui-monospace, SFMono-Regular, monospace",
                  fontWeight: 700,
                  fontSize: 15,
                  color: t.ink,
                }}
              >
                {entry.metadata.name}
              </span>
              <span style={{ fontSize: 12, color: t.mutedInk, marginLeft: 8 }}>
                {entry.canonical !== false ? "canonical" : "preset"}
              </span>
            </div>
            <div style={{ fontSize: 13, color: t.mutedInk, marginBottom: 12 }}>
              {entry.metadata.questionString}
            </div>

            <div
              style={{
                border: `1px solid ${t.grid}`,
                borderRadius: 10,
                padding: 8,
                marginBottom: 12,
              }}
            >
              <PreviewBoundary
                key={selected}
                fallback={
                  <div style={{ padding: 24, fontSize: 13, color: t.mutedInk }}>
                    This entry could not render with the sample {kind} data.
                  </div>
                }
              >
                <ResponsiveContainer height={280}>
                  {(w, h) =>
                    resolveByName(
                      entry.metadata.name,
                      { intent, data: sample.data, options: sample.options },
                      { width: w, height: h }
                    ).render({ width: w, height: h })
                  }
                </ResponsiveContainer>
              </PreviewBoundary>
            </div>

            <Meta label="Base" value={entry.metadata.baseComponent} />
            {entry.metadata.persona && (
              <Meta label="Persona" value={entry.metadata.persona} />
            )}
            <Meta
              label="Intents"
              value={entry.metadata.intents
                .map(
                  (i) => `${i.intent}${i.primacy === "secondary" ? "·2nd" : ""}`
                )
                .join(", ")}
            />
            <Meta
              label="Shapes"
              value={entry.metadata.acceptedShapes.join(", ")}
            />
            <Meta label="Data kinds" value={entry.dataKinds.join(", ")} />
            {entry.metadata.overlays?.length ? (
              <Meta
                label="Overlays"
                value={entry.metadata.overlays.join(", ")}
              />
            ) : null}
          </>
        ) : (
          <div style={{ padding: 24, color: t.mutedInk }}>
            Select an entry from the list.
          </div>
        )}
      </div>
    </div>
  );
}
