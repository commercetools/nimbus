import type { Meta, StoryObj } from "@storybook/react-vite";
import { within, expect, fn } from "storybook/test";
import { Group, InlineSvg } from "@commercetools/nimbus";

const meta: Meta<typeof InlineSvg> = {
  title: "Components/InlineSvg",
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
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Simple SVG data for testing
const simpleSvg = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 
  3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 
  3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
  </svg>`;

const complexSvg = `<svg fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
  <polyline points="7.5 4.21 12 6.81 16.5 4.21"/>
  <polyline points="7.5 19.79 7.5 14.6 3 12"/>
  <polyline points="21 12 16.5 14.6 16.5 19.79"/>
  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
  <line x1="12" x2="12" y1="22.08" y2="12"/>
</svg>
`;

const multiColorSvg = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <rect x="3" y="3" width="18" height="18" rx="2" fill="#e11d48"/>
  <circle cx="12" cy="12" r="5" fill="#10b981"/>
  <path d="M12 9v6M9 12h6" stroke="white" stroke-width="2"/>
</svg>`;

// Malicious SVG data for security testing
const maliciousSvg = `<svg fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" onclick="alert('XSS')" onLoad="alert('XSS2')">
  <path xlink:href="data:x,<script>alert('XSS5')</script>" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" onmouseover="alert('XSS4')"/>
  <polyline xlink:malicious="<script>alert('XSS6')</script>"points="7.5 4.21 12 6.81 16.5 4.21"/>
  <polyline points="7.5 19.79 7.5 14.6 3 12"/>
  <polyline points="21 12 16.5 14.6 16.5 19.79"/>
  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
  <line x1="12" x2="12" y1="22.08" y2="12"/>
  <a xlink:href="https://www.google.com/"/>
  <style>body { display: none; }</style>
  <script>alert('XSS3')</script>
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
 * Complex SVG with groups and multiple paths
 */
export const ComplexSvg: Story = {
  args: {
    data: complexSvg,
    size: "xl",
    color: "primary.9",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Complex SVG structure is preserved", async () => {
      const svg = canvas.getByRole("presentation");
      expect(svg).toBeInTheDocument();
      expect(svg.querySelector("path")).toBeInTheDocument();
      expect(svg.querySelector("polyline")).toBeInTheDocument();
      expect(svg.querySelector("line")).toBeInTheDocument();
    });

    await step("SVG root attributes are preserved", async () => {
      const svg = canvas.getByRole("presentation");
      expect(svg).toHaveAttribute("stroke", "currentColor");
      expect(svg).toHaveAttribute("stroke-linecap", "round");
      expect(svg).toHaveAttribute("stroke-linejoin", "round");
      expect(svg).toHaveAttribute("stroke-width", "2");
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
      <InlineSvg data={simpleSvg} size="lg" color="primary.9" />
      <InlineSvg data={simpleSvg} size="lg" color="neutral.9" />
      <InlineSvg data={simpleSvg} size="lg" color="info.9" />
      <InlineSvg data={simpleSvg} size="lg" color="positive.9" />
      <InlineSvg data={simpleSvg} size="lg" color="warning.9" />
      <InlineSvg data={simpleSvg} size="lg" color="critical.9" />
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
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Malicious content is removed", async () => {
      // Use a more specific query since the SVG is present but might have timing issues
      const svg = canvas.getByRole("presentation");
      expect(svg).toBeInTheDocument();

      // Script tags should be removed
      expect(svg.querySelector("script")).not.toBeInTheDocument();

      // Style tags should be removed
      expect(svg.querySelector("style")).not.toBeInTheDocument();

      // Event handlers should be removed
      expect(svg.hasAttribute("onclick")).toBe(false);
      expect(svg.hasAttribute("onload")).toBe(false);
      expect(svg.hasAttribute("onerror")).toBe(false);

      // Check that no element has event handlers
      const allElements = svg.querySelectorAll("*");
      allElements.forEach((element) => {
        Array.from(element.attributes).forEach((attr) => {
          expect(attr.name.toLowerCase().startsWith("on")).toBe(false);
          // The xlink on the `a` tag is legit, so it should be kept
          if (
            element.tagName === "a" &&
            attr.name.toLowerCase().startsWith("xlink")
          ) {
            expect(attr.value).toBe("https://www.google.com/");
          } else {
            // The xlink on the `path` and `polyline` tags are malicious, so they should be removed
            expect(attr.name.toLowerCase().startsWith("xlink")).toBe(false);
          }
        });
      });
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
  beforeEach: () => {
    // Suppress expected warning when invalid SVG is passed
    const originalWarn = console.warn;
    console.warn = fn();
    return () => {
      console.warn = originalWarn;
    };
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Invalid SVG does not render", async () => {
      const svg = canvas.queryByRole("presentation");
      expect(svg).not.toBeInTheDocument();
    });

    await step("Warning is logged for invalid SVG", async () => {
      expect(console.warn).toHaveBeenCalledWith(
        "InlineSvg: No SVG element found in markup"
      );
    });
  },
};

/**
 * Test that 'as' and 'asChild' props are not supported
 */
export const NoAsOrAsChildSupport: Story = {
  args: {
    data: simpleSvg,
    size: "lg",
    // These props are not part of InlineSvgProps type definition
    // Testing runtime behavior to ensure they're ignored if passed
    ...({ as: "div", asChild: true } as Record<string, unknown>),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Component always renders as SVG regardless of 'as' prop",
      async () => {
        const svg = canvas.getByRole("presentation");
        expect(svg).toBeInTheDocument();
        expect(svg.tagName.toLowerCase()).toBe("svg");

        // The as="div" prop should be ignored — component renders as SVG, not div
        const divWithPresentation = canvasElement.querySelector(
          'div[role="presentation"]'
        );
        expect(divWithPresentation).not.toBeInTheDocument();
      }
    );

    await step("asChild prop is ignored", async () => {
      // The component should still render as an SVG even with asChild
      const svg = canvas.getByRole("presentation");
      expect(svg).toBeInTheDocument();
      expect(svg.tagName.toLowerCase()).toBe("svg");
    });
  },
};
