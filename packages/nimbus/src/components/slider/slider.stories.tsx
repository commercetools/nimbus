import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormField, Grid, Slider, Stack, Text } from "@commercetools/nimbus";
import { within, expect, userEvent, fn } from "storybook/test";

// Visual smoke-test axes. The full matrix is every combination of these, for
// both orientations — 2 × 2 × 2 × 2 = 16 cells.
const SMOKE_VARIANTS = ["plain", "enclosed"] as const;
const SMOKE_SIZES = ["sm", "md"] as const;
const SMOKE_DISABLED = [false, true] as const;
const SMOKE_ORIENTATIONS = ["horizontal", "vertical"] as const;

// Set once on an ancestor; vertical slider roots read this custom property for
// their length (`var(--slider-vertical-length, 200px)` in slider.recipe.ts),
// and it cascades to every vertical cell. Horizontal sliders ignore it.
const smokeVerticalLength = {
  "--slider-vertical-length": "140px",
} as CSSProperties;

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
        // React Aria's SliderThumb renders a native <input type="range">;
        // its accessible value comes from the `value` DOM property (implicit
        // ARIA mapping), not an explicit `aria-valuenow` attribute.
        await expect(thumb).toHaveValue("30");
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
        await expect(thumb).toHaveValue("31");
        await expect(tip).toHaveTextContent("31");
        // `SliderBase` accepts `number | number[]` internally so the same
        // implementation can serve RangeSlider too — the `props as
        // SliderBaseProps` cast in `slider.tsx` erases the compiler's check
        // that a plain `Slider`'s `onChange` only ever receives a bare
        // `number` (never an array). Assert the real runtime shape.
        await expect(args.onChange).toHaveBeenCalledWith(31);
      }
    );

    await step("jumps to max with End", async () => {
      await userEvent.keyboard("{End}");
      await expect(thumb).toHaveValue("100");
    });

    await step("jumps to min with Home", async () => {
      await userEvent.keyboard("{Home}");
      await expect(thumb).toHaveValue("0");
    });

    await step(
      "PageUp increases by React Aria's larger page step",
      async () => {
        // React Aria's default page step is
        // max(round((maxValue - minValue) / 10, step), step) — with
        // minValue=0, maxValue=100, step=1 (the default), that's 10, a
        // bigger jump than the single `step` used by ArrowRight/ArrowLeft.
        await userEvent.keyboard("{PageUp}");
        await expect(thumb).toHaveValue("10");
      }
    );

    await step("PageDown decreases by the same page step", async () => {
      await userEvent.keyboard("{PageDown}");
      await expect(thumb).toHaveValue("0");
    });
  },
};

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

    await step("root and thumb are marked vertical", async () => {
      // React Aria's Slider group sets `data-orientation` on the root div;
      // SliderThumb's underlying <input type="range"> gets a literal
      // `aria-orientation` attribute (unlike `aria-valuenow`, which is never
      // set — see the Base story comment above).
      await expect(root).toHaveAttribute("data-orientation", "vertical");
      await expect(thumb).toHaveAttribute("aria-orientation", "vertical");
    });

    await step("ArrowUp increases value", async () => {
      thumb.focus();
      await userEvent.keyboard("{ArrowUp}");
      await expect(thumb).toHaveValue("41");
    });
  },
};

/**
 * Regression guard for thumb cross-axis centering. React Aria positions the
 * thumb on the MAIN axis only (`left` for horizontal, `top` for vertical) plus
 * a `translate(-50%, -50%)`, and leaves the CROSS axis to CSS. Before the fix
 * the recipe never set the cross axis, so the translate pulled the thumb half a
 * thumb off-center (up on horizontal, inline-start on vertical).
 */
