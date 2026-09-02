import type {
  BubblePoint,
  CalendarDatum,
  CategoryDatum,
  ChartRegistryEntry,
  DumbbellRow,
  FlowMatrix,
  FunnelStage,
  HeatRow,
  OhlcBar,
  ParallelDimension,
  ParallelRow,
  RadarSeries,
  RegionTile,
  RfmCell,
  SampleGroup,
  ScatterPoint,
  Series,
  SlopeRow,
  StackRow,
  TimelineEvent,
} from "../src";

/**
 * Per-question demo data for the gallery.
 *
 * Every catalog preset gets its own plausible, commerce-flavored dataset that
 * fits its question, so a chart type's different questions render as visibly
 * different charts (revenue-trend → revenue, csat-nps-trend → a 0–100 line,
 * refund-rate-trend → a declining rate, …). Data is deterministic per preset
 * name, so a card looks the same on every render.
 *
 * Hard rule: the selection engine (`deriveFacts`/`detectKind`) classifies data
 * purely by STRUCTURE. Every builder here mirrors the exact shape used in
 * `datasets.ts` for its kind — only values/labels/counts vary — so each preset
 * still resolves to its intended chart rather than the DataTable fallback.
 */
export interface Fixture {
  data: unknown;
  options?: Record<string, unknown>;
}

