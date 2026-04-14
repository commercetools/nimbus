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
          <Card.Body>Status: Active</Card.Body>
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

  it("renders with body only", () => {
    render(
      <NimbusProvider>
        <Card.Root>
          <Card.Body>This is the main content.</Card.Body>
        </Card.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("This is the main content.")).toBeInTheDocument();
  });

  it("renders with footer", () => {
    render(
      <NimbusProvider>
        <Card.Root>
          <Card.Header>Title</Card.Header>
          <Card.Body>Content</Card.Body>
          <Card.Footer>Footer actions</Card.Footer>
        </Card.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByText("Footer actions")).toBeInTheDocument();
  });

  it("renders with variant and size props", () => {
    render(
      <NimbusProvider>
        <Card.Root variant="elevated" size="lg">
          <Card.Body>Elevated card</Card.Body>
        </Card.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Elevated card")).toBeInTheDocument();
  });
});
