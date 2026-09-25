import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, fn } from "storybook/test";
import {
  Alert,
  type AlertProps,
  Button,
  Stack,
  RadioInput,
  Text,
} from "@commercetools/nimbus";
import { Info } from "@commercetools/nimbus-icons";

const variants: AlertProps["variant"][] = ["flat", "outlined", "accent-start"];
const buttonVariants = ["solid", "subtle", "outline", "ghost", "link"] as const;
const smokeColorPalettes: AlertProps["colorPalette"][] = [
  "neutral",
  "primary",
  "critical",
  "info",
  "warning",
  "positive",
];

const smokeContent: Record<
  string,
  { title: string; description: string; action: string }
> = {
  neutral: {
    title: "Sync In Progress",
    description: "We're updating your inventory. This can take a few minutes.",
    action: "View Details",
  },
  primary: {
    title: "New Workspace Available",
    description: "Your team can now collaborate on catalogs in one place.",
    action: "Take a Tour",
  },
  critical: {
    title: "Payment Failed",
    description:
      "We couldn't charge your card. Update your billing details to continue.",
    action: "Retry",
  },
  info: {
    title: "Update Available",
    description: "A new version is ready. Reload to get the latest features.",
    action: "Reload",
  },
  warning: {
    title: "Storage Almost Full",
    description:
      "You've used 90% of your storage. Upgrade to avoid interruptions.",
    action: "Upgrade",
  },
  positive: {
    title: "Changes Published",
    description: "Your catalog is live and visible to customers.",
    action: "View",
  },
};

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

const px = (value: string) => parseFloat(value) || 0;

const slot = (root: HTMLElement, name: string) =>
  root.querySelector<HTMLElement>(`.nimbus-alert__${name}`);

const centreY = (el: Element) => {
  const { top, bottom } = el.getBoundingClientRect();
  return (top + bottom) / 2;
};

const firstLineCentreY = (el: HTMLElement) => {
  const style = getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  const contentTop = rect.top + px(style.borderTopWidth) + px(style.paddingTop);
  return contentTop + px(style.lineHeight) / 2;
};

const contentBox = (root: HTMLElement) => {
  const style = getComputedStyle(root);
  const rect = root.getBoundingClientRect();
  const top = rect.top + px(style.borderTopWidth) + px(style.paddingTop);
  const bottom =
    rect.bottom - px(style.borderBottomWidth) - px(style.paddingBottom);
  return {
    top,
    bottom,
    centreY: (top + bottom) / 2,
    left: rect.left + px(style.borderLeftWidth) + px(style.paddingLeft),
    right: rect.right - px(style.borderRightWidth) - px(style.paddingRight),
  };
};

const expectAligned = (actual: number, expected: number) =>
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(0.5);

const sizingAssertions = (alert: HTMLElement) => {
  const rootStyle = getComputedStyle(alert);

  for (const name of ["title", "description"] as const) {
    const el = slot(alert, name);
    if (!el) continue;
    const style = getComputedStyle(el);
    expect(style.fontSize).toBe(rootStyle.fontSize);
    expect(style.lineHeight).toBe(rootStyle.lineHeight);
  }

  const firstText = slot(alert, "title") ?? slot(alert, "description")!;
  const firstLine = firstLineCentreY(firstText);

  const icon = slot(alert, "icon")!;
  expectAligned(centreY(icon), firstLine);

  const glyph = icon.querySelector("svg")!;
  const expectedGlyph = px(rootStyle.fontSize) * 1.25;
  expectAligned(glyph.getBoundingClientRect().width, expectedGlyph);
  expectAligned(glyph.getBoundingClientRect().height, expectedGlyph);

  const dismiss = slot(alert, "dismissButton");
  if (dismiss) expectAligned(centreY(dismiss), firstLine);
};

// Mock function for dismiss button onPress
const mockOnDismiss = fn();

/**
 * Base story
 * Demonstrates the most basic implementation with all parts.
 * Uses the args pattern for dynamic control panel inputs.
 * Includes interaction tests.
 */
export const Base: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
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

