# E-Commerce Admin Personas & Questions — Research Map

_Foundation for the visualization catalog. Grounded in commerce-platform role docs and KPI/analytics references; see Sources at end. Status: first-pass reference for RFC refinement._

**17 personas** who use a commerce admin, mapping ~200 recurring questions into **15 question intents** and **13 data shapes**.

Intent legend: **TREND** (change over time) · **DELTA** (signed change) · **RANK** (ranking) · **PART-WHOLE** (composition) · **COMPARE** · **DIST** (distribution) · **TARGET** (progress to goal) · **RANGE** (in range/threshold) · **REL** (relationship of two variables) · **COMP-TIME** (composition over time) · **GEO** · **FLOW** (in/out/net) · **BENCH** (vs benchmark) · **RETAIN** (cohort/retention) · **VALUE** (single value/magnitude).

## Sourcing basis for personas
- **commercetools** — The Merchant Center is an administration application to manage every aspect of a project; permissions are assigned per Team across entities (Orders, Products, Customers, Discounts, etc.), and it explicitly anticipates narrow roles such as customer-service reps who use only a small part of the app. B2B models companies as **Business Units** and people as **Associates** with role templates; the B2B sample data ships **Admin, Buyer, Approver** roles and a multi-tier Buyer-Approval-Flow (up to five approver tiers). Business Units nest up to five levels; the quote workflow spans Quote Requests → Staged Quotes → Quotes.
- **Shopify** — Five customizable predefined roles: **Administrator** (full access), **Customer support** (fulfill orders, edit order line items, process payments/returns), **Marketer** (create/edit/launch marketing campaigns), **Merchandiser** (create/edit/publish products incl. prices/costs; access to Products, Catalogs, Content), **Online store editor** (edit/publish themes incl. theme code).
- **Adobe Commerce/Magento** — Resource-scoped roles; e.g. a design-team member can be limited to content tools with no access to customer/order data. Separate admins for catalog vs. marketing/content vs. customer service.
- **BigCommerce** — Store Owner (all permissions), Sales Staff, Sales Manager, Store Administrator.

---

## Master persona × question tables

### 1. Store Owner / Small-Merchant Generalist
_JTBD: Understand overall business health at a glance and decide where to intervene._

| Question | Intent | Data shape | Candidate viz |
|---|---|---|---|
| Revenue today / this week / this month? | VALUE | single value | KPI stat card |
| Is revenue trending up or down? | TREND | time series | line/area |
| This month vs last month / last year? | DELTA | two values / time series | stat+delta, dual-line |
| Best-selling products? | RANK | ranking | horizontal bar |
| Where does revenue come from (channels)? | PART-WHOLE | part-to-whole | donut / stacked bar |
| On track to sales goal? | TARGET | value vs target | bullet / gauge / progress |
| When do we sell most (time of day/week)? | TREND/DIST | time-ordered / matrix | heatmap (hour×day) |
| Where are my customers located? | GEO | geographic | choropleth / bubble map |
| Conversion rate, AOV, repeat rate now? | VALUE | single value | KPI stat cards |

### 2. Merchandiser
_JTBD: Curate assortment, collections, and presentation to maximize sell-through._

| Question | Intent | Data shape | Candidate viz |
|---|---|---|---|
| Which products/collections sell best/worst? | RANK | ranking | horizontal bar |
| Sell-through rate by product/category? | TARGET/RANK | value vs target / ranking | bar + reference line |
| Category contribution to revenue? | PART-WHOLE | part-to-whole | treemap / stacked bar |
| High views but low conversion? | REL | two-variable | scatter |
| Category mix change over seasons? | COMP-TIME | multiple series | stacked area |
| Aging / slow-moving SKUs? | RANK/DIST | ranking / distribution | bar, histogram |
| Product funnel (view→cart→buy)? | FLOW | funnel stages | funnel |
| GMROI by category? | RANK | ranking | bar |

