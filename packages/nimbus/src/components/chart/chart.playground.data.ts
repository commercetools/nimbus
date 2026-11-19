import type { ChartConfig, MeterSegment } from "@commercetools/nimbus";

// Fake data for the chart playground stories: Nordlicht Outdoor, a made-up
// outdoor gear retailer. None of it is real.

/** Revenue per month in thousands of euros */
export const revenue = [
  { month: "Jan", online: 86, shops: 42 },
  { month: "Feb", online: 92, shops: 38 },
  { month: "Mar", online: 110, shops: 45 },
  { month: "Apr", online: 118, shops: 50 },
  { month: "May", online: 131, shops: 54 },
  { month: "Jun", online: 127, shops: 58 },
  { month: "Jul", online: 142, shops: 61 },
  { month: "Aug", online: 138, shops: 57 },
  { month: "Sep", online: 156, shops: 63 },
  { month: "Oct", online: 171, shops: 70 },
  { month: "Nov", online: 224, shops: 88 },
  { month: "Dec", online: 268, shops: 104 },
];
export const revenueConfig = {
  online: { label: "Online", palette: "ctviolet" },
  shops: { label: "Shops", palette: "teal" },
} satisfies ChartConfig;

/**
 * Scales a series to 20 to 100, so a sparkline shows the shape of the trend
 * even when the values barely change. A sparkline has no axis and no tooltip,
 * so the scaled values are never shown.
 */
export const toShape = (values: number[]) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return values.map((value) => 20 + (80 * (value - min)) / (max - min));
};

export const revenueTotals = revenue.map((row) => row.online + row.shops);
export const orderTotals = [
  1900, 1980, 2210, 2350, 2680, 2870, 3120, 2980, 3410, 3760, 5120, 6040,
];
export const conversionRates = [
  3.2, 3.3, 3.4, 3.6, 3.7, 3.7, 3.9, 3.9, 4.1, 4.3, 4.5, 4.6,
];
export const refundRates = [
  3.9, 3.8, 3.8, 3.7, 3.6, 3.7, 3.5, 3.6, 3.5, 3.4, 3.5, 3.4,
];

/** The scaled trend of each key figure for the sparklines */
export const trends = {
  revenue: toShape(revenueTotals),
  orders: toShape(orderTotals),
  conversion: toShape(conversionRates),
  refunds: toShape(refundRates),
};
export const monthly = revenue.map((row, index) => ({
  month: row.month,
  revenue: trends.revenue[index],
  orders: trends.orders[index],
  conversion: trends.conversion[index],
  refunds: trends.refunds[index],
}));

/** Orders per weekday by device */
export const ordersByDay = [
  { day: "Mon", desktop: 120, mobile: 98, tablet: 24 },
  { day: "Tue", desktop: 132, mobile: 105, tablet: 28 },
  { day: "Wed", desktop: 128, mobile: 118, tablet: 22 },
  { day: "Thu", desktop: 141, mobile: 126, tablet: 31 },
  { day: "Fri", desktop: 165, mobile: 152, tablet: 36 },
  { day: "Sat", desktop: 190, mobile: 214, tablet: 41 },
  { day: "Sun", desktop: 158, mobile: 201, tablet: 33 },
];
export const ordersConfig = {
  desktop: { label: "Desktop", palette: "ctviolet" },
  mobile: { label: "Mobile", palette: "orange" },
  tablet: { label: "Tablet", palette: "teal" },
} satisfies ChartConfig;

/** Conversion rate in percent for four traffic sources over eight weeks */
export const conversion = [
  { week: "Wk 40", search: 3.1, email: 5.2, social: 1.8, direct: 4.1 },
  { week: "Wk 41", search: 3.3, email: 5.0, social: 2.0, direct: 4.3 },
  { week: "Wk 42", search: 3.0, email: 5.6, social: 2.4, direct: 4.2 },
  { week: "Wk 43", search: 3.6, email: 5.9, social: 2.1, direct: 4.6 },
  { week: "Wk 44", search: 3.8, email: 6.3, social: 2.7, direct: 4.5 },
  { week: "Wk 45", search: 3.7, email: 6.1, social: 3.0, direct: 4.9 },
  { week: "Wk 46", search: 4.1, email: 6.8, social: 2.9, direct: 5.1 },
  { week: "Wk 47", search: 4.4, email: 7.2, social: 3.3, direct: 5.3 },
];
export const conversionConfig = {
  search: { label: "Search", palette: "ctviolet" },
  email: { label: "Email", palette: "orange" },
  social: { label: "Social", palette: "teal" },
  direct: { label: "Direct", palette: "crimson" },
} satisfies ChartConfig;

