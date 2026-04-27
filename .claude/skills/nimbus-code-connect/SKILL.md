---
description: Generate Figma Code Connect .figma.tsx files deterministically from Figma API data
argument-hint: [component-name] or run without args to process everything
---

# Generate Code Connect Skill

Generates `.figma.tsx` Code Connect files by fetching Figma component data,
classifying properties using codified rules, and writing files with string
templates. No LLM classification involved — output is 100% deterministic.

## Workflow

### Step 1: Collect Figma data

```bash
pnpm exec tsx .claude/skills/nimbus-code-connect/collect-figma-data.ts
```

Requires `FIGMA_ACCESS_TOKEN` in `.env` or environment. Fetches component sets
from the Figma API and writes `code-connect-data.json`.

### Step 2: Generate Code Connect files

```bash
# All components
pnpm exec tsx .claude/skills/nimbus-code-connect/generate-code-connect.ts

# Single component
pnpm exec tsx .claude/skills/nimbus-code-connect/generate-code-connect.ts button
```

This script:

1. Reads `code-connect-data.json`
2. Classifies each Figma property using codified rules (alias table, state
   decomposition, boolean detection, recipe variant matching)
3. Generates `.figma.tsx` files using string templates
4. Runs prettier on each file
5. Deletes the intermediate data file

### Step 3: Check for changes

```bash
git diff --stat
```

If there are no changes, the generated files are already up to date. Inform the
user and skip to Step 7 (Publish). Do not run validation or review steps when
there is nothing new to validate.

### Step 4: Validate

Run typecheck and lint to ensure all generated files are correct:

```bash
pnpm --filter @commercetools/nimbus typecheck
pnpm lint
```

If there are type errors, the most common causes are:

- A prop was included via `KNOWN_VALID_PROPS` but doesn't exist on that specific
  component → add the Figma prop name to `skipFigmaProps` in the component's
  override in `code-connect-constants.ts`
- A VARIANT value wasn't normalized correctly (e.g., "Outlined" → "outlined"
  instead of "outline") → add the mapping to `VALUE_NORMALIZATIONS` in
  `code-connect-constants.ts`
- A wrapper component has no recipe and the parent recipe wasn't resolved →
  check that the types file imports from the parent component directory

If there are lint errors:

- Unused `props` parameter → the `exampleJsx` override doesn't reference
  `props.` but the component has classified props. Either update the exampleJsx
  to use props, or the generation script should detect this automatically.

### Step 5: Verify NOTE accuracy

Check that all generated `// NOTE:` comments are accurate:

```bash
grep -rn "NOTE:" packages/nimbus/src/components/**/*.figma.tsx
```

Each NOTE claims a Figma prop was skipped because no matching code prop exists.
Verify by checking the component's `.types.ts` and `.recipe.ts` files. If a
NOTE is wrong (the prop actually exists), either:

- Add the prop name to `KNOWN_VALID_PROPS` if it's universally available
- Add it to the component's `typesProps` via the collect script
- Add a `rawProps` override in `code-connect-constants.ts`

### Step 6: Review changes

```bash
git diff
```

Present the diff to the user. The user reviews the actual code changes, not
LLM-generated summaries.

### Step 7: Parse (optional)

```bash
pnpx @figma/code-connect connect parse
```

This parses all Code Connect files and surfaces syntax or import errors.

### Step 8: Publish (optional)

Ask the user if they want to publish. If yes:

```bash
pnpx @figma/code-connect connect publish
```

## Architecture

```
collect-figma-data.ts    →  generate-code-connect.ts  →  .figma.tsx files
(fetch Figma API)           (rules + templates)           (deterministic)
```

### Classification rules (in generate-code-connect.ts)

| Rule                       | What it does                                                        |
| -------------------------- | ------------------------------------------------------------------- |
| **Alias table**            | Maps Figma names → code prop names (Tone→colorPalette, etc.)        |
| **State decomposition**    | Splits State VARIANT into individual booleans (Disabled→isDisabled) |
| **Visual-only skip**       | Drops Default, Hover, Focus, Pressed, Active state values           |
| **Visual boolean skip**    | Drops Figma-only booleans (Is focused, Show resize icon, etc.)      |
| **Boolean detection**      | YES/NO, On/Off, True/False VARIANTs → `figma.enum("X", {YES:true})` |
| **Boolean+Instance**       | Pairs BOOLEAN toggles with INSTANCE_SWAP slots                      |
| **Recipe matching**        | Matches VARIANT options against recipe variant values               |
| **Value normalization**    | Normalizes values when no recipe exists (Outlined→outline)          |
| **Known valid props**      | Trusts common inherited props (isDisabled, variant, size, etc.)     |
| **Parent recipe fallback** | Inherits recipe from parent component (icon-button→button)          |
| **Prop validation**        | Only emits props that exist in types, recipe, or known-valid set    |

### Constants (in code-connect-constants.ts)

All classification tables and overrides are in `code-connect-constants.ts`:

- `ALIAS_MAP` — Figma prop name → code prop name (trusted, bypasses validation)
- `SOFT_ALIAS_MAP` — Name translation only, still validated
- `VISUAL_STATE_VALUES` — State variant values to skip (hover, focus, etc.)
- `VISUAL_BOOLEAN_PROPS` — Boolean prop names to skip globally
- `STATE_BOOLEAN_MAP` — State values → boolean props (disabled→isDisabled)
- `VALUE_NORMALIZATIONS` — Fallback value transforms when no recipe exists
- `KNOWN_VALID_PROPS` — Props valid across most components via inheritance
- `OVERRIDES` — Per-component overrides for complex patterns

### Component overrides

Overrides are only needed for components with complex Figma→code mappings that
can't be auto-classified:

- **calendar**: Variant-specific connects to DatePicker, RangeCalendar,
  DateRangePicker
- **card**: Conditional JSX from Content type VARIANT; Root composes a single
  kebab-case `variant` value from three independent Figma boolean/enum props
  (Outlined / Elevated / Background)
- **combobox**: Variant-specific connects for single/multi-select
- **dialog, drawer**: Complex nested sub-component example JSX
- **form-field**: Boolean→sub-component JSX, variant connects for
  Error/Description
- **progress-bar**: Multi-prop extraction from Completeness
- **select**: Non-obvious value mappings (Solid→"outline")

Simple components (icon-button, split-button, password-input, etc.) should NOT
need overrides — their props are handled by recipe inheritance, value
normalization, and known-valid props. If you need to add an override for a
simple component, first check if the generic classification can be improved.
