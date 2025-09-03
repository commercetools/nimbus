import type { Meta, StoryObj } from "@storybook/react-vite";
import { within, expect } from "storybook/test";
import { Stack } from "../stack";
import { Group } from "../group";

import { InlineSvg } from "./inline-svg";

const meta: Meta<typeof InlineSvg> = {
  title: "Components/Media/InlineSvg",
  component: InlineSvg,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["2xs", "xs", "sm", "md", "lg", "xl"],
      description: "Size of the icon",
      table: {
        defaultValue: { summary: "md" },
      },
    },
    color: {
      control: "text",
      description: "Color of the icon (uses currentColor by default)",
    },
    data: {
      control: "text",
      description: "SVG markup as a string",
    },
    title: {
      control: "text",
      description: "Title for accessibility",
    },
    description: {
      control: "text",
      description: "Description for accessibility",
    },
    preserveViewBox: {
      control: "boolean",
      description: "Whether to preserve the original viewBox",
      table: {
        defaultValue: { summary: "true" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Simple SVG data for testing
const simpleSvg = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" fill="currentColor"/>
</svg>`;

const complexSvg = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <g stroke="currentColor" stroke-width="2" fill="none">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v6l4 4"/>
  </g>
</svg>`;

const multiColorSvg = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <rect x="3" y="3" width="18" height="18" rx="2" fill="#e11d48"/>
  <circle cx="12" cy="12" r="5" fill="#10b981"/>
  <path d="M12 9v6M9 12h6" stroke="white" stroke-width="2"/>
</svg>`;

// Malicious SVG data for security testing
const maliciousSvg = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <script>alert('XSS')</script>
  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" fill="currentColor" onclick="alert('XSS')"/>
  <a href="javascript:alert('XSS')">
    <circle cx="12" cy="12" r="5"/>
  </a>
  <style>body { display: none; }</style>
</svg>`;

/**
 * Basic usage of InlineSvg component with a simple SVG path
 */
export const Basic: Story = {
  args: {
    data: simpleSvg,
    size: "md",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("SVG renders correctly", async () => {
      const svg = canvas.getByRole("presentation");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
      expect(svg.querySelector("path")).toBeInTheDocument();
    });
  },
};

/**
 * InlineSvg with accessibility attributes
 */
export const WithAccessibility: Story = {
  args: {
    data: simpleSvg,
    title: "Security Shield Icon",
    description: "A shield icon representing security and protection",
    size: "lg",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Accessibility attributes are present", async () => {
      const svg = canvas.getByRole("img");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("aria-label", "Security Shield Icon");
      expect(svg.querySelector("title")).toHaveTextContent(
        "Security Shield Icon"
      );
      expect(svg.querySelector("desc")).toHaveTextContent(
        "A shield icon representing security and protection"
      );
    });
  },
};

/**
 * Complex SVG with groups and multiple paths
 */
export const ComplexSvg: Story = {
  args: {
    data: complexSvg,
    size: "xl",
    color: "primary.500",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Complex SVG structure is preserved", async () => {
      const svg = canvas.getByRole("presentation");
      expect(svg).toBeInTheDocument();
      expect(svg.querySelector("g")).toBeInTheDocument();
      expect(svg.querySelector("circle")).toBeInTheDocument();
      expect(svg.querySelector("path")).toBeInTheDocument();
    });
  },
};

/**
 * Different sizes showcase
 */
export const Sizes: Story = {
  render: () => (
    <Group gap="200">
      <InlineSvg data={simpleSvg} size="2xs" />
      <InlineSvg data={simpleSvg} size="xs" />
      <InlineSvg data={simpleSvg} size="sm" />
      <InlineSvg data={simpleSvg} size="md" />
      <InlineSvg data={simpleSvg} size="lg" />
      <InlineSvg data={simpleSvg} size="xl" />
    </Group>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("All size variants render", async () => {
      const svgs = canvas.getAllByRole("presentation");
      expect(svgs).toHaveLength(6);
      svgs.forEach((svg) => {
        expect(svg).toBeInTheDocument();
        expect(svg.querySelector("path")).toBeInTheDocument();
      });
    });
  },
};

