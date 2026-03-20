# nimbus components — render performance experiments

Autonomous render performance optimization for `@commercetools/nimbus` components using the `@github-ui/storybook-addon-performance-panel` and React Profiler API.

## Setup

To set up a new experiment, work with the user to:

1. **Agree on a run tag**: propose a tag based on today's date (e.g. `mar19`). The branch `perf/nimbus-render/<tag>` must not already exist.
2. **Create the branch**: `git checkout -b perf/nimbus-render/<tag>` from current main.
3. **Read the in-scope files**: Read these for full context:
   - `packages/nimbus/.storybook/preview.tsx` — global decorators, `withPerformanceMonitor` is applied to all stories.
   - `packages/nimbus/.storybook/main.ts` — addon registration (`@github-ui/storybook-addon-performance-panel/preset`).
   - A few representative component files to understand patterns (e.g. `packages/nimbus/src/components/button/button.tsx`, `packages/nimbus/src/components/select/select.tsx`).
4. **Create the benchmark harness**: Create `packages/nimbus/src/components/__perf__/perf-bench.stories.tsx` — a dedicated performance benchmark story file (see Benchmark Harness below).
5. **Create the visual regression stories**: Create `packages/nimbus/src/components/__perf__/visual-regression.stories.tsx` — snapshot stories for each component you plan to optimize (see Visual Regression section below).
6. **Generate baseline screenshots**: Run `pnpm test:storybook:dev -- packages/nimbus/src/components/__perf__/visual-regression.stories.tsx` to create the reference `__screenshots__/` images. Commit these baselines.
7. **Verify Storybook dev tests work**: `pnpm test:storybook:dev -- packages/nimbus/src/components/__perf__/perf-bench.stories.tsx`
8. **Initialize results.tsv**: Create `packages/nimbus/results-render.tsv` with the header row.
9. **Confirm and go**.

## Benchmark Harness

The performance addon is already globally applied via `withPerformanceMonitor` in `preview.tsx`. It wraps every story in a React `<Profiler>` and collects metrics via Storybook's channel.

For repeatable automated measurement, create a benchmark story that:

1. Renders a target component N times (e.g. 100 mount/unmount cycles).
2. Uses React's `<Profiler>` API directly to capture `actualDuration` per render.
3. Exposes results via a `data-perf-result` attribute on a DOM element that a play function can read.

Example benchmark story pattern:

```tsx
// packages/nimbus/src/components/__perf__/perf-bench.stories.tsx
import { Profiler, useState, useEffect, useCallback } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within, waitFor } from "storybook/test";

// Import the component(s) under test
import { Button } from "@commercetools/nimbus";

const ITERATIONS = 50;

function PerfHarness({ Component, props }: { Component: React.FC<any>; props: Record<string, any> }) {
  const [durations, setDurations] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [cycle, setCycle] = useState(0);

  const onRender = useCallback(
    (_id: string, _phase: string, actualDuration: number) => {
      setDurations((prev) => [...prev, actualDuration]);
    },
    []
  );

  useEffect(() => {
    if (cycle < ITERATIONS) {
      const timer = requestAnimationFrame(() => setCycle((c) => c + 1));
      return () => cancelAnimationFrame(timer);
    } else {
      setDone(true);
    }
  }, [cycle]);

  const p95 = done
    ? [...durations].sort((a, b) => a - b)[Math.floor(durations.length * 0.95)]
    : null;
  const avg = done
    ? durations.reduce((a, b) => a + b, 0) / durations.length
    : null;

  return (
    <div>
      <Profiler id="bench" onRender={onRender}>
        {/* Re-key to force remount each cycle */}
        <Component key={cycle} {...props} />
      </Profiler>
      {done && (
        <div
          data-testid="perf-result"
          data-perf-p95={p95?.toFixed(2)}
          data-perf-avg={avg?.toFixed(2)}
          data-perf-count={durations.length}
        >
          p95={p95?.toFixed(2)}ms avg={avg?.toFixed(2)}ms n={durations.length}
        </div>
      )}
    </div>
  );
}

const meta: Meta = {
  title: "Perf/Benchmarks",
  parameters: { chromatic: { disableSnapshot: true } },
};
export default meta;

export const ButtonMount: StoryObj = {
  render: () => <PerfHarness Component={Button} props={{ children: "Click me" }} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const result = await waitFor(() => canvas.getByTestId("perf-result"), { timeout: 30000 });
    const p95 = parseFloat(result.getAttribute("data-perf-p95")!);
    const avg = parseFloat(result.getAttribute("data-perf-avg")!);
    // Log to stdout for the experiment loop to grep
    console.log(`PERF_RESULT: component=Button p95=${p95.toFixed(2)} avg=${avg.toFixed(2)}`);
    // Optionally assert a threshold
    await expect(p95).toBeLessThan(50);
  },
};
```

