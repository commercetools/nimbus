import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Item,
  type ItemRootProps,
  ItemGroup,
  Stack,
  Text,
  Button,
  IconButton,
  Image,
} from "@commercetools/nimbus";
import {
  Person,
  Settings,
  Notifications,
  ChevronRight,
  Delete,
} from "@commercetools/nimbus-icons";
import { within, expect, userEvent, fn } from "storybook/test";

const sizes: ItemRootProps["size"][] = ["xs", "sm", "md"];
const variants: ItemRootProps["variant"][] = ["plain", "outline", "subtle"];

const meta: Meta<typeof Item.Root> = {
  title: "Components/Item/Item",
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
          <Image
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
 * Actions with a full Button — `Item.Actions` accepts a regular `Button`, not
 * only an `IconButton`. The action keeps an independent focus order from the
 * row and is operable on its own.
 */
const onManageAction = fn();

export const WithButtonActions: Story = {
  render: () => (
    <Item.Root variant="outline" data-testid="item">
      <Item.Media variant="icon">
        <Person />
      </Item.Media>
      <Item.Content>
        <Item.Title>Team members</Item.Title>
        <Item.Description>Invite and manage who has access</Item.Description>
      </Item.Content>
      <Item.Actions>
        <Button size="xs" variant="outline" onPress={onManageAction}>
          Manage
        </Button>
      </Item.Actions>
    </Item.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    onManageAction.mockClear();

    await step("Renders a text Button action", async () => {
      await expect(
        canvas.getByRole("button", { name: "Manage" })
      ).toBeInTheDocument();
    });

    await step("Action is operable", async () => {
      const action = canvas.getByRole("button", { name: "Manage" });
      action.focus();
      await expect(action).toHaveFocus();

      await userEvent.click(action);
      await expect(onManageAction).toHaveBeenCalledTimes(1);
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
const onRootClickCapture = fn();

export const LinkWithActions: Story = {
  render: () => (
    <Item.Root
      href="#item-target"
      variant="outline"
      data-testid="item"
      // A consumer-supplied capture handler must coexist with the row's own
      // navigation guard, not replace it (regression guard for the guard being
      // merged rather than passed as a bare prop before the spread).
      onClickCapture={onRootClickCapture}
    >
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
    onRootClickCapture.mockClear();

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
      // ...the consumer's own onClickCapture on the row also fired (the guard
      // is chained via mergeProps, not clobbered by the consumer handler)...
      await expect(onRootClickCapture).toHaveBeenCalledTimes(1);
      // ...and the click did NOT navigate the row link (still mounted; the
      // location hash never became the row's href target).
      await expect(
        canvas.getByRole("link", { name: /Report Q3/ })
      ).toBeInTheDocument();
      await expect(window.location.hash).not.toBe("#item-target");
    });
  },
};

/**
 * Showcase — one story that exercises the entire Item + ItemGroup surface in a
 * single page. It is deliberately a kitchen sink, not a realistic layout: the
 * point is coverage, not product sense. In one render it uses —
 *
 * - **Parts:** `Item.Header`, `Item.Media`, `Item.Content` (`Item.Title` /
 *   `Item.Description`), `Item.Actions`, and `Item.Footer`.
 * - **Root variants** `plain` · `outline` · `subtle` and **sizes** `md` · `sm`
 *   · `xs`.
 * - **Media variants** `icon`, `image`, and `default`, plus style-prop
 *   overrides on the media slot for **avatars** (`borderRadius="full"`),
 *   **thumbnails** (default image box), and **large images** (a widened media
 *   box and a full-width banner in `Item.Header`).
 * - **Imagery** via the Nimbus `Image` component sourced from picsum.photos
 *   with fixed `seed`s, so every picture is deterministic.
 * - **Link-upgrade** rows (`href` → `<a>`), including a link row whose trailing
 *   `Item.Actions` control stays operable without navigating the row.
 * - **Actions** as both a `Button` (solid / outline / ghost) and an
 *   `IconButton`.
 * - **`ItemGroup.Root` + `ItemGroup.Separator`** for grouped sections, and a
 *   standalone `Item.Root` outside any group.
 *
 * Not VRT-snapshotted (the network imagery would flake, and `SmokeTest` already
 * owns visual coverage with an offline image); the play function asserts
 * behavior and the deterministic image `src`.
 */
const onMemberSettings = fn();

export const Showcase: Story = {
  render: () => (
    <Stack gap="800" maxWidth="640px" data-testid="showcase">
      <Text textStyle="lg" fontWeight="700">
        Item &amp; ItemGroup — full showcase
      </Text>

      {/* Standalone card: a full-width banner image in the Header, a thumbnail
          in the Media slot, a Button action, and a Footer band. */}
      <Item.Root variant="outline" data-testid="hero-card">
        <Item.Header>
          <Image
            src="https://picsum.photos/seed/hero/640/200"
            alt=""
            width="100%"
            height="160px"
            borderRadius="200"
            objectFit="cover"
          />
        </Item.Header>
        <Item.Media variant="image">
          <Image
            src="https://picsum.photos/seed/report/96/96"
            alt="Report thumbnail"
          />
        </Item.Media>
        <Item.Content>
          <Item.Title>Quarterly report</Item.Title>
          <Item.Description>
            Header banner, thumbnail media, and a footer band on one Item.
          </Item.Description>
        </Item.Content>
        <Item.Actions>
          <Button size="xs" variant="solid">
            Open
          </Button>
        </Item.Actions>
        <Item.Footer>
          <Text textStyle="sm">Updated 3 days ago · 12 contributors</Text>
        </Item.Footer>
      </Item.Root>

      {/* Members — avatars (rounded image media), a link row with an operable
          trailing action, and Button actions, divided by separators. */}
      <Stack gap="300">
        <Text textStyle="sm" fontWeight="600">
          Members
        </Text>
        <ItemGroup.Root>
          <Item.Root href="#member-alex" data-testid="member-link">
            <Item.Media variant="image" borderRadius="full">
              <Image
                src="https://picsum.photos/seed/alex/96/96"
                alt="Alex Rivera"
              />
            </Item.Media>
            <Item.Content>
              <Item.Title>Alex Rivera</Item.Title>
              <Item.Description>Owner · alex@acme.com</Item.Description>
            </Item.Content>
            <Item.Actions>
              <IconButton
                aria-label="Member settings"
                size="xs"
                variant="ghost"
                onPress={onMemberSettings}
              >
                <Settings />
              </IconButton>
            </Item.Actions>
          </Item.Root>
          <ItemGroup.Separator />
          <Item.Root>
            <Item.Media variant="image" borderRadius="full">
              <Image
                src="https://picsum.photos/seed/jordan/96/96"
                alt="Jordan Lee"
              />
            </Item.Media>
            <Item.Content>
              <Item.Title>Jordan Lee</Item.Title>
              <Item.Description>Editor · jordan@acme.com</Item.Description>
            </Item.Content>
            <Item.Actions>
              <Button size="xs" variant="outline">
                Manage
              </Button>
            </Item.Actions>
          </Item.Root>
          <ItemGroup.Separator />
          <Item.Root>
            <Item.Media variant="icon">
              <Person />
            </Item.Media>
            <Item.Content>
              <Item.Title>Pat Morgan</Item.Title>
              <Item.Description>Viewer · pat@acme.com</Item.Description>
            </Item.Content>
            <Item.Actions>
              <Button size="xs" variant="ghost">
                Change role
              </Button>
            </Item.Actions>
          </Item.Root>
        </ItemGroup.Root>
      </Stack>

      {/* Gallery — large image media via a widened media box. */}
      <Stack gap="300">
        <Text textStyle="sm" fontWeight="600">
          Gallery
        </Text>
        <ItemGroup.Root>
          <Item.Root>
            <Item.Media
              variant="image"
              width="120px"
              height="80px"
              borderRadius="200"
            >
              <Image
                src="https://picsum.photos/seed/mountain/240/160"
                alt="Mountains at dusk"
              />
            </Item.Media>
            <Item.Content>
              <Item.Title>Mountains at dusk</Item.Title>
              <Item.Description>Large 120×80 media override</Item.Description>
            </Item.Content>
          </Item.Root>
          <ItemGroup.Separator />
          <Item.Root>
            <Item.Media
              variant="image"
              width="120px"
              height="80px"
              borderRadius="200"
            >
              <Image
                src="https://picsum.photos/seed/ocean/240/160"
                alt="Open water"
              />
            </Item.Media>
            <Item.Content>
              <Item.Title>Open water</Item.Title>
              <Item.Description>Another landscape thumbnail</Item.Description>
            </Item.Content>
          </Item.Root>
        </ItemGroup.Root>
      </Stack>

      {/* Recent activity — dense rows (size sm), subtle variant, default media. */}
      <Stack gap="300">
        <Text textStyle="sm" fontWeight="600">
          Recent activity
        </Text>
        <ItemGroup.Root>
          <Item.Root size="sm" variant="subtle">
            <Item.Media variant="icon">
              <Notifications />
            </Item.Media>
            <Item.Content>
              <Item.Title>Deployment succeeded</Item.Title>
              <Item.Description>2 minutes ago</Item.Description>
            </Item.Content>
          </Item.Root>
          <ItemGroup.Separator />
          <Item.Root size="sm" variant="subtle">
            <Item.Media variant="default">
              <Person />
            </Item.Media>
            <Item.Content>
              <Item.Title>New member joined</Item.Title>
              <Item.Description>Yesterday</Item.Description>
            </Item.Content>
          </Item.Root>
        </ItemGroup.Root>
      </Stack>

      {/* Quick links — compact (size xs) link rows with a trailing chevron. */}
      <Stack gap="300">
        <Text textStyle="sm" fontWeight="600">
          Quick links
        </Text>
        <ItemGroup.Root>
          <Item.Root href="#docs" size="xs">
            <Item.Media variant="icon">
              <Settings />
            </Item.Media>
            <Item.Content>
              <Item.Title>Documentation</Item.Title>
            </Item.Content>
            <Item.Media aria-hidden>
              <ChevronRight />
            </Item.Media>
          </Item.Root>
          <ItemGroup.Separator />
          <Item.Root href="#support" size="xs">
            <Item.Media variant="icon">
              <Person />
            </Item.Media>
            <Item.Content>
              <Item.Title>Contact support</Item.Title>
            </Item.Content>
            <Item.Media aria-hidden>
              <ChevronRight />
            </Item.Media>
          </Item.Root>
        </ItemGroup.Root>
      </Stack>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    onMemberSettings.mockClear();

    await step("Renders every section and the standalone card", async () => {
      await expect(canvas.getByText("Quarterly report")).toBeInTheDocument();
      await expect(
        canvas.getByText("Updated 3 days ago · 12 contributors")
      ).toBeInTheDocument();
      await expect(canvas.getByText("Members")).toBeInTheDocument();
      await expect(canvas.getByText("Gallery")).toBeInTheDocument();
      await expect(canvas.getByText("Recent activity")).toBeInTheDocument();
      await expect(canvas.getByText("Quick links")).toBeInTheDocument();
    });

    await step("Rows with href upgrade to accessible links", async () => {
      const memberLink = canvas.getByTestId("member-link");
      await expect(memberLink.tagName).toBe("A");
      await expect(memberLink).toHaveAttribute("href", "#member-alex");
      await expect(
        canvas.getByRole("link", { name: /Documentation/ })
      ).toHaveAttribute("href", "#docs");
    });

    await step(
      "A trailing action in a link row fires without navigating",
      async () => {
        await userEvent.click(
          canvas.getByRole("button", { name: "Member settings" })
        );
        await expect(onMemberSettings).toHaveBeenCalledTimes(1);
        await expect(window.location.hash).not.toBe("#member-alex");
      }
    );

    await step("Image media uses the deterministic seeded source", async () => {
      await expect(
        canvas.getByRole("img", { name: "Jordan Lee" })
      ).toHaveAttribute("src", "https://picsum.photos/seed/jordan/96/96");
    });

    await step("Separators divide the grouped sections", async () => {
      // Members (2) + Gallery (1) + Recent activity (1) + Quick links (1) = 5
      await expect(canvas.getAllByRole("separator")).toHaveLength(5);
    });
  },
};

/**
 * SmokeTest — the full `variant × size` grid plus the media variants, a link
 * row, and header/footer bands, packed into a single render. This is the story
 * Chromatic snapshots (`tags: ["vrt"]`); it keeps combinatorial visual coverage
 * to one billable image. No play function — it exists purely for visual
 * regression.
 */
export const SmokeTest: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Stack gap="800">
      {variants.map((variant) => (
        <Stack key={variant as string} direction="column" gap="400">
          {sizes.map((size) => (
            <Item.Root key={size as string} variant={variant} size={size}>
              <Item.Media variant="icon">
                <Person />
              </Item.Media>
              <Item.Content>
                <Item.Title>
                  {variant as string} · {size as string}
                </Item.Title>
                <Item.Description>
                  Media, content, and a trailing action.
                </Item.Description>
              </Item.Content>
              <Item.Actions>
                <IconButton aria-label="Settings" size="xs" variant="ghost">
                  <Settings />
                </IconButton>
              </Item.Actions>
            </Item.Root>
          ))}
        </Stack>
      ))}

      {/* Media variants */}
      <Stack direction="column" gap="400">
        <Item.Root variant="outline">
          <Item.Media variant="default">
            <Person />
          </Item.Media>
          <Item.Content>
            <Item.Title>Media: default</Item.Title>
          </Item.Content>
        </Item.Root>
        <Item.Root variant="outline">
          <Item.Media variant="icon">
            <Person />
          </Item.Media>
          <Item.Content>
            <Item.Title>Media: icon</Item.Title>
          </Item.Content>
        </Item.Root>
        <Item.Root variant="outline">
          <Item.Media variant="image">
            <Image
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
              alt="Placeholder thumbnail"
            />
          </Item.Media>
          <Item.Content>
            <Item.Title>Media: image</Item.Title>
          </Item.Content>
        </Item.Root>
      </Stack>

      {/* Link row */}
      <Item.Root href="#smoke-target" variant="outline">
        <Item.Media variant="icon">
          <Settings />
        </Item.Media>
        <Item.Content>
          <Item.Title>Link row</Item.Title>
          <Item.Description>Renders as an accessible anchor</Item.Description>
        </Item.Content>
        <Item.Media aria-hidden>
          <ChevronRight />
        </Item.Media>
      </Item.Root>

      {/* Header + footer bands */}
      <Item.Root variant="outline">
        <Item.Header>
          <Text fontWeight="600">Header band</Text>
        </Item.Header>
        <Item.Media variant="icon">
          <Person />
        </Item.Media>
        <Item.Content>
          <Item.Title>With header and footer</Item.Title>
          <Item.Description>
            Both bands span the full row width.
          </Item.Description>
        </Item.Content>
        <Item.Footer>
          <Text textStyle="sm">Footer band</Text>
        </Item.Footer>
      </Item.Root>
    </Stack>
  ),
};
