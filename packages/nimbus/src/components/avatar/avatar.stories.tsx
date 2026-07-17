import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Avatar,
  type AvatarProps,
  Button,
  Stack,
  Text,
  Tooltip,
} from "@commercetools/nimbus";
import { AutoAwesome } from "@commercetools/nimbus-icons";
import { within, expect, waitFor } from "storybook/test";
import { DisplayColorPalettes } from "@/utils/display-color-palettes";

// English default for the `avatarLabelGeneric` i18n key — used when no name
// is available to interpolate into the standard avatarLabel template.
const GENERIC_LABEL = "Generic user avatar";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
};

export default meta;
type Story = StoryObj<typeof Avatar>;

const sizes: AvatarProps["size"][] = ["md", "xs", "2xs"];

const variants: AvatarProps["variant"][] = ["subtle", "solid"];

// Served locally from Storybook's staticDirs (`public/`) for consistent Chromatic runs.
// Photo from Unsplash (License: free commercial use, no attribution required).
const avatarImg = "/avatar-demo.jpg";

// Nonexistent local path (served from staticDirs `public/`) that 404s instantly
// to exercise the image-error fallback, without an external fetch Chromatic can't reach.
const brokenImageSrc = "/broken-avatar.jpg";

export const Base: Story = {
  args: {
    firstName: "John",
    lastName: "Doe",
    src: avatarImg,
    ["aria-label"]: "avatar",
    alt: "avatar",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByLabelText("avatar");

    await step("Uses a <figure> element by default", async () => {
      await expect(avatar.tagName).toBe("FIGURE");
    });

    await step("Does not use the generic avatar label", async () => {
      // Regression guard: when names are present, the standard avatarLabel
      // template must be used (overridden here by the explicit aria-label
      // prop), not the generic fallback.
      await expect(avatar.getAttribute("aria-label")).not.toBe(GENERIC_LABEL);
    });
  },
};

export const SizesWithImages: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  args: {
    firstName: "John",
    lastName: "Doe",
    src: avatarImg,
    ["aria-label"]: "avatar",
    alt: "avatar",
  },
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {sizes.map((size) => (
          <Avatar key={size as string} {...args} size={size} alt="avatar" />
        ))}
      </Stack>
    );
  },
};

export const Variants: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  args: {
    firstName: "John",
    lastName: "Doe",
  },
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {variants.map((variant) => (
          <Avatar
            key={variant as string}
            {...args}
            variant={variant}
            aria-label={`${variant as string} avatar`}
          />
        ))}
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Each variant renders the initials", async () => {
      for (const variant of variants) {
        const avatar = canvas.getByLabelText(`${variant as string} avatar`);
        await expect(avatar).toHaveTextContent("JD");
      }
    });

    await step(
      "subtle and solid render visibly different backgrounds",
      async () => {
        const subtle = canvas.getByLabelText("subtle avatar");
        const solid = canvas.getByLabelText("solid avatar");
        await expect(getComputedStyle(subtle).backgroundColor).not.toBe(
          getComputedStyle(solid).backgroundColor
        );
      }
    );
  },
};

export const BaseWithInitials: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  args: {
    firstName: "John",
    lastName: "Doe",
    ["aria-label"]: "avatar",
    alt: "avatar",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByLabelText("avatar");
    await step(
      "Take first letters of first and last name to make initials",
      async () => {
        await expect(avatar).toHaveTextContent("JD");
      }
    );

    await step("Does not render the Person icon fallback", async () => {
      // Regression guard: when initials can be derived, the Person icon
      // must not be rendered.
      await expect(avatar.querySelector("svg")).toBeNull();
    });
  },
};

export const SizesWithInitials: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  args: {
    firstName: "Michael",
    lastName: "Douglas",
    ["aria-label"]: "avatar",
    alt: "avatar",
  },
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {sizes.map((size) => (
          <Avatar key={size as string} {...args} size={size} alt="avatar" />
        ))}
      </Stack>
    );
  },
};

/**
 * Showcase Possible Color Palettes
 */
export const ColorPalettes: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  args: {
    firstName: "Michael",
    lastName: "Douglas",
    ["aria-label"]: "avatar",
    alt: "avatar",
  },
  render: (args) => {
    return (
      <DisplayColorPalettes>
        {(palette) => (
          <Tooltip.Root>
            <Button unstyled asChild>
              <Avatar
                {...args}
                colorPalette={palette}
                alt={`${palette} avatar`}
              />
            </Button>
            <Tooltip.Content>{palette}</Tooltip.Content>
          </Tooltip.Root>
        )}
      </DisplayColorPalettes>
    );
  },
};

