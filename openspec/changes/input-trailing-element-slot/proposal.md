## Why

Consumers need to place custom elements — icons, buttons, filters — at the trailing edge of a field, most concretely an inline filter button inside a search input. Today only TextInput, NumberInput, DateInput and TimeInput expose `trailingElement`; ComboBox, Select and SearchInput do not.

That gap was deliberate. PR #327 (`b7dd6bc7d`, Craft-1657) gave ComboBox and Select a **leading element only**, and left SearchInput's search icon hardcoded. The design view has since changed, and — critically — the new requirement includes *interactive* trailing content, which the original decision never had to accommodate.

Interactivity is what makes this more than adding a slot in three places. ComboBox and SearchInput both already put their field chrome on a non-interactive container, so an interactive sibling is valid there. Select does not: its whole field **is** the React Aria `<button>`, so a button in a trailing slot would be nested interactive content. Nimbus already pays for that structure — the clear button it added on top of React Aria's Select has to live in an absolutely-positioned overlay with a hand-computed `--button-safespace` reserve the recipe itself labels "*Magic*", plus two React Aria escape hatches (`ClearPressResponder`, `aria-labelledby=""`) just to coexist with the trigger. Adding a second interactive sibling to that structure would compound the workaround rather than use it.

## What Changes

- **`trailingElement?: ReactNode`** on ComboBox (`ComboBox.Root`), Select (`Select.Root`) and SearchInput, rendered after the input content and before each component's own affordances (clear button, dropdown toggle).
- **`leadingElement?: ReactNode`** on SearchInput, which has no such prop today. It defaults to the current `<Search />` icon, so `undefined` preserves existing rendering and explicit `null` removes the icon.
- **Select's chrome moves from the trigger `<button>` to its container**, converging Select onto the structural model ComboBox and SearchInput already use: a non-interactive container carrying border/background/height/padding and the focus ring via `_focusWithin`, with the value button, trailing element, clear button and chevron as normal-flow siblings. This *deletes* the `--button-safespace` reserve rather than extending it, and makes an interactive trailing element valid.
- **A non-clearable field stops reserving space for a clear button.** The reserve being deleted was unconditional in practice, so `isClearable={false}` fields lose roughly 24px of dead width. That is a fix, and it changes how MoneyInput, ScopedSearchInput and Pagination render without any change to their own code.
- Stories (visual-regression matrices plus play-function coverage of interactive trailing content) and developer documentation for all three.

Select's **prop** API is unchanged by the restructure — no props added, removed or retyped. Slot *components* are not exported, so the element change is not a consumer surface. Slot *prop types* are, via `export * from "./select.types"`, so `SelectTriggerSlotProps` does change from `HTMLChakraProps<"button">` to `HTMLChakraProps<"div">`; nothing exported accepts that type, so it is an incidental export rather than a supported one.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `nimbus-combobox`: adds a `trailingElement` requirement and extends the multi-slot recipe requirement with a `trailingElement` slot.
- `nimbus-select`: adds a `trailingElement` requirement, extends the slot recipe with `trailingElement` and `triggerButton`, and restates the trigger-structure requirement so the field container rather than the button owns the chrome and the focus ring.
- `nimbus-search-input`: adds `leadingElement` (defaulting to the search icon) and `trailingElement` requirements, and extends the slot recipe with a `trailingElement` slot.

## Impact

**Components**

- `packages/nimbus/src/components/search-input/` — types, slots, recipe, main component, stories, docs
- `packages/nimbus/src/components/combobox/` — types, slots, recipe, root, trigger, new trailing-element part, stories, docs
- `packages/nimbus/src/components/select/` — types, slots, recipe, root, stories, docs

**Behavioral surface**

- Select's generated `nimbus-select__trigger` class moves from a `<button>` element to a `<div>`. Slot classes are not a published surface, so this is deliberately **not** in the changeset — documenting a migration path would legitimise targeting another component's internals. It is recorded in the PR description instead.
- Select's popover width and left edge must not shift. React Aria measures the element it is given, so the popover is re-pointed at the field container. (Implemented with `Popover`'s public `triggerRef` prop rather than the `PopoverContext` override assumed here — see the notes in `tasks.md`.)
- Chromatic baselines for Select churn as a result of the restructure. The restructure is committed separately from the feature so those baselines are reviewed on their own.

**No impact**

- No i18n messages — all trailing/leading content is consumer-provided.
- No Figma Code Connect changes — the existing `.figma.tsx` files do not map leading or trailing props.
- No dependency changes.
