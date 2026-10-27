import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Accordion,
  Avatar,
  Badge,
  Button,
  Checkbox,
  Flex,
  LoadingSpinner,
  Stack,
} from "@commercetools/nimbus";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta: Meta<typeof Accordion.Root> = {
  title: "Components/Accordion",
  component: Accordion.Root,
};

export default meta;

type Story = StoryObj<typeof Accordion.Root>;

const items = [
  { value: "a", title: "First Item", text: "Some value 1..." },
  { value: "b", title: "Second Item", text: "Some value 2..." },
  { value: "c", title: "Third Item", text: "Some value 3..." },
];

const sizes = ["sm", "md"] as const;

export const Basic: Story = {
  render: () => (
    <Accordion.Root>
      <Accordion.Item>
        <Accordion.Header>First Item</Accordion.Header>
        <Accordion.Content>First item content</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    const trigger = canvas.getByRole("button", { name: "First Item" });
    const panel = canvas.getByRole("group", { hidden: true });

    await step("Can be focused with keyboard", async () => {
      await userEvent.tab();
      await waitFor(() => expect(trigger).toHaveFocus());
    });

    await step("Panel is initially hidden", async () => {
      await expect(panel).not.toBeVisible();
    });

    await step("Can be triggered with Enter key", async () => {
      await userEvent.keyboard("{Enter}");
      await expect(panel).toBeVisible();
    });

    await step("Can be triggered with Space key", async () => {
      await userEvent.keyboard(" ");
      await expect(panel).not.toBeVisible();
    });
  },
};

/**
 * `Accordion.HeaderRightContent` is pulled out of the header's children into its
 * own slot, splitting the header into trigger + right cluster.
 */
export const WithHeaderItemsToRight: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Accordion.Root>
      <Accordion.Item value="a">
        <Accordion.Header>First Item</Accordion.Header>
        <Accordion.Content>First item content</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="b">
        <Accordion.Header>
          Second Item
          <Accordion.HeaderRightContent>
            <Button colorPalette="critical" m="100">
              First action
            </Button>
            <Button colorPalette="neutral" m="100">
              Second Action
            </Button>
          </Accordion.HeaderRightContent>
        </Accordion.Header>
        <Accordion.Content>Second item content</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Second Item" });
    const panel = canvas.getAllByRole("group", { hidden: true })[1];

    await step("Header-right buttons don't toggle the item", async () => {
      await expect(panel).not.toBeVisible();

      for (const name of ["First action", "Second Action"]) {
        await userEvent.click(canvas.getByRole("button", { name }));
        await expect(panel).not.toBeVisible();
      }
    });

    await step("The item trigger expands the panel", async () => {
      await userEvent.click(trigger);
      await expect(panel).toBeVisible();
    });

    await step("The item trigger collapses the panel again", async () => {
      await userEvent.click(trigger);
      await expect(panel).not.toBeVisible();
    });

    // Clicking the trigger leaves it focus-visible; blur so its ring isn't snapshotted.
    trigger.blur();
  },
};

/**
 * Chevron styles (size, rotation) apply to the chevron only. Other svgs in the
 * header, like a custom icon or a spinner inside a badge, keep their own size
 * and do not rotate.
 */
export const WithSvgInHeader: Story = {
  // No VRT: the play asserts computed size and rotation, the chevron pixels are covered by Sizes/SmokeTest.
  render: () => (
    <Accordion.Root>
      <Accordion.Item value="a">
        <Accordion.Header>
          First Item
          <svg
            data-testid="header-icon"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            aria-hidden="true"
          >
            <circle cx="6" cy="6" r="6" fill="currentColor" />
          </svg>
          <Badge>
            <LoadingSpinner size="2xs" data-testid="header-spinner" />1
          </Badge>
        </Accordion.Header>
        <Accordion.Content>First item content</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /First Item/ });
    const chevron = trigger.querySelector(".nimbus-accordion__indicator")!;
    const icon = canvas.getByTestId("header-icon");
    const spinnerSvg = canvas
      .getByTestId("header-spinner")
      .querySelector("svg")!;

    const rotate = (el: Element) => getComputedStyle(el).rotate;
    const isUnrotated = (el: Element) =>
      expect(rotate(el)).toMatch(/^(none|0deg)$/);

    await step("The chevron has the chevron size", async () => {
      await expect(chevron.tagName.toLowerCase()).toBe("svg");
      await expect(getComputedStyle(chevron).width).toBe("24px");
    });

    await step("Other svgs keep their own size", async () => {
      await expect(getComputedStyle(icon).width).toBe("12px");
      await expect(getComputedStyle(icon).height).toBe("12px");
      // Intrinsic size of the spinner's 24x24 viewBox, not the chevron variable.
      await expect(spinnerSvg.getAttribute("width")).toBeNull();
      await expect(
        spinnerSvg.closest(".nimbus-accordion__indicator")
      ).toBeNull();
    });

    await step("Expanding rotates the chevron only", async () => {
      await userEvent.click(trigger);
      await waitFor(() => expect(rotate(chevron)).toBe("90deg"));
      await isUnrotated(icon);
      await isUnrotated(spinnerSvg);
      await expect(getComputedStyle(icon).width).toBe("12px");
    });

    await step("Collapsing rotates the chevron back", async () => {
      await userEvent.click(trigger);
      await waitFor(() => expect(rotate(chevron)).toMatch(/^(none|0deg)$/));
    });

    trigger.blur();
  },
};

