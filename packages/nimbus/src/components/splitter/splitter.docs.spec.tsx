import { describe, it, expect } from "vitest";
import { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NimbusProvider, Splitter } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering
 * @docs-description Minimal Splitter — a configurable aside and a main pane —
 * wired up in a consumer app.
 * @docs-order 1
 */
describe("Splitter - Basic rendering", () => {
  it("renders an aside, a main pane, and one handle", async () => {
    render(
      <NimbusProvider>
        <Splitter.Root defaultSize={30}>
          <Splitter.Aside>Aside</Splitter.Aside>
          <Splitter.Handle />
          <Splitter.Main>Main</Splitter.Main>
        </Splitter.Root>
      </NimbusProvider>
    );

    const handle = await screen.findByRole("separator");
    expect(handle).toBeInTheDocument();
  });
});

/**
 * @docs-section persistence
 * @docs-title Persistence with any storage
 * @docs-description Hydrate `defaultSize` from stored state and persist the
 * settled value via `onSizeChangeEnd` — a single number, no bespoke hook.
 * @docs-order 2
 */
describe("Splitter - persistence", () => {
  it("hydrates from the stored size on first render", async () => {
    // Stand-in for a `useLocalStorage`-style hook seeded from storage.
    const Demo = () => {
      const [size, setSize] = useState(25);
      return (
        <Splitter.Root
          defaultSize={size}
          onSizeChangeEnd={setSize}
          minSize={5}
          maxSize={95}
        >
          <Splitter.Aside>Aside</Splitter.Aside>
          <Splitter.Handle />
          <Splitter.Main>Main</Splitter.Main>
        </Splitter.Root>
      );
    };

    render(
      <NimbusProvider>
        <Demo />
      </NimbusProvider>
    );

    const handle = await screen.findByRole("separator");
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(25);
    });
  });
});

/**
 * @docs-section controlled-size
 * @docs-title Controlled size from anywhere
 * @docs-description Drive the layout with the `size` prop and update it from
 * outside the splitter — changes apply in place (no remount), so stateful pane
 * content is preserved. Wire `onSizeChangeEnd` to keep it controlled after a
 * drag.
 * @docs-order 2.5
 */
describe("Splitter - controlled size", () => {
  it("reflects an external size change in place", async () => {
    const user = userEvent.setup();
    const Demo = () => {
      const [size, setSize] = useState(30);
      return (
        <>
          <button type="button" onClick={() => setSize(60)}>
            widen-aside
          </button>
          <Splitter.Root
            size={size}
            onSizeChangeEnd={setSize}
            minSize={5}
            maxSize={95}
          >
            <Splitter.Aside>Aside</Splitter.Aside>
            <Splitter.Handle />
            <Splitter.Main>Main</Splitter.Main>
          </Splitter.Root>
        </>
      );
    };

    render(
      <NimbusProvider>
        <Demo />
      </NimbusProvider>
    );

    const handle = await screen.findByRole("separator");
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(30);
    });

    await user.click(screen.getByText("widen-aside"));
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(60);
    });
  });
});

/**
 * @docs-section controlled-collapse
 * @docs-title Controlled collapse from anywhere
 * @docs-description Collapse is plain controlled boolean state, so a button
 * outside the splitter can toggle the aside — no imperative API.
 * @docs-order 3
 */
describe("Splitter - controlled collapse", () => {
  it("collapses the aside from a button outside the subtree", async () => {
    const user = userEvent.setup();
    const Demo = () => {
      const [collapsed, setCollapsed] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setCollapsed((c) => !c)}>
            toggle-aside
          </button>
          <Splitter.Root
            defaultSize={30}
            minSize={5}
            maxSize={95}
            collapsible
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
          >
            <Splitter.Aside>Aside</Splitter.Aside>
            <Splitter.Handle />
            <Splitter.Main>Main</Splitter.Main>
          </Splitter.Root>
        </>
      );
    };

    render(
      <NimbusProvider>
        <Demo />
      </NimbusProvider>
    );

    await user.click(screen.getByText("toggle-aside"));
    const handle = await screen.findByRole("separator");
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(0);
    });
  });
});

/**
 * @docs-section nesting
 * @docs-title Nested splitters for 3+ regions
 * @docs-description Each nested Splitter is an independent widget.
 * @docs-order 4
 */
describe("Splitter - Nested", () => {
  it("nests inside a pane to express three regions", async () => {
    render(
      <NimbusProvider>
        <Splitter.Root defaultSize={25}>
          <Splitter.Aside>Aside</Splitter.Aside>
          <Splitter.Handle />
          <Splitter.Main>
            <Splitter.Root defaultSize={35}>
              <Splitter.Main>Main</Splitter.Main>
              <Splitter.Handle />
              <Splitter.Aside>Aside</Splitter.Aside>
            </Splitter.Root>
          </Splitter.Main>
        </Splitter.Root>
      </NimbusProvider>
    );

    const handles = await screen.findAllByRole("separator");
    expect(handles).toHaveLength(2);
  });
});
