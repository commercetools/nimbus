---
description: Generate Figma Code Connect .figma.tsx files from collected data by reading component sources and classifying Figma properties
argument-hint: [component-name] or "all" to process everything
---

# Generate Code Connect Skill

You are a Figma Code Connect specialist. This skill generates `.figma.tsx` files
by reading collected Figma data, component documentation, types, and recipes to
create accurate property mappings and meaningful examples.

## Step 0: Collect Figma Data

Run the collection script to fetch fresh data from the Figma API:

```bash
pnpm exec tsx .claude/skills/figma-code-connect/collect-figma-data.ts
```

This requires `FIGMA_ACCESS_TOKEN` in `.env` or the environment. The script
writes `.claude/skills/figma-code-connect/code-connect-data.json`.

## Input

The generated `code-connect-data.json` (colocated with this skill) contains
an array of entries. Each entry contains:

- `component`: Component name (e.g., "Button", "Select.Root")
- `dirName`: Component directory name
- `subComponent`: Sub-component name if applicable
- `figmaName`: Original Figma component set name
- `figmaUrl`: Full Figma URL for the component set
- `figmaNodeId`: Figma node ID
- `figmaProps`: All Figma properties with type info (VARIANT, BOOLEAN, TEXT,
  INSTANCE_SWAP)
- `codeMetadata`: Component code information including:
  - `exportName`: The exported component name
  - `isCompound`: Whether it's a compound component
  - `subComponents`: Sub-component keys (e.g., ["Root", "Header", "Content"])
  - `recipeVariants`: Recipe variant names and values
  - `typesProps`: Prop names from types file
  - `files`: Paths to types, recipe, devDocs, stories, mainComponent, and
    figmaOutput

If an argument is provided, filter to only process entries matching that
component name. Otherwise, process all entries.

## Generation Process

For each entry in the JSON:

### Step 1: Read Component Sources

Read the files listed in `codeMetadata.files` (types, recipe, dev docs, main
component) to understand the full API surface — prop names, recipe variant
values, usage patterns, and compound component structure.

### Step 2: Classify Every Figma Property

For each Figma property, classify it into one of these categories:

| Classification          | Action                                           | Example                                            |
| ----------------------- | ------------------------------------------------ | -------------------------------------------------- |
| **prop-mapping**        | Map to a code prop with `figma.xxx()`            | Figma "Size" → code `size` via `figma.enum()`      |
| **state-decomposition** | Extract booleans from State VARIANT              | State "Disabled" → `isDisabled` via `figma.enum()` |
| **composition**         | Use `figma.children("*")` or `figma.instance()`  | Nested components → children                       |
| **visual-only**         | Skip entirely (CSS states, Figma rendering only) | State: Default, Hover, Focused, Pressed            |

### Classification Guidelines

**Visual-only properties** (skip entirely — do NOT include in output):

- `State` values: Default, Hover, Focus/Focused, Pressed, Active — these are CSS
  states
- `Focused`/`Is focused` booleans — managed by browser focus
- Any property that only controls Figma's visual rendering state

**prop-mapping: VARIANT properties**

Match against recipe variants and types props using normalized name comparison:

1. Check recipe variants first (exact source of truth for enum values)
2. Check types props for non-recipe props
3. Use known aliases for common Figma→code name mismatches:
   - Disabled / Is Disabled → `isDisabled`
   - Invalid / Is Invalid → `isInvalid`
   - Selected / Is Selected / Toggled → `isSelected`
   - Loading / Is Loading → `isLoading`
   - Read only / Is Read Only → `isReadOnly`
   - Required / Is Required → `isRequired`
   - Tone / Color / ColorPalette → `colorPalette`
   - Label / Label text / Text → `children`
   - Left icon / Leading element → `leadingElement`
   - Right icon / Trailing element → `trailingElement`
   - Clear button → `isClearable`
   - Placeholder / Placeholder text → `placeholder`
   - Description / Helper text → `description`
   - Error message → `errorMessage`

For boolean-like VARIANTs (YES/NO, On/Off, True/False options) where the Figma
type is VARIANT (not BOOLEAN):
→ Use `figma.enum("PropName", { YES: true })`, NOT `figma.boolean()`

