/**
 * Performance benchmark tests using React Profiler API.
 * Renders each component N times with key-based remounting and
 * captures actualDuration from Profiler onRender callback.
 *
 * Results are printed to stdout via console.log with PERF_RESULT prefix
 * for easy extraction by the experiment loop.
 */
import { Profiler } from "react";
import { render, cleanup } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import {
  Button,
  TextInput,
  Checkbox,
  Badge,
  IconButton,
  Text,
  Link,
  Switch,
  Select,
  Tooltip,
  NimbusProvider,
} from "../../index";
import { Delete } from "@commercetools/nimbus-icons";

const ITERATIONS = 100;

function benchmarkMount(
  Component: React.FC<any>,
  props: Record<string, any>
): { p95: number; avg: number; count: number } {
  const durations: number[] = [];

  const onRender = (_id: string, _phase: string, actualDuration: number) => {
    durations.push(actualDuration);
  };

  for (let i = 0; i < ITERATIONS; i++) {
    const { unmount } = render(
      <NimbusProvider loadFonts={false}>
        <Profiler id="bench" onRender={onRender}>
          <Component {...props} />
        </Profiler>
      </NimbusProvider>
    );
    unmount();
  }
  cleanup();

  const sorted = [...durations].sort((a, b) => a - b);
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
  return { p95, avg, count: durations.length };
}

