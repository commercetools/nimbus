import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Tree, Stack, Text, useTree, type Key } from "@commercetools/nimbus";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { fileTree, type TreeNode } from "./utils/tree.test-data";

const meta: Meta<typeof Tree.Root> = {
  title: "Components/Tree",
  component: Tree.Root,
};

export default meta;

type Story = StoryObj<typeof Tree.Root>;

/**
 * React Aria builds the Tree collection asynchronously after mount. In the
 * production Storybook bundle (Chromatic) this settles noticeably slower than
 * the dev-transform test environment, so a play function that queries rows (or
 * row-derived elements like checkboxes / drag handles) synchronously at the
 * start races the build and intermittently fails. Awaiting the rows first
 * guarantees the collection is built before any synchronous query. Generous
 * timeout because the built bundle can settle past testing-library's 1s
 * `findBy` default.
 */
const waitForTreeRows = (canvas: ReturnType<typeof within>) =>
  canvas.findAllByRole("row", undefined, { timeout: 15000 });

/** Recursive render function for a dynamic collection of `TreeNode`s. */
const renderNode = (node: TreeNode) => (
  <Tree.Item key={node.id} id={node.id} textValue={node.title}>
    <Tree.ItemContent>
      <Tree.Indicator />
      {node.title}
    </Tree.ItemContent>
    <Tree.SubTree items={node.children}>{renderNode}</Tree.SubTree>
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
    await waitForTreeRows(canvas);

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
    await waitForTreeRows(canvas);

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
    await waitForTreeRows(canvas);
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

    await step("Up arrow moves focus back through visible rows", async () => {
      await userEvent.keyboard("{End}");
      await waitFor(() =>
        expect(canvas.getByRole("row", { name: /Image 2/ })).toHaveFocus()
      );
      await userEvent.keyboard("{ArrowUp}");
      await waitFor(() =>
        expect(canvas.getByRole("row", { name: /Image 1/ })).toHaveFocus()
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
    await waitForTreeRows(canvas);

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
    await waitForTreeRows(canvas);

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
 * Controlled expansion — the parent owns `expandedKeys` and is notified of
 * changes via `onExpandedChange`. Use this to sync expansion with external
 * state, the URL, or analytics.
 */
export const Controlled: Story = {
  render: () => {
    const ControlledTree = () => {
      const [expandedKeys, setExpandedKeys] = useState<Set<Key>>(
        new Set(["documents"])
      );
      return (
        <Stack gap="200">
          <Text>Expanded: {Array.from(expandedKeys).join(", ") || "none"}</Text>
          <Tree.Root
            aria-label="Files"
            items={fileTree}
            expandedKeys={expandedKeys}
            onExpandedChange={setExpandedKeys}
          >
            {renderNode}
          </Tree.Root>
        </Stack>
      );
    };
    return <ControlledTree />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await waitForTreeRows(canvas);
    const documents = canvas.getByRole("row", { name: /Documents/ });

    await step("Parent state reflects the initial expansion", async () => {
      await expect(documents).toHaveAttribute("aria-expanded", "true");
      await expect(canvas.getByText(/^Expanded:/)).toHaveTextContent(
        "documents"
      );
    });

    await step("Collapsing a row updates the controlled state", async () => {
      const chevron = within(documents).getByRole("button");
      await userEvent.click(chevron);
      await waitFor(() =>
        expect(documents).toHaveAttribute("aria-expanded", "false")
      );
      await waitFor(() =>
        expect(canvas.getByText(/^Expanded:/)).toHaveTextContent("none")
      );
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
    await waitForTreeRows(canvas);

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
 * expand/collapse indicators, and opt-in drag-and-drop. A single `useTree` hook
 * owns the hierarchical state and the drag-and-drop wiring; its result is spread
 * straight onto `Tree.Root`. The drag handle is rendered automatically by
 * `Tree.ItemContent` whenever the tree allows dragging — consumers never author
 * it, so every draggable tree gets the same affordance.
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
  const tree = useTree<TreeNode>({
    initialItems: fileTree,
    getKey: (item) => item.id,
    getChildren: (item) => item.children ?? [],
    selectionMode,
    defaultExpandedKeys: ["documents", "project", "photos"],
    dragAndDrop: true,
  });

  const renderDndNode = (item: (typeof tree.items)[number]) => (
    <Tree.Item id={String(item.key)} textValue={item.value.title}>
      <Tree.ItemContent>
        <Tree.Indicator />
        {item.value.title}
      </Tree.ItemContent>
      <Tree.SubTree items={item.children ?? undefined}>
        {renderDndNode}
      </Tree.SubTree>
    </Tree.Item>
  );

  return (
    <Tree.Root aria-label={ariaLabel} size={size} {...tree}>
      {renderDndNode}
    </Tree.Root>
  );
};

/**
 * Size variants — each rendered with the full feature set (selection
 * checkboxes, chevrons, drag handles) so every element scales with `size`.
 */
export const Sizes: Story = {
  parameters: { chromatic: { disableSnapshot: false } },
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
    await waitForTreeRows(canvas);
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
          within(treegrid).getAllByRole("button", { name: /Drag/ }).length
        ).toBeGreaterThan(0);
      }
    });

    await step(
      "Leading controls share one column grid at both sizes",
      async () => {
        // The two layout defects this component was written to avoid are
        // geometric, so they are asserted geometrically. Story tests run in real
        // Chromium, so these rects are true layout, not jsdom stubs.
        for (const size of ["sm", "md"] as const) {
          const treegrid = canvas.getByRole("treegrid", {
            name: `Files ${size}`,
          });

          const measure = (row: HTMLElement) => {
            const box = (slot: string) => {
              const el = row.querySelector<HTMLElement>(`[slot='${slot}']`);
              if (!el) throw new Error(`row is missing [slot='${slot}']`);
              // The visual control box, not the visually-hidden input inside it.
              const { left, right } = el.getBoundingClientRect();
              return { left, right, width: right - left };
            };
            return {
              level: Number(row.getAttribute("aria-level")),
              drag: box("drag"),
              checkbox: box("selection"),
              chevron: box("chevron"),
            };
          };

          const rows = within(treegrid).getAllByRole("row").map(measure);
          await expect(rows.length).toBeGreaterThan(1);

          for (const row of rows) {
            // No collision: the controls are strictly disjoint and in order.
            // Any overlap shows up here as a negative gap.
            await expect(row.checkbox.left).toBeGreaterThanOrEqual(
              row.drag.right
            );
            await expect(row.chevron.left).toBeGreaterThanOrEqual(
              row.checkbox.right
            );
            // One uniform, non-shrinking column per control — a shrunken box is
            // what lets a neighbour drift into it.
            await expect(row.checkbox.width).toBeCloseTo(row.drag.width, 0);
            await expect(row.chevron.width).toBeCloseTo(row.drag.width, 0);
          }

          // Rows at the same depth start at the same x.
          const leftByLevel = new Map<number, number>();
          for (const row of rows) {
            const known = leftByLevel.get(row.level);
            if (known === undefined) leftByLevel.set(row.level, row.drag.left);
            else await expect(row.drag.left).toBeCloseTo(known, 0);
          }

          // Each level indents by exactly one control column (control + gap).
          // This is the invariant that keeps a nested row's controls on the
          // column grid instead of drifting out of alignment as depth grows.
          const columnStep = rows[0].checkbox.left - rows[0].drag.left;
          await expect(columnStep).toBeGreaterThan(0);
          const depths = [...leftByLevel.entries()].sort((a, b) => a[0] - b[0]);
          for (let i = 1; i < depths.length; i += 1) {
            const [level, left] = depths[i];
            const [prevLevel, prevLeft] = depths[i - 1];
            await expect(left - prevLeft).toBeCloseTo(
              columnStep * (level - prevLevel),
              0
            );
          }
        }
      }
    );
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
    await waitForTreeRows(canvas);

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

        // `Tree.ItemContent` auto-renders a `<Button slot="drag">` handle per
        // item (no consumer markup) so the reorder is operable by keyboard and
        // screen reader (not pointer-only). React Aria localizes its accessible
        // name as "Drag <item>". The drop / reorder mechanics themselves are
        // provided and tested by React Aria.
        await expect(
          canvas.getByRole("button", { name: /Drag Documents/ })
        ).toBeInTheDocument();
        await expect(
          canvas.getByRole("button", { name: /Drag Photos/ })
        ).toBeInTheDocument();
      }
    );

    await step("Keyboard drag can be picked up from the handle", async () => {
      // Focus the drag handle and confirm focus — React Aria's keyboard drag
      // dispatches from document.activeElement.
      const dragHandle = canvas.getByRole("button", {
        name: /Drag Documents/,
      });
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

    await step(
      "Dropping a multi-selection onto a group keeps tree order",
      async () => {
        const rowIndex = (name: RegExp) => {
          const rows = canvas.getAllByRole("row");
          return rows.findIndex((row) => name.test(row.textContent ?? ""));
        };

        // Select bottom-to-top so the dragged keys arrive in selection order,
        // not tree order — the case a click-order re-parent would reverse.
        const report = canvas.getByRole("row", { name: /Weekly Report/ });
        const budget = canvas.getByRole("row", { name: /Budget/ });
        await userEvent.click(within(budget).getByRole("checkbox"));
        await userEvent.click(within(report).getByRole("checkbox"));
        await waitFor(async () => {
          await expect(report).toHaveAttribute("aria-selected", "true");
          await expect(budget).toHaveAttribute("aria-selected", "true");
        });

        // Selected handles are relabeled "Drag 2 selected items", so grab from
        // within the row.
        const dragHandle = within(report).getByRole("button", { name: /Drag/ });
        dragHandle.focus();
        await userEvent.keyboard("{Enter}");
        await wait(150);

        // Step through drop targets until Photos is the "on" target, then drop.
        const photos = canvas.getByRole("row", { name: /^Photos/ });
        for (
          let i = 0;
          i < 12 && photos.getAttribute("data-drop-target") !== "true";
          i++
        ) {
          await userEvent.keyboard("{ArrowDown}");
          await wait();
        }
        await expect(photos).toHaveAttribute("data-drop-target", "true");
        await userEvent.keyboard("{Enter}");
        await wait(150);

        // Re-parented under Photos (after Image 2) in tree order, not reversed.
        await waitFor(async () => {
          const image2Idx = rowIndex(/Image 2/);
          const reportIdx = rowIndex(/Weekly Report/);
          const budgetIdx = rowIndex(/Budget/);
          await expect(reportIdx).toBeGreaterThan(image2Idx);
          await expect(budgetIdx).toBeGreaterThan(reportIdx);
        });
      }
    );
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
    await waitForTreeRows(canvas);

    await step(
      "Drag-and-drop is enabled without any selection UI",
      async () => {
        const treegrid = canvas.getByRole("treegrid", { name: "Navigation" });
        await expect(treegrid).toHaveAttribute("data-allows-dragging", "true");
        // No selection mode → no checkboxes anywhere in the tree.
        await expect(canvas.queryByRole("checkbox")).not.toBeInTheDocument();
        // Drag handles are still present for reordering.
        await expect(
          canvas.getByRole("button", { name: /Drag Documents/ })
        ).toBeInTheDocument();
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

const SELECTION_MODES = ["none", "single", "multiple"] as const;
const SIZES = ["sm", "md"] as const;

/**
 * Smoke test — every visual permutation in one view: both sizes (`sm`, `md`),
 * all three selection modes (`none`, `single`, `multiple`), each rendered both
 * without drag-and-drop and with it (which adds a drag handle ahead of the
 * shared leading-control column). Use it to eyeball control spacing and
 * nested-row alignment across the matrix at a glance.
 */
const SmokeTestView = () => {
  return (
    <Stack gap="600" alignItems="flex-start">
      {SIZES.map((size) => (
        <Stack key={size} gap="400">
          <Text fontWeight="700">size = {size}</Text>
          {(
            [
              ["no drag", false],
              ["drag & drop", true],
            ] as const
          ).map(([layoutLabel, withDnd]) => (
            <Stack
              key={layoutLabel}
              direction="row"
              gap="800"
              alignItems="flex-start"
            >
              {SELECTION_MODES.map((mode) => {
                const label = `${size} · ${layoutLabel} · ${mode}`;
                return (
                  <Stack key={mode} gap="200" minWidth="220px">
                    <Text fontWeight="600" fontSize="350" color="neutral.11">
                      {layoutLabel} · {mode}
                    </Text>
                    {withDnd ? (
                      <FeatureTree
                        size={size}
                        selectionMode={mode}
                        aria-label={label}
                      />
                    ) : (
                      <Tree.Root
                        aria-label={label}
                        size={size}
                        selectionMode={mode}
                        items={fileTree}
                        defaultExpandedKeys={["documents", "photos"]}
                      >
                        {renderNode}
                      </Tree.Root>
                    )}
                  </Stack>
                );
              })}
            </Stack>
          ))}
        </Stack>
      ))}
    </Stack>
  );
};

/**
 * Selected, disabled, and both at once. They share one tree per size because
 * `layerStyle: "disabled"` dims whichever background is underneath, so
 * selected-disabled is its own pixel rather than a repeat of either.
 */
export const RowStates: Story = {
  // VRT: Documents = selected, Project = disabled, Photos = both.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Stack direction="row" gap="800" alignItems="flex-start">
      {(["sm", "md"] as const).map((size) => (
        <Stack key={size} gap="200">
          <Text fontWeight="700">{size}</Text>
          <Tree.Root
            aria-label={`Row states ${size}`}
            size={size}
            selectionMode="multiple"
            selectedKeys={["documents", "photos"]}
            disabledKeys={["project", "photos"]}
            items={fileTree}
            defaultExpandedKeys={["documents", "photos"]}
          >
            {renderNode}
          </Tree.Root>
        </Stack>
      ))}
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // React Aria builds the collection async; without this the frame can be empty.
    await waitForTreeRows(canvas);
    // A refusal to select disabled rows would drop the third state from the frame.
    await expect(
      canvasElement.querySelectorAll("[data-selected][data-disabled]")
    ).not.toHaveLength(0);
  },
};

/**
 * The empty state, via `renderEmptyState`. No other story passes an empty
 * collection, so the root's `&[data-empty]` rule renders nowhere else.
 */
export const EmptyState: Story = {
  // VRT: root `&[data-empty]`; the only frame with an empty collection.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Tree.Root
      aria-label="No files"
      items={[]}
      renderEmptyState={() => "No files yet"}
    >
      {renderNode}
    </Tree.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Root carries data-empty and renders the placeholder",
      async () => {
        await canvas.findByText("No files yet");
        // React Aria wraps the placeholder in a row, so row count proves nothing.
        await expect(canvas.getByRole("treegrid")).toHaveAttribute(
          "data-empty"
        );
      }
    );
  },
};

/**
 * Keyboard focus on a row. The `item` slot's ring is `focusRing: "inside"`, unlike
 * every other focus frame in this batch.
 */
export const FocusedRow: Story = {
  // VRT: the ring is expected here, painted inside the row box.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
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
    const rows = await waitForTreeRows(canvas);

    await step("Tab focuses the first row and paints a ring", async () => {
      await userEvent.tab();
      await expect(rows[0]).toHaveFocus();
      // Without this, a ring that never paints baselines as a silent pass.
      await expect(rows[0]).toHaveStyle({ outlineStyle: "solid" });
    });

    await step(
      "Root is not a scroll container, so rings aren't clipped",
      async () => {
        // The row's ring paints 2px outside a full-width row box, so a forced
        // `overflow` on the root would clip it horizontally. The recipe sets none
        // for exactly this reason; consumers opt into scrolling themselves.
        const treegrid = canvas.getByRole("treegrid", { name: "Files" });
        const { overflowX, overflowY } = getComputedStyle(treegrid);
        await expect([overflowX, overflowY]).toEqual(["visible", "visible"]);
      }
    );
  },
};

/**
 * A drag held open mid-flight. Pointer dragging can't be paused for a capture, but
 * the keyboard path can: Enter picks a row up and the drop target persists until
 * Enter drops or Escape cancels. Nothing else renders `[data-dragging]` or
 * `[data-drop-target]`.
 */
export const DragInProgress: Story = {
  // VRT: deliberately captured mid-drag - the play must NOT complete the drop.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  // React Aria's keyboard drag session is a module global that only Enter or
  // Escape ends - unmounting the story does not. Left live, it keeps `inert`
  // over the page and an observer that re-applies it to whatever mounts next,
  // so clicks in later stories go nowhere. Runs after Chromatic's capture.
  beforeEach: () => () => {
    document.body.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
    );
  },
  render: () => <FeatureTree aria-label="Files" selectionMode="none" />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await waitForTreeRows(canvas);

    await step("Pick a row up from its drag handle", async () => {
      const handle = canvas.getAllByRole("button", { name: /Drag/ })[0];
      handle.focus();
      await userEvent.keyboard("{Enter}");
      await wait();
    });

    await step("Move the drop target down one position", async () => {
      await userEvent.keyboard("{ArrowDown}");
      await wait();

      // Leave the drag open: this frame IS the snapshot.
      await waitFor(() =>
        expect(
          canvasElement.querySelector("[data-drop-target]")
        ).toBeInTheDocument()
      );
      // Keyboard DnD only offers row targets, so `DropIndicator` stays pointer-only.
      await expect(
        canvasElement.querySelector("[data-drop-target]")
      ).toHaveAttribute("role", "row");
      await expect(
        canvasElement.querySelectorAll("[data-dragging]")
      ).toHaveLength(1);
    });
  },
};

