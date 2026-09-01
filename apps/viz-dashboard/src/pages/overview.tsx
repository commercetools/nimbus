/* -------------------------------------------------------------------------- */
/* Store overview — the whole business at a glance.                           */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import {
  LineChart,
  BarChart,
  DonutChart,
  CalendarHeatmap,
} from "@commercetools/nimbus-viz";
import {
  AttachMoney,
  ShoppingCart,
  Percent,
  Sell,
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
import {
  fmt,
  formatInteger,
  formatUsdCents,
  formatPercent2,
} from "../data/format";
import {
  REVENUE_SERIES,
  ORDERS_BY_CATEGORY,
  REVENUE_BY_CHANNEL,
  DAILY_ORDERS,
  KPIS,
} from "../data/overview";

export function OverviewPage() {
  const nav = NAV_BY_PATH["/"];
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Page>
      <PageHeader title={nav.title} blurb={nav.blurb} />

      <KpiRow>
        <KpiTile
          label="Revenue"
          icon={AttachMoney}
          value={KPIS.revenue.value}
          previous={KPIS.revenue.previous}
          format={fmt.currency}
          spark={KPIS.revenue.spark}
        />
        <KpiTile
          label="Orders"
          icon={ShoppingCart}
          value={KPIS.orders.value}
          previous={KPIS.orders.previous}
          format={formatInteger}
          spark={KPIS.orders.spark}
        />
        <KpiTile
          label="Conversion rate"
          icon={Percent}
          value={KPIS.conversion.value}
          previous={KPIS.conversion.previous}
          format={formatPercent2}
          spark={KPIS.conversion.spark}
        />
        <KpiTile
          label="Avg. order value"
          icon={Sell}
          value={KPIS.aov.value}
          previous={KPIS.aov.previous}
          format={formatUsdCents}
          spark={KPIS.aov.spark}
        />
      </KpiRow>

      <CardGrid>
        <ChartCard
          span={8}
          title="Revenue trend"
          subtitle="Monthly revenue · this year vs. last year"
        >
          <Chart height={300} colorDomain={REVENUE_SERIES.map((s) => s.id)}>
            {(width, height) => (
              <LineChart
                width={width}
                height={height}
                series={REVENUE_SERIES}
                variant="area"
                valueFormat={fmt.currency}
                ariaLabel="Monthly revenue, this year versus last year"
              />
            )}
          </Chart>
        </ChartCard>

        <ChartCard
          span={4}
          title="Revenue by channel"
          subtitle="Share of annual revenue"
        >
          <Chart
            height={300}
            colorDomain={REVENUE_BY_CHANNEL.map((d) => d.category)}
          >
            {(width, height) => (
              <DonutChart
                width={width}
                height={height}
                data={REVENUE_BY_CHANNEL}
                ariaLabel="Revenue by sales channel"
              />
            )}
          </Chart>
        </ChartCard>

        <ChartCard
          span={5}
          title="Orders by category"
          subtitle="Units ordered · click a bar to drill in"
          action={
            <Insight tone={selected ? "positive" : "neutral"}>
              {selected ? `Selected: ${selected}` : "Nothing selected"}
            </Insight>
          }
        >
          <Chart height={300}>
            {(width, height) => (
              <BarChart
                width={width}
                height={height}
                data={ORDERS_BY_CATEGORY}
                valueFormat={fmt.compact}
                ariaLabel="Orders by product category"
                onDatumClick={(event) => setSelected(event.datum.category)}
              />
            )}
          </Chart>
        </ChartCard>

        <ChartCard
          span={7}
          title="Daily orders"
          subtitle="Order volume every day this year · weekends run lighter"
        >
          <Chart height={300}>
            {(width, height) => (
              <CalendarHeatmap
                width={width}
                height={height}
                data={DAILY_ORDERS}
                ariaLabel="Daily order volume across the year"
              />
            )}
          </Chart>
        </ChartCard>
      </CardGrid>
    </Page>
  );
}
