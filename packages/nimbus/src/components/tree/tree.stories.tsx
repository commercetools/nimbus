import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tree, Stack, Text, IconButton } from "@commercetools/nimbus";
import { Collection } from "react-aria-components";
import { useTreeData } from "react-stately";
import { useDragAndDrop } from "react-aria-components";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { DragIndicator } from "@commercetools/nimbus-icons";
import { fileTree, type TreeNode } from "./utils/tree.test-data";

const meta: Meta<typeof Tree.Root> = {
  title: "Components/Tree",
  component: Tree.Root,
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Recursive render function for a dynamic collection of `TreeNode`s. */
const renderNode = (node: TreeNode) => (
  <Tree.Item key={node.id} id={node.id} textValue={node.title}>
    <Tree.ItemContent>
      <Tree.Indicator />
      {node.title}
    </Tree.ItemContent>
    {node.children && node.children.length > 0 && (
      <Collection items={node.children}>{renderNode}</Collection>
    )}
  </Tree.Item>
);

/** Small delay so React Aria's drag-and-drop state machine can settle. */
const wait = (ms = 50) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Static composition: nested `Tree.Item` elements written out by hand.
 *
 * An `onAction` handler makes every row (including leaves) actionable, so React
 * Aria enables hover and press feedback — without selection or an action,
 * React Aria intentionally renders no interactive feedback.
 */
export const Base: Story = {
  args: { onAction: fn() },
  render: (args) => (
    <Tree.Root
      aria-label="Files"
      defaultExpandedKeys={["documents", "project"]}
      onAction={args.onAction}
    >
      <Tree.Item id="documents" textValue="Documents">
        <Tree.ItemContent>
          <Tree.Indicator />
          Documents
        </Tree.ItemContent>
        <Tree.Item id="project" textValue="Project">
          <Tree.ItemContent>
            <Tree.Indicator />
            Project
          </Tree.ItemContent>
          <Tree.Item id="report" textValue="Weekly Report">
            <Tree.ItemContent>
              <Tree.Indicator />
              Weekly Report
            </Tree.ItemContent>
          </Tree.Item>
        </Tree.Item>
      </Tree.Item>
      <Tree.Item id="photos" textValue="Photos">
        <Tree.ItemContent>
          <Tree.Indicator />
          Photos
        </Tree.ItemContent>
      </Tree.Item>
    </Tree.Root>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);

    await step("Exposes the treegrid role and rows", async () => {
      const treegrid = canvas.getByRole("treegrid", { name: "Files" });
      await expect(treegrid).toBeInTheDocument();
      const rows = within(treegrid).getAllByRole("row");
      // documents, project, weekly report, photos
      await expect(rows.length).toBe(4);
    });

    await step("Leaf rows give hover and action feedback", async () => {
      const report = canvas.getByRole("row", { name: /Weekly Report/ });
      // Hovering an actionable row marks it hovered (drives the hover style).
      await userEvent.hover(report);
      await waitFor(() =>
        expect(report).toHaveAttribute("data-hovered", "true")
      );
      // Activating a leaf row fires onAction.
      await userEvent.click(report);
      await waitFor(() => expect(args.onAction).toHaveBeenCalledWith("report"));
    });

    await step("Rows expose aria-level reflecting depth", async () => {
      const documents = canvas.getByRole("row", { name: /Documents/ });
      const project = canvas.getByRole("row", { name: /Project/ });
      const report = canvas.getByRole("row", { name: /Weekly Report/ });
      await expect(documents).toHaveAttribute("aria-level", "1");
      await expect(project).toHaveAttribute("aria-level", "2");
      await expect(report).toHaveAttribute("aria-level", "3");
    });

    await step("Expandable rows expose aria-expanded", async () => {
      const documents = canvas.getByRole("row", { name: /Documents/ });
      await expect(documents).toHaveAttribute("aria-expanded", "true");
    });
  },
};

/**
 * Dynamic composition: an `items` array rendered with a recursive function and
 * React Aria's `Collection`.
 */