export const ThumbCentering: Story = {
  render: () => (
    <>
      <div data-testid="h">
        <Slider aria-label="Horizontal" defaultValue={50} />
      </div>
      <div data-testid="v" style={{ height: 200 }}>
        <Slider
          aria-label="Vertical"
          defaultValue={50}
          orientation="vertical"
        />
      </div>
    </>
  ),
  play: async ({ canvasElement, step }) => {
    const center = (el: Element) => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };
    const trackOf = (id: string) =>
      canvasElement.querySelector(`[data-testid="${id}"] [data-slot="track"]`)!;
    const thumbOf = (id: string) =>
      canvasElement.querySelector(`[data-testid="${id}"] [data-slot="thumb"]`)!;

    await step("horizontal thumb centers vertically on the track", async () => {
      const dy = Math.abs(center(thumbOf("h")).y - center(trackOf("h")).y);
      await expect(dy).toBeLessThanOrEqual(1.5);
    });

    await step("vertical thumb centers horizontally on the track", async () => {
      const dx = Math.abs(center(thumbOf("v")).x - center(trackOf("v")).x);
      await expect(dx).toBeLessThanOrEqual(1.5);
    });
  },
};

/** Both visual variants. Assertions lock each variant's distinguishing treatment. */
export const Variants: Story = {
  render: () => (
    <>
      <div data-testid="plain">
        <Slider aria-label="Plain" variant="plain" defaultValue={60} />
      </div>
      <div data-testid="enclosed">
        <Slider aria-label="Enclosed" variant="enclosed" defaultValue={75} />
      </div>
      <div data-testid="enclosed-invalid">
        <Slider
          aria-label="Enclosed invalid"
          variant="enclosed"
          isInvalid
          defaultValue={75}
        />
      </div>
    </>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const track = (id: string) =>
      canvasElement.querySelector(
        `[data-testid="${id}"] [data-slot="track"]`
      ) as HTMLElement;
    const trackH = (id: string) =>
      parseFloat(getComputedStyle(track(id)).height);

    await step("renders one slider per variant", async () => {
      // `[role="slider"]` (a literal-attribute CSS selector) never matches:
      // React Aria's SliderThumb renders a native <input type="range">, whose
      // "slider" role is implicit ARIA semantics, not a literal `role`
      // attribute in the DOM (confirmed via direct DOM inspection). Query by
      // computed accessible role instead, as the `Sizes` story above does.
      await expect(canvas.getAllByRole("slider")).toHaveLength(3);
    });

    await step(
      "enclosed track is a thick bar, thicker than plain",
      async () => {
        await expect(trackH("enclosed")).toBeGreaterThan(trackH("plain"));
      }
    );

    await step(
      "invalid state reasserts a visible border even though `enclosed` sets the thumb's base border to none",
      async () => {
        // Regression guard: the recipe's `"[data-invalid='true'] &"` thumb
        // selector re-asserts a border WIDTH (not just color) precisely
        // because `enclosed` sets `border: "none"` on the thumb — a color
        // with no width would be invisible. A zero width here would mean the
        // invalid state is silently lost on that variant.
        const thumb = canvasElement.querySelector(
          '[data-testid="enclosed-invalid"] [data-slot="thumb"]'
        ) as HTMLElement;
        const borderWidth = parseFloat(getComputedStyle(thumb).borderTopWidth);
        await expect(borderWidth).toBeGreaterThan(0);
      }
    );
  },
};

/**
 * Vertical orientation with tick marks. Regression guard for
 * orientation-aware tick positioning: before the fix, every tick anchored
 * with the recipe's static horizontal `top: 50%` and the inline `left: X%`
 * physical offset, so on a vertical track they rendered stacked at the same
 * height instead of distributed along the track.
 */
export const VerticalWithTicks: Story = {
  args: {
    "aria-label": "Level",
    defaultValue: 50,
    minValue: 0,
    maxValue: 100,
    step: 25,
    orientation: "vertical",
    showTicks: true,
  },
  play: async ({ canvasElement, step }) => {
    await step(
      "renders one tick per step, distributed along the vertical track",
      async () => {
        const ticks = Array.from(
          canvasElement.querySelectorAll<HTMLElement>('[data-slot="tick"]')
        );
        // 0, 25, 50, 75, 100 -> 5 ticks
        await expect(ticks).toHaveLength(5);

        // Each tick's resolved `bottom` offset must be distinct — if they
        // were still stacked at a shared cross-axis anchor (the pre-fix
        // `top: 50%` bug), every offset would collapse to the same value.
        const bottomOffsets = ticks.map(
          (tick) => getComputedStyle(tick).bottom
        );
        await expect(new Set(bottomOffsets).size).toBe(ticks.length);
      }
    );
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
      // 0, 25, 50, 75, 100 -> 5 ticks
      await expect(ticks).toHaveLength(5);
    });
  },
};