### 3. Category / Catalog Manager
_JTBD: Own P&L and assortment strategy for a category._

| Question | Intent | Data shape | Candidate viz |
|---|---|---|---|
| Which categories grow/shrink YoY? | DELTA | time series | grouped bar / slope |
| Assortment breadth vs sales concentration? | DIST | distribution | Pareto |
| Share of shelf by brand? | PART-WHOLE | part-to-whole | stacked bar |
| Categories with stockout risk? | RANGE | value vs threshold | bar + threshold band |
| Cross-sell relationships between categories? | REL/FLOW | network / matrix | chord / heatmap |

### 4. Pricing Manager
_JTBD: Set prices/markdowns to optimize margin and realization._

| Question | Intent | Data shape | Candidate viz |
|---|---|---|---|
| Price realization vs list? | TARGET | value vs target | bullet / bar |
| Gross margin variation by product/category? | DIST/RANK | distribution/ranking | box plot / bar |
| Price elasticity (price vs volume)? | REL | two-variable | scatter + trend |
| Markdown rate trend? | TREND | time series | line |
| Compare to competitor prices? | COMPARE/BENCH | categorical / vs benchmark | dumbbell / bar vs ref |
| Discount-depth distribution across orders? | DIST | distribution | histogram |

### 5. Marketing / Promotions / Campaign Manager
_JTBD: Acquire and retain profitably across channels._

| Question | Intent | Data shape | Candidate viz |
|---|---|---|---|
| ROAS by channel? | COMPARE/RANK | categorical magnitudes | bar |
| Channels acquiring new vs returning customers? | PART-WHOLE/COMPARE | part-to-whole | stacked bar |
| CAC and LTV:CAC trend? | TREND/TARGET | time series / ratio | line, bullet |
| Campaign revenue over time? | TREND | time series | line/area |
| Marketing funnel (impression→click→convert)? | FLOW | funnel | funnel |
| Best incremental promo lift? | COMPARE/DELTA | categorical | bar w/ baseline |
| Discount effectiveness (revenue vs margin lost)? | REL/TARGET | two-variable / ratio | scatter / bullet |
| Email/SMS revenue share of total? | PART-WHOLE | part-to-whole | donut |
| Cohort payback / retention by acquisition month? | RETAIN | cohort matrix | retention heatmap |

### 6. SEO / Content Manager
_JTBD: Grow organic visibility and organic revenue._

| Question | Intent | Data shape | Candidate viz |
|---|---|---|---|
| Organic traffic trend (YoY)? | TREND | time series | line |
| Keyword ranking distribution / movement? | DIST/DELTA | distribution / ranking | histogram, bump |
| Landing pages driving most organic revenue? | RANK | ranking | horizontal bar |
| CTR by page/query? | RANK/DIST | ranking | bar |
| Branded vs non-branded traffic split? | PART-WHOLE | part-to-whole | stacked area over time |
| Organic conversion rate trend? | TREND | time series | line |

### 7. Growth / CRO Analyst
_JTBD: Find and fix funnel drop-off; run experiments._

| Question | Intent | Data shape | Candidate viz |
|---|---|---|---|
| Where do users drop off in the funnel? | FLOW | funnel stages | funnel |
| Add-to-cart / checkout / completion rates? | VALUE/COMPARE | single/categorical | KPI + funnel |
| Cart abandonment rate & trend? | TREND | time series | line + threshold |
| Conversion by device / channel? | COMPARE | categorical | grouped bar |
| A/B test: variant A vs B lift + significance? | COMPARE/RANGE | two values + CI | bar with error bars |
| Revenue per visitor/session trend? | TREND | time series | line |

### 8. Customer Service / Support Lead
_JTBD: Resolve issues fast, keep satisfaction high._