export const Dynamic: Story = {
  render: () => (
    <Tree.Root
      aria-label="Files"
      items={fileTree}
      defaultExpandedKeys={["documents"]}
    >
      {renderNode}
    </Tree.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders the hierarchy from data", async () => {
      await expect(
        canvas.getByRole("row", { name: /Documents/ })
      ).toBeVisible();
      await expect(canvas.getByRole("row", { name: /Project/ })).toBeVisible();
      // Photos is collapsed children should not be present
      await expect(
        canvas.queryByRole("row", { name: /Image 1/ })
      ).not.toBeInTheDocument();
    });
  },
};

/**
 * Expanding and collapsing items via the chevron and the keyboard.
 */
export const ExpandCollapse: Story = {
  render: () => (
    <Tree.Root aria-label="Files" items={fileTree}>
      {renderNode}
    </Tree.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const documents = canvas.getByRole("row", { name: /Documents/ });

    await step("Starts collapsed", async () => {
      await expect(documents).toHaveAttribute("aria-expanded", "false");
      await expect(
        canvas.queryByRole("row", { name: /Project/ })
      ).not.toBeInTheDocument();
    });

    await step("Expands via the chevron indicator", async () => {
      const chevron = within(documents).getByRole("button");
      await userEvent.click(chevron);
      await waitFor(() =>
        expect(documents).toHaveAttribute("aria-expanded", "true")
      );
      await expect(canvas.getByRole("row", { name: /Project/ })).toBeVisible();
    });

    await step("Collapses with the Left arrow key", async () => {
      await userEvent.click(documents);
      await userEvent.keyboard("{ArrowLeft}");
      await waitFor(() =>
        expect(documents).toHaveAttribute("aria-expanded", "false")
      );
    });

    await step("Expands with the Right arrow key", async () => {
      await userEvent.keyboard("{ArrowRight}");
      await waitFor(() =>
        expect(documents).toHaveAttribute("aria-expanded", "true")
      );
    });
  },
};

/**
 * Arrow-key navigation, Home/End and type-ahead.
 */
export const KeyboardNavigation: Story = {
  render: () => (
    <Tree.Root
      aria-label="Files"
      items={fileTree}
      defaultExpandedKeys={["documents", "project", "photos"]}
    >
      {renderNode}
    </Tree.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Down arrow moves focus through visible rows", async () => {
      await userEvent.tab();
      const documents = canvas.getByRole("row", { name: /Documents/ });
      await waitFor(() => expect(documents).toHaveFocus());
      await userEvent.keyboard("{ArrowDown}");
      await waitFor(() =>
        expect(canvas.getByRole("row", { name: /Project/ })).toHaveFocus()
      );
    });

    await step("End moves focus to the last visible row", async () => {
      await userEvent.keyboard("{End}");
      await waitFor(() =>
        expect(canvas.getByRole("row", { name: /Image 2/ })).toHaveFocus()
      );
    });

    await step("Home moves focus to the first row", async () => {
      await userEvent.keyboard("{Home}");
      await waitFor(() =>
        expect(canvas.getByRole("row", { name: /Documents/ })).toHaveFocus()
      );
    });

    await step("Type-ahead jumps to a matching row", async () => {
      await userEvent.keyboard("Photos");
      await waitFor(() =>
        expect(canvas.getByRole("row", { name: /^Photos/ })).toHaveFocus()
      );
    });
  },
};

/**
 * Single selection — selecting a row applies the selected state.
 */
export const SingleSelection: Story = {
  render: () => (
    <Tree.Root
      aria-label="Files"
      selectionMode="single"
      items={fileTree}
      defaultExpandedKeys={["documents"]}
    >
      {renderNode}
    </Tree.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Selecting a row sets aria-selected", async () => {
      const project = canvas.getByRole("row", { name: /Project/ });
      await userEvent.click(project);
      await waitFor(() =>
        expect(project).toHaveAttribute("aria-selected", "true")
      );
    });
  },
};

/**
 * Multiple selection — `Tree.ItemContent` renders a selection checkbox per row.
 */
