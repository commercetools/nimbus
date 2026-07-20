---
description:
  Create, update, or validate Storybook stories with comprehensive play
  functions
argument-hint: create|update|validate ComponentName [details]
---

# Writing Stories Skill

You are a Nimbus story specialist. This skill helps you create, update, or
validate Storybook stories (`*.stories.tsx`) with comprehensive play functions
for testing component behavior.

## Critical Requirements

**Stories are BOTH documentation AND tests.** Every interactive component MUST
have play functions that test user interactions, state changes, and
accessibility.

### A story's three testing roles

A story is documentation and a test at once, and it can serve three roles, often
simultaneously (not as separate stories):

- **Interaction test** - the play function drives the component and asserts
  behavior (clicks, typing, keyboard nav, resulting ARIA/DOM state).
- **Visual snapshot** - Chromatic captures the story's end state and diffs it
  against the baseline (opt-in via `disableSnapshot: false`).
- **Accessibility check** - axe and the APCA contrast check run on every story
  via `addon-a11y` and **fail the run** on a violation (`test: "error"`); play
  functions may add targeted a11y assertions on top.

Unit tests of utilities and hooks live in `*.spec.tsx`, and consumer examples in
`*.docs.spec.tsx` - separate test categories, not story roles.

Whichever role(s) a story serves, it MUST be:

- **Concise** - the minimal setup to exercise one thing.
- **Deterministic** - identical output every run: no live dates or random values
  in a snapshot, wait for async-derived state before the capture, don't leave a
  stray focus ring.
- **True to its name** - it does exactly what its title says and nothing more.
  `Focused` tests focus, `Disabled` shows the disabled look, `SmokeTest` is the
  matrix, `WithRef` asserts ref forwarding. One job per story.

## Mode Detection

Parse the request to determine the operation:

- **create** - Generate new story file with complete test coverage
- **update** - Add stories, enhance play functions, or modify existing tests
- **validate** - Check story compliance with guidelines and test coverage

If no mode is specified, default to **create**.

## Required Research (All Modes)

Before implementation, you MUST research in parallel:

1. **Read** story guidelines and type matrix:

   ```bash
   cat docs/file-type-guidelines/stories.md
   ```

2. **Analyze** component characteristics to determine story type

3. **Review** similar story implementations:
   ```bash
   ls packages/nimbus/src/components/*/*.stories.tsx
   ```

## Story Requirements by Component Type

You MUST determine which story types are needed based on component category. See
docs/file-type-guidelines/stories.md for the complete story type matrix and
decision flowchart.

Quick reference:

- **Simple components**: Base, Sizes, Variants, Disabled, SmokeTest
- **Form components**: Add Required, Invalid, Controlled stories
- **Interactive components**: Add KeyboardNavigation, Controlled stories
- **Portal components**: Add Placement, Dismissal stories with special portal
  testing patterns

## File Structure

### Story File Template

```typescript
import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, waitFor, fn } from "storybook/test";
import { ComponentName } from "@commercetools/nimbus";

const meta: Meta<typeof ComponentName> = {
  title: "Components/ComponentName", // StartCase, organized by category
  component: ComponentName,
  parameters: {
    layout: "centered", // or "fullscreen", "padded"
  },
  tags: ["autodocs"],
  argTypes: {
    // Define controls for props
    variant: {
      control: { type: "select" },
      options: ["solid", "outline", "ghost"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

// Stories follow below...
```

### Story Organization (REQUIRED)

Stories MUST be exported in this order:

1. **Base/Default** - Simplest usage, first story
2. **Sizes** - Size variants (if applicable)
3. **Variants** - Visual variants (if applicable)
4. **Focused** - Focus state (if applicable)
5. **States** - Disabled, Invalid, Required, etc.
6. **Controlled** - Controlled state example
7. **Complex** - Advanced scenarios, edge cases
8. **SmokeTest** - Comprehensive matrix (last story)

## Create Mode

### Step 1: Component Analysis

You MUST analyze:

- Component props and variants
- Interactive behavior (click, type, keyboard nav)
- State management (controlled vs uncontrolled)
- Portal content (overlays, dropdowns)
- Accessibility requirements

### Step 2: Story Templates

#### Base Story (REQUIRED)

