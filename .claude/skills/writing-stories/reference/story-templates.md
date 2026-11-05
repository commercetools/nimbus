# Story Templates

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
fill). `compoundVariants` over two axes is the recipe declaring exactly that -
build the matrix. If the axes are **independent** - no novel cross-cell, one just
scales/recolors the other (`size × colorPalette`, `size × on/off`) - do **not**
build a matrix, even a small 2×2; snapshot each axis as its own showcase story
(`Sizes`, `ColorPalettes`, a states story). The cross-product adds cells, not
coverage. So not every component has a `SmokeTest` - components with only
independent axes (Avatar, Badge, Switch) use dedicated showcase snapshots
instead.

(Hover and pressed can't be forced from a play at all, so they're not matrix
axes either - see "What Gets Captured".)

**Span the recipe's live keys, not a dev subset** - an array that trims a value
the recipe still ships (three sizes when the component has five) leaves those
cells covered by nothing. Mirroring one the recipe itself comments out is fine:
Button's `sizes` omits `lg` and `2xl` because the recipe does. A component with
no recipe of its own takes the range of the one it borrows - IconButton has none
and extends `ButtonProps`, so Button's live keys are its supported range. A
value the recipe **hardcodes** collapses the axis entirely: MultilineTextInput
pins `colorPalette: "neutral"`, so its matrix is `state x size x variant`.

**Palette scope depends on which frame you're in.** As a matrix **axis**,
palettes iterate `SEMANTIC_COLOR_PALETTES` - the `BRAND` and `SYSTEM` sets run
the same token machinery and would multiply every cell for no new coverage. A
standalone **`ColorPalettes` showcase** is a single frame however many swatches
it holds, so it uses the shared `DisplayColorPalettes` helper (`@/utils`), which
renders all three groups labelled.

**Cover distinct state-combinations, not just single flags** - selected-disabled
is a separate look from unselected-disabled, so a `Disabled` story showing only
the unselected case leaves a gap.

**`disabled` folds out of the grid only while what it dims is uniform** - it
normally resolves to one shared style regardless of palette/size/variant, so a
dedicated `Disabled` story captures it once instead of every cell rendering at
half opacity. Once another state repaints that surface (a tinted
`[data-selected]`), the combination goes back in the matrix.

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
