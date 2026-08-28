// @commercetools/nimbus-viz — selection engine ("the brain").
//
// An agent expresses an intent + data; `resolve` deterministically picks and
// renders the right chart, logs the decision, and never throws (falling back to
// the guaranteed DataTable). See docs/06 for the algorithm.

// Types & taxonomies
export type {
  Intent,
  DataShape,
  DataKind,
  Primacy,
  IntentTag,
  ChartConstraints,
  ChartSelectionMetadata,
  ChartSize,
  ResolveRequest,
  ResolveResult,
  ChartRegistryEntry,
  ChartRegistry,
} from "./types";
export { INTENTS, DATA_SHAPES, isIntent, DATA_TABLE_NAME } from "./types";

// Data facts
export { deriveFacts, detectKind, ENTITY_ID_ACCESSOR } from "./derive-facts";
export type { DataFacts } from "./derive-facts";

// Registry
export { chartRegistry, createDefaultRegistry } from "./registry";

// Resolver
export { resolve, tabularize, renderFallbackTable } from "./resolve";

// Demoable component
export { ResolvedChart } from "./resolved-chart";
export type { ResolvedChartProps } from "./resolved-chart";

// Telemetry
export { setTelemetrySink, getTelemetrySink } from "./telemetry";
export type { TelemetryRecord, TelemetrySink } from "./telemetry";

// Fallback component (re-exported for convenience)
export { DataTable } from "../components/data-table";
export type { DataTableProps } from "../components/data-table";
