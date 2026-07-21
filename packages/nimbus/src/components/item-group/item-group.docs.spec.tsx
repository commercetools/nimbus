import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Item, ItemGroup, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify a group renders its rows and the separators between them
 * @docs-order 1
 */
describe("ItemGroup - Basic rendering", () => {
  it("renders each row's content", () => {
    render(
      <NimbusProvider>
        <ItemGroup.Root>
          <Item.Root>
            <Item.Content>
              <Item.Title>Profile</Item.Title>
              <Item.Description>
                Name, avatar, and contact details
              </Item.Description>
            </Item.Content>
          </Item.Root>
          <ItemGroup.Separator />
          <Item.Root>
            <Item.Content>
              <Item.Title>Notifications</Item.Title>
              <Item.Description>Email and push preferences</Item.Description>
            </Item.Content>
          </Item.Root>
        </ItemGroup.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Notifications")).toBeInTheDocument();
  });

  it("renders a separator between rows", () => {
    render(
      <NimbusProvider>
        <ItemGroup.Root>
          <Item.Root>
            <Item.Content>
              <Item.Title>Profile</Item.Title>
            </Item.Content>
          </Item.Root>
          <ItemGroup.Separator />
          <Item.Root>
            <Item.Content>
              <Item.Title>Settings</Item.Title>
            </Item.Content>
          </Item.Root>
        </ItemGroup.Root>
      </NimbusProvider>
    );

    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("renders no implicit role on the group container", () => {
    render(
      <NimbusProvider>
        <ItemGroup.Root data-testid="group">
          <Item.Root>
            <Item.Content>
              <Item.Title>Profile</Item.Title>
            </Item.Content>
          </Item.Root>
        </ItemGroup.Root>
      </NimbusProvider>
    );

    expect(screen.getByTestId("group")).not.toHaveAttribute("role");
  });
});

/**
 * @docs-section grouped-link-rows
 * @docs-title Grouped Link Rows
 * @docs-description Item rows upgrade to accessible links when given an href, and ItemGroup composes with them the same way
 * @docs-order 2
 */
describe("ItemGroup - Grouped link rows", () => {
  it("renders each linked row as an accessible link", () => {
    render(
      <NimbusProvider>
        <ItemGroup.Root>
          <Item.Root href="#profile">
            <Item.Content>
              <Item.Title>Profile</Item.Title>
            </Item.Content>
          </Item.Root>
          <ItemGroup.Separator />
          <Item.Root href="#settings">
            <Item.Content>
              <Item.Title>Settings</Item.Title>
            </Item.Content>
          </Item.Root>
        </ItemGroup.Root>
      </NimbusProvider>
    );

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "#profile");
    expect(links[1]).toHaveAttribute("href", "#settings");
  });
});
