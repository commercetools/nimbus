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
 * @docs-section async-data
 * @docs-title Async Data & State Management
 * @docs-description Populate a group from data fetched after mount, interleave separators between rows, and update the group from a row action
 * @docs-order 1
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
