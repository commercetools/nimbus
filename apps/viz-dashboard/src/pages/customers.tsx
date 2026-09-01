/* -------------------------------------------------------------------------- */
/* Customers & retention — who comes back, who's worth the most, who's         */
/* slipping.                                                                    */
/* -------------------------------------------------------------------------- */

import {
  CohortTriangle,
  RfmGrid,
  FunnelChart,
  StackedBarChart,
  Histogram,
} from "@commercetools/nimbus-viz";
import {
  Groups,
  Repeat,
  Diamond,
  TrendingDown,
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
  KPIS,
  RETENTION_COHORTS,
  RETENTION_PERIOD_LABELS,
  RFM_SEGMENTS,
  ACQUISITION_FUNNEL,
  REVENUE_BY_TYPE,
  REVENUE_TYPE_DOMAIN,
  LTV_SAMPLES,
} from "../data/customers";

export function CustomersPage() {
  const nav = NAV_BY_PATH["/customers"];

  return (
    <Page>
      <PageHeader title={nav.title} blurb={nav.blurb} />

      <KpiRow>
        <KpiTile
          label="Active customers"
          icon={Groups}
          value={KPIS.activeCustomers.value}
          previous={KPIS.activeCustomers.previous}
          format={formatInteger}
          spark={KPIS.activeCustomers.spark}
        />
        <KpiTile
          label="Repeat rate"
          icon={Repeat}
          value={KPIS.repeatRate.value}
          previous={KPIS.repeatRate.previous}
          format={formatPercent2}
          spark={KPIS.repeatRate.spark}
        />
        <KpiTile
          label="Avg. lifetime value"
          icon={Diamond}
          value={KPIS.ltv.value}
          previous={KPIS.ltv.previous}
          format={formatUsdCents}
          spark={KPIS.ltv.spark}
        />
        <KpiTile
          label="Churn rate"
          icon={TrendingDown}
          value={KPIS.churnRate.value}
          previous={KPIS.churnRate.previous}
          format={formatPercent2}
          spark={KPIS.churnRate.spark}
          invertDelta
        />
      </KpiRow>

      <CardGrid>
        <ChartCard
          span={12}
          title="Cohort retention"
          subtitle="Retention by monthly cohort (%)"
        >
          <Chart height={340}>
            {(width, height) => (
              <CohortTriangle
                width={width}
                height={height}
                rows={RETENTION_COHORTS}
                periodLabels={RETENTION_PERIOD_LABELS}
                ariaLabel="Retention by monthly acquisition cohort"
              />
            )}
          </Chart>
        </ChartCard>

        <ChartCard span={6} title="RFM segments" subtitle="RFM segmentation">
          <Chart height={340}>
            {(width, height) => (
              <RfmGrid
                width={width}
                height={height}
                data={RFM_SEGMENTS}
                ariaLabel="Recency-frequency-monetary customer segmentation"
              />
            )}
          </Chart>
        </ChartCard>

        <ChartCard
          span={6}
          title="Acquisition funnel"
          subtitle="Acquisition to loyalty"
        >
          <Chart height={340}>
            {(width, height) => (
              <FunnelChart
                width={width}
                height={height}
                data={ACQUISITION_FUNNEL}
                ariaLabel="Acquisition funnel from visitors to loyal customers"
              />
            )}
          </Chart>
        </ChartCard>

        <ChartCard
          span={8}
          title="New vs. returning revenue"
          subtitle="New vs. returning revenue"
          action={
            <Insight tone="positive">
              Returning revenue now outpaces new
            </Insight>
          }
        >
          <Chart height={320} colorDomain={REVENUE_TYPE_DOMAIN}>
            {(width, height) => (
              <StackedBarChart
                width={width}
                height={height}
                data={REVENUE_BY_TYPE}
                valueFormat={fmt.compact}
                ariaLabel="New versus returning revenue by month"
              />
            )}
          </Chart>
        </ChartCard>

        <ChartCard
          span={4}
          title="LTV distribution"
          subtitle="LTV distribution"
        >
          <Chart height={320}>
            {(width, height) => (
              <Histogram
                width={width}
                height={height}
                values={LTV_SAMPLES}
                thresholds={12}
                ariaLabel="Distribution of customer lifetime value"
              />
            )}
          </Chart>
        </ChartCard>
      </CardGrid>
    </Page>
  );
}
