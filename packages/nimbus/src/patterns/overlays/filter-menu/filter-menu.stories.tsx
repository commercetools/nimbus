import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, waitFor, fn } from "storybook/test";
import {
  Button,
  Checkbox,
  Separator,
  Text,
  TextInput,
} from "@commercetools/nimbus";
import { FilterList } from "@commercetools/nimbus-icons";
import { FilterMenu } from "./filter-menu";

const meta: Meta<typeof FilterMenu.Root> = {
  title: "Patterns/Overlays/FilterMenu",
  component: FilterMenu.Root,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FilterMenu.Root>;

export const Default: Story = {
  args: {
    onOpenChange: fn(),
  },

  render: (args) => {
    const [status, setStatus] = useState<string | null>(null);
    const [missing, setMissing] = useState(false);

    return (
      <FilterMenu.Root onOpenChange={args.onOpenChange}>
        <FilterMenu.Trigger asChild>
          <Button variant="ghost" size="xs">
            <FilterList /> Filters
          </Button>
        </FilterMenu.Trigger>
        <FilterMenu.Content width="320px">
          <FilterMenu.Section label="Status">
            <FilterMenu.Option
              isSelected={status === "Published"}
              onSelect={() =>
                setStatus((s) => (s === "Published" ? null : "Published"))
              }
            >
              Published
            </FilterMenu.Option>
            <FilterMenu.Option
              isSelected={status === "Modified"}
              onSelect={() =>
                setStatus((s) => (s === "Modified" ? null : "Modified"))
              }
            >
              Modified
            </FilterMenu.Option>
          </FilterMenu.Section>
          <FilterMenu.Section label="Missing fields">
            <Checkbox isSelected={missing} onChange={setMissing}>
              Description
            </Checkbox>
          </FilterMenu.Section>
          <Separator />
          <FilterMenu.ClearAction
            onPress={() => {
              setStatus(null);
              setMissing(false);
            }}
          >
            Clear all filters
          </FilterMenu.ClearAction>
        </FilterMenu.Content>
      </FilterMenu.Root>
    );
  },

  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Trigger renders", async () => {
      const trigger = canvas.getByRole("button", { name: /Filters/i });
      expect(trigger).toBeInTheDocument();
    });

    await step("Opens on trigger click", async () => {
      const trigger = canvas.getByRole("button", { name: /Filters/i });
      await userEvent.click(trigger);

      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });
    });

    await step("Sections render with labels", async () => {
      expect(canvas.getByText("Status")).toBeInTheDocument();
      expect(canvas.getByText("Missing fields")).toBeInTheDocument();
    });

    await step("Options render and show selected state", async () => {
      const publishedOption = canvas.getByRole("button", {
        name: "Published",
      });
      expect(publishedOption).toBeInTheDocument();

      await userEvent.click(publishedOption);

      await waitFor(() => {
        expect(publishedOption).toHaveAttribute("data-selected", "true");
      });

      // Popover stays open after selecting
      expect(canvas.getByRole("dialog")).toBeInTheDocument();
    });

    await step("Checkbox inside section is focusable", async () => {
      const checkbox = canvas.getByRole("checkbox", { name: "Description" });
      expect(checkbox).toBeInTheDocument();

      await userEvent.click(checkbox);
      expect(checkbox).toBeChecked();

      // Popover stays open
      expect(canvas.getByRole("dialog")).toBeInTheDocument();
    });

    await step("ClearAction renders and fires callback", async () => {
      const clearButton = canvas.getByRole("button", {
        name: "Clear all filters",
      });
      expect(clearButton).toBeInTheDocument();

      await userEvent.click(clearButton);

      // After clearing, status option should be deselected
      await waitFor(() => {
        const publishedOption = canvas.getByRole("button", {
          name: "Published",
        });
        expect(publishedOption).not.toHaveAttribute("data-selected", "true");
      });

      // Popover stays open after clear
      expect(canvas.getByRole("dialog")).toBeInTheDocument();
    });

    await step("Escape closes popover", async () => {
      await userEvent.keyboard("{Escape}");

      await waitFor(() => {
        expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });
  },
};

export const CollapsibleSections: Story = {
  render: () => {
    return (
      <FilterMenu.Root defaultOpen>
        <FilterMenu.Trigger asChild>
          <Button variant="ghost" size="xs">
            Filters
          </Button>
        </FilterMenu.Trigger>
        <FilterMenu.Content width="280px">
          <FilterMenu.Section label="Category" defaultExpanded={false}>
            <Text>Category content</Text>
          </FilterMenu.Section>
          <FilterMenu.Section label="Status" defaultExpanded>
            <FilterMenu.Option isSelected={false} onSelect={() => {}}>
              Active
            </FilterMenu.Option>
          </FilterMenu.Section>
        </FilterMenu.Content>
      </FilterMenu.Root>
    );
  },

  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Wait for popover to open", async () => {
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });
    });

    await step(
      "Collapsed section hides content, expanded shows it",
      async () => {
        // "Category" section is collapsed by default — hidden by Presence
        expect(canvas.queryByText("Category content")).not.toBeVisible();

        // "Status" section is expanded by default
        expect(
          canvas.getByRole("button", { name: "Active" })
        ).toBeInTheDocument();
      }
    );

    await step("Clicking collapsed section header expands it", async () => {
      const categoryTrigger = canvas.getByRole("button", { name: "Category" });
      await userEvent.click(categoryTrigger);

      await waitFor(() => {
        expect(canvas.getByText("Category content")).toBeVisible();
      });
    });

    await step("Clicking expanded section header collapses it", async () => {
      const statusTrigger = canvas.getByRole("button", { name: "Status" });
      await userEvent.click(statusTrigger);

      await waitFor(() => {
        expect(statusTrigger).toHaveAttribute("aria-expanded", "false");
      });
    });
  },
};

export const HorizontalSectionLayout: Story = {
  render: () => {
    return (
      <FilterMenu.Root defaultOpen>
        <FilterMenu.Trigger asChild>
          <Button variant="ghost" size="xs">
            Filters
          </Button>
        </FilterMenu.Trigger>
        <FilterMenu.Content width="360px">
          <FilterMenu.Section label="Price range" direction="row">
            <TextInput aria-label="Min price" placeholder="Min" />
            <TextInput aria-label="Max price" placeholder="Max" />
          </FilterMenu.Section>
          <FilterMenu.Section label="Status">
            <FilterMenu.Option isSelected={false} onSelect={() => {}}>
              Active
            </FilterMenu.Option>
            <FilterMenu.Option isSelected={false} onSelect={() => {}}>
              Archived
            </FilterMenu.Option>
          </FilterMenu.Section>
        </FilterMenu.Content>
      </FilterMenu.Root>
    );
  },

  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Wait for popover to open", async () => {
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });
    });

    await step("Horizontal section has row flex-direction", async () => {
      const minInput = canvas.getByRole("textbox", { name: "Min price" });
      const container = minInput.parentElement as HTMLElement;

      const computedStyle = window.getComputedStyle(container);
      expect(computedStyle.flexDirection).toBe("row");
    });

    await step("Vertical section (default) renders items stacked", async () => {
      const active = canvas.getByRole("button", { name: "Active" });
      const archived = canvas.getByRole("button", { name: "Archived" });

      const activeRect = active.getBoundingClientRect();
      const archivedRect = archived.getBoundingClientRect();

      // Items should be stacked (different Y, same X)
      expect(archivedRect.top).toBeGreaterThan(activeRect.top);
      expect(Math.abs(activeRect.left - archivedRect.left)).toBeLessThan(5);
    });
  },
};
