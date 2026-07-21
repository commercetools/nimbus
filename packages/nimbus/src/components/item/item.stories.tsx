import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Item,
  type ItemRootProps,
  Stack,
  Text,
  IconButton,
} from "@commercetools/nimbus";
import {
  Person,
  Settings,
  ChevronRight,
  Delete,
} from "@commercetools/nimbus-icons";
import { within, expect, userEvent, fn } from "storybook/test";

const sizes: ItemRootProps["size"][] = ["xs", "sm", "md"];
const variants: ItemRootProps["variant"][] = ["plain", "outline", "subtle"];

const meta: Meta<typeof Item.Root> = {
  title: "Components/Item",
  component: Item.Root,
};

export default meta;

type Story = StoryObj<typeof Item.Root>;

/**
 * Base story — a static (presentational) row with media, content, and actions.
 */
export const Base: Story = {
  render: () => (
    <Item.Root variant="outline" data-testid="item">
      <Item.Media variant="icon">
        <Person />
      </Item.Media>
      <Item.Content>
        <Item.Title>Profile</Item.Title>
        <Item.Description>Name, avatar, and contact details</Item.Description>
      </Item.Content>
      <Item.Actions>
        <IconButton aria-label="Settings" size="xs" variant="ghost">
          <Settings />
        </IconButton>
      </Item.Actions>
    </Item.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const item = canvas.getByTestId("item");

    await step("Renders a <div> by default (presentational)", async () => {
      await expect(item.tagName).toBe("DIV");
    });

    await step("Displays title and description", async () => {
      await expect(canvas.getByText("Profile")).toBeInTheDocument();
      await expect(
        canvas.getByText("Name, avatar, and contact details")
      ).toBeInTheDocument();
    });

    await step("Renders the action control", async () => {
      await expect(
        canvas.getByRole("button", { name: "Settings" })
      ).toBeInTheDocument();
    });
  },
};

/**
 * Sizes — xs, sm, md density steps.
 */
export const Sizes: Story = {
  render: () => (
    <Stack gap="400">
      {sizes.map((size) => (
        <Item.Root
          key={size as string}
          size={size}
          variant="outline"
          data-testid={`item-size-${size as string}`}
        >
          <Item.Media variant="icon">
            <Person />
          </Item.Media>
          <Item.Content>
            <Item.Title>Size: {size as string}</Item.Title>
            <Item.Description>Density scales padding and gap.</Item.Description>
          </Item.Content>
        </Item.Root>
      ))}
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Renders each size", async () => {
      for (const size of sizes) {
        await expect(
          canvas.getByTestId(`item-size-${size as string}`)
        ).toBeInTheDocument();
      }
    });
  },
};

/**
 * Variants — plain, outline, subtle.
 */
export const Variants: Story = {
  render: () => (
    <Stack gap="400">
      {variants.map((variant) => (
        <Item.Root
          key={variant as string}
          variant={variant}
          data-testid={`item-variant-${variant as string}`}
        >
          <Item.Content>
            <Item.Title>Variant: {variant as string}</Item.Title>
          </Item.Content>
        </Item.Root>
      ))}
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Renders each variant", async () => {
      for (const variant of variants) {
        await expect(
          canvas.getByTestId(`item-variant-${variant as string}`)
        ).toBeInTheDocument();
      }
    });
  },
};

/**
 * Media variants — default, icon, image.
 */
export const MediaVariants: Story = {
  render: () => (
    <Stack gap="400">
      <Item.Root variant="outline" data-testid="media-icon">
        <Item.Media variant="icon" data-testid="media-icon-slot">
          <Person />
        </Item.Media>
        <Item.Content>
          <Item.Title>Icon media</Item.Title>
        </Item.Content>
      </Item.Root>
      <Item.Root variant="outline" data-testid="media-image">
        <Item.Media variant="image" data-testid="media-image-slot">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
            alt="Placeholder thumbnail"
          />
        </Item.Media>
        <Item.Content>
          <Item.Title>Image media</Item.Title>
        </Item.Content>
      </Item.Root>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Media slot carries its data-variant", async () => {
      await expect(canvas.getByTestId("media-icon-slot")).toHaveAttribute(
        "data-variant",
        "icon"
      );
      await expect(canvas.getByTestId("media-image-slot")).toHaveAttribute(
        "data-variant",
        "image"
      );
    });
  },
};

/**
 * Header and footer bands.
 */
export const WithHeaderAndFooter: Story = {
  render: () => (
    <Item.Root variant="outline" data-testid="item">
      <Item.Header>
        <Text fontWeight="600">Header band</Text>
      </Item.Header>
      <Item.Media variant="icon">
        <Person />
      </Item.Media>
      <Item.Content>
        <Item.Title>With header and footer</Item.Title>
        <Item.Description>Both bands span the full row width.</Item.Description>
      </Item.Content>
      <Item.Footer>
        <Text textStyle="sm">Footer band</Text>
      </Item.Footer>
    </Item.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Renders header and footer content", async () => {
      await expect(canvas.getByText("Header band")).toBeInTheDocument();
      await expect(canvas.getByText("Footer band")).toBeInTheDocument();
    });
  },
};

/**
 * Link-upgrade — passing href renders the row as an accessible <a>.
 */
export const AsLink: Story = {
  render: () => (
    <Item.Root href="#item-target" variant="outline" data-testid="item">
      <Item.Media variant="icon">
        <Settings />
      </Item.Media>
      <Item.Content>
        <Item.Title>Settings</Item.Title>
        <Item.Description>Navigate to settings</Item.Description>
      </Item.Content>
      <Item.Media aria-hidden>
        <ChevronRight />
      </Item.Media>
    </Item.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Upgrades to an <a> with href", async () => {
      const link = canvas.getByRole("link", { name: /Settings/ });
      await expect(link.tagName).toBe("A");
      await expect(link).toHaveAttribute("href", "#item-target");
    });

    await step("Is keyboard focusable", async () => {
      const link = canvas.getByRole("link", { name: /Settings/ });
      await userEvent.tab();
      await expect(link).toHaveFocus();
    });
  },
};

/**
 * Link row with actions — the action control is an independent focus stop and
 * is operable without triggering row navigation.
 */
const onDeleteAction = fn();

export const LinkWithActions: Story = {
  render: () => (
    <Item.Root href="#item-target" variant="outline" data-testid="item">
      <Item.Content>
        <Item.Title>Report Q3</Item.Title>
        <Item.Description>Opens the report</Item.Description>
      </Item.Content>
      <Item.Actions>
        <IconButton
          aria-label="Delete"
          size="xs"
          variant="ghost"
          onPress={onDeleteAction}
          data-testid="delete-action"
        >
          <Delete />
        </IconButton>
      </Item.Actions>
    </Item.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    onDeleteAction.mockClear();

    await step("Row link and action are both present", async () => {
      await expect(
        canvas.getByRole("link", { name: /Report Q3/ })
      ).toBeInTheDocument();
      await expect(
        canvas.getByRole("button", { name: "Delete" })
      ).toBeInTheDocument();
    });

    await step("Action activates without navigating the row", async () => {
      const action = canvas.getByRole("button", { name: "Delete" });
      action.focus();
      await expect(action).toHaveFocus();

      await userEvent.click(action);

      // The action handler fired...
      await expect(onDeleteAction).toHaveBeenCalledTimes(1);
      // ...and the click did NOT navigate the row link (still mounted; the
      // location hash never became the row's href target).
      await expect(
        canvas.getByRole("link", { name: /Report Q3/ })
      ).toBeInTheDocument();
      await expect(window.location.hash).not.toBe("#item-target");
    });
  },
};
