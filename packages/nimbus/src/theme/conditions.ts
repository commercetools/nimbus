import { defineConditions } from "@chakra-ui/react/styled-system";

/**
 * Custom conditions for React Aria Components state management
 * Maps Chakra UI pseudo-selectors to React Aria data attributes
 */
export const conditions = defineConditions({
  /**
   * Maps to React Aria's open state data attributes
   * Used for animations when a component is opening/entering
   */
  open: "&:is([data-entering], [data-open])",

  /**
   * Maps to React Aria's closed state data attributes
   * Used for animations when a component is closing/exiting
   */
  closed: "&:is([data-exiting], [data-closed])",

  /**
   * Overrides Chakra's default `hover` condition to strip ALL of its specificity.
   *
   * Chakra ships `hover` as
   *   ["@media (hover: hover)", "&:is(:hover, [data-hover]):not(:disabled, [data-disabled])"]
   * whose selector is (0,3,0): `&` (one class) plus the `:is()` and `:not()`
   * groups, each contributing (0,1,0). That is HIGHER than a plain state selector
   * like `&[data-selected]` (0,2,0), so `_hover` would beat `_pressed`/`_selected`
   * regardless of source order.
   *
   * Wrapping BOTH groups in `:where()` (specificity 0) drops the selector to
   * (0,1,0) — just the `&` recipe class — without dropping the
   * `@media (hover: hover)` gate. Hover thus becomes the weakest interaction
   * state: any state selector carrying a single data-attribute (`&[data-pressed]`,
   * `&[data-selected]`, `&[data-focused]`, …) is (0,2,0) and outranks it with no
   * artificial boost. The trade-off is that hover no longer carries the `:not()`
   * specificity point either, so where a recipe layers hover against an
   * equally-specific resting selector on the same element, precedence falls to
   * source order (hover is authored last) rather than specificity.
   *
   * The positive match also includes React Aria's `[data-hovered]` (set by
   * `useHover`) alongside native `:hover` and Chakra's `[data-hover]`, so RAC
   * components can use `_hover` uniformly instead of a raw `&[data-hovered]`.
   */
  hover: [
    "@media (hover: hover)",
    "&:where(:hover, [data-hover], [data-hovered]):where(:not(:disabled, [data-disabled]))",
  ],

  /**
   * Maps to React Aria's pressed state (held-down active press).
   *
   * Bare (0,2,0) — the `&` recipe class plus one state attribute — which is
   * enough to beat the neutralized `_hover` (0,1,0) on its own. No `&&` / no
   * `[data-react-aria-pressable]` guard is needed for specificity anymore; the
   * `&` already scopes the rule to this recipe's element, and React Aria only
   * sets `data-pressed` on pressable elements.
   */
  pressed: "&[data-pressed='true']",
  /**
   * Maps to React Aria's `data-selected` AND ARIA's `aria-selected`.
   *
   * Two arms in one `:is()`:
   *  - `[aria-selected='true']` — the only selection signal the primitive
   *    `Table` exposes. That component has no `data-selected` wiring; a consumer
   *    marks a selected row with `aria-selected` on the `<tr>`, and `table`'s
   *    `row._selected` style depends on this arm. It mirrors Chakra's built-in
   *    `selected` and must not be dropped (an earlier version of this override
   *    did, which silently killed the Table's selected-row style).
   *  - `[data-selected='true']` — React Aria's data attribute (ToggleButton,
   *    GridList rows, …).
   *
   * `:is()` takes the specificity of its most specific argument, so both arms
   * together are (0,1,0); with the `&` recipe class the selector is (0,2,0) —
   * matching `pressed` and beating the neutralized `_hover` (0,1,0) with no
   * boost, and staying below the Tabs `[data-animated] &[data-selected]`
   * suppression (0,3,0).
   *
   * The `='true'` on `data-selected` is deliberate: `Switch` and `Checkbox`
   * render `data-selected="false"` when off, so a bare `[data-selected]` would
   * match their unselected state. (`aria-selected` is only ever `true`/`false`,
   * so its quoting is just for symmetry.)
   */
  selected: "&:is([aria-selected='true'], [data-selected='true'])",
});
