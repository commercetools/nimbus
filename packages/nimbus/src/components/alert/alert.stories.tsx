import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, fn } from "storybook/test";
import { Alert, type AlertProps, Button, Stack } from "@commercetools/nimbus";
import { Info } from "@commercetools/nimbus-icons";

const colorPalettes: AlertProps["colorPalette"][] = [
  "critical",
  "info",
  "warning",
  "positive",
];
const variants: AlertProps["variant"][] = [
  "flat",
  "subtle",
  "outline",
  "solid",
];

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof Alert.Root> = {
  title: "Components/Alert",
  component: Alert.Root,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof Alert.Root>;

// Mock function for dismiss button onPress
const mockOnDismiss = fn();

/**
 * Base story
 * Demonstrates the most basic implementation with all parts.
 * Uses the args pattern for dynamic control panel inputs.
 * Includes interaction tests.
 */
export const Base: Story = {
  args: {
    colorPalette: "positive",
    variant: "outlined",
    "data-testid": "base-alert",
    children: (
      <>
        <Alert.Title>Base Alert Title</Alert.Title>
        <Alert.Description>Base Alert Description</Alert.Description>
        <Alert.Actions>
          <Stack direction="row" gap="8px" alignItems="center">
            <Button variant="outline">Action 1</Button>
            <Button variant="outline">Action 2</Button>
          </Stack>
        </Alert.Actions>
        <Alert.DismissButton
          onPress={mockOnDismiss}
          data-testid="dismiss-button"
        />
      </>
    ),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const alertRoot = canvas.getByTestId("base-alert");
    const dismissButton = await canvas.findByTestId("dismiss-button");
    // Find the icon inside the button
    const dismissIcon = within(dismissButton).getByRole("img", {
      hidden: true,
    });

    await step("Renders all parts correctly", async () => {
      await expect(alertRoot).toBeInTheDocument();
      await expect(alertRoot).toHaveAttribute("role", "status");
      await expect(canvas.getByText("Base Alert Title")).toBeInTheDocument();
      await expect(
        canvas.getByText("Base Alert Description")
      ).toBeInTheDocument();
      await expect(canvas.getByText("Action 1")).toBeInTheDocument();
      await expect(canvas.getByText("Action 2")).toBeInTheDocument();
      await expect(dismissButton).toBeInTheDocument();
      await expect(dismissButton).toHaveAttribute("aria-label", "Dismiss"); // Default label from IconButton
      await expect(dismissIcon).toBeInTheDocument(); // Check if the clear icon is rendered
    });

    await step("Dismiss button is clickable and calls onPress", async () => {
      await userEvent.click(dismissButton);
      await expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });
  },
};

export const ColorPalettesShowcase: Story = {
  name: "Showcase: colorPalettes",
  render: () => (
    <Stack direction="column" gap="400" alignItems="flex-start">
      {colorPalettes.map((colorPalette) => (
        <Alert.Root
          key={`alert-${colorPalette as string}`}
          colorPalette={colorPalette}
          variant="outlined"
        >
          <Alert.Title>Alert Title ({colorPalette as string})</Alert.Title>
          <Alert.Description>Alert Description</Alert.Description>
          <Alert.Actions>
            <Stack direction="row" gap="8px" alignItems="center">
              <Button variant="outline">Button</Button>
            </Stack>
          </Alert.Actions>
          <Alert.DismissButton
            onPress={() => alert(`Dismissed ${colorPalette as string}`)}
          />
        </Alert.Root>
      ))}
    </Stack>
  ),
};

export const VariantsShowcase: Story = {
  name: "Showcase: Variants",
  render: () => (
    <Stack direction="column" gap="400" alignItems="flex-start">
      {colorPalettes.map((colorPalette) => (
        <Stack
          key={`stack-${colorPalette as string}`}
          direction="row"
          gap="400"
          width="100%"
        >
          {variants.map((variant) => (
            <Alert.Root
              key={`alert-${colorPalette as string}-${variant as string}`}
              colorPalette={colorPalette}
              variant={variant}
            >
              <Alert.Title>
                {colorPalette as string} / {variant as string}
              </Alert.Title>
              <Alert.Description>Desc.</Alert.Description>
              <Alert.DismissButton onPress={() => alert("Dismissed")} />
            </Alert.Root>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};

export const TitleOnly: Story = {
  name: "Composition: Title Only",
  args: {
    colorPalette: "positive",
    variant: "outlined",
    "data-testid": "alert-title-only",
    children: (
      <>
        <Alert.Title>Title Only Alert</Alert.Title>
        {/* Intentionally omit Description, Actions, DismissButton */}
      </>
    ),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const alert = canvas.getByTestId("alert-title-only");

    await step("Renders only the title", async () => {
      const title = await within(alert).findByText("Title Only Alert");
      expect(title).toBeInTheDocument();
    });

    await step("Does not render other parts", async () => {
      await expect(
        within(alert).queryByText(/Description/i)
      ).not.toBeInTheDocument();
      await expect(
        within(alert).queryByRole("button") // Check for any button
      ).not.toBeInTheDocument();
    });
  },
};

export const DescriptionOnly: Story = {
  name: "Composition: Description Only",
  args: {
    colorPalette: "info",
    variant: "flat",
    "data-testid": "alert-desc-only",
    children: (
      <>
        <Alert.Description>Description Only Alert</Alert.Description>
        {/* Intentionally omit Title, Actions, DismissButton */}
      </>
    ),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const alert = canvas.getByTestId("alert-desc-only");

    await step("Renders only the description", async () => {
      const title = await within(alert).findByText("Description Only Alert");
      expect(title).toBeInTheDocument();
    });

    await step("Does not render other parts", async () => {
      await expect(within(alert).queryByText(/Title/i)).not.toBeInTheDocument();
      await expect(
        within(alert).queryByRole("button") // Check for any button
      ).not.toBeInTheDocument();
    });
  },
};

export const TitleAndActions: Story = {
  name: "Composition: Title and Actions",
  args: {
    colorPalette: "warning",
    variant: "outlined",
    "data-testid": "alert-title-actions",
    children: (
      <>
        <Alert.Title>Title and Actions only</Alert.Title>
        <Alert.Actions>
          <Stack direction="row" gap="8px" alignItems="center">
            <Button variant="outline">Action A</Button>
            <Button variant="ghost">Action B</Button>
          </Stack>
        </Alert.Actions>
        {/* Intentionally omit Description, DismissButton */}
      </>
    ),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const alert = canvas.getByTestId("alert-title-actions");

    await step("Renders title and action buttons", async () => {
      const title = await within(alert).findByText("Title and Actions only");
      expect(title).toBeInTheDocument();

      await expect(
        within(alert).getByRole("button", { name: "Action A" })
      ).toBeInTheDocument();
      await expect(
        within(alert).getByRole("button", { name: "Action B" })
      ).toBeInTheDocument();
    });

    await step("Does not render description or dismiss button", async () => {
      await expect(
        within(alert).queryByText(/Description/i)
      ).not.toBeInTheDocument();
      await expect(
        within(alert).queryByRole("button", { name: /Dismiss/i })
      ).not.toBeInTheDocument();
    });
  },
};

const mockDismissNoActions = fn();
export const NoActions: Story = {
  name: "Composition: Title, Description, Dismiss (No Actions)",
  args: {
    colorPalette: "positive",
    variant: "outlined",
    "data-testid": "alert-no-actions",
    children: (
      <>
        <Alert.Title>Complete Alert (No Actions)</Alert.Title>
        <Alert.Description>
          Title and description are present.
        </Alert.Description>
        {/* Intentionally omit Actions */}
        <Alert.DismissButton
          onPress={mockDismissNoActions}
          data-testid="dismiss-no-actions-button"
        />
      </>
    ),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const alert = canvas.getByTestId("alert-no-actions");
    const dismissButton = await within(alert).findByTestId(
      "dismiss-no-actions-button"
    );

    await step("Renders title, description, and dismiss button", async () => {
      await expect(
        within(alert).getByText("Complete Alert (No Actions)")
      ).toBeInTheDocument();
      await expect(
        within(alert).getByText("Title and description are present.")
      ).toBeInTheDocument();
      await expect(dismissButton).toBeInTheDocument();
      await expect(dismissButton).toHaveAttribute("aria-label", "Dismiss");
    });

    await step("Does not render action buttons", async () => {
      // Check specifically for non-dismiss buttons
      const actionButtons = within(alert)
        .queryAllByRole("button")
        .filter((btn) => btn !== dismissButton);
      await expect(actionButtons.length).toBe(0);
    });

    await step("Dismiss button is clickable and calls onPress", async () => {
      await userEvent.click(dismissButton);
      await expect(mockDismissNoActions).toHaveBeenCalledTimes(1);
    });
  },
};

export const EmphasisDefaultsToSubtle: Story = {
  args: {
    colorPalette: "info",
    "data-testid": "default-alert",
    children: <Alert.Title>Default emphasis</Alert.Title>,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const root = canvas.getByTestId("default-alert");
    await step(
      "Omitting variant renders the subtle tinted surface",
      async () => {
        const bg = getComputedStyle(root).backgroundColor;
        await expect(bg).not.toBe("rgba(0, 0, 0, 0)");
        await expect(bg).not.toBe("transparent");
      }
    );
  },
};

export const OutlinedAliasesSubtle: Story = {
  name: "Compat: outlined aliases subtle",
  render: () => (
    <>
      <Alert.Root data-testid="v-subtle" colorPalette="info" variant="subtle">
        <Alert.Title>subtle</Alert.Title>
      </Alert.Root>
      <Alert.Root
        data-testid="v-outlined"
        colorPalette="info"
        variant="outlined"
      >
        <Alert.Title>outlined</Alert.Title>
      </Alert.Root>
    </>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("outlined renders identically to subtle", async () => {
      const s = getComputedStyle(canvas.getByTestId("v-subtle"));
      const o = getComputedStyle(canvas.getByTestId("v-outlined"));
      await expect(o.backgroundColor).toBe(s.backgroundColor);
      await expect(o.borderTopWidth).toBe(s.borderTopWidth);
      await expect(o.borderTopLeftRadius).toBe(s.borderTopLeftRadius);
    });
  },
};

export const NeutralStatus: Story = {
  args: {
    colorPalette: "neutral",
    "data-testid": "neutral-alert",
    children: <Alert.Title>Neutral status</Alert.Title>,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("neutral colorPalette renders", async () => {
      await expect(canvas.getByTestId("neutral-alert")).toBeInTheDocument();
    });
  },
};

export const InlineLayout: Story = {
  args: {
    colorPalette: "positive",
    layout: "inline",
    "data-testid": "inline-alert",
    children: (
      <>
        <Alert.Title>Inline title</Alert.Title>
        <Alert.Description>Inline description</Alert.Description>
      </>
    ),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const root = canvas.getByTestId("inline-alert");
    await step("inline layout uses a grid", async () => {
      await expect(getComputedStyle(root).display).toBe("grid");
    });
  },
};

export const RoleBehavior: Story = {
  name: "A11y: role default + override",
  render: () => (
    <>
      <Alert.Root data-testid="role-default" colorPalette="critical">
        <Alert.Title>default</Alert.Title>
      </Alert.Root>
      <Alert.Root data-testid="role-alert" colorPalette="critical" role="alert">
        <Alert.Title>assertive</Alert.Title>
      </Alert.Root>
      <Alert.Root
        data-testid="role-group"
        colorPalette="positive"
        role="group"
        aria-label="Feedback"
      >
        <Alert.Title>silent</Alert.Title>
      </Alert.Root>
    </>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("defaults to role=status (polite)", async () => {
      await expect(canvas.getByTestId("role-default")).toHaveAttribute(
        "role",
        "status"
      );
    });
    await step("role can be overridden to alert", async () => {
      await expect(canvas.getByTestId("role-alert")).toHaveAttribute(
        "role",
        "alert"
      );
    });
    await step("role=group silent mode is honored", async () => {
      await expect(canvas.getByTestId("role-group")).toHaveAttribute(
        "role",
        "group"
      );
    });
  },
};

export const CustomIcon: Story = {
  render: () => (
    <Alert.Root data-testid="custom-icon" colorPalette="info">
      <Alert.Icon>
        <Info data-testid="my-custom-icon" />
      </Alert.Icon>
      <Alert.Title>Custom icon</Alert.Title>
    </Alert.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("renders the consumer-provided icon", async () => {
      await expect(canvas.getByTestId("my-custom-icon")).toBeInTheDocument();
    });
  },
};

export const HideIcon: Story = {
  render: () => (
    <Alert.Root data-testid="hide-icon" colorPalette="info" hideIcon>
      <Alert.Title>No icon</Alert.Title>
    </Alert.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("renders no icon svg", async () => {
      const root = canvas.getByTestId("hide-icon");
      await expect(root.querySelector("svg")).toBeNull();
    });
  },
};

export const HideIconSuppressesCustom: Story = {
  render: () => (
    <Alert.Root data-testid="hide-custom" colorPalette="info" hideIcon>
      <Alert.Icon>
        <Info data-testid="should-not-render" />
      </Alert.Icon>
      <Alert.Title>No icon even when explicit</Alert.Title>
    </Alert.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("explicit Alert.Icon is suppressed", async () => {
      await expect(
        canvas.queryByTestId("should-not-render")
      ).not.toBeInTheDocument();
    });
  },
};

const mockDismissibleProp = fn();
export const DismissibleProp: Story = {
  name: "Dismiss: dismissible prop",
  args: {
    colorPalette: "info",
    dismissible: true,
    onDismiss: mockDismissibleProp,
    "data-testid": "dismissible-alert",
    children: <Alert.Title>Dismiss me</Alert.Title>,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("auto-renders a single dismiss button", async () => {
      const buttons = canvas.getAllByRole("button", { name: "Dismiss" });
      await expect(buttons).toHaveLength(1);
    });
    await step("calls onDismiss when pressed", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Dismiss" }));
      await expect(mockDismissibleProp).toHaveBeenCalledTimes(1);
    });
  },
};

export const ManualDismissWins: Story = {
  name: "Dismiss: manual slot wins over dismissible",
  args: {
    colorPalette: "info",
    dismissible: true,
    onDismiss: fn(),
    "data-testid": "manual-dismiss",
    children: (
      <>
        <Alert.Title>Manual dismiss</Alert.Title>
        <Alert.DismissButton onPress={fn()} data-testid="manual-btn" />
      </>
    ),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("renders exactly one dismiss button", async () => {
      const buttons = canvas.getAllByRole("button", { name: "Dismiss" });
      await expect(buttons).toHaveLength(1);
    });
  },
};

export const TitleRendersHeading: Story = {
  name: "Semantics: Title Heading",
  render: () => (
    <>
      <Alert.Root data-testid="title-default" colorPalette="info">
        <Alert.Title>Default title</Alert.Title>
      </Alert.Root>
      <Alert.Root data-testid="title-h2" colorPalette="info">
        <Alert.Title as="h2">Heading title</Alert.Title>
      </Alert.Root>
    </>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Title defaults to non-heading element", async () => {
      await expect(canvas.getByText("Default title").tagName).toBe("P");
    });
    await step("Title can be promoted to a heading via as", async () => {
      await expect(canvas.getByText("Heading title").tagName).toBe("H2");
    });
    await step(
      "Title renders at body size (16px), not heading xl",
      async () => {
        const titleEl = canvas.getByText("Default title");
        await expect(getComputedStyle(titleEl).fontSize).toBe("16px");
      }
    );
  },
};

export const DismissButtonVariantOverride: Story = {
  name: "Dismiss: consumer variant reaches the button",
  render: () => (
    <>
      <Alert.Root data-testid="db-default" colorPalette="info">
        <Alert.Title>Default dismiss</Alert.Title>
        <Alert.DismissButton data-testid="btn-default" onPress={fn()} />
      </Alert.Root>
      <Alert.Root data-testid="db-solid" colorPalette="info">
        <Alert.Title>Solid dismiss</Alert.Title>
        <Alert.DismissButton
          data-testid="btn-solid"
          variant="solid"
          onPress={fn()}
        />
      </Alert.Root>
    </>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("variant override changes the button background", async () => {
      // Default dismiss is "ghost" (transparent); "solid" must differ.
      const def = getComputedStyle(canvas.getByTestId("btn-default"));
      const solid = getComputedStyle(canvas.getByTestId("btn-solid"));
      await expect(solid.backgroundColor).not.toBe(def.backgroundColor);
    });
  },
};

export const EmphasisShowcase: Story = {
  name: "Showcase: Emphasis × Status",
  render: () => (
    <Stack direction="column" gap="400" alignItems="flex-start">
      {(["info", "positive", "warning", "critical", "neutral"] as const).map(
        (cp) => (
          <Stack key={cp} direction="row" gap="400" width="100%">
            {variants.map((variant) => (
              <Alert.Root
                key={`${cp}-${variant}`}
                colorPalette={cp}
                variant={variant}
              >
                <Alert.Title>
                  {cp} / {variant as string}
                </Alert.Title>
                <Alert.Description>Description.</Alert.Description>
              </Alert.Root>
            ))}
          </Stack>
        )
      )}
    </Stack>
  ),
};

export const BannerLayout: Story = {
  name: "Layout: Banner",
  args: {
    colorPalette: "warning",
    layout: "banner",
    variant: "solid",
    dismissible: true,
    onDismiss: fn(),
    "data-testid": "banner-alert",
    children: (
      <>
        <Alert.Title>Scheduled maintenance</Alert.Title>
        <Alert.Description>
          The system will be unavailable at 02:00 UTC.
        </Alert.Description>
      </>
    ),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const root = canvas.getByTestId("banner-alert");
    await step("banner spans full width with no radius", async () => {
      await expect(getComputedStyle(root).borderTopLeftRadius).toBe("0px");
    });
  },
};

// --- Migrated from the former FeedbackCard pattern (agent confirmation flows) ---

const onApproveUndo = fn();
export const InlineApproveConfirmation: Story = {
  name: "Inline: Approve confirmation",
  render: () => (
    <Alert.Root
      data-testid="approve"
      layout="inline"
      colorPalette="positive"
      role="group"
      aria-label="Suggestion approved"
      hideIcon
    >
      <Alert.Title>Suggestion approved</Alert.Title>
      <Alert.Description>
        Applied the recommended discount to 3 products.
      </Alert.Description>
      <Alert.Actions>
        <Button variant="outline" onPress={onApproveUndo}>
          Undo
        </Button>
      </Alert.Actions>
    </Alert.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("renders the confirmation copy and undo action", async () => {
      await expect(canvas.getByText("Suggestion approved")).toBeInTheDocument();
      await expect(
        canvas.getByRole("button", { name: /undo/i })
      ).toBeInTheDocument();
    });
    await step("the group has no live-region role", async () => {
      await expect(canvas.getByTestId("approve")).toHaveAttribute(
        "role",
        "group"
      );
    });
    await step("undo action fires", async () => {
      await userEvent.click(canvas.getByRole("button", { name: /undo/i }));
      await expect(onApproveUndo).toHaveBeenCalledTimes(1);
    });
  },
};

const onRejectUndo = fn();
export const InlineRejectConfirmation: Story = {
  name: "Inline: Reject confirmation",
  render: () => (
    <Alert.Root
      data-testid="reject"
      layout="inline"
      colorPalette="critical"
      role="group"
      aria-label="Suggestion rejected"
      hideIcon
    >
      <Alert.Title>Suggestion rejected</Alert.Title>
      <Alert.Description>No changes were applied.</Alert.Description>
      <Alert.Actions>
        <Button variant="outline" onPress={onRejectUndo}>
          Undo
        </Button>
      </Alert.Actions>
    </Alert.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("reject action fires", async () => {
      await userEvent.click(canvas.getByRole("button", { name: /undo/i }));
      await expect(onRejectUndo).toHaveBeenCalledTimes(1);
    });
  },
};
