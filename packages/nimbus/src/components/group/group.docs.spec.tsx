import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Group, Button, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the Group component renders correctly with children
 * @docs-order 1
 */
describe("Group - Basic rendering", () => {
  it("renders group with children", () => {
    render(
      <NimbusProvider>
        <Group aria-label="Test group">
          <Button>First</Button>
          <Button>Second</Button>
          <Button>Third</Button>
        </Group>
      </NimbusProvider>
    );

    const group = screen.getByRole("group", { name: "Test group" });
    expect(group).toBeInTheDocument();

    // Verify all children are rendered
    expect(screen.getByRole("button", { name: "First" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Second" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Third" })).toBeInTheDocument();
  });

  it("applies custom className and id", () => {
    render(
      <NimbusProvider>
        <Group
          aria-label="Custom group"
          className="custom-class"
          id="custom-id"
        >
          <Button>Content</Button>
        </Group>
      </NimbusProvider>
    );

    const group = screen.getByRole("group", { name: "Custom group" });
    expect(group).toHaveClass("custom-class");
    expect(group).toHaveAttribute("id", "custom-id");
  });
});

/**
 * @docs-section accessibility
 * @docs-title Accessibility Tests
 * @docs-description Verify the Group component follows accessibility best practices
 * @docs-order 2
 */
describe("Group - Accessibility", () => {
  it('applies role="group" to the container', () => {
    render(
      <NimbusProvider>
        <Group aria-label="Accessible group">
          <Button>Action</Button>
        </Group>
      </NimbusProvider>
    );

    const group = screen.getByRole("group");
    expect(group).toHaveAttribute("role", "group");
  });

  it("supports aria-label for screen readers", () => {
    render(
      <NimbusProvider>
        <Group aria-label="Action buttons">
          <Button>Save</Button>
          <Button>Cancel</Button>
        </Group>
      </NimbusProvider>
    );

    const group = screen.getByRole("group", { name: "Action buttons" });
    expect(group).toHaveAttribute("aria-label", "Action buttons");
  });

  it("supports aria-labelledby for external labels", () => {
    render(
      <NimbusProvider>
        <div>
          <h2 id="group-heading">Form Actions</h2>
          <Group aria-labelledby="group-heading">
            <Button>Submit</Button>
            <Button>Reset</Button>
          </Group>
        </div>
      </NimbusProvider>
    );

    const group = screen.getByRole("group", { name: "Form Actions" });
    expect(group).toHaveAttribute("aria-labelledby", "group-heading");
  });
});

/**
 * @docs-section hover-handlers
 * @docs-title Hover Handler Tests
 * @docs-description Test hover event handlers on the Group component
 * @docs-order 3
 */
describe("Group - Hover handlers", () => {
  it("calls onHoverStart when mouse enters the group", async () => {
    const user = userEvent.setup();
    const onHoverStart = vi.fn();

    render(
      <NimbusProvider>
        <Group aria-label="Hover group" onHoverStart={onHoverStart}>
          <Button>Action</Button>
        </Group>
      </NimbusProvider>
    );

    const group = screen.getByRole("group", { name: "Hover group" });
    await user.hover(group);

    expect(onHoverStart).toHaveBeenCalledTimes(1);
  });

  it("calls onHoverEnd when mouse leaves the group", async () => {
    const user = userEvent.setup();
    const onHoverEnd = vi.fn();

    render(
      <NimbusProvider>
        <Group aria-label="Hover group" onHoverEnd={onHoverEnd}>
          <Button>Action</Button>
        </Group>
      </NimbusProvider>
    );

    const group = screen.getByRole("group", { name: "Hover group" });
    await user.hover(group);
    await user.unhover(group);

    expect(onHoverEnd).toHaveBeenCalledTimes(1);
  });

  it("calls onHoverChange with hover state", async () => {
    const user = userEvent.setup();
    const onHoverChange = vi.fn();

    render(
      <NimbusProvider>
        <Group aria-label="Hover group" onHoverChange={onHoverChange}>
          <Button>Action</Button>
        </Group>
      </NimbusProvider>
    );

    const group = screen.getByRole("group", { name: "Hover group" });

    // Hover over the group
    await user.hover(group);
    expect(onHoverChange).toHaveBeenCalledWith(true);

    // Unhover from the group
    await user.unhover(group);
    expect(onHoverChange).toHaveBeenCalledWith(false);
  });
});

