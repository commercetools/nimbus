/* -------------------------------------------------------------------------- */
/* Finance — P&L, margin, cashflow, and budget vs. actual.                     */
/* -------------------------------------------------------------------------- */

import {
  WaterfallChart,
  DivergingBarChart,
  Streamgraph,
  BulletChart,
  DonutChart,
} from "@commercetools/nimbus-viz";
import {
  Percent,
  Savings,
  ReceiptLong,
  AccountBalance,
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
import { fmt, formatPercent2 } from "../data/format";
import {
  PL_BRIDGE,
  MARGIN_VS_TARGET,
  CASHFLOW_SERIES,
  CASHFLOW_DOMAIN,
  BUDGET_VS_ACTUAL,
  OPEX_BREAKDOWN,
  OPEX_DOMAIN,
  KPIS,
} from "../data/finance";

export function FinancePage() {
  const nav = NAV_BY_PATH["/finance"];

  return (
    <Page>
      <PageHeader title={nav.title} blurb={nav.blurb} />

      <KpiRow>
        <KpiTile
          label="Gross margin"
          icon={Percent}
          value={KPIS.grossMargin.value}
          previous={KPIS.grossMargin.previous}
          format={formatPercent2}
          spark={KPIS.grossMargin.spark}
        />
        <KpiTile
          label="Net profit"
          icon={Savings}
          value={KPIS.netProfit.value}
          previous={KPIS.netProfit.previous}
          format={fmt.currency}
          spark={KPIS.netProfit.spark}
        />
        <KpiTile
          label="Operating expenses"
          icon={ReceiptLong}
          value={KPIS.opex.value}
          previous={KPIS.opex.previous}
          format={fmt.currency}
          spark={KPIS.opex.spark}
        />
        <KpiTile
          label="Cash on hand"
          icon={AccountBalance}
          value={KPIS.cash.value}
          previous={KPIS.cash.previous}
          format={fmt.currency}
          spark={KPIS.cash.spark}
        />
      </KpiRow>

      <CardGrid>
        <ChartCard
          span={7}
          title="P&L bridge"
          subtitle="Revenue to net profit"
          action={
            <Insight tone="positive">
              {fmt.currency(KPIS.netProfit.value)} net
            </Insight>
          }
        >
          <Chart height={320}>
            {(width, height) => (
              <WaterfallChart
                width={width}
                height={height}
                data={PL_BRIDGE}
                ariaLabel="Profit and loss bridge from revenue to net profit"
              />
            )}
          </Chart>
        </ChartCard>

        <ChartCard
          span={5}
          title="Margin vs. target"
          subtitle="Margin vs. target by category"
        >
          <Chart height={320}>
            {(width, height) => (
              <DivergingBarChart
                width={width}
                height={height}
                data={MARGIN_VS_TARGET}
                ariaLabel="Margin versus target, in percentage points, by category"
              />
            )}
          </Chart>
        </ChartCard>

        <ChartCard span={12} title="Cashflow" subtitle="Cashflow composition">
          <Chart height={300} colorDomain={CASHFLOW_DOMAIN}>
            {(width, height) => (
              <Streamgraph
                width={width}
                height={height}
                series={CASHFLOW_SERIES}
                ariaLabel="Cashflow composition by source over the trailing 12 months"
              />
            )}
          </Chart>
        </ChartCard>

        <ChartCard
          span={6}
          title="Budget vs. actual"
          subtitle="Budget vs. actual (spend)"
        >
          <Chart height={280}>
            {(width, height) => (
              <BulletChart
                width={width}
                height={height}
                data={BUDGET_VS_ACTUAL}
                ariaLabel="Budget versus actual spend by department"
              />
            )}
          </Chart>
        </ChartCard>

        <ChartCard
          span={6}
          title="Operating expenses"
          subtitle="Where opex goes"
        >
          <Chart height={280} colorDomain={OPEX_DOMAIN}>
            {(width, height) => (
              <DonutChart
                width={width}
                height={height}
                data={OPEX_BREAKDOWN}
                ariaLabel="Operating expense breakdown by category"
              />
            )}
          </Chart>
        </ChartCard>
      </CardGrid>
    </Page>
  );
}