/** A title with no description. */
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

/** A description with no title. */
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

/** A title and actions, with no description. */
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
/** Title, description and dismiss button, with no actions. */
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

/** Omitting `variant` renders the flush, unstyled alert; every variant shares one box. */
export const EmphasisContract: Story = {
  name: "Compat: default emphasis and a stable box",
  render: () => (
    <Stack direction="column" gap="400" alignItems="flex-start">
      <Alert.Root data-testid="default-alert" colorPalette="info">
        <Alert.Title>Default emphasis</Alert.Title>
      </Alert.Root>

      {variants.map((variant) => (
        <Alert.Root
          key={variant as string}
          data-testid={`box-${variant as string}`}
          colorPalette="info"
          variant={variant}
        >
          <Alert.Title>{variant as string}</Alert.Title>
        </Alert.Root>
      ))}
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Omitting variant renders no surface and no padding",
      async () => {
        const style = getComputedStyle(canvas.getByTestId("default-alert"));
        await expect(style.backgroundColor).toBe("rgba(0, 0, 0, 0)");
        await expect(style.boxShadow).toBe("none");
        await expect(style.paddingTop).toBe("0px");
        await expect(style.paddingLeft).toBe("0px");
      }
    );

    await step("Every emphasis variant has the same box", async () => {
      const boxes = variants.map((variant) =>
        getComputedStyle(canvas.getByTestId(`box-${variant as string}`))
      );
      const [first] = boxes;

      await expect(first.paddingTop).not.toBe("0px");
      for (const box of boxes) {
        await expect(box.paddingTop).toBe(first.paddingTop);
        await expect(box.paddingBottom).toBe(first.paddingBottom);
        await expect(box.paddingLeft).toBe(first.paddingLeft);
        await expect(box.paddingRight).toBe(first.paddingRight);
        await expect(box.borderTopWidth).toBe("0px");
        await expect(box.borderTopLeftRadius).toBe(first.borderTopLeftRadius);
      }
    });

    await step("Content starts at the same place in every one", async () => {
      const lefts = variants.map((variant) => {
        const root = canvas.getByTestId(`box-${variant as string}`);
        return slot(root, "title")!.getBoundingClientRect().left;
      });

      for (const left of lefts) expectAligned(left, lefts[0]);
    });
  },
};

/** Block content inside `Alert.Description`. */
export const BlockContentInDescription: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  name: "Composition: Block Content in Description",
  args: {
    colorPalette: "warning",
    "data-testid": "alert-block-content",
    children: (
      <>
        <Alert.Title>Conflicting changes</Alert.Title>
        <Alert.Description>
          <Stack gap="200">
            <Text fontWeight="600">Attempted</Text>
            <ul>
              <li>discountValue</li>
            </ul>
          </Stack>
        </Alert.Description>
      </>
    ),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const alert = canvas.getByTestId("alert-block-content");
    const description = slot(alert, "description")!;

    await step("Description is not a paragraph", async () => {
      await expect(description.tagName).toBe("DIV");
    });

    await step("Block content stays inside the description", async () => {
      await expect(description.querySelector("div")).not.toBeNull();
      await expect(description.querySelector("ul")).not.toBeNull();
      await expect(description.querySelector("li")).not.toBeNull();
    });

    await step("No paragraph nested inside a paragraph", async () => {
      const nestedParagraph = description.querySelector("p");
      await expect(nestedParagraph).not.toBeNull();
      await expect(nestedParagraph!.closest("p")).toBe(nestedParagraph);
    });
  },
};

/** `Alert.Description` with `as="p"`. */
export const DescriptionAsParagraph: Story = {
  name: "Composition: Description as Paragraph",
  args: {
    colorPalette: "info",
    "data-testid": "alert-desc-as-p",
    children: <Alert.Description as="p">A single paragraph.</Alert.Description>,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const alert = canvas.getByTestId("alert-desc-as-p");

    await step("Renders the requested element", async () => {
      await expect(slot(alert, "description")!.tagName).toBe("P");
    });
  },
};

