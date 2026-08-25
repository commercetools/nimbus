## 1. SearchInput — leading + trailing (commit 1)

- [x] 1.1 Add `leadingElement?: ReactNode`, `trailingElement?: ReactNode` and `SearchInputTrailingElementSlotProps` to `search-input.types.ts`, with JSDoc mirroring the a11y guidance in `combobox.types.ts:656-672`
- [x] 1.2 Add `SearchInputTrailingElementSlot` (`"div"`, `"trailingElement"`) to `search-input.slots.tsx`, using the `SlotComponent<>` wrapper the file already uses
- [x] 1.3 Add `"trailingElement"` to the `slots` array in `search-input.recipe.ts` plus base and size-variant styles copied from `text-input.recipe.ts:46-50` and `:81-103`
- [x] 1.4 Relax `pointerEvents: "none"` on the leadingElement slot in `search-input.recipe.ts` so interactive leading content receives clicks
- [x] 1.5 In `search-input.tsx`, default the prop (`leadingElement = <Search />`) so `undefined` keeps the icon and `null` removes it, and render the trailing slot between the input and the clear `IconButton`
- [x] 1.6 Add a `LeadingAndTrailingElements` VRT story (matrix over size × variant, decorative-icon and `IconButton` cases) modelled on `text-input.stories.tsx:330-436`
- [x] 1.7 Add play-function stories: trailing element renders in its slot; an interactive trailing button fires its handler, is keyboard-reachable, does not clear the value, and does not steal focus to the input; `leadingElement={null}` renders no leading slot
- [x] 1.8 Add a usage example to `search-input.dev.mdx` and a copy-ready case to `search-input.docs.spec.tsx`
- [x] 1.9 Run `pnpm --filter @commercetools/nimbus typecheck:dev` and `pnpm test:storybook:dev packages/nimbus/src/components/search-input/search-input.stories.tsx`

## 2. ComboBox — trailing grid column (commit 2)

- [x] 2.1 Add `"trailingElement"` to the `slots` array in `combobox.recipe.ts:9-22`
- [x] 2.2 Widen the trigger grid at `combobox.recipe.ts:63-64` to `gridTemplateColumns: "auto 1fr auto auto auto"` and `gridTemplateAreas: '"leadingElement content trailingElement clear toggle"'`
- [x] 2.3 Add trailingElement base styles using `display: flex` with an explicit `gridArea: "trailingElement"` — not the `display: contents` used by the leading slot at `:51` — plus size variants alongside `:239-251`
- [x] 2.4 Add `trailingElement?: ReactNode` to the public root props (near `combobox.types.ts:672`) and to `ComboBoxRootContextValue` (near `:163`)
- [x] 2.5 Thread the prop through `combobox.root.tsx`: destructure at `:100`, add to `rootContextValue` at `:294` and to its dependency array at `:307`
- [x] 2.6 Add `ComboBoxTrailingElementSlot` to `combobox.slots.tsx`
- [x] 2.7 Create `components/combobox.trailing-element.tsx` mirroring `combobox.leading-element.tsx`, imported directly by the trigger (the leading part is not barrel-exported either)
- [x] 2.8 Render it in `combobox.trigger.tsx` after `ComboBoxContentSlot` (`:55-58`) and before the clear `IconButton` (`:59`)
- [x] 2.9 Add a `LayoutTrailingElement` VRT story modelled on `combobox.stories.tsx:829-850`, and a leading+trailing case
- [x] 2.10 Add play-function stories: trailing element renders in its slot; an interactive trailing button fires its handler, is keyboard-reachable, does not open the popover, and does not clear the input
- [x] 2.11 Add a usage example to `combobox.dev.mdx` and a copy-ready case to `combobox.docs.spec.tsx`
- [x] 2.12 Run `pnpm --filter @commercetools/nimbus typecheck:dev` and `pnpm test:storybook:dev packages/nimbus/src/components/combobox/combobox.stories.tsx`

## 3. Select — chrome moves to the container (commit 3, no API change)