export const ImageErrorFallback: Story = {
  args: {
    firstName: "Jane",
    lastName: "Smith",
    src: brokenImageSrc,
    ["aria-label"]: "Jane Smith avatar",
    alt: "Jane Smith",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByLabelText("Jane Smith avatar");

    await step(
      "Should fall back to initials when image fails to load",
      async () => {
        // Wait for the image error to be handled
        await waitFor(
          async () => {
            await expect(avatar).toHaveTextContent("JS");
          },
          { timeout: 3000 }
        );
      }
    );

    await step("Should hide the img element after error", async () => {
      const img = avatar.querySelector("img");
      await expect(img).not.toBeNull(); // Image element should still exist
      await expect(img).toHaveStyle("display: none"); // But should be hidden
    });
  },
};

// ============================================================
// Edge-case stories: defensive handling of missing/empty/whitespace/Unicode
// firstName and lastName values. See spec:
// openspec/specs/nimbus-avatar/spec.md (post-merge) and the OpenSpec change
// 'harden-avatar-edge-case-names' for the locked-in behavior.
// ============================================================

export const MissingNames: Story = {
  args: {},
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByLabelText(GENERIC_LABEL);

    await step(
      "Renders the Person icon when both names are undefined",
      async () => {
        const svg = avatar.querySelector("svg");
        await expect(svg).not.toBeNull();
      }
    );

    await step("Renders no text content", async () => {
      await expect(avatar.textContent?.trim() ?? "").toBe("");
    });

    await step("Uses the generic localized aria-label", async () => {
      await expect(avatar.getAttribute("aria-label")).toBe(GENERIC_LABEL);
    });
  },
};

export const EmptyNames: Story = {
  args: { firstName: "", lastName: "" },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByLabelText(GENERIC_LABEL);

    await step(
      "Renders the Person icon when both names are empty strings",
      async () => {
        await expect(avatar.querySelector("svg")).not.toBeNull();
        await expect(avatar.textContent?.trim() ?? "").toBe("");
      }
    );
  },
};

export const WhitespaceNames: Story = {
  args: { firstName: "  ", lastName: "\t" },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByLabelText(GENERIC_LABEL);

    await step(
      "Renders the Person icon when both names are whitespace only",
      async () => {
        await expect(avatar.querySelector("svg")).not.toBeNull();
        await expect(avatar.textContent?.trim() ?? "").toBe("");
      }
    );
  },
};

export const OnlyFirstName: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  args: { firstName: "John" },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByLabelText(/John/);

    await step(
      "Renders single initial 'J' when only firstName is provided",
      async () => {
        await expect(avatar.textContent?.trim()).toBe("J");
        await expect(avatar.querySelector("svg")).toBeNull();
      }
    );

    await step("Uses the trimmed name in the aria-label", async () => {
      const label = avatar.getAttribute("aria-label") ?? "";
      await expect(label).toContain("John");
      // Guard against doubled spaces and trailing whitespace introduced
      // by a missing lastName being rendered as empty in the template.
      await expect(label).not.toMatch(/ {2,}/);
      await expect(label.endsWith(" ")).toBe(false);
    });
  },
};

export const OnlyLastName: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  args: { lastName: "Doe" },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByLabelText(/Doe/);

    await step(
      "Renders single initial 'D' when only lastName is provided",
      async () => {
        await expect(avatar.textContent?.trim()).toBe("D");
        await expect(avatar.querySelector("svg")).toBeNull();
      }
    );

    await step("Uses the trimmed name in the aria-label", async () => {
      const label = avatar.getAttribute("aria-label") ?? "";
      await expect(label).toContain("Doe");
      // Guard against doubled spaces (would happen if missing firstName
      // were rendered as an empty string in the template) and trailing
      // whitespace.
      await expect(label).not.toMatch(/ {2,}/);
      await expect(label.endsWith(" ")).toBe(false);
    });
  },
};

