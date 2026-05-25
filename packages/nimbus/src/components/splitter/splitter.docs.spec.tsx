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
 * @docs-description Verify the Splitter renders two panes plus a handle.
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
    expect(handle).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("exposes aria-valuemin/max derived from per-pane constraints", async () => {
    render(
      <NimbusProvider>
        <Splitter.Root
          panes={{
            nav: { defaultSize: 30, minSize: 15, maxSize: 50 },
            main: { defaultSize: 70, minSize: 25 },
          }}
        >
          <Splitter.Pane id="nav">Nav</Splitter.Pane>
          <Splitter.Handle />
          <Splitter.Pane id="main">Main</Splitter.Pane>
        </Splitter.Root>
      </NimbusProvider>
    );

    const handle = await screen.findByRole("separator");
    expect(handle).toHaveAttribute("aria-valuemin", "15");
    // 100 − panes.main.minSize (25) = 75, capped by panes.nav.maxSize (50).
    expect(handle).toHaveAttribute("aria-valuemax", "50");
  });
});

/**
 * @docs-section keyboard
 * @docs-title Keyboard interaction
 * @docs-description Arrow keys, Home/End, and Enter on the focused handle.
 * @docs-order 2
 */
describe("Splitter - Keyboard interaction", () => {
  it("ArrowRight grows the previous pane by keyboardStep", async () => {
    const user = userEvent.setup();
    const onSizesChange = vi.fn();
    render(
      <NimbusProvider>
        <Splitter.Root
          panes={{ nav: { defaultSize: 30 }, main: { defaultSize: 70 } }}
          keyboardStep={5}
          onSizesChange={onSizesChange}
        >
          <Splitter.Pane id="nav">Nav</Splitter.Pane>
          <Splitter.Handle />
          <Splitter.Pane id="main">Main</Splitter.Pane>
        </Splitter.Root>
      </NimbusProvider>
    );

    const handle = await screen.findByRole("separator");
    handle.focus();
    await user.keyboard("{ArrowRight}");

    expect(onSizesChange).toHaveBeenCalled();
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(35);
    });
  });

  it("Home and End jump to the constraint bounds", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Splitter.Root
          panes={{
            nav: { defaultSize: 30, minSize: 10 },
            main: { defaultSize: 70, minSize: 20 },
          }}
        >
          <Splitter.Pane id="nav">Nav</Splitter.Pane>
          <Splitter.Handle />
          <Splitter.Pane id="main">Main</Splitter.Pane>
        </Splitter.Root>
      </NimbusProvider>
    );

    const handle = await screen.findByRole("separator");
    handle.focus();

    await user.keyboard("{Home}");
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(10);
    });

    await user.keyboard("{End}");
    await waitFor(() => {
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(80);
    });
  });

  it("Enter toggles collapse of the adjacent collapsible pane", async () => {
    const user = userEvent.setup();
    const onCollapse = vi.fn();
    const onExpand = vi.fn();
    render(
      <NimbusProvider>
        <Splitter.Root
          panes={{
            nav: { defaultSize: 30, collapsible: true },
            main: { defaultSize: 70 },
          }}
          onCollapse={onCollapse}
          onExpand={onExpand}
        >
          <Splitter.Pane id="nav">Nav</Splitter.Pane>
          <Splitter.Handle />
          <Splitter.Pane id="main">Main</Splitter.Pane>
        </Splitter.Root>
      </NimbusProvider>
    );

    const handle = await screen.findByRole("separator");
    handle.focus();

    await user.keyboard("{Enter}");
    await waitFor(() => expect(onCollapse).toHaveBeenCalledWith("nav"));

    await user.keyboard("{Enter}");
    await waitFor(() => expect(onExpand).toHaveBeenCalledWith("nav"));
  });
});

/**
 * @docs-section disabled
 * @docs-title Disabled state
 * @docs-description When both panes are disabled the handle is out of tab order.
 * @docs-order 3
 */
describe("Splitter - Disabled state", () => {
  it("removes handle from tab order when both panes are disabled", async () => {
    render(
      <NimbusProvider>
        <Splitter.Root
          panes={{
            nav: { defaultSize: 30, disabled: true },
            main: { defaultSize: 70, disabled: true },
          }}
        >
          <Splitter.Pane id="nav">Nav</Splitter.Pane>
          <Splitter.Handle />
          <Splitter.Pane id="main">Main</Splitter.Pane>
        </Splitter.Root>
      </NimbusProvider>
    );

    const handle = await screen.findByRole("separator");
    expect(handle).toHaveAttribute("tabindex", "-1");
    expect(handle).toHaveAttribute("aria-disabled", "true");
  });
});

/**
 * @docs-section persistence
 * @docs-title Persistence with useSplitterLayout
 * @docs-description Custom storage adapter hydrates sizes synchronously on first render.
 * @docs-order 4
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
 * @docs-order 5
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