For enum VARIANTs with recipe values:
→ Use `figma.enum('PropName', { FigmaValue: "codeValue", ... })`
→ Always use exact recipe values (e.g., "outline" not "Outlined")

**Multi-prop extraction from a single VARIANT**

A single Figma VARIANT can map to **multiple** code props by using separate
`figma.enum()` calls that each extract different values. Example:

```tsx
// Figma "Completeness" has: "0%", "50%", "100%", "Indeterminate"
// → Extract isIndeterminate boolean from "Indeterminate"
// → Extract value number from percentage options
isIndeterminate: figma.enum("Completeness", { Indeterminate: true }),
value: figma.enum("Completeness", { "0%": 0, "50%": 50, "100%": 100 }),
```

**Conditional JSX via `figma.enum()` in props**

Code Connect examples are **not executed** — they are treated as string
templates. Ternaries (`? :`), `&&`, and `===` will appear **verbatim** in Dev
Mode, not evaluated. All conditional logic must live in the `props` mapping.

To conditionally render JSX based on a VARIANT, map variant values directly to
JSX nodes (or `undefined` for variants that shouldn't render):

```tsx
props: {
  header: figma.enum("Content type", {
    "Title + text": <Card.Header>Card Title</Card.Header>,
    // "Custom" is omitted → resolves to undefined → not rendered
  }),
  leadingElement: figma.enum("Content type", {
    "Leading element + text": figma.instance("Leading element"),
  }),
},
example: (props) => (
  <>
    {props.leadingElement}
    {props.header}
    <Card.Content>{props.children}</Card.Content>
  </>
),
```

**state-decomposition: State VARIANT**

When a "State" VARIANT contains values like "Disabled, Default, Hover, Focus,
Invalid, Loading, Selected":

1. Extract meaningful state values into individual boolean props
2. Use `figma.enum("State", { "Disabled": true })` for each
3. Skip visual states (Default, Hover, Focus, Pressed, Active)

**composition: INSTANCE_SWAP and children**

- INSTANCE_SWAP properties → `figma.instance('PropName')` — these represent
  slotted React nodes (icons, leading elements, etc.)
- When a component has nested sub-components with their own `figma.connect()`
  definitions → use `figma.children("*")`
- **IMPORTANT**: `figma.children("*")` only captures nested Figma component
  instances that have their own Code Connect definition. It does NOT capture
  plain layers or components without Code Connect.

**Compound component children pattern**

All compound/container components (Root-level components that nest other
connected sub-components) MUST include `figma.children("*")` in their props and
render `{props.children}` in the example. This ensures nested connected
components appear in Dev Mode output instead of an empty self-closing tag.

```tsx
// ✅ Correct — children rendered, shows nested structure
props: {
  size: figma.enum("Size", { md: "md", sm: "sm" }),
  children: figma.children("*"),
},
example: (props) => (
  <Component.Root size={props.size}>{props.children}</Component.Root>
),

// ❌ Wrong — self-closing, hides component structure
example: (props) => <Component.Root size={props.size} />,
```

**Instance swaps and static structural elements**

INSTANCE_SWAP properties representing configurable child components (not just
icons) should be rendered as children. Always include static sub-components that
are not Figma-configurable (e.g., Label in FormField, Body in Drawer) so
developers see the expected structure:

```tsx
// FormField: "Input type" swaps between TextInput, Select, etc.
// FormField.Label is always present (static structural element)
props: {
  input: figma.instance("Input type"),
  children: figma.children("*"),
},
example: (props) => (
  <FormField.Root>
    <FormField.Label>Label</FormField.Label>
    {props.input}
    {props.children}
  </FormField.Root>
),
```

**Variant-based sub-component selection**

When a single Figma component uses a VARIANT to switch between different code
sub-components, create separate `figma.connect()` calls for the same Figma node,
each with a `variant` discriminator:

```tsx
// "Message style" VARIANT with "Error" and "Help text" values
// → Two connects to the same Figma node, one per variant value

figma.connect(
  FormField.Error,
  "https://www.figma.com/design/...?node-id=2289-1115",
  {
    variant: { "Message style": "Error" },
    example: () => <FormField.Error>Error message</FormField.Error>,
  }
);

figma.connect(
  FormField.Description,
  "https://www.figma.com/design/...?node-id=2289-1115",
  {
    variant: { "Message style": "Help text" },
    example: () => <FormField.Description>Help text</FormField.Description>,
  }
);
```

**BOOLEAN visibility toggles for sub-components**

When a BOOLEAN property controls the visibility of a sub-component that is not
a separate Figma component set (i.e., it's a nested layer without its own
`figma.connect()`), use `figma.boolean()` with a mapping that conditionally
renders the sub-component JSX:

```tsx
props: {
  infoBox: figma.boolean("Info", {
    true: <FormField.InfoBox>Additional info</FormField.InfoBox>,
    false: undefined,
  }),
},
example: (props) => (
  <FormField.Root>
    <FormField.Label>Label</FormField.Label>
    {props.infoBox}
    {props.children}
  </FormField.Root>
),
```

**BOOLEAN properties (general)**

- Check if the boolean controls visibility of a slotted element → may map to a
  code prop
- Check types file for matching boolean props
- If no code equivalent exists, use `figma.boolean('PropName')` to capture the
  value and include it if it could be useful in the example

### Step 3: Generate the `.figma.tsx` File

Generate a complete `.figma.tsx` file for each component. The file should:

1. Import `figma` from `@figma/code-connect/react`
2. Import the component from its relative path
3. Include one `figma.connect()` call per entry (multiple for compound
   components)
4. Use meaningful examples that show real usage patterns

#### File Structure

```tsx
import figma from "@figma/code-connect/react";
import { ComponentName } from "./component-name";

// --- Figma Name → ComponentName.SubComponent ---
figma.connect(ComponentName.SubComponent, "https://www.figma.com/design/...", {
  props: {
    /* figma.enum(), figma.instance(), figma.children("*"), etc. */
  },
  example: (props) => (
    <ComponentName.SubComponent propName={props.propName}>
      {props.children}
    </ComponentName.SubComponent>
  ),
});
```

#### Example Guidelines

**Rule 1: NEVER use `{...props}` spread — always explicit prop names**

Every prop must be passed individually (even for simple 1-2 prop components)
so designers see exactly which React props correspond to which Figma properties:

```tsx
// ✅ Correct — every prop is visible
example: (props) => (
  <Button
    variant={props.variant}
    size={props.size}
    colorPalette={props.colorPalette}
    isDisabled={props.isDisabled}
  >
    {props.leadingElement}
    Button label
    {props.trailingElement}
  </Button>
),

// ❌ WRONG — hides prop names from designers
example: (props) => <Button {...props} />,
```

**Rule 2: Always include children/slot content**

Components that accept children must render meaningful content in the example.
Use the appropriate strategy based on the content type:

- **Text content**: Hardcode a representative label string
- **Icon slots**: Use `figma.boolean()` wrapping `figma.instance()` for
  conditional icons, render as children
- **Nested connected sub-components**: Use `figma.children("*")` and render
  `{props.children}`
- **Instance swap slots**: Use `figma.instance()` and render in the appropriate
  position

```tsx
// Icon buttons: icon as children + required aria-label
example: (props) => (
  <IconButton
    aria-label="Action"
    variant={props.variant}
    size={props.size}
  >
    {props.icon}
  </IconButton>
),

// Buttons with optional icons: conditional icon rendering around text
props: {
  leadingElement: figma.boolean("Left icon", {
    true: figma.instance("→ Icon Left"),
    false: undefined,
  }),
  trailingElement: figma.boolean("Right icon", {
    true: figma.instance("→ Icon right"),
    false: undefined,
  }),
},
example: (props) => (
  <Button variant={props.variant} size={props.size}>
    {props.leadingElement}
    Button label
    {props.trailingElement}
  </Button>
),

// Components with label children (Switch, Tag, RadioInput.Option)
example: (props) => (
  <Switch isSelected={props.isSelected} size={props.size}>
    Label
  </Switch>
),

// Compound containers: children for nested connected components
example: (props) => (
  <Select.Root variant={props.variant} size={props.size}>
    <Select.Options>{/* Option items */}</Select.Options>
  </Select.Root>
),
```

**Rule 3: Components requiring `aria-label` must include it**

If a component's types make `aria-label` required (e.g., `IconButton`,
`IconToggleButton`, `SplitButton`), always include a representative
`aria-label` in the example.