export const LeadingWhitespaceName: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  args: { firstName: " John", lastName: "Doe" },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByLabelText(/John Doe/);

    await step("Trims whitespace before extracting initials", async () => {
      await expect(avatar.textContent?.trim()).toBe("JD");
    });

    await step("aria-label has no leading or doubled spaces", async () => {
      const label = avatar.getAttribute("aria-label") ?? "";
      await expect(label).not.toContain("  ");
      await expect(label).toContain("John Doe");
    });
  },
};

export const EmojiName: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  args: { firstName: "\u{1F468}", lastName: "Doe" },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByRole("figure");

    await step(
      "Preserves the full emoji codepoint (no broken surrogate)",
      async () => {
        // Expect the full 👨 codepoint plus 'D'. A buggy charAt-based
        // extractor would render a lone surrogate which renders as U+FFFD.
        await expect(avatar.textContent?.trim()).toBe("\u{1F468}D");
      }
    );
  },
};

export const LowercaseName: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  args: { firstName: "john", lastName: "doe" },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByRole("figure");

    await step("Uppercases initials regardless of input case", async () => {
      await expect(avatar.textContent?.trim()).toBe("JD");
    });
  },
};

export const ImageErrorWithMissingNames: Story = {
  args: {
    src: brokenImageSrc,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByLabelText(GENERIC_LABEL);

    await step(
      "Falls back to Person icon when image errors AND names are missing",
      async () => {
        await waitFor(
          async () => {
            await expect(avatar.querySelector("svg")).not.toBeNull();
          },
          { timeout: 3000 }
        );
        await expect(avatar.textContent?.trim() ?? "").toBe("");
      }
    );

    await step("Hides the broken image element", async () => {
      const img = avatar.querySelector("img");
      await expect(img).not.toBeNull();
      await expect(img).toHaveStyle("display: none");
    });
  },
};

/**
 * Consolidated snapshot of every fallback path, rendered side by side:
 * undefined / empty / whitespace names (Person icon), plus a broken image with
 * and without names (initials / Person icon). Each cell exercises a distinct
 * path, so a regression in any one still surfaces here; the individual stories
 * above keep the per-path behavioral assertions.
 */
export const AllFallbacks: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => {
    const groups = [
      {
        heading: "No image",
        cases: [
          {
            label: "With names",
            node: <Avatar firstName="John" lastName="Doe" />,
          },
          { label: "Missing names (undefined)", node: <Avatar /> },
          { label: "Empty names", node: <Avatar firstName="" lastName="" /> },
          {
            label: "Whitespace names",
            node: <Avatar firstName="  " lastName={"\t"} />,
          },
        ],
      },
      {
        heading: "Broken image",
        cases: [
          {
            label: "With names",
            node: (
              <Avatar
                src={brokenImageSrc}
                firstName="Jane"
                lastName="Smith"
                alt="Jane Smith"
              />
            ),
          },
          { label: "No names", node: <Avatar src={brokenImageSrc} /> },
        ],
      },
    ];
    return (
      <Stack direction="column" gap="800" alignItems="start">
        {groups.map(({ heading, cases }) => (
          <Stack key={heading} direction="column" gap="400" alignItems="start">
            <Text fontWeight="700">{heading}</Text>
            {cases.map(({ label, node }) => (
              <Stack key={label} direction="row" gap="400" alignItems="center">
                {node}
                <Text>{label}</Text>
              </Stack>
            ))}
          </Stack>
        ))}
      </Stack>
    );
  },
  // Wait for both broken images to error out and hide before the snapshot,
  // otherwise Chromatic may capture the pre-error state.
  play: async ({ canvasElement }) => {
    await waitFor(
      () => {
        const imgs = Array.from(canvasElement.querySelectorAll("img"));
        expect(imgs.length).toBe(2);
        imgs.forEach((img) =>
          expect(getComputedStyle(img).display).toBe("none")
        );
      },
      { timeout: 3000 }
    );
  },
};

/**
 * Custom content
 * A custom icon passed via `children` overrides the default rendering
 * (initials / Person fallback / image).
 */
export const CustomContent: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  args: {
    ["aria-label"]: "avatar",
    children: <AutoAwesome />,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByLabelText("avatar");

    await step("Renders the custom child content (an svg icon)", async () => {
      await expect(avatar.querySelector("svg")).not.toBeNull();
    });

    await step("Renders no initials text", async () => {
      await expect(avatar.textContent?.trim() ?? "").toBe("");
    });
  },
};