// ── deterministic PRNG (mulberry32 seeded from the preset name) ──────────────
function hashString(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const between = (r: () => number, lo: number, hi: number) =>
  lo + r() * (hi - lo);
const MONTHS = Array.from({ length: 12 }, (_, m) => new Date(2026, m, 1));

type Kw = { name: string; q: string; text: string };
const kw = (e: ChartRegistryEntry): Kw => {
  const name = e.metadata.name;
  const q = e.metadata.questionString;
  return { name, q, text: `${name} ${q}`.toLowerCase() };
};
const test = (k: Kw, re: RegExp) => re.test(k.text);

// ── time series ──────────────────────────────────────────────────────────────
type Unit = "currency" | "percent" | "score" | "count";

function seriesShape(k: Kw): { unit: Unit; dir: 1 | -1 | 0; label: string } {
  const t = k.text;
  if (test(k, /nps|csat|satisfaction/))
    return { unit: "score", dir: 1, label: "CSAT / NPS" };
  if (
    test(k, /abandon|refund|fraud|dispute|stockout|error|chargeback|churn/) &&
    test(k, /rate|%|trend|control|anomaly/)
  )
    return {
      unit: "percent",
      dir: -1,
      label: t.includes("abandon")
        ? "Cart abandonment"
        : t.includes("error")
          ? "API error rate"
          : t.includes("refund")
            ? "Refund rate"
            : t.includes("stockout")
              ? "Stockout rate"
              : t.includes("chargeback")
                ? "Chargeback rate"
                : "Fraud / dispute rate",
    };
  if (test(k, /repeat|perfect|resolution|sla|compliance|uptime|conversion/))
    return {
      unit: "percent",
      dir: 1,
      label:
        t.includes("sla") || t.includes("compliance")
          ? "SLA compliance"
          : t.includes("resolution")
            ? "First-contact resolution"
            : t.includes("repeat")
              ? "Repeat-purchase rate"
              : "Perfect-order rate",
    };
  if (test(k, /traffic/))
    return { unit: "count", dir: 1, label: "Organic sessions" };
  if (test(k, /ticket/))
    return { unit: "count", dir: 0, label: "Ticket volume" };
  if (test(k, /webhook|event/))
    return { unit: "count", dir: 1, label: "Webhook events" };
  if (test(k, /forecast|demand/))
    return { unit: "count", dir: 1, label: "Units" };
  if (test(k, /margin/))
    return { unit: "currency", dir: 1, label: "Gross margin" };
  if (test(k, /aov|order value/))
    return { unit: "currency", dir: 1, label: "AOV" };
  return { unit: "currency", dir: 1, label: "Revenue" };
}

function seriesPoints(
  r: () => number,
  unit: Unit,
  dir: 1 | -1 | 0,
  n = 12
): number[] {
  let base: number, step: number, amp: number, floor: number, cap: number;
  if (unit === "currency") {
    base = between(r, 80000, 160000);
    step = base * 0.04 * dir;
    amp = base * 0.06;
    floor = 1000;
    cap = Infinity;
  } else if (unit === "percent") {
    base = dir < 0 ? between(r, 26, 40) : between(r, 40, 55);
    step = (dir < 0 ? -1.6 : 2.4) * (dir === 0 ? 0 : 1);
    amp = 3;
    floor = 1;
    cap = 100;
  } else if (unit === "score") {
    base = between(r, 34, 46);
    step = 2.2;
    amp = 4;
    floor = 0;
    cap = 100;
  } else {
    base = between(r, 900, 2600);
    step = base * 0.05 * (dir || 0);
    amp = base * 0.12;
    floor = 0;
    cap = Infinity;
  }
  return Array.from({ length: n }, (_, i) => {
    const v =
      base +
      step * i +
      Math.sin(i / 1.6 + r() * 2) * amp +
      (r() - 0.5) * amp * 0.5;
    return Math.round(Math.min(cap, Math.max(floor, v)));
  });
}

function buildSeries(e: ChartRegistryEntry): Fixture {
  const k = kw(e);
  const r = mulberry32(hashString(k.name));
  const t = k.text;

  // Multi-series compositions (stacked area / streamgraph / mix over time).
  if (
    test(k, /stacked-area|stream|traffic-mix|channel-mix|composition shift/)
  ) {
    const keys = ["Organic", "Paid", "Referral"];
    const data: Series[] = keys.map((label, s) => ({
      id: label.toLowerCase(),
      label,
      data: MONTHS.map((x, i) => ({
        x,
        y: Math.round(
          between(r, 120, 320) +
            i * between(r, 6, 22) +
            Math.sin(i / (1.4 + s)) * 30
        ),
      })),
    }));
    return { data };
  }
  // Rank-over-time (bump).
  if (test(k, /bump|rank/)) {
    const keys = t.includes("keyword")
      ? ['"running shoes"', '"trail shoes"', '"gym socks"', '"laces"']
      : ["North", "South", "East", "West"];
    const data: Series[] = keys.map((label, s) => ({
      id: `s${s}`,
      label,
      data: MONTHS.slice(0, 6).map((x, i) => ({
        x,
        y: Math.round(
          between(r, 80, 200) + Math.sin(i + s) * 40 + i * (s % 2 ? 8 : -6)
        ),
      })),
    }));
    return { data };
  }
  // Two-series comparisons (actual vs plan / forecast).
  if (test(k, /vs plan|vs budget|forecast vs actual|forecast|plan/)) {
    const { unit, label } = seriesShape(k);
    const actual = seriesPoints(r, unit, 1);
    const data: Series[] = [
      {
        id: "actual",
        label: t.includes("forecast") ? "Actual" : label,
        data: MONTHS.map((x, i) => ({ x, y: actual[i] })),
      },
      {
        id: "plan",
        label: t.includes("forecast") ? "Forecast" : "Plan",
        data: MONTHS.map((x, i) => ({
          x,
          y: Math.round(actual[i] * between(r, 0.9, 1.08)),
        })),
      },
    ];
    return { data };
  }
  // Control charts — a stationary process with a couple of excursions.
  if (test(k, /control|anomaly/)) {
    const mean = test(k, /error/) ? 2.2 : 250;
    const sd = mean * 0.02;
    const ys = Array.from({ length: 14 }, (_, i) => {
      const spike = i === 5 ? 4 : i === 10 ? -3.6 : 0;
      return +(mean + (r() - 0.5) * sd * 4 + spike * sd).toFixed(2);
    });
    const data: Series[] = [
      {
        id: "process",
        label: test(k, /error/) ? "Error rate (%)" : "Fill weight (g)",
        data: ys.map((y, i) => ({ x: new Date(2026, 0, i + 1), y })),
      },
    ];
    return { data };
  }
  // Canonical line-chart: a small multi-series so it reads as a trend comparison.
  if (k.name === "line-chart") {
    const keys = ["Revenue", "Cost", "Profit"];
    const data: Series[] = keys.map((label, s) => ({
      id: label.toLowerCase(),
      label,
      data: MONTHS.map((x, i) => ({
        x,
        y: Math.round(
          between(r, 120, 260) + i * (14 - s * 3) + Math.sin(i / 1.7) * 24
        ),
      })),
    }));
    return { data };
  }

  // Single-series trend (the common case).
  const { unit, dir, label } = seriesShape(k);
  const n = k.name === "kpi-sparkline" ? 8 : 12;
  const ys = seriesPoints(r, unit, dir, n);
  const data: Series[] = [
    {
      id: "metric",
      label,
      data: MONTHS.slice(0, n).map((x, i) => ({ x, y: ys[i] })),
    },
  ];
  // Threshold / target options for the range/target/bench overlays.
  const sorted = [...ys].sort((a, b) => a - b);
  const mid = sorted[Math.floor(sorted.length / 2)];
  const options: Record<string, unknown> = {};
  if (test(k, /threshold|vs-threshold|chargeback/))
    options.rangeHigh = Math.round(mid * 1.2);
  if (test(k, /sla|compliance|target|vs-threshold/))
    options.target = Math.round(mid * (dir < 0 ? 0.8 : 1.1));
  if (test(k, /range|band|within/)) {
    options.rangeLow = Math.round(mid * 0.85);
    options.rangeHigh = Math.round(mid * 1.15);
  }
  return Object.keys(options).length ? { data, options } : { data };
}

// ── categorical magnitudes ────────────────────────────────────────────────────
function categoryList(k: Kw): string[] {
  const t = k.text;
  if (test(k, /pareto|abc|defect|cause|reason/))
    return [
      "Scratches",
      "Misalignment",
      "Cracks",
      "Dents",
      "Discoloration",
      "Other",
    ];
  if (test(k, /channel|roas|conversion by/))
    return ["Web", "Mobile", "Marketplace", "POS", "Partner", "Email"];
  if (test(k, /product|selling|sku|turnover|sell-through/))
    return [
      "Aurora Tee",
      "Nimbus Hoodie",
      "Vertex Cap",
      "Flux Bottle",
      "Cirrus Bag",
      "Halo Socks",
    ];
  if (test(k, /segment|clv|cohort/))
    return ["Champions", "Loyal", "Potential", "New", "At risk", "Hibernating"];
  if (test(k, /territory|rep|region|account/))
    return ["EMEA", "AMER", "APAC", "LATAM"];
  if (test(k, /page|ctr|landing/))
    return ["/home", "/pricing", "/product", "/blog", "/docs", "/checkout"];
  if (test(k, /status/))
    return ["Delivered", "Shipped", "Processing", "Cancelled", "Returned"];
  if (test(k, /store|project/))
    return ["Berlin", "Munich", "Hamburg", "Cologne", "Leipzig"];
  if (t.includes("return"))
    return [
      "Too small",
      "Changed mind",
      "Defective",
      "Wrong item",
      "Late delivery",
    ];
  return ["Web", "Mobile", "Marketplace", "POS", "Partner"];
}

function buildCategory(e: ChartRegistryEntry): Fixture {
  const k = kw(e);
  const r = mulberry32(hashString(k.name));
  const cats = categoryList(k);
  // Diverging bar: signed values (e.g. variance-to-plan), sorted high→low.
  if (k.name === "diverging-bar-chart") {
    const data: CategoryDatum[] = cats
      .map((category) => ({ category, value: Math.round(between(r, -55, 60)) }))
      .sort((a, b) => b.value - a.value);
    return { data };
  }
  const isRate = test(k, /rate|ctr|conversion|realization|sell-through|fill/);
  let values = cats.map(() =>
    isRate ? +between(r, 4, 42).toFixed(1) : Math.round(between(r, 400, 4500))
  );
  if (test(k, /rank|pareto|abc|best|selling|top|most|driving/))
    values = values.sort((a, b) => b - a);
  const data: CategoryDatum[] = cats.map((category, i) => ({
    category,
    value: values[i],
  }));

  const options: Record<string, unknown> = {};
  if (test(k, /vs-target|target|realization|fill|sell-through/))
    options.target = Math.round(Math.max(...values) * 0.7);
  if (test(k, /ab-test|a\/b|lift|significance/))
    options.errors = values.map((v, i) => ({
      x: i,
      low: Math.round(v * 0.9),
      high: Math.round(v * 1.1),
    }));
  return Object.keys(options).length ? { data, options } : { data };
}

// ── part-to-whole across categories (stacked) ─────────────────────────────────
function buildStack(e: ChartRegistryEntry): Fixture {
  const k = kw(e);
  const r = mulberry32(hashString(k.name));
  // Population pyramid: age bands with two back-to-back series.
  if (k.name === "population-pyramid") {
    const bands = ["0–17", "18–24", "25–34", "35–44", "45–54", "55–64", "65+"];
    const data: StackRow[] = bands.map((category) => ({
      category,
      segments: [
        { key: "Male", value: Math.round(between(r, 20, 100)) },
        { key: "Female", value: Math.round(between(r, 20, 100)) },
      ],
    }));
    return { data };
  }
  // Diverging stacked bar: an ordered Likert scale per topic.
  if (k.name === "diverging-stacked-bar") {
    const topics = ["Checkout", "Search", "Support", "Onboarding", "Docs"];
    const scale = [
      "Strongly disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly agree",
    ];
    const data: StackRow[] = topics.map((category) => ({
      category,
      segments: scale.map((key) => ({
        key,
        value: Math.round(between(r, 5, 45)),
      })),
    }));
    return { data };
  }
  const segKeys = test(k, /new vs returning|new-vs-returning/)
    ? ["New", "Returning"]
    : test(k, /success|failure|sync|job/)
      ? ["Success", "Failed"]
      : test(k, /aging|stock/)
        ? ["0–30d", "31–60d", "61–90d", "90d+"]
        : test(k, /new vs existing|accounts/)
          ? ["New accounts", "Existing accounts"]
          : test(k, /ticket/)
            ? ["Billing", "Shipping", "Product", "Other"]
            : ["New", "Returning", "Wholesale"];
  const cats = test(k, /season|over time|mix/)
    ? ["Q1", "Q2", "Q3", "Q4"]
    : ["Web", "Mobile", "Marketplace", "POS"];
  const data: StackRow[] = cats.map((category, ci) => ({
    category,
    segments: segKeys.map((key) => ({
      key,
      value: Math.round(between(r, 40, 260) + ci * between(r, 4, 30)),
    })),
  }));
  return { data };
}

// ── funnels ───────────────────────────────────────────────────────────────────
function buildFunnel(e: ChartRegistryEntry): Fixture {
  const k = kw(e);
  const r = mulberry32(hashString(k.name));
  const stages = test(k, /marketing|impression/)
    ? ["Impressions", "Clicks", "Visits", "Leads", "Customers"]
    : test(k, /quote/)
      ? ["Quotes", "Reviewed", "Negotiated", "Accepted", "Ordered"]
      : test(k, /product|view|cart/)
        ? ["Product views", "Add to cart", "Checkout", "Purchase"]
        : ["Visits", "Product views", "Add to cart", "Checkout", "Purchase"];
  let v = Math.round(between(r, 9000, 18000));
  const data: FunnelStage[] = stages.map((stage) => {
    const stageValue = v;
    v = Math.round(v * between(r, 0.45, 0.78));
    return { stage, value: stageValue };
  });
  return { data };
}

// ── cohort / matrix (heat rows) ────────────────────────────────────────────────
function buildHeat(e: ChartRegistryEntry): Fixture {
  const k = kw(e);
  const r = mulberry32(hashString(k.name));
  // Time-of-day/week matrix (rectangular).
  if (test(k, /hour|time of day|day of week|when do we sell/)) {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const cols = ["6a", "9a", "12p", "3p", "6p", "9p"];
    const data: HeatRow[] = days.map((label) => ({
      label,
      values: cols.map(() => Math.round(between(r, 5, 100))),
    }));
    return { data, options: { columnLabels: cols } };
  }
  // Retention cohort (ragged, decaying from 100).
  const rows = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const cols = ["M0", "M1", "M2", "M3", "M4", "M5"];
  const data: HeatRow[] = rows.map((label, i) => {
    const len = rows.length - i;
    let cur = 100;
    return {
      label,
      values: Array.from({ length: len }, (_, j) => {
        if (j === 0) return 100;
        cur = Math.round(cur * between(r, 0.6, 0.82));
        return cur;
      }),
    };
  });
  return {
    data,
    options: { columnLabels: cols, periodLabels: rows },
  };
}

// ── two-variable relationships ─────────────────────────────────────────────────
function buildScatter(e: ChartRegistryEntry): Fixture {
  const k = kw(e);
  const r = mulberry32(hashString(k.name));
  // Connected scatterplot: a single ordered trajectory, not two clouds.
  if (k.name === "connected-scatterplot") {
    let x = between(r, 20, 40);
    let y = between(r, 20, 40);
    const data: ScatterPoint[] = MONTHS.map((_, i) => {
      x += between(r, -6, 11);
      y += between(r, -4, 9);
      return {
        x: Math.round(x),
        y: Math.round(y),
        label: i === 0 ? "Jan" : i === MONTHS.length - 1 ? "Dec" : undefined,
      };
    });
    return { data };
  }
  const neg = test(k, /elasticity|price|discount/);
  const groups = ["EU", "US"];
  const data: ScatterPoint[] = groups.flatMap((group, g) =>
    Array.from({ length: 14 }, (_, i) => {
      const x = between(r, 10, 100);
      const trend = neg
        ? 100 - x * between(r, 0.7, 1.1)
        : 20 + x * between(r, 0.5, 0.9);
      return {
        x: Math.round(x),
        y: Math.round(Math.max(2, trend + (r() - 0.5) * 26 + g * 6)),
        group,
        label: `${group} ${i + 1}`,
      };
    })
  );
  return { data };
}

function buildBubble(e: ChartRegistryEntry): Fixture {
  const k = kw(e);
  const r = mulberry32(hashString(k.name));
  const groups = ["Enterprise", "SMB", "Startup"];
  const names = [
    "Acme",
    "Globex",
    "Initech",
    "Umbrella",
    "Hooli",
    "Stark",
    "Wayne",
    "Soylent",
  ];
  const data: BubblePoint[] = names.map((label, i) => ({
    x: Math.round(between(r, 10, 90)),
    y: Math.round(between(r, 10, 90)),
    size: Math.round(between(r, 120, 1400)),
    group: groups[i % groups.length],
    label,
  }));
  return { data };
}

// ── two-moment / paired ─────────────────────────────────────────────────────────
function buildSlope(e: ChartRegistryEntry): Fixture {
  const k = kw(e);
  const r = mulberry32(hashString(k.name));
  const cats = test(k, /category|yoy/)
    ? ["Apparel", "Footwear", "Accessories", "Home"]
    : ["United States", "Germany", "Japan", "United Kingdom"];
  const data: SlopeRow[] = cats.map((label, i) => ({
    id: `r${i}`,
    label,
    left: Math.round(between(r, 1800, 4600)),
    right: Math.round(between(r, 1800, 5200)),
  }));
  const yoy = test(k, /yoy|year/);
  return {
    data,
    options: {
      leftLabel: yoy ? "2024" : "Q1",
      rightLabel: yoy ? "2025" : "Q2",
    },
  };
}

function buildDumbbell(e: ChartRegistryEntry): Fixture {
  const k = kw(e);
  const r = mulberry32(hashString(k.name));
  const cats = test(k, /competitor|price/)
    ? ["Tee", "Hoodie", "Cap", "Bottle", "Bag"]
    : ["Onboarding", "Checkout", "Search", "Support"];
  const data: DumbbellRow[] = cats.map((category) => ({
    category,
    start: Math.round(between(r, 28, 62)),
    end: Math.round(between(r, 40, 78)),
  }));
  const price = test(k, /competitor|price/);
  return {
    data,
    options: {
      startLabel: price ? "Us" : "2023",
      endLabel: price ? "Competitor" : "2024",
    },
  };
}

// ── multivariate ────────────────────────────────────────────────────────────────
function buildRadar(e: ChartRegistryEntry): Fixture {
  const k = kw(e);
  const r = mulberry32(hashString(k.name));
  const axes = test(k, /product|feature/)
    ? ["Quality", "Value", "Design", "Support", "Ease", "Speed"]
    : ["Speed", "Power", "Range", "Agility", "Comfort"];
  const names = test(k, /product|feature/)
    ? ["Product A", "Product B"]
    : ["Model A", "Model B"];
  const data: RadarSeries[] = names.map((label, s) => ({
    id: `s${s}`,
    label,
    values: axes.map(() => Math.round(between(r, 35, 95))),
  }));
  return { data, options: { axes } };
}

function buildParallel(e: ChartRegistryEntry): Fixture {
  const k = kw(e);
  const r = mulberry32(hashString(k.name));
  const dims: ParallelDimension[] = [
    { key: "price", label: "Price" },
    { key: "margin", label: "Margin %" },
    { key: "volume", label: "Volume" },
    { key: "rating", label: "Rating" },
  ];
  const groups = ["Apparel", "Footwear"];
  const data: ParallelRow[] = Array.from({ length: 6 }, (_, i) => ({
    id: `r${i}`,
    group: groups[i % groups.length],
    values: {
      price: Math.round(between(r, 20, 120)),
      margin: Math.round(between(r, 10, 60)),
      volume: Math.round(between(r, 100, 4000)),
      rating: +between(r, 3, 5).toFixed(1),
    },
  }));
  return { data, options: { dimensions: dims } };
}

// ── calendar / rfm ───────────────────────────────────────────────────────────────
function buildCalendar(e: ChartRegistryEntry): Fixture {
  const r = mulberry32(hashString(e.metadata.name));
  const data: CalendarDatum[] = [];
  for (let m = 0; m < 3; m++) {
    for (let d = 1; d <= 28; d++) {
      if (r() < 0.45) continue;
      data.push({
        date: new Date(2026, m, d),
        value: Math.round(between(r, 1, 30)),
      });
    }
  }
  return { data };
}

function buildRfm(e: ChartRegistryEntry): Fixture {
  const r = mulberry32(hashString(e.metadata.name));
  const data: RfmCell[] = [];
  for (let recency = 1; recency <= 5; recency++) {
    for (let frequency = 1; frequency <= 5; frequency++) {
      if (r() < 0.3) continue;
      data.push({
        recency,
        frequency,
        count: Math.round(between(r, 20, 320)),
        value: Math.round(between(r, 2000, 150000)),
      });
    }
  }
  return { data };
}

// ── raw samples (histogram) ───────────────────────────────────────────────
function buildSamples(e: ChartRegistryEntry): Fixture {
  const r = mulberry32(hashString(e.metadata.name));
  // Roughly bell-shaped: mean of three uniforms.
  const data = Array.from({ length: 240 }, () => {
    const u = (between(r, 0, 1) + between(r, 0, 1) + between(r, 0, 1)) / 3;
    return +(20 + u * 80).toFixed(1);
  });
  return { data };
}

// ── five-number summaries (box plot) ──────────────────────────────────────
function buildBoxGroup(e: ChartRegistryEntry): Fixture {
  const r = mulberry32(hashString(e.metadata.name));
  const labels = ["Web", "Mobile", "Marketplace", "POS"];
  const data = labels.map((label) => {
    const median = Math.round(between(r, 40, 120));
    const spread = between(r, 10, 30);
    return {
      label,
      min: Math.round(median - spread * 2),
      firstQuartile: Math.round(median - spread),
      median,
      thirdQuartile: Math.round(median + spread),
      max: Math.round(median + spread * 2),
      outliers: [Math.round(median + spread * 2 + between(r, 4, 20))],
    };
  });
  return { data };
}

// ── signed contributions building a total (waterfall) ─────────────────────
function buildDeltaSteps(e: ChartRegistryEntry): Fixture {
  const r = mulberry32(hashString(e.metadata.name));
  const steps: Array<{ label: string; value: number; isTotal?: boolean }> = [
    { label: "Start", value: Math.round(between(r, 400, 800)), isTotal: true },
    { label: "New", value: Math.round(between(r, 80, 240)) },
    { label: "Expansion", value: Math.round(between(r, 40, 120)) },
    { label: "Churn", value: -Math.round(between(r, 40, 140)) },
    { label: "Contraction", value: -Math.round(between(r, 20, 80)) },
  ];
  const end = steps.reduce((s, x) => (x.isTotal ? x.value : s + x.value), 0);
  steps.push({ label: "End", value: end, isTotal: true });
  return { data: steps };
}

// ── measure vs target (bullet) ────────────────────────────────────────────
function buildBulletRows(e: ChartRegistryEntry): Fixture {
  const r = mulberry32(hashString(e.metadata.name));
  const labels = ["Revenue", "New customers", "NPS", "Uptime"];
  const data = labels.map((label) => {
    const target = Math.round(between(r, 60, 100));
    return {
      label,
      measure: Math.round(target * between(r, 0.6, 1.15)),
      target,
      ranges: [
        Math.round(target * 0.5),
        Math.round(target * 0.8),
        Math.round(target * 1.2),
      ],
    };
  });
  return { data };
}

// ── flow graph (sankey) ───────────────────────────────────────────────────
function buildFlowGraph(e: ChartRegistryEntry): Fixture {
  const r = mulberry32(hashString(e.metadata.name));
  const v = (lo: number, hi: number) => Math.round(between(r, lo, hi));
  const nodes = [
    { name: "Search" },
    { name: "Direct" },
    { name: "Home" },
    { name: "Product" },
    { name: "Cart" },
    { name: "Checkout" },
    { name: "Purchase" },
    { name: "Abandoned" },
  ];
  const links = [
    { source: 0, target: 2, value: v(300, 600) },
    { source: 1, target: 2, value: v(150, 350) },
    { source: 2, target: 3, value: v(400, 700) },
    { source: 3, target: 4, value: v(200, 400) },
    { source: 4, target: 5, value: v(120, 260) },
    { source: 5, target: 6, value: v(80, 180) },
    { source: 4, target: 7, value: v(60, 160) },
    { source: 3, target: 7, value: v(80, 200) },
  ];
  return { data: { nodes, links } };
}

// ── nested hierarchy (treemap) ────────────────────────────────────────────
function buildHierarchy(e: ChartRegistryEntry): Fixture {
  const r = mulberry32(hashString(e.metadata.name));
  const v = (lo: number, hi: number) => Math.round(between(r, lo, hi));
  const data = {
    name: "Revenue",
    children: [
      {
        name: "Web",
        children: [
          { name: "New", value: v(100, 300) },
          { name: "Returning", value: v(100, 300) },
        ],
      },
      {
        name: "Mobile",
        children: [
          { name: "iOS", value: v(80, 220) },
          { name: "Android", value: v(80, 220) },
        ],
      },
      {
        name: "Marketplace",
        children: [
          { name: "Amazon", value: v(60, 180) },
          { name: "eBay", value: v(30, 90) },
        ],
      },
      { name: "Wholesale", value: v(80, 160) },
    ],
  };
  return { data };
}

// ── single value (stat card / gauge) ──────────────────────────────────────
function buildScalar(e: ChartRegistryEntry): Fixture {
  const r = mulberry32(hashString(e.metadata.name));
  if (e.metadata.baseComponent === "Gauge") {
    return {
      data: Math.round(between(r, 40, 95)),
      options: { min: 0, max: 100, threshold: 80, label: "SLA attainment" },
    };
  }
  const value = Math.round(between(r, 4000, 90000));
  return {
    data: value,
    options: {
      label: "Monthly revenue",
      previous: Math.round(value * between(r, 0.8, 1.1)),
    },
  };
}

// ── per-group raw samples (violin) ────────────────────────────────────────
function buildSampleGroups(e: ChartRegistryEntry): Fixture {
  const r = mulberry32(hashString(e.metadata.name));
  const labels = ["Web", "Mobile", "Marketplace"];
  const data: SampleGroup[] = labels.map((label) => {
    const center = between(r, 40, 80);
    const spread = between(r, 8, 22);
    return {
      label,
      samples: Array.from({ length: 60 }, () => {
        const u = (between(r, 0, 1) + between(r, 0, 1) + between(r, 0, 1)) / 3;
        return +(center + (u - 0.5) * spread * 4).toFixed(1);
      }),
    };
  });
  return { data };
}

// ── open/high/low/close bars (candlestick) ────────────────────────────────
function buildOhlc(e: ChartRegistryEntry): Fixture {
  const r = mulberry32(hashString(e.metadata.name));
  let price = between(r, 90, 120);
  const data: OhlcBar[] = Array.from({ length: 22 }, (_, i) => {
    const open = price;
    const close = Math.max(5, open + (r() - 0.47) * 7);
    const high = Math.max(open, close) + between(r, 0.5, 4);
    const low = Math.min(open, close) - between(r, 0.5, 4);
    price = close;
    return {
      date: new Date(2026, 0, i + 1),
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +close.toFixed(2),
    };
  });
  return { data };
}

// ── scheduled spans + a milestone (gantt / timeline) ──────────────────────
function buildTimelineEvents(e: ChartRegistryEntry): Fixture {
  const r = mulberry32(hashString(e.metadata.name));
  const phases: Array<[string, string, number, number | null]> = [
    ["Discovery", "Plan", 0, 1],
    ["Design", "Plan", 1, 3],
    ["Build", "Build", 2, 6],
    ["Beta", "Build", 6, 8],
    ["Launch", "Launch", 8, null],
    ["Rollout", "Launch", 8, 11],
  ];
  const jitter = Math.floor(between(r, 0, 3));
  const data: TimelineEvent[] = phases.map(([label, category, s, en]) => ({
    label,
    category,
    start: new Date(2026, s, 1 + jitter),
    end: en == null ? undefined : new Date(2026, en, 1),
  }));
  return { data };
}

// ── square flow matrix (chord) ────────────────────────────────────────────
function buildFlowMatrix(e: ChartRegistryEntry): Fixture {
  const r = mulberry32(hashString(e.metadata.name));
  const labels = ["Search", "Social", "Email", "Direct", "Referral"];
  const n = labels.length;
  const matrix = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) =>
      i === j ? 0 : Math.round(between(r, 0, 60))
    )
  );
  const data: FlowMatrix = { labels, matrix };
  return { data };
}