### Step 3.5: Add Variant-Specific Examples

After generating the main `figma.connect()` call (which uses dynamic prop
mappings), evaluate whether the component benefits from **additional**
variant-constrained connects that show specific usage patterns.

**When to add variant-specific examples:**

- The component has a Figma VARIANT property with 3+ values that map to
  meaningfully different usage patterns (e.g., Alert tones, Toast variants,
  Dialog types)
- The different variants have different composition structures (e.g., Destructive
  dialog vs Text dialog)
- The variant represents a mode switch (e.g., single-select vs multi-select
  ComboBox, date vs date-range Calendar)

**When NOT to add variant-specific examples:**

- The variant only changes visual styling (e.g., size variants — sm/md/lg)
- The variant is already clearly communicated by the prop mapping in the main
  connect
- The component is a simple leaf component with no composition differences
  between variants

**Pattern: Tone/color variants with contextual content**

For components like Alert and Toast where different tones imply different
content:

```tsx
// Main connect — dynamic, covers all tones
figma.connect(Alert.Root, FIGMA_URL, {
  props: {
    colorPalette: figma.enum("Tone", {
      Critical: "critical",
      Info: "info",
      Warning: "warning",
      Positive: "positive",
    }),
    variant: figma.enum("Variant", { Outlined: "outlined", Ghost: "flat" }),
  },
  example: (props) => (
    <Alert.Root colorPalette={props.colorPalette} variant={props.variant}>
      Alert message
    </Alert.Root>
  ),
});

// Variant-specific — shows realistic content for one tone (repeat per tone)
figma.connect(Alert.Root, FIGMA_URL, {
  variant: { Tone: "Critical" },
  example: () => (
    <Alert.Root colorPalette="critical" variant="outlined">
      Something went wrong. Please try again.
    </Alert.Root>
  ),
});
```

