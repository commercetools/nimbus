import { describe, it, expect, afterEach } from "vitest";
import { act } from "@testing-library/react";
import { flushSync } from "react-dom";
import { createRoot, type Root } from "react-dom/client";
import { NimbusProvider } from "@commercetools/nimbus";
import { Splitter } from "./splitter";

/**
 * Regression guard for the first-paint 50/50 flash.
 *
 * In production, under a busy concurrent mount, React defers the resolved
 * controlled `size` (from `useResponsiveSplitterSizes`' container measurement)
 * past the first paint. If the Splitter adopts that size in a *passive* effect
 * it stays at its 50/50 seed for a painted frame before snapping to the
 * configured size — the visible jump. The fix adopts it in a *layout* effect,
 * before paint.
 *
 * That paint-timing transient only manifests under real production scheduling,
 * so it can't be reproduced in jsdom or Storybook. What we *can* assert
 * deterministically is the property that prevents it: the controlled-size
 * reconcile is synchronous with the commit. `flushSync` runs layout effects
 * (and the re-render they schedule) synchronously, but defers passive effects —
 * so immediately after a `flushSync` size change the pane must already reflect
 * the new size. Revert the reconcile to a passive effect and this fails (the
 * pane still shows the old size until passive effects flush).
 */
const tree = (size: number) => (
  <NimbusProvider>
    <Splitter.Root
      size={size}
      minSize={0}
      maxSize={100}
      onSizeChangeEnd={() => {}}
    >
      <Splitter.Aside>aside</Splitter.Aside>
      <Splitter.Handle />
      <Splitter.Main>main</Splitter.Main>
    </Splitter.Root>
  </NimbusProvider>
);

describe("Splitter — controlled size reconcile is synchronous (no first-paint flash)", () => {
  let container: HTMLDivElement;
  let root: Root;

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  const asideWidth = () =>
    (container.querySelector(".nimbus-splitter__pane") as HTMLElement).style
      .width;

  it("adopts a controlled `size` change within the same commit (layout, not passive)", () => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    // Mount controlled at 30%. The act() flush registers both panes.
    act(() => root.render(tree(30)));
    expect(asideWidth()).toBe("30%");

    // Change the controlled size inside flushSync: layout effects (and the
    // re-render they schedule) run synchronously; passive effects do not.
    flushSync(() => root.render(tree(60)));

    // Layout-effect reconcile → already 60% here. A passive reconcile would
    // still read "30%" until effects flush after paint.
    expect(asideWidth()).toBe("60%");
  });
});