// ── regions on a hand-laid grid (tile-grid map) ───────────────────────────
function buildRegionTiles(e: ChartRegistryEntry): Fixture {
  const r = mulberry32(hashString(e.metadata.name));
  // A compact US-style tile grid (row, col chosen to echo geography).
  const cells: Array<[string, number, number]> = [
    ["WA", 0, 0],
    ["MT", 0, 1],
    ["ND", 0, 2],
    ["MN", 0, 3],
    ["WI", 0, 4],
    ["MI", 0, 5],
    ["NY", 0, 7],
    ["MA", 0, 8],
    ["CA", 1, 0],
    ["ID", 1, 1],
    ["SD", 1, 2],
    ["IA", 1, 3],
    ["IL", 1, 4],
    ["IN", 1, 5],
    ["OH", 1, 6],
    ["PA", 1, 7],
    ["NJ", 1, 8],
    ["NV", 2, 1],
    ["WY", 2, 2],
    ["NE", 2, 3],
    ["MO", 2, 4],
    ["KY", 2, 5],
    ["WV", 2, 6],
    ["VA", 2, 7],
    ["MD", 2, 8],
    ["AZ", 3, 1],
    ["UT", 3, 2],
    ["CO", 3, 3],
    ["KS", 3, 4],
    ["TN", 3, 5],
    ["NC", 3, 6],
    ["SC", 3, 7],
    ["NM", 4, 2],
    ["OK", 4, 3],
    ["AR", 4, 4],
    ["MS", 4, 5],
    ["AL", 4, 6],
    ["GA", 4, 7],
    ["TX", 5, 3],
    ["LA", 5, 4],
    ["FL", 5, 8],
  ];
  const data: RegionTile[] = cells.map(([id, row, col]) => ({
    id,
    row,
    col,
    value: Math.round(between(r, 10, 100)),
  }));
  return { data };
}