/**
 * Ticks stay legible over both the track and the fill by flipping color per
 * region. A tick that lands on the fill gets `data-filled` (set in slider-base)
 * and paints in `colorPalette.contrast` — the token that reads against the
 * primary fill; ticks on the bare track keep a strong neutral. Guards that the
 * correct ticks are flagged and the two regions render visibly different colors
 * (a single mid-neutral washed out on the fill, worst in dark mode).
 */
export const TicksContrastOverFill: Story = {
  args: {
    "aria-label": "Rating",
    defaultValue: 60,
    minValue: 0,
    maxValue: 100,
    step: 25,
    showTicks: true,
  },
  play: async ({ canvasElement, step }) => {
    const ticks = Array.from(
      canvasElement.querySelectorAll<HTMLElement>('[data-slot="tick"]')
    );

    await step(
      "ticks on the fill are flagged, ticks on the bare track are not",
      async () => {
        // value 60 → ticks at 0/25/50 sit on the fill, 75/100 on the track.
        await expect(ticks).toHaveLength(5);
        for (const i of [0, 1, 2]) {
          await expect(ticks[i]).toHaveAttribute("data-filled", "true");
        }
        for (const i of [3, 4]) {
          await expect(ticks[i]).not.toHaveAttribute("data-filled");
        }
      }
    );

    await step("filled and unfilled ticks paint different colors", async () => {
      const filled = getComputedStyle(ticks[0]).backgroundColor;
      const unfilled = getComputedStyle(ticks[4]).backgroundColor;
      await expect(filled).not.toBe(unfilled);
      // Both must be opaque paints — a `colorPalette.contrast` that failed to
      // resolve would fall back to transparent, still "differ" from the
      // neutral, yet render an invisible tick on the fill.
      await expect(filled).not.toBe("rgba(0, 0, 0, 0)");
      await expect(unfilled).not.toBe("rgba(0, 0, 0, 0)");
    });
  },
};

/**
 * The tick that sits directly under the thumb is painted over the white knob,
 * not the fill (ticks render above the thumbs), so it uses a knob-aware neutral
 * instead of `colorPalette.contrast` (which is tuned for the fill and can go
 * white-on-white on the knob in light mode). Guards that the on-thumb tick is
 * flagged and renders a color distinct from both an on-fill and an on-track
 * tick.
 */
export const TickUnderThumbIsKnobAware: Story = {
  args: {
    "aria-label": "Rating",
    defaultValue: 50,
    minValue: 0,
    maxValue: 100,
    step: 25,
    showTicks: true,
  },
  play: async ({ canvasElement, step }) => {
    const ticks = Array.from(
      canvasElement.querySelectorAll<HTMLElement>('[data-slot="tick"]')
    );

    await step(
      "only the tick under the thumb is flagged on-thumb",
      async () => {
        // ticks at 0/25/50/75/100 → the thumb at 50 sits on index 2.
        await expect(ticks).toHaveLength(5);
        await expect(ticks[2]).toHaveAttribute("data-on-thumb", "true");
        // an on-fill tick (25) and an on-track tick (100) are not on-thumb.
        await expect(ticks[1]).not.toHaveAttribute("data-on-thumb");
        await expect(ticks[4]).not.toHaveAttribute("data-on-thumb");
      }
    );

    await step(
      "the on-thumb tick differs from both on-fill and on-track ticks",
      async () => {
        const onThumb = getComputedStyle(ticks[2]).backgroundColor; // knob-aware
        const onFill = getComputedStyle(ticks[1]).backgroundColor; // contrast
        const onTrack = getComputedStyle(ticks[4]).backgroundColor; // neutral.9
        await expect(onThumb).not.toBe(onFill);
        await expect(onThumb).not.toBe(onTrack);
        await expect(onThumb).not.toBe("rgba(0, 0, 0, 0)");
      }
    );
  },
};