export const MultipleSelection: Story = {
  render: () => (
    <Tree.Root
      aria-label="Files"
      selectionMode="multiple"
      items={fileTree}
      defaultExpandedKeys={["documents", "photos"]}
    >
      {renderNode}
    </Tree.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders a selection checkbox per row", async () => {
      const checkboxes = canvas.getAllByRole("checkbox");
      await expect(checkboxes.length).toBeGreaterThan(0);
    });

    await step("Toggling checkboxes selects multiple rows", async () => {
      const documents = canvas.getByRole("row", { name: /Documents/ });
      const photos = canvas.getByRole("row", { name: /Photos/ });
      await userEvent.click(within(documents).getByRole("checkbox"));
      await userEvent.click(within(photos).getByRole("checkbox"));
      await waitFor(async () => {
        await expect(documents).toHaveAttribute("aria-selected", "true");
        await expect(photos).toHaveAttribute("aria-selected", "true");
      });
    });
  },
};

/**
 * Disabled items cannot be selected or actioned.
 */
export const DisabledItems: Story = {
  render: () => (
    <Tree.Root
      aria-label="Files"
      selectionMode="single"
      disabledKeys={["project"]}
      items={fileTree}
      defaultExpandedKeys={["documents"]}
    >
      {renderNode}
    </Tree.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Disabled row is marked disabled and not selectable",
      async () => {
        const project = canvas.getByRole("row", { name: /Project/ });
        await expect(project).toHaveAttribute("aria-disabled", "true");
        await userEvent.click(project);
        await expect(project).not.toHaveAttribute("aria-selected", "true");
      }
    );
  },
};

/**
 * A tree wired with the full feature set — multiple selection (checkboxes),
 * expand/collapse indicators, and opt-in drag-and-drop with `<Button slot="drag">`
 * handles. `useTreeData` owns the hierarchical state; `useDragAndDrop` provides
 * the hooks.
 */
const FeatureTree = ({
  size,
  selectionMode = "none",
  "aria-label": ariaLabel,
}: {
  size?: "sm" | "md";
  selectionMode?: "none" | "single" | "multiple";
  "aria-label": string;
}) => {
  const tree = useTreeData<TreeNode>({
    initialItems: fileTree,
    getKey: (item) => item.id,
    getChildren: (item) => item.children ?? [],
  });

  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) =>
      [...keys].map((key) => ({
        "text/plain": tree.getItem(key)?.value.title ?? "",
      })),
    onMove(e) {
      if (e.target.dropPosition === "before") {
        tree.moveBefore(e.target.key, e.keys);
      } else if (e.target.dropPosition === "after") {
        tree.moveAfter(e.target.key, e.keys);
      } else if (e.target.dropPosition === "on") {
        // Re-parent: move the dragged items into the target group.
        const targetNode = tree.getItem(e.target.key);
        const targetIndex = targetNode?.children
          ? targetNode.children.length
          : 0;
        [...e.keys].forEach((key, i) => {
          tree.move(key, e.target.key, targetIndex + i);
        });
      }
    },
  });

  const renderDndNode = (item: (typeof tree.items)[number]) => (
    <Tree.Item id={String(item.key)} textValue={item.value.title}>
      <Tree.ItemContent>
        <IconButton
          slot="drag"
          size="2xs"
          variant="ghost"
          data-testid={`drag-${item.key}`}
          aria-label={`Reorder ${item.value.title}`}
        >
          <DragIndicator />
        </IconButton>
        <Tree.Indicator />
        {item.value.title}
      </Tree.ItemContent>
      {item.children && item.children.length > 0 && (
        <Collection items={item.children}>{renderDndNode}</Collection>
      )}
    </Tree.Item>
  );

  return (
    <Tree.Root
      aria-label={ariaLabel}
      size={size}
      selectionMode={selectionMode}
      items={tree.items}
      dragAndDropHooks={dragAndDropHooks}
      defaultExpandedKeys={["documents", "project", "photos"]}
    >
      {renderDndNode}
    </Tree.Root>
  );
};

/**
 * Size variants — each rendered with the full feature set (selection
 * checkboxes, chevrons, drag handles) so every element scales with `size`.
 */
