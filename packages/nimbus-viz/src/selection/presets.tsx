import { Fragment } from "react";
import type { ReactNode } from "react";
import {
  BenchmarkSeries,
  ConfidenceBand,
  ErrorBars,
  ReferenceLine,
  TargetMarker,
  ThresholdBand,
  TrendLine,
} from "../overlays";
import type { OverlayVariant } from "../overlays";
import { BASE_COMPONENT, OVERLAY_HOSTS, renderBase } from "./render-adapters";
import type { BaseName } from "./render-adapters";
import type {
  ChartConstraints,
  ChartRegistryEntry,
  ChartSelectionMetadata,
  ChartSize,
  DataKind,
  DataShape,
  Intent,
  IntentTag,
  Primacy,
  ResolveRequest,
} from "./types";

/**
 * The declarative preset catalog (docs/09 batch 6). A preset is pure config —
 * `{ name, base, overlays[], defaults, selectionMetadata }` — turned into a
 * registry entry by {@link presetToEntry}. This is the concrete answer to the
 * doc-04 open question "are presets pure config, or dedicated components?":
 * every preset below reuses one of the eight registered base charts; none is a
 * new React component. Presets are name-addressable (`resolveByName`) and tagged
 * with the docs/03 persona question they answer, so the agent-selectable catalog
 * grows toward ~100 without any new rendering code.
 */

/* -------------------------------------------------------------------------- */
/* Option / data extractors (no `any`; `unknown` + narrowing)                 */
/* -------------------------------------------------------------------------- */

