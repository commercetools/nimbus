import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { JsonSnippet, NimbusProvider } from "@commercetools/nimbus";

const renderWithProvider = (ui: React.ReactElement) =>
  render(<NimbusProvider>{ui}</NimbusProvider>);

/**
 * @docs-section formatted-output
 * @docs-title Show a value as formatted JSON
 * @docs-description Pass any value. JsonSnippet formats it with the `indent` you choose and shows the language label "json".
 * @docs-order 1
 */
describe("JsonSnippet - Formatting", () => {
  it("shows the value as JSON", () => {
    renderWithProvider(
      <JsonSnippet title="Response" value={{ name: "x", count: 2 }} />
    );

    const region = screen.getByRole("region", { name: "Response" });
    expect(region).toHaveTextContent('"name": "x"');
    expect(region).toHaveTextContent('"count": 2');
    expect(screen.getByText("json")).toBeInTheDocument();
  });

  it("uses the indent prop", () => {
    renderWithProvider(
      <JsonSnippet title="Response" indent={4} value={{ a: 1 }} />
    );

    expect(
      screen.getByRole("region", { name: "Response" }).textContent
    ).toContain('{\n    "a": 1\n}');
  });
});

/**
 * @docs-section safe-formatting
 * @docs-title Values that JSON cannot show
 * @docs-description JsonSnippet never throws. A circular reference becomes "[Circular]", a BigInt becomes its decimal string, and `undefined` becomes the text `undefined`.
 * @docs-order 2
 */
describe("JsonSnippet - Safe formatting", () => {
  it("shows a circular reference as [Circular]", () => {
    const circular: Record<string, unknown> = { name: "node" };
    circular.self = circular;

    renderWithProvider(<JsonSnippet title="Circular" value={circular} />);

    expect(screen.getByRole("region", { name: "Circular" })).toHaveTextContent(
      '"self": "[Circular]"'
    );
  });

  it("shows a BigInt as its decimal string", () => {
    renderWithProvider(
      <JsonSnippet
        title="BigInt"
        value={{ id: BigInt("12345678901234567890") }}
      />
    );

    expect(screen.getByRole("region", { name: "BigInt" })).toHaveTextContent(
      '"id": "12345678901234567890"'
    );
  });

  it("shows undefined as text", () => {
    renderWithProvider(<JsonSnippet title="Undefined" value={undefined} />);

    expect(screen.getByRole("region", { name: "Undefined" })).toHaveTextContent(
      "undefined"
    );
  });
});

/**
 * @docs-section copy-formatted
 * @docs-title Copy the formatted JSON
 * @docs-description The copy button writes the formatted text that is shown, not the original value.
 * @docs-order 3
 */
describe("JsonSnippet - Copy", () => {
  it("copies the formatted JSON text", async () => {
    const user = userEvent.setup();

    renderWithProvider(<JsonSnippet title="Response" value={{ a: 1 }} />);

    await user.click(screen.getByRole("button", { name: "Copy code" }));

    await waitFor(async () =>
      expect(await navigator.clipboard.readText()).toBe('{\n  "a": 1\n}')
    );
  });
});