**Pattern: Mode/composition variants with different structure**

For components where a variant changes the component structure (mode switches,
content layouts like Dialog Text vs Destructive, single vs multi-select):

```tsx
// Single-select combobox
figma.connect(ComboBox.Root, FIGMA_URL, {
  variant: { "Multi-select": "NO" },
  example: () => (
    <ComboBox.Root selectionMode="single">
      <ComboBox.Trigger />
      <ComboBox.ListBox />
    </ComboBox.Root>
  ),
});

// Multi-select combobox
figma.connect(ComboBox.Root, FIGMA_URL, {
  variant: { "Multi-select": "YES" },
  example: () => (
    <ComboBox.Root selectionMode="multiple">
      <ComboBox.Trigger />
      <ComboBox.ListBox />
    </ComboBox.Root>
  ),
});
```

**Key rules for variant-specific examples:**

- Always keep the main generic `figma.connect()` — variant-specific ones are
  additions, not replacements
- Variant-specific examples use **static content** (no `figma.xxx()` props) —
  they show a fixed pattern for that variant
- Use the Figma VARIANT property name and value as-is in the `variant` object
  (e.g., `{ Tone: "Critical" }`, not `{ colorPalette: "critical" }`)
- Include realistic placeholder text that matches the variant's purpose

### Step 4: Format and Validate

After generating:

1. Run `pnpm exec prettier --write` on the generated file
2. Verify the file has no TypeScript errors by checking imports exist

## Output Format

After processing, summarize changes per component:

```
Component: Button
  - Props mapped: variant, size, colorPalette, isDisabled (from State)
  - Composition: icon (instance), children
  - Skipped visual-only: State (Default, Hover, Focus, Pressed)
  - File written: packages/nimbus/src/components/button/button.figma.tsx
```

## Important Rules

- NEVER guess prop names — always verify against the types file and recipe
- NEVER add props that don't exist on the component's public API
- **colorPalette values MUST be lowercase** — Figma uses "Primary", "Critical"
  etc. but code uses "primary", "critical"
- **Strip `#NNN:NN` suffixes** — Figma property names in `code-connect-data.json`
  include internal IDs (e.g., `"Clear button#274:0"`). Strip the `#` suffix when
  writing `figma.xxx()` calls (e.g., `"Clear button"`)
- Generate files from scratch — do not try to edit existing .figma.tsx files
- Process one component at a time for accuracy
- Validate with `pnpm exec figma connect publish --dry-run` after generating
- After all components are processed, delete the intermediate data file:
  `rm .claude/skills/figma-code-connect/code-connect-data.json`
