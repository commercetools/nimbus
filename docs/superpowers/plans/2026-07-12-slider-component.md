# Slider + RangeSlider Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two accessible Nimbus components — `Slider` (single value) and
`RangeSlider` (two-thumb min–max range) — wrapping React Aria Components'
`Slider` primitive with a shared internal implementation.

**Architecture:** Two thin public wrappers (`Slider`, `RangeSlider`) render one
shared internal `SliderBase`. `SliderBase` owns the slot recipe, React Aria
wiring, orientation, the per-thumb value tooltip, ticks, and thumb rendering.
React Aria's `<SliderFill>` auto-fills start→thumb (single) or thumb↔thumb
(range), so the only real single-vs-range difference is the value type and thumb
count. The design spec lives at
`docs/superpowers/specs/2026-07-12-slider-component-design.md`.

**Tech Stack:** React 19, TypeScript, `react-aria-components` (`Slider`,
`SliderTrack`, `SliderThumb`, `SliderFill`), Nimbus `Tooltip` (per-thumb value
readout), Chakra UI v3 slot recipes, Storybook play-function tests,
`@internationalized/string` i18n.

## Global Constraints

- **Branch:** all work lands on `feat/slider-component` (already checked out).
- **Chakra imports:** modular subpaths only — `@chakra-ui/react/styled-system`,
  never the `@chakra-ui/react` barrel.
- **Recipe key:** `nimbusSlider` (must be a valid JS identifier; registered in
  `src/theme/slot-recipes/index.ts`).
- **Recipe className:** `nimbus-slider`.
- **Directory:** both components live in
  `packages/nimbus/src/components/slider/` (single directory; no separate
  `range-slider/`).
- **Value types:** `Slider` value is `number`; `RangeSlider` value is
  `[number, number]`. Never expose a `number | number[]` union on a public
  component.
- **TDD loop:** run tests against source with `pnpm test:storybook:dev <file>`
  (no build needed). Do NOT use `pnpm test` (that needs a build).
- **Dev typecheck:** `pnpm --filter @commercetools/nimbus typecheck:dev`
  (resolves to source; matches the editor).
- **Cross-component imports:** import from implementation files (e.g.
  `./slider.recipe`), not barrels.
- **Every interactive component MUST have play-function tests** (project rule).
- **Commit** after every green step (Conventional Commits, e.g.
  `feat(slider): ...`).

---

## Design revision — value tooltip (2026-07-12, authoritative)

After Task 1 was committed, the design changed. This revision supersedes any
conflicting detail below:

- **No `label` prop and no visible label.** The accessible name comes from
  `aria-label` / `aria-labelledby` (standalone) or `FormField.Label`. The Slider
  renders no visible label element.
- **No static value output / `SliderOutput`.** The current value is shown in a
  **per-thumb tooltip** (Nimbus `Tooltip`) that is open while the thumb is
  **hovered, keyboard-focused, or being dragged**
  (`isOpen = isHovered || isFocused || state.isThumbDragging(index)`). Content
  is `state.getThumbValueLabel(index)` (honors `formatOptions`). Each
  `RangeSlider` thumb has its own tooltip.
- **Slots are `root`, `track`, `fill`, `thumb`, `tick`, `tickLabel`** — the
  `label` and `output` slots that Task 1 committed are removed in Task 2,
  Step 0.
- Task 1's recipe/types/slots code blocks below are the AS-BUILT (pre-revision)
  version; Task 2, Step 0 reconciles them. Everything from Task 2 onward
  reflects the revised design.

---

### Task 1: Foundation — recipe, slots, types, registration

Creates the renderable skeleton: the `nimbusSlider` slot recipe, slot components
wrapping React Aria primitives, the type definitions, and global registration.
No behavior yet. Gate = types + theme typings compile.

**Files:**

- Create: `packages/nimbus/src/components/slider/slider.recipe.ts`
- Create: `packages/nimbus/src/components/slider/slider.types.ts`
- Create: `packages/nimbus/src/components/slider/slider.slots.tsx`
- Create: `packages/nimbus/src/components/slider/index.ts`
- Modify: `packages/nimbus/src/theme/slot-recipes/index.ts` (register recipe)
- Modify: `packages/nimbus/src/components/index.ts` (barrel export)

**Interfaces:**

- Produces: `sliderSlotRecipe`; slot components `SliderRootSlot`,
  `SliderLabelSlot`, `SliderOutputSlot`, `SliderTrackSlot`, `SliderFillSlot`,
  `SliderThumbSlot`, `SliderTickSlot`, `SliderTickLabelSlot`; types
  `SliderProps`, `RangeSliderProps`, `SliderBaseProps`, and the `*SlotProps`
  types.

- [ ] **Step 1: Write the recipe**

Create `slider.recipe.ts`:

