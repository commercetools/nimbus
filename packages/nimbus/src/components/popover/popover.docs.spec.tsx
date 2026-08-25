import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useState } from "react";
import {
  Popover,
  Button,
  Checkbox,
  Stack,
  Text,
  TextInput,
  NimbusProvider,
} from "@commercetools/nimbus";

/**
 * Copy-ready examples for testing a Popover integration in your own app.
 *
 * The component's own behavior — opening, dismissal, keyboard activation, focus
 * and ARIA state — is already covered by Nimbus's story tests, so these
 * examples focus on the wiring you own: forms, async data, downstream state and
 * guarded dismissal.
 */

/**
 * @docs-section form-submission
 * @docs-title Form Submission Tests
 * @docs-description Validate a form inside a popover and dismiss it only once the input is valid
 * @docs-order 1
 */
describe("Popover - Form submission", () => {
  const RenamePopover = ({ onSave }: { onSave: (name: string) => void }) => {
    const [draft, setDraft] = useState("");
    const [error, setError] = useState<string | null>(null);

    return (
      <NimbusProvider>
        <Popover.Root>
          <Popover.Trigger>Rename</Popover.Trigger>
          <Popover.Content aria-label="Rename">
            {({ close }) => (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!draft.trim()) {
                    setError("Name is required");
                    return;
                  }
                  onSave(draft);
                  close();
                }}
              >
                <Stack gap="200">
                  <TextInput
                    aria-label="Name"
                    value={draft}
                    onChange={(value) => setDraft(value)}
                  />
                  {error && <Text>{error}</Text>}
                  <Button type="submit">Save</Button>
                </Stack>
              </form>
            )}
          </Popover.Content>
        </Popover.Root>
      </NimbusProvider>
    );
  };

  it("reports the error and stays open when the input is invalid", async () => {
    const user = userEvent.setup();
    const handleSave = vi.fn();

    render(<RenamePopover onSave={handleSave} />);

    await user.click(screen.getByRole("button", { name: "Rename" }));
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });
    expect(handleSave).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("saves and dismisses the popover when the input is valid", async () => {
    const user = userEvent.setup();
    const handleSave = vi.fn();

    render(<RenamePopover onSave={handleSave} />);

    await user.click(screen.getByRole("button", { name: "Rename" }));
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    await user.type(screen.getByRole("textbox", { name: "Name" }), "Ada");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(handleSave).toHaveBeenCalledWith("Ada");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});

/**
 * @docs-section async-data
 * @docs-title Async Data Loading Tests
 * @docs-description Fetch the popover's contents when it opens, showing a loading state until the request resolves
 * @docs-order 2
 */
describe("Popover - Async data loading", () => {
  const DetailsPopover = ({ load }: { load: () => Promise<string> }) => {
    const [detail, setDetail] = useState<string | null>(null);

    return (
      <NimbusProvider>
        <Popover.Root
          onOpenChange={(isOpen) => {
            if (!isOpen || detail) return;
            void load().then(setDetail);
          }}
        >
          <Popover.Trigger>Details</Popover.Trigger>
          <Popover.Content aria-label="Details">
            <Text>{detail ?? "Loading…"}</Text>
          </Popover.Content>
        </Popover.Root>
      </NimbusProvider>
    );
  };

  it("shows a loading state until the request resolves", async () => {
    const user = userEvent.setup();
    let resolveLoad!: (value: string) => void;
    const load = vi.fn(
      () =>
        new Promise<string>((resolve) => {
          resolveLoad = resolve;
        })
    );

    render(<DetailsPopover load={load} />);

    await user.click(screen.getByRole("button", { name: "Details" }));
    await waitFor(() => {
      expect(screen.getByText("Loading…")).toBeInTheDocument();
    });

    resolveLoad("Created 3 days ago");

    await waitFor(() => {
      expect(screen.getByText("Created 3 days ago")).toBeInTheDocument();
    });
    expect(load).toHaveBeenCalledTimes(1);
  });

  it("does not refetch when the popover is reopened", async () => {
    const user = userEvent.setup();
    const load = vi.fn(() => Promise.resolve("Created 3 days ago"));

    render(<DetailsPopover load={load} />);

    const trigger = screen.getByRole("button", { name: "Details" });
    await user.click(trigger);
    await waitFor(() => {
      expect(screen.getByText("Created 3 days ago")).toBeInTheDocument();
    });

    await user.click(trigger);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText("Created 3 days ago")).toBeInTheDocument();
    });
    expect(load).toHaveBeenCalledTimes(1);
  });
});

