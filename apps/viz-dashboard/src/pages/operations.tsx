/* -------------------------------------------------------------------------- */
/* Operations & fulfillment — throughput, delivery SLAs, and returns.         */
/* -------------------------------------------------------------------------- */

import {
  GanttChart,
  Gauge,
  ControlChart,
  ParetoChart,
  RadialBarChart,
} from "@commercetools/nimbus-viz";
import {
  LocalShipping,
  Schedule,
  Timer,
  AssignmentReturn,
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
import { formatInteger, formatPercent2, formatDays } from "../data/format";
import {
  KPIS,
  FULFILLMENT_STAGES,
  FULFILLMENT_TIMELINE,
  ON_TIME_SLA,
  PROCESSING_CONTROL,
  RETURN_REASONS,
  THROUGHPUT_BY_CENTER,
} from "../data/operations";

export function OperationsPage() {
  const nav = NAV_BY_PATH["/operations"];

  return (
    <Page>
      <PageHeader title={nav.title} blurb={nav.blurb} />

      <KpiRow>
        <KpiTile
          label="Orders shipped"
          icon={LocalShipping}
          value={KPIS.shipped.value}
          previous={KPIS.shipped.previous}
          format={formatInteger}
          spark={KPIS.shipped.spark}
        />
        <KpiTile
          label="On-time rate"
          icon={Schedule}
          value={KPIS.onTime.value}
          previous={KPIS.onTime.previous}
          format={formatPercent2}
          spark={KPIS.onTime.spark}
        />
        <KpiTile
          label="Avg. processing time"
          icon={Timer}
          value={KPIS.processing.value}
          previous={KPIS.processing.previous}
          format={formatDays}
          spark={KPIS.processing.spark}
          invertDelta
        />
        <KpiTile
          label="Return rate"
          icon={AssignmentReturn}
          value={KPIS.returns.value}
          previous={KPIS.returns.previous}
          format={formatPercent2}
          spark={KPIS.returns.spark}
          invertDelta
        />
      </KpiRow>

      <CardGrid>
        <ChartCard
          span={8}
          title="Fulfillment pipeline"
          subtitle="Order fulfillment timeline"
        >
          <Chart height={340} colorDomain={[...FULFILLMENT_STAGES]}>
            {(width, height) => (
              <GanttChart
                width={width}
                height={height}
                data={FULFILLMENT_TIMELINE}
                ariaLabel="Fulfillment timeline for eight recent orders, colored by stage"
              />
            )}
          </Chart>
        </ChartCard>

        <ChartCard span={4} title="On-time delivery" subtitle="SLA target 95%">
          <Chart height={340}>
            {(width, height) => (
              <Gauge
                width={width}
                height={height}
                value={ON_TIME_SLA}
                min={0}
                max={100}
                threshold={95}
                valueFormat={(n) => `${Math.round(n)}%`}
                label="On-time"
                ariaLabel="On-time delivery rate against a 95 percent SLA target"
              />
            )}
          </Chart>
        </ChartCard>

        <ChartCard
          span={8}
          title="Order processing time"
          subtitle="Processing time · statistical control"
        >
          <Chart height={300}>
            {(width, height) => (
              <ControlChart
                width={width}
                height={height}
                series={PROCESSING_CONTROL}
                ariaLabel="Daily order processing time in hours, with control limits"
              />
            )}
          </Chart>
        </ChartCard>

        <ChartCard
          span={4}
          title="Return reasons"
          subtitle="Return reasons"
          action={
            <Insight tone="neutral">
              Top two reasons drive ~66% of returns
            </Insight>
          }
        >
          <Chart height={300}>
            {(width, height) => (
              <ParetoChart
                width={width}
                height={height}
                data={RETURN_REASONS}
                ariaLabel="Return reasons ranked by count with cumulative share"
              />
            )}
          </Chart>
        </ChartCard>

        <ChartCard
          span={12}
          title="Throughput by fulfillment center"
          subtitle="Units shipped by fulfillment center"
        >
          <Chart
            height={360}
            colorDomain={THROUGHPUT_BY_CENTER.map((d) => d.category)}
          >
            {(width, height) => (
              <RadialBarChart
                width={width}
                height={height}
                data={THROUGHPUT_BY_CENTER}
                ariaLabel="Units shipped by fulfillment center"
              />
            )}
          </Chart>
        </ChartCard>
      </CardGrid>
    </Page>
  );
}
