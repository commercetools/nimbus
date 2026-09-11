/* -------------------------------------------------------------------------- */
/* Products & inventory — catalog performance, the 80/20, and what's in stock. */
/* -------------------------------------------------------------------------- */

import {
  Treemap,
  Gauge,
  ParetoChart,
  BulletChart,
  DumbbellChart,
  Histogram,
} from "@commercetools/nimbus-viz";
import {
  Category,
  Autorenew,
  RemoveShoppingCart,
  Warehouse,
} from "@commercetools/nimbus-icons";
import {
  Page,
  PageHeader,
  KpiRow,
  KpiTile,
  CardGrid,
  ChartCard,
  Chart,
  Insight,
} from "../shell/ui";
import { NAV_BY_PATH } from "../shell/nav";
import { fmt, formatInteger, formatPercent2 } from "../data/format";
import {
  KPIS,
  CATALOG_TREEMAP,
  CATALOG_CATEGORIES,
  SELL_THROUGH_GAUGE,
  REVENUE_BY_PRODUCT,
  STOCK_COVERAGE,
  UNITS_MOMENTUM,
  UNIT_PRICES,
} from "../data/products";

export function ProductsPage() {
  const nav = NAV_BY_PATH["/products"];

  return (
    <Page>
      <PageHeader title={nav.title} blurb={nav.blurb} />

      <KpiRow>
        <KpiTile
          label="Active SKUs"
          icon={Category}
          value={KPIS.activeSkus.value}
          previous={KPIS.activeSkus.previous}
          format={formatInteger}
          spark={KPIS.activeSkus.spark}
        />
        <KpiTile
          label="Sell-through rate"
          icon={Autorenew}
          value={KPIS.sellThrough.value}
          previous={KPIS.sellThrough.previous}
          format={formatPercent2}
          spark={KPIS.sellThrough.spark}
        />
        <KpiTile
          label="Out of stock"
          icon={RemoveShoppingCart}
          value={KPIS.outOfStock.value}
          previous={KPIS.outOfStock.previous}
          format={formatInteger}
          spark={KPIS.outOfStock.spark}
          invertDelta
        />
        <KpiTile
          label="Inventory value"
          icon={Warehouse}
          value={KPIS.inventoryValue.value}
          previous={KPIS.inventoryValue.previous}
          format={fmt.currency}
          spark={KPIS.inventoryValue.spark}
        />
      </KpiRow>

      <CardGrid>
        <ChartCard
          span={8}
          title="Catalog composition"
          subtitle="Catalog composition by revenue"
        >
          <Chart height={340} colorDomain={CATALOG_CATEGORIES}>
            {(width, height) => (
              <Treemap
                width={width}
                height={height}
                data={CATALOG_TREEMAP}
                ariaLabel="Catalog revenue by category and subcategory"
              />
            )}
          </Chart>
        </ChartCard>

        <ChartCard span={4} title="Sell-through" subtitle="Target 75%">
          <Chart height={340}>
            {(width, height) => (
              <Gauge
                width={width}
                height={height}
                value={SELL_THROUGH_GAUGE}
                min={0}
                max={100}
                threshold={75}
                valueFormat={(n) => `${Math.round(n)}%`}
                label="Sell-through"
                ariaLabel="Overall sell-through rate against a 75 percent target"
              />
            )}
          </Chart>
        </ChartCard>

        <ChartCard
          span={6}
          title="Revenue by product"
          subtitle="The 80/20 of revenue"
          action={
            <Insight tone="positive">
              Top 3 SKUs drive over half of revenue
            </Insight>
          }
        >
          <Chart height={320}>
            {(width, height) => (
              <ParetoChart
                width={width}
                height={height}
                data={REVENUE_BY_PRODUCT}
                ariaLabel="Revenue by product with cumulative share"
              />
            )}
          </Chart>
        </ChartCard>

        <ChartCard
          span={6}
          title="Stock coverage"
          subtitle="Weeks of cover vs. target"
        >
          <Chart height={320}>
            {(width, height) => (
              <BulletChart
                width={width}
                height={height}
                data={STOCK_COVERAGE}
                ariaLabel="Weeks of stock coverage versus target, by category"
              />
            )}
          </Chart>
        </ChartCard>

        <ChartCard
          span={6}
          title="Category momentum"
          subtitle="Momentum by category"
        >
          <Chart height={320}>
            {(width, height) => (
              <DumbbellChart
                width={width}
                height={height}
                data={UNITS_MOMENTUM}
                startLabel="Last month"
                endLabel="This month"
                ariaLabel="Units sold last month versus this month, by category"
              />
            )}
          </Chart>
        </ChartCard>

        <ChartCard
          span={6}
          title="Unit price spread"
          subtitle="Unit price distribution"
        >
          <Chart height={320}>
            {(width, height) => (
              <Histogram
                width={width}
                height={height}
                values={UNIT_PRICES}
                thresholds={14}
                ariaLabel="Distribution of unit prices across the catalog"
              />
            )}
          </Chart>
        </ChartCard>
      </CardGrid>
    </Page>
  );
}