/**
 * @docs-section filter-workflow
 * @docs-title Multi-Component Workflow Tests
 * @docs-description Apply filters chosen in a popover to a list rendered outside it
 * @docs-order 3
 */
describe("Popover - Filter workflow", () => {
  const ITEMS = [
    { id: "1", name: "Active item", isActive: true },
    { id: "2", name: "Archived item", isActive: false },
  ];

  const FilterableList = () => {
    const [onlyActive, setOnlyActive] = useState(false);
    const [draft, setDraft] = useState(false);
    const visible = onlyActive ? ITEMS.filter((item) => item.isActive) : ITEMS;

    return (
      <NimbusProvider>
        <Stack gap="200">
          <Popover.Root
            onOpenChange={(isOpen) => {
              // Seed the draft from the applied value each time it opens, so
              // an abandoned popover does not leak changes into the list.
              if (isOpen) setDraft(onlyActive);
            }}
          >
            <Popover.Trigger>Filters</Popover.Trigger>
            <Popover.Content aria-label="Filters">
              {({ close }) => (
                <Stack gap="200">
                  <Checkbox isSelected={draft} onChange={setDraft}>
                    Only active
                  </Checkbox>
                  <Button
                    onPress={() => {
                      setOnlyActive(draft);
                      close();
                    }}
                  >
                    Apply filters
                  </Button>
                </Stack>
              )}
            </Popover.Content>
          </Popover.Root>
          <ul>
            {visible.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </Stack>
      </NimbusProvider>
    );
  };

  it("filters the list once the popover applies its selection", async () => {
    const user = userEvent.setup();

    render(<FilterableList />);

    expect(screen.getByText("Active item")).toBeInTheDocument();
    expect(screen.getByText("Archived item")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Filters" }));
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("checkbox", { name: "Only active" }));
    await user.click(screen.getByRole("button", { name: "Apply filters" }));

    await waitFor(() => {
      expect(screen.queryByText("Archived item")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Active item")).toBeInTheDocument();
  });

  it("leaves the list untouched when the popover is abandoned", async () => {
    const user = userEvent.setup();

    render(<FilterableList />);

    await user.click(screen.getByRole("button", { name: "Filters" }));
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("checkbox", { name: "Only active" }));
    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Archived item")).toBeInTheDocument();
  });
});

/**
 * @docs-section guarded-dismissal
 * @docs-title Controlled Dismissal Tests
 * @docs-description Own the open state so the popover cannot be dismissed while there are unsaved edits
 * @docs-order 4
 */
describe("Popover - Guarded dismissal", () => {
  const GuardedPopover = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    return (
      <NimbusProvider>
        <Popover.Root
          isOpen={isOpen}
          onOpenChange={(next) => {
            // In controlled mode the popover reports the request rather than
            // acting on it, so unsaved edits can veto the dismissal.
            if (!next && isDirty) return;
            setIsOpen(next);
          }}
        >
          <Popover.Trigger>Edit</Popover.Trigger>
          <Popover.Content aria-label="Edit">
            <Stack gap="200">
              <Button onPress={() => setIsDirty(true)}>Make an edit</Button>
              <Button
                onPress={() => {
                  setIsDirty(false);
                  setIsOpen(false);
                }}
              >
                Discard
              </Button>
            </Stack>
          </Popover.Content>
        </Popover.Root>
      </NimbusProvider>
    );
  };

  it("dismisses normally while there are no unsaved edits", async () => {
    const user = userEvent.setup();

    render(<GuardedPopover />);

    await user.click(screen.getByRole("button", { name: "Edit" }));
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("refuses to dismiss while there are unsaved edits", async () => {
    const user = userEvent.setup();

    render(<GuardedPopover />);

    await user.click(screen.getByRole("button", { name: "Edit" }));
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Make an edit" }));
    await user.keyboard("{Escape}");

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Discard" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
