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
  NimbusProvider,
} from "../../index";
import { Delete } from "@commercetools/nimbus-icons";

const ITERATIONS = 50;

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
});
