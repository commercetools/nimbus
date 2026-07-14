import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Dialog,
  FormField,
  Grid,
  Slider,
  Stack,
  Text,
} from "@commercetools/nimbus";
import { within, expect, userEvent, fn, waitFor } from "storybook/test";

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

/**
 * Uncontrolled single-value slider. No visible label or output; the value shows
 * in a per-thumb tooltip. Covers the keyboard model (arrows, Home/End, the
 * larger Page step), the hover/focus tooltip, and the keyboard focus ring.
 */
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
    const thumbEl = canvasElement.querySelector(
      '[data-slot="thumb"]'
    ) as HTMLElement;

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

    await step("paints a focus ring under keyboard focus", async () => {
      // Regression guard for a bug where no thumb showed a ring: the thumb must
      // use `focusVisibleRing` (its selector matches React Aria's
      // `data-focus-visible`), not `focusRing` (whose `:focus`/`[data-focus]`
      // selector never matches — focus lives on the visually-hidden inner
      // <input>, and React Aria marks the styled div with `data-focus-visible`,
      // not `data-focus`). Focus is already on the thumb from the step above.
      await expect(thumbEl).toHaveAttribute("data-focus-visible", "true");
      const outlineWidth = parseFloat(getComputedStyle(thumbEl).outlineWidth);
      await expect(outlineWidth).toBeGreaterThan(0);
    });

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

/**
 * Horizontal and vertical orientation. Beyond the vertical keyboard/ARIA
 * wiring, this guards thumb cross-axis centering: React Aria positions the thumb
 * on the MAIN axis only (`left` for horizontal, `top` for vertical) plus a
 * `translate(-50%, -50%)`, leaving the CROSS axis to CSS. Before the fix the
 * recipe never set the cross axis, so the translate pulled the thumb half a
 * thumb off-center (up on horizontal, inline-start on vertical).
 */
export const Orientation: Story = {
  render: () => (
    <Stack direction="row" gap="800" alignItems="center">
      {/* The slider root is `width: 100%`; give the horizontal wrapper a real
          width so it doesn't collapse to the thumb inside the flex row. */}
      <div data-testid="h" style={{ width: 300 }}>
        <Slider aria-label="Horizontal" defaultValue={50} />
      </div>
      <div data-testid="v" style={{ height: 200 }}>
        <Slider
          aria-label="Vertical"
          defaultValue={40}
          orientation="vertical"
        />
      </div>
    </Stack>
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
    const vRoot = canvasElement.querySelector(
      '[data-testid="v"] [data-slot="root"]'
    );
    const vThumb = canvasElement.querySelector(
      '[data-testid="v"] input'
    ) as HTMLInputElement;

    await step("the vertical root and thumb are marked vertical", async () => {
      // React Aria's Slider group sets `data-orientation` on the root div;
      // SliderThumb's underlying <input type="range"> gets a literal
      // `aria-orientation` attribute (unlike `aria-valuenow`, which is never
      // set — see the Base story comment above).
      await expect(vRoot).toHaveAttribute("data-orientation", "vertical");
      await expect(vThumb).toHaveAttribute("aria-orientation", "vertical");
    });

    await step("ArrowUp increases the vertical value", async () => {
      vThumb.focus();
      await userEvent.keyboard("{ArrowUp}");
      await expect(vThumb).toHaveValue("41");
    });

    await step(
      "the horizontal thumb centers vertically on its track",
      async () => {
        const dy = Math.abs(center(thumbOf("h")).y - center(trackOf("h")).y);
        await expect(dy).toBeLessThanOrEqual(1.5);
      }
    );

    await step(
      "the vertical thumb centers horizontally on its track",
      async () => {
        const dx = Math.abs(center(thumbOf("v")).x - center(trackOf("v")).x);
        await expect(dx).toBeLessThanOrEqual(1.5);
      }
    );
  },
};

/**
 * Both slider variants share the Switch's control-size grid: the thumb is
 * `sizes.400` (16px) at sm and `sizes.600` (24px) at md, regardless of variant.
 * In the enclosed variant the bar is as tall as the thumb (Switch-like); the
 * plain variant keeps its thin track but the same knob. Doubles as the sizes
 * showcase, and guards the shared thumb sizing and the enclosed bar height.
 */