const AccordionContent = () => {
  const avatarImg = "https://thispersondoesnotexist.com/ ";

  return (
    <div style={{ display: "flex", alignItems: "center", padding: "10px" }}>
      <Avatar src={avatarImg} firstName="Michael" lastName="Douglas" />
      <Checkbox marginLeft="100">Yes?</Checkbox>
      <Checkbox marginLeft="100">No?</Checkbox>
    </div>
  );
};

export const Sizes: Story = {
  render: () => (
    <>
      {sizes.map((size, index) => (
        <Accordion.Root key={index} size={size}>
          <Accordion.Item value={size}>
            <Accordion.Header>{size} size</Accordion.Header>
            <Accordion.Content>
              <Flex
                justifyContent="space-between"
                alignItems={"center"}
                borderColor="neutral.4"
              >
                <div style={{ marginRight: "100" }}>{size} size</div>
                <AccordionContent />
              </Flex>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      ))}
    </>
  ),
};

export const AllowMultiple: Story = {
  render: () => (
    <Accordion.Root allowsMultipleExpanded>
      {items.map((item, index) => (
        <Accordion.Item key={index} value={item.value}>
          <Accordion.Header>{item.title}</Accordion.Header>
          <Accordion.Content>{item.text}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  ),
};

export const Focused: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Accordion.Root>
      {items.map((item) => (
        <Accordion.Item key={item.value} value={item.value}>
          <Accordion.Header>{item.title}</Accordion.Header>
          <Accordion.Content>{item.text}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Tab moves focus to the first item trigger", async () => {
      await userEvent.tab();
      await waitFor(() =>
        expect(
          canvas.getByRole("button", { name: items[0].title })
        ).toHaveFocus()
      );
    });
  },
};

/**
 * A disabled group. Only the trigger dims, so the first item is left expanded to
 * show the dimmed header above an undimmed panel.
 */
export const Disabled: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Accordion.Root isDisabled defaultExpandedKeys={["a"]}>
      {items.map((item, index) => (
        <Accordion.Item key={index} value={item.value}>
          <Accordion.Header>{item.title}</Accordion.Header>
          <Accordion.Content>{item.text}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  ),
};

export const DefaultExpandedKeys: Story = {
  render: () => (
    <Accordion.Root allowsMultipleExpanded defaultExpandedKeys={["a", "c"]}>
      {items.map((item, index) => (
        <Accordion.Item key={index} value={item.value}>
          <Accordion.Header>{item.title}</Accordion.Header>
          <Accordion.Content>{item.text}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const panels = canvas.getAllByRole("group", { hidden: true });

    await step("First and third items are initially expanded", async () => {
      await waitFor(() => {
        // First and third panels should be visible
        expect(panels[0]).toBeVisible();
        expect(panels[2]).toBeVisible();
        // Second panel should not be visible
        expect(panels[1]).not.toBeVisible();
      });
    });
  },
};

export const WithStyleProps: Story = {
  render: () => (
    <Accordion.Root>
      <Accordion.Item
        value="styled-item"
        backgroundColor="warning.2"
        padding="400"
        margin="300"
        borderRadius="md"
        border="1px solid"
        borderColor="warning.6"
      >
        <Accordion.Header
          backgroundColor="info.5"
          padding="300"
          borderRadius="sm"
          margin="200"
        >
          Item with Style Props
        </Accordion.Header>
        <Accordion.Content
          padding="800"
          fontWeight="500"
          border="1px solid pink"
        >
          Content with custom styling using Chakra style props
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="normal-item">
        <Accordion.Header>Normal Item (no style props)</Accordion.Header>
        <Accordion.Content>
          Normal content without custom styling
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  ),
};

export const SmokeTest: Story = {
  // VRT: the axes interact - size drives the panel padding, which only renders while expanded.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Stack gap="800">
      {sizes.map((size) => (
        <Accordion.Root
          key={size}
          size={size}
          allowsMultipleExpanded
          defaultExpandedKeys={[`${size}-expanded`]}
        >
          <Accordion.Item value={`${size}-expanded`}>
            <Accordion.Header>{size} / expanded</Accordion.Header>
            <Accordion.Content>{size} expanded panel</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value={`${size}-collapsed`}>
            <Accordion.Header>{size} / collapsed</Accordion.Header>
            <Accordion.Content>{size} collapsed panel</Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      ))}
    </Stack>
  ),
};
