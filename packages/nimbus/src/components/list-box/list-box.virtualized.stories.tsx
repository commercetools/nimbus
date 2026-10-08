import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box, ListBox, ScrollArea, Stack, Text } from "@commercetools/nimbus";
import { userEvent, within, expect, waitFor, fn } from "storybook/test";
import { LIST_BOX_VIRTUALIZER_HEIGHTS } from "./constants";

/**
 * Virtualized ListBox stories (`isVirtualized`).
 *
 * Test rules (Virtualizer design Decision 14): fixed story sizes,
 * `waitFor`/`findBy*` instead of timeouts, scroll assertions through
 * `scrollTop`/`scrollHeight`, typeahead in one `userEvent.keyboard` call,
 * ±1px for heights. Stories with 10,000 options are not snapshotted.
 */
const meta: Meta<typeof ListBox.Root> = {
  title: "Components/ListBox",
  component: ListBox.Root,
};

export default meta;

type Story = StoryObj<typeof ListBox.Root>;

/**
 * Test data
 */
const pad = (n: number) => String(n).padStart(5, "0");

const makeOptions = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: `option-${i + 1}`,
    name: `Option ${pad(i + 1)}`,
  }));

const fiveHundred = makeOptions(500);
const tenThousand = makeOptions(10_000);

const sizes = ["sm", "md"] as const;

/**
 * React Aria builds the collection after mount, and the virtualizer renders
 * no rows until its `ResizeObserver` reports a size. Generous timeout because
 * the built bundle settles slower (see `list-box.stories.tsx`).
 */
const waitForOptions = (canvas: ReturnType<typeof within>) =>
  canvas.findAllByRole("option", undefined, { timeout: 15000 });

const activeText = () => document.activeElement?.textContent ?? "";

/**
 * The virtualizer wraps each row in a positioned element; its rectangle is
 * the space the layout gave the row.
 */
const slotOf = (row: Element) => row.parentElement!.getBoundingClientRect();

const expectInView = (element: Element, container: Element) => {
  const rect = element.getBoundingClientRect();
  const box = container.getBoundingClientRect();
  expect(rect.top).toBeGreaterThanOrEqual(box.top - 1);
  expect(rect.bottom).toBeLessThanOrEqual(box.bottom + 1);
};

/**
 * Rendered rows do not overlap, and each row's content fits inside the space
 * the layout gave it.
 */
