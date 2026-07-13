---
"@commercetools/nimbus": minor
---

**Slider / RangeSlider**: add a `variant` prop with four visual treatments —
`solid` (default, the existing look), `outline` (transparent bordered track and
hollow progress), `minimal` (ultra-thin hairline track with a small dot thumb),
and `enclosed` (a thick, contained bar with the thumb inset inside it, iOS
style). Applies to both `Slider` and `RangeSlider`.

Also fixes the thumb rendering slightly off-center on the track — it now centers
correctly on the cross-axis in both horizontal and vertical orientations.