/** The `accent-start` variant, left-to-right and right-to-left. */
export const AccentStart: Story = {
  name: "Variant: accent-start",
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Stack direction="column" gap="400" alignItems="stretch">
      {(["info", "positive", "warning", "critical"] as const).map((cp) => (
        <Alert.Root
          key={cp}
          data-testid={`accent-${cp}`}
          colorPalette={cp}
          variant="accent-start"
        >
          <Alert.Title>{cp}</Alert.Title>
          <Alert.DismissButton onPress={() => {}} />
          <Alert.Description>
            The card and the text stay neutral. The bar, the icon and the button
            carry the status color.
          </Alert.Description>
          <Alert.Actions>
            <Button variant="outline">Undo</Button>
          </Alert.Actions>
        </Alert.Root>
      ))}
      <div dir="rtl">
        <Alert.Root
          data-testid="accent-rtl"
          colorPalette="info"
          variant="accent-start"
        >
          <Alert.Title>right-to-left</Alert.Title>
        </Alert.Root>
      </div>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const palettes = ["info", "positive", "warning", "critical"] as const;
    const roots = palettes.map((cp) => canvas.getByTestId(`accent-${cp}`));

    await step("the surface is neutral, not status-tinted", async () => {
      const [first, ...rest] = roots.map(
        (r) => getComputedStyle(r).backgroundColor
      );
      for (const bg of rest) await expect(bg).toBe(first);
    });

    await step("the text is neutral too", async () => {
      const titles = roots.map(
        (r) => getComputedStyle(slot(r, "title")!).color
      );
      const descriptions = roots.map(
        (r) => getComputedStyle(slot(r, "description")!).color
      );
      for (const color of titles) await expect(color).toBe(titles[0]);
      for (const color of descriptions)
        await expect(color).toBe(descriptions[0]);
    });

    await step("the icon still carries the status color", async () => {
      const iconColors = roots.map(
        (r) => getComputedStyle(slot(r, "icon")!.querySelector("svg")!).color
      );
      await expect(new Set(iconColors).size).toBe(palettes.length);
    });

    await step("the action button carries it too", async () => {
      const actionColors = roots.map(
        (r) =>
          getComputedStyle(slot(r, "actions")!.querySelector(".nimbus-button")!)
            .color
      );
      await expect(new Set(actionColors).size).toBe(palettes.length);
    });

    await step("the dismiss button stays neutral", async () => {
      const dismissColors = roots.map(
        (r) =>
          getComputedStyle(
            slot(r, "dismissButton")!.querySelector(".nimbus-button")!
          ).color
      );
      await expect(new Set(dismissColors).size).toBe(1);
    });

    await step("the bar is an inset shadow on the leading edge", async () => {
      for (const root of roots) {
        const shadow = getComputedStyle(root).boxShadow;
        await expect(shadow).toContain("inset");
        await expect(shadow).toMatch(/(^|\s)4px 0px 0px 0px inset/);
      }
    });

    await step("the bar mirrors under dir=rtl", async () => {
      const shadow = getComputedStyle(
        canvas.getByTestId("accent-rtl")
      ).boxShadow;
      await expect(shadow).toMatch(/-4px 0px 0px 0px inset/);
    });
  },
};

const mockDismissPress = fn();

/** Custom, hidden and automatic icons. */
export const Icon: Story = {
  name: "Icon: custom, hidden, hidden over custom",
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Stack direction="column" gap="400" alignItems="flex-start">
      <Alert.Root data-testid="custom-icon" colorPalette="info">
        <Alert.Icon>
          <Info data-testid="my-custom-icon" />
        </Alert.Icon>
        <Alert.Title>Custom icon</Alert.Title>
      </Alert.Root>

      <Alert.Root data-testid="hide-icon" colorPalette="info" hideIcon>
        <Alert.Title>No icon</Alert.Title>
      </Alert.Root>

      <Alert.Root data-testid="hide-custom" colorPalette="info" hideIcon>
        <Alert.Icon>
          <Info data-testid="should-not-render" />
        </Alert.Icon>
        <Alert.Title>No icon even when explicit</Alert.Title>
      </Alert.Root>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("renders the consumer-provided icon", async () => {
      await expect(canvas.getByTestId("my-custom-icon")).toBeInTheDocument();
    });

    await step("hideIcon renders no icon svg", async () => {
      await expect(
        canvas.getByTestId("hide-icon").querySelector("svg")
      ).toBeNull();
    });

    await step("hideIcon suppresses an explicit Alert.Icon", async () => {
      await expect(
        canvas.queryByTestId("should-not-render")
      ).not.toBeInTheDocument();
    });
  },
};

