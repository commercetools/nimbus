# viz-dashboard

Internal demo dashboard for `@commercetools/nimbus-viz`. It renders the chart
library with realistic commerce data inside a Nimbus app shell, so chart
behavior can be checked the way a consumer would see it: many charts on one
page, real layouts, light and dark mode, drill-down callbacks wired up.

This app is the monkey-test surface for the library. A chart is not considered
ready until it appears on at least one page here (see
`packages/nimbus-viz/docs/lifecycle.md`, "Beta").

## Run

```bash
pnpm start:viz-dashboard       # from the repo root; Vite dev server
pnpm --filter viz-dashboard typecheck
pnpm --filter viz-dashboard build
```

`typecheck` runs in CI through the root `typecheck:strict` script. The app is
not built or published in CI.

## Pages

Routes are wired in `src/app.tsx`; one file per page under `src/pages/`:
`overview`, `sales`, `products`, `customers`, `marketing`, `operations`,
`finance`. Each page composes `ChartCard` / `KpiTile` wrappers from
`src/components/` around nimbus-viz charts.

When you add or harden a chart in `packages/nimbus-viz`, give it a home on the
page whose question it answers, with data shaped like the real thing.
