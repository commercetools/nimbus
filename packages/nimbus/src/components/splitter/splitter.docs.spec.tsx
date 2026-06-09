import { describe, it, expect } from "vitest";
import { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NimbusProvider, Splitter } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering
 * @docs-description Minimal two-pane Splitter wired up in a consumer app.
 * @docs-order 1
 */
describe("Splitter - Basic rendering", () => {
  it("renders two panes and one handle", async () => {
    render(
      <NimbusProvider>
        <Splitter.Root defaultSizes={{ nav: 30, main: 70 }}>
          <Splitter.Pane id="nav">Nav</Splitter.Pane>
          <Splitter.Handle />
          <Splitter.Pane id="main">Main</Splitter.Pane>
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
 * @docs-description Hydrate `defaultSizes` from stored state and persist the
 * settled value via `onSizesChangeEnd` — no bespoke hook required.
 * @docs-order 2
 */
describe("Splitter - persistence", () => {
  it("hydrates from stored sizes on first render", async () => {
    // Stand-in for a `useLocalStorage`-style hook seeded from storage.
    const Demo = () => {
      const [sizes, setSizes] = useState<Record<string, number>>({
        nav: 25,
        main: 75,
      });
      return (
        <Splitter.Root
          defaultSizes={sizes}
          onSizesChangeEnd={setSizes}
          panes={{ nav: { minSize: 5 }, main: { minSize: 5 } }}
        >
          <Splitter.Pane id="nav">Nav</Splitter.Pane>
          <Splitter.Handle />
          <Splitter.Pane id="main">Main</Splitter.Pane>
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
 * @docs-section controlled-sizes
 * @docs-title Controlled sizes from anywhere
 * @docs-description Drive the layout with the `sizes` prop and update it from
 * outside the splitter — changes apply in place (no remount), so stateful pane
 * content is preserved. Wire `onSizesChangeEnd` to keep it controlled after a
 * drag.
 * @docs-order 2.5
 */
describe("Splitter - controlled sizes", () => {
  it("reflects an external sizes change in place", async () => {
    const user = userEvent.setup();
    const Demo = () => {
      const [sizes, setSizes] = useState<Record<string, number>>({
        nav: 30,
        main: 70,
      });
      return (
        <>
          <button type="button" onClick={() => setSizes({ nav: 60, main: 40 })}>
            widen-nav
          </button>
          <Splitter.Root
            sizes={sizes}
            onSizesChangeEnd={setSizes}
            panes={{ nav: { minSize: 5 }, main: { minSize: 5 } }}
          >
            <Splitter.Pane id="nav">Nav</Splitter.Pane>
            <Splitter.Handle />
            <Splitter.Pane id="main">Main</Splitter.Pane>
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

    await user.click(screen.getByText("widen-nav"));
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(60);
    });
  });
});

/**
 * @docs-section controlled-collapse
 * @docs-title Controlled collapse from anywhere
 * @docs-description Collapse is plain controlled state, so a button outside
 * the splitter can toggle it — no imperative API.
 * @docs-order 3
 */
describe("Splitter - controlled collapse", () => {
  it("collapses a pane from a button outside the subtree", async () => {
    const user = userEvent.setup();
    const Demo = () => {
      const [collapsed, setCollapsed] = useState<string | null>(null);
      return (
        <>
          <button
            type="button"
            onClick={() => setCollapsed((c) => (c === "nav" ? null : "nav"))}
          >
            toggle-nav
          </button>
          <Splitter.Root
            defaultSizes={{ nav: 30, main: 70 }}
            panes={{
              nav: { minSize: 5, collapsible: true },
              main: { minSize: 5 },
            }}
            collapsedPane={collapsed}
            onCollapsedPaneChange={setCollapsed}
          >
            <Splitter.Pane id="nav">Nav</Splitter.Pane>
            <Splitter.Handle />
            <Splitter.Pane id="main">Main</Splitter.Pane>
          </Splitter.Root>
        </>
      );
    };

    render(
      <NimbusProvider>
        <Demo />
      </NimbusProvider>
    );

    await user.click(screen.getByText("toggle-nav"));
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
  it("nests inside a Pane to express three regions", async () => {
    render(
      <NimbusProvider>
        <Splitter.Root defaultSizes={{ nav: 25, rest: 75 }}>
          <Splitter.Pane id="nav">Nav</Splitter.Pane>
          <Splitter.Handle />
          <Splitter.Pane id="rest">
            <Splitter.Root defaultSizes={{ main: 65, aside: 35 }}>
              <Splitter.Pane id="main">Main</Splitter.Pane>
              <Splitter.Handle />
              <Splitter.Pane id="aside">Aside</Splitter.Pane>
            </Splitter.Root>
          </Splitter.Pane>
        </Splitter.Root>
      </NimbusProvider>
    );

    const handles = await screen.findAllByRole("separator");
    expect(handles).toHaveLength(2);
  });
});