/**
 * Both slider variants share the Switch's control-size grid: the thumb is
 * `sizes.400` (16px) at sm and `sizes.600` (24px) at md, regardless of variant.
 * In the enclosed variant the bar is as tall as the thumb (Switch-like); the
 * plain variant keeps its thin track but the same knob. Guards the shared thumb
 * sizing and the enclosed bar height.
 */
export const SizesMatchSwitch: Story = {
  render: () => (
    <>
      {(["plain", "enclosed"] as const).flatMap((variant) =>
        (["sm", "md"] as const).map((size) => (
          <div key={`${variant}-${size}`} data-testid={`${variant}-${size}`}>
            <Slider
              aria-label={`${variant} ${size}`}
              variant={variant}
              size={size}
              defaultValue={50}
            />
          </div>
        ))
      )}
    </>
  ),
  play: async ({ canvasElement, step }) => {
    const box = (id: string, slot: string) =>
      canvasElement
        .querySelector(`[data-testid="${id}"] [data-slot="${slot}"]`)!
        .getBoundingClientRect();

    await step(
      "the thumb follows the Switch grid in both variants (sm 16px, md 24px)",
      async () => {
        for (const variant of ["plain", "enclosed"]) {
          await expect(box(`${variant}-sm`, "thumb").height).toBeCloseTo(16, 0);
          await expect(box(`${variant}-md`, "thumb").height).toBeCloseTo(24, 0);
        }
      }
    );

    await step("the enclosed bar is as tall as its thumb", async () => {
      await expect(box("enclosed-sm", "track").height).toBeCloseTo(16, 0);
      await expect(box("enclosed-md", "track").height).toBeCloseTo(24, 0);
    });

    await step(
      "the plain track is thinner than its knob (a line, not a bar)",
      async () => {
        // plain keeps a thin track; the enclosed bar is as tall as the thumb.
        await expect(box("plain-md", "track").height).toBeLessThan(
          box("plain-md", "thumb").height
        );
        await expect(box("plain-md", "track").height).toBeLessThan(
          box("enclosed-md", "track").height
        );
      }
    );
  },
};

/**
 * With the unified geometry, the plain thumb is contained within the bar at the
 * extremes too — no half-off overhang at 0/100. The interactive track is inset
 * by the thumb radius and the `::before` bar reaches back over the inset, so
 * the thumb's box stays inside the visible bar (the root box) at min and max.
 */
export const PlainThumbContainment: Story = {
  render: () => (
    <>
      <div data-testid="min">
        <Slider aria-label="Min" variant="plain" defaultValue={0} />
      </div>
      <div data-testid="max">
        <Slider aria-label="Max" variant="plain" defaultValue={100} />
      </div>
    </>
  ),
  play: async ({ canvasElement, step }) => {
    const rect = (id: string, slot: string) =>
      canvasElement
        .querySelector(`[data-testid="${id}"] [data-slot="${slot}"]`)!
        .getBoundingClientRect();

    await step("at min the thumb stays within the bar", async () => {
      const bar = rect("min", "root");
      const thumb = rect("min", "thumb");
      await expect(thumb.left).toBeGreaterThanOrEqual(bar.left - 0.5);
      await expect(thumb.right).toBeLessThanOrEqual(bar.right + 0.5);
    });

    await step("at max the thumb stays within the bar", async () => {
      const bar = rect("max", "root");
      const thumb = rect("max", "thumb");
      await expect(thumb.left).toBeGreaterThanOrEqual(bar.left - 0.5);
      await expect(thumb.right).toBeLessThanOrEqual(bar.right + 0.5);
    });
  },
};

