import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageContent, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section usage-examples
 * @docs-title Usage Examples
 * @docs-description Consumer implementation patterns for PageContent
 * @docs-order 1
 */
describe("PageContent - Usage examples", () => {
  it("renders a 2/1 layout with sticky sidebar", () => {
    render(
      <NimbusProvider>
        <PageContent.Root variant="wide" columns="2/1">
          <PageContent.Column>Main content</PageContent.Column>
          <PageContent.Column sticky>Sidebar</PageContent.Column>
        </PageContent.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Main content")).toBeInTheDocument();
    expect(screen.getByText("Sidebar")).toBeInTheDocument();
  });
});