```typescript
export const Base: Story = {
  args: {
    children: "Button",
    onPress: fn(),
    ["data-testid"]: "test",
    ["aria-label"]: "test-button",
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const element = canvas.getByTestId("test");

    await step("Test description of what's being tested", async () => {
      await expect(element).toBeInTheDocument();
      // Test specific behavior
    });

    await step("Test interaction", async () => {
      await userEvent.click(element);
      await expect(args.onPress).toHaveBeenCalledTimes(1);
    });

    await step("Test keyboard accessibility", async () => {
      await userEvent.tab();
      await expect(element).toHaveFocus();
      await userEvent.keyboard("{Enter}");
      await expect(args.onPress).toHaveBeenCalledTimes(2);
    });
  },
};
```

#### Sizes Story (REQUIRED if component has sizes)

```typescript
const sizes: ComponentProps["size"][] = ["sm", "md", "lg"];

export const Sizes: Story = {
  args: {
    children: "Demo",
  },
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {sizes.map((size) => (
          <ComponentName key={size} {...args} size={size} />
        ))}
      </Stack>
    );
  },
};
```

#### Variants Story (REQUIRED if component has variants)

```typescript
const variants: ComponentProps["variant"][] = ["solid", "outline", "ghost"];

export const Variants: Story = {
  args: {
    children: "Demo",
  },
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {variants.map((variant) => (
          <ComponentName key={variant} {...args} variant={variant} />
        ))}
      </Stack>
    );
  },
};
```

#### Focused Story (if applicable)

Captures the keyboard-focus state, which no other story renders:

```typescript
export const Focused: Story = {
  tags: ["vrt"],
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  args: {/* minimal render */},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole("button")).toHaveFocus();
  },
};
```

**Capture the ring on every distinctly-styled focusable sub-element, not just
the primary one.** A split button's dropdown trigger, an input's clear button or
stepper, and a date field's calendar toggle each style their own
`:focus-visible` and each need to be tabbed to and snapshotted - a `Focused`
story that stops at the first focusable leaves the others untested.

**Text-entry inputs: hide the caret in the `Focused` play function.** Focusing a
text input paints the browser's blinking caret, which Chromatic can't pause (it's
neither a CSS nor a JS animation). Set `canvasElement.style.caretColor =
"transparent"` before tabbing - `caret-color` is inherited, so it cascades to the
input and the focused snapshot stays deterministic. We scope this to the story
rather than editing the shared `preview.tsx`. See docs/chromatic-visual-testing.md.

```typescript
play: async ({ canvasElement }) => {
  canvasElement.style.caretColor = "transparent"; // deterministic focused snapshot
  await userEvent.tab();
  await expect(/* the input */).toHaveFocus();
},
```

#### Disabled Story (REQUIRED for interactive components)

```typescript
export const Disabled: Story = {
  args: {
    isDisabled: true,
    ["data-testid"]: "test",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const element = canvas.getByTestId("test");

    await step("Cannot be clicked", async () => {
      await userEvent.click(element);
      // Verify no action occurred
    });

    await step("Cannot be focused", async () => {
      await userEvent.tab();
      await expect(element).not.toHaveFocus();
    });
  },
};
```

#### Controlled Story (REQUIRED for stateful components)

```typescript
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("");

    return (
      <Stack gap="400">
        <ComponentName value={value} onChange={setValue} />
        <Text data-testid="value-display">Current value: {value}</Text>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");
    const valueDisplay = canvas.getByTestId("value-display");

    await step("Updates controlled value", async () => {
      await userEvent.type(input, "Hello");
      await expect(input).toHaveValue("Hello");
      await expect(valueDisplay).toHaveTextContent("Current value: Hello");
    });
  },
};
```

#### SmokeTest Story (REQUIRED)

Pack the **interacting** axes your component actually has into one matrix:
iterate whichever of `sizes`, `variants`, `colorPalettes`, and
selected/unselected (toggles) apply, covering every combination that produces a
distinct visual. Content edge cases that change layout (long labels, icon +
text) can go here too.

Don't fold in an axis that applies a uniform, axis-independent transform. When
`disabled` resolves to one shared style regardless of palette/size/variant,
capture it once in a dedicated `Disabled` story (see below) rather than
multiplying it through the grid. (`:hover` and `:active`/pressed can't be
captured as static states - see the note under "What Gets Captured".)