export const SmokeTest: Story = {
  // VRT: resting-visual carrier.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => <SmokeTestView />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await waitForTreeRows(canvas);

    await step("Every permutation renders", async () => {
      // 2 sizes × 2 layouts × 3 selection modes = 12 trees.
      await waitFor(() =>
        expect(canvas.getAllByRole("treegrid")).toHaveLength(12)
      );
    });

    await step(
      "Only drag-and-drop trees advertise dragging; selection checkboxes appear only in multiple mode",
      async () => {
        for (const size of SIZES) {
          for (const mode of SELECTION_MODES) {
            const plain = canvas.getByRole("treegrid", {
              name: `${size} · no drag · ${mode}`,
            });
            const dnd = canvas.getByRole("treegrid", {
              name: `${size} · drag & drop · ${mode}`,
            });
            await expect(plain).not.toHaveAttribute("data-allows-dragging");
            await expect(dnd).toHaveAttribute("data-allows-dragging", "true");

            // React Aria only wires selection checkboxes in `multiple` mode.
            const expectCheckboxes = mode === "multiple";
            await expect(
              within(plain).queryAllByRole("checkbox").length > 0
            ).toBe(expectCheckboxes);
          }
        }
      }
    );
  },
};

/**
 * Regression guard: React Aria must never offer the dragged subtree as a drop
 * target.
 *
 * `useTree`'s `onMove` re-parents a `dropPosition: "on"` drop with
 * `tree.move(key, target, index)` and does not itself check that the target
 * sits outside the dragged subtree — a self- or descendant-target would destroy
 * the dragged nodes (see `hooks/use-tree.spec.tsx`). What makes drag-and-drop
 * safe is upstream: `useDroppableCollectionState`'s `getDropOperation` cancels
 * any internal drop whose target is a dragged key or descends from one, for
 * pointer and keyboard alike.
 *
 * This pins that guarantee, so supplying an `onItemDrop`/`getDropOperation` of
 * our own, or a React Aria upgrade that moves the guard, fails here rather than
 * silently exposing the destructive path.
 */