/** Disabled slider does not respond to keyboard input. */
export const Disabled: Story = {
  args: {
    "aria-label": "Volume",
    defaultValue: 30,
    minValue: 0,
    maxValue: 100,
    isDisabled: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const thumb = canvas.getByRole("slider");
    const root = canvasElement.querySelector('[data-slot="root"]');

    await step("marks the root disabled", async () => {
      await expect(root).toHaveAttribute("data-disabled", "true");
    });

    await step("does not move on keyboard input", async () => {
      thumb.focus();
      await userEvent.keyboard("{ArrowRight}");
      // React Aria's SliderThumb renders a native <input type="range">; its
      // accessible value comes from the `value` DOM property (implicit ARIA
      // mapping), not an explicit `aria-valuenow` attribute.
      await expect(thumb).toHaveValue("30");
    });
  },
};

/**
 * `formatOptions` formats the value shown in the thumb's tooltip without
 * changing the underlying numeric value.
 */
export const FormattedValue: Story = {
  args: {
    "aria-label": "Discount",
    defaultValue: 0.2,
    minValue: 0,
    maxValue: 1,
    step: 0.01,
    formatOptions: { style: "percent" },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const thumb = canvas.getByRole("slider");

    await step(
      "shows the formatted value in the tooltip, proving formatOptions reaches getThumbValueLabel",
      async () => {
        // The raw numeric value stays untouched...
        await expect(thumb).toHaveValue("0.2");

        // ...but the tooltip (fed by `state.getThumbValueLabel`, see
        // slider-base.tsx) shows the formatted percentage instead.
        await userEvent.hover(thumb);
        const tip = await body.findByRole("tooltip");
        await expect(tip).toHaveTextContent("%");
        await userEvent.unhover(thumb);
      }
    );
  },
};

/**
 * Slider composed inside FormField. FormField.Input clones its
 * React-Aria-named `inputProps` (id/aria-labelledby/aria-describedby/
 * isInvalid/isDisabled/...) onto the Slider, associating the FormField
 * label + description and surfacing the invalid state.
 */
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
      // React Aria's slider group is labelled by the FormField label.
      const group = canvasElement.querySelector('[role="group"]') ?? root;
      await expect(group).toHaveAttribute("aria-labelledby");
      // The thumb itself must resolve to a real name. aria-labelledby is
      // not transitive per WAI-ARIA — the thumb's default `aria-labelledby`
      // (the group's own id) alone would resolve to nothing here, since the
      // group is named indirectly via the FormField <label>, not a literal
      // aria-label. React Aria always prepends the group's own id to the
      // thumb's aria-labelledby, and the group's content-based fallback name
      // picks up the thumb's live value (an embedded-control accname rule,
      // the same behavior as `<label>Age <input value="5"></label>` naming
      // itself "Age 5") — so match by substring rather than exact string.
      await expect(thumb).toHaveAccessibleName(/Opacity/);
    });

    await step("reflects the invalid state", async () => {
      await expect(root).toHaveAttribute("data-invalid", "true");
    });

    await step("remains operable", async () => {
      thumb.focus();
      await userEvent.keyboard("{ArrowRight}");
      // React Aria's SliderThumb renders a native <input type="range">; its
      // accessible value comes from the `value` DOM property (implicit ARIA
      // mapping), not an explicit `aria-valuenow` attribute.
      await expect(thumb).toHaveValue("51");
    });
  },
};

/**
 * The `enclosed` thumb must stay inside the bar at both extremes. React Aria
 * centers the thumb on its value point at the ends of its (inset) interactive
 * track, and the visible bar reaches back over that inset by a thumb radius, so
 * the thumb sits flush inside the bar. Regression guard: at min and max the
 * thumb's box stays within the visible bar (the root box, which the `::before`
 * bar spans).
 */