**Axes must span the full supported range, not a dev subset.** A trimmed axis
array is the most common regression-hiding mistake: snapshotting `md/sm` when the
component supports five sizes, or three palettes when it supports six, leaves
those cells covered by nothing. A commented-out axis value is a red flag. Scope
call: matrices iterate the 6 `SEMANTIC_COLOR_PALETTES` as the representative set;
the `BRAND` (3) and `SYSTEM` (25) palettes a consumer can also pass run the same
token machinery and are deliberately not snapshotted.

**An axis the recipe hardcodes isn't an axis.** Full-range applies only to the
axes the component actually varies. If a recipe pins one to a single value, drop
it from the grid - MultilineTextInput hardcodes `colorPalette: "neutral"`, so its
matrix is `state x size x variant` with no palette axis. Different from the
uniform-transform case above (`disabled` is a real axis folded out for adding no
signal); a hardcoded palette was never an axis to begin with.

**Cover distinct state-combinations, not just single flags.** When a component
has multiple boolean states (selected, disabled, invalid, read-only), each
combination that renders differently needs coverage. Selected-disabled is
visually distinct from unselected-disabled, so a `Disabled` story showing only
the unselected case leaves a gap.

**Thin wrappers get no matrix.** A component that only constrains or forwards a
wrapped component's props (a fixed-shape variant, a field wrapper) re-covers
nothing by re-rendering the wrapped grid. Snapshot only the axis the wrapper
introduces, plus `Focused`/`Disabled` if it adds them. FloatingActionButton wraps
IconButton with a fixed circular shape, so it snapshots only `ColorPalettes` +
`Focused` + `Disabled`, not a size x variant matrix - those are IconButton's
states, already covered there.

```typescript
export const SmokeTest: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  args: {
    children: "Demo",
    ["data-testid"]: "test",
  },
  render: (args) => {
    return (
      <Stack gap="600">
        {sizes.map((size) => (
          <Stack key={size} direction="row" gap="400">
            {variants.map((variant) => (
              <ComponentName
                key={variant}
                {...args}
                size={size}
                variant={variant}
              />
            ))}
          </Stack>
        ))}
      </Stack>
    );
  },
};
```

### Chromatic Snapshots: What Gets Captured

This is the **visual snapshot role**. Snapshots are **opt-in**:
`.storybook/preview.tsx` sets `chromatic: { disableSnapshot: true }` as the
project default, so Chromatic captures a story only when it sets
`disableSnapshot: false`.

**Cover every visual state that can differ.** Anything that changes rendered
pixels is worth a snapshot: sizes, variants, color palettes,
selected/unselected, focus rings, disabled/invalid/read-only states, empty vs
filled content, long text and truncation, icon + text layouts, RTL, and open
overlays (tooltip/popover/menu). Capture them economically: pack the
**interacting** axes into one `SmokeTest` matrix (one snapshot for every
combination that produces a distinct look), and give a dedicated story to each
state the matrix can't or shouldn't hold (`Focused`, `Disabled`, an open
popover). Cost is controlled by TurboSnap (unchanged snapshots bill at 1/5) and
by matrix-packing - **never** by omitting a visual state.

**Leave snapshots off** for stories that add no new visual state: behavior-only
tests (e.g. `WithRef`, context/DOM-prop assertions) and showcase stories whose
look is already captured by an on-snapshot story. That's a redundant baseline,
not missing coverage - but only when the capturing snapshot truly holds every
state the showcase renders (a `ColorPalettes` story with a disabled column needs
`Disabled` to cover that column). Verify per component; don't assume.

