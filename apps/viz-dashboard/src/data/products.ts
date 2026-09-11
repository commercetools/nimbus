/* -------------------------------------------------------------------------- */
/* Mock data — Products & inventory.                                           */
/* Northwind Supply Co. catalog: what sells, the 80/20, and what's in stock.  */
/* Every number is hardcoded or seeded — stable between reloads.              */
/* -------------------------------------------------------------------------- */

import type {
  SeriesPoint,
  CategoryDatum,
  TreemapNode,
  BulletDatum,
  DumbbellRow,
} from "@commercetools/nimbus-viz";
import { seededRandom } from "./format";

/** Map a plain trend into sparkline points (x = index). */
const spark = (values: number[]): SeriesPoint[] =>
  values.map((y, x) => ({ x, y }));

/* -------------------------------------------------------------------------- */
/* Headline KPIs + trailing 12-month sparklines.                              */
/* -------------------------------------------------------------------------- */

/** Live SKUs in the catalog — steady catalog expansion. */
const SKUS_MONTHLY = [
  4_590, 4_605, 4_620, 4_640, 4_665, 4_690, 4_710, 4_735, 4_760, 4_780, 4_800,
  4_820,
];
/** Share of stocked units sold within the period (0–1 ratio). */
const SELL_THROUGH_MONTHLY = [
  0.55, 0.56, 0.565, 0.57, 0.58, 0.59, 0.595, 0.6, 0.605, 0.61, 0.615, 0.62,
];
/** SKUs currently out of stock — trending down as replenishment tightens. */
const OUT_OF_STOCK_MONTHLY = [
  182, 178, 176, 170, 168, 164, 160, 158, 154, 152, 150, 148,
];
/** On-hand inventory value (USD at cost). */
const INVENTORY_VALUE_MONTHLY = [
  1_985_000, 2_005_000, 2_020_000, 2_010_000, 2_045_000, 2_060_000, 2_075_000,
  2_090_000, 2_100_000, 2_115_000, 2_128_000, 2_140_000,
];

export const KPIS = {
  activeSkus: {
    value: 4_820,
    previous: 4_610,
    spark: spark(SKUS_MONTHLY),
  },
  sellThrough: {
    value: 0.62,
    previous: 0.58,
    spark: spark(SELL_THROUGH_MONTHLY),
  },
  outOfStock: {
    value: 148,
    previous: 176,
    spark: spark(OUT_OF_STOCK_MONTHLY),
  },
  inventoryValue: {
    value: 2_140_000,
    previous: 1_985_000,
    spark: spark(INVENTORY_VALUE_MONTHLY),
  },
};

/* -------------------------------------------------------------------------- */
/* Catalog composition — revenue by category → subcategory (treemap root).    */
/* One root node; leaves carry `value` (annual revenue, USD).                 */
/* -------------------------------------------------------------------------- */

export const CATALOG_TREEMAP: TreemapNode = {
  name: "Catalog",
  children: [
    {
      name: "Apparel",
      children: [
        { name: "Jackets", value: 510_000 },
        { name: "Tees", value: 420_000 },
        { name: "Hoodies", value: 380_000 },
        { name: "Pants", value: 290_000 },
      ],
    },
    {
      name: "Footwear",
      children: [
        { name: "Sneakers", value: 480_000 },
        { name: "Boots", value: 320_000 },
        { name: "Sandals", value: 140_000 },
      ],
    },
    {
      name: "Accessories",
      children: [
        { name: "Bags", value: 260_000 },
        { name: "Hats", value: 110_000 },
        { name: "Belts", value: 90_000 },
      ],
    },
    {
      name: "Home",
      children: [
        { name: "Bedding", value: 240_000 },
        { name: "Kitchen", value: 180_000 },
      ],
    },
    {
      name: "Beauty",
      children: [
        { name: "Skincare", value: 210_000 },
        { name: "Haircare", value: 130_000 },
        { name: "Fragrance", value: 95_000 },
      ],
    },
  ],
};

/** Top-level categories, in the treemap's leaf order — stable color domain. */
export const CATALOG_CATEGORIES = (CATALOG_TREEMAP.children ?? []).map(
  (c) => c.name
);

/** Overall sell-through, as a 0–100 gauge value (target 75). */
export const SELL_THROUGH_GAUGE = 62;

/* -------------------------------------------------------------------------- */
/* Revenue by product — the 80/20 (Pareto). Descending; the chart also        */
/* overlays the cumulative-share curve.                                       */
/* -------------------------------------------------------------------------- */

export const REVENUE_BY_PRODUCT: CategoryDatum[] = [
  { category: "Alpine Down Jacket", value: 218_000 },
  { category: "Everyday Crew Tee", value: 176_000 },
  { category: "Trail Runner Sneaker", value: 164_000 },
  { category: "Fleece Hoodie", value: 142_000 },
  { category: "Canvas Tote Bag", value: 98_000 },
  { category: "Merino Beanie", value: 74_000 },
  { category: "Chino Pant", value: 61_000 },
  { category: "Leather Belt", value: 43_000 },
  { category: "Ceramic Mug Set", value: 32_000 },
  { category: "Travel Skincare Kit", value: 21_000 },
];

/* -------------------------------------------------------------------------- */
/* Stock coverage — weeks of cover vs. an 8-week target, by category.         */
/* ranges = qualitative bands: thin (<4) · healthy (4–8) · heavy (8–12).      */
/* -------------------------------------------------------------------------- */

export const STOCK_COVERAGE: BulletDatum[] = [
  { label: "Apparel", measure: 7.2, target: 8, ranges: [4, 8, 12] },
  { label: "Footwear", measure: 5.4, target: 8, ranges: [4, 8, 12] },
  { label: "Accessories", measure: 9.1, target: 8, ranges: [4, 8, 12] },
  { label: "Home", measure: 6.3, target: 8, ranges: [4, 8, 12] },
  { label: "Beauty", measure: 3.6, target: 8, ranges: [4, 8, 12] },
];

/* -------------------------------------------------------------------------- */
/* Momentum — units sold last month vs. this month, by category (dumbbell).   */
/* -------------------------------------------------------------------------- */

export const UNITS_MOMENTUM: DumbbellRow[] = [
  { category: "Apparel", start: 8_400, end: 9_200 },
  { category: "Footwear", start: 6_100, end: 6_650 },
  { category: "Home", start: 2_400, end: 2_780 },
  { category: "Beauty", start: 1_900, end: 2_360 },
  { category: "Accessories", start: 3_200, end: 3_050 },
  { category: "Electronics", start: 1_100, end: 980 },
];

/* -------------------------------------------------------------------------- */
/* Unit price distribution — ~120 seeded prices, right-skewed ($5–$180).      */
/* Exponential transform of a uniform stream, clamped to the range.           */
/* -------------------------------------------------------------------------- */

export const UNIT_PRICES: number[] = (() => {
  const rand = seededRandom(41);
  const out: number[] = [];
  for (let i = 0; i < 120; i++) {
    const skewed = 5 + Math.min(175, -Math.log(1 - rand()) * 28);
    out.push(Math.round(skewed * 100) / 100);
  }
  return out;
})();