```ts
import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe for the Slider / RangeSlider components.
 * Slots map onto the React Aria Slider anatomy. Sizes and orientation are
 * variants; the fill length/position is applied by React Aria's SliderFill,
 * so the recipe only styles appearance, not fill geometry.
 */
export const sliderSlotRecipe = defineSlotRecipe({
  className: "nimbus-slider",
  slots: [
    "root",
    "label",
    "output",
    "track",
    "fill",
    "thumb",
    "tick",
    "tickLabel",
  ],
  base: {
    root: {
      colorPalette: "primary",
      display: "grid",
      gridTemplateAreas: `"label output" "track track"`,
      gridTemplateColumns: "1fr auto",
      alignItems: "center",
      columnGap: "200",
      width: "100%",
      userSelect: "none",
      touchAction: "none",

      '&[data-orientation="vertical"]': {
        gridTemplateAreas: `"output" "track"`,
        gridTemplateColumns: "auto",
        width: "auto",
        height: "var(--slider-vertical-length, 200px)",
        justifyItems: "center",
      },

      "&[data-disabled='true']": {
        layerStyle: "disabled",
        pointerEvents: "none",
      },
    },
    label: {
      gridArea: "label",
      fontSize: "350",
      color: "neutral.11",
      userSelect: "none",
    },
    output: {
      gridArea: "output",
      justifySelf: "end",
      fontSize: "350",
      color: "neutral.11",
      fontVariantNumeric: "tabular-nums",
    },
    track: {
      gridArea: "track",
      position: "relative",
      display: "flex",
      alignItems: "center",
      borderRadius: "full",
      backgroundColor: "neutral.6",
      width: "100%",
      height: "var(--slider-track-thickness)",
      cursor: "pointer",

      '&[data-orientation="vertical"]': {
        flexDirection: "column",
        width: "var(--slider-track-thickness)",
        height: "100%",
      },

      "&[data-disabled='true']": {
        cursor: "default",
      },
    },
    fill: {
      position: "absolute",
      borderRadius: "full",
      backgroundColor: "colorPalette.9",
      height: "var(--slider-track-thickness)",
      top: "0",
      left: "0",

      '&[data-orientation="vertical"]': {
        width: "var(--slider-track-thickness)",
        height: "auto",
        left: "0",
        bottom: "0",
        top: "auto",
      },
    },
    thumb: {
      boxSize: "var(--slider-thumb-size)",
      borderRadius: "full",
      backgroundColor: "neutral.1",
      border: "solid-50",
      borderColor: "colorPalette.9",
      transition: "background-color 0.15s, transform 0.15s",
      focusRing: "outside",

      "&[data-hovered='true']": {
        backgroundColor: "colorPalette.2",
      },
      "&[data-dragging='true']": {
        backgroundColor: "colorPalette.3",
        transform: "scale(1.1)",
      },
    },
    tick: {
      position: "absolute",
      top: "50%",
      width: "2px",
      height: "var(--slider-tick-length)",
      backgroundColor: "neutral.8",
      transform: "translate(-50%, -50%)",
      pointerEvents: "none",
    },
    tickLabel: {
      position: "absolute",
      top: "calc(50% + var(--slider-tick-length))",
      fontSize: "300",
      color: "neutral.11",
      transform: "translateX(-50%)",
      whiteSpace: "nowrap",
      pointerEvents: "none",
    },
  },
  variants: {
    size: {
      sm: {
        track: { "--slider-track-thickness": "sizes.100" },
        thumb: { "--slider-thumb-size": "sizes.400" },
        root: { "--slider-tick-length": "sizes.150" },
      },
      md: {
        track: { "--slider-track-thickness": "sizes.150" },
        thumb: { "--slider-thumb-size": "sizes.500" },
        root: { "--slider-tick-length": "sizes.200" },
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});
```