export const DropTargetsExcludeDraggedSubtree: Story = {
  render: () => <FeatureTree aria-label="Files" selectionMode="none" />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await waitForTreeRows(canvas);

    await step("Picks up the Documents folder with the keyboard", async () => {
      const dragHandle = canvas.getByRole("button", { name: /Drag Documents/ });
      dragHandle.focus();
      await waitFor(() => expect(dragHandle).toHaveFocus());
      await userEvent.keyboard("{Enter}");
      await wait(150);
    });

    await step(
      "Never offers the dragged folder or its descendants as an 'on' target",
      async () => {
        // One full cycle of React Aria's keyboard drop targets is 9 steps for
        // this tree; 24 covers it more than twice over. Rows reachable as an
        // "on" target are collected, before/after indicator positions (where no
        // row carries `data-drop-target`) are skipped.
        const offered = new Set<string>();

        for (let i = 0; i < 24; i += 1) {
          // React Aria's between-rows drop indicator is itself a
          // `role="row"` carrying `aria-level` (valid treegrid markup), so it
          // has to be excluded by class or it registers as an empty target.
          const target = canvasElement.querySelector<HTMLElement>(
            '[role="row"][data-drop-target="true"]:not(.react-aria-DropIndicator)'
          );
          if (target) offered.add((target.textContent ?? "").trim());
          await userEvent.keyboard("{ArrowDown}");
          await wait(80);
        }

        // Documents is dragged; Project / Weekly Report / Budget descend from
        // it. Only the untouched Photos subtree may be dropped onto.
        await expect([...offered].sort()).toEqual([
          "Image 1",
          "Image 2",
          "Photos",
        ]);
      }
    );

    await step("Cancels the drag without losing the subtree", async () => {
      await userEvent.keyboard("{Escape}");
      await wait(150);

      await expect(
        canvas.getByRole("row", { name: /Documents/ })
      ).toBeInTheDocument();
      await expect(
        canvas.getByRole("row", { name: /Weekly Report/ })
      ).toBeInTheDocument();
      await expect(
        canvas.getByRole("row", { name: /Budget/ })
      ).toBeInTheDocument();
    });
  },
};
