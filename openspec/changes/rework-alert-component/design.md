## Design notes

Three decisions here are not obvious. Each is recorded with the alternative it
was chosen over.

### 1. Sizing the icon box from the cascade, not a token

**Problem.** An `svg` is a block box: it sits on the text baseline and
stretches the line box past its own height, so the row ends up taller than the
text it belongs to and the glyph rides above the centre of the first line.

**Chosen.** `height: 1lh` on the icon and dismiss slots, contents centred.
`lh` resolves against the slot's own computed line height, which it inherits
from the alert along with the font size, so the box keeps matching the first
line of text when either changes. The glyph inside is `1.25em` — identical to
the current 20px at the default size, but it scales with the text rather than
floating at a fixed size in a box that grew without it.

**Rejected.** A fixed pixel height matching the default line height. Correct
only at the default type scale, and wrong the moment a consumer sets
`fontSize` on `Alert.Root`.

**Consequence.** `1lh` is only correct if the text slots actually take the
alert's type cascade. `Alert.Title` is pinned to a `Heading` size today, so it
has to be unpinned as part of this change — the two are a pair, not
independent. At the default size the title renders identically (16px, weight
600), so this is invisible unless an alert is resized.

### 2. The accent bar as an inset shadow

**Problem.** `accent-start` needs a 3px bar on the leading edge, and Alert
reserves a 1px border on all four sides in `base` specifically so that
changing variant never reflows the box.

**Chosen.** An inset `box-shadow`, which paints inside the reserved border box
and consumes no layout space. A story asserts that padding, border width,
corner radius and content offset are identical across every variant.

**Rejected.** `borderInlineStartWidth: "3px"`, which would shift the content
by 2px and break the invariant the `base`/variant split exists to protect.

### 3. The bar follows the reading direction

`accent-start` is named for the logical edge, so a `_rtl` override mirrors the
bar to the right in right-to-left languages. Every other offset in the recipe
is already logical (`marginInlineEnd`, `marginInlineStart`), so a physically
left-anchored bar would be the only exception.

Toast, whose treatment this matches, paints its bar physically on the left and
does not mirror. Aligning it is worth doing but belongs in its own change —
Toast's baselines and stories are not in scope here.