| Question | Intent | Data shape | Candidate viz |
|---|---|---|---|
| Ticket volume trend? | TREND | time series | line/area |
| First response time vs SLA? | TARGET/RANGE | value vs target | bullet / gauge |
| First contact resolution rate? | TREND/TARGET | time series | line + target |
| CSAT / NPS over time? | TREND | time series | line |
| Tickets by category/channel? | PART-WHOLE/RANK | part-to-whole | stacked bar |
| Backlog / open vs resolved? | FLOW | in/out/net | area / flow |
| Contact rate per order? | REL | ratio over time | line |

### 9. Operations / Order-Fulfillment Manager
_JTBD: Ship accurately and on time._

| Question | Intent | Data shape | Candidate viz |
|---|---|---|---|
| Orders received vs fulfilled (backlog)? | FLOW | in/out/net | area / dual-line |
| On-time delivery rate vs target? | TARGET | value vs target | bullet |
| Order/shipping accuracy rate? | TARGET/RANGE | value vs threshold | gauge |
| Perfect order rate trend? | TREND | time series | line |
| Fulfillment time distribution? | DIST | distribution | histogram / box |
| Orders by warehouse/region? | GEO/RANK | geographic/ranking | map / bar |
| Order status breakdown now? | PART-WHOLE | part-to-whole | donut / funnel |

### 10. Inventory / Supply / Warehouse Manager
_JTBD: Right stock, right place, minimal capital tied up._

| Question | Intent | Data shape | Candidate viz |
|---|---|---|---|
| SKUs at/below reorder point? | RANGE | value vs threshold | bar + threshold / table |
| Inventory turnover by category? | RANK/COMPARE | categorical | bar |
| Days of supply / DSI trend? | TREND | time series | line |
| Stockout rate & trend? | TREND/RANGE | time series | line + threshold |
| Stock in vs out over time (net)? | FLOW/COMP-TIME | flows | Sankey / stacked area |
| Fill rate / backorder rate vs target? | TARGET | value vs target | bullet |
| Inventory value distribution (ABC)? | DIST | distribution | Pareto |
| Aging stock buckets? | PART-WHOLE/DIST | distribution | stacked bar / histogram |
| Demand forecast vs actual? | COMPARE/TREND | multiple series | dual-line + band |

### 11. Finance / Controller / Revenue Analyst
_JTBD: Protect margin and cash; report accurate financials._

| Question | Intent | Data shape | Candidate viz |
|---|---|---|---|
| Gross/contribution margin trend? | TREND | time series | line |
| Revenue vs budget/forecast? | TARGET | value vs target | bullet / actual-vs-plan |
| Revenue bridge (what changed PoP)? | DELTA/PART-WHOLE | signed components | waterfall |
| Revenue composition by segment/product? | PART-WHOLE | part-to-whole | stacked bar / treemap |
| Refunds/returns as % of revenue? | TREND/RANGE | time series | line + threshold |
| Cash conversion / DSI? | TREND | time series | line |
| Cohort LTV / revenue retention? | RETAIN | cohort matrix | retention heatmap |
| Margin distribution across orders? | DIST | distribution | histogram / box |

### 12. Data Analyst / BI
_JTBD: Answer arbitrary ad-hoc questions across all domains. (Most likely to need the long tail of the catalog.)_

| Question | Intent | Data shape | Candidate viz |
|---|---|---|---|
| Correlation between any two metrics? | REL | two-variable | scatter + trend |
| Distribution of any metric? | DIST | distribution | histogram / box / violin |
| Segment comparison across dimensions? | COMPARE | categorical | small multiples / grouped bar |
| Anomaly vs normal range? | RANGE/BENCH | time series + band | control chart |
| Any raw drill-down? | VALUE | tabular | data table |
| Multi-metric relationships? | REL | multivariate | scatter matrix / parallel coords |

### 13. B2B Account Manager / Sales Rep
_JTBD: Grow and retain named accounts. (commercetools Associates/Business Units.)_