const HideIconToggle = () => {
  const [hideIcon, setHideIcon] = useState(false);
  return (
    <Stack direction="column" gap="400" alignItems="flex-start">
      <Button onPress={() => setHideIcon((v) => !v)}>Toggle icon</Button>
      <Alert.Root
        data-testid="toggle-alert"
        colorPalette="info"
        hideIcon={hideIcon}
      >
        <>
          <Alert.Title>Toggling the icon</Alert.Title>
          <Alert.Description>
            <input aria-label="Draft" />
          </Alert.Description>
        </>
      </Alert.Root>
    </Stack>
  );
};

/** Toggling `hideIcon` keeps the children mounted. */
export const HideIconToggleKeepsChildren: Story = {
  name: "Icon: toggling hideIcon keeps children mounted",
  render: () => <HideIconToggle />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: "Draft" });

    await step("typed text survives hiding and showing the icon", async () => {
      await userEvent.type(input, "unsaved");
      await userEvent.click(
        canvas.getByRole("button", { name: "Toggle icon" })
      );
      await expect(
        canvas.getByTestId("toggle-alert").querySelector("svg")
      ).toBeNull();
      await userEvent.click(
        canvas.getByRole("button", { name: "Toggle icon" })
      );

      const after = canvas.getByRole("textbox", { name: "Draft" });
      await expect(after).toBe(input);
      await expect(after).toHaveValue("unsaved");
    });
  },
};

/** Any Nimbus palette is accepted; palettes without a status icon use the neutral one. */
export const PaletteFallback: Story = {
  name: "Icon: fallback for non-status palettes",
  render: () => (
    <Stack direction="column" gap="400" alignItems="flex-start">
      <Alert.Root data-testid="palette-neutral" colorPalette="neutral">
        <Alert.Title>neutral</Alert.Title>
      </Alert.Root>
      <Alert.Root data-testid="palette-amber" colorPalette="amber">
        <Alert.Title>amber</Alert.Title>
      </Alert.Root>
      <Alert.Root
        data-testid="palette-responsive"
        colorPalette={{ base: "critical", md: "warning" }}
      >
        <Alert.Title>responsive critical</Alert.Title>
      </Alert.Root>
      <Alert.Root
        data-testid="palette-no-base"
        colorPalette={{ md: "critical" }}
      >
        <Alert.Title>responsive, no base</Alert.Title>
      </Alert.Root>
      <Alert.Root data-testid="palette-none">
        <Alert.Title>no palette</Alert.Title>
      </Alert.Root>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const iconMarkup = (id: string) =>
      slot(canvas.getByTestId(id), "icon")?.innerHTML;

    await step(
      "a palette without a status icon gets the neutral icon",
      async () => {
        await expect(iconMarkup("palette-amber")).toBeDefined();
        await expect(iconMarkup("palette-amber")).toBe(
          iconMarkup("palette-neutral")
        );
      }
    );

    await step(
      "a responsive palette takes role and icon from its base value",
      async () => {
        await expect(canvas.getByTestId("palette-responsive")).toHaveAttribute(
          "role",
          "alert"
        );
        await expect(iconMarkup("palette-responsive")).not.toBe(
          iconMarkup("palette-neutral")
        );
      }
    );

    await step(
      "a responsive palette without a base gets the neutral icon",
      async () => {
        await expect(canvas.getByTestId("palette-no-base")).toHaveAttribute(
          "role",
          "status"
        );
        await expect(iconMarkup("palette-no-base")).toBe(
          iconMarkup("palette-neutral")
        );
      }
    );

    await step("no palette renders no icon", async () => {
      await expect(iconMarkup("palette-none")).toBeUndefined();
    });
  },
};

