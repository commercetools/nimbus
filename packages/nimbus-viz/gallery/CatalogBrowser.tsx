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

// Representative data per concrete DataKind, so ANY entry can be previewed.
// Series/category carry a generous options bag (target, range, benchmark, band,
// errors) so overlay-bearing configs render their overlays.
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

type Mode = "configs" | "presets";

/** A selectable unit in the list: a distinct configuration, or a single preset. */
interface Unit {
  key: string;
  base: string;
  title: string;
  subtitle: string;
  rep: ChartRegistryEntry;
  members: ChartRegistryEntry[];
}

export function CatalogBrowser() {
  const t = useChartTheme();
  const entries = useMemo(() => [...chartRegistry.values()], []);
  const [mode, setMode] = useState<Mode>("configs");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("");

  // Build the list units: one per distinct config (deduped), or one per preset.
  const units = useMemo<Unit[]>(() => {
    if (mode === "presets") {
      return entries.map((e) => ({
        key: e.metadata.name,
        base: e.metadata.baseComponent,
        title: e.metadata.name,
        subtitle: e.metadata.questionString,
        rep: e,
        members: [e],
      }));
    }
    const m = new Map<string, ChartRegistryEntry[]>();
    for (const e of entries) {
      const key = e.metadata.configLabel ?? e.metadata.baseComponent;
      const arr = m.get(key);
      if (arr) arr.push(e);
      else m.set(key, [e]);
    }
    return [...m.entries()].map(([label, list]) => ({
      key: label,
      base: list[0].metadata.baseComponent,
      title: label,
      subtitle: `${list.length} preset${list.length === 1 ? "" : "s"}`,
      rep: list[0],
      members: list,
    }));
  }, [entries, mode]);

  const selectedUnit = units.find((u) => u.key === selected) ?? units[0];
  const currentKey = selectedUnit?.key ?? "";

  // Filter over title + every member's name / question / persona, group by base.
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const match = (u: Unit) =>
      !q ||
      u.title.toLowerCase().includes(q) ||
      u.members.some(
        (e) =>
          e.metadata.name.toLowerCase().includes(q) ||
          e.metadata.questionString.toLowerCase().includes(q) ||
          (e.metadata.persona ?? "").toLowerCase().includes(q)
      );
    const m = new Map<string, Unit[]>();
    for (const u of units) {
      if (!match(u)) continue;
      const arr = m.get(u.base);
      if (arr) arr.push(u);
      else m.set(u.base, [u]);
    }
    return [...m.entries()];
  }, [units, query]);

  const visible = groups.reduce((sum, [, list]) => sum + list.length, 0);
  const rep = selectedUnit?.rep;
  const kind = rep?.dataKinds[0] ?? "series";
  const sample = SAMPLE[kind];
  const intent: Intent = rep?.metadata.intents[0]?.intent ?? "TREND";
  const intentUnion = selectedUnit
    ? [
        ...new Set(
          selectedUnit.members.flatMap((e) =>
            e.metadata.intents.map((i) => i.intent)
          )
        ),
      ]
    : [];

  const tabBtn = (m: Mode, text: string) => (
    <button
      type="button"
      onClick={() => setMode(m)}
      style={{
        border: "none",
        background: mode === m ? t.accent : "transparent",
        color: mode === m ? t.surface : t.ink,
        padding: "5px 12px",
        cursor: "pointer",
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {text}
    </button>
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(300px, 380px) 1fr",
        gap: 16,
        alignItems: "start",
      }}
    >
      {/* ── list ── */}
      <div
        style={{
          border: `1px solid ${t.grid}`,
          borderRadius: 12,
          background: t.surface,
          display: "flex",
          flexDirection: "column",
          maxHeight: "80vh",
        }}
      >
        <div style={{ padding: 10, borderBottom: `1px solid ${t.grid}` }}>
          <div
            style={{
              display: "inline-flex",
              border: `1px solid ${t.grid}`,
              borderRadius: 8,
              overflow: "hidden",
              marginBottom: 8,
            }}
          >
            {tabBtn("configs", "Configurations")}
            {tabBtn("presets", "Presets")}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              mode === "configs"
                ? "Filter configurations…"
                : `Filter ${entries.length} presets…`
            }
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
            {visible}{" "}
            {mode === "configs" ? "distinct configurations" : "presets"} · ★ =
            canonical
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
              {list.map((u) => {
                const active = u.key === currentKey;
                const hasCanonical = u.members.some(
                  (e) => e.canonical !== false
                );
                return (
                  <button
                    key={u.key}
                    type="button"
                    onClick={() => setSelected(u.key)}
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
                        fontFamily:
                          mode === "presets"
                            ? "ui-monospace, SFMono-Regular, monospace"
                            : "inherit",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {u.title}
                      {hasCanonical ? " ★" : ""}
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
                      {u.subtitle}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ── preview + metadata ── */}
      <div
        style={{
          border: `1px solid ${t.grid}`,
          borderRadius: 12,
          background: t.surface,
          padding: 16,
        }}
      >
        {selectedUnit && rep && sample ? (
          <>
            <div style={{ marginBottom: 4 }}>
              <span
                style={{
                  fontFamily:
                    mode === "presets"
                      ? "ui-monospace, SFMono-Regular, monospace"
                      : "inherit",
                  fontWeight: 700,
                  fontSize: 15,
                  color: t.ink,
                }}
              >
                {selectedUnit.title}
              </span>
              <span style={{ fontSize: 12, color: t.mutedInk, marginLeft: 8 }}>
                {mode === "configs"
                  ? `${selectedUnit.members.length} preset${
                      selectedUnit.members.length === 1 ? "" : "s"
                    }`
                  : rep.canonical !== false
                    ? "canonical"
                    : "preset"}
              </span>
            </div>
            {mode === "presets" && (
              <div
                style={{ fontSize: 13, color: t.mutedInk, marginBottom: 12 }}
              >
                {rep.metadata.questionString}
              </div>
            )}

            <div
              style={{
                border: `1px solid ${t.grid}`,
                borderRadius: 10,
                padding: 8,
                margin: "12px 0",
              }}
            >
              <PreviewBoundary
                key={currentKey}
                fallback={
                  <div style={{ padding: 24, fontSize: 13, color: t.mutedInk }}>
                    This entry could not render with the sample {kind} data.
                  </div>
                }
              >
                <ResponsiveContainer height={280}>
                  {(w, h) =>
                    resolveByName(
                      rep.metadata.name,
                      { intent, data: sample.data, options: sample.options },
                      { width: w, height: h }
                    ).render({ width: w, height: h })
                  }
                </ResponsiveContainer>
              </PreviewBoundary>
            </div>

            <Meta label="Base" value={rep.metadata.baseComponent} />
            <Meta label="Intents" value={intentUnion.join(", ")} />
            <Meta
              label="Shapes"
              value={rep.metadata.acceptedShapes.join(", ")}
            />
            <Meta label="Data kinds" value={rep.dataKinds.join(", ")} />
            {rep.metadata.overlays?.length ? (
              <Meta label="Overlays" value={rep.metadata.overlays.join(", ")} />
            ) : null}

            {mode === "configs" && (
              <div style={{ marginTop: 14 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: t.mutedInk,
                    marginBottom: 6,
                  }}
                >
                  {selectedUnit.members.length === 1
                    ? "The one preset with this configuration"
                    : `${selectedUnit.members.length} presets share this configuration`}
                </div>
                <div
                  style={{
                    maxHeight: 220,
                    overflow: "auto",
                    border: `1px solid ${t.grid}`,
                    borderRadius: 8,
                  }}
                >
                  {selectedUnit.members.map((e) => (
                    <div
                      key={e.metadata.name}
                      style={{
                        padding: "6px 10px",
                        borderBottom: `1px solid ${t.grid}`,
                        fontSize: 12,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "ui-monospace, SFMono-Regular, monospace",
                          color: t.ink,
                        }}
                      >
                        {e.metadata.name}
                        {e.canonical !== false ? " ★" : ""}
                      </span>
                      <span style={{ color: t.mutedInk }}>
                        {" — "}
                        {e.metadata.persona ?? "canonical"}:{" "}
                        {e.metadata.questionString}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
