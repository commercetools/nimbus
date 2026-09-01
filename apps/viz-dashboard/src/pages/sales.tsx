/* -------------------------------------------------------------------------- */
/* Sales & revenue — where revenue comes from, and how it's moving.           */
/* -------------------------------------------------------------------------- */

import {
  StackedAreaChart,
  WaterfallChart,
  BarChart,
  LollipopChart,
} from "@commercetools/nimbus-viz";
import {
  Payments,
  Savings,
  Undo,
  LocalMall,
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
  REVENUE_BY_CHANNEL,
  MOM_REVENUE_CHANGE,
  MOM_NET_CHANGE,
  REVENUE_BY_REGION,
  TOP_PRODUCTS,
  KPIS,
} from "../data/sales";

export function SalesPage() {
  const nav = NAV_BY_PATH["/sales"];

  return (
    <Page>
      <PageHeader title={nav.title} blurb={nav.blurb} />

      <KpiRow>
        <KpiTile
          label="Gross revenue"
          icon={Payments}
          value={KPIS.grossRevenue.value}
          previous={KPIS.grossRevenue.previous}
          format={fmt.currency}
          spark={KPIS.grossRevenue.spark}
        />
        <KpiTile
          label="Net revenue"
          icon={Savings}
          value={KPIS.netRevenue.value}
          previous={KPIS.netRevenue.previous}
          format={fmt.currency}
          spark={KPIS.netRevenue.spark}
        />
        <KpiTile
          label="Refund rate"
          icon={Undo}
          value={KPIS.refundRate.value}
          previous={KPIS.refundRate.previous}
          format={formatPercent2}
          spark={KPIS.refundRate.spark}
          invertDelta
        />
        <KpiTile
          label="Units sold"
          icon={LocalMall}
          value={KPIS.unitsSold.value}
          previous={KPIS.unitsSold.previous}
          format={formatInteger}
          spark={KPIS.unitsSold.spark}
        />
      </KpiRow>

      <CardGrid>
        <ChartCard
          span={8}
          title="Revenue by channel"
          subtitle="Revenue by channel · trailing 12 months"
        >
          <Chart height={300} colorDomain={REVENUE_BY_CHANNEL.map((s) => s.id)}>
            {(width, height) => (
              <StackedAreaChart
                width={width}
                height={height}
                series={REVENUE_BY_CHANNEL}
                valueFormat={fmt.compact}
                ariaLabel="Monthly revenue by sales channel, trailing 12 months"
              />
            )}
          </Chart>
        </ChartCard>

        <ChartCard
          span={4}
          title="Revenue momentum"
          subtitle="Month-over-month change"
          action={
            <Insight tone="positive">
              +{fmt.compact(MOM_NET_CHANGE)} over 6 months
            </Insight>
          }
        >
          <Chart height={300}>
            {(width, height) => (
              <WaterfallChart
                width={width}
                height={height}
                data={MOM_REVENUE_CHANGE}
                ariaLabel="Month-over-month revenue change over the last six months"
              />
            )}
          </Chart>
        </ChartCard>

        <ChartCard
          span={6}
          title="Sales by region"
          subtitle="Revenue by top state"
        >
          <Chart height={320}>
            {(width, height) => (
              <BarChart
                width={width}
                height={height}
                data={REVENUE_BY_REGION}
                orientation="horizontal"
                valueFormat={fmt.compact}
                ariaLabel="Revenue by US state, ranked"
              />
            )}
          </Chart>
        </ChartCard>

        <ChartCard
          span={6}
          title="Top products"
          subtitle="Top products by revenue"
        >
          <Chart height={320}>
            {(width, height) => (
              <LollipopChart
                width={width}
                height={height}
                data={TOP_PRODUCTS}
                ariaLabel="Top eight products by revenue"
              />
            )}
          </Chart>
        </ChartCard>
      </CardGrid>
    </Page>
  );
}