export const EnclosedThumbContainment: Story = {
  render: () => (
    <>
      <div data-testid="min">
        <Slider aria-label="Min" variant="enclosed" defaultValue={0} />
      </div>
      <div data-testid="max">
        <Slider aria-label="Max" variant="enclosed" defaultValue={100} />
      </div>
    </>
  ),
  play: async ({ canvasElement, step }) => {
    const rect = (id: string, slot: string) =>
      canvasElement
        .querySelector(`[data-testid="${id}"] [data-slot="${slot}"]`)!
        .getBoundingClientRect();

    // Half-pixel tolerance absorbs sub-pixel layout rounding. The bar spans the
    // root box; the interactive track is inset by a thumb radius within it.
    await step("at min value the thumb stays within the bar", async () => {
      const bar = rect("min", "root");
      const thumb = rect("min", "thumb");
      await expect(thumb.left).toBeGreaterThanOrEqual(bar.left - 0.5);
      await expect(thumb.right).toBeLessThanOrEqual(bar.right + 0.5);
    });

    await step("at max value the thumb stays within the bar", async () => {
      const bar = rect("max", "root");
      const thumb = rect("max", "thumb");
      await expect(thumb.left).toBeGreaterThanOrEqual(bar.left - 0.5);
      await expect(thumb.right).toBeLessThanOrEqual(bar.right + 0.5);
    });
  },
};

/**
 * The `enclosed` fill must cup the thumb at *every* value, not just 50%. The
 * thumb is shifted inward to stay contained, so a value-point fill (React
 * Aria's default) would trail the knob everywhere except center. This guards
 * the slider-base fill sizing: the fill's leading (max-side) edge lands on the
 * thumb's outer edge, and its transparent border shows the primary fill through
 * as a ring — including at value 0, where the fill still spans the whole knob
 * rather than collapsing to zero.
 */
export const EnclosedFillCupsThumb: Story = {
  render: () => (
    <>
      {[0, 50, 75, 100].map((v) => (
        <div key={v} data-testid={`v${v}`}>
          <Slider
            aria-label={`Value ${v}`}
            variant="enclosed"
            defaultValue={v}
          />
        </div>
      ))}
    </>
  ),
  play: async ({ canvasElement, step }) => {
    const el = (id: string, slot: string) =>
      canvasElement.querySelector(
        `[data-testid="${id}"] [data-slot="${slot}"]`
      ) as HTMLElement;
    const rect = (id: string, slot: string) =>
      el(id, slot).getBoundingClientRect();

    await step(
      "the fill's leading edge lands on the thumb's outer edge at every value",
      async () => {
        // Horizontal LTR: both the fill and the contained thumb end at their
        // right edge. Pre-fix, the value-point fill trailed the shifted thumb
        // by up to a thumb radius everywhere but 50% — well outside 1.5px.
        for (const v of [0, 50, 75, 100]) {
          const fill = rect(`v${v}`, "fill");
          const thumb = rect(`v${v}`, "thumb");
          await expect(Math.abs(fill.right - thumb.right)).toBeLessThanOrEqual(
            1.5
          );
        }
      }
    );

    await step("at value 0 the fill still spans the whole knob", async () => {
      const fill = rect("v0", "fill");
      const thumb = rect("v0", "thumb");
      // Primary is visible around the knob: the fill covers the thumb box
      // rather than collapsing to a zero-width sliver behind it.
      await expect(fill.width).toBeGreaterThanOrEqual(thumb.width - 1.5);
    });

    await step("the thumb's gap comes from a transparent border", async () => {
      const style = getComputedStyle(el("v50", "thumb"));
      await expect(style.borderTopStyle).toBe("solid");
      await expect(parseFloat(style.borderTopWidth)).toBeGreaterThan(0);
      // fully transparent → the primary fill shows through as the ring
      await expect(style.borderTopColor).toBe("rgba(0, 0, 0, 0)");
    });
  },
};

/**
 * `enclosed` ticks ride the same contained centerline as the thumb. Because the
 * thumb travel is inset by its radius, a raw-percent tick would drift from the
 * thumb it marks — worst at the extremes. Guards that the tick for a value lands
 * on the thumb's center when the thumb is at that value.
 */