/** `Alert.DismissButton` with the default and a custom variant. */
export const Dismiss: Story = {
  name: "Dismiss: composed button and variant override",
  render: () => (
    <Stack direction="column" gap="400" alignItems="flex-start">
      <Alert.Root data-testid="db-default" colorPalette="info">
        <Alert.Title>Default dismiss</Alert.Title>
        <Alert.DismissButton
          data-testid="btn-default"
          onPress={mockDismissPress}
        />
      </Alert.Root>

      <Alert.Root data-testid="db-solid" colorPalette="info">
        <Alert.Title>Solid dismiss</Alert.Title>
        <Alert.DismissButton
          data-testid="btn-solid"
          variant="solid"
          onPress={fn()}
        />
      </Alert.Root>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("the button carries a localized accessible name", async () => {
      const scope = within(canvas.getByTestId("db-default"));
      await expect(
        scope.getAllByRole("button", { name: "Dismiss" })
      ).toHaveLength(1);
    });

    await step("pressing it calls onPress", async () => {
      const scope = within(canvas.getByTestId("db-default"));
      await userEvent.click(scope.getByRole("button", { name: "Dismiss" }));
      await expect(mockDismissPress).toHaveBeenCalledTimes(1);
    });

    await step("a consumer variant reaches the button", async () => {
      const def = getComputedStyle(canvas.getByTestId("btn-default"));
      const solid = getComputedStyle(canvas.getByTestId("btn-solid"));
      await expect(solid.backgroundColor).not.toBe(def.backgroundColor);
    });
  },
};