function isRec(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function num(req: ResolveRequest, key: string): number | undefined {
  const v = (req.options ?? {})[key];
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}

function isXish(x: unknown): x is number | Date {
  return (typeof x === "number" && Number.isFinite(x)) || x instanceof Date;
}

function xyPoints(
  req: ResolveRequest,
  key: string
): { x: number | Date; y: number }[] {
  const v = (req.options ?? {})[key];
  if (!Array.isArray(v)) return [];
  const out: { x: number | Date; y: number }[] = [];
  for (const item of v) {
    if (isRec(item) && isXish(item.x) && typeof item.y === "number") {
      out.push({ x: item.x, y: item.y });
    }
  }
  return out;
}

function bandPoints(
  req: ResolveRequest,
  key: string
): { x: number | Date; low: number; high: number }[] {
  const v = (req.options ?? {})[key];
  if (!Array.isArray(v)) return [];
  const out: { x: number | Date; low: number; high: number }[] = [];
  for (const item of v) {
    if (
      isRec(item) &&
      isXish(item.x) &&
      typeof item.low === "number" &&
      typeof item.high === "number"
    ) {
      out.push({ x: item.x, low: item.low, high: item.high });
    }
  }
  return out;
}

/** Regression points straight from a scatter's own `request.data`. */
function selfScatterPoints(req: ResolveRequest): { x: number; y: number }[] {
  if (!Array.isArray(req.data)) return [];
  const out: { x: number; y: number }[] = [];
  for (const item of req.data as unknown[]) {
    if (
      isRec(item) &&
      typeof item.x === "number" &&
      typeof item.y === "number" &&
      Number.isFinite(item.x) &&
      Number.isFinite(item.y)
    ) {
      out.push({ x: item.x, y: item.y });
    }
  }
  return out;
}

/* -------------------------------------------------------------------------- */
/* Overlay specs — a name (for the catalog) + a builder (for rendering)       */
/* -------------------------------------------------------------------------- */

/** Builds an overlay element from the (defaults-merged) request. */
type OverlayBuilder = (request: ResolveRequest) => ReactNode;

interface OverlaySpec {
  name: string;
  build: OverlayBuilder;
}

/** A value-axis reference level; caller can override via `options.target`. */
function refLine(
  fallback: number,
  label: string,
  variant: OverlayVariant = "neutral"
): OverlaySpec {
  return {
    name: "ReferenceLine",
    build: (req) => (
      <ReferenceLine
        value={num(req, "target") ?? fallback}
        label={label}
        variant={variant}
      />
    ),
  };
}

/** A shaded value-axis band; caller overrides via `options.rangeLow/High`. */
function thresholdBand(
  loFallback: number,
  hiFallback: number,
  label: string,
  variant: OverlayVariant = "neutral"
): OverlaySpec {
  return {
    name: "ThresholdBand",
    build: (req) => (
      <ThresholdBand
        from={num(req, "rangeLow") ?? loFallback}
        to={num(req, "rangeHigh") ?? hiFallback}
        label={label}
        variant={variant}
      />
    ),
  };
}

/** A goal caret on the value axis; caller overrides via `options.target`. */
function targetMarker(
  fallback: number,
  label: string,
  variant: OverlayVariant = "accent"
): OverlaySpec {
  return {
    name: "TargetMarker",
    build: (req) => (
      <TargetMarker
        value={num(req, "target") ?? fallback}
        label={label}
        variant={variant}
      />
    ),
  };
}

/** A dashed comparison line; renders only when `options.benchmark` is given. */
function benchmark(label: string): OverlaySpec {
  return {
    name: "BenchmarkSeries",
    build: (req) => {
      const pts = xyPoints(req, "benchmark");
      return pts.length >= 2 ? (
        <BenchmarkSeries points={pts} label={label} />
      ) : null;
    },
  };
}

/** A forecast/CI envelope; renders only when `options.band` is given. */
function confidence(): OverlaySpec {
  return {
    name: "ConfidenceBand",
    build: (req) => {
      const pts = bandPoints(req, "band");
      return pts.length >= 2 ? <ConfidenceBand points={pts} /> : null;
    },
  };
}

/** Per-point whiskers; renders only when `options.errors` is given. */
function errorBars(): OverlaySpec {
  return {
    name: "ErrorBars",
    build: (req) => {
      const pts = bandPoints(req, "errors");
      return pts.length ? <ErrorBars points={pts} /> : null;
    },
  };
}

/** A regression line fit to the scatter's own points. */
function trend(): OverlaySpec {
  return {
    name: "TrendLine",
    build: (req) => {
      const pts = selfScatterPoints(req);
      return pts.length >= 2 ? <TrendLine points={pts} /> : null;
    },
  };
}

/* -------------------------------------------------------------------------- */
/* Preset definition + factory                                                */
/* -------------------------------------------------------------------------- */

export interface PresetDefinition {
  name: string;
  base: BaseName;
  intents: IntentTag[];
  acceptedShapes: DataShape[];
  dataKinds: DataKind[];
  overlays?: OverlaySpec[];
  defaults?: Record<string, unknown>;
  constraints: ChartConstraints;
  perceptualRank: number;
  bundleWeight: number;
  question: string;
  persona: string;
}

// Per-base defaults so a preset only states what makes it distinct.
const RANK: Record<BaseName, number> = {
  line: 0.95,
  "bar-vertical": 0.9,
  "bar-horizontal": 0.92,
  donut: 0.45,
  stacked: 0.72,
  scatter: 0.8,
  heatmap: 0.35,
  funnel: 0.6,
};
const WEIGHT: Record<BaseName, number> = {
  line: 12,
  "bar-vertical": 8,
  "bar-horizontal": 8,
  donut: 9,
  stacked: 10,
  scatter: 9,
  heatmap: 11,
  funnel: 6,
};
const KIND: Record<BaseName, DataKind[]> = {
  line: ["series"],
  "bar-vertical": ["category"],
  "bar-horizontal": ["category"],
  donut: ["category"],
  stacked: ["stack-row"],
  scatter: ["scatter"],
  heatmap: ["heat-row"],
  funnel: ["funnel"],
};
const SHAPES: Record<BaseName, DataShape[]> = {
  line: ["time-series", "multi-time-series"],
  "bar-vertical": ["categorical"],
  "bar-horizontal": ["ranking", "categorical"],
  donut: ["part-to-whole"],
  stacked: ["part-to-whole", "categorical"],
  scatter: ["two-variable"],
  heatmap: ["cohort-matrix"],
  funnel: ["flows-net"],
};

const t = (intent: Intent, primacy: Primacy = "primary"): IntentTag => ({
  intent,
  primacy,
});

interface PresetInput {
  name: string;
  base: BaseName;
  intents: IntentTag[];
  question: string;
  persona: string;
  overlays?: OverlaySpec[];
  defaults?: Record<string, unknown>;
  constraints?: ChartConstraints;
  perceptualRank?: number;
  bundleWeight?: number;
  acceptedShapes?: DataShape[];
  dataKinds?: DataKind[];
}

function def(input: PresetInput): PresetDefinition {
  return {
    name: input.name,
    base: input.base,
    intents: input.intents,
    question: input.question,
    persona: input.persona,
    overlays: input.overlays,
    defaults: input.defaults,
    constraints: input.constraints ?? {},
    acceptedShapes: input.acceptedShapes ?? SHAPES[input.base],
    dataKinds: input.dataKinds ?? KIND[input.base],
    perceptualRank: input.perceptualRank ?? RANK[input.base],
    bundleWeight:
      input.bundleWeight ??
      WEIGHT[input.base] + (input.overlays?.length ? 2 : 0),
  };
}

function withDefaults(
  request: ResolveRequest,
  defaults?: Record<string, unknown>
): ResolveRequest {
  if (!defaults) return request;
  return { ...request, options: { ...defaults, ...(request.options ?? {}) } };
}

/** Turn a preset definition into a (non-canonical) registry entry. */
export function presetToEntry(preset: PresetDefinition): ChartRegistryEntry {
  const render = (request: ResolveRequest, size: ChartSize): ReactNode => {
    const req = withDefaults(request, preset.defaults);
    let overlays: ReactNode;
    if (preset.overlays?.length && OVERLAY_HOSTS.has(preset.base)) {
      overlays = preset.overlays.map((spec, i) => (
        <Fragment key={i}>{spec.build(req)}</Fragment>
      ));
    }
    return renderBase(preset.base, req, size, overlays);
  };

  const metadata: ChartSelectionMetadata = {
    name: preset.name,
    baseComponent: BASE_COMPONENT[preset.base],
    intents: preset.intents,
    acceptedShapes: preset.acceptedShapes,
    constraints: preset.constraints,
    perceptualRank: preset.perceptualRank,
    questionString: preset.question,
    bundleWeight: preset.bundleWeight,
    overlays: preset.overlays?.map((o) => o.name),
    persona: preset.persona,
  };

  return { metadata, dataKinds: preset.dataKinds, render, canonical: false };
}

/* -------------------------------------------------------------------------- */
/* The catalog — persona questions from docs/03, one preset each             */
/* -------------------------------------------------------------------------- */

export const PRESETS: PresetDefinition[] = [
  /* --- TREND / line (series) ------------------------------------------- */
  def({
    name: "revenue-trend",
    base: "line",
    intents: [t("TREND")],
    question: "Is revenue trending up or down?",
    persona: "Store Owner",
  }),
  def({
    name: "revenue-area-trend",
    base: "line",
    intents: [t("TREND")],
    defaults: { variant: "area" },
    question: "How is revenue trending over time?",
    persona: "Store Owner",
  }),
  def({
    name: "margin-trend",
    base: "line",
    intents: [t("TREND")],
    question: "Gross / contribution margin trend?",
    persona: "Finance / Controller",
  }),
  def({
    name: "csat-nps-trend",
    base: "line",
    intents: [t("TREND")],
    question: "CSAT / NPS over time?",
    persona: "Customer Service Lead",
  }),
  def({
    name: "organic-traffic-trend",
    base: "line",
    intents: [t("TREND")],
    question: "Organic traffic trend (YoY)?",
    persona: "SEO / Content Manager",
  }),
  def({
    name: "ticket-volume-trend",
    base: "line",
    intents: [t("TREND")],
    defaults: { variant: "area" },
    question: "Ticket volume trend?",
    persona: "Customer Service Lead",
  }),
  def({
    name: "repeat-purchase-rate-trend",
    base: "line",
    intents: [t("TREND")],
    question: "Repeat purchase rate trend?",
    persona: "Customer Success Manager",
  }),
  def({
    name: "account-aov-trend",
    base: "line",
    intents: [t("TREND")],
    question: "AOV / order frequency per account trend?",
    persona: "B2B Account Manager",
  }),
  def({
    name: "webhook-volume-trend",
    base: "line",
    intents: [t("TREND")],
    defaults: { variant: "area" },
    question: "Webhook / event volume over time?",
    persona: "Developer / Integrator",
  }),
  def({
    name: "revenue-per-visitor-trend",
    base: "line",
    intents: [t("TREND")],
    question: "Revenue per visitor / session trend?",
    persona: "Growth / CRO Analyst",
  }),

  /* --- RANGE / TARGET over time — line + overlay ----------------------- */
  def({
    name: "sla-compliance-over-time",
    base: "line",
    intents: [t("RANGE"), t("TREND", "secondary"), t("TARGET", "secondary")],
    overlays: [
      thresholdBand(0, 0, "Healthy", "positive"),
      refLine(0, "SLA", "negative"),
    ],
    question: "First response time vs SLA?",
    persona: "Customer Service Lead",
  }),
  def({
    name: "cart-abandonment-trend",
    base: "line",
    intents: [t("TREND"), t("RANGE", "secondary")],
    overlays: [refLine(70, "Baymard ~70%", "negative")],
    question: "Cart abandonment rate & trend?",
    persona: "Growth / CRO Analyst",
  }),
  def({
    name: "refund-rate-trend",
    base: "line",
    intents: [t("TREND"), t("RANGE", "secondary")],
    overlays: [refLine(0, "Threshold", "negative")],
    question: "Refunds / returns as % of revenue?",
    persona: "Finance / Controller",
  }),
  def({
    name: "api-error-rate-trend",
    base: "line",
    intents: [t("RANGE"), t("TREND", "secondary")],
    overlays: [thresholdBand(0, 0, "Normal", "neutral")],
    question: "API error rate / uptime trend?",
    persona: "Developer / Integrator",
  }),
  def({
    name: "stockout-rate-trend",
    base: "line",
    intents: [t("TREND"), t("RANGE", "secondary")],
    overlays: [refLine(0, "Limit", "negative")],
    question: "Stockout rate & trend?",
    persona: "Inventory Manager",
  }),
  def({
    name: "chargeback-rate-vs-threshold",
    base: "line",
    intents: [t("RANGE"), t("TARGET", "secondary")],
    overlays: [refLine(1.5, "VAMP 1.5%", "negative")],
    question: "Chargeback rate vs network threshold?",
    persona: "Returns / Fraud / Risk Analyst",
  }),
  def({
    name: "control-chart-anomaly",
    base: "line",
    intents: [t("RANGE"), t("BENCH", "secondary")],
    overlays: [thresholdBand(0, 0, "Control limits", "neutral")],
    question: "Anomaly vs normal range?",
    persona: "Data Analyst / BI",
  }),
  def({
    name: "fraud-dispute-trend",
    base: "line",
    intents: [t("TREND"), t("RANGE", "secondary")],
    overlays: [refLine(0, "Threshold", "negative")],
    question: "Fraud / dispute trend over time?",
    persona: "Returns / Fraud / Risk Analyst",
  }),
  def({
    name: "perfect-order-rate-trend",
    base: "line",
    intents: [t("TREND"), t("TARGET", "secondary")],
    overlays: [refLine(0, "Target", "positive")],
    question: "Perfect order rate trend?",
    persona: "Operations Manager",
  }),
  def({
    name: "first-contact-resolution-trend",
    base: "line",
    intents: [t("TREND"), t("TARGET", "secondary")],
    overlays: [refLine(0, "Target", "positive")],
    question: "First contact resolution rate?",
    persona: "Customer Service Lead",
  }),
  def({
    name: "revenue-vs-plan",
    base: "line",
    intents: [t("TARGET"), t("BENCH", "secondary"), t("TREND", "secondary")],
    overlays: [benchmark("Plan"), refLine(0, "Budget", "neutral")],
    question: "Revenue vs budget / forecast?",
    persona: "Finance / Controller",
  }),
  def({
    name: "forecast-vs-actual",
    base: "line",
    intents: [t("COMPARE"), t("TREND", "secondary")],
    overlays: [confidence()],
    question: "Demand forecast vs actual?",
    persona: "Inventory Manager",
  }),

  /* --- COMPARE / bar-vertical (category) ------------------------------- */
  def({
    name: "roas-by-channel",
    base: "bar-vertical",
    intents: [t("COMPARE"), t("RANK", "secondary")],
    constraints: { maxCategories: 25 },
    question: "ROAS by channel?",
    persona: "Marketing Manager",
  }),
  def({
    name: "conversion-by-channel",
    base: "bar-vertical",
    intents: [t("COMPARE")],
    constraints: { maxCategories: 25 },
    question: "Conversion by device / channel?",
    persona: "Growth / CRO Analyst",
  }),
  def({
    name: "inventory-turnover-by-category",
    base: "bar-vertical",
    intents: [t("COMPARE"), t("RANK", "secondary")],
    constraints: { maxCategories: 25 },
    question: "Inventory turnover by category?",
    persona: "Inventory Manager",
  }),
  def({
    name: "clv-by-segment",
    base: "bar-vertical",
    intents: [t("COMPARE"), t("RANK", "secondary")],
    constraints: { maxCategories: 25 },
    question: "CLV by segment?",
    persona: "Customer Success Manager",
  }),
  def({
    name: "sell-through-vs-target",
    base: "bar-vertical",
    intents: [t("TARGET"), t("RANK", "secondary")],
    overlays: [targetMarker(0, "Target")],
    constraints: { maxCategories: 25 },
    question: "Sell-through rate by product / category?",
    persona: "Merchandiser",
  }),
  def({
    name: "reorder-point-alert",
    base: "bar-vertical",
    intents: [t("RANGE")],
    overlays: [refLine(0, "Reorder point", "negative")],
    constraints: { maxCategories: 25 },
    question: "SKUs at / below reorder point?",
    persona: "Inventory Manager",
  }),
  def({
    name: "price-realization",
    base: "bar-vertical",
    intents: [t("TARGET")],
    overlays: [targetMarker(0, "List price")],
    constraints: { maxCategories: 25 },
    question: "Price realization vs list?",
    persona: "Pricing Manager",
  }),
  def({
    name: "ab-test-lift",
    base: "bar-vertical",
    intents: [t("COMPARE"), t("RANGE", "secondary")],
    overlays: [errorBars()],
    constraints: { maxCategories: 12 },
    question: "A/B test: variant A vs B lift + significance?",
    persona: "Growth / CRO Analyst",
  }),
  def({
    name: "fill-rate-vs-target",
    base: "bar-vertical",
    intents: [t("TARGET")],
    overlays: [targetMarker(0, "Target")],
    constraints: { maxCategories: 25 },
    question: "Fill rate / backorder rate vs target?",
    persona: "Inventory Manager",
  }),

  /* --- RANK / bar-horizontal (category) -------------------------------- */
  def({
    name: "best-selling-products",
    base: "bar-horizontal",
    intents: [t("RANK")],
    constraints: { maxCategories: 30 },
    question: "Best-selling products?",
    persona: "Store Owner",
  }),
  def({
    name: "return-rate-by-product",
    base: "bar-horizontal",
    intents: [t("RANK")],
    constraints: { maxCategories: 30 },
    question: "Return rate by product / category?",
    persona: "Returns / Fraud / Risk Analyst",
  }),
  def({
    name: "landing-pages-by-revenue",
    base: "bar-horizontal",
    intents: [t("RANK")],
    constraints: { maxCategories: 30 },
    question: "Landing pages driving most organic revenue?",
    persona: "SEO / Content Manager",
  }),
  def({
    name: "territory-performance",
    base: "bar-horizontal",
    intents: [t("RANK")],
    constraints: { maxCategories: 30 },
    question: "Territory / rep performance ranking?",
    persona: "B2B Account Manager",
  }),
  def({
    name: "accounts-at-risk",
    base: "bar-horizontal",
    intents: [t("RANK"), t("DELTA", "secondary")],
    constraints: { maxCategories: 30 },
    question: "Which accounts are under-buying / at risk?",
    persona: "B2B Account Manager",
  }),
  def({
    name: "ctr-by-page",
    base: "bar-horizontal",
    intents: [t("RANK")],
    constraints: { maxCategories: 30 },
    question: "CTR by page / query?",
    persona: "SEO / Content Manager",
  }),
  def({
    name: "most-active-stores",
    base: "bar-horizontal",
    intents: [t("RANK")],
    constraints: { maxCategories: 30 },
    question: "Which stores / projects are most active?",
    persona: "Store Administrator",
  }),

  /* --- PART-WHOLE / COMP-TIME / stacked (stack-row) -------------------- */
  def({
    name: "revenue-by-channel-mix",
    base: "stacked",
    intents: [t("PART-WHOLE")],
    constraints: { maxCategories: 12 },
    question: "Where does revenue come from (channels)?",
    persona: "Store Owner",
  }),
  def({
    name: "new-vs-returning-by-channel",
    base: "stacked",
    intents: [t("PART-WHOLE"), t("COMPARE", "secondary")],
    constraints: { maxCategories: 12 },
    question: "Channels acquiring new vs returning customers?",
    persona: "Marketing Manager",
  }),
  def({
    name: "category-mix-over-time",
    base: "stacked",
    intents: [t("COMP-TIME"), t("PART-WHOLE", "secondary")],
    constraints: { maxCategories: 12 },
    question: "Category mix change over seasons?",
    persona: "Merchandiser",
  }),
  def({
    name: "tickets-by-category",
    base: "stacked",
    intents: [t("PART-WHOLE"), t("RANK", "secondary")],
    constraints: { maxCategories: 12 },
    question: "Tickets by category / channel?",
    persona: "Customer Service Lead",
  }),
  def({
    name: "sync-job-success-failure",
    base: "stacked",
    intents: [t("PART-WHOLE"), t("FLOW", "secondary")],
    constraints: { maxCategories: 12 },
    question: "Import / sync job success vs failure?",
    persona: "Developer / Integrator",
  }),
  def({
    name: "revenue-new-vs-existing-accounts",
    base: "stacked",
    intents: [t("PART-WHOLE"), t("COMPARE", "secondary")],
    constraints: { maxCategories: 12 },
    question: "Revenue: new vs existing accounts?",
    persona: "B2B Account Manager",
  }),
  def({
    name: "aging-stock-buckets",
    base: "stacked",
    intents: [t("PART-WHOLE"), t("DIST", "secondary")],
    constraints: { maxCategories: 12 },
    question: "Aging stock buckets?",
    persona: "Inventory Manager",
  }),

  /* --- PART-WHOLE / donut (category, ≤6 slices) ------------------------ */
  def({
    name: "return-reasons-breakdown",
    base: "donut",
    intents: [t("PART-WHOLE")],
    constraints: { maxCategories: 6 },
    question: "Return reasons breakdown?",
    persona: "Returns / Fraud / Risk Analyst",
  }),
  def({
    name: "order-status-breakdown",
    base: "donut",
    intents: [t("PART-WHOLE")],
    constraints: { maxCategories: 6 },
    question: "Order status breakdown now?",
    persona: "Operations Manager",
  }),
  def({
    name: "email-sms-revenue-share",
    base: "donut",
    intents: [t("PART-WHOLE")],
    constraints: { maxCategories: 6 },
    question: "Email / SMS revenue share of total?",
    persona: "Marketing Manager",
  }),

  /* --- REL / scatter + trend (scatter) --------------------------------- */
  def({
    name: "views-vs-conversion",
    base: "scatter",
    intents: [t("REL")],
    overlays: [trend()],
    constraints: { minSampleSize: 4 },
    question: "High views but low conversion?",
    persona: "Merchandiser",
  }),
  def({
    name: "price-elasticity",
    base: "scatter",
    intents: [t("REL")],
    overlays: [trend()],
    constraints: { minSampleSize: 4 },
    question: "Price elasticity (price vs volume)?",
    persona: "Pricing Manager",
  }),
  def({
    name: "metric-correlation",
    base: "scatter",
    intents: [t("REL")],
    overlays: [trend()],
    constraints: { minSampleSize: 4 },
    question: "Correlation between any two metrics?",
    persona: "Data Analyst / BI",
  }),

  /* --- RETAIN / heatmap (heat-row) ------------------------------------- */
  def({
    name: "cohort-retention",
    base: "heatmap",
    intents: [t("RETAIN")],
    question: "Retention / churn by cohort?",
    persona: "Customer Success Manager",
  }),
  def({
    name: "cohort-ltv",
    base: "heatmap",
    intents: [t("RETAIN")],
    question: "Cohort LTV / revenue retention?",
    persona: "Finance / Controller",
  }),
  def({
    name: "sales-by-hour-day",
    base: "heatmap",
    intents: [t("TREND"), t("DIST", "secondary")],
    question: "When do we sell most (time of day / week)?",
    persona: "Store Owner",
  }),

  /* --- FLOW / funnel (funnel) ------------------------------------------ */
  def({
    name: "checkout-funnel",
    base: "funnel",
    intents: [t("FLOW")],
    question: "Where do users drop off in the funnel?",
    persona: "Growth / CRO Analyst",
  }),
  def({
    name: "product-funnel",
    base: "funnel",
    intents: [t("FLOW")],
    question: "Product funnel (view → cart → buy)?",
    persona: "Merchandiser",
  }),
  def({
    name: "marketing-funnel",
    base: "funnel",
    intents: [t("FLOW")],
    question: "Marketing funnel (impression → click → convert)?",
    persona: "Marketing Manager",
  }),
  def({
    name: "quote-to-order",
    base: "funnel",
    intents: [t("FLOW"), t("TARGET", "secondary")],
    question: "Quote-to-order conversion rate?",
    persona: "B2B Account Manager",
  }),
];

/** Every preset as a registry entry, in catalog order. */
export function presetEntries(): ChartRegistryEntry[] {
  return PRESETS.map(presetToEntry);
}
