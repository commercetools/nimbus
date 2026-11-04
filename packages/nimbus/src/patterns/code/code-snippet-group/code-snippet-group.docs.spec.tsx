import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CodeSnippetGroup, NimbusProvider } from "@commercetools/nimbus";

const items = [
  {
    key: "curl",
    label: "cURL",
    code: "curl https://api.example.com/products",
    language: "bash",
  },
  {
    key: "js",
    label: "JavaScript",
    code: 'await fetch("https://api.example.com/products");',
    language: "js",
    fileName: "products.js",
  },
  {
    key: "java",
    label: "Java",
    code: 'client.get("https://api.example.com/products");',
    language: "java",
  },
];

const renderWithProvider = (ui: React.ReactElement) =>
  render(<NimbusProvider>{ui}</NimbusProvider>);

/**
 * @docs-section switching-tabs
 * @docs-title Switch examples with tabs
 * @docs-description The first item is shown first. Select another tab to show another example. `onSelectionChange` receives the key of the new item.
 * @docs-order 1
 */
describe("CodeSnippetGroup - Tabs", () => {
  it("shows the first item and switches when a tab is selected", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    renderWithProvider(
      <CodeSnippetGroup
        title="List products"
        items={items}
        onSelectionChange={handleChange}
      />
    );

    const region = screen.getByRole("region", { name: "List products" });
    expect(region).toHaveTextContent("curl https://api.example.com/products");

    await user.click(screen.getByRole("tab", { name: "JavaScript" }));

    expect(handleChange).toHaveBeenCalledWith("js");
    await waitFor(() => expect(region).toHaveTextContent("await fetch"));
  });
});

/**
 * @docs-section switching-select
 * @docs-title Switch examples with a select
 * @docs-description With `switcher="select"`, the examples are options of a select. Its accessible name is "Code example" unless you set `switcherLabel`.
 * @docs-order 2
 */
describe("CodeSnippetGroup - Select", () => {
  it("switches the shown example", async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <CodeSnippetGroup title="List products" switcher="select" items={items} />
    );

    await user.click(screen.getByRole("button", { name: /Code example/ }));
    await user.click(await screen.findByRole("option", { name: "Java" }));

    await waitFor(() =>
      expect(
        screen.getByRole("region", { name: "List products" })
      ).toHaveTextContent("client.get")
    );
  });
});

/**
 * @docs-section controlled-selection
 * @docs-title Control the selected item
 * @docs-description Use `selectedKey` and `onSelectionChange` to keep the selection in your own state. Use `defaultSelectedKey` to choose the first item for an uncontrolled group.
 * @docs-order 3
 */
describe("CodeSnippetGroup - Selection", () => {
  it("follows the selectedKey of the parent", async () => {
    const user = userEvent.setup();

    const Controlled = () => {
      const [key, setKey] = useState("java");
      return (
        <NimbusProvider>
          <CodeSnippetGroup
            title="List products"
            items={items}
            selectedKey={key}
            onSelectionChange={setKey}
          />
          <output data-testid="selected">{key}</output>
        </NimbusProvider>
      );
    };

    render(<Controlled />);

    expect(screen.getByRole("tab", { name: "Java" })).toHaveAttribute(
      "aria-selected",
      "true"
    );

    await user.click(screen.getByRole("tab", { name: "cURL" }));

    await waitFor(() =>
      expect(screen.getByTestId("selected")).toHaveTextContent("curl")
    );
  });

  it("starts with defaultSelectedKey", () => {
    renderWithProvider(
      <CodeSnippetGroup
        title="List products"
        items={items}
        defaultSelectedKey="js"
      />
    );

    expect(screen.getByRole("tab", { name: "JavaScript" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });
});

/**
 * @docs-section actions-follow-selection
 * @docs-title Copy and download follow the selected item
 * @docs-description Copy writes the code of the selected item and `onCopy` receives its key. The download button appears only when the selected item has a `fileName`.
 * @docs-order 4
 */
describe("CodeSnippetGroup - Actions", () => {
  it("copies the selected item and reports its key", async () => {
    const user = userEvent.setup();
    const handleCopy = vi.fn();

    renderWithProvider(
      <CodeSnippetGroup
        title="List products"
        items={items}
        onCopy={handleCopy}
      />
    );

    await user.click(screen.getByRole("tab", { name: "JavaScript" }));
    await user.click(screen.getByRole("button", { name: "Copy code" }));

    await waitFor(() => expect(handleCopy).toHaveBeenCalledWith("js"));
    expect(await navigator.clipboard.readText()).toBe(items[1].code);
  });

  it("shows the download button only for items with a fileName", async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <CodeSnippetGroup title="List products" items={items} />
    );

    expect(
      screen.queryByRole("button", { name: "Download code" })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "JavaScript" }));

    expect(
      await screen.findByRole("button", { name: "Download code" })
    ).toBeInTheDocument();
  });
});