Add more exports for other components you want to optimize (Select, Menu, DataTable, etc.).

## Visual Regression via Storybook Snapshots

The project uses `@vitest/browser` with Playwright, which provides a built-in `toMatchScreenshot()` matcher with pixelmatch comparison. No additional dependencies are needed.

### How it works

`toMatchScreenshot()` is available on `expect.element()` in Storybook browser tests. On first run it saves a reference screenshot to a `__screenshots__` directory. On subsequent runs it compares the current render against the reference using pixelmatch and fails if there are visual differences.

### Snapshot stories for visual regression

Create a separate story file for visual regression testing alongside the perf benchmark:

```tsx
// packages/nimbus/src/components/__perf__/visual-regression.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { page } from "@vitest/browser/context";
import { Button, Select, Stack } from "@commercetools/nimbus";

const meta: Meta = {
  title: "Perf/VisualRegression",
};
export default meta;

export const ButtonVariants: StoryObj = {
  render: () => (
    <Stack gap="4" p="4">
      <Button variant="solid">Solid</Button>
      <Button variant="subtle">Subtle</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="solid" isDisabled>Disabled</Button>
      <Button variant="solid" size="xs">XS</Button>
      <Button variant="solid" size="sm">SM</Button>
      <Button variant="solid" size="md">MD</Button>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const element = canvasElement.querySelector('[data-testid]') ?? canvasElement;
    await expect.element(element).toMatchScreenshot("button-variants", {
      comparatorName: "pixelmatch",
      comparatorOptions: {
        // Allow tiny anti-aliasing differences (< 0.5% of pixels)
        allowedMismatchedPixelRatio: 0.005,
      },
    });
  },
};
```

Add a visual regression story for each component you modify during the experiment loop.

### Workflow for the experiment loop

1. **Before starting experiments**: Run the visual regression stories once to generate baseline screenshots:
   ```bash
   pnpm test:storybook:dev -- packages/nimbus/src/components/__perf__/visual-regression.stories.tsx
   ```
   This creates `__screenshots__/` files as the reference images. Commit these baselines.

2. **After each code change**: Run the same visual regression stories. `toMatchScreenshot` will compare against the committed baselines and **fail if any pixel differences exceed the threshold**.
   ```bash
   pnpm test:storybook:dev -- packages/nimbus/src/components/__perf__/visual-regression.stories.tsx > visual.log 2>&1
   ```
   If this fails, the change altered styling — discard it.

3. **To update baselines** (only if intentionally changing visuals, which should never happen in this experiment):
   ```bash
   pnpm test:storybook:dev -- packages/nimbus/src/components/__perf__/visual-regression.stories.tsx --update
   ```

## Running benchmarks

```bash
# Run the perf benchmark stories via Storybook test runner (headless Chromium)
pnpm test:storybook:dev -- packages/nimbus/src/components/__perf__/perf-bench.stories.tsx > perf.log 2>&1

# Extract results
grep "PERF_RESULT" perf.log
```

