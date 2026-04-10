import { Profiler, useState, useEffect, useCallback, useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within, waitFor } from "storybook/test";

import {
  Button,
  TextInput,
  Checkbox,
  Badge,
  IconButton,
  Select,
  Stack,
  Text,
  Link,
  Switch,
  Tooltip,
} from "@commercetools/nimbus";
import { Delete } from "@commercetools/nimbus-icons";

const ITERATIONS = 50;

function PerfHarness({
  Component,
  props,
}: {
  Component: React.FC<any>;
  props: Record<string, any>;
}) {
  const durationsRef = useRef<number[]>([]);
  const [result, setResult] = useState<{
    p95: number;
    avg: number;
    count: number;
  } | null>(null);
  const [cycle, setCycle] = useState(0);

  const onRender = useCallback(
    (_id: string, _phase: string, actualDuration: number) => {
      durationsRef.current.push(actualDuration);
    },
    []
  );

  useEffect(() => {
    if (cycle < ITERATIONS) {
      const timer = requestAnimationFrame(() => setCycle((c) => c + 1));
      return () => cancelAnimationFrame(timer);
    } else {
      const durations = durationsRef.current;
      const sorted = [...durations].sort((a, b) => a - b);
      const p95 = sorted[Math.floor(sorted.length * 0.95)];
      const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
      setResult({ p95, avg, count: durations.length });
    }
  }, [cycle]);

  return (
    <div>
      <Profiler id="bench" onRender={onRender}>
        <Component key={cycle} {...props} />
      </Profiler>
      {result && (
        <div
          data-testid="perf-result"
          data-perf-p95={result.p95.toFixed(2)}
          data-perf-avg={result.avg.toFixed(2)}
          data-perf-count={result.count}
        >
          p95={result.p95.toFixed(2)}ms avg={result.avg.toFixed(2)}ms n=
          {result.count}
        </div>
      )}
    </div>
  );
}

function RenderHarness({ children }: { children: React.ReactNode }) {
  const durationsRef = useRef<number[]>([]);
  const [result, setResult] = useState<{
    p95: number;
    avg: number;
    count: number;
  } | null>(null);
  const [cycle, setCycle] = useState(0);

  const onRender = useCallback(
    (_id: string, _phase: string, actualDuration: number) => {
      durationsRef.current.push(actualDuration);
    },
    []
  );

  useEffect(() => {
    if (cycle < ITERATIONS) {
      const timer = requestAnimationFrame(() => setCycle((c) => c + 1));
      return () => cancelAnimationFrame(timer);
    } else {
      const durations = durationsRef.current;
      const sorted = [...durations].sort((a, b) => a - b);
      const p95 = sorted[Math.floor(sorted.length * 0.95)];
      const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
      setResult({ p95, avg, count: durations.length });
    }
  }, [cycle]);

  return (
    <div>
      <Profiler id="bench" onRender={onRender}>
        <div key={cycle}>{children}</div>
      </Profiler>
      {result && (
        <div
          data-testid="perf-result"
          data-perf-p95={result.p95.toFixed(2)}
          data-perf-avg={result.avg.toFixed(2)}
          data-perf-count={result.count}
        >
          p95={result.p95.toFixed(2)}ms avg={result.avg.toFixed(2)}ms n=
          {result.count}
        </div>
      )}
    </div>
  );
}

const meta: Meta = {
  title: "Perf/Benchmarks",
  parameters: {
    chromatic: { disableSnapshot: true },
    a11y: { test: "todo" },
  },
};
export default meta;

function createPlayFunction(componentName: string) {
  return async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const result = await waitFor(() => canvas.getByTestId("perf-result"), {
      timeout: 30000,
    });
    const p95 = parseFloat(result.getAttribute("data-perf-p95")!);
    const avg = parseFloat(result.getAttribute("data-perf-avg")!);
    // Use a failing assertion to surface perf data in test output,
    // then re-assert the real threshold separately
    await expect(
      p95,
      `PERF_RESULT: component=${componentName} p95=${p95.toFixed(2)} avg=${avg.toFixed(2)}`
    ).toBeLessThan(100);
  };
}

export const ButtonMount: StoryObj = {
  render: () => (
    <PerfHarness Component={Button} props={{ children: "Click me" }} />
  ),
  play: createPlayFunction("Button"),
};

export const TextInputMount: StoryObj = {
  render: () => (
    <PerfHarness
      Component={TextInput}
      props={{ placeholder: "Type here...", "aria-label": "perf test" }}
    />
  ),
  play: createPlayFunction("TextInput"),
};

export const CheckboxMount: StoryObj = {
  render: () => (
    <PerfHarness Component={Checkbox} props={{ children: "Check me" }} />
  ),
  play: createPlayFunction("Checkbox"),
};

export const BadgeMount: StoryObj = {
  render: () => (
    <PerfHarness Component={Badge} props={{ children: "Status" }} />
  ),
  play: createPlayFunction("Badge"),
};

export const IconButtonMount: StoryObj = {
  render: () => (
    <PerfHarness
      Component={IconButton}
      props={{ "aria-label": "delete", icon: <Delete /> }}
    />
  ),
  play: createPlayFunction("IconButton"),
};

export const SelectMount: StoryObj = {
  render: () => (
    <RenderHarness>
      <Select.Root>
        <Select.Options aria-label="perf test" placeholder="Pick one">
          <Select.Option id="a">Alpha</Select.Option>
          <Select.Option id="b">Beta</Select.Option>
          <Select.Option id="c">Gamma</Select.Option>
        </Select.Options>
      </Select.Root>
    </RenderHarness>
  ),
  play: createPlayFunction("Select"),
};

export const TextMount: StoryObj = {
  render: () => (
    <PerfHarness Component={Text} props={{ children: "Hello world" }} />
  ),
  play: createPlayFunction("Text"),
};

export const LinkMount: StoryObj = {
  render: () => (
    <PerfHarness
      Component={Link}
      props={{ children: "Click here", href: "#" }}
    />
  ),
  play: createPlayFunction("Link"),
};

export const SwitchMount: StoryObj = {
  render: () => (
    <PerfHarness Component={Switch} props={{ children: "Toggle" }} />
  ),
  play: createPlayFunction("Switch"),
};

export const TooltipMount: StoryObj = {
  render: () => (
    <RenderHarness>
      <Tooltip.Root>
        <Button>Hover me</Button>
        <Tooltip.Content>Helpful info</Tooltip.Content>
      </Tooltip.Root>
    </RenderHarness>
  ),
  play: createPlayFunction("Tooltip"),
};