export const Sizes: Story = {
  render: () => (
    <Stack direction="row" gap="800" alignItems="flex-start">
      {(["sm", "md"] as const).map((size) => (
        <Stack key={size} gap="200">
          <Text fontWeight="700">{size}</Text>
          <FeatureTree
            size={size}
            selectionMode="multiple"
            aria-label={`Files ${size}`}
          />
        </Stack>
      ))}
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Both sizes render with the full feature set", async () => {
      for (const size of ["sm", "md"]) {
        const treegrid = canvas.getByRole("treegrid", {
          name: `Files ${size}`,
        });
        await expect(treegrid).toBeInTheDocument();
        await expect(treegrid).toHaveAttribute("data-allows-dragging", "true");
        // Selection checkboxes and drag handles are present at every size.
        await expect(
          within(treegrid).getAllByRole("checkbox").length
        ).toBeGreaterThan(0);
        await expect(
          within(treegrid).getAllByRole("button", { name: /Reorder/ }).length
        ).toBeGreaterThan(0);
      }
    });
  },
};

/**
 * Opt-in drag-and-drop with selection checkboxes and keyboard-operable drag
 * handles. Reorder between items, or drop **on** a group to re-parent. To move
 * an item out to a shallower level (e.g. back to the root), drag toward the
 * left edge or use the keyboard (Enter to pick up, arrows to choose a target).
 */
export const DragAndDrop: Story = {
  render: () => <FeatureTree aria-label="Files" selectionMode="multiple" />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Wires drag-and-drop: tree and rows are draggable, with keyboard handles",
      async () => {
        // `dragAndDropHooks` is forwarded to the underlying tree.
        const treegrid = canvas.getByRole("treegrid", { name: "Files" });
        await expect(treegrid).toHaveAttribute("data-allows-dragging", "true");

        // Each top-level row advertises that it allows dragging.
        const documents = canvas.getByRole("row", { name: /Documents/ });
        const photos = canvas.getByRole("row", { name: /Photos/ });
        await expect(documents).toHaveAttribute("data-allows-dragging", "true");
        await expect(photos).toHaveAttribute("data-allows-dragging", "true");

        // A `<Button slot="drag">` handle is present per item so the reorder is
        // operable by keyboard and screen reader (not pointer-only). The drop /
        // reorder mechanics themselves are provided and tested by React Aria.
        await expect(canvas.getByTestId("drag-documents")).toBeInTheDocument();
        await expect(canvas.getByTestId("drag-photos")).toBeInTheDocument();
      }
    );

    await step("Keyboard drag can be picked up from the handle", async () => {
      // Focus the drag handle and confirm focus — React Aria's keyboard drag
      // dispatches from document.activeElement.
      const dragHandle = canvas.getByTestId("drag-documents");
      dragHandle.focus();
      await waitFor(() => expect(dragHandle).toHaveFocus());

      // Initiating and cancelling a keyboard drag must not throw or lose the row.
      await userEvent.keyboard("{Enter}");
      await wait(150);
      await userEvent.keyboard("{Escape}");
      await wait(150);

      await expect(
        canvas.getByRole("row", { name: /Documents/ })
      ).toBeInTheDocument();
    });
  },
};

/**
 * Reorder-only tree — drag-and-drop without item selection.
 *
 * **Use case:** a structural editor whose sole interaction is arranging
 * hierarchy, e.g. a **navigation-menu builder** or a **content/page outline**.
 * The user drags items to reorder and re-nest them; there is nothing to
 * "select", so selection (and its checkboxes) would be noise. `selectionMode`
 * is left at its default `"none"`, so no checkboxes render — just a drag handle
 * and the expand/collapse chevron per item.
 */
export const ReorderWithoutSelection: Story = {
  render: () => <FeatureTree aria-label="Navigation" selectionMode="none" />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Drag-and-drop is enabled without any selection UI",
      async () => {
        const treegrid = canvas.getByRole("treegrid", { name: "Navigation" });
        await expect(treegrid).toHaveAttribute("data-allows-dragging", "true");
        // No selection mode → no checkboxes anywhere in the tree.
        await expect(canvas.queryByRole("checkbox")).not.toBeInTheDocument();
        // Drag handles are still present for reordering.
        await expect(canvas.getByTestId("drag-documents")).toBeInTheDocument();
      }
    );

    await step("Rows are not selectable", async () => {
      const documents = canvas.getByRole("row", { name: /Documents/ });
      await expect(documents).not.toHaveAttribute("aria-selected");
      await userEvent.click(documents);
      await expect(documents).not.toHaveAttribute("aria-selected", "true");
    });
  },
};
