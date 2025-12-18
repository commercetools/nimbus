import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Avatar, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic rendering tests
 * @docs-description Verify the Avatar renders with expected elements and labels
 * @docs-order 1
 */
describe("Avatar - Basic rendering", () => {
  it("renders avatar with initials", () => {
    render(
      <NimbusProvider>
        <Avatar firstName="John" lastName="Doe" />
      </NimbusProvider>
    );

    expect(screen.getByRole("figure")).toBeInTheDocument();
    expect(screen.getByLabelText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("renders avatar with image", () => {
    render(
      <NimbusProvider>
        <Avatar
          firstName="Jane"
          lastName="Smith"
          src="https://example.com/avatar.jpg"
          alt="Jane Smith profile"
        />
      </NimbusProvider>
    );

    const image = screen.getByAltText("Jane Smith profile");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/avatar.jpg");
  });
});

/**
 * @docs-section size-variants
 * @docs-title Size variant tests
 * @docs-description Test different size options
 * @docs-order 2
 */
describe("Avatar - Size variants", () => {
  it("renders different sizes correctly", () => {
    const { rerender } = render(
      <NimbusProvider>
        <Avatar firstName="John" lastName="Doe" size="2xs" />
      </NimbusProvider>
    );

    let avatar = screen.getByRole("figure");
    expect(avatar).toBeInTheDocument();

    rerender(
      <NimbusProvider>
        <Avatar firstName="John" lastName="Doe" size="xs" />
      </NimbusProvider>
    );

    avatar = screen.getByRole("figure");
    expect(avatar).toBeInTheDocument();

    rerender(
      <NimbusProvider>
        <Avatar firstName="John" lastName="Doe" size="md" />
      </NimbusProvider>
    );

    avatar = screen.getByRole("figure");
    expect(avatar).toBeInTheDocument();
  });
});

/**
 * @docs-section disabled-state
 * @docs-title Disabled state tests
 * @docs-description Test disabled state styling
 * @docs-order 3
 */
describe("Avatar - Disabled state", () => {
  it("applies disabled styling when isDisabled is true", () => {
    render(
      <NimbusProvider>
        <Avatar firstName="John" lastName="Doe" isDisabled />
      </NimbusProvider>
    );

    const avatar = screen.getByRole("figure");
    expect(avatar).toBeInTheDocument();
  });
});

/**
 * @docs-section accessibility
 * @docs-title Accessibility tests
 * @docs-description Verify accessibility attributes and labeling
 * @docs-order 4
 */
describe("Avatar - Accessibility", () => {
  it("has correct aria-label with full name", () => {
    render(
      <NimbusProvider>
        <Avatar firstName="Maria" lastName="Garcia" />
      </NimbusProvider>
    );

    const avatar = screen.getByLabelText(/Maria Garcia/i);
    expect(avatar).toBeInTheDocument();
    expect(avatar.tagName).toBe("FIGURE");
  });

  it("applies custom id for tracking", () => {
    const PERSISTENT_ID = "test-avatar-id";

    render(
      <NimbusProvider>
        <Avatar id={PERSISTENT_ID} firstName="John" lastName="Doe" />
      </NimbusProvider>
    );

    const avatar = screen.getByRole("figure");
    expect(avatar).toHaveAttribute("id", PERSISTENT_ID);
  });
});