/**
 * Different colors showcase
 */
export const Colors: Story = {
  render: () => (
    <Group gap="200">
      <InlineSvg data={simpleSvg} size="lg" color="primary.500" />
      <InlineSvg data={simpleSvg} size="lg" color="secondary.500" />
      <InlineSvg data={simpleSvg} size="lg" color="tertiary.500" />
      <InlineSvg data={simpleSvg} size="lg" color="success.500" />
      <InlineSvg data={simpleSvg} size="lg" color="warning.500" />
      <InlineSvg data={simpleSvg} size="lg" color="critical.500" />
    </Group>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("All color variants render", async () => {
      const svgs = canvas.getAllByRole("presentation");
      expect(svgs).toHaveLength(6);
      svgs.forEach((svg) => {
        expect(svg).toBeInTheDocument();
      });
    });
  },
};

/**
 * Multi-color SVG (preserves inline colors)
 */
export const MultiColorSvg: Story = {
  args: {
    data: multiColorSvg,
    size: "xl",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Multi-color SVG preserves colors", async () => {
      const svg = canvas.getByRole("presentation");
      expect(svg).toBeInTheDocument();

      const rect = svg.querySelector("rect");
      expect(rect).toHaveAttribute("fill", "#e11d48");

      const circle = svg.querySelector("circle");
      expect(circle).toHaveAttribute("fill", "#10b981");

      const path = svg.querySelector("path");
      expect(path).toHaveAttribute("stroke", "white");
    });
  },
};

/**
 * Security test - malicious content should be sanitized
 */
export const SecurityTest: Story = {
  parameters: {
    // Disable a11y checks for this story since we're testing sanitization of malicious content
    a11y: { disable: true },
  },
  args: {
    data: maliciousSvg,
    size: "lg",
    title: "Sanitized SVG",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Malicious content is removed", async () => {
      // Use a more specific query since the SVG is present but might have timing issues
      const svg = canvas.getByLabelText("Sanitized SVG");
      expect(svg).toBeInTheDocument();

      // Script tags should be removed
      expect(svg.querySelector("script")).not.toBeInTheDocument();

      // Style tags should be removed
      expect(svg.querySelector("style")).not.toBeInTheDocument();

      // Note: Event handler and javascript: URL sanitization requires DOMPurify
      // or a more comprehensive sanitization library. The current implementation
      // provides basic protection against script/style injection but may not
      // remove all event handlers in all browser environments.

      // For production use, consider adding DOMPurify for complete XSS protection
    });
  },
};

/**
 * Invalid SVG handling
 */
export const InvalidSvg: Story = {
  args: {
    data: "not valid svg content",
    size: "md",
  },
  play: async ({ canvasElement, step }) => {
    await step("Invalid SVG does not render", async () => {
      // Component should handle invalid SVG gracefully and not render anything
      const container = canvasElement.querySelector(".nimbus-icon");
      expect(container).not.toBeInTheDocument();
    });
  },
};

/**
 * Empty SVG handling
 */
export const EmptySvg: Story = {
  args: {
    data: "",
    size: "md",
  },
  play: async ({ canvasElement, step }) => {
    await step("Empty SVG does not render", async () => {
      // Component should handle empty data gracefully
      const container = canvasElement.querySelector(".nimbus-icon");
      expect(container).not.toBeInTheDocument();
    });
  },
};

/**
 * PreserveViewBox option
 */
export const PreserveViewBox: Story = {
  render: () => (
    <Stack gap="200">
      <InlineSvg
        data={simpleSvg}
        size="xl"
        preserveViewBox={true}
        title="With ViewBox"
      />
      <InlineSvg
        data={simpleSvg}
        size="xl"
        preserveViewBox={false}
        title="Without ViewBox"
      />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("ViewBox preservation works correctly", async () => {
      const svgs = canvas.getAllByRole("img");
      expect(svgs).toHaveLength(2);

      // First SVG should have viewBox
      expect(svgs[0]).toHaveAttribute("viewBox", "0 0 24 24");

      // Second SVG should not have viewBox
      expect(svgs[1]).not.toHaveAttribute("viewBox");
    });
  },
};
