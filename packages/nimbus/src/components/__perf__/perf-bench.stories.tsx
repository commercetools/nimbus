import { Profiler, useState, useEffect, useCallback } from "react";
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
import { BinLinearIcon } from "@commercetools/nimbus-icons";

const ITERATIONS = 50;

function PerfHarness({
  Component,
  props,
}: {
  Component: React.FC<any>;
  props: Record<string, any>;
}) {
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

function RenderHarness({ children }: { children: React.ReactNode }) {
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
        <div key={cycle}>{children}</div>
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
    console.log(
      `PERF_RESULT: component=${componentName} p95=${p95.toFixed(2)} avg=${avg.toFixed(2)}`
    );
    await expect(p95).toBeLessThan(100);
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
      props={{ "aria-label": "delete", icon: <BinLinearIcon /> }}
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
      <Tooltip content="Helpful info">
        <Button>Hover me</Button>
      </Tooltip>
    </RenderHarness>
  ),
  play: createPlayFunction("Tooltip"),
};
