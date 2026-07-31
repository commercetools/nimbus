---
name: writing-stories
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

**The play requirement is per component, not per story.** Give a story its own
play when its name makes a behavioral claim, or when its snapshot needs an
interaction to exist (focus ring, opened overlay, scroll-fired sticky/overflow).
Do NOT add one when the claim is a resting visual props alone produce - the
snapshot and the always-on a11y check already test it. Never add a play for
completeness.

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

3. **Review** similar story implementations - patterns live outside
   `components/`, so search both:
   ```bash
   find packages/nimbus/src -name "*.stories.tsx"
   ```

**Conditionally, for a first-pass VRT audit only** - when you are deciding _which_
stories snapshot rather than writing one to a settled spec:

```bash
cat docs/chromatic-visual-testing.md
```

That doc is rationale and worked precedent, not instructions; it is ~5k tokens and
adds nothing for mechanical authoring. See
"Chromatic Snapshots: What Gets Captured" below for the specific calls that
warrant reading it. For CI behavior (triggers, baselines, gating) see
`docs/chromatic-ci.md` - never needed to author a story.

## Story Requirements by Component Type

You MUST determine which story types are needed based on component category. See
docs/file-type-guidelines/stories.md for the complete story type matrix and
decision flowchart.

Quick reference:

- **Simple components**: Base, Sizes, Variants, Disabled, plus `SmokeTest` **only
  if its axes interact** (see the SmokeTest section - independent axes get their
  own showcase stories instead)
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
8. **SmokeTest** - the interacting-axes matrix, last story. Omit it entirely when
   the axes are independent; don't substitute a cross-product that adds no
   coverage

## Create Mode

### Step 1: Component Analysis

**Start with the recipe. Read it, don't recall it.**

```bash
# .tsx as well as .ts; patterns live in src/patterns/, not src/components/
find packages/nimbus/src -path "*{component}*" -name "*.recipe.*"
```

Every VRT decision is derived from this file, so read it before deciding anything
about snapshots:

- **Every painting selector** - `_hover`, `_focusWithin`, `_disabled`, `_active`,
  `data-invalid`, `data-readonly`, `:has()`, and any comma-separated selector list
  (which counts once **per child type it names**).
- **Every `variant` / `size` / `colorPalette` key**, and any the recipe
  **hardcodes** - a pinned value was never an axis.
- **What it does _not_ style.** A state with no rule here renders identically to
  the default and gets no story of its own. If the recipe sets no color, border or
  spacing at all, the component gets no VRT (see "What Gets Captured").

Not every component has one - 70 do (61 `.ts` + 9 `.tsx`). Genuinely having none
is itself the answer for pass-through style primitives, so glob both extensions
before concluding a component has no recipe.

Then analyze:

- **The component source** - every conditional render or prop that changes what
  paints (e.g. `isDisabled={x || isReadOnly}`). Coverage is the cross-product of
  recipe states x conditional branches, not the recipe states alone.
- Component props and variants (drives `argTypes`)
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

**Give each distinctly-styled focusable sub-element its own `Focused` story, not
just the primary one** (a split button's dropdown trigger, an input's
stepper/clear button, a date field's calendar toggle) - each styles its own
`:focus-visible`, and since only one element holds focus per snapshot, one story
can't capture two rings. **Verify the ring actually renders before opting in** -
if it's styled on a slot that never gets the focus state (a non-focusable
indicator/track keyed off `data-focus` / `_focusWithin`), the snapshot captures
nothing (see DropZone).