| Question | Intent | Data shape | Candidate viz |
|---|---|---|---|
| Which accounts are under-buying / at risk? | RANK/DELTA | ranking | bar / bullet vs prior |
| Reorder rate by account? | RANK/TARGET | ranking | bar |
| Revenue: new vs existing accounts? | PART-WHOLE/COMPARE | part-to-whole | stacked bar |
| Quote-to-order conversion rate? | TARGET/FLOW | value/funnel | funnel / bullet |
| AOV / order frequency per account trend? | TREND | time series | line |
| Territory / rep performance ranking? | RANK | ranking | bar |
| Digital share of wallet per account? | TARGET | value vs target | bullet |

### 14. Customer Success / Retention Manager
_JTBD: Maximize lifetime value and reduce churn._

| Question | Intent | Data shape | Candidate viz |
|---|---|---|---|
| Retention/churn by cohort? | RETAIN | cohort matrix | retention heatmap |
| RFM segment sizes and value? | PART-WHOLE/DIST | part-to-whole | treemap / RFM grid |
| Repeat purchase rate trend? | TREND | time series | line |
| Time to second order distribution? | DIST | distribution | histogram |
| CLV by segment? | RANK/COMPARE | categorical | bar |
| Customers at risk of churn (recency)? | RANK/RANGE | ranking | bar / table |

### 15. Returns / Fraud / Risk Analyst
_JTBD: Minimize losses from returns, chargebacks, and fraud._

| Question | Intent | Data shape | Candidate viz |
|---|---|---|---|
| Chargeback rate vs network threshold? | RANGE/TARGET | value vs threshold | gauge / line + limit |
| Return rate by product/category? | RANK | ranking | bar |
| Return reasons breakdown? | PART-WHOLE | part-to-whole | donut / bar |
| Fraud/dispute trend over time? | TREND | time series | line + threshold |
| Refunds in vs out (net loss)? | FLOW | flows | waterfall / Sankey |
| Anomalous transaction patterns? | RANGE/DIST | distribution | scatter / control chart |
| Return rate distribution across SKUs? | DIST | distribution | histogram |

### 16. Developer / Integrator / Admin
_JTBD: Keep the store technically healthy and integrations flowing._

| Question | Intent | Data shape | Candidate viz |
|---|---|---|---|
| API error rate / uptime trend? | TREND/RANGE | time series | line + threshold |
| Import/sync job success vs failure? | PART-WHOLE/FLOW | part-to-whole | stacked bar |
| Webhook/event volume over time? | TREND | time series | line/area |
| Checkout/payment error rate? | TREND/RANGE | time series | line + threshold |
| Latency distribution (p50/p95/p99)? | DIST | distribution | histogram / box |

### 17. Store / Project Administrator (Merchant Center Admin)
_JTBD: Manage users, teams, permissions, project settings._

| Question | Intent | Data shape | Candidate viz |
|---|---|---|---|
| How many users/teams, and access levels? | PART-WHOLE/RANK | part-to-whole | table / bar |
| Login / activity over time? | TREND | time series | line |
| Which stores/projects are most active? | RANK | ranking | bar |
| Permission changes over time (audit)? | TREND | event/timeline | timeline |

---

## First-pass value / prioritization
- **Tier 1 (ship first, ~all personas):** KPI stat card (+delta/sparkline), time-series line/area, horizontal ranked bar, part-to-whole (stacked bar/donut/treemap), data table.
- **Tier 2 (broad):** grouped/comparison bar & small multiples, bullet/gauge/progress, funnel, heatmap (hour×day & cohort), histogram/box plot.
- **Tier 3 (specialized):** scatter/bubble, waterfall, choropleth/map, Sankey/chord/flow map, control chart/line+band, Pareto, stacked area/streamgraph, RFM grid, bump chart, parallel coordinates, radar.

Prioritize the **vs-target / vs-threshold family (bullet/gauge/reference-band)** early: nearly every operational persona asks "am I within range / on track?" (SLAs, on-time, reorder points, risk thresholds, budget). Ship the **data table** as a guaranteed fallback when chart-type confidence is low. Instrument **question→intent→viz telemetry** from day one to replace this ranking with measured demand.

