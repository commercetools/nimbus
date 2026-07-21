import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Item, IconButton, NimbusProvider } from "@commercetools/nimbus";
import { Person, Settings, Delete } from "@commercetools/nimbus-icons";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Compose a static row from media, title, and description
 * @docs-order 1
 */
describe("Item - Basic rendering", () => {
  it("renders a static row as a plain div", () => {
    render(
      <NimbusProvider>
        <Item.Root variant="outline" data-testid="item">
          <Item.Media variant="icon">
            <Person />
          </Item.Media>
          <Item.Content>
            <Item.Title>Profile</Item.Title>
            <Item.Description>
              Name, avatar, and contact details
            </Item.Description>
          </Item.Content>
        </Item.Root>
      </NimbusProvider>
    );

    expect(screen.getByTestId("item").tagName).toBe("DIV");
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(
      screen.getByText("Name, avatar, and contact details")
    ).toBeInTheDocument();
  });

  it("renders header and footer bands", () => {
    render(
      <NimbusProvider>
        <Item.Root variant="outline">
          <Item.Header>Header band</Item.Header>
          <Item.Content>
            <Item.Title>With header and footer</Item.Title>
          </Item.Content>
          <Item.Footer>Footer band</Item.Footer>
        </Item.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Header band")).toBeInTheDocument();
    expect(screen.getByText("Footer band")).toBeInTheDocument();
  });
});

/**
 * @docs-section link-row
 * @docs-title Link Row Tests
 * @docs-description Passing href upgrades Item.Root to an accessible link
 * @docs-order 2
 */
describe("Item - Link row", () => {
  it("upgrades to an <a> with href", () => {
    render(
      <NimbusProvider>
        <Item.Root href="/settings" variant="outline">
          <Item.Media variant="icon">
            <Settings />
          </Item.Media>
          <Item.Content>
            <Item.Title>Settings</Item.Title>
            <Item.Description>Navigate to settings</Item.Description>
          </Item.Content>
        </Item.Root>
      </NimbusProvider>
    );

    const link = screen.getByRole("link", { name: /Settings/ });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/settings");
  });

  it("renders as a plain div when href is omitted", () => {
    render(
      <NimbusProvider>
        <Item.Root variant="outline" data-testid="item">
          <Item.Content>
            <Item.Title>Settings</Item.Title>
          </Item.Content>
        </Item.Root>
      </NimbusProvider>
    );

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByTestId("item").tagName).toBe("DIV");
  });
});

/**
 * @docs-section row-with-actions
 * @docs-title Row With Actions Tests
 * @docs-description Actions inside Item.Actions stay independently operable, even inside a link row
 * @docs-order 3
 */
describe("Item - Row with actions", () => {
  it("fires the action handler without navigating the row", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <NimbusProvider>
        <Item.Root href="#report" variant="outline">
          <Item.Content>
            <Item.Title>Report Q3</Item.Title>
            <Item.Description>Opens the report</Item.Description>
          </Item.Content>
          <Item.Actions>
            <IconButton aria-label="Delete" size="xs" onPress={onDelete}>
              <Delete />
            </IconButton>
          </Item.Actions>
        </Item.Root>
      </NimbusProvider>
    );

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(onDelete).toHaveBeenCalledTimes(1);
    // The row link is still present and the location was never navigated.
    expect(screen.getByRole("link", { name: /Report Q3/ })).toBeInTheDocument();
    expect(window.location.hash).not.toBe("#report");
  });
});