const expectNoOverlap = (rows: HTMLElement[]) => {
  const sorted = [...rows].sort(
    (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top
  );
  for (let i = 0; i < sorted.length; i++) {
    expect(sorted[i].getBoundingClientRect().bottom).toBeLessThanOrEqual(
      slotOf(sorted[i]).bottom + 1
    );
    expect(sorted[i].scrollHeight).toBeLessThanOrEqual(
      sorted[i].clientHeight + 1
    );
    if (i > 0) {
      expect(slotOf(sorted[i]).top).toBeGreaterThanOrEqual(
        slotOf(sorted[i - 1]).bottom - 1
      );
    }
  }
};

const VirtualizedList = ({
  options = tenThousand,
  size,
  label = "Options",
  selectionMode = "single",
}: {
  options?: { id: string; name: string }[];
  size?: "sm" | "md";
  label?: string;
  selectionMode?: "single" | "multiple";
}) => (
  <ListBox.Root
    isVirtualized
    aria-label={label}
    items={options}
    size={size}
    selectionMode={selectionMode}
    width="18rem"
    maxHeight="320px"
  >
    {(option) => (
      <ListBox.Item id={option.id} textValue={option.name}>
        {option.name}
      </ListBox.Item>
    )}
  </ListBox.Root>
);

/**
 * The layout's default row, header and loader estimates match the rendered
 * heights of the recipe, per `size`, so single-line lists never shift while
 * rows are measured. Fails when a recipe change alters a height without
 * updating `constants/virtualization.constants.ts`.
 */
export const VirtualizedEstimatesMatchRecipe: Story = {
  render: () => (
    <Stack direction="row" gap="400" alignItems="flex-start">
      {sizes.map((size) => (
        <Stack key={size} gap="400">
          <ListBox.Root
            aria-label={`Single ${size}`}
            size={size}
            selectionMode="single"
            width="14rem"
          >
            <ListBox.Section id="section" label="Section">
              <ListBox.Item id="a">Single line</ListBox.Item>
            </ListBox.Section>
            <ListBox.LoadMore isLoading />
          </ListBox.Root>
          <ListBox.Root
            aria-label={`Multiple ${size}`}
            size={size}
            selectionMode="multiple"
            width="14rem"
          >
            <ListBox.Item id="a">Single line</ListBox.Item>
          </ListBox.Root>
        </Stack>
      ))}
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await waitForOptions(canvas);

    for (const size of sizes) {
      await step(`${size}: single-select row`, async () => {
        const list = canvas.getByRole("listbox", { name: `Single ${size}` });
        // The loader row also has the `option` role, so query by name.
        const row = within(list).getByRole("option", { name: "Single line" });
        expect(row.getBoundingClientRect().height).toBeCloseTo(
          LIST_BOX_VIRTUALIZER_HEIGHTS.row[size].single,
          0
        );
      });

      await step(`${size}: multiple-select row`, async () => {
        const list = canvas.getByRole("listbox", { name: `Multiple ${size}` });
        const row = within(list).getByRole("option");
        expect(row.getBoundingClientRect().height).toBeCloseTo(
          LIST_BOX_VIRTUALIZER_HEIGHTS.row[size].multiple,
          0
        );
      });

      await step(`${size}: loader row`, async () => {
        const list = canvas.getByRole("listbox", { name: `Single ${size}` });
        const loader = list.querySelector(".nimbus-list-box__loader")!;
        expect(loader.getBoundingClientRect().height).toBeCloseTo(
          LIST_BOX_VIRTUALIZER_HEIGHTS.loader,
          0
        );
      });
    }

    await step("Section header", async () => {
      const headers = canvasElement.querySelectorAll(
        ".nimbus-list-box__sectionHeader"
      );
      expect(headers.length).toBe(sizes.length);
      for (const header of Array.from(headers)) {
        expect(header.getBoundingClientRect().height).toBeCloseTo(
          LIST_BOX_VIRTUALIZER_HEIGHTS.heading,
          0
        );
      }
    });
  },
};

/**
 * `isVirtualized` with 500 options (one commercetools API page) and 10,000
 * options, for each `size`: only visible options are in the DOM, and every
 * option is reachable.
 */
export const Virtualized: Story = {
  render: () => (
    <Stack direction="row" gap="400" alignItems="flex-start">
      <VirtualizedList options={fiveHundred} size="sm" label="500 sm" />
      <VirtualizedList options={fiveHundred} size="md" label="500 md" />
      <VirtualizedList options={tenThousand} size="sm" label="10000 sm" />
      <VirtualizedList options={tenThousand} size="md" label="10000 md" />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await waitForOptions(canvas);

    for (const [label, total] of [
      ["500 sm", 500],
      ["500 md", 500],
      ["10000 sm", 10_000],
      ["10000 md", 10_000],
    ] as const) {
      await step(`${label}: only visible options are rendered`, async () => {
        const list = canvas.getByRole("listbox", { name: label });
        const options = within(list).getAllByRole("option");
        expect(options.length).toBeGreaterThan(0);
        expect(options.length).toBeLessThan(60);
        expect(options[0]).toHaveAttribute("aria-posinset", "1");
        expect(options[0]).toHaveAttribute("aria-setsize", String(total));
      });
    }
  },
};

/**
 * Keyboard and selection on a virtualized ListBox with 10,000 options.
 */
export const VirtualizedKeyboardAndSelection: Story = {
  render: () => <VirtualizedList size="md" selectionMode="multiple" />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await waitForOptions(canvas);
    const list = canvas.getByRole("listbox");

    await step("End focuses the last option", async () => {
      await userEvent.tab();
      await userEvent.keyboard("{End}");
      await waitFor(() => expect(activeText()).toBe("Option 10000"));
      await waitFor(() => expectInView(document.activeElement!, list));
    });

    await step("Space selects the off-screen last option", async () => {
      await userEvent.keyboard(" ");
      await waitFor(() =>
        expect(document.activeElement).toHaveAttribute("aria-selected", "true")
      );
    });

    await step("Typeahead focuses an option that is not rendered", async () => {
      await userEvent.keyboard("{Home}");
      await waitFor(() => expect(activeText()).toBe("Option 00001"));
      await userEvent.keyboard("Option 04321");
      await waitFor(() => expect(activeText()).toBe("Option 04321"));
      await waitFor(() => expectInView(document.activeElement!, list));
    });

    await step("A second option can be selected", async () => {
      // Space right after typeahead is part of the search text, so click.
      // React Aria disables pointer events while the list scrolls; wait for
      // the scroll to end first.
      const focused = document.activeElement as HTMLElement;
      await waitFor(() =>
        expect(getComputedStyle(focused).pointerEvents).not.toBe("none")
      );
      await userEvent.click(focused);
      await waitFor(() =>
        expect(document.activeElement).toHaveAttribute("aria-selected", "true")
      );
    });

    await step("The first selection is kept", async () => {
      await userEvent.keyboard("{End}");
      await waitFor(() => expect(activeText()).toBe("Option 10000"));
      expect(document.activeElement).toHaveAttribute("aria-selected", "true");
    });
  },
};

