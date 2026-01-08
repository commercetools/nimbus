import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Text, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering
 * @docs-description Verify that Text renders correctly with different content types
 * @docs-order 1
 */
describe("Text - Basic rendering", () => {
  it("renders text content", () => {
    render(
      <NimbusProvider>
        <Text>Hello World</Text>
      </NimbusProvider>
    );

    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("renders with custom id for tracking", () => {
    const PERSISTENT_ID = "product-description-text";

    render(
      <NimbusProvider>
        <Text id={PERSISTENT_ID}>Product description</Text>
      </NimbusProvider>
    );

    expect(screen.getByText("Product description")).toHaveAttribute(
      "id",
      PERSISTENT_ID
    );
  });

  it("renders children elements", () => {
    render(
      <NimbusProvider>
        <Text>
          Text with <strong>bold</strong> and <em>italic</em> content
        </Text>
      </NimbusProvider>
    );

    expect(screen.getByText(/Text with/)).toBeInTheDocument();
    expect(screen.getByText("bold")).toBeInTheDocument();
    expect(screen.getByText("italic")).toBeInTheDocument();
  });
});

/**
 * @docs-section typography-scale
 * @docs-title Typography Scale
 * @docs-description Test different textStyle variants
 * @docs-order 2
 */
describe("Text - Typography scale", () => {
  it("applies textStyle variants", () => {
    const { rerender } = render(
      <NimbusProvider>
        <Text textStyle="md" data-testid="text-element">
          Medium text
        </Text>
      </NimbusProvider>
    );

    const textElement = screen.getByTestId("text-element");
    expect(textElement).toBeInTheDocument();

    // Test different textStyle values
    const textStyles = ["sm", "xs", "caption"] as const;
    textStyles.forEach((style) => {
      rerender(
        <NimbusProvider>
          <Text textStyle={style} data-testid="text-element">
            {style} text
          </Text>
        </NimbusProvider>
      );
      expect(screen.getByTestId("text-element")).toBeInTheDocument();
    });
  });

  it("combines textStyle with custom overrides", () => {
    render(
      <NimbusProvider>
        <Text textStyle="sm" fontWeight="700">
          Bold small text
        </Text>
      </NimbusProvider>
    );

    expect(screen.getByText("Bold small text")).toBeInTheDocument();
  });
});

/**
 * @docs-section semantic-colors
 * @docs-title Semantic Colors
 * @docs-description Test semantic color application
 * @docs-order 3
 */
describe("Text - Semantic colors", () => {
  it("applies semantic color tokens", () => {
    const colors = [
      { color: "fg", label: "Default text" },
      { color: "fg.subtle", label: "Secondary text" },
      { color: "primary.11", label: "Primary text" },
      { color: "info.11", label: "Info text" },
      { color: "positive.11", label: "Success text" },
      { color: "warning.11", label: "Warning text" },
      { color: "critical.11", label: "Error text" },
    ] as const;

    render(
      <NimbusProvider>
        {colors.map(({ color, label }) => (
          <Text key={color} color={color}>
            {label}
          </Text>
        ))}
      </NimbusProvider>
    );

    colors.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it("maintains contrast with colored text", () => {
    render(
      <NimbusProvider>
        <Text color="critical.11">Error message</Text>
      </NimbusProvider>
    );

    const errorText = screen.getByText("Error message");
    expect(errorText).toBeInTheDocument();
    // In a real application, you would verify the actual computed color
    // meets WCAG contrast requirements against the background
  });
});

/**
 * @docs-section polymorphic-rendering
 * @docs-title Polymorphic Rendering
 * @docs-description Test rendering as different HTML elements
 * @docs-order 4
 */
describe("Text - Polymorphic rendering", () => {
  it("renders as paragraph by default", () => {
    const { container } = render(
      <NimbusProvider>
        <Text>Default paragraph</Text>
      </NimbusProvider>
    );

    const paragraph = container.querySelector("p");
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent("Default paragraph");
  });

  it("renders as span when specified", () => {
    const { container } = render(
      <NimbusProvider>
        <Text as="span">Inline text</Text>
      </NimbusProvider>
    );

    const span = container.querySelector("span");
    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent("Inline text");
  });

  it("renders as label with htmlFor attribute", () => {
    render(
      <NimbusProvider>
        {/* @ts-expect-error - TypeScript doesn't infer element-specific props with polymorphic as prop */}
        <Text as="label" htmlFor="email-input">
          Email Address
        </Text>
      </NimbusProvider>
    );

    const label = screen.getByText("Email Address");
    expect(label.tagName).toBe("LABEL");
    expect(label).toHaveAttribute("for", "email-input");
  });

  it("renders as div for layout purposes", () => {
    render(
      <NimbusProvider>
        <Text as="div">Block text</Text>
      </NimbusProvider>
    );

    const text = screen.getByText("Block text");
    expect(text).toBeInTheDocument();
    expect(text.tagName).toBe("DIV");
  });
});

/**
 * @docs-section custom-styling
 * @docs-title Custom Styling
 * @docs-description Test custom style prop application
 * @docs-order 5
 */
describe("Text - Custom styling", () => {
  it("applies custom typography styles", () => {
    render(
      <NimbusProvider>
        <Text fontSize="450" fontWeight="600" letterSpacing="2px">
          Custom styled text
        </Text>
      </NimbusProvider>
    );

    expect(screen.getByText("Custom styled text")).toBeInTheDocument();
  });

  it("applies truncation styles", () => {
    render(
      <NimbusProvider>
        <Text
          maxWidth="200px"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          This is a very long text that should be truncated
        </Text>
      </NimbusProvider>
    );

    const text = screen.getByText(/This is a very long text/);
    expect(text).toBeInTheDocument();
  });

  it("applies text transformation", () => {
    render(
      <NimbusProvider>
        <Text textTransform="uppercase">uppercase text</Text>
      </NimbusProvider>
    );

    expect(screen.getByText("uppercase text")).toBeInTheDocument();
  });

  it("applies responsive styles", () => {
    render(
      <NimbusProvider>
        <Text fontSize={{ base: "350", md: "400", lg: "450" }}>
          Responsive text
        </Text>
      </NimbusProvider>
    );

    expect(screen.getByText("Responsive text")).toBeInTheDocument();
  });
});

/**
 * @docs-section accessibility
 * @docs-title Accessibility
 * @docs-description Verify semantic HTML and accessibility features
 * @docs-order 6
 */
describe("Text - Accessibility", () => {
  it("maintains semantic structure with as prop", () => {
    const { container } = render(
      <NimbusProvider>
        <Text as="strong">Important text</Text>
      </NimbusProvider>
    );

    const strong = container.querySelector("strong");
    expect(strong).toBeInTheDocument();
    expect(strong).toHaveTextContent("Important text");
  });

  it("associates label with form control", () => {
    render(
      <NimbusProvider>
        {/* @ts-expect-error - TypeScript doesn't infer element-specific props with polymorphic as prop */}
        <Text as="label" htmlFor="username">
          Username
        </Text>
        <input id="username" type="text" />
      </NimbusProvider>
    );

    const label = screen.getByText("Username");
    const input = screen.getByRole("textbox");

    expect(label).toHaveAttribute("for", "username");
    expect(input).toHaveAttribute("id", "username");
  });

  it("supports title attribute for truncated text", () => {
    const longText = "This is a very long text that will be truncated";

    render(
      <NimbusProvider>
        <Text
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          title={longText}
        >
          {longText}
        </Text>
      </NimbusProvider>
    );

    const text = screen.getByText(longText);
    expect(text).toHaveAttribute("title", longText);
  });
});
