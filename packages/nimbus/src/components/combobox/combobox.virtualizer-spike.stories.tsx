import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box } from "@commercetools/nimbus";
import { userEvent, within, expect, waitFor, screen } from "storybook/test";
// Both from source: the built package bundles its own React Aria copy, so a
// bundled ComboBox would not see the source Virtualizer's context.
import { ComboBox } from "./combobox";
import { Virtualizer } from "../virtualizer/virtualizer";

/**
 * SPIKE for FEC-1147 — not a supported pattern, not shipped.
 *
 * Wraps the current `ComboBox.ListBox` in the internal `Virtualizer` to answer,
 * before ComboBox gets its own `isVirtualized` prop (Virtualizer design
 * Decision 13):
 * 1. Which element scrolls inside the popover?
 * 2. Who bounds its height?
 * 3. Does virtualization keep filtering and keyboard navigation working?
 *
 * Excluded from the published Storybook (`!dev`, `!autodocs`) and from
 * Chromatic. The answers are recorded in the play function steps and in the
 * Virtualizer design document.
 */
const meta: Meta<typeof ComboBox.Root> = {
  title: "Components/ComboBox/Virtualizer spike (FEC-1147)",
  component: ComboBox.Root,
  tags: ["!dev", "!autodocs"],
  parameters: { chromatic: { disableSnapshot: true } },
};

export default meta;

type Story = StoryObj<typeof ComboBox.Root>;

type Project = { id: string; name: string };

/** 500 projects: the Merchant Center AI usage page loads up to this many. */
const projects: Project[] = Array.from({ length: 500 }, (_, i) => ({
  id: `project-${i + 1}`,
  name: `Project ${String(i + 1).padStart(3, "0")}`,
}));

const activeOptionText = () => {
  const id = document.activeElement?.getAttribute("aria-activedescendant");
  return id ? (document.getElementById(id)?.textContent ?? "") : "";
};

export const VirtualizedComboBoxSpike: Story = {
  render: () => (
    <Box minHeight="26rem">
      <ComboBox.Root<Project>
        aria-label="Project"
        items={projects}
        getKey={(project) => project.id}
        getTextValue={(project) => project.name}
      >
        <ComboBox.Trigger />
        <ComboBox.Popover>
          <Virtualizer layoutOptions={{ estimatedRowHeight: 38, gap: "100" }}>
            <ComboBox.ListBox>
              {(project: Project) => (
                <ComboBox.Option>{project.name}</ComboBox.Option>
              )}
            </ComboBox.ListBox>
          </Virtualizer>
        </ComboBox.Popover>
      </ComboBox.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = await canvas.findByRole("combobox");

    await step("Open the list", async () => {
      await userEvent.click(input);
      await userEvent.keyboard("{ArrowDown}");
      await screen.findAllByRole("option", undefined, { timeout: 15000 });
    });

    const listbox = screen.getByRole("listbox");

    await step("Answer 1: the listbox is the scroll container", async () => {
      expect(getComputedStyle(listbox).overflowY).toBe("auto");
      expect(listbox.scrollHeight).toBeGreaterThan(listbox.clientHeight);
    });

    await step("Answer 2: the ComboBox recipe bounds the height", async () => {
      // `listBox` slot: `maxH: "40svh"` in combobox.recipe.ts
      expect(getComputedStyle(listbox).maxHeight).not.toBe("none");
    });

    await step("Only visible options are rendered", async () => {
      expect(screen.getAllByRole("option").length).toBeLessThan(60);
    });

    await step("Answer 3a: filtering still works", async () => {
      await userEvent.type(input, "Project 42");
      await waitFor(() =>
        expect(
          screen.getAllByRole("option").map((option) => option.textContent)
        ).toEqual([
          "Project 420",
          "Project 421",
          "Project 422",
          "Project 423",
          "Project 424",
          "Project 425",
          "Project 426",
          "Project 427",
          "Project 428",
          "Project 429",
        ])
      );
    });

    await step(
      "Answer 3b: keyboard reaches the last filtered option",
      async () => {
        await userEvent.keyboard("{ArrowUp}");
        await waitFor(() => expect(activeOptionText()).toBe("Project 429"));
      }
    );
  },
};
