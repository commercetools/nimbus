/* -------------------------------------------------------------------------- */
/* Marketing & channels — acquisition funnel, channel mix, and campaign ROI.  */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import {
  FunnelChart,
  SankeyDiagram,
  GroupedBarChart,
  BubbleChart,
  CalendarHeatmap,
} from "@commercetools/nimbus-viz";
import {
  Campaign,
  TrendingUp,
  PersonAdd,
  MonetizationOn,
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
import { fmt, formatUsdCents } from "../data/format";
import {
  KPIS,
  MEDIA_FUNNEL,
  TRAFFIC_FLOW,
  CHANNEL_SPEND_REVENUE,
  CHANNEL_COLOR_DOMAIN,
  CAMPAIGNS,
  DAILY_CONVERSIONS,
} from "../data/marketing";

const formatRoas = (n: number) => `${n.toFixed(1)}×`;

export function MarketingPage() {
  const nav = NAV_BY_PATH["/marketing"];
  const [campaign, setCampaign] = useState<string | null>(null);

  return (
    <Page>
      <PageHeader title={nav.title} blurb={nav.blurb} />

      <KpiRow>
        <KpiTile
          label="Marketing spend"
          icon={Campaign}
          value={KPIS.spend.value}
          previous={KPIS.spend.previous}
          format={fmt.currency}
          spark={KPIS.spend.spark}
        />
        <KpiTile
          label="ROAS"
          icon={TrendingUp}
          value={KPIS.roas.value}
          previous={KPIS.roas.previous}
          format={formatRoas}
          spark={KPIS.roas.spark}
        />
        <KpiTile
          label="Blended CAC"
          icon={PersonAdd}
          value={KPIS.cac.value}
          previous={KPIS.cac.previous}
          format={formatUsdCents}
          spark={KPIS.cac.spark}
          invertDelta
        />
        <KpiTile
          label="Attributed revenue"
          icon={MonetizationOn}
          value={KPIS.attributedRevenue.value}
          previous={KPIS.attributedRevenue.previous}
          format={fmt.currency}
          spark={KPIS.attributedRevenue.spark}
        />
      </KpiRow>

      <CardGrid>
        <ChartCard
          span={5}
          title="Acquisition funnel"
          subtitle="Sessions to purchase"
        >
          <Chart height={300}>
            {(width, height) => (
              <FunnelChart
                width={width}
                height={height}
                data={MEDIA_FUNNEL}
                ariaLabel="Media funnel from impressions to purchase"
              />
            )}
          </Chart>
        </ChartCard>

        <ChartCard span={7} title="Traffic flow" subtitle="Where traffic flows">
          <Chart height={320}>
            {(width, height) => (
              <SankeyDiagram
                width={width}
                height={height}
                graph={TRAFFIC_FLOW}
                ariaLabel="Traffic flow from sources through landing pages to purchase or bounce"
              />
            )}
          </Chart>
        </ChartCard>

        <ChartCard
          span={6}
          title="Channel efficiency"
          subtitle="Spend vs. revenue by channel"
        >
          <Chart height={300} colorDomain={CHANNEL_COLOR_DOMAIN}>
            {(width, height) => (
              <GroupedBarChart
                width={width}
                height={height}
                data={CHANNEL_SPEND_REVENUE}
                ariaLabel="Marketing spend versus attributed revenue by channel"
              />
            )}
          </Chart>
        </ChartCard>

        <ChartCard
          span={6}
          title="Campaign returns"
          subtitle="Campaigns: spend vs. revenue (size = ROAS)"
          action={
            <Insight tone={campaign ? "positive" : "neutral"}>
              {campaign ? `Selected: ${campaign}` : "Click a bubble"}
            </Insight>
          }
        >
          <Chart height={300}>
            {(width, height) => (
              <BubbleChart
                width={width}
                height={height}
                points={CAMPAIGNS}
                ariaLabel="Campaigns by spend, attributed revenue, and ROAS"
                onDatumClick={(event) => setCampaign(event.datum.label ?? null)}
              />
            )}
          </Chart>
        </ChartCard>

        <ChartCard
          span={12}
          title="Daily conversions"
          subtitle="Daily conversions"
        >
          <Chart height={300}>
            {(width, height) => (
              <CalendarHeatmap
                width={width}
                height={height}
                data={DAILY_CONVERSIONS}
                ariaLabel="Daily conversions across the year"
              />
            )}
          </Chart>
        </ChartCard>
      </CardGrid>
    </Page>
  );
}
