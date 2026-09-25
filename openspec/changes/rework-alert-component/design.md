## Design notes

Four decisions here are not obvious. Each is recorded with the alternative it
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

**Browser support.** `lh` is not new to Nimbus: List, Combobox, ListBox and
SkeletonText already use it without a fallback, and the repo has no
browserslist. A browser without `lh` drops the height; the slot then falls
back to `auto` and the grid's `alignItems: start` puts the icon at the top of
the first line — a few pixels off centre, but the layout holds.

### 2. Outline and accent bar as inset shadows, no border

**Problem.** `accent-start` needs a 4px bar on the leading edge and a 1px
outline, and changing variant must never reflow the box. A real border on
the card sits outside an inset shadow, so a bar drawn as a shadow reads as
1px of outline colour and then the bar, not a bar flush with the edge.

**Chosen.** No variant uses a CSS border. `outlined` draws its outline as
`inset 0 0 0 1px`, and `accent-start` lists the bar shadow before the outline
shadow, so the bar paints on top and sits flush with the edge. Shadows take
no layout space, so the box is identical in every variant. A story asserts
padding, corner radius and content offset across all of them.

**Rejected.** A reserved transparent border in `base` with the bar as a
shadow inside it: the bar then does not reach the edge. Also rejected:
`borderInlineStartWidth`, which shifts the content by the extra width.

**Padding lives in the variants.** An alert without `variant` gets only the
`base` styles and no default variant, so it keeps its earlier flush look.
Every variant applies the same padding, which keeps the shared box.

### 3. The bar follows the reading direction

`accent-start` is named for the logical edge, so a `_rtl` override mirrors the
bar to the right in right-to-left languages. Every other offset in the recipe
is already logical (`marginInlineEnd`, `marginInlineStart`), so a physically
left-anchored bar would be the only exception.

Toast, whose treatment this is close to, paints its bar physically on the
left and does not mirror. Aligning it is worth doing but belongs in its own
change — Toast's baselines and stories are not in scope here.

### 4. No `filled` variant

A filled surface needs every child — buttons, links, icons — to recolour for
contrast against it, and Alert cannot list every component a consumer might
place inside. Adding it waits for a general recolouring mechanism rather than
an Alert-only list.
