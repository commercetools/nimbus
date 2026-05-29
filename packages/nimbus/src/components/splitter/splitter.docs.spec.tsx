import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  NimbusProvider,
  Splitter,
  useSplitterLayout,
} from "@commercetools/nimbus";

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
        <Splitter.Root
          panes={{ nav: { defaultSize: 30 }, main: { defaultSize: 70 } }}
        >
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
 * @docs-title Persistence with useSplitterLayout
 * @docs-description Custom storage adapter hydrates sizes synchronously on first render.
 * @docs-order 2
 */
describe("Splitter - useSplitterLayout", () => {
  it("hydrates sizes from a custom storage adapter on first render", async () => {
    const stored = { nav: 25, main: 75 };
    const storage = {
      load: () => stored,
      save: vi.fn(),
    };

    const Demo = () => {
      const layout = useSplitterLayout({
        initialSizes: { nav: 40, main: 60 },
        storage,
      });
      return (
        <Splitter.Root
          panes={{ nav: { minSize: 5 }, main: { minSize: 5 } }}
          defaultSizes={layout.defaultSizes}
          onSizesChange={layout.onSizesChange}
          __layoutRef={layout.__layoutRef}
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

  it("collapse() and expand() drive sizes from outside the splitter subtree", async () => {
    const user = userEvent.setup();
    let setSizesCalled: Record<string, number> | undefined;
    const Demo = () => {
      const layout = useSplitterLayout({
        initialSizes: { nav: 30, main: 70 },
      });
      return (
        <>
          <button
            type="button"
            onClick={() => {
              layout.collapse("nav");
              setSizesCalled = layout.getSizes();
            }}
          >
            collapse-nav
          </button>
          <Splitter.Root
            panes={{
              nav: { minSize: 5, collapsible: true },
              main: { minSize: 5 },
            }}
            defaultSizes={layout.defaultSizes}
            onSizesChange={layout.onSizesChange}
            __layoutRef={layout.__layoutRef}
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

    await user.click(screen.getByText("collapse-nav"));
    const handle = await screen.findByRole("separator");
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(0);
    });
    expect(setSizesCalled).toBeDefined();
  });
});

/**
 * @docs-section nesting
 * @docs-title Nested splitters for 3+ regions
 * @docs-description Each nested Splitter is an independent widget.
 * @docs-order 3
 */
describe("Splitter - Nested", () => {
  it("nests inside a Pane to express three regions", async () => {
    render(
      <NimbusProvider>
        <Splitter.Root
          panes={{ nav: { defaultSize: 25 }, rest: { defaultSize: 75 } }}
        >
          <Splitter.Pane id="nav">Nav</Splitter.Pane>
          <Splitter.Handle />
          <Splitter.Pane id="rest">
            <Splitter.Root
              panes={{
                main: { defaultSize: 65 },
                aside: { defaultSize: 35 },
              }}
            >
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
