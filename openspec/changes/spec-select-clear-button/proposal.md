# Proposal: Specify the Select clear button

## Why

`Select` has shipped a clear button since the `isClearable` prop was added, and
the `nimbus-select` capability has never described it. Across fifteen
requirements the button appears exactly once, as a subordinate clause inside
`Interactive States`:

> - **AND** SHALL disable the clear button so it cannot be used to remove the
>   selected value

So the disabled case is specified and nothing else is: not the prop, not its
default, not that the button appears only while a selection exists, not its
accessible name, not that pressing it must not open the listbox. `Select` is the
outlier here — `nimbus-search-input` has a dedicated `Clear Button` requirement,
and `nimbus-combobox` covers its own clear behaviour across several scenarios.

The gap has already cost something. `input-trailing-element-slot` replaced a
hardcoded 56px reserve that existed only to make room for this button, and there
was no requirement to check the change against; the reserve turned out to have
been unconditional for eleven months, applying even to `isClearable={false}`
fields that can never render the button. That was caught by eye in a Chromatic
diff rather than by a spec.

### Background

The prop's documented default and its actual default disagree.
`select.types.tsx` declares:

```
/**
 * Whether to show a clear button when a value is selected
 * @default false
 */
isClearable?: boolean;
```

while `select.root.tsx` destructures `isClearable = true`. Since `PropsTable`
extracts prop documentation from JSDoc, the published docs state a default the
component does not have. This proposal specifies the **implemented** behaviour
(`true`) and treats the JSDoc as a separate defect, because correcting it in the
other direction would be a breaking change and is a product decision rather than
a documentation one.

## What Changes

Add a `Clear Button` requirement to the `nimbus-select` capability describing
behaviour that already exists. No component code changes.

Every scenario below is taken from the implementation and verified in a browser
rather than inferred:

- Rendering is conditional on both `isClearable` and the presence of a selection
  (`select.clear-button.tsx` returns `null` when `state.selectedKey` is unset),
  so the button also disappears again once it has been used.
- The accessible name is the localized `Nimbus.Select.clearSelection` message,
  default "Clear selection", and `aria-labelledby=""` stops it inheriting the
  trigger's name.
- It is in the tab order at `tabIndex` 0, immediately after the trigger button.
- Activating it clears the selection and does **not** open the listbox — this is
  what `ClearPressResponder` is for.
- It is disabled when either `isDisabled` or `isLoading` is set, and disabled
  means non-operable rather than absent.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `nimbus-select`: adds a `Clear Button` requirement covering the `isClearable`
  prop, conditional rendering, accessible name, keyboard operability, the
  clearing interaction, and the disabled and loading states.

## Impact

**Specs**

- `openspec/specs/nimbus-select/spec.md` — one added requirement.

**Sequencing**

- Ships in the same pull request as `input-trailing-element-slot`, and after it.
  The `Clearing disabled` scenario states that no horizontal space is reserved
  for an absent clear button, which only becomes true once that change removes
  the reserve. Kept as a separate OpenSpec change because it is a separate
  concern with its own rationale, but there is nothing to gain from a separate
  pull request: it cannot merge first, and it carries no release risk to isolate.

**No impact**

- No component, recipe, type or i18n changes. No changeset: nothing a consumer
  sees or types changes, so there is nothing to release.
- The existing `Interactive States` requirement is left alone. Its clause about
  the disabled clear button remains correct and is not contradicted.

**Known defect this change deliberately does not fix**

- `isClearable`'s JSDoc says `@default false` while the implementation defaults
  to `true`, so the published props table is wrong. Specifying the implemented
  behaviour makes the contradiction explicit and reviewable; resolving it is its
  own change, since changing the default would be breaking.