export const EnclosedTicksAlignThumb: Story = {
  render: () => (
    <>
      <div data-testid="t25">
        <Slider
          aria-label="Ticks at 25"
          variant="enclosed"
          defaultValue={25}
          showTicks
          tickStep={25}
        />
      </div>
      <div data-testid="t100">
        <Slider
          aria-label="Ticks at 100"
          variant="enclosed"
          defaultValue={100}
          showTicks
          tickStep={25}
        />
      </div>
    </>
  ),
  play: async ({ canvasElement, step }) => {
    const centerX = (r: DOMRect) => (r.left + r.right) / 2;
    const drift = (id: string, tickIndex: number) => {
      const scope = `[data-testid="${id}"]`;
      const tick = canvasElement
        .querySelectorAll(`${scope} [data-slot="tick"]`)
        [tickIndex].getBoundingClientRect();
      const thumb = canvasElement
        .querySelector(`${scope} [data-slot="thumb"]`)!
        .getBoundingClientRect();
      return Math.abs(centerX(tick) - centerX(thumb));
    };

    await step(
      "the tick for the thumb's value sits under the thumb center",
      async () => {
        // tickStep 25 → ticks at 0,25,50,75,100 in ascending DOM order.
        await expect(drift("t25", 1)).toBeLessThanOrEqual(1.5); // value 25
        // value 100 is where a raw-percent tick drifts a full thumb radius.
        await expect(drift("t100", 4)).toBeLessThanOrEqual(1.5);
      }
    );
  },
};

/**
 * Clicking a tick lands the thumb on that value. This is the whole point of the
 * inset interactive track in the `enclosed` variant: because React Aria maps a
 * pointer to a value using the *same* track box it renders the thumb into, the
 * pixel a consumer clicks (the tick) maps back to exactly that tick's value —
 * no drift. Before the inset, the visual remap desynced click→value and the
 * thumb landed off the tick.
 */
export const EnclosedClickHitsTick: Story = {
  args: { onChange: fn() },
  render: (args) => (
    <div data-testid="c">
      <Slider
        aria-label="Click a tick"
        variant="enclosed"
        defaultValue={0}
        minValue={0}
        maxValue={100}
        showTicks
        tickStep={25}
        onChange={args.onChange}
      />
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const scope = '[data-testid="c"]';
    const track = canvasElement.querySelector(
      `${scope} [data-slot="track"]`
    ) as HTMLElement;
    const ticks = canvasElement.querySelectorAll(`${scope} [data-slot="tick"]`);
    const thumbInput = () =>
      canvasElement.querySelector(
        `${scope} [data-slot="thumb"] input`
      ) as HTMLInputElement;

    await step("clicking the 75% tick sets the value to 75", async () => {
      // Ticks at 0/25/50/75/100 in ascending order → index 3 is value 75. Click
      // the track at that tick's on-screen center, where a consumer would aim.
      const t = ticks[3].getBoundingClientRect();
      await userEvent.pointer({
        target: track,
        keys: "[MouseLeft]",
        coords: {
          clientX: (t.left + t.right) / 2,
          clientY: (t.top + t.bottom) / 2,
        },
      });
      await expect(thumbInput().value).toBe("75");
    });
  },
};

/**
 * A click in the bar's end-cap — the rounded region beyond the first/last tick,
 * which extends past the inset interactive track — still moves the thumb. The
 * full-width `::before` bar keeps pointer events, so a click there hit-tests to
 * the track (a pseudo-element's clicks target its host) and React Aria clamps
 * the out-of-range position to the max. Guards against the cap being a dead
 * zone (it was while the bar was `pointer-events: none`).
 */
export const EnclosedClickPastLastTick: Story = {
  render: () => (
    <div data-testid="cap">
      <Slider
        aria-label="Click the cap"
        variant="enclosed"
        defaultValue={0}
        minValue={0}
        maxValue={100}
        showTicks
        tickStep={25}
      />
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const scope = '[data-testid="cap"]';
    const bar = canvasElement
      .querySelector(`${scope} [data-slot="root"]`)!
      .getBoundingClientRect();
    const thumbInput = () =>
      canvasElement.querySelector(
        `${scope} [data-slot="thumb"] input`
      ) as HTMLInputElement;

    await step("a click in the trailing cap snaps to the max", async () => {
      // A point inside the rounded cap, past the last tick (which sits at the
      // inset track's right edge, a thumb radius in from the bar edge).
      const capX = bar.right - 2;
      const capY = (bar.top + bar.bottom) / 2;
      // Real hit-test: pre-fix this resolved to a non-interactive node and the
      // click did nothing; now it resolves into the slider (the bar's host).
      const hit = document.elementFromPoint(capX, capY) as HTMLElement;
      await expect(canvasElement.contains(hit)).toBe(true);
      await userEvent.pointer({
        target: hit,
        keys: "[MouseLeft]",
        coords: { clientX: capX, clientY: capY },
      });
      await expect(thumbInput().value).toBe("100");
    });
  },
};