const BUILDERS: Record<string, (e: ChartRegistryEntry) => Fixture> = {
  series: buildSeries,
  category: buildCategory,
  "stack-row": buildStack,
  funnel: buildFunnel,
  "heat-row": buildHeat,
  scatter: buildScatter,
  bubble: buildBubble,
  "slope-row": buildSlope,
  "dumbbell-row": buildDumbbell,
  "radar-series": buildRadar,
  "parallel-row": buildParallel,
  calendar: buildCalendar,
  rfm: buildRfm,
  samples: buildSamples,
  "box-group": buildBoxGroup,
  "delta-steps": buildDeltaSteps,
  "bullet-row": buildBulletRows,
  "flow-graph": buildFlowGraph,
  hierarchy: buildHierarchy,
  scalar: buildScalar,
  "sample-groups": buildSampleGroups,
  ohlc: buildOhlc,
  "timeline-events": buildTimelineEvents,
  "flow-matrix": buildFlowMatrix,
  "region-tiles": buildRegionTiles,
};

/** Plausible, deterministic demo data fitting a preset's question. */
export function fixtureFor(entry: ChartRegistryEntry): Fixture {
  const kind = entry.dataKinds[0] ?? "series";
  const build = BUILDERS[kind] ?? buildSeries;
  return build(entry);
}