**Prefer one matrix over many individual snapshots.** A single matrix render is
one billable snapshot instead of one per combination, and a reviewer spots
cross-axis regressions in a single image. Tradeoff: a diff in any cell flags the
whole snapshot, and editing the matrix re-snapshots the entire grid (Chromatic
can't sub-diff within one image). Reserve standalone snapshots for states that
need distinct setup or isolated review.

**But a state can render more than one way - one story each, not a gallery
frame.** Matrix-packing is for axes that _interact_. It is not license to fold
_independent_ surfaces of a single state into one render. Before assuming a
single `Focused` / `Disabled` / `ReadOnly` / `Invalid` story covers a state,
check whether the component renders that state more than one way (mode- or
variant-driven); if so, each distinct recipe surface gets its own snapshotted
story. MoneyInput carries `Focused` + `FocusedWithCurrencyLabel` and
`DisabledState` + `DisabledWithCurrencyLabel` (dropdown vs. `currencies={[]}`
label mode) rather than one folded frame apiece - independent surfaces don't
interact, so a shared frame only trades away their independent baselines and
per-surface triage. Chromatic's idiom is discrete stories, one meaningful state
each, independently baselined; count is not a performance concern (it
parallelizes) and TurboSnap keeps an extra stable story near free. Modes
(`chromatic.modes`) are for _global_ config only (viewport, theme, locale), so a
mode is never the answer to two prop-driven surfaces.

**A state with no distinct surface gets no story.** The flip side of the rule
above: if the recipe has no rule for a state, it renders identically to the
default and a dedicated story is a redundant baseline, not coverage. Read-only is
the component-dependent trap - MoneyInput styles it distinctly (`ReadOnlyState`),
but MultilineTextInput has no `data-readonly` rule, so read-only looks like the
default and correctly gets no snapshot.

**Snapshot the component, not the harness.** Chromatic photographs the story's
whole rendered output, so a snapshotted story must render the component
**directly** - no debug read-outs, value dumps, or controls scaffolding in the
frame. A stateful demo wrapper (MoneyInput's `MoneyInputExample` renders a
`JSON.stringify(value)` panel beside the input) is fine on un-snapshotted
behavioral stories, but snapshotting one bakes the read-out into the baseline and
flaps it on every value change. Keep those wrappers on the behavioral stories;
render the bare component in the ones you snapshot.

**Determinism matters most for snapshots.** A snapshot must render identically
every run or it diffs on noise: don't bake in live dates or random values, wait
for async-derived state (image load, data fetch) before the capture, and don't
leave a stray focus ring on an unrelated story. A focused text input paints the
browser's blinking caret, which Chromatic can't pause (it's neither a CSS nor a
JS animation) - hide it in the `Focused` play function with
`canvasElement.style.caretColor = "transparent"`. Some visual states can't be
captured statically yet (notably `:hover` and `:active`/pressed); see the
Chromatic doc for the current gaps.

The snapshot switch is `disableSnapshot`, not `vrt`. Chromatic captures based on
`disableSnapshot` alone and never reads `vrt`; the tag is just a **label** that
marks a story as a visual-regression case so tooling can find and select it.
`disableSnapshot: false` is what takes the picture.

See docs/chromatic-visual-testing.md for the full rationale, CI details, and the
current hover/pressed limitation.

**When a VRT pattern changes, sync all three canonical docs.** Any change to a
Chromatic/VRT convention (a new opt-in state, a matrix rule, or a determinism fix
like `caret-color: transparent` for focused text inputs) must land in all three
places at once, or they drift:

1. `docs/chromatic-visual-testing.md` — the how/why guide + best practices.
2. `docs/file-type-guidelines/stories.md` — the "Chromatic Visual Regression
   Snapshots" section.
3. `.claude/skills/writing-stories/SKILL.md` (this file) — the `SmokeTest` /
   `Focused` templates, the "what gets captured" blurb, and the checklist.

### Step 3: Portal Content Handling

For components that render portal content (Dialog, Menu, Popover, Select):

```typescript
export const PortalExample: Story = {
  play: async ({ canvasElement, step }) => {
    // CRITICAL: Use parent element to capture portal content
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Open portal content", async () => {
      const trigger = canvas.getByRole("button");
      await userEvent.click(trigger);

      // Wait for portal content to appear
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });
    });
  },
};
```

## Play Function Patterns (CRITICAL)

### Structure Requirements

You MUST use this structure:

```typescript
play: async ({ canvasElement, args, step }) => {
  const canvas = within(canvasElement); // or parent for portals

  await step("Descriptive test name", async () => {
    // Test implementation
  });

  await step("Next test", async () => {
    // Test implementation
  });
};
```

### Query Strategy

**Prefer accessible queries (in order of preference):**

1. `canvas.getByRole()` - BEST for interactive elements
2. `canvas.getByLabelText()` - BEST for form inputs
3. `canvas.getByTestId()` - Use sparingly for non-interactive elements
4. `document.querySelector()` - ONLY for portal content when necessary

### Interaction Patterns

#### Click Testing

```typescript
await step("Test click interaction", async () => {
  const button = canvas.getByRole("button");
  await userEvent.click(button);
  await expect(args.onClick).toHaveBeenCalledTimes(1);
});
```

#### Typing Testing

```typescript
await step("Test text input", async () => {
  const input = canvas.getByRole("textbox");
  await userEvent.type(input, "Test value");
  await expect(input).toHaveValue("Test value");

  await userEvent.clear(input);
  await expect(input).toHaveValue("");
});
```

#### Keyboard Navigation

```typescript
await step("Test keyboard navigation", async () => {
  const element = canvas.getByRole("button");

  // Tab to focus
  await userEvent.tab();
  await expect(element).toHaveFocus();

  // Enter to activate
  await userEvent.keyboard("{Enter}");
  await expect(args.onPress).toHaveBeenCalled();

  // Space to activate
  await userEvent.keyboard(" ");
  await expect(args.onPress).toHaveBeenCalledTimes(2);
});
```

#### Arrow Key Navigation (Menu, Select, etc.)

```typescript
await step("Test arrow key navigation", async () => {
  // Navigate down
  await userEvent.keyboard("{ArrowDown}");
  await waitFor(() => {
    const secondItem = canvas.getByRole("menuitem", { name: /Item 2/ });
    expect(secondItem).toHaveFocus();
  });

  // Navigate up
  await userEvent.keyboard("{ArrowUp}");
  await waitFor(() => {
    const firstItem = canvas.getByRole("menuitem", { name: /Item 1/ });
    expect(firstItem).toHaveFocus();
  });
});
```

#### Async Operations

```typescript
await step("Test async state changes", async () => {
  await userEvent.click(triggerButton);

  // Wait for async content to appear
  await waitFor(() => {
    expect(canvas.getByText("Loaded content")).toBeInTheDocument();
  });
});
```

### Accessibility Testing

You MUST test these accessibility features:

```typescript
await step("Test ARIA attributes", async () => {
  const element = canvas.getByRole("button");

  // Required attribute
  await expect(element).toHaveAttribute("aria-label", "Close");

  // Disabled state
  await expect(element).toHaveAttribute("aria-disabled", "true");

  // Invalid state
  await expect(element).toHaveAttribute("data-invalid", "true");
});

await step("Test focus management", async () => {
  // Initial focus
  const firstButton = canvas.getByRole("button", { name: "First" });
  await userEvent.tab();
  await expect(firstButton).toHaveFocus();

  // Focus restoration after dialog close
  await userEvent.keyboard("{Escape}");
  await waitFor(
    () => {
      expect(firstButton).toHaveFocus();
    },
    { timeout: 1000 }
  );
});
```

### State Verification

```typescript
await step("Verify state changes", async () => {
  const checkbox = canvas.getByRole("checkbox");

  // Initial state
  await expect(checkbox).not.toBeChecked();

  // After interaction
  await userEvent.click(checkbox);
  await expect(checkbox).toBeChecked();

  // Visual indication (data attributes)
  await expect(checkbox).toHaveAttribute("data-selected");
});
```

## Common Testing Patterns by Component Type

### Form Inputs (TextInput, Select, Checkbox)

**MUST test:**

- Initial render and attributes
- Focus with Tab
- Type/input value
- Clear value
- Required state (aria-required)
- Disabled state (cannot focus, cannot input)
- Invalid state (can still interact, has data-invalid)
- Controlled state synchronization

### Buttons (Button, IconButton, ToggleButton)

**MUST test:**

- Click interaction
- Focus with Tab
- Keyboard activation (Enter, Space)
- Disabled state (cannot focus, cannot activate)
- Visual variants render correctly

### Overlays (Dialog, Menu, Popover)

**MUST test:**

- Open via trigger
- Portal content appears (use parent element)
- Keyboard navigation inside overlay
- Escape key dismissal
- Focus restoration to trigger
- Backdrop click (if dismissable)

### Navigation (Pagination, Tabs)

**MUST test:**

- Navigation between items
- Keyboard navigation (Arrow keys, Home, End)
- Current item indication
- Disabled navigation buttons at boundaries
- Input validation (for direct input components)

### Selection (RadioGroup, CheckboxGroup, Select)

**MUST test:**

- Single selection (radio) - only one selected
- Multiple selection (checkbox) - multiple selected
- Selection change callbacks
- Keyboard selection (Space, Enter)
- Disabled options cannot be selected

## Update Mode

### Process

1. You MUST read the current story file
2. You MUST identify gaps in test coverage
3. You SHOULD preserve existing story structure
4. You MUST add missing required stories
5. You MUST enhance play functions with missing tests

### Common Updates

- **Add missing story** - Base, Disabled, Controlled, etc.
- **Enhance play function** - Add keyboard nav, accessibility tests
- **Add edge cases** - Boundary conditions, error states
- **Fix failing tests** - Update assertions, fix async timing

### Post-Update

You MUST verify the changes:

```bash
pnpm test:dev packages/nimbus/src/components/{component}/{component}.stories.tsx
```

## Validate Mode

### Validation Checklist

You MUST validate against these requirements:

#### File Structure

- [ ] Story file location:
      `packages/nimbus/src/components/{component}/{component}.stories.tsx`
- [ ] Imports from `@storybook/react-vite` and `storybook/test`
- [ ] Meta configuration with title, component, tags
- [ ] Default export of meta
- [ ] Story type from `StoryObj<typeof ComponentName>` (the component, not
      `typeof meta` — see note in `docs/file-type-guidelines/stories.md`)

#### Required Stories

- [ ] Base/Default story exists (MUST be first)
- [ ] Sizes story (if component has sizes)
- [ ] Variants story (if component has variants)
- [ ] Focused story (if component is focusable)
- [ ] Disabled story (for interactive components)
- [ ] Controlled story (for stateful components)
- [ ] SmokeTest story (MUST be last)

#### Chromatic Snapshots

- [ ] `SmokeTest` matrix is **exhaustive** over the interacting axes the
      component has (e.g. size x variant x palette, plus selected/unselected for
      toggles) - every distinct combined look appears in the one snapshot
- [ ] Axis arrays span the **full supported range** - no trimmed or
      commented-out values; palettes use the 6 `SEMANTIC_COLOR_PALETTES`
- [ ] Axes the recipe **hardcodes** are dropped from the grid (a pinned
      `colorPalette` is not a palette axis - MultilineTextInput's neutral-only
      recipe gives `state x size x variant`)
- [ ] Distinct **state-combinations** are covered, not just single flags
      (selected-disabled is a separate look from unselected-disabled)
- [ ] For each state (focus, disabled, read-only, invalid), checked whether the
      component renders it more than one way (mode-/variant-driven); each distinct
      surface gets its **own** snapshotted story, not a folded gallery frame
      (MoneyInput: `Focused` + `FocusedWithCurrencyLabel`, `DisabledState` +
      `DisabledWithCurrencyLabel`)
- [ ] A state with **no distinct recipe surface** gets no dedicated story
      (read-only with no `data-readonly` rule renders like default - no snapshot)
- [ ] Snapshotted stories render the component **directly** - no debug read-outs,
      value dumps, or demo-wrapper scaffolding in the frame (those stay on the
      un-snapshotted behavioral stories)
- [ ] Uniform, axis-independent states are captured in a **dedicated** story,
      not folded into the matrix (`disabled` typically resolves to one shared
      style regardless of size/variant/palette → its own `Disabled` snapshot, not
      a grid dimension)
- [ ] Thin wrappers snapshot only the axis they introduce (+ `Focused`/`Disabled`
      if added), not a re-rendered copy of the wrapped component's matrix
- [ ] `Focused` story captures the focus ring (`disableSnapshot: false` + `vrt`);
      for text-entry inputs the play function hides the blinking caret with
      `canvasElement.style.caretColor = "transparent"` before tabbing
      on **every** distinctly-styled focusable sub-element, not just the primary
- [ ] Visual-state stories opt in via `disableSnapshot: false` + `tags: ["vrt"]`
- [ ] Only behavior-only stories and stories whose look is already in `SmokeTest`
      left snapshot-off (project default) - never drop a visual state to save cost

#### Play Functions (CRITICAL)

- [ ] ALL interactive components have play functions
- [ ] Uses `step()` for test organization
- [ ] Uses `within()` for scoped queries
- [ ] Uses `waitFor()` for async operations
- [ ] Tests keyboard navigation (Tab, Enter, Space, Arrows)
- [ ] Tests accessibility attributes (aria-_, data-_)
- [ ] Tests state changes and synchronization
- [ ] Tests disabled states (cannot focus, cannot interact)
- [ ] Tests edge cases and boundaries

#### Query Strategy

- [ ] Prefers `getByRole()` for interactive elements
- [ ] Uses `getByLabelText()` for form inputs
- [ ] Uses `getByTestId()` sparingly
- [ ] Portal content uses parent element access
- [ ] No hardcoded selectors without good reason

#### Test Coverage

- [ ] Initial render verified
- [ ] Focus management tested
- [ ] Click/press interactions tested
- [ ] Keyboard interactions tested
- [ ] State synchronization tested
- [ ] Async operations use waitFor
- [ ] Accessibility requirements verified

#### Story Organization

- [ ] Stories in prescribed order
- [ ] Clear, descriptive story names
- [ ] Consistent args usage
- [ ] Proper use of render function for variants

### Validation Report Format

```markdown
## Story Validation: {ComponentName}

### Status: [✅ PASS | ❌ FAIL | ⚠️ WARNING]

### Files Reviewed

- Story file: `{component}.stories.tsx`
- Guidelines: `docs/file-type-guidelines/stories.md`

### ✅ Compliant

[List passing checks]

### ❌ Violations (MUST FIX)

- [Violation with guideline reference and line number]

### ⚠️ Warnings (SHOULD FIX)

- [Non-critical improvements]

### Test Coverage

- Required Stories: [X/Y present]
- Play Functions: [X/Y stories have tests]
- Interaction Testing: [Complete | Partial | Missing]
- Accessibility Testing: [Complete | Partial | Missing]

### Recommendations

- [Specific improvements needed]
```

## Error Recovery

If tests fail:

1. You MUST check test syntax (async/await, expect calls)
2. You MUST verify element queries match actual DOM
3. You MUST check timing (use waitFor for async)
4. You MUST verify portal content uses parent element
5. You SHOULD add debugging steps (`console.log`, `screen.debug()`)

Common issues:

- Missing `waitFor()` for async operations
- Wrong query selectors
- Portal content not accessible (need parent element)
- Timing issues (interactions too fast)
- Missing `await` on async operations

## Clean Testing Patterns

You MUST follow the clean testing patterns documented in:

- **Storybook patterns**:
  `docs/file-type-guidelines/stories.md#clean-testing-patterns-storybook`
- **JSDOM patterns**:
  `docs/file-type-guidelines/unit-testing.md#clean-testing-patterns-jsdom`

Key requirements:

- Add `key` props when mapping arrays in render functions
- Use `userEvent.tab()` for focus management (not `element.focus()`)
- Await all `step()` calls including nested ones
- Add timing delays for React Aria keyboard sequences
- Provide `aria-label` for components without visible labels
- Initialize controlled inputs with defined values

## Reference Examples

You SHOULD reference these stories:

- **Simple**: `packages/nimbus/src/components/button/button.stories.tsx`
- **Form**: `packages/nimbus/src/components/text-input/text-input.stories.tsx`
- **Overlay**: `packages/nimbus/src/components/menu/menu.stories.tsx`
- **Complex**: `packages/nimbus/src/components/dialog/dialog.stories.tsx`
- **Selection**: `packages/nimbus/src/components/select/select.stories.tsx`

## RFC 2119 Key Words

- **MUST** / **REQUIRED** / **SHALL** - Absolute requirement
- **MUST NOT** / **SHALL NOT** - Absolute prohibition
- **SHOULD** / **RECOMMENDED** - Should do unless valid reason not to
- **SHOULD NOT** / **NOT RECOMMENDED** - Should not do unless valid reason
- **MAY** / **OPTIONAL** - Truly optional

---

**Execute story operation for: $ARGUMENTS**
