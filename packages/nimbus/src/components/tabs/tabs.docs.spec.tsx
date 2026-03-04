import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs, NimbusProvider } from "@commercetools/nimbus";
import type { NimbusRouterConfig } from "../nimbus-provider/nimbus-provider.types";

/**
 * @docs-section basic-usage
 * @docs-title Basic Usage
 * @docs-description How to render tabs using the compound composition API
 * @docs-order 1
 */
describe("Tabs - Basic usage", () => {
  it("renders tabs with compound composition", () => {
    render(
      <NimbusProvider>
        <Tabs.Root>
          <Tabs.List>
            <Tabs.Tab id="overview">Overview</Tabs.Tab>
            <Tabs.Tab id="details">Details</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel id="overview">Overview content</Tabs.Panel>
            <Tabs.Panel id="details">Details content</Tabs.Panel>
          </Tabs.Panels>
        </Tabs.Root>
      </NimbusProvider>
    );

    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Overview" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Details" })).toBeInTheDocument();
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Overview content");
  });

  it("renders tabs with the simplified tabs prop", () => {
    const tabs = [
      {
        id: "overview",
        tabLabel: "Overview",
        panelContent: "Overview content",
      },
      { id: "details", tabLabel: "Details", panelContent: "Details content" },
    ];

    render(
      <NimbusProvider>
        <Tabs.Root tabs={tabs} />
      </NimbusProvider>
    );

    expect(screen.getByRole("tab", { name: "Overview" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Details" })).toBeInTheDocument();
  });
});

/**
 * @docs-section controlled-tabs
 * @docs-title Controlled Tabs
 * @docs-description How to control the active tab from external state (e.g., URL parameters)
 * @docs-order 2
 */
describe("Tabs - Controlled tabs", () => {
  it("controls the selected tab via selectedKey and onSelectionChange", async () => {
    const user = userEvent.setup();
    const handleSelectionChange = vi.fn();

    const ControlledExample = () => {
      const [selectedKey, setSelectedKey] = React.useState<string | number>(
        "overview"
      );

      return (
        <Tabs.Root
          selectedKey={selectedKey}
          onSelectionChange={(key) => {
            setSelectedKey(key);
            handleSelectionChange(key);
          }}
        >
          <Tabs.List>
            <Tabs.Tab id="overview">Overview</Tabs.Tab>
            <Tabs.Tab id="details">Details</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel id="overview">Overview content</Tabs.Panel>
            <Tabs.Panel id="details">Details content</Tabs.Panel>
          </Tabs.Panels>
        </Tabs.Root>
      );
    };

    render(
      <NimbusProvider>
        <ControlledExample />
      </NimbusProvider>
    );

    await user.click(screen.getByRole("tab", { name: "Details" }));

    expect(handleSelectionChange).toHaveBeenCalledWith("details");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Details content");
  });

  it("sets the initial tab with defaultSelectedKey", () => {
    render(
      <NimbusProvider>
        <Tabs.Root defaultSelectedKey="details">
          <Tabs.List>
            <Tabs.Tab id="overview">Overview</Tabs.Tab>
            <Tabs.Tab id="details">Details</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel id="overview">Overview content</Tabs.Panel>
            <Tabs.Panel id="details">Details content</Tabs.Panel>
          </Tabs.Panels>
        </Tabs.Root>
      </NimbusProvider>
    );

    expect(screen.getByRole("tab", { name: "Details" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });
});

/**
 * @docs-section router-integration
 * @docs-title Router Integration
 * @docs-description How to use tabs as links for URL-driven navigation with a client-side router
 * @docs-order 3
 */
describe("Tabs - Router integration", () => {
  it("renders link tabs that navigate via the router", async () => {
    const user = userEvent.setup();
    const navigate = vi.fn();

    const router: NimbusRouterConfig = { navigate };

    render(
      <NimbusProvider router={router}>
        <Tabs.Root>
          <Tabs.List>
            <Tabs.Tab id="overview" href="/products?tab=overview">
              Overview
            </Tabs.Tab>
            <Tabs.Tab id="details" href="/products?tab=details">
              Details
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel id="overview">Overview content</Tabs.Panel>
            <Tabs.Panel id="details">Details content</Tabs.Panel>
          </Tabs.Panels>
        </Tabs.Root>
      </NimbusProvider>
    );

    // Link tabs render as anchor elements
    const detailsTab = screen.getByRole("tab", { name: "Details" });
    expect(detailsTab.tagName).toBe("A");
    expect(detailsTab).toHaveAttribute("href", "/products?tab=details");

    // Clicking calls the router navigate function
    await user.click(detailsTab);
    expect(navigate).toHaveBeenCalledWith("/products?tab=details", undefined);
  });
});

/**
 * @docs-section disabled-tabs
 * @docs-title Disabled Tabs
 * @docs-description How to disable individual tabs or sets of tabs
 * @docs-order 4
 */
describe("Tabs - Disabled tabs", () => {
  it("disables specific tabs via disabledKeys on the root", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <Tabs.Root disabledKeys={["details"]}>
          <Tabs.List>
            <Tabs.Tab id="overview">Overview</Tabs.Tab>
            <Tabs.Tab id="details">Details</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel id="overview">Overview content</Tabs.Panel>
            <Tabs.Panel id="details">Details content</Tabs.Panel>
          </Tabs.Panels>
        </Tabs.Root>
      </NimbusProvider>
    );

    const disabledTab = screen.getByRole("tab", { name: "Details" });
    expect(disabledTab).toHaveAttribute("aria-disabled", "true");
  });

  it("disables individual tabs via the isDisabled prop", () => {
    render(
      <NimbusProvider>
        <Tabs.Root>
          <Tabs.List>
            <Tabs.Tab id="overview">Overview</Tabs.Tab>
            <Tabs.Tab id="details" isDisabled>
              Details
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel id="overview">Overview content</Tabs.Panel>
            <Tabs.Panel id="details">Details content</Tabs.Panel>
          </Tabs.Panels>
        </Tabs.Root>
      </NimbusProvider>
    );

    expect(screen.getByRole("tab", { name: "Details" })).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });
});

/**
 * @docs-section dynamic-tabs
 * @docs-title Dynamic Tabs
 * @docs-description How to render tabs from dynamic data and handle updates
 * @docs-order 5
 */
describe("Tabs - Dynamic tabs", () => {
  it("renders tabs from a dynamic array and updates when data changes", () => {
    const initialTabs = [
      { id: "1", tabLabel: "First", panelContent: "First content" },
      { id: "2", tabLabel: "Second", panelContent: "Second content" },
    ];

    const { rerender } = render(
      <NimbusProvider>
        <Tabs.Root tabs={initialTabs} />
      </NimbusProvider>
    );

    expect(screen.getByRole("tab", { name: "First" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Second" })).toBeInTheDocument();

    const updatedTabs = [
      ...initialTabs,
      { id: "3", tabLabel: "Third", panelContent: "Third content" },
    ];

    rerender(
      <NimbusProvider>
        <Tabs.Root tabs={updatedTabs} />
      </NimbusProvider>
    );

    expect(screen.getByRole("tab", { name: "Third" })).toBeInTheDocument();
  });
});