describe("Perf/Benchmarks", () => {
  const components: Array<{
    name: string;
    Component: React.FC<any>;
    props: Record<string, any>;
  }> = [
    { name: "Button", Component: Button, props: { children: "Click me" } },
    {
      name: "TextInput",
      Component: TextInput,
      props: { placeholder: "Type here...", "aria-label": "perf test" },
    },
    {
      name: "Checkbox",
      Component: Checkbox,
      props: { children: "Check me" },
    },
    { name: "Badge", Component: Badge, props: { children: "Status" } },
    {
      name: "IconButton",
      Component: IconButton,
      props: { "aria-label": "delete", icon: <Delete /> },
    },
    { name: "Text", Component: Text, props: { children: "Hello world" } },
    {
      name: "Link",
      Component: Link,
      props: { children: "Click here", href: "#" },
    },
    { name: "Switch", Component: Switch, props: { children: "Toggle" } },
  ];

  for (const { name, Component, props } of components) {
    it(`${name} mount benchmark`, () => {
      const result = benchmarkMount(Component, props);
      console.log(
        `PERF_RESULT: component=${name} p95=${result.p95.toFixed(2)} avg=${result.avg.toFixed(2)}`
      );
      expect(result.p95).toBeLessThan(100);
    });
  }

  // Compound component benchmarks using JSX directly
  it("Select mount benchmark", () => {
    const durations: number[] = [];
    const onRender = (_id: string, _phase: string, actualDuration: number) => {
      durations.push(actualDuration);
    };
    for (let i = 0; i < ITERATIONS; i++) {
      const { unmount } = render(
        <NimbusProvider loadFonts={false}>
          <Profiler id="bench" onRender={onRender}>
            <Select.Root>
              <Select.Options aria-label="test" placeholder="Pick one">
                <Select.Option id="a">Alpha</Select.Option>
                <Select.Option id="b">Beta</Select.Option>
                <Select.Option id="c">Gamma</Select.Option>
              </Select.Options>
            </Select.Root>
          </Profiler>
        </NimbusProvider>
      );
      unmount();
    }
    cleanup();
    const sorted = [...durations].sort((a, b) => a - b);
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
    console.log(
      `PERF_RESULT: component=Select p95=${p95.toFixed(2)} avg=${avg.toFixed(2)}`
    );
    expect(p95).toBeLessThan(100);
  });

  it("Tooltip mount benchmark", () => {
    const durations: number[] = [];
    const onRender = (_id: string, _phase: string, actualDuration: number) => {
      durations.push(actualDuration);
    };
    for (let i = 0; i < ITERATIONS; i++) {
      const { unmount } = render(
        <NimbusProvider loadFonts={false}>
          <Profiler id="bench" onRender={onRender}>
            <Tooltip.Root>
              <Button>Hover</Button>
              <Tooltip.Content>Info</Tooltip.Content>
            </Tooltip.Root>
          </Profiler>
        </NimbusProvider>
      );
      unmount();
    }
    cleanup();
    const sorted = [...durations].sort((a, b) => a - b);
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
    console.log(
      `PERF_RESULT: component=Tooltip p95=${p95.toFixed(2)} avg=${avg.toFixed(2)}`
    );
    expect(p95).toBeLessThan(100);
  });

  // Update (re-render) benchmarks — render once, then re-render N times with same props
  function benchmarkUpdate(
    Component: React.FC<any>,
    props: Record<string, any>
  ): { p95: number; avg: number; count: number } {
    const durations: number[] = [];
    const onRender = (_id: string, phase: string, actualDuration: number) => {
      // Only measure update renders, skip initial mount
      if (phase === "update") {
        durations.push(actualDuration);
      }
    };

    const { rerender, unmount } = render(
      <NimbusProvider loadFonts={false}>
        <Profiler id="bench-update" onRender={onRender}>
          <Component {...props} />
        </Profiler>
      </NimbusProvider>
    );

    for (let i = 0; i < ITERATIONS; i++) {
      rerender(
        <NimbusProvider loadFonts={false}>
          <Profiler id="bench-update" onRender={onRender}>
            <Component {...props} />
          </Profiler>
        </NimbusProvider>
      );
    }
    unmount();
    cleanup();

    const sorted = [...durations].sort((a, b) => a - b);
    const p95 = sorted[Math.floor(sorted.length * 0.95)] ?? 0;
    const avg =
      durations.length > 0
        ? durations.reduce((a, b) => a + b, 0) / durations.length
        : 0;
    return { p95, avg, count: durations.length };
  }

  const updateComponents = [
    { name: "Button", Component: Button, props: { children: "Click me" } },
    {
      name: "Checkbox",
      Component: Checkbox,
      props: { children: "Check me" },
    },
    { name: "Switch", Component: Switch, props: { children: "Toggle" } },
    { name: "Badge", Component: Badge, props: { children: "Status" } },
  ];

  for (const { name, Component, props } of updateComponents) {
    it(`${name} update benchmark`, () => {
      const result = benchmarkUpdate(Component, props);
      console.log(
        `PERF_RESULT_UPDATE: component=${name} p95=${result.p95.toFixed(2)} avg=${result.avg.toFixed(2)}`
      );
      expect(result.p95).toBeLessThan(100);
    });
  }

  // Prop-change update benchmarks — re-render with different props each time
  function benchmarkPropChange(
    Component: React.FC<any>,
    propsFactory: (i: number) => Record<string, any>
  ): { p95: number; avg: number; count: number } {
    const durations: number[] = [];
    const onRender = (_id: string, phase: string, actualDuration: number) => {
      if (phase === "update") {
        durations.push(actualDuration);
      }
    };

    const { rerender, unmount } = render(
      <NimbusProvider loadFonts={false}>
        <Profiler id="bench-propchange" onRender={onRender}>
          <Component {...propsFactory(0)} />
        </Profiler>
      </NimbusProvider>
    );

    for (let i = 1; i <= ITERATIONS; i++) {
      rerender(
        <NimbusProvider loadFonts={false}>
          <Profiler id="bench-propchange" onRender={onRender}>
            <Component {...propsFactory(i)} />
          </Profiler>
        </NimbusProvider>
      );
    }
    unmount();
    cleanup();

    const sorted = [...durations].sort((a, b) => a - b);
    const p95 = sorted[Math.floor(sorted.length * 0.95)] ?? 0;
    const avg =
      durations.length > 0
        ? durations.reduce((a, b) => a + b, 0) / durations.length
        : 0;
    return { p95, avg, count: durations.length };
  }

  it("Button prop-change benchmark", () => {
    const result = benchmarkPropChange(Button, (i) => ({
      children: `Click ${i}`,
    }));
    console.log(
      `PERF_RESULT_PROPCHANGE: component=Button p95=${result.p95.toFixed(2)} avg=${result.avg.toFixed(2)}`
    );
    expect(result.p95).toBeLessThan(100);
  });

  it("Checkbox prop-change benchmark", () => {
    const result = benchmarkPropChange(Checkbox, (i) => ({
      children: `Check ${i}`,
    }));
    console.log(
      `PERF_RESULT_PROPCHANGE: component=Checkbox p95=${result.p95.toFixed(2)} avg=${result.avg.toFixed(2)}`
    );
    expect(result.p95).toBeLessThan(100);
  });
});