/**
 * `virtualizerOptions` overrides a ListBox default. Here a large gap makes the
 * override visible.
 */
export const VirtualizedCustomOptions: Story = {
  render: () => (
    <ListBox.Root
      isVirtualized
      virtualizerOptions={{ gap: "400" }}
      aria-label="Custom gap"
      items={fiveHundred}
      width="18rem"
      maxHeight="320px"
    >
      {(option) => (
        <ListBox.Item id={option.id} textValue={option.name}>
          {option.name}
        </ListBox.Item>
      )}
    </ListBox.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const options = await waitForOptions(canvas);

    await step(
      "The consumer gap (16px) replaces the default (4px)",
      async () => {
        expect(slotOf(options[1]).top - slotOf(options[0]).bottom).toBeCloseTo(
          16,
          0
        );
      }
    );
  },
};

const groups = Array.from({ length: 50 }, (_, g) => ({
  id: `group-${g + 1}`,
  name: `Group ${g + 1}`,
  children: Array.from({ length: 20 }, (_, i) => ({
    id: `group-${g + 1}-option-${i + 1}`,
    name: `Group ${g + 1} option ${i + 1}`,
  })),
}));

/**
 * A virtualized ListBox with sections and headers. Records how React Aria
 * counts `aria-setsize` inside sections.
 */
export const VirtualizedWithSections: Story = {
  render: () => (
    <ListBox.Root
      isVirtualized
      aria-label="Grouped options"
      items={groups}
      width="18rem"
      maxHeight="320px"
    >
      {(group) => (
        <ListBox.Section
          id={group.id}
          label={group.name}
          items={group.children}
        >
          {(option) => (
            <ListBox.Item id={option.id} textValue={option.name}>
              {option.name}
            </ListBox.Item>
          )}
        </ListBox.Section>
      )}
    </ListBox.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const options = await waitForOptions(canvas);
    const list = canvas.getByRole("listbox");

    await step("Only visible options are rendered", async () => {
      expect(options.length).toBeLessThan(60);
    });

    await step(
      "Known React Aria limitation: positions inside sections",
      async () => {
        // Records current React Aria behaviour (listbox/useOption.mjs):
        // `aria-posinset` is the index inside the section, which counts the
        // section header, while `aria-setsize` counts the whole list. The
        // first option of every section is announced as "2 of 1000". If this
        // step fails, React Aria changed the behaviour: update the docs.
        const first = within(list).getByRole("option", {
          name: "Group 1 option 1",
        });
        expect(first).toHaveAttribute("aria-posinset", "2");
        expect(first).toHaveAttribute("aria-setsize", "1000");
      }
    );

    await step("The header height matches the estimate", async () => {
      const header = list.querySelector(".nimbus-list-box__sectionHeader")!;
      expect(header.getBoundingClientRect().height).toBeCloseTo(
        LIST_BOX_VIRTUALIZER_HEIGHTS.heading,
        0
      );
    });

    await step("Rows and headers do not overlap after scrolling", async () => {
      list.scrollTop = 8000;
      await waitFor(() =>
        expectNoOverlap([
          ...within(list).getAllByRole("option"),
          ...(Array.from(
            list.querySelectorAll(".nimbus-list-box__sectionHeader")
          ) as HTMLElement[]),
        ])
      );
    });
  },
};