/**
 * @docs-section style-props
 * @docs-title Style Props Tests
 * @docs-description Test Chakra UI style props support
 * @docs-order 4
 */
describe("Group - Style props", () => {
  it("supports gap style prop for spacing", () => {
    render(
      <NimbusProvider>
        <Group aria-label="Spaced group" gap="300">
          <Button>First</Button>
          <Button>Second</Button>
        </Group>
      </NimbusProvider>
    );

    const group = screen.getByRole("group", { name: "Spaced group" });
    expect(group).toBeInTheDocument();
    // Note: Gap styling is applied via CSS, testing visual appearance
    // would require integration or E2E tests
  });

  it("supports layout style props", () => {
    render(
      <NimbusProvider>
        <Group
          aria-label="Custom layout"
          flexDirection="column"
          alignItems="flex-start"
          padding="400"
        >
          <Button>Action</Button>
        </Group>
      </NimbusProvider>
    );

    const group = screen.getByRole("group", { name: "Custom layout" });
    expect(group).toBeInTheDocument();
    // Layout styles are applied via Chakra UI's style props system
  });

  it("supports color and background style props", () => {
    render(
      <NimbusProvider>
        <Group
          aria-label="Styled group"
          backgroundColor="primary.2"
          borderRadius="200"
        >
          <Button>Action</Button>
        </Group>
      </NimbusProvider>
    );

    const group = screen.getByRole("group", { name: "Styled group" });
    expect(group).toBeInTheDocument();
    // Color and background styles are applied via Chakra UI
  });
});

/**
 * @docs-section integration
 * @docs-title Integration Tests
 * @docs-description Test common usage patterns and integration scenarios
 * @docs-order 5
 */
describe("Group - Integration patterns", () => {
  it("works with button groups for toolbars", () => {
    render(
      <NimbusProvider>
        <Group aria-label="Text formatting toolbar">
          <Button aria-label="Bold">B</Button>
          <Button aria-label="Italic">I</Button>
          <Button aria-label="Underline">U</Button>
        </Group>
      </NimbusProvider>
    );

    const group = screen.getByRole("group", {
      name: "Text formatting toolbar",
    });
    expect(group).toBeInTheDocument();

    // Verify all toolbar buttons are accessible
    expect(screen.getByRole("button", { name: "Bold" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Italic" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Underline" })
    ).toBeInTheDocument();
  });

  it("maintains keyboard navigation of child elements", async () => {
    const user = userEvent.setup();
    const onFirstClick = vi.fn();
    const onSecondClick = vi.fn();

    render(
      <NimbusProvider>
        <Group aria-label="Navigation group">
          <Button onClick={onFirstClick}>First</Button>
          <Button onClick={onSecondClick}>Second</Button>
        </Group>
      </NimbusProvider>
    );

    // Tab to first button and activate
    await user.tab();
    await user.keyboard("{Enter}");
    expect(onFirstClick).toHaveBeenCalledTimes(1);

    // Tab to second button and activate
    await user.tab();
    await user.keyboard("{Enter}");
    expect(onSecondClick).toHaveBeenCalledTimes(1);
  });

  it("supports nested groups for complex layouts", () => {
    render(
      <NimbusProvider>
        <Group aria-label="Main toolbar">
          <Group aria-label="File operations">
            <Button>New</Button>
            <Button>Open</Button>
            <Button>Save</Button>
          </Group>
          <Group aria-label="Edit operations">
            <Button>Cut</Button>
            <Button>Copy</Button>
            <Button>Paste</Button>
          </Group>
        </Group>
      </NimbusProvider>
    );

    // Verify all groups are present
    expect(
      screen.getByRole("group", { name: "Main toolbar" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "File operations" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "Edit operations" })
    ).toBeInTheDocument();
  });
});