**Text-entry inputs: hide the caret** so the focused snapshot is deterministic
(Chromatic can't pause the native caret blink). `caret-color` is inherited, so
one line on the canvas cascades to the input:

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

#### SmokeTest Story (only for interacting axes)

Pack the **interacting** axes your component actually has into one matrix:
iterate whichever of `sizes`, `variants`, `colorPalettes`, and
selected/unselected (toggles) apply, covering every combination that produces a
distinct visual. Content edge cases that change layout (long labels, icon +
text) can go here too.

**A matrix is only for interacting axes.** Build one only when a cross-cell is a
visual neither axis produces alone (checked × invalid → a distinct critical
fill). If the axes are **independent** - no novel cross-cell, one just
scales/recolors the other (`size × colorPalette`, `size × on/off`) - do **not**
build a matrix, even a small 2×2; snapshot each axis as its own showcase story
(`Sizes`, `ColorPalettes`, a states story). The cross-product adds cells, not
coverage. So not every component has a `SmokeTest` - components with only
independent axes (Avatar, Badge, Switch) use dedicated showcase snapshots
instead.

Don't fold in an axis that applies a uniform, axis-independent transform:
`disabled` resolves to one shared style regardless of palette/size/variant, so
capture it once in a dedicated `Disabled` story, not multiplied through the grid.
(Hover and pressed can't be forced from a play at all, so they're not matrix
axes either - see "What Gets Captured".)

**Span the full supported range, not a dev subset** - a trimmed or commented-out
axis (three sizes when the component has five) leaves those cells covered by
nothing. Palettes iterate the 6 `SEMANTIC_COLOR_PALETTES`; the `BRAND` (3) and
`SYSTEM` (25) palettes run the same token machinery and aren't snapshotted.

**An axis the recipe hardcodes isn't an axis** - full-range applies only to axes
the component varies. MultilineTextInput pins `colorPalette: "neutral"`, so its
matrix is `state x size x variant`, no palette axis. (Distinct from the uniform
transform above: `disabled` is a real axis folded out; a pinned palette was never
an axis.)

**Cover distinct state-combinations, not just single flags** - selected-disabled
is a separate look from unselected-disabled, so a `Disabled` story showing only
the unselected case leaves a gap.

**Thin wrappers get no matrix** - a component that only forwards a wrapped
component's props snapshots only the axis it introduces (+ `Focused`/`Disabled`
if added), not a re-render of the wrapped grid. FloatingActionButton wraps
IconButton at a fixed shape, so it snapshots `ColorPalettes` + `Focused` +
`Disabled` only - size/variant are IconButton's.

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

The **visual snapshot role**. Snapshots are **opt-in**: `preview.tsx` defaults to
`disableSnapshot: true`; a story opts in with `disableSnapshot: false` + `tags:
["vrt"]`. Chromatic reads only `disableSnapshot`; `vrt` is just a label so tooling
can find snapshot stories. Crop padding is global (a `preview.tsx` decorator wraps
non-`fullscreen` stories in `1rem`), so focus rings aren't clipped.

Four questions decide every snapshot call, then a fifth step packs the survivors:

1. **Does it paint?** Is there a component-owned pixel at all.
2. **Is the state reachable in this frame?** Inert props, zeroing variants,
   inherited values with nothing to inherit, hover/pressed.
3. **Who owns the pixels?** Delegation to children, consumers, thin wrappers,
   composition patterns.
4. **Does the play land the frame?** End state, blur, settled animation,
   determinism.
5. **Packing the surfaces into frames.** Into as few as the axes allow.

**The rules themselves live in `docs/file-type-guidelines/stories.md`** (its
"Chromatic Visual Regression Snapshots" section) - terse rules plus paste-ready
snippets, already loaded by Required Research. This skill's **Chromatic
Snapshots** validation checklist repeats them as checkboxes under the same five
headings, and is what you tick off when validating.

**Escalate to `docs/chromatic-visual-testing.md` only when a rule doesn't settle
the case** - it is ~5k tokens of rationale and worked examples, so don't load it
by default. Read it when you hit one of these, because each is a call the terse
rule states but cannot decide for you:

- **Does this state paint differently from the default?** Read-only is the
  classic - the answer is component-dependent (MoneyInput yes, TextInput no).
- **Do these two axes interact, or are they independent?** Decides `SmokeTest`
  matrix vs. separate showcase stories.
- **A recipe variant that zeroes the surface**, or an inherited property with
  nothing to inherit - the state is inert in the default frame.
- **One rule with a comma-separated selector list** - how many frames it needs.
- **A compound component with optional slots** - which arrangements are genuine
  surfaces rather than the same slots rearranged.
- **A focus ring possibly styled on a slot that never receives focus.**
- Any **"renders like default"** verdict you are about to write without having
  named the exact delta you checked.

Rule of thumb: **auditing** a component's coverage for the first time → read it.
**Authoring** a story into an already-audited component, or fixing a play → don't.