const richOptions = Array.from({ length: 500 }, (_, i) => ({
  id: `rich-${i + 1}`,
  name:
    i % 3 === 0
      ? `Option ${pad(i + 1)} with a long label that wraps onto several lines`
      : `Option ${pad(i + 1)}`,
  description: i % 2 === 0 ? `Description for option ${i + 1}` : undefined,
}));

const RichList = ({ label = "Rich options" }: { label?: string }) => (
  <ListBox.Root
    isVirtualized
    aria-label={label}
    items={richOptions}
    width="16rem"
    maxHeight="320px"
  >
    {(option) => (
      <ListBox.Item id={option.id} textValue={option.name}>
        <Text slot="label">{option.name}</Text>
        {option.description && (
          <Text slot="description">{option.description}</Text>
        )}
      </ListBox.Item>
    )}
  </ListBox.Root>
);

/**
 * Wrapping labels and descriptions make rows taller than the estimate. Rows
 * are measured, so they never overlap or clip.
 */
export const VirtualizedWrappingContent: Story = {
  render: () => <RichList />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await waitForOptions(canvas);
    const list = canvas.getByRole("listbox");

    await step("Rows do not overlap", async () => {
      await waitFor(() => expectNoOverlap(within(list).getAllByRole("option")));
    });

    await step("Rows do not overlap after scrolling", async () => {
      list.scrollTop = 6000;
      await waitFor(() => expectNoOverlap(within(list).getAllByRole("option")));
    });
  },
};

/**
 * WCAG 1.4.12 text spacing applied after the first render: rows grow, are
 * measured again, and never overlap.
 */
export const VirtualizedTextSpacing: Story = {
  render: () => (
    <Box className="text-spacing-root">
      <RichList label="Text spacing" />
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const options = await waitForOptions(canvas);
    const list = canvas.getByRole("listbox");
    const firstHeight = options[1].getBoundingClientRect().height;

    await step("Apply the WCAG 1.4.12 text spacing override", async () => {
      const style = document.createElement("style");
      style.dataset.testid = "text-spacing";
      style.textContent = `
        .text-spacing-root * {
          line-height: 1.5 !important;
          letter-spacing: 0.12em !important;
          word-spacing: 0.16em !important;
        }
      `;
      document.head.appendChild(style);
    });

    try {
      await step("Rows grow and are measured again", async () => {
        await waitFor(() =>
          expect(
            within(list).getAllByRole("option")[1].getBoundingClientRect()
              .height
          ).toBeGreaterThan(firstHeight)
        );
        await waitFor(() =>
          expectNoOverlap(within(list).getAllByRole("option"))
        );
      });

      await step("Rows do not overlap after scrolling", async () => {
        list.scrollTop = 6000;
        await waitFor(() =>
          expectNoOverlap(within(list).getAllByRole("option"))
        );
      });
    } finally {
      document.head.querySelector('[data-testid="text-spacing"]')?.remove();
    }
  },
};

/**
 * 200% zoom on the story root: rows never overlap or clip.
 */
export const VirtualizedZoom: Story = {
  render: () => (
    <Box style={{ zoom: 2 }}>
      <RichList label="Zoomed" />
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await waitForOptions(canvas);
    const list = canvas.getByRole("listbox");

    await step("Rows do not overlap at 200%", async () => {
      await waitFor(() => expectNoOverlap(within(list).getAllByRole("option")));
    });

    await step("Rows do not overlap after scrolling at 200%", async () => {
      list.scrollTop = 3000;
      await waitFor(() => expectNoOverlap(within(list).getAllByRole("option")));
    });
  },
};

/**
 * A `plain` virtualized ListBox inside a ScrollArea: the ScrollArea scrolls,
 * and only the visible options are rendered.
 */
