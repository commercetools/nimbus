## Context

RadioInput is a multi-slot recipe (`root`, `option`). Before this change the
option label had no font size and inherited it from the parent. The first fix on
this branch set a fixed 14px label, next to a 20px indicator.

`sm` and `md` text styles both have a 22px line height, so one row is 22px
high for both sizes.

## Goals / Non-Goals

**Goals:**
- Give the label an explicit size that does not depend on the parent.
- Offer two sizes with the same prop name and values as other components.
- Keep the 20px indicator as the default look.

**Non-Goals:**
- No `lg` size. The old spec listed it, but no design needs it.
- No changes to Checkbox, Switch or other components. A shared size table for
  toggle controls can be a separate change.
- No change to label colors.

## Decisions

**Size as a recipe variant on the root.** The option slot already reads the
root's variants through the slot recipe context, so `size` needs no extra prop
passing. Alternative: a prop on each option. Rejected because the options in one
group should always have the same size.

**Text style instead of font size tokens.** `sm` and `md` set `textStyle`, which
sets font size and line height together, as Button does. The recipe keeps
`fontWeight: "400"` so the label weight also does not depend on the parent.

**Gaps by compound variant.** The vertical gap depends on both `orientation`
and `size`, so it is set with `compoundVariants`. The horizontal gap is the same
for both sizes and stays in the `orientation` variant.

**Gap values.** Carbon uses 8px between stacked radio buttons with a 14px label
(https://carbondesignsystem.com/components/radio-button/style/). A community
Figma kit uses 8px stacked and 16px in a row with 14/20px text
(https://github.com/ssimorka/graphite-ui/issues/228). The old Nimbus gaps of 16px
and 24px are larger than both. We use 8px (`sm`) and 12px (`md`) stacked, and
16px in a row. The 12px for `md` is our own choice. I found no source for a rule
that ties the gap to the line height.

## Risks / Trade-offs

- [Default look changes] The gaps get smaller and the label is now 16px where
  the parent was not 16px → state both in the changeset, so consumers can check
  their layouts.
- [Touch target] Smaller gaps reduce the distance between click areas →
  the option label and indicator are one clickable label, and the 22px row height
  is unchanged. Keep this in mind if a bigger touch target is needed later.