**When a VRT pattern changes, sync all three canonical docs at their set depth** -
rationale and worked examples in `docs/chromatic-visual-testing.md`;
`docs/file-type-guidelines/stories.md` gets the terse rule + snippet; this file
gets the checklist item, under the matching numbered heading. One statement per
depth - don't restate a rule at two depths, or they drift.

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
# components/ for a component; patterns/{group}/ for a pattern
pnpm test:dev $(find packages/nimbus/src -name "{component}.stories.tsx")
```

## Validate Mode

### Validation Checklist

You MUST validate against these requirements:

#### File Structure

- [ ] Story file location - `src/components/{name}/{name}.stories.tsx` for a
      component, `src/patterns/{group}/{name}/{name}.stories.tsx` for a pattern
      (groups: `buttons`, `actions`, `dialogs`, `fields`, `pages`)
- [ ] Imports from `@storybook/react-vite` and `storybook/test`
- [ ] Meta configuration with title, component, tags
- [ ] Default export of meta
- [ ] Story type from `StoryObj<typeof ComponentName>` (the component, not
      `typeof meta` - see note in `docs/file-type-guidelines/stories.md`)

#### Required Stories

- [ ] Base/Default story exists (MUST be first)
- [ ] Sizes story (if component has sizes)
- [ ] Variants story (if component has variants)
- [ ] Focused story (if component is focusable)
- [ ] Disabled story (for interactive components)
- [ ] Controlled story (for stateful components)
- [ ] SmokeTest story if the component has interacting axes (MUST be last); independent axes use dedicated showcase stories instead

#### Chromatic Snapshots

One line per check; the rule and its reasoning are in **Chromatic Snapshots: What
Gets Captured** above.

**1. Does it paint?**

- [ ] Surfaces enumerated from the **recipe + component source** (painting
      selectors, variant/size keys, conditional props, ambient RTL/locale/theme
      axes), and snapshots cover their **cross-product** - not recalled from memory
- [ ] Every child type a **comma-separated selector** names appears in some frame
- [ ] Diffed against **sibling components'** story sets; each surface a peer
      snapshots and this one doesn't is either covered or named as not applicable
- [ ] Any "renders like default" verdict **names the exact delta** checked
- [ ] A state with **no distinct recipe surface** gets no dedicated story
      (read-only with no `data-readonly` rule renders like default)
- [ ] **Primitives that paint no surface** get **no VRT at all**, with a one-line
      note on `meta` - pass-through style props, a recipe that paints nothing
      (Group), headless `display: contents` (Region). Check whether the recipe
      **paints**, not whether it exists (Separator and Icon get normal audits)

**2. Is the state reachable in this frame?**

- [ ] **Condition-triggered** states get a frame where the trigger actually holds:
      sticky scrolled in the play (bounded `overflow: auto` ancestor,
      `offsetHeight`-derived target, each combination its own frame),
      `scrollBehavior="inside"` given overflowing content, a variant-zeroed surface
      pinned to the variant that paints it, an inherited property given a value to
      inherit
- [ ] A **separate `Focused` story per independent focus surface** (fused/adjacent
      controls, or multiple `_focusWithin` regions) - not one story tabbing through
      all, since only one element holds focus per snapshot. Each opts in
- [ ] The focus **ring is confirmed to render** before opting in - not styled on a
      slot that never gets the focus state (DropZone)
- [ ] **Overlays** snapshot the **open** state (rendered open, left open); each
      distinct open surface is its own story; open/close & dismissal stay behavioral
- [ ] **Portal** components (Toast/overlays): transient UI held open
      (`duration: Infinity`), awaited, and cleaned up between stories; the
      component's own focus reached via its **real keyboard path**, not `.focus()`
- [ ] **`placement`** snapshotted only when it changes the **layout** (Drawer
      side/top/bottom panels), not a mere reposition (Dialog = center only;
      Menu/Tooltip RA-positioning = behavioral)
- [ ] No hand-rolled **hover/pressed** capture - a play can't force the
      pseudo-class, and setting `[data-hovered]`/`[data-pressed]` by hand
      half-styles the frame (recipes are split with Chakra `_hover`/`_active`).
      Pressed is not categorically a no-op - the recipe was checked. Everything
      else a play can drive is snapshotted settled

**3. Who owns the pixels?**

- [ ] Snapshotted stories render the component **directly** - no debug read-outs,
      value dumps, or demo-wrapper scaffolding in the frame. **Load-bearing,
      static** scaffolding is admissible and named as such
- [ ] **Thin wrappers** snapshot only the axis they introduce (+ `Focused`/`Disabled`
      if added), not a re-rendered copy of the wrapped component's matrix
- [ ] A **composition pattern** snapshots what it hardcodes, not what children paint
      or consumers pass
- [ ] A **`*Field` pattern** has exactly **two** snapshots, with every delegation
      named; `FormField.Input`'s `cloneElement` checked before calling a state
      un-forwarded
- [ ] For a **compound component with optional slots**, each frame names the recipe
      rule it alone fires (typically a `:has()` selector); plausible-but-duplicate
      compositions stay off-snapshot with a pointer to the frame that holds them
- [ ] A child **inheriting `colorPalette`** from its host is snapshotted per host

**4. Does the play land the frame?**

- [ ] Each snapshotted story's **play ends in the state the snapshot is named for** -
      no stray focus ring, cleared/mutated value, or left-open overlay unless
      intended. A play can be assertion-honest yet snapshot the wrong picture
- [ ] A story left focused by **`userEvent.click`** is blurred - React Aria keeps
      `data-focus-visible` set after a synthetic click
- [ ] No `No` verdict rests on the play's **end state**; snapshotted stories that end
      focused call `blur()`
- [ ] No `No` verdict rests on an assertion that tests **state instead of pixels** -
      `aria-*` values, callback arguments and attributes prove the state, not the
      rendered layout
- [ ] Every `step()` name matches what it asserts; where it overstated, the
      **assertion was raised to the name** (not the name lowered). No tautological
      assertions, no un-`await`ed async helpers
- [ ] No play added **for completeness** - each is there because the story's name
      makes a behavioral claim or its frame needs an interaction to exist
- [ ] Text-entry `Focused` plays hide the caret
      (`canvasElement.style.caretColor = "transparent"`) before tabbing
- [ ] **Determinism**: dates pinned to a fixed anchor (live "today" stays
      off-snapshot), no random values, async-derived state awaited
- [ ] **Animated** states: paused frame confirmed to show the target; if an infinite
      animation's endpoints both hide it (indeterminate progress), the play **pins** a
      representative frame (`animation: none` + explicit `transform`)

**5. Packing the surfaces into frames**

- [ ] `SmokeTest` matrix is **exhaustive** over the interacting axes the component
      has (e.g. size x variant x palette, plus selected/unselected for toggles)
- [ ] Axis arrays span the **full supported range** - no trimmed or commented-out
      values; palettes use the 6 `SEMANTIC_COLOR_PALETTES`
- [ ] Axes the recipe **hardcodes** are dropped from the grid (MultilineTextInput's
      neutral-only recipe gives `state x size x variant`)
- [ ] **Uniform, axis-independent** states are captured in a **dedicated** story, not
      folded into the matrix (`disabled` → its own `Disabled` snapshot)
- [ ] Distinct **state-combinations** are covered, not just single flags
      (selected-disabled is a separate look from unselected-disabled)
- [ ] Each state checked for being rendered **more than one way** (mode-/variant-
      driven); each distinct surface gets its **own** story, not a folded gallery
      (MoneyInput: `Focused` + `FocusedWithCurrencyLabel`)
- [ ] The interacting-axes matrix is named **`SmokeTest`** and rendered **last** (not
      `Variants`/`VariantsAndSizes`); the axis list lives in the doc comment
- [ ] Only behavior-only stories and stories whose look is already in `SmokeTest` left
      snapshot-off (project default) - never drop a visual state to save cost

#### Play Functions (CRITICAL)

- [ ] ALL interactive components have play functions
- [ ] Every `step()` name is **backed by its assertions** - if the name claims a
      behavior the checks don't prove, strengthen the checks to prove it; only
      rename/drop the claim when the behavior is genuinely another story's
      concern (and note where it's covered)
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