/** Default and overridden `role` values. */
export const RoleBehavior: Story = {
  name: "A11y: role default + override",
  render: () => (
    <>
      <Alert.Root data-testid="role-default" colorPalette="warning">
        <Alert.Title>default</Alert.Title>
      </Alert.Root>
      <Alert.Root data-testid="role-critical" colorPalette="critical">
        <Alert.Title>critical default</Alert.Title>
      </Alert.Root>
      <Alert.Root data-testid="role-alert" colorPalette="warning" role="alert">
        <Alert.Title>assertive</Alert.Title>
      </Alert.Root>
      <Alert.Root
        data-testid="role-critical-status"
        colorPalette="critical"
        role="status"
      >
        <Alert.Title>critical, polite</Alert.Title>
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
    await step("critical defaults to role=alert (assertive)", async () => {
      await expect(canvas.getByTestId("role-critical")).toHaveAttribute(
        "role",
        "alert"
      );
    });
    await step("role can be overridden to alert", async () => {
      await expect(canvas.getByTestId("role-alert")).toHaveAttribute(
        "role",
        "alert"
      );
    });
    await step("critical can be overridden to status", async () => {
      await expect(canvas.getByTestId("role-critical-status")).toHaveAttribute(
        "role",
        "status"
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

/** `Alert.Title` renders a `div` by default and a heading with `as`. */
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
    await step("Title defaults to a non-heading element", async () => {
      await expect(canvas.getByText("Default title").tagName).toBe("DIV");
    });
    await step(
      "Title is not exposed as a heading to assistive tech",
      async () => {
        await expect(
          canvas.queryByRole("heading", { name: "Default title" })
        ).toBeNull();
      }
    );
    await step("Title can be promoted to a heading via as", async () => {
      await expect(canvas.getByText("Heading title").tagName).toBe("H2");
      await expect(
        canvas.getByRole("heading", { name: "Heading title", level: 2 })
      ).toBeInTheDocument();
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

/** Every variant on every palette. */
export const Variants: Story = {
  render: () => (
    <Stack direction="column" gap="400" alignItems="flex-start">
      {smokeColorPalettes.map((cp) => (
        <Stack key={cp as string} direction="row" gap="400" width="100%">
          {variants.map((variant) => (
            <Alert.Root
              key={`${cp as string}-${variant as string}`}
              colorPalette={cp}
              variant={variant}
            >
              <Alert.Title>
                {cp as string} / {variant as string}
              </Alert.Title>
              <Alert.Description>Description.</Alert.Description>
              <Alert.DismissButton onPress={() => {}} />
            </Alert.Root>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};

/** A full-bleed page banner built with style props. */
export const FullBleedBanner: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  name: "Composition: Full-bleed Banner",
  args: {
    colorPalette: "warning",
    variant: "outlined",
    "data-testid": "banner-alert",
    borderRadius: "0",
    borderInline: "none",
    paddingInline: "600",
    children: (
      <>
        <Alert.Title>Scheduled maintenance</Alert.Title>
        <Alert.Description>
          The system will be unavailable at 02:00 UTC.
        </Alert.Description>
        <Alert.DismissButton onPress={fn()} />
      </>
    ),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const root = canvas.getByTestId("banner-alert");
    await step("style props produce the full-bleed treatment", async () => {
      await expect(getComputedStyle(root).borderTopLeftRadius).toBe("0px");
      await expect(getComputedStyle(root).paddingInlineStart).toBe("24px");
    });
  },
};

const onApproveUndo = fn();
const onRejectUndo = fn();

/** Icon and dismiss alignment with larger, smaller and wrapping text. */
export const Sizing: Story = {
  name: "Sizing: larger, smaller, wrapping",
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Stack direction="column" gap="400" alignItems="flex-start">
      <Alert.Root
        data-testid="alert-larger-text"
        colorPalette="info"
        variant="outlined"
        fontSize="600"
      >
        <Alert.Title>Larger text</Alert.Title>
        <Alert.Description>
          The icon grew with the text, because its box is one line tall rather
          than a fixed number of pixels.
        </Alert.Description>
        <Alert.DismissButton onPress={fn()} />
      </Alert.Root>

      <Alert.Root
        data-testid="alert-smaller-text"
        colorPalette="warning"
        variant="outlined"
        fontSize="300"
      >
        <Alert.Title>Smaller text</Alert.Title>
        <Alert.Description>
          The same arrangement at a smaller text size, with no pixel value to go
          stale.
        </Alert.Description>
      </Alert.Root>

      <Alert.Root
        data-testid="alert-wrapping"
        colorPalette="critical"
        variant="outlined"
        maxWidth="4800"
      >
        <Alert.Description>
          This description is long enough that it has to wrap onto several
          lines, which is the case that tells the difference between aligning
          the icon to the first line of text and centring it against the whole
          block of text.
        </Alert.Description>
        <Alert.DismissButton onPress={fn()} />
      </Alert.Root>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Icon and dismiss button follow the larger text", async () => {
      sizingAssertions(canvas.getByTestId("alert-larger-text"));
    });

    await step("Icon follows the smaller text", async () => {
      sizingAssertions(canvas.getByTestId("alert-smaller-text"));
    });

    await step("Description actually wraps", async () => {
      const description = slot(
        canvas.getByTestId("alert-wrapping"),
        "description"
      )!;
      const lineHeight = parseFloat(getComputedStyle(description).lineHeight);
      await expect(description.getBoundingClientRect().height).toBeGreaterThan(
        lineHeight * 1.5
      );
    });

    await step(
      "Icon sits on the first line, not the block centre",
      async () => {
        const alert = canvas.getByTestId("alert-wrapping");
        const description = slot(alert, "description")!;

        sizingAssertions(alert);

        await expect(centreY(slot(alert, "icon")!)).toBeLessThan(
          centreY(description)
        );
      }
    );
  },
};

/** Alerts without an icon. */
export const NoIcon: Story = {
  name: "No icon: omitted palette and hideIcon",
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Stack direction="column" gap="400" alignItems="flex-start">
      <Alert.Root data-testid="alert-no-palette" variant="outlined">
        <Alert.Title>No color palette</Alert.Title>
        <Alert.Description>
          Without a palette there is no icon, and the text starts at the padding
          edge rather than being indented away from an empty column.
        </Alert.Description>
      </Alert.Root>

      <Alert.Root
        data-testid="alert-hide-icon"
        colorPalette="neutral"
        variant="outlined"
        hideIcon
      >
        <Alert.Title>Icon suppressed</Alert.Title>
        <Alert.Description>
          `neutral` supplies an icon, and `hideIcon` removes it again.
        </Alert.Description>
      </Alert.Root>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("an omitted palette renders no icon", async () => {
      await expect(
        slot(canvas.getByTestId("alert-no-palette"), "icon")
      ).toBeNull();
    });

    await step("hideIcon removes the palette's icon", async () => {
      await expect(
        slot(canvas.getByTestId("alert-hide-icon"), "icon")
      ).toBeNull();
    });

    await step("Text spans the full content box", async () => {
      const alert = canvas.getByTestId("alert-no-palette");
      const box = contentBox(alert);
      const title = slot(alert, "title")!.getBoundingClientRect();

      expectAligned(title.left, box.left);
      expectAligned(title.right, box.right);
    });
  },
};

/** Confirmations with `role="group"` and no icon. */
export const SilentConfirmations: Story = {
  name: "Silent: approve and reject confirmations",
  render: () => (
    <Stack direction="column" gap="400" alignItems="flex-start">
      <Alert.Root
        data-testid="approve"
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

      <Alert.Root
        data-testid="reject"
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
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const approve = within(canvas.getByTestId("approve"));
    const reject = within(canvas.getByTestId("reject"));

    await step("renders the confirmation copy and undo action", async () => {
      await expect(canvas.getByText("Suggestion approved")).toBeInTheDocument();
      await expect(
        approve.getByRole("button", { name: /undo/i })
      ).toBeInTheDocument();
    });

    await step("the group has no live-region role", async () => {
      await expect(canvas.getByTestId("approve")).toHaveAttribute(
        "role",
        "group"
      );
    });

    await step("approve undo action fires", async () => {
      await userEvent.click(approve.getByRole("button", { name: /undo/i }));
      await expect(onApproveUndo).toHaveBeenCalledTimes(1);
    });

    await step("reject undo action fires", async () => {
      await userEvent.click(reject.getByRole("button", { name: /undo/i }));
      await expect(onRejectUndo).toHaveBeenCalledTimes(1);
    });
  },
};

/** SmokeTest: every `variant` × `colorPalette` combination, with all slots. */
export const SmokeTest: Story = {
  tags: ["vrt"],
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  render: () => (
    <Stack direction="column" gap="400" width="100%">
      {smokeColorPalettes.map((colorPalette) => {
        const paletteLabel = String(colorPalette);
        const content = smokeContent[paletteLabel];
        return (
          <Stack
            key={paletteLabel}
            direction="row"
            gap="400"
            alignItems="stretch"
            flexWrap="wrap"
            width="100%"
          >
            {variants.map((variant) => {
              const variantLabel = String(variant);
              return (
                <Alert.Root
                  key={variantLabel}
                  data-testid="smoke-alert"
                  variant={variant}
                  colorPalette={colorPalette}
                  role="group"
                  aria-label={`${paletteLabel} ${variantLabel}`}
                  flex="1 1 260px"
                >
                  <Alert.Title>{content.title}</Alert.Title>
                  <Alert.Description>{content.description}</Alert.Description>
                  <Alert.DismissButton onPress={() => {}} />
                  <Alert.Actions>
                    {buttonVariants.map((buttonVariant) => (
                      <Button key={buttonVariant} variant={buttonVariant}>
                        {buttonVariant.charAt(0).toUpperCase() +
                          buttonVariant.slice(1)}
                      </Button>
                    ))}
                  </Alert.Actions>
                </Alert.Root>
              );
            })}
          </Stack>
        );
      })}
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("every variant × colorPalette combination renders", async () => {
      await expect(canvas.getAllByTestId("smoke-alert")).toHaveLength(
        smokeColorPalettes.length * variants.length
      );
    });
  },
};
