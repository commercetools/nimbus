---
"@commercetools/nimbus": patch
---

`Checkbox`: the label slot no longer hard-codes `flex-shrink: 0`, so long labels
can wrap or truncate when placed in a constrained-width container.

Previously, wrapping a long label in `<Box truncate>` had no effect because the
internal label slot refused to shrink below its content's intrinsic width and
the entire Checkbox overflowed its parent. The label slot now uses
`min-width: 0` with the default `flex-shrink: 1`, so:

- In wide containers, the label still takes its natural width — no visible
  change to existing layouts.
- In narrow containers, the label wraps by default. Pass a `<Box truncate>` (or
  any child with
  `whiteSpace="nowrap"; overflow="hidden"; textOverflow="ellipsis"`) as the
  Checkbox's label to truncate instead of wrap.

```tsx
<Box width="240px">
  <Checkbox width="100%">
    <Box truncate>@commercetools-frontend-extensions-very-long</Box>
  </Checkbox>
</Box>
```