export const VirtualizedPlainInScrollArea: Story = {
  render: () => (
    <ScrollArea maxHeight="320px" width="18rem" data-testid="scroll-area">
      <ListBox.Root
        isVirtualized
        variant="plain"
        aria-label="Plain options"
        items={tenThousand}
      >
        {(option) => (
          <ListBox.Item id={option.id} textValue={option.name}>
            {option.name}
          </ListBox.Item>
        )}
      </ListBox.Root>
    </ScrollArea>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await waitForOptions(canvas);
    const list = canvas.getByRole("listbox");

    await step("The list does not scroll itself", async () => {
      expect(list.scrollHeight).toBeLessThanOrEqual(list.clientHeight + 1);
    });

    await step("Only visible options are rendered", async () => {
      expect(within(list).getAllByRole("option").length).toBeLessThan(60);
    });

    await step("Keyboard navigation scrolls the ScrollArea", async () => {
      // The ScrollArea viewport is itself focusable, so focus the first
      // option directly instead of tabbing.
      within(list).getAllByRole("option")[0].focus();
      await userEvent.keyboard("{End}");
      await waitFor(() => expect(activeText()).toBe("Option 10000"));
      const viewport = canvasElement.querySelector(
        '[data-testid="scroll-area"] [data-part="viewport"]'
      )!;
      await waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(0));
      await waitFor(() => expectInView(document.activeElement!, viewport));
    });
  },
};

/**
 * Keyboard focus on the first and last option of a virtualized list: the
 * focus ring is fully visible. Snapshotted per size.
 */
export const VirtualizedFocusRing: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Stack direction="row" gap="400" alignItems="flex-start">
      {sizes.map((size) => (
        <VirtualizedList
          key={size}
          options={makeOptions(8)}
          size={size}
          label={`Focus ${size}`}
        />
      ))}
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await waitForOptions(canvas);

    for (const size of sizes) {
      const list = canvas.getByRole("listbox", { name: `Focus ${size}` });

      for (const key of ["{Home}", "{End}"]) {
        await step(
          `${size}: ${key} focus ring is inside the list`,
          async () => {
            within(list).getAllByRole("option")[0].focus();
            await userEvent.keyboard(key);
            await waitFor(() => {
              const focused = document.activeElement as HTMLElement;
              const style = getComputedStyle(focused);
              const ring =
                parseFloat(style.outlineWidth) +
                parseFloat(style.outlineOffset);
              const rect = focused.getBoundingClientRect();
              const box = list.getBoundingClientRect();
              expect(style.outlineStyle).not.toBe("none");
              expect(rect.top - ring).toBeGreaterThanOrEqual(box.top - 1);
              expect(rect.bottom + ring).toBeLessThanOrEqual(box.bottom + 1);
            });
          }
        );
      }
    }

    await step(
      "Focus the last option of the sm list for the snapshot",
      async () => {
        const list = canvas.getByRole("listbox", { name: "Focus sm" });
        within(list).getAllByRole("option")[0].focus();
        await userEvent.keyboard("{End}");
      }
    );
  },
};

const warnSpy = fn();

/**
 * Misuse warning in development: `virtualizerOptions` without `isVirtualized`.
 */
export const VirtualizedOptionsWithoutIsVirtualized: Story = {
  render: () => (
    <ListBox.Root
      aria-label="Options without isVirtualized"
      virtualizerOptions={{ estimatedRowHeight: 56 }}
      items={makeOptions(5)}
    >
      {(option) => (
        <ListBox.Item id={option.id} textValue={option.name}>
          {option.name}
        </ListBox.Item>
      )}
    </ListBox.Root>
  ),
  beforeEach: () => {
    const original = console.warn;
    console.warn = (...args: unknown[]) => {
      warnSpy(...args);
      original(...args);
    };
    return () => {
      console.warn = original;
      warnSpy.mockClear();
    };
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await waitForOptions(canvas);

    await step("virtualizerOptions without isVirtualized warns", async () => {
      await waitFor(() =>
        expect(warnSpy).toHaveBeenCalledWith(
          expect.stringContaining(
            "ListBox.Root received virtualizerOptions without isVirtualized"
          )
        )
      );
    });
  },
};
