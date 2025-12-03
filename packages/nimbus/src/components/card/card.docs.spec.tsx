import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the card displays the correct title and content
 * @docs-order 1
 */
describe("Card - Basic rendering", () => {
  it("renders project details", () => {
    render(
      <NimbusProvider>
        <Card.Root>
          <Card.Header>Project X</Card.Header>
          <Card.Content>Status: Active</Card.Content>
        </Card.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Project X")).toBeInTheDocument();
    expect(screen.getByText("Status: Active")).toBeInTheDocument();
  });

  it("renders with header only", () => {
    render(
      <NimbusProvider>
        <Card.Root>
          <Card.Header>Card Title</Card.Header>
        </Card.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Card Title")).toBeInTheDocument();
  });

  it("renders with content only", () => {
    render(
      <NimbusProvider>
        <Card.Root>
          <Card.Content>This is the main content.</Card.Content>
        </Card.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("This is the main content.")).toBeInTheDocument();
  });
});