export const Sizes: Story = {
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
 * The two visual variants — `plain` (thin track) and `enclosed` (iOS-style bar
 * with the knob inside it) — across the value range, plus an invalid enclosed.
 * Both share one inset geometry, and the play function locks in what that
 * geometry buys: the enclosed bar reads as a thick bar, thumbs stay contained at
 * the extremes in both variants, the enclosed fill cups the thumb at every
 * value (its transparent border showing the primary fill through as a ring), and
 * the invalid state still paints a visible thumb border even though `enclosed`
 * drops the base border.
 */
export const Variants: Story = {
  render: () => (
    <Stack direction="column" gap="400">
      {(["plain", "enclosed"] as const).map((variant) => (
        <Stack key={variant} direction="column" gap="200">
          {(variant === "plain" ? [0, 50, 100] : [0, 50, 75, 100]).map((v) => (
            <div key={v} data-testid={`${variant}-${v}`}>
              <Slider
                aria-label={`${variant} ${v}`}
                variant={variant}
                defaultValue={v}
              />
            </div>
          ))}
        </Stack>
      ))}
      <div data-testid="enclosed-invalid">
        <Slider
          aria-label="Enclosed invalid"
          variant="enclosed"
          isInvalid
          defaultValue={50}
        />
      </div>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const el = (id: string, slot: string) =>
      canvasElement.querySelector(
        `[data-testid="${id}"] [data-slot="${slot}"]`
      ) as HTMLElement;
    const rect = (id: string, slot: string) =>
      el(id, slot).getBoundingClientRect();

    await step("renders both variants across the value range", async () => {
      // `[role="slider"]` (a literal-attribute CSS selector) never matches:
      // React Aria's SliderThumb renders a native <input type="range">, whose
      // "slider" role is implicit ARIA semantics, not a literal `role`
      // attribute in the DOM. Query by computed accessible role instead.
      // plain [0,50,100] + enclosed [0,50,75,100] + invalid = 8.
      await expect(canvas.getAllByRole("slider")).toHaveLength(8);
    });

    await step(
      "the enclosed track is a thick bar, thicker than plain",
      async () => {
        const enclosedH = rect("enclosed-50", "track").height;
        const plainH = rect("plain-50", "track").height;
        await expect(enclosedH).toBeGreaterThan(plainH);
      }
    );

    await step(
      "the thumb stays within the bar at min and max in both variants",
      async () => {
        // Unified geometry: the interactive track is inset by a thumb radius
        // and the `::before` bar reaches back over it, so React Aria positions
        // the thumb natively-contained and its box stays inside the visible bar
        // (the root box) at 0/100 — no half-off overhang. Half-pixel tolerance
        // absorbs sub-pixel layout rounding.
        for (const variant of ["plain", "enclosed"]) {
          for (const value of [0, 100]) {
            const bar = rect(`${variant}-${value}`, "root");
            const thumb = rect(`${variant}-${value}`, "thumb");
            await expect(thumb.left).toBeGreaterThanOrEqual(bar.left - 0.5);
            await expect(thumb.right).toBeLessThanOrEqual(bar.right + 0.5);
          }
        }
      }
    );

    await step(
      "the enclosed fill cups the thumb's outer edge at every value",
      async () => {
        // The thumb is shifted inward to stay contained, so a value-point fill
        // (React Aria's default) would trail the knob everywhere but center.
        // slider-base sizes the fill so its leading (max-side) edge lands on the
        // thumb's outer edge instead. Horizontal LTR: both end at their right
        // edge. Pre-fix, the value-point fill trailed the shifted thumb by up to
        // a thumb radius everywhere but 50% — well outside 1.5px.
        for (const v of [0, 50, 75, 100]) {
          const fill = rect(`enclosed-${v}`, "fill");
          const thumb = rect(`enclosed-${v}`, "thumb");
          await expect(Math.abs(fill.right - thumb.right)).toBeLessThanOrEqual(
            1.5
          );
        }
      }
    );

    await step(
      "at value 0 the enclosed fill still spans the whole knob",
      async () => {
        const fill = rect("enclosed-0", "fill");
        const thumb = rect("enclosed-0", "thumb");
        // Primary is visible around the knob: the fill covers the thumb box
        // rather than collapsing to a zero-width sliver behind it.
        await expect(fill.width).toBeGreaterThanOrEqual(thumb.width - 1.5);
      }
    );

    await step(
      "the enclosed thumb's gap comes from a transparent border",
      async () => {
        const style = getComputedStyle(el("enclosed-50", "thumb"));
        await expect(style.borderTopStyle).toBe("solid");
        await expect(parseFloat(style.borderTopWidth)).toBeGreaterThan(0);
        // fully transparent → the primary fill shows through as the ring
        await expect(style.borderTopColor).toBe("rgba(0, 0, 0, 0)");
      }
    );

    await step(
      "the invalid state reasserts a visible thumb border even though `enclosed` drops the base border",
      async () => {
        // Regression guard: the recipe's `"[data-invalid='true'] &"` thumb
        // selector re-asserts a border WIDTH (not just color) precisely because
        // `enclosed` gives the thumb a transparent border — a color with no
        // width would be invisible. A zero width here would mean the invalid
        // state is silently lost on that variant.
        const borderWidth = parseFloat(
          getComputedStyle(el("enclosed-invalid", "thumb")).borderTopWidth
        );
        await expect(borderWidth).toBeGreaterThan(0);
      }
    );
  },
};

/**
 * Tick marks along the track. Covers tick generation (one per step, in both
 * orientations), region-aware tick contrast, tick-to-thumb alignment on the
 * inset track, and pointer-to-value mapping (clicking a tick, and clicking the
 * rounded end-cap past the last tick).
 */
export const Ticks: Story = {
  args: { onChange: fn() },
  render: (args) => (
    <Stack direction="column" gap="400">
      <div data-testid="h">
        <Slider aria-label="Rating" defaultValue={50} step={25} showTicks />
      </div>
      <div data-testid="v" style={{ height: 200 }}>
        <Slider
          aria-label="Level"
          defaultValue={50}
          step={25}
          showTicks
          orientation="vertical"
        />
      </div>
      <div data-testid="align-25">
        <Slider
          aria-label="Aligned at 25"
          variant="enclosed"
          defaultValue={25}
          showTicks
          tickStep={25}
        />
      </div>
      <div data-testid="align-100">
        <Slider
          aria-label="Aligned at 100"
          variant="enclosed"
          defaultValue={100}
          showTicks
          tickStep={25}
        />
      </div>
      <div data-testid="click">
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
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const ticksOf = (id: string) =>
      Array.from(
        canvasElement.querySelectorAll<HTMLElement>(
          `[data-testid="${id}"] [data-slot="tick"]`
        )
      );

    await step("renders one tick per step from min to max", async () => {
      // 0, 25, 50, 75, 100 -> 5 ticks
      await expect(ticksOf("h")).toHaveLength(5);
    });

    await step(
      "vertical ticks distribute along the track, not stacked",
      async () => {
        const ticks = ticksOf("v");
        await expect(ticks).toHaveLength(5);
        // Each tick's resolved `bottom` offset must be distinct — if they were
        // still stacked at a shared cross-axis anchor (the pre-fix `top: 50%`
        // bug), every offset would collapse to the same value.
        const bottomOffsets = ticks.map((t) => getComputedStyle(t).bottom);
        await expect(new Set(bottomOffsets).size).toBe(ticks.length);
      }
    );

    await step(
      "each tick is flagged for the region it lands in (track / fill / thumb)",
      async () => {
        // Horizontal slider at value 50: ticks at 0/25 sit on the fill, 50 under
        // the thumb, 75/100 on the bare track. A tick on the fill gets
        // `data-filled` (set in slider-base); a tick under the thumb also gets
        // `data-on-thumb`.
        const ticks = ticksOf("h");
        for (const i of [0, 1, 2]) {
          await expect(ticks[i]).toHaveAttribute("data-filled", "true");
        }
        for (const i of [3, 4]) {
          await expect(ticks[i]).not.toHaveAttribute("data-filled");
        }
        await expect(ticks[2]).toHaveAttribute("data-on-thumb", "true");
        await expect(ticks[0]).not.toHaveAttribute("data-on-thumb");
        await expect(ticks[4]).not.toHaveAttribute("data-on-thumb");
      }
    );

    await step(
      "on-fill, on-track and on-thumb ticks paint distinct opaque colors",
      async () => {
        // The fill-tuned `colorPalette.contrast` reads against the primary fill
        // but can go white-on-white on the light knob, so an on-thumb tick uses
        // a knob-aware neutral instead; an on-track tick keeps a strong neutral.
        const ticks = ticksOf("h");
        const onFill = getComputedStyle(ticks[0]).backgroundColor; // contrast
        const onThumb = getComputedStyle(ticks[2]).backgroundColor; // knob-aware
        const onTrack = getComputedStyle(ticks[4]).backgroundColor; // neutral.9
        await expect(onFill).not.toBe(onTrack);
        await expect(onThumb).not.toBe(onFill);
        await expect(onThumb).not.toBe(onTrack);
        // All must be opaque — a `colorPalette.contrast` that failed to resolve
        // would fall back to transparent, still "differ", yet render invisible.
        for (const color of [onFill, onThumb, onTrack]) {
          await expect(color).not.toBe("rgba(0, 0, 0, 0)");
        }
      }
    );

    await step(
      "the tick for the thumb's value sits under the thumb center",
      async () => {
        // Because the thumb travel is inset by its radius, a raw-percent tick
        // would drift from the thumb it marks — worst at the extremes. tickStep
        // 25 → ticks at 0,25,50,75,100 in ascending DOM order.
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
        await expect(drift("align-25", 1)).toBeLessThanOrEqual(1.5); // value 25
        // value 100 is where a raw-percent tick drifts a full thumb radius.
        await expect(drift("align-100", 4)).toBeLessThanOrEqual(1.5);
      }
    );

    await step(
      "clicking a tick lands on it, and a cap click snaps to the max",
      async () => {
        // React Aria maps a pointer to a value using the *same* inset track box
        // it renders the thumb into, so the pixel a consumer clicks (the tick)
        // maps back to exactly that tick's value — no drift. And the full-width
        // `::before` bar keeps pointer events (a pseudo-element's clicks target
        // its host), so a click in the rounded end-cap past the last tick still
        // reaches React Aria, which clamps the out-of-range position to the max.
        const scope = '[data-testid="click"]';
        const track = canvasElement.querySelector(
          `${scope} [data-slot="track"]`
        ) as HTMLElement;
        const ticks = canvasElement.querySelectorAll(
          `${scope} [data-slot="tick"]`
        );
        const thumbInput = () =>
          canvasElement.querySelector(
            `${scope} [data-slot="thumb"] input`
          ) as HTMLInputElement;

        // Ticks at 0/25/50/75/100 in ascending order → index 3 is value 75.
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

        const bar = canvasElement
          .querySelector(`${scope} [data-slot="root"]`)!
          .getBoundingClientRect();
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
      }
    );
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

/**
 * WCAG 2.1 SC 1.4.13 (Content on Hover or Focus): the value tooltip is
 * dismissible with Escape without moving the pointer or focus. React Aria's
 * TooltipTrigger installs a document-level Escape listener while the tooltip is
 * open; because `SliderBase` drives the tooltip's open state itself, it must
 * honor that close request (see the `isDismissed` handling in
 * `slider-base.tsx`). After dismissal the thumb keeps focus and stays dismissed
 * for the rest of that focus "session"; a fresh hover re-arms and reopens it.
 */
export const EscapeDismissesTooltip: Story = {
  args: {
    "aria-label": "Volume",
    defaultValue: 30,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const thumb = canvas.getByRole("slider");

    await step(
      "Escape dismisses the focused tooltip without moving focus",
      async () => {
        await userEvent.tab();
        await expect(thumb).toHaveFocus();
        await expect(await body.findByRole("tooltip")).toHaveTextContent("30");

        await userEvent.keyboard("{Escape}");
        await waitFor(() =>
          expect(body.queryByRole("tooltip")).not.toBeInTheDocument()
        );
        // The whole point of 1.4.13: dismissed in place. Focus never left the
        // thumb, so a keyboard user has not lost their position.
        await expect(thumb).toHaveFocus();
      }
    );

    await step("it stays dismissed while the thumb keeps focus", async () => {
      // ArrowRight keeps focus on the thumb, so the tooltip must not reappear —
      // dismissal holds until the focus/hover session ends and re-arms it.
      await userEvent.keyboard("{ArrowRight}");
      await expect(thumb).toHaveValue("31");
      await expect(body.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    await step("a fresh hover re-arms and reopens the tooltip", async () => {
      // Tab away to end the focus session (re-arms the dismissal), then hover.
      await userEvent.tab();
      await waitFor(() => expect(thumb).not.toHaveFocus());
      await userEvent.hover(thumb);
      await expect(await body.findByRole("tooltip")).toHaveTextContent("31");
      await userEvent.unhover(thumb);
    });
  },
};

/**
 * Regression: a Slider nested in a Dialog must not trap Escape, and one Escape
 * must not close both the tooltip and the Dialog. While a thumb is focused its
 * value tooltip is open; the slider owns Escape for the visible tooltip
 * (dismiss it, and `stopPropagation` so an enclosing overlay is untouched),
 * then a second Escape reaches the Dialog — the conventional
 * inner-overlay-first layering.
 *
 * NOTE: the trickiest variant of this bug — pressing an arrow key first, which
 * desyncs React Aria's internal tooltip state from our controlled `isOpen` —
 * only reproduces under real browser key events, not Storybook's synthetic
 * `userEvent` (which doesn't trigger React Aria's value-change close). This
 * story exercises the arrow-then-Escape sequence for documentation, but the
 * desync path itself was verified manually in a real browser; `userEvent` can't
 * regression-guard it.
 */
export const SliderInDialog: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger>Open settings</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Settings</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <Slider aria-label="Volume" defaultValue={30} />
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    await step("open the dialog", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: /open settings/i })
      );
      await waitFor(() => expect(body.getByRole("dialog")).toBeInTheDocument());
    });

    const thumb = body.getByRole("slider");

    await step(
      "keyboard-focus the slider thumb so its value tooltip opens",
      async () => {
        // Tab from the dialog's initial focus onto the thumb; keyboard modality
        // and the focus event open the tooltip (its document Escape listener is
        // now armed).
        for (let i = 0; i < 6 && document.activeElement !== thumb; i++) {
          await userEvent.tab();
        }
        await expect(thumb).toHaveFocus();
        await expect(await body.findByRole("tooltip")).toHaveTextContent("30");
      }
    );

    await step(
      "change the value first (the real-browser desync trigger)",
      async () => {
        // Under real key events this is what desyncs React Aria's internal
        // tooltip state from our controlled open state (see the story doc). It
        // is a no-op for the desync under synthetic `userEvent`, but keeps the
        // sequence faithful and guards that a value change doesn't break the
        // layering that IS reproducible here.
        await userEvent.keyboard("{ArrowRight}");
        await expect(thumb).toHaveValue("31");
        await expect(await body.findByRole("tooltip")).toHaveTextContent("31");
      }
    );

    await step(
      "first Escape dismisses the tooltip only — the dialog stays open",
      async () => {
        await userEvent.keyboard("{Escape}");
        await waitFor(() =>
          expect(body.queryByRole("tooltip")).not.toBeInTheDocument()
        );
        await expect(body.getByRole("dialog")).toBeInTheDocument();
        await expect(thumb).toHaveFocus();
      }
    );

    await step("second Escape closes the dialog", async () => {
      await userEvent.keyboard("{Escape}");
      await waitFor(() =>
        expect(body.queryByRole("dialog")).not.toBeInTheDocument()
      );
    });
  },
};