---

## Caveats
- **Persona list is a composite**, not one vendor's taxonomy. Only some names map to predefined platform roles (Shopify Merchandiser/Marketer/Customer support/Administrator/Online store editor; commercetools Admin/Buyer/Approver; BigCommerce Sales Staff/Manager/Store Admin). Others (Pricing Manager, SEO/Content, CRO Analyst, Finance, Data Analyst, Returns/Fraud, Customer Success) are industry-standard job functions grounded in KPI/analytics sources rather than a role toggle — treat that org-chart granularity as **inferred**.
- **Question lists are representative, not exhaustive**; many questions are inferred by combining a documented JTBD with sourced KPI definitions. Where a specific question is not directly attested, treat it as a reasonable inference for RFC refinement, not a cited fact.
- **commercetools B2B role templates are illustrative, not fixed.** A May 2023 release note cited "Buyer or Supervisor" examples; current sample data ships Admin/Buyer/Approver; roles are customizable with no published exhaustive list. There is no documented "view prices" associate permission — price visibility is governed by Store/Customer-Group context.
- **Benchmarks vary by source/vertical/date** and several come from vendor blogs; use as orientation. Firmer references: Baymard Institute average cart-abandonment 70.22% (meta-analysis of 50 studies, updated Sept 2025); NRF/Happy Returns estimate 16.9% of 2024 retail sales (~$890B) returned (19.3% projected e-commerce return rate for 2025); Visa VAMP "Excessive" merchant threshold 1.5% (150 bps) effective April 1, 2026, with an $8-per-dispute fee.
- **Viz suggestions reflect established frameworks** (FT Visual Vocabulary, Abela Chart Chooser, Storytelling with Data); the final catalog mapping is our synthesis and should be validated against the actual ~100-type catalog and real usage.

## Sources
- commercetools Merchant Center — https://docs.commercetools.com/merchant-center
- commercetools Administrators Team — https://docs.commercetools.com/merchant-center/administrators-team
- commercetools B2B sample data — https://docs.commercetools.com/merchant-center/getting-started/explore-b2b-sample-data
- commercetools Buyer Approval Flows — https://docs.commercetools.com/frontend-development/b2b-buyer-approval-flows
- commercetools Business Units release note — https://docs.commercetools.com/merchant-center/releases/2023-05-02-introduced-business-units
- Shopify roles — https://help.shopify.com/en/manual/your-account/users/roles
- Shopify RBAC overview (Ecommerce Pot) — https://ecommercepot.com/shopify-qa/shopify-user-roles/
- Adobe Commerce admin permissions — https://experienceleague.adobe.com/en/docs/commerce-admin/systems/user-accounts/permissions
- BigCommerce Store Owner role — https://support.bigcommerce.com/articles/Public/Store-Owner
- Merchandising KPIs (FieldPie) — https://www.fieldpie.com/blog/merchandising-kpis/
- Pricing metrics (Competera) — https://competera.ai/resources/articles/pricing-performance
- Marketing analytics (Prooflytics) — https://prooflytics.io/blog/marketing-analytics-for-ecommerce
- Customer service KPIs (Featurebase) — https://www.featurebase.app/blog/customer-service-kpis
- B2B sales rep platforms (RepSpark) — https://www.repspark.com/blog/7-key-ways-b2b-platforms-help-independent-sales-reps
- B2B eCommerce KPIs (Atwix) — https://www.atwix.com/b2b-ecommerce/b2b-ecommerce-kpis/
- Additional referenced frameworks: FT Visual Vocabulary; Andrew Abela Chart Chooser; Cole Nussbaumer Knaflic, _Storytelling with Data_; Leland Wilkinson, _The Grammar of Graphics_ / Vega-Lite; Baymard Institute (cart abandonment); NRF/Happy Returns (returns); Visa VAMP (chargeback thresholds).
