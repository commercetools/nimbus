import { describe, it, expect } from "vitest";
import { Fragment, useEffect, useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Item,
  ItemGroup,
  IconButton,
  NimbusProvider,
} from "@commercetools/nimbus";
import { Delete } from "@commercetools/nimbus-icons";

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

/**
 * @docs-section async-data
 * @docs-title Async Data & State Management
 * @docs-description Populate a group from data fetched after mount, interleave separators between rows, and update the group from a row action
 * @docs-order 3
 */
describe("ItemGroup - Async data and state management", () => {
  it("renders rows once data resolves and removes one via a row action", async () => {
    const user = userEvent.setup();

    type Resource = { id: string; title: string; description: string };

    const fetchResources = (): Promise<Resource[]> =>
      Promise.resolve([
        { id: "spec", title: "Design spec", description: "PDF · 2.4 MB" },
        { id: "assets", title: "Brand assets", description: "ZIP · 18 MB" },
      ]);

    const FileGroup = () => {
      const [resources, setResources] = useState<Resource[] | null>(null);

      useEffect(() => {
        let active = true;
        void fetchResources().then((data) => {
          if (active) setResources(data);
        });
        return () => {
          active = false;
        };
      }, []);

      if (!resources) return <span>Loading files…</span>;

      return (
        <ItemGroup.Root aria-label="Files">
          {resources.map((resource, index) => (
            <Fragment key={resource.id}>
              {index > 0 && <ItemGroup.Separator />}
              <Item.Root>
                <Item.Content>
                  <Item.Title>{resource.title}</Item.Title>
                  <Item.Description>{resource.description}</Item.Description>
                </Item.Content>
                <Item.Actions>
                  <IconButton
                    aria-label={`Remove ${resource.title}`}
                    size="xs"
                    variant="ghost"
                    onPress={() =>
                      setResources((prev) =>
                        (prev ?? []).filter((item) => item.id !== resource.id)
                      )
                    }
                  >
                    <Delete />
                  </IconButton>
                </Item.Actions>
              </Item.Root>
            </Fragment>
          ))}
        </ItemGroup.Root>
      );
    };

    render(
      <NimbusProvider>
        <FileGroup />
      </NimbusProvider>
    );

    // Rows appear only after the async fetch resolves.
    expect(await screen.findByText("Design spec")).toBeInTheDocument();
    expect(screen.getByText("Brand assets")).toBeInTheDocument();

    // A per-row action updates the group's state.
    await user.click(
      screen.getByRole("button", { name: "Remove Design spec" })
    );

    expect(screen.queryByText("Design spec")).not.toBeInTheDocument();
    expect(screen.getByText("Brand assets")).toBeInTheDocument();
  });
});
