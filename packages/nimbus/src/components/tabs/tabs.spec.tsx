import { describe, it, expect, vi, afterEach, type MockInstance } from "vitest";
import { render, screen } from "@testing-library/react";
import { NimbusProvider, Tabs } from "@commercetools/nimbus";

/**
 * Whether React logged the dev-only empty-`href` error. React formats it as
 * `console.error("An empty string ... %s attribute ...", "href", "href")`, so
 * the attribute name arrives as a substitution argument rather than in the
 * template — match on both.
 */
const collectedHrefWarning = (error: MockInstance) =>
  error.mock.calls.some(
    (args) =>
      typeof args[0] === "string" &&
      args[0].includes("An empty string") &&
      args.includes("href")
  );

/**
 * Regression guard for the empty-`href` warning on plain tabs.
 *
 * React Aria keys its link handling off the *presence* of the `href` prop, not
 * its value. Forwarding `href={undefined}` to a non-link tab made React Aria
 * coerce it to an empty string and render `href=""` on the tab's `<div>`, which
 * React rejects at runtime with a dev-only console error ("An empty string was
 * passed to the href attribute"). Plain tabs must never forward an href, so
 * this warning must never fire for them.
 */
describe("Tabs — plain (non-link) tabs", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not emit an empty-string href warning", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <NimbusProvider>
        <Tabs.Root>
          <Tabs.List aria-label="Example tabs">
            <Tabs.Tab id="one">One</Tabs.Tab>
            <Tabs.Tab id="two">Two</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel id="one">First panel</Tabs.Panel>
            <Tabs.Panel id="two">Second panel</Tabs.Panel>
          </Tabs.Panels>
        </Tabs.Root>
      </NimbusProvider>
    );

    expect(collectedHrefWarning(error)).toBe(false);
  });

  it("does not emit an empty-string href warning via the `tabs` prop", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <NimbusProvider>
        <Tabs.Root
          tabListAriaLabel="Example tabs"
          tabs={[
            { id: "one", tabLabel: "One", panelContent: "First panel" },
            { id: "two", tabLabel: "Two", panelContent: "Second panel" },
          ]}
        />
      </NimbusProvider>
    );

    expect(collectedHrefWarning(error)).toBe(false);
  });
});

describe("Tabs — link tabs", () => {
  it("renders a tab with an href as an anchor pointing at that href", () => {
    render(
      <NimbusProvider>
        <Tabs.Root>
          <Tabs.List aria-label="Example tabs">
            <Tabs.Tab id="home" href="https://example.com/home">
              Home
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel id="home">Home panel</Tabs.Panel>
          </Tabs.Panels>
        </Tabs.Root>
      </NimbusProvider>
    );

    const tab = screen.getByRole("tab", { name: "Home" });
    expect(tab.tagName).toBe("A");
    expect(tab).toHaveAttribute("href", "https://example.com/home");
  });
});