**Primary metric**: `p95` render duration (ms) for the target component — lower is better.
**Secondary metric**: `avg` render duration.
**Constraint**: All existing tests must still pass (`pnpm test:dev --silent`). Visual styling must not change from the user's perspective — if a change could affect rendered output, compare Storybook snapshots before and after to verify pixel-level equivalence.

**What you CAN do:**
- Modify component implementation files (`.tsx`) — optimize render paths, memoize, reduce re-renders.
- Modify component recipe files (`.recipe.ts`) — simplify style computation.
- Add `React.memo()`, `useMemo`, `useCallback` where profiling shows benefit.
- Restructure component internals to reduce React tree depth.
- Optimize React Aria integration patterns (fewer wrapper elements, simpler hooks).
- Modify the benchmark harness to add more components or change measurement methodology.

**What you CANNOT do:**
- Change the public component API (props, behavior, accessibility).
- Change the visual styling of any component from the user's perspective. The rendered output must be pixel-identical.
- Break existing story tests or unit tests.
- Remove accessibility features (WCAG compliance must be maintained).
- Modify `.storybook/preview.tsx` or the addon configuration.
- Add new dependencies.

**The goal is simple: get the lowest p95 render time for the target component(s).** Focus on mount performance first (it's what users feel on page load), then update performance. Memoization, reducing wrapper elements, and simplifying style computation are high-value targets.

**Simplicity criterion**: A render optimization that removes complexity (fewer wrappers, simpler hooks) is preferred over one that adds complexity (deep memoization trees). If removing a `useEffect` or flattening a component tree achieves the same result as adding `React.memo`, prefer the removal.

## Output format

After each benchmark run, record per component:

```
component:  Button
p95_ms:     2.34
avg_ms:     1.56
tests:      pass
```

## Logging results

Log each experiment to `packages/nimbus/results-render.tsv` (tab-separated).

```
commit	component	p95_ms	avg_ms	status	description
```

1. git commit hash (short, 7 chars)
2. component name
3. p95_ms render duration
4. avg_ms render duration
5. status: `keep`, `discard`, or `crash`
6. short description of what was tried

Example:

```
commit	component	p95_ms	avg_ms	status	description
a1b2c3d	Button	2.34	1.56	keep	baseline
b2c3d4e	Button	1.89	1.22	keep	memoize recipe lookup
c3d4e5f	Button	2.40	1.60	discard	split into sub-components (slower)
```

## The experiment loop

LOOP FOREVER:

1. Look at the git state and results so far.
2. Pick a component to optimize (start with the one with highest p95).
3. Modify the component's implementation files with an experimental idea.
4. git commit
5. Benchmark: `pnpm test:storybook:dev -- packages/nimbus/src/components/__perf__/perf-bench.stories.tsx > perf.log 2>&1`
6. Extract: `grep "PERF_RESULT" perf.log`
7. If no PERF_RESULT lines, the run crashed — check `tail -n 50 perf.log`.
8. Verify other tests: `pnpm test:dev --silent > test.log 2>&1`
9. Verify visual equivalence: `pnpm test:storybook:dev -- packages/nimbus/src/components/__perf__/visual-regression.stories.tsx > visual.log 2>&1`. If `toMatchScreenshot` fails, the change altered styling — treat as a failure.
10. Record results in the TSV.
11. If p95_ms decreased AND tests pass AND visuals are unchanged, keep the commit.
12. If p95_ms increased, tests fail, or visuals changed, `git reset --hard HEAD~1`.

**Timeout**: Each benchmark cycle should take under 5 minutes. If it exceeds 10 minutes, kill and treat as failure.

**NEVER STOP**: Run indefinitely until manually stopped. If stuck on one component, move to another. If all components seem optimized, try more complex interaction benchmarks (update cycles, re-renders with prop changes). Read the performance addon's troubleshooting guide for ideas: forced reflows, render cascades, layout thrashing. Use React DevTools Profiler concepts — split contexts, move state closer to usage, reduce provider nesting.
