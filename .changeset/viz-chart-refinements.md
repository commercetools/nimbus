---
"@commercetools/nimbus-viz": minor
---

Chart refinements found while dogfooding the library in a real dashboard:

- `StatCard`: new `invertDelta` prop for "lower is better" metrics (refund rate,
  processing time, churn). The trend arrow still points in the true direction;
  only the valence color flips, so an improvement reads positive (green).
- In-cell text on the color-scaled charts (`RfmGrid`, `Heatmap`,
  `CohortTriangle`) now chooses black vs. white by the cell's actual WCAG
  contrast instead of a fixed value threshold, so labels stay legible on
  mid-and-dark ramp colors. New `readableTextColor` helper exported from the
  theme entry.
- `FunnelChart`: a stage's value is no longer drawn inside its bar when it would
  be clipped — the stage percentage above the bar and the hover tooltip carry it
  instead.
- `CalendarHeatmap`: the week grid is vertically centered in its container (no
  more bottom whitespace in a tall card), and colliding leading month labels
  (e.g. a partial "Dec" before "Jan") are dropped.
- `BulletChart`: the qualitative range bands are lighter, reading as subtle
  context behind the measure bar rather than heavy blocks.
- **Removed `TileGridMap`** (experimental tile-grid cartogram) and its
  `RegionTile` type, along with the selection engine's `GEO` intent /
  `geographic` shape / `region-tiles` data kind. For "metric by region", use a
  ranked `BarChart`.