/** Orders and the forecast per month, for the chart that mixes bars and a line */
export const ordersAndForecast = [
  { month: "Jul", orders: 3120, forecast: 3000 },
  { month: "Aug", orders: 2980, forecast: 3100 },
  { month: "Sep", orders: 3410, forecast: 3300 },
  { month: "Oct", orders: 3760, forecast: 3600 },
  { month: "Nov", orders: 5120, forecast: 4800 },
  { month: "Dec", orders: 6040, forecast: 5600 },
];
export const forecastConfig = {
  orders: { label: "Orders", palette: "ctviolet" },
  forecast: { label: "Forecast", palette: "orange" },
} satisfies ChartConfig;

/** Share of revenue by sales channel, in percent */
export const channels = [
  { channel: "Web shop", share: 42 },
  { channel: "Mobile app", share: 24 },
  { channel: "Marketplace", share: 14 },
  { channel: "Stores", share: 13 },
  { channel: "B2B portal", share: 7 },
];
export const channelConfig = {
  "Web shop": { label: "Web shop", palette: "ctviolet" },
  "Mobile app": { label: "Mobile app", palette: "orange" },
  Marketplace: { label: "Marketplace", palette: "teal" },
  Stores: { label: "Stores", palette: "crimson" },
  "B2B portal": { label: "B2B portal", palette: "blue" },
} satisfies ChartConfig;

/** Customer satisfaction per topic, this store against the market */
export const satisfaction = [
  { topic: "Delivery", store: 86, market: 78 },
  { topic: "Price", store: 72, market: 75 },
  { topic: "Support", store: 91, market: 80 },
  { topic: "Returns", store: 83, market: 70 },
  { topic: "Range", store: 77, market: 82 },
  { topic: "Website", store: 88, market: 79 },
];
export const satisfactionConfig = {
  store: { label: "Nordlicht", palette: "ctviolet" },
  market: { label: "Market", palette: "slate" },
} satisfies ChartConfig;

/** Orders shipped on time per warehouse, in percent */
export const warehouses = [
  { warehouse: "Berlin", shipped: 97 },
  { warehouse: "Munich", shipped: 91 },
  { warehouse: "Hamburg", shipped: 84 },
  { warehouse: "Leipzig", shipped: 72 },
];
export const warehouseConfig = {
  Berlin: { label: "Berlin", palette: "ctviolet" },
  Munich: { label: "Munich", palette: "teal" },
  Hamburg: { label: "Hamburg", palette: "orange" },
  Leipzig: { label: "Leipzig", palette: "crimson" },
} satisfies ChartConfig;

/** Units in stock by category, for the segmented meter */
export const stock: MeterSegment[] = [
  { id: "apparel", label: "Apparel", value: 2400 },
  { id: "shoes", label: "Shoes", value: 1500 },
  { id: "accessories", label: "Accessories", value: 900 },
  { id: "home", label: "Home", value: 700 },
];

export const orders = [
  {
    id: "48213",
    customer: "Maren Vogt",
    channel: "Mobile app",
    status: "Delayed",
    palette: "critical",
    packed: 38,
  },
  {
    id: "48207",
    customer: "Jonas Albrecht",
    channel: "Web shop",
    status: "Backorder",
    palette: "warning",
    packed: 20,
  },
  {
    id: "48199",
    customer: "Studio Nord GmbH",
    channel: "B2B portal",
    status: "Packing",
    palette: "info",
    packed: 64,
  },
  {
    id: "48191",
    customer: "Lea Hartmann",
    channel: "Marketplace",
    status: "Packing",
    palette: "info",
    packed: 71,
  },
  {
    id: "48180",
    customer: "Tobias Reiter",
    channel: "Web shop",
    status: "Shipped",
    palette: "positive",
    packed: 100,
  },
] as const;
