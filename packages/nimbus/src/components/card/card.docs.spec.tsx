import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import { Card } from "@/components/card";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the card displays the correct title and content
 * @docs-order 1
 */
describe("Card - Basic rendering", () => {
  it("renders project details", () => {
    render(
      <Card.Root>
        <Card.Header>Project X</Card.Header>
        <Card.Content>Status: Active</Card.Content>
      </Card.Root>
    );

    expect(screen.getByText("Project X")).toBeInTheDocument();
    expect(screen.getByText("Status: Active")).toBeInTheDocument();
  });

  it("renders with header only", () => {
    render(
      <Card.Root>
        <Card.Header>Card Title</Card.Header>
      </Card.Root>
    );

    expect(screen.getByText("Card Title")).toBeInTheDocument();
  });

  it("renders with content only", () => {
    render(
      <Card.Root>
        <Card.Content>This is the main content.</Card.Content>
      </Card.Root>
    );

    expect(screen.getByText("This is the main content.")).toBeInTheDocument();
  });
});