> If `build-theme-typings` or typecheck reports an unknown token (e.g. a
> `sizes.*` value that doesn't exist in `@commercetools/nimbus-tokens`), replace
> it with the nearest existing token from `packages/tokens` — the token names,
> not the structure, are what varies.

- [ ] **Step 2: Write the types**

Create `slider.types.ts`:

```ts
import type { ReactNode, Ref } from "react";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
} from "@chakra-ui/react/styled-system";
import type { SliderProps as RaSliderProps } from "react-aria-components";
import type { OmitInternalProps } from "../../type-utils/omit-props";

// ============================================================
// RECIPE PROPS
// ============================================================
type SliderRecipeProps = SlotRecipeProps<"nimbusSlider">;

// ============================================================
// SLOT PROPS
// ============================================================
export type SliderRootSlotProps = HTMLChakraProps<"div", SliderRecipeProps>;
export type SliderLabelSlotProps = HTMLChakraProps<"span">;
export type SliderOutputSlotProps = HTMLChakraProps<"div">;
export type SliderTrackSlotProps = HTMLChakraProps<"div">;
export type SliderFillSlotProps = HTMLChakraProps<"div">;
export type SliderThumbSlotProps = HTMLChakraProps<"div">;
export type SliderTickSlotProps = HTMLChakraProps<"div">;
export type SliderTickLabelSlotProps = HTMLChakraProps<"div">;

// ============================================================
// SHARED PROPS
// ============================================================
/** React Aria props we specialize per-component or handle ourselves. */
type ExcludedRaSliderProps =
  | "value"
  | "defaultValue"
  | "onChange"
  | "onChangeEnd"
  | "children"
  | "style"
  | "className";

type SliderCommonProps = {
  /** Visible label rendered in the label grid area (standalone use). */
  label?: ReactNode;
  /** aria-labels for each thumb, indexed by thumb position. */
  thumbLabels?: string[];
  /** Render tick marks along the track. */
  showTicks?: boolean;
  /** Interval between ticks; defaults to `step` when `showTicks` is set. */
  tickStep?: number;
  /** Forwarded to the root element. */
  ref?: Ref<HTMLDivElement>;
};

type SliderSharedProps = OmitInternalProps<SliderRootSlotProps, "onChange"> &
  Omit<RaSliderProps, ExcludedRaSliderProps> &
  SliderCommonProps;

// ============================================================
// PUBLIC PROPS
// ============================================================
export type SliderProps = SliderSharedProps & {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  onChangeEnd?: (value: number) => void;
};

export type RangeSliderProps = SliderSharedProps & {
  value?: [number, number];
  defaultValue?: [number, number];
  onChange?: (value: [number, number]) => void;
  onChangeEnd?: (value: [number, number]) => void;
};

// ============================================================
// INTERNAL PROPS (shared implementation accepts the union)
// ============================================================
export type SliderBaseProps = SliderSharedProps & {
  value?: number | number[];
  defaultValue?: number | number[];
  onChange?: (value: number | number[]) => void;
  onChangeEnd?: (value: number | number[]) => void;
};
```

- [ ] **Step 3: Write the slots**

Create `slider.slots.tsx` (slots are `div`s; `SliderBase` uses `asChild` to
graft React Aria primitives, mirroring `progress-bar.slots.tsx`):

```tsx
import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type {
  SliderRootSlotProps,
  SliderLabelSlotProps,
  SliderOutputSlotProps,
  SliderTrackSlotProps,
  SliderFillSlotProps,
  SliderThumbSlotProps,
  SliderTickSlotProps,
  SliderTickLabelSlotProps,
} from "./slider.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusSlider",
});

/** Root — provides the recipe context; grafts React Aria <Slider> via asChild. */
export const SliderRootSlot = withProvider<HTMLDivElement, SliderRootSlotProps>(
  "div",
  "root"
);

export const SliderLabelSlot = withContext<
  HTMLSpanElement,
  SliderLabelSlotProps
>("span", "label");

export const SliderOutputSlot = withContext<
  HTMLDivElement,
  SliderOutputSlotProps
>("div", "output");

export const SliderTrackSlot = withContext<
  HTMLDivElement,
  SliderTrackSlotProps
>("div", "track");

export const SliderFillSlot = withContext<HTMLDivElement, SliderFillSlotProps>(
  "div",
  "fill"
);

export const SliderThumbSlot = withContext<
  HTMLDivElement,
  SliderThumbSlotProps
>("div", "thumb");

export const SliderTickSlot = withContext<HTMLDivElement, SliderTickSlotProps>(
  "div",
  "tick"
);

export const SliderTickLabelSlot = withContext<
  HTMLDivElement,
  SliderTickLabelSlotProps
>("div", "tickLabel");
```

- [ ] **Step 4: Register the recipe**

In `packages/nimbus/src/theme/slot-recipes/index.ts`, add the import
(alphabetical, near `searchInputSlotRecipe`):

```ts
import { sliderSlotRecipe } from "@/components/slider/slider.recipe";
```

and add the key inside the `slotRecipes` object (near `nimbusSelect`):

```ts
  nimbusSlider: sliderSlotRecipe,
```

- [ ] **Step 5: Write the barrel**

Create `slider/index.ts`:

```ts
export { Slider } from "./slider";
export { RangeSlider } from "./range-slider";
export type { SliderProps, RangeSliderProps } from "./slider.types";
```

> This references `./slider` and `./range-slider`, created in Tasks 2–3. It will
> not typecheck until those exist — that's expected; the `index.ts` is committed
> here but the barrel export in Step 6 is added in Task 2 to avoid a broken
> build.

- [ ] **Step 6: Verify types + theme typings compile (recipe/slots/types only)**

The recipe, slots, and types don't depend on the wrappers. Verify them in
isolation:

Run: `pnpm --filter @commercetools/nimbus build-theme-typings` Expected:
completes without error; `nimbusSlider` variant types are generated (no silent
failure — if slot-recipe types vanish, the recipe key isn't a valid JS
identifier).

Run:
`pnpm --filter @commercetools/nimbus exec tsc --noEmit -p tsconfig.json 2>&1 | grep -E "slider\.(recipe|types|slots)" || echo "no errors in recipe/types/slots"`
Expected: `no errors in recipe/types/slots`

- [ ] **Step 7: Commit**

```bash
git add packages/nimbus/src/components/slider packages/nimbus/src/theme/slot-recipes/index.ts
git commit -m "feat(slider): add recipe, slots, types, and registration"
```

---

### Task 2: Slider (single value) core + value tooltip + story

Reconciles the committed foundation with the design revision (removes the
`label`/`output` slots), then implements the shared internal `SliderBase` with a
per-thumb value tooltip, the public `Slider` wrapper, the first Storybook
play-function test, and wires the barrel export.

**Files:**

- Modify: `packages/nimbus/src/components/slider/slider.recipe.ts` (remove
  `label`/`output` slots + grid; root becomes a flex track container)
- Modify: `packages/nimbus/src/components/slider/slider.slots.tsx` (remove
  `SliderLabelSlot`, `SliderOutputSlot`)
- Modify: `packages/nimbus/src/components/slider/slider.types.ts` (remove
  `SliderLabelSlotProps`, `SliderOutputSlotProps`, and the `label` prop)
- Create: `packages/nimbus/src/components/slider/slider-base.tsx`
- Create: `packages/nimbus/src/components/slider/slider.tsx`
- Create: `packages/nimbus/src/components/slider/slider.stories.tsx`
- Modify: `packages/nimbus/src/components/index.ts` (add
  `export * from "./slider";`)

**Interfaces:**

- Consumes: `SliderBaseProps`, `SliderProps` (Task 1, minus the removed `label`
  prop); slot components
  `SliderRootSlot`/`SliderTrackSlot`/`SliderFillSlot`/`SliderThumbSlot`/`SliderTickSlot`
  (Task 1); `sliderSlotRecipe`; Nimbus `Tooltip` from
  `@/components/tooltip/tooltip`.
- Produces: `SliderBase` (internal), `Slider` (public). `SliderBase` renders the
  full anatomy for any thumb count, each thumb wrapped in a controlled value
  `Tooltip`.

- [ ] **Step 0: Reconcile the committed foundation with the design revision**

The `label` and `output` slots are gone. Make these edits to the three committed
files:

**`slider.recipe.ts`** — set `slots` to
`["root", "track", "fill", "thumb", "tickLabel", "tick"]` (drop `label`,
`output`), delete the `label:` and `output:` base blocks, and replace the `root`
base block so it is a flex container for the track (no grid areas). Also remove
`gridArea: "track"` from the `track` block. New `root` block:

```ts
    root: {
      colorPalette: "primary",
      display: "flex",
      alignItems: "center",
      width: "100%",
      minHeight: "var(--slider-thumb-size)",
      userSelect: "none",
      touchAction: "none",

      '&[data-orientation="vertical"]': {
        flexDirection: "column",
        width: "auto",
        height: "var(--slider-vertical-length, 200px)",
        justifyContent: "center",
      },

      "&[data-disabled='true']": {
        layerStyle: "disabled",
        pointerEvents: "none",
      },
    },
```

In the `track` block delete the line `gridArea: "track",` (keep everything
else). Leave `fill`, `thumb`, `tick`, `tickLabel`, the `size` variants, and
`defaultVariants` unchanged.

**`slider.slots.tsx`** — delete the `SliderLabelSlot` and `SliderOutputSlot`
exports and remove `SliderLabelSlotProps`, `SliderOutputSlotProps` from the type
import. Keep `SliderRootSlot`, `SliderTrackSlot`, `SliderFillSlot`,
`SliderThumbSlot`, `SliderTickSlot`, `SliderTickLabelSlot`.

**`slider.types.ts`** — delete `export type SliderLabelSlotProps = ...;` and
`export type SliderOutputSlotProps = ...;`. In `SliderCommonProps`, delete the
`label?: ReactNode;` line (accessible name comes from `aria-label`, already
available via the React Aria props). Remove the now-unused `ReactNode` import if
nothing else uses it.

- [ ] **Step 1: Write the failing test**

Create `slider.stories.tsx`:

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Slider } from "@commercetools/nimbus";
import { within, expect, userEvent, fn } from "storybook/test";

