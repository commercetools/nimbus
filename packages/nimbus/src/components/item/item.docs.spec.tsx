import { describe, it, expect } from "vitest";
import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Item, IconButton, NimbusProvider } from "@commercetools/nimbus";
import { Person, Settings } from "@commercetools/nimbus-icons";

/**
 * @docs-section state-management
 * @docs-title State Management
 * @docs-description Drive a list of Item rows from application state and toggle a row's state from its own action, without navigating the row
 * @docs-order 1
 */
describe("Item - State management", () => {
  it("toggles a row's pinned state from its action while leaving the link intact", async () => {
    const user = userEvent.setup();

    type Row = { id: string; title: string; pinned: boolean };

    const PinnableList = () => {
      const [rows, setRows] = useState<Row[]>([
        { id: "profile", title: "Profile", pinned: false },
        { id: "billing", title: "Billing", pinned: true },
      ]);

      const togglePinned = (id: string) =>
        setRows((prev) =>
          prev.map((row) =>
            row.id === id ? { ...row, pinned: !row.pinned } : row
          )
        );

      return (
        <div>
          {rows.map((row) => (
            <Item.Root key={row.id} href={`#${row.id}`} variant="outline">
              <Item.Media variant="icon">
                <Person />
              </Item.Media>
              <Item.Content>
                <Item.Title>{row.title}</Item.Title>
                <Item.Description>
                  {row.pinned ? "Pinned" : "Not pinned"}
                </Item.Description>
              </Item.Content>
              <Item.Actions>
                <IconButton
                  aria-label={`${row.pinned ? "Unpin" : "Pin"} ${row.title}`}
                  size="xs"
                  variant="ghost"
                  onPress={() => togglePinned(row.id)}
                >
                  <Settings />
                </IconButton>
              </Item.Actions>
            </Item.Root>
          ))}
        </div>
      );
    };

    render(
      <NimbusProvider>
        <PinnableList />
      </NimbusProvider>
    );

    // Each row is a link, and each row's action is a separate control.
    expect(screen.getAllByRole("link")).toHaveLength(2);

    // Activating a row action updates state without navigating the row.
    await user.click(screen.getByRole("button", { name: "Pin Profile" }));
    expect(
      screen.getByRole("button", { name: "Unpin Profile" })
    ).toBeInTheDocument();
    // The row link is still present — the action did not navigate away.
    expect(screen.getByRole("link", { name: /Profile/ })).toBeInTheDocument();
  });
});
