import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CommandSnippet, NimbusProvider } from "@commercetools/nimbus";

const renderWithProvider = (ui: React.ReactElement) =>
  render(<NimbusProvider>{ui}</NimbusProvider>);

/**
 * @docs-section accessible-name
 * @docs-title Find a command by its name
 * @docs-description A command with an `aria-label` is a region. A command without a name is not a region.
 * @docs-order 1
 */
describe("CommandSnippet - Accessible name", () => {
  it("is a region when aria-label is set", () => {
    renderWithProvider(
      <CommandSnippet
        aria-label="Install Nimbus"
        command="pnpm add @commercetools/nimbus"
      />
    );

    expect(
      screen.getByRole("region", { name: "Install Nimbus" })
    ).toHaveTextContent("pnpm add @commercetools/nimbus");
  });

  it("is not a region without aria-label", () => {
    renderWithProvider(
      <CommandSnippet command="pnpm add @commercetools/nimbus" />
    );

    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });
});

/**
 * @docs-section copy-without-prompt
 * @docs-title Copy the command without the prompt
 * @docs-description The copy button writes exactly the `command` text. The prompt is never copied, and output lines are part of the text you pass.
 * @docs-order 2
 */
describe("CommandSnippet - Copy", () => {
  it("copies the command and calls onCopy", async () => {
    const user = userEvent.setup();
    const handleCopy = vi.fn();

    renderWithProvider(
      <CommandSnippet
        command="pnpm add @commercetools/nimbus"
        onCopy={handleCopy}
      />
    );

    await user.click(screen.getByRole("button", { name: "Copy code" }));

    await waitFor(() => expect(handleCopy).toHaveBeenCalledTimes(1));
    expect(await navigator.clipboard.readText()).toBe(
      "pnpm add @commercetools/nimbus"
    );
  });

  it("copies a multi-line command with output without prompts", async () => {
    const user = userEvent.setup();

    renderWithProvider(
      <CommandSnippet command={"npm whoami\nalice"} outputLines={[2]} />
    );

    await user.click(screen.getByRole("button", { name: "Copy code" }));

    await waitFor(async () =>
      expect(await navigator.clipboard.readText()).toBe("npm whoami\nalice")
    );
  });

  it("hides the copy button with showCopyButton={false}", () => {
    renderWithProvider(
      <CommandSnippet command="pnpm install" showCopyButton={false} />
    );

    expect(
      screen.queryByRole("button", { name: "Copy code" })
    ).not.toBeInTheDocument();
  });
});

/**
 * @docs-section prompt
 * @docs-title Show or hide the prompt
 * @docs-description The default prompt is "$". Set `prompt` to another text, or to an empty string for no prompt.
 * @docs-order 3
 */
describe("CommandSnippet - Prompt", () => {
  it("shows the default prompt", () => {
    renderWithProvider(
      <CommandSnippet aria-label="Install" command="pnpm install" />
    );

    expect(screen.getByRole("region", { name: "Install" })).toHaveTextContent(
      "$"
    );
  });

  it("shows no prompt for an empty string", () => {
    renderWithProvider(
      <CommandSnippet aria-label="Install" command="pnpm install" prompt="" />
    );

    expect(
      screen.getByRole("region", { name: "Install" })
    ).not.toHaveTextContent("$");
  });

  it("shows no header", () => {
    renderWithProvider(
      <CommandSnippet aria-label="Install" command="pnpm install" />
    );

    expect(screen.queryByText("bash")).not.toBeInTheDocument();
  });
});