const meta: Meta<typeof Slider> = {
  title: "Components/Slider",
  component: Slider,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Slider>;

/** Uncontrolled single-value slider. No visible label or output; value shows in a tooltip. */
export const Base: Story = {
  args: {
    "aria-label": "Volume",
    defaultValue: 30,
    minValue: 0,
    maxValue: 100,
    onChange: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const thumb = canvas.getByRole("slider");

    await step(
      "renders the initial value and no visible label/output",
      async () => {
        await expect(thumb).toHaveAttribute("aria-valuenow", "30");
        await expect(canvas.queryByText("Volume")).not.toBeInTheDocument();
      }
    );

    await step("shows a value tooltip on hover", async () => {
      await userEvent.hover(thumb);
      const tip = await body.findByRole("tooltip");
      await expect(tip).toHaveTextContent("30");
      await userEvent.unhover(thumb);
    });

    await step(
      "increments with ArrowRight and the focused tooltip updates",
      async () => {
        await userEvent.tab();
        await expect(thumb).toHaveFocus();
        const tip = await body.findByRole("tooltip");
        await userEvent.keyboard("{ArrowRight}");
        await expect(thumb).toHaveAttribute("aria-valuenow", "31");
        await expect(tip).toHaveTextContent("31");
        await expect(args.onChange).toHaveBeenCalled();
      }
    );

    await step("jumps to max with End", async () => {
      await userEvent.keyboard("{End}");
      await expect(thumb).toHaveAttribute("aria-valuenow", "100");
    });
  },
};
```

> The Nimbus `Tooltip` renders its content in a portal on `document.body`, so
> query it with `within(document.body)`, not the canvas. The tooltip is
> controlled, so it appears immediately when the thumb is
> hovered/focused/dragged (no hover delay). If React Aria's actual DOM differs
> (e.g. how the `slider` role element is named), adjust the assertions to match
> real behavior — never weaken them to pass.

- [ ] **Step 2: Run the test to verify it fails**

Run:
`pnpm test:storybook:dev packages/nimbus/src/components/slider/slider.stories.tsx`
Expected: FAIL — `Slider` is not exported from `@commercetools/nimbus` / no
element with role `slider`.

- [ ] **Step 3: Implement `SliderBase`**

Create `slider-base.tsx`:

```tsx
import { useState, useRef } from "react";
import { useObjectRef } from "react-aria";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import {
  Slider as RaSlider,
  SliderTrack as RaSliderTrack,
  SliderThumb as RaSliderThumb,
  SliderFill as RaSliderFill,
} from "react-aria-components";
import { mergeRefs, extractStyleProps } from "@/utils";
import { Tooltip } from "@/components/tooltip/tooltip";
import {
  SliderRootSlot,
  SliderTrackSlot,
  SliderFillSlot,
  SliderThumbSlot,
  SliderTickSlot,
} from "./slider.slots";
import { sliderSlotRecipe } from "./slider.recipe";
import type { SliderBaseProps } from "./slider.types";

/**
 * A single slider thumb wrapped in a value tooltip that is open while the thumb
 * is hovered, keyboard-focused, or being dragged. Each thumb owns its own
 * hover/focus state so RangeSlider's two thumbs are independent.
 */
type SliderValueThumbProps = {
  index: number;
  thumbLabel?: string;
  valueLabel: string;
  isDragging: boolean;
};

const SliderValueThumb = ({
  index,
  thumbLabel,
  valueLabel,
  isDragging,
}: SliderValueThumbProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isOpen = isHovered || isFocused || isDragging;

  return (
    <Tooltip.Root isOpen={isOpen} onOpenChange={() => {}}>
      <SliderThumbSlot asChild data-slot="thumb">
        <RaSliderThumb
          index={index}
          aria-label={thumbLabel}
          onHoverChange={setIsHovered}
          onFocusChange={setIsFocused}
        />
      </SliderThumbSlot>
      <Tooltip.Content>{valueLabel}</Tooltip.Content>
    </Tooltip.Root>
  );
};

/**
 * Shared internal implementation for Slider and RangeSlider. Renders the full
 * React Aria Slider anatomy for any number of thumbs (driven by state.values),
 * each thumb showing its current value in a tooltip.
 */
export const SliderBase = (props: SliderBaseProps) => {
  const {
    ref: forwardedRef,
    thumbLabels,
    showTicks = false,
    tickStep,
    size,
    ...restProps
  } = props;

  const recipe = useSlotRecipe({ recipe: sliderSlotRecipe });
  const [recipeProps, recipeLessProps] = recipe.splitVariantProps({
    size,
    ...restProps,
  });
  const [styleProps, functionalProps] = extractStyleProps(recipeLessProps);

  const localRef = useRef<HTMLDivElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  // FormField.Input clones us with inputProps that may use DOM attribute names.
  // React Aria's Slider expects isDisabled/isInvalid, so normalize + strip DOM ones.
  const {
    disabled,
    "aria-invalid": ariaInvalid,
    ...raProps
  } = functionalProps as typeof functionalProps & {
    disabled?: boolean;
    "aria-invalid"?: boolean | "true" | "false";
  };
  const isDisabled = raProps.isDisabled ?? disabled ?? undefined;
  const isInvalid =
    raProps.isInvalid ??
    (ariaInvalid === true || ariaInvalid === "true"
      ? true
      : ariaInvalid === false || ariaInvalid === "false"
        ? false
        : undefined);

  const minValue = raProps.minValue ?? 0;
  const maxValue = raProps.maxValue ?? 100;
  const resolvedTickStep = tickStep ?? raProps.step ?? 1;
  const ticks =
    showTicks && resolvedTickStep > 0
      ? Array.from(
          { length: Math.floor((maxValue - minValue) / resolvedTickStep) + 1 },
          (_, i) => minValue + i * resolvedTickStep
        )
      : [];

  const stateProps = {
    "data-invalid": isInvalid || undefined,
    "data-disabled": isDisabled || undefined,
  };

  return (
    <SliderRootSlot
      asChild
      data-slot="root"
      {...recipeProps}
      {...styleProps}
      {...stateProps}
    >
      <RaSlider
        ref={ref}
        {...raProps}
        isDisabled={isDisabled}
        isInvalid={isInvalid}
      >
        <SliderTrackSlot asChild data-slot="track">
          <RaSliderTrack>
            {({ state }) => (
              <>
                <SliderFillSlot asChild data-slot="fill">
                  <RaSliderFill />
                </SliderFillSlot>
                {state.values.map((_, i) => (
                  <SliderValueThumb
                    key={i}
                    index={i}
                    thumbLabel={thumbLabels?.[i]}
                    valueLabel={state.getThumbValueLabel(i)}
                    isDragging={state.isThumbDragging(i)}
                  />
                ))}
                {ticks.map((tickValue) => {
                  const percent =
                    ((tickValue - minValue) / (maxValue - minValue)) * 100;
                  return (
                    <SliderTickSlot
                      key={tickValue}
                      data-slot="tick"
                      style={{ left: `${percent}%` }}
                    />
                  );
                })}
              </>
            )}
          </RaSliderTrack>
        </SliderTrackSlot>
      </RaSlider>
    </SliderRootSlot>
  );
};

SliderBase.displayName = "SliderBase";
```

> `RaSliderFill` sets its own inline fill geometry — `SliderBase` must not set
> fill length/position. `state.getThumbValueLabel(i)` and
> `state.isThumbDragging(i)` are React Aria `SliderState` methods (verified
> present). The controlled `Tooltip` (`isOpen` + no-op `onOpenChange`) bypasses
> React Aria's hover delay, so the value appears the instant the thumb is
> hovered/focused/dragged. Import `Tooltip` from the implementation file
> (`@/components/tooltip/tooltip`), not a barrel, per the repo's
> cross-component-import rule.

- [ ] **Step 4: Implement the `Slider` wrapper**

Create `slider.tsx`:

```tsx
import { SliderBase } from "./slider-base";
import type { SliderProps } from "./slider.types";

/**
 * # Slider
 *
 * A single-thumb slider for selecting one numeric value within a range. Wraps
 * React Aria's Slider with Nimbus styling; the current value is shown in a
 * tooltip on the handle while hovering, focusing, or dragging. Provide an
 * `aria-label` (or use inside `FormField`) for the accessible name.
 */
export const Slider = (props: SliderProps) => {
  return <SliderBase {...props} />;
};

Slider.displayName = "Slider";
```

- [ ] **Step 5: Wire the barrel export**

In `packages/nimbus/src/components/index.ts`, add (keep grouping consistent with
neighbors):

```ts
export * from "./slider";
```

- [ ] **Step 6: Run the test to verify it passes**

Run:
`pnpm test:storybook:dev packages/nimbus/src/components/slider/slider.stories.tsx`
Expected: PASS (all steps green, output pristine).

- [ ] **Step 7: Dev typecheck**

Run: `pnpm --filter @commercetools/nimbus typecheck:dev` Expected: no errors. A
leftover "cannot find module './range-slider'" is expected until Task 3.

- [ ] **Step 8: Commit**

```bash
git add packages/nimbus/src/components/slider packages/nimbus/src/components/index.ts
git commit -m "feat(slider): implement single-value Slider with per-thumb value tooltip"
```

---

### Task 3: RangeSlider (two thumbs) core + story

Adds the `RangeSlider` wrapper (two-thumb `[number, number]`) — no new
`SliderBase` logic (it already renders one thumb per `state.values` entry), plus
a story proving two thumbs, range output, and thumbs that cannot cross.

**Files:**

- Create: `packages/nimbus/src/components/slider/range-slider.tsx`
- Create: `packages/nimbus/src/components/slider/range-slider.stories.tsx`

**Interfaces:**

- Consumes: `SliderBase` (Task 2), `RangeSliderProps` (Task 1).
- Produces: `RangeSlider` (public), already re-exported by `slider/index.ts`
  (Task 1, Step 5).

- [ ] **Step 1: Write the failing test**

Create `range-slider.stories.tsx`:

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { RangeSlider } from "@commercetools/nimbus";
import { within, expect, userEvent, fn } from "storybook/test";

const meta: Meta<typeof RangeSlider> = {
  title: "Components/RangeSlider",
  component: RangeSlider,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RangeSlider>;

/** Uncontrolled two-thumb range slider. */
export const Base: Story = {
  args: {
    "aria-label": "Price range",
    defaultValue: [20, 60],
    minValue: 0,
    maxValue: 100,
    thumbLabels: ["Minimum", "Maximum"],
    onChange: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const thumbs = canvas.getAllByRole("slider");

    await step("renders two thumbs with the initial values", async () => {
      await expect(thumbs).toHaveLength(2);
      await expect(thumbs[0]).toHaveAttribute("aria-valuenow", "20");
      await expect(thumbs[1]).toHaveAttribute("aria-valuenow", "60");
    });

    await step("labels each thumb", async () => {
      await expect(thumbs[0]).toHaveAttribute("aria-label", "Minimum");
      await expect(thumbs[1]).toHaveAttribute("aria-label", "Maximum");
    });

    await step("emits an array on change", async () => {
      thumbs[0].focus();
      await userEvent.keyboard("{ArrowRight}");
      await expect(args.onChange).toHaveBeenCalledWith([21, 60]);
    });

    await step("lower thumb cannot cross the upper thumb", async () => {
      thumbs[0].focus();
      await userEvent.keyboard("{End}");
      // clamped at the upper thumb's value, never above it
      const lower = Number(thumbs[0].getAttribute("aria-valuenow"));
      const upper = Number(thumbs[1].getAttribute("aria-valuenow"));
      await expect(lower).toBeLessThanOrEqual(upper);
    });
  },
};
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
`pnpm test:storybook:dev packages/nimbus/src/components/slider/range-slider.stories.tsx`
Expected: FAIL — `RangeSlider` not exported from `@commercetools/nimbus`.

- [ ] **Step 3: Implement the `RangeSlider` wrapper**

Create `range-slider.tsx`:

```tsx
import { SliderBase } from "./slider-base";
import type { RangeSliderProps } from "./slider.types";

/**
 * # RangeSlider
 *
 * A two-thumb slider for selecting a `[min, max]` numeric range within bounds.
 * Wraps React Aria's Slider with two thumbs; the thumbs cannot cross.
 */
export const RangeSlider = (props: RangeSliderProps) => {
  return <SliderBase {...props} />;
};

RangeSlider.displayName = "RangeSlider";
```

- [ ] **Step 4: Run the test to verify it passes**

Run:
`pnpm test:storybook:dev packages/nimbus/src/components/slider/range-slider.stories.tsx`
Expected: PASS.

- [ ] **Step 5: Dev typecheck**

Run: `pnpm --filter @commercetools/nimbus typecheck:dev` Expected: no errors.
(Confirms `RangeSlider`'s `[number, number]` value type is accepted by
`SliderBase`'s union.)

- [ ] **Step 6: Commit**

```bash
git add packages/nimbus/src/components/slider/range-slider.tsx packages/nimbus/src/components/slider/range-slider.stories.tsx
git commit -m "feat(slider): add two-thumb RangeSlider"
```

---

### Task 4: Vertical orientation + sizes

Verifies the `orientation` prop (recipe already branches on
`[data-orientation="vertical"]`) and the `sm`/`md` size variants with stories.
No new implementation is expected — this task proves the recipe variants render
correctly; if an assertion fails, fix the recipe.

**Files:**

- Modify: `packages/nimbus/src/components/slider/slider.stories.tsx` (add
  `Vertical`, `Sizes` stories)

**Interfaces:**

- Consumes: `Slider` (Task 2). React Aria sets `data-orientation` on the Slider
  root and `aria-orientation` on the thumb; in a vertical slider ArrowUp
  increases the value.

- [ ] **Step 1: Write the failing tests**

Append to `slider.stories.tsx`:

```tsx
/** Vertical orientation. */
export const Vertical: Story = {
  args: {
    "aria-label": "Zoom",
    defaultValue: 40,
    minValue: 0,
    maxValue: 100,
    orientation: "vertical",
    onChange: fn(),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const thumb = canvas.getByRole("slider");
    const root = canvasElement.querySelector('[data-slot="root"]');

    await step("root is marked vertical", async () => {
      await expect(root).toHaveAttribute("data-orientation", "vertical");
      await expect(thumb).toHaveAttribute("aria-orientation", "vertical");
    });

    await step("ArrowUp increases the value", async () => {
      thumb.focus();
      await userEvent.keyboard("{ArrowUp}");
      await expect(thumb).toHaveAttribute("aria-valuenow", "41");
    });
  },
};

/** Small and medium sizes render side by side. */
export const Sizes: Story = {
  render: () => (
    <>
      <Slider aria-label="Small" size="sm" defaultValue={30} data-testid="sm" />
      <Slider
        aria-label="Medium"
        size="md"
        defaultValue={30}
        data-testid="md"
      />
    </>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("both sizes render a slider thumb", async () => {
      await expect(canvas.getAllByRole("slider")).toHaveLength(2);
    });
  },
};
```

> `Sizes` uses a custom `render`, so `size="sm"` / `size="md"` must be valid
> props. The visual difference (track thickness, thumb diameter) is verified
> visually in Storybook / Chromatic; the play function only smoke-tests that
> both render. Add `import { Slider } from "@commercetools/nimbus";` is already
> present at the top of the file — no new import needed.

- [ ] **Step 2: Run the tests to verify status**

Run:
`pnpm test:storybook:dev packages/nimbus/src/components/slider/slider.stories.tsx`
Expected: `Vertical` and `Sizes` PASS if the recipe variants are correct. If
`Vertical` fails on `data-orientation`, confirm `SliderBase` spreads
`orientation` through `functionalProps` to `RaSlider` (it does via
`{...functionalProps}`). If layout is broken, fix the
`'&[data-orientation="vertical"]'` blocks in `slider.recipe.ts`.

- [ ] **Step 3: Visually verify (manual, one-time)**

Run: `pnpm --filter @commercetools/nimbus storybook` Open **Components/Slider →
Vertical** and **→ Sizes**; confirm the vertical track is tall and the `sm`
thumb/track are visibly smaller than `md`. Close Storybook.

- [ ] **Step 4: Commit**

```bash
git add packages/nimbus/src/components/slider/slider.stories.tsx
git commit -m "test(slider): cover vertical orientation and size variants"
```

---

### Task 5: Tick marks

Verifies opt-in tick rendering (`showTicks` / `tickStep`) implemented in
`SliderBase` (Task 2). Adds a story asserting the correct number of tick
elements. If ticks don't render, fix `SliderBase`.

**Files:**

- Modify: `packages/nimbus/src/components/slider/slider.stories.tsx` (add
  `WithTicks` story)

**Interfaces:**

- Consumes: `Slider` with `showTicks`/`tickStep` (Task 1 types, Task 2 impl).
  Tick elements carry `data-slot="tick"`.

- [ ] **Step 1: Write the failing test**

Append to `slider.stories.tsx`:

```tsx
/** Slider with visible tick marks every 25 units (0, 25, 50, 75, 100). */
export const WithTicks: Story = {
  args: {
    "aria-label": "Rating",
    defaultValue: 50,
    minValue: 0,
    maxValue: 100,
    step: 25,
    showTicks: true,
  },
  play: async ({ canvasElement, step }) => {
    await step("renders one tick per step from min to max", async () => {
      const ticks = canvasElement.querySelectorAll('[data-slot="tick"]');
      // 0, 25, 50, 75, 100 => 5 ticks
      await expect(ticks).toHaveLength(5);
    });
  },
};
```

- [ ] **Step 2: Run the test**

Run:
`pnpm test:storybook:dev packages/nimbus/src/components/slider/slider.stories.tsx`
Expected: `WithTicks` PASS (5 ticks). If it renders 0 ticks, confirm
`showTicks`/`tickStep` are destructured in `SliderBase` and the `ticks` array
math uses `resolvedTickStep`.

- [ ] **Step 3: Visually verify (manual, one-time)**

Run: `pnpm --filter @commercetools/nimbus storybook` Open **Components/Slider →
WithTicks**; confirm 5 evenly spaced ticks aligned under the track. Close
Storybook.

- [ ] **Step 4: Commit**

```bash
git add packages/nimbus/src/components/slider/slider.stories.tsx
git commit -m "test(slider): cover opt-in tick marks"
```

---

### Task 6: FormField integration + i18n thumb labels + a11y story

Makes the slider work inside `FormField.Root` (which clones the control and
injects `inputProps` — label association via `aria-labelledby`, plus
`aria-describedby`, disabled/invalid state) and gives `RangeSlider` localized
default thumb labels ("Minimum"/"Maximum") when `thumbLabels` isn't supplied.

**Files:**

- Modify: `packages/nimbus/src/components/slider/slider-base.tsx` (add localized
  default thumb labels; injected-prop normalization already added in Task 2)
- Create: `packages/nimbus/src/components/slider/slider.i18n.ts`
- Create (generated):
  `packages/nimbus/src/components/slider/slider.messages.ts` + `intl/*` (via the
  i18n skill / `pnpm extract-intl`)
- Modify: `packages/nimbus/src/components/slider/slider.stories.tsx` (add
  `WithFormField` story)

**Interfaces:**

- Consumes: `FormFieldContext.inputProps` shape — verify by reading
  `packages/nimbus/src/components/form-field/components/form-field.input.tsx`
  (it does `cloneElement(child, inputProps)`) and `form-field.context.tsx` for
  what `inputProps` contains (expect some of: `id`, `aria-labelledby`,
  `aria-describedby`, `aria-invalid`, `isDisabled`/`disabled`,
  `isRequired`/`required`).
- Produces: `sliderMessagesStrings` (compiled), consumed via
  `useLocalizedStringFormatter`.

- [ ] **Step 1: Author the i18n source**

Create `slider.i18n.ts` (same shape as `number-input.i18n.ts`):

```ts
export const messages = {
  minimumThumb: {
    id: "Nimbus.Slider.minimumThumb",
    description:
      "Default aria-label for the lower (minimum) thumb of a range slider",
    defaultMessage: "Minimum",
  },
  maximumThumb: {
    id: "Nimbus.Slider.maximumThumb",
    description:
      "Default aria-label for the upper (maximum) thumb of a range slider",
    defaultMessage: "Maximum",
  },
};
```

- [ ] **Step 2: Compile messages via the Nimbus i18n skill**

Invoke the `writing-i18n` skill for the `slider` component (it generates
`slider.messages.ts`, `intl/en`, `intl/de`, `intl/es`, `intl/fr-FR`,
`intl/pt-BR`, and the `SliderMessageKey` type from `slider.i18n.ts`). If running
manually instead:

Run: `pnpm extract-intl` Expected: `slider.messages.ts` and `intl/*` created;
`sliderMessagesStrings` exported (mirrors `numberInputMessagesStrings`).

- [ ] **Step 3: Write the failing FormField test**

Append to `slider.stories.tsx` (add `FormField` to the import):

```tsx
// update the top import to:
// import { Slider, RangeSlider, FormField } from "@commercetools/nimbus";

/** Slider wired through FormField for label + description + invalid state. */
export const WithFormField: Story = {
  render: () => (
    <FormField.Root isInvalid>
      <FormField.Label>Opacity</FormField.Label>
      <FormField.Input>
        <Slider defaultValue={50} minValue={0} maxValue={100} />
      </FormField.Input>
      <FormField.Description>Adjust layer opacity</FormField.Description>
      <FormField.Error>Value is out of range</FormField.Error>
    </FormField.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const thumb = canvas.getByRole("slider");
    const root = canvasElement.querySelector('[data-slot="root"]');

    await step("associates the FormField label", async () => {
      // React Aria's slider group is labelled by the FormField label
      const group = canvasElement.querySelector('[role="group"]') ?? root;
      await expect(group).toHaveAttribute("aria-labelledby");
    });

    await step("reflects the invalid state", async () => {
      await expect(root).toHaveAttribute("data-invalid", "true");
    });

    await step("remains operable", async () => {
      thumb.focus();
      await userEvent.keyboard("{ArrowRight}");
      await expect(thumb).toHaveAttribute("aria-valuenow", "51");
    });
  },
};
```

- [ ] **Step 4: Run the FormField test**

Run:
`pnpm test:storybook:dev packages/nimbus/src/components/slider/slider.stories.tsx`
Expected: `WithFormField` PASS — Task 2's `SliderBase` already normalizes
injected `disabled`/`aria-invalid` to React Aria props and passes
`aria-labelledby` straight through to `RaSlider`, so FormField's cloned props
associate the label and set the invalid state. If it FAILS on `aria-labelledby`,
read
`packages/nimbus/src/components/form-field/components/form-field.context.tsx` to
confirm which keys `inputProps` injects and ensure `SliderBase` forwards them
(they should pass through `{...raProps}`). Do not weaken the assertions to pass.

- [ ] **Step 5: Add localized default thumb labels to `SliderBase`**

The disabled/invalid normalization already exists in `SliderBase` from Task 2.
This step only adds localized default thumb labels for `RangeSlider`, used when
the caller does not pass `thumbLabels`.

Add the localized-string imports near the other imports in `slider-base.tsx`:

```tsx
import { useLocalizedStringFormatter } from "@/hooks";
import { sliderMessagesStrings } from "./slider.messages";
```

Inside `SliderBase`, add the formatter and a resolver alongside the other
derived values (before the `return`):

```tsx
  const msg = useLocalizedStringFormatter(sliderMessagesStrings);
  const defaultThumbLabels = [
    msg.format("minimumThumb"),
    msg.format("maximumThumb"),
  ];
  const resolveThumbLabel = (index: number, total: number) =>
    thumbLabels?.[index] ?? (total > 1 ? defaultThumbLabels[index] : undefined);
```

Then change the thumb map to pass the resolved label to `SliderValueThumb`
(replacing `thumbLabel={thumbLabels?.[i]}`):

```tsx
                {state.values.map((_, i) => (
                  <SliderValueThumb
                    key={i}
                    index={i}
                    thumbLabel={resolveThumbLabel(i, state.values.length)}
                    valueLabel={state.getThumbValueLabel(i)}
                    isDragging={state.isThumbDragging(i)}
                  />
                ))}
```

> Single sliders (`total === 1`) get no default thumb label — the slider's own
> `aria-label` / `FormField` label names it. Only `RangeSlider` (two thumbs)
> receives the "Minimum"/"Maximum" defaults.

- [ ] **Step 6: Run the test to verify it passes**

Run:
`pnpm test:storybook:dev packages/nimbus/src/components/slider/slider.stories.tsx`
Expected: `WithFormField` PASS (label associated, `data-invalid="true"`, still
operable). Re-run the full file to confirm no regressions.

- [ ] **Step 7: Verify RangeSlider default thumb labels**

Edit `range-slider.stories.tsx` `Base` story: remove the explicit
`thumbLabels: ["Minimum", "Maximum"]` arg, and change the label assertion to
expect the localized defaults:

```tsx
await step("labels each thumb with localized defaults", async () => {
  await expect(thumbs[0]).toHaveAttribute("aria-label", "Minimum");
  await expect(thumbs[1]).toHaveAttribute("aria-label", "Maximum");
});
```

Run:
`pnpm test:storybook:dev packages/nimbus/src/components/slider/range-slider.stories.tsx`
Expected: PASS (defaults applied).

- [ ] **Step 8: Dev typecheck + commit**

Run: `pnpm --filter @commercetools/nimbus typecheck:dev` Expected: no errors.

```bash
git add packages/nimbus/src/components/slider
git commit -m "feat(slider): FormField integration and localized default thumb labels"
```

---

### Task 7: Documentation file set

Adds the standard Nimbus documentation files so the component appears in the
docs site and passes the docs build. Use the Nimbus documentation skills (they
enforce the exact required format) rather than hand-writing MDX.

**Files:**

- Create: `packages/nimbus/src/components/slider/slider.dev.mdx`
- Create: `packages/nimbus/src/components/slider/slider.docs.spec.tsx`
- Create: `packages/nimbus/src/components/slider/slider.guidelines.mdx`
- Create: `packages/nimbus/src/components/slider/slider.a11y.mdx`
- Create: `packages/nimbus/src/components/slider/slider.mdx`
- Create: `packages/nimbus/src/components/slider/slider.figma.tsx` (only if a
  Figma node exists; otherwise skip — the spec says no Figma reference)

- [ ] **Step 1: Generate developer + designer docs**

Invoke the `create-eng-docs` skill (or `writing-developer-documentation` +
`writing-designer-documentation`) for the `Slider` component. Provide it these
usage examples to embed:

- Single:
  `<Slider aria-label="Volume" defaultValue={30} minValue={0} maxValue={100} />`
- Range:
  `<RangeSlider aria-label="Price range" defaultValue={[20, 60]} minValue={0} maxValue={100} />`
- Vertical, sizes, ticks (`showTicks`), and FormField integration (mirror the
  stories).

- [ ] **Step 2: Write consumer examples (`slider.docs.spec.tsx`)**

The `writing-developer-documentation` skill produces `slider.docs.spec.tsx` —
working copy-paste examples consumers can run in their own apps (single, range,
FormField). Ensure it imports from `@commercetools/nimbus`.

- [ ] **Step 3: Typecheck the docs**

Run: `pnpm --filter @commercetools/nimbus typecheck:dev` Expected: no errors
(the `.docs.spec.tsx` compiles).

- [ ] **Step 4: Build the docs site to confirm MDX resolves**

Run: `pnpm --filter @commercetools/nimbus build 2>&1 | tail -20` Expected: build
succeeds; Slider docs page compiles. (If `build:docs` is a separate step in this
repo, run that instead.)

- [ ] **Step 5: Commit**

```bash
git add packages/nimbus/src/components/slider
git commit -m "docs(slider): add developer, designer, and a11y documentation"
```

---

## Final verification (after all tasks)

- [ ] **Full Slider + RangeSlider test run against source:**

```bash
pnpm test:storybook:dev packages/nimbus/src/components/slider/slider.stories.tsx packages/nimbus/src/components/slider/range-slider.stories.tsx
```

Expected: all stories green.

- [ ] **Built-surface verification (as CI runs it):**

```bash
pnpm --filter @commercetools/nimbus build
pnpm typecheck:strict
pnpm test:storybook packages/nimbus/src/components/slider/slider.stories.tsx packages/nimbus/src/components/slider/range-slider.stories.tsx
```

Expected: build + strict typecheck pass; built-bundle Storybook tests green.

- [ ] **Changeset:**

Run `pnpm changeset` and write a consumer-facing note (see
`docs/changeset-conventions.md`), e.g.: "Add `Slider` and `RangeSlider`
components for selecting a single value or a numeric range, with
horizontal/vertical orientation, tick marks, value output, and FormField
integration."

---

## Self-Review Notes (author)

- **Spec coverage:** two components sharing internals (T2/T3),
  horizontal+vertical (T4), sizes (T4), value tooltip on thumbs (T2), ticks
  (T5), label+FormField (T6), token-driven visuals (T1), i18n thumb labels (T6),
  single `slider/` directory (Global Constraints), full file set + docs (T7),
  testing plan (each task + Final verification). No min/max bound labels and no
  N>2 thumbs — matches the spec's out-of-scope list.
- **Type consistency:** `SliderBaseProps` (union) is consumed by both wrappers;
  `SliderProps` (`number`) and `RangeSliderProps` (`[number, number]`) are the
  only public value types. Slot names are identical across recipe, slots, and
  `SliderBase`
  (`root`/`label`/`output`/`track`/`fill`/`thumb`/`tick`/`tickLabel`).
  `sliderMessagesStrings` name matches the i18n compile output convention.
- **Open detail deferred to implementation:** exact keys in
  `FormFieldContext.inputProps` (T6, Step 5 instructs reading
  `form-field.context.tsx`) and exact token names in the recipe (T1 note) — both
  are verify-and-adjust steps, not unspecified logic.
