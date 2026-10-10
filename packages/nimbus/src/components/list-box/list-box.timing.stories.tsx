import type { Meta, StoryObj } from "@storybook/react-vite";
import { ListBox, Stack, Text, Button } from "@commercetools/nimbus";
import { useLayoutEffect, useRef, useState } from "react";
import { within, expect } from "storybook/test";

/**
 * Timing comparison for `isVirtualized` (Virtualizer design Decision 12).
 *
 * Measures, with `performance.now()`, the time from starting a render to the
 * first committed layout and to the next paint, for a ListBox with 500 and
 * 10,000 options, with and without `isVirtualized`. Numbers are shown on
 * screen and logged; they are not a CI gate, because timings in headless CI
 * are not stable enough for a threshold. Run it locally in Storybook and record
 * the numbers in the Virtualizer design.
 */
const meta: Meta<typeof ListBox.Root> = {
  title: "Components/ListBox",
  component: ListBox.Root,
  parameters: { chromatic: { disableSnapshot: true } },
};

export default meta;

type Story = StoryObj<typeof ListBox.Root>;

const makeOptions = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: `option-${i + 1}`,
    name: `Option ${i + 1}`,
  }));

const cases = [
  { count: 500, isVirtualized: false },
  { count: 500, isVirtualized: true },
  { count: 10_000, isVirtualized: false },
  { count: 10_000, isVirtualized: true },
] as const;

type Result = {
  label: string;
  commitMs: number;
  paintMs: number;
  renderedOptions: number;
};

const nextPaint = () =>
  new Promise<void>((resolve) =>
    requestAnimationFrame(() => setTimeout(resolve, 0))
  );

/**
 * Mounts one ListBox and reports the time to commit and to the next paint.
 */
const MeasuredList = ({
  count,
  isVirtualized,
  onResult,
}: {
  count: number;
  isVirtualized: boolean;
  onResult: (result: Result) => void;
}) => {
  const start = useRef(performance.now());
  const ref = useRef<HTMLDivElement>(null);
  const [options] = useState(() => makeOptions(count));

  useLayoutEffect(() => {
    const commitMs = performance.now() - start.current;
    void nextPaint().then(() => {
      onResult({
        label: `${count} options, ${isVirtualized ? "virtualized" : "not virtualized"}`,
        commitMs,
        paintMs: performance.now() - start.current,
        renderedOptions:
          ref.current?.querySelectorAll('[role="option"]').length ?? 0,
      });
    });
    // Measure the first mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ListBox.Root
      ref={ref}
      aria-label={`${count} options`}
      items={options}
      isVirtualized={isVirtualized}
      width="16rem"
      maxHeight="240px"
    >
      {(option) => (
        <ListBox.Item id={option.id} textValue={option.name}>
          {option.name}
        </ListBox.Item>
      )}
    </ListBox.Root>
  );
};

const TimingComparison = () => {
  const [index, setIndex] = useState(-1);
  const [results, setResults] = useState<Result[]>([]);
  const current = cases[index];

  const handleResult = (result: Result) => {
    console.info("[ListBox timing]", result);
    setResults((previous) => [...previous, result]);
    // Unmount before the next case, so cases do not affect each other.
    setIndex((i) => (i + 1 < cases.length ? -(i + 2) : cases.length));
  };

  // A negative index means "between cases": mount the next one on a fresh frame.
  useLayoutEffect(() => {
    if (index < -1) {
      void nextPaint().then(() => setIndex(-index - 1));
    }
  }, [index]);

  return (
    <Stack gap="400" alignItems="flex-start">
      <Button
        onPress={() => {
          setResults([]);
          setIndex(0);
        }}
      >
        Run timing
      </Button>
      <table data-testid="timing-results">
        <thead>
          <tr>
            <th>Case</th>
            <th>Commit (ms)</th>
            <th>Paint (ms)</th>
            <th>Options in DOM</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.label}>
              <td>{r.label}</td>
              <td>{r.commitMs.toFixed(1)}</td>
              <td>{r.paintMs.toFixed(1)}</td>
              <td>{r.renderedOptions}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {index >= 0 && current && (
        <MeasuredList
          key={index}
          count={current.count}
          isVirtualized={current.isVirtualized}
          onResult={handleResult}
        />
      )}
      {results.length === cases.length && <Text>Done</Text>}
    </Stack>
  );
};

const singleLine = makeOptions(500);
const mixed = Array.from({ length: 500 }, (_, i) => ({
  id: `mixed-${i + 1}`,
  name:
    i % 3 === 0
      ? `Option ${i + 1} with a long label that wraps onto several lines`
      : `Option ${i + 1}`,
}));

/**
 * Scroll height before and after scrolling through the whole list. The
 * difference is how much the scrollbar shifts while estimated rows are
 * measured (Virtualizer design Decision 8).
 */
const ScrollCorrection = () => (
  <Stack direction="row" gap="400" alignItems="flex-start">
    {[
      { label: "Single-line options", options: singleLine },
      { label: "Wrapping options", options: mixed },
    ].map(({ label, options }) => (
      <ListBox.Root
        key={label}
        isVirtualized
        aria-label={label}
        items={options}
        width="14rem"
        maxHeight="240px"
      >
        {(option) => (
          <ListBox.Item id={option.id} textValue={option.name}>
            {option.name}
          </ListBox.Item>
        )}
      </ListBox.Root>
    ))}
  </Stack>
);

/**
 * Shows how far the scroll height moves while rows are measured: none for
 * single-line options (the estimate matches), some for wrapping options.
 */
export const VirtualizationScrollCorrection: Story = {
  render: () => <ScrollCorrection />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await canvas.findAllByRole("option", undefined, { timeout: 15000 });

    for (const label of ["Single-line options", "Wrapping options"]) {
      await step(
        `${label}: scroll through and record the correction`,
        async () => {
          const list = canvas.getByRole("listbox", { name: label });
          const before = list.scrollHeight;
          // Scroll through in viewport-sized steps so every row is measured.
          for (
            let top = 0;
            top <= list.scrollHeight;
            top += list.clientHeight
          ) {
            list.scrollTop = top;
            await nextPaint();
          }
          const after = list.scrollHeight;
          console.info("[ListBox scroll correction]", { label, before, after });
          list.dataset.scrollCorrection = String(after - before);
          if (label === "Single-line options") {
            // The estimate matches the recipe, so nothing shifts.
            expect(Math.abs(after - before)).toBeLessThanOrEqual(2);
          }
        }
      );
    }
  },
};

/**
 * Press "Run timing" to measure all four cases one after the other.
 */
export const VirtualizationTiming: Story = {
  render: () => <TimingComparison />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("All four cases run and report results", async () => {
      canvas.getByRole("button", { name: "Run timing" }).click();
      await canvas.findByText("Done", undefined, { timeout: 60000 });
      const rows = within(canvas.getByTestId("timing-results")).getAllByRole(
        "row"
      );
      // header + 4 cases
      expect(rows).toHaveLength(5);
    });
  },
};
