## Why

Alert has two defects and one gap next to its sibling component.

**The icon and the dismiss button sit about 2px above the centre of the first
line of text.** Both are placed from a fixed pixel offset rather than from the
type around them, so the misalignment is visible at the default size and gets
worse the moment an alert is given a different `fontSize` — the boxes stay put
while the text moves. It is most obvious on a description long enough to wrap,
where the icon should stay on the first line and instead drifts toward the
middle of the paragraph.

**An alert always interrupts, and cannot be told not to.** `Alert.Root`
hardcodes `role="alert"` and applies it *after* the prop spread, so a consumer
who passes `role` is silently overridden. Assertive is right for a payment
failure and wrong for the confirmations, hints and status messages that make
up most Alert usage — those should wait for a pause rather than cut across a
screen reader mid-sentence. Today there is no way to choose.

**Alert cannot be made to look like Toast.** Both components exist to draw
attention, but through different mechanisms: Alert is inline and stays until
dismissed, Toast is transient and floats above the page. Because the mechanism
differs, the appearance does not have to — and sometimes it should not differ
either. Toast has shipped `accent-start` for a while: a neutral card with a
status-coloured bar on the leading edge. Alert has no equivalent, so a product
surface that wants its inline and transient feedback to read as one family
cannot have that. It also leaves a page carrying several alerts with nothing
but tinted cards, which stack up into a colour chart.

Alongside these, a few smaller gaps: a hand-maintained exclusion on the
`colorPalette` type, no way to supply or suppress the icon, and no control over
which element the title and description render as.

## What changes

**`variant="accent-start"`** — a neutral card where the reading surface and
the text stay out of the way, and the status colour is carried by the leading
bar, the icon and the buttons in `Alert.Actions`. The dismiss button stays
neutral, being chrome rather than an action. It is the same treatment Toast uses, so
the two components can be matched where a surface wants them to look alike.
Teams that want the opposite can still pick a different variant per alert, or
re-default the whole surface, because the axis stays open.

**The icon and dismiss boxes are derived from the type cascade.** Each is one
text line tall and centres its contents, and the icon glyph is sized in `em`,
so both track the alert's own line height and font size instead of a pixel
constant. `Alert.Title` takes the alert's font size and line height rather
than a fixed `Heading` size, which is what makes the icon and the title agree
at any size.

**`role` follows the palette and becomes overridable.** `critical` keeps
`role="alert"`, so the messages that were meant to interrupt still do. Every
other palette defaults to `role="status"`: polite is right for confirmations,
hints and notices. Any `role` the consumer passes wins — a non-critical alert
that must interrupt passes `role="alert"`, and one that should not announce at
all passes `role="group"`.

**Smaller additions**, each closing one of the gaps above:

- `colorPalette` widens to the full semantic set. `neutral` and `primary`
  were excluded by hand while the other four were allowed, with nothing in
  the component to justify the split. Accepting the whole set removes a
  special case rather than adding one, and matches `Button`, whose
  `colorPalette` is the same type. Both gain an icon so the leading column is
  consistent across the set — `Campaign` for `primary`, which suits the
  announcement and new-feature messages it is for, and `Article` for
  `neutral`. Unlike the four severity glyphs, these are decorative: there is
  no severity for them to reinforce, so they are a matter of tone rather than
  an affordance against relying on colour alone.
- `Alert.Icon` as a public slot, and `hideIcon` to suppress the icon entirely.
- `as` on `Alert.Title` and `Alert.Description`, so a persistent alert can
  promote its title to a real heading at the level the page needs.
- `outlined` becomes the explicit default. An alert with no `variant` today
  renders with no surface at all, which is never what the caller wanted.

**A spacing pass.** Horizontal padding moves from 8px to 12px while vertical
stays at 8px. With padding and the internal gap both at 8px the icon sat as
far from the border as from its own text, so it read as attached to the edge
rather than as part of the message; the box padding now exceeds the gap inside
it. The title and description tighten up, and `Alert.Actions` lays its
children out as a spaced row rather than leaving them flush together.

## Capabilities

### New Capabilities

None. Everything here is a change to the existing `nimbus-alert` capability.

### Modified Capabilities

- `nimbus-alert`: adds the `accent-start` variant and its containment and
  reading-direction rules; specifies the icon and dismiss boxes against the
  type cascade rather than fixed pixels; makes announcement politeness follow
  the palette (assertive for `critical`, polite otherwise) and overridable;
  makes the icon slot public and
  suppressible; and gives the title and description element control.

## Impact

**Components**

`packages/nimbus/src/components/alert/` — recipe, types, root and the five
part components, slots, i18n, stories, docs spec, Figma Code Connect mapping,
and the `.mdx` / `.dev.mdx` / `.guidelines.mdx` / `.a11y.mdx` documentation.

**Consumers**

- **Action required:** every non-`critical` alert becomes polite. One that
  must still interrupt the user needs an explicit `role="alert"`. Nothing
  errors — the screen reader simply stops interrupting — so this will not
  surface through tests. `critical` alerts keep interrupting.
- `variant="flat"` gains the shared padding and a transparent border, so
  alerts that relied on it sitting flush with their container need
  `padding="0"`.
- An alert with no `variant` now renders the `outlined` card instead of
  nothing.
- Alerts are a little wider inside and a little shorter, so surrounding
  layouts may shift.
- `variant="outlined"` is unchanged in name, meaning and rendering.

**Accessibility**

The politeness default is the substantive change and is covered above. The
story matrices run with the contrast checks enabled, so the new variant is
verified rather than exempt.

**Visual regression**

Every Alert baseline changes: the matrices gain an `accent-start` column, and
the icon alignment and glyph scaling shift every frame that contains an icon.

**No impact**

No dependency changes. No change to the public component namespace beyond the
additions listed above.
