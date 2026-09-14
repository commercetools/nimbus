import type { Meta } from "@storybook/react-vite";
import { within, expect } from "storybook/test";
import { StatCard } from "./stat-card";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";

// .storybook/preview.tsx already wraps every story in ChartThemeProvider
// (following the dark-mode toggle) and enables addon-a11y in `test: "error"`
// mode, so neither is repeated per story here.
const meta: Meta = {
  title: "Charts/StatCard",
  render: () => <RegistryPreview base="StatCard" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

/**
 * Proves the accessibility model `stat-card.mdx` claims — different from the
 * drawn (SVG) charts, since `StatCard` renders real DOM text: a labeled
 * `role="group"`, an `aria-hidden` arrow glyph, and a signed percentage that
 * itself carries direction to assistive tech (not the arrow/color alone).
 */
export const Accessibility: BaseStory = {
  render: () => (
    <StatCard
      label="Monthly revenue"
      value={128400}
      previous={112900}
      ariaLabel="Monthly revenue, up 13.7% versus the prior month"
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("The card is a labeled group", async () => {
      const group = canvas.getByRole("group");
      expect(group).toHaveAttribute(
        "aria-label",
        "Monthly revenue, up 13.7% versus the prior month"
      );
    });

    await step(
      "The arrow is decorative; the percentage carries direction",
      async () => {
        const arrow = canvasElement.querySelector("[aria-hidden]");
        expect(arrow).toBeInTheDocument();
        expect(arrow?.textContent).toBe("▲");
        // The signed percentage is plain, readable text alongside it.
        expect(canvas.getByText("+14%")).toBeInTheDocument();
      }
    );
  },
};

/**
 * `invertDelta`: the arrow always follows the true direction; only the
 * valence color flips, so a "lower is better" metric's improvement still
 * reads positive.
 */
export const InvertDelta: BaseStory = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      <StatCard label="Monthly revenue" value={128400} previous={112900} />
      <StatCard
        label="Refund rate"
        value={2.1}
        previous={2.8}
        format={(n) => `${n}%`}
        invertDelta
      />
    </div>
  ),
};

/** `previous` omitted or `0`: no delta row (undefined against a zero baseline). */
export const EdgeCaseNoDelta: BaseStory = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      <StatCard label="No prior value" value={128400} />
      <StatCard label="Zero baseline" value={128400} previous={0} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    // Only the two label/value spans per card — no third (delta) span.
    const groups = canvasElement.querySelectorAll('[role="group"]');
    expect(groups.length).toBe(2);
    for (const group of Array.from(groups)) {
      expect(group.querySelectorAll("span").length).toBe(2);
    }
  },
};

/**
 * The bug found while introspecting this chart: dividing by a signed
 * `previous` let the percentage's sign contradict its own arrow and color
 * once `previous` was negative (e.g. a loss turning into a profit) — `pct`
 * computed as `delta / previous` flips sign independently of `delta` itself.
 * Fixed by dividing by `Math.abs(previous)`. This asserts the three signals
 * (arrow, color, percentage sign) agree for a negative-`previous` case, the
 * same way they already agree for an ordinary positive-`previous` case —
 * not just that the card "renders something".
 */
export const EdgeCaseNegativePrevious: BaseStory = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      <StatCard label="Ordinary increase" value={110} previous={100} />
      <StatCard label="Loss turned profit" value={50} previous={-100} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const ordinary = canvas.getByRole("group", { name: "Ordinary increase" });
    const recovered = canvas.getByRole("group", { name: "Loss turned profit" });

    const deltaSpanOf = (group: HTMLElement) =>
      group.querySelector("span:last-of-type") as HTMLElement;

    const ordinaryDelta = deltaSpanOf(ordinary);
    const recoveredDelta = deltaSpanOf(recovered);

    // Both are increases (▲) …
    expect(ordinaryDelta.querySelector("[aria-hidden]")?.textContent).toBe("▲");
    expect(recoveredDelta.querySelector("[aria-hidden]")?.textContent).toBe(
      "▲"
    );
    // … so both must render the SAME (positive) valence color — the bug's
    // visible symptom was the color/arrow saying "good" while the number
    // read negative.
    expect(recoveredDelta.style.color).toBe(ordinaryDelta.style.color);
    // And the percentage itself must be positive, not "−150%".
    expect(canvas.getByText("+150%")).toBeInTheDocument();
    expect(canvas.queryByText(/−150%/)).not.toBeInTheDocument();
  },
};

// No Responsive story: stat-card.mdx states this chart is "self-sizing —
// renders text in a flex column and ignores width/height" (confirmed in
// source — StatCardProps has no width/height at all), so wrapping it in
// ResponsiveContainer would test a capability it deliberately doesn't have.