- [x] 3.1 Change `SelectTriggerSlot` to `"div"` and add `SelectTriggerButtonSlot` (`"button"`, `"triggerButton"`) in `select.slots.tsx:30-34`
- [x] 3.2 Add `"triggerButton"` to the `slots` array in `select.recipe.tsx`
- [x] 3.3 Move border, background, height, `px`, `gap` and radius off `trigger` onto the field container; make `trigger` `display: flex; alignItems: center` with `_focusWithin: { layerStyle: "focusRing" }`, mirroring `combobox.recipe.ts:76-78`
- [x] 3.4 Style `triggerButton` as transparent, `flex: 1`, `minWidth: 0`, `focusRing: "none"`, inheriting text styles
- [x] 3.5 Delete `--button-safespace` and the `marginRight` on `triggerLabel` (`select.recipe.tsx:61-69`)
- [x] 3.6 Restructure `select.root.tsx`: `SelectTriggerSlot` (div) wraps `<RaButton>` holding `[leadingElement][triggerLabel]`, with clear button and chevron as normal-flow siblings; delete the absolutely-positioned overlay `Flex` (`:69-94`)
- [x] 3.7 Keep the trigger button first among the container's children so the 17 play steps resolving it via `select.querySelector("button")` (`select.stories.tsx:92`) still pass
- [x] 3.8 Point the popover at the field container by passing Popover's public `triggerRef` prop; React Aria both anchors to and measures that element, so it sets `--trigger-width` itself and no manual `useResizeObserver` is needed
- [x] 3.9 Leave `SelectClearButton` unchanged — its `ClearPressResponder` and `aria-labelledby=""` guards (`select.clear-button.tsx:28,34`) remain required
- [x] 3.10 Run `pnpm --filter @commercetools/nimbus build-theme-typings` after the slot changes
- [x] 3.11 Run `pnpm --filter @commercetools/nimbus typecheck:dev` and the full `pnpm test:storybook:dev packages/nimbus/src/components/select/select.stories.tsx` — all pre-existing stories must pass unmodified
- [x] 3.12 Compare against `main` in Storybook: overlay width and leading edge, focus ring around the whole field, click-to-open surface, disabled/invalid/loading/clearable states, RTL

## 4. Select — trailing element (commit 4)

- [x] 4.1 Add `trailingElement?: ReactNode` to `SelectProps` in `select.types.tsx`
- [x] 4.2 Add `SelectTrailingElementSlot` to `select.slots.tsx` and `"trailingElement"` to the recipe `slots` with base and size-variant styles
- [x] 4.3 Render the trailing slot in `select.root.tsx` between the `RaButton` and the clear button
- [x] 4.4 Add a `TrailingElement` VRT story modelled on `select.stories.tsx:1120-1195`, including a leading+trailing case and a long-value case proving the label truncates rather than overlapping
- [x] 4.5 Add play-function stories: an interactive trailing button fires its handler, is keyboard-reachable, does not open the listbox, does not change the selection, and does not inherit the trigger's accessible name
- [x] 4.6 Add a usage example to `select.dev.mdx` and a copy-ready case to `select.docs.spec.tsx`
- [x] 4.7 Run `pnpm --filter @commercetools/nimbus typecheck:dev` and `pnpm test:storybook:dev packages/nimbus/src/components/select/select.stories.tsx`

## 5. Close out

- [x] 5.1 Add a minor changeset per `docs/changeset-conventions.md`, noting the `nimbus-select__trigger` element change for consumers with CSS selectors targeting it
- [x] 5.2 Run `pnpm build:packages && pnpm typecheck:strict` and `pnpm lint`
- [x] 5.3 Open the PR against `main` with the four commits in order, and approve commit 3's Chromatic baselines before reviewing commit 4

## Notes

Two items were resolved more simply than planned:

- **2.7** — the leading-element part is imported directly by the trigger rather
  than barrel-exported, so the trailing part follows the same convention.
- **3.8** — `Popover` accepts a public `triggerRef` prop, and React Aria measures
  whatever element it is given to set `--trigger-width`. Passing the container
  ref therefore fixes both anchoring and width; no `PopoverContext` override or
  `useResizeObserver` was required.

Two problems surfaced during implementation that the design had not anticipated:

- Consumer-provided adornments inherited the field's React Aria contexts. In
  SearchInput a passed button picked up the clear button's props via
  `ButtonContext` (`tabindex="-1"`, clearing the field on press); in ComboBox the
  `slots`-based `ButtonContext` requires a `slot` prop a consumer cannot supply.
  Both are handled by a shared internal `AdornmentContent` util that clears the
  same context list ComboBox already clears for popover content.
- Select's `isClearable` recipe variant was dead code: `SelectRoot` destructures
  `isClearable` before `splitVariantProps`, so the recipe never received it. Its
  only effect was retuning `--button-safespace`, so it was removed with the
  reserve.