/**
 * Keyboard focus paints the Nimbus focus ring on the thumb. Regression guard
 * for a bug where no thumb showed a ring: the thumb must use
 * `focusVisibleRing` (its selector matches React Aria's `data-focus-visible`),
 * not `focusRing` (whose `:focus`/`[data-focus]` selector never matches — focus
 * lives on the visually-hidden inner <input>, and React Aria marks the styled
 * div with `data-focus-visible`, not `data-focus`).
 */
export const FocusRing: Story = {
  args: {
    "aria-label": "Volume",
    defaultValue: 30,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const thumb = canvas.getByRole("slider");
    const thumbEl = canvasElement.querySelector(
      '[data-slot="thumb"]'
    ) as HTMLElement;

    await step(
      "keyboard focus paints a visible outline on the thumb",
      async () => {
        await userEvent.tab();
        await expect(thumb).toHaveFocus();
        // React Aria marks the styled thumb div with data-focus-visible under
        // keyboard modality; the recipe's focusVisibleRing keys off it.
        await expect(thumbEl).toHaveAttribute("data-focus-visible", "true");
        const outlineWidth = parseFloat(getComputedStyle(thumbEl).outlineWidth);
        await expect(outlineWidth).toBeGreaterThan(0);
      }
    );
  },
};

/**
 * Visual smoke test: every combination of orientation × variant × size ×
 * disabled-state rendered in one grid, so the whole visual surface can be
 * eyeballed at once and any combination that fails to mount is caught. The
 * play function only asserts that all 16 cells rendered (nothing threw).
 */
export const SmokeTest: Story = {
  render: () => (
    // Custom property set on a plain ancestor so it cascades to every vertical
    // slider root below (CSS custom properties inherit).
    <div style={smokeVerticalLength}>
      <Stack direction="column" gap="800">
        {SMOKE_ORIENTATIONS.map((orientation) => (
          <Stack key={orientation} direction="column" gap="500">
            <Text fontWeight="700" textTransform="capitalize">
              {orientation}
            </Text>
            {SMOKE_VARIANTS.map((variant) => (
              <Stack key={variant} direction="column" gap="200">
                <Text fontWeight="600" color="neutral.11">
                  {variant}
                </Text>
                <Grid
                  templateColumns={
                    orientation === "vertical"
                      ? "repeat(4, max-content)"
                      : "repeat(2, minmax(0, 1fr))"
                  }
                  gap="600"
                  alignItems="start"
                >
                  {SMOKE_SIZES.flatMap((size) =>
                    SMOKE_DISABLED.map((isDisabled) => {
                      const label = `${size} · ${
                        isDisabled ? "disabled" : "enabled"
                      }`;
                      return (
                        <Stack key={label} direction="column" gap="100">
                          <Text fontSize="300" color="neutral.11">
                            {label}
                          </Text>
                          <Slider
                            aria-label={`${orientation} ${variant} ${label}`}
                            variant={variant}
                            size={size}
                            orientation={orientation}
                            isDisabled={isDisabled}
                            defaultValue={60}
                            showTicks
                            tickStep={25}
                          />
                        </Stack>
                      );
                    })
                  )}
                </Grid>
              </Stack>
            ))}
          </Stack>
        ))}
      </Stack>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("every combination in the matrix renders", async () => {
      // 2 orientations × 2 variants × 2 sizes × 2 disabled-states = 16 cells,
      // one thumb each. A missing count means some combination failed to mount.
      await expect(canvas.getAllByRole("slider")).toHaveLength(16);
    });
  },
};
