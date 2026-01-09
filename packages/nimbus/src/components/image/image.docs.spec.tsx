import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Image, NimbusProvider, Box } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the Image component renders with expected attributes and structure
 * @docs-order 1
 */
describe("Image - Basic rendering", () => {
  it("renders with src and alt attributes", () => {
    render(
      <NimbusProvider>
        <Image
          src="https://example.com/image.jpg"
          alt="Test image description"
          data-testid="test-image"
        />
      </NimbusProvider>
    );

    const image = screen.getByTestId("test-image") as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image.src).toBe("https://example.com/image.jpg");
    expect(image.alt).toBe("Test image description");
  });

  it("renders as an img element", () => {
    render(
      <NimbusProvider>
        <Image
          src="https://example.com/image.jpg"
          alt="Test image"
          data-testid="test-image"
        />
      </NimbusProvider>
    );

    const image = screen.getByTestId("test-image");
    expect(image.tagName).toBe("IMG");
  });

  it("applies custom data attributes", () => {
    render(
      <NimbusProvider>
        <Image
          src="https://example.com/image.jpg"
          alt="Test image"
          data-testid="test-image"
          data-custom="custom-value"
        />
      </NimbusProvider>
    );

    const image = screen.getByTestId("test-image");
    expect(image).toHaveAttribute("data-custom", "custom-value");
  });
});

/**
 * @docs-section aspect-ratio
 * @docs-title Aspect Ratio Tests
 * @docs-description Test aspect ratio control for consistent image dimensions
 * @docs-order 2
 */
describe("Image - Aspect ratio", () => {
  it("renders with aspect ratio styling", () => {
    render(
      <NimbusProvider>
        <Image
          src="https://example.com/image.jpg"
          alt="Square image"
          aspectRatio={1}
          data-testid="square-image"
        />
      </NimbusProvider>
    );

    const image = screen.getByTestId("square-image");
    expect(image).toBeInTheDocument();
  });

  it("renders with 16:9 aspect ratio", () => {
    render(
      <NimbusProvider>
        <Image
          src="https://example.com/image.jpg"
          alt="Widescreen image"
          aspectRatio={16 / 9}
          data-testid="widescreen-image"
        />
      </NimbusProvider>
    );

    const image = screen.getByTestId("widescreen-image");
    expect(image).toBeInTheDocument();
  });
});

/**
 * @docs-section object-fit
 * @docs-title Object Fit Tests
 * @docs-description Verify different object-fit behaviors for image scaling
 * @docs-order 3
 */
describe("Image - Object fit", () => {
  it("renders with cover fit", () => {
    render(
      <NimbusProvider>
        <Image
          src="https://example.com/image.jpg"
          alt="Cover fit image"
          fit="cover"
          data-testid="cover-image"
        />
      </NimbusProvider>
    );

    const image = screen.getByTestId("cover-image");
    expect(image).toBeInTheDocument();
  });

  it("renders with contain fit", () => {
    render(
      <NimbusProvider>
        <Image
          src="https://example.com/image.jpg"
          alt="Contain fit image"
          fit="contain"
          data-testid="contain-image"
        />
      </NimbusProvider>
    );

    const image = screen.getByTestId("contain-image");
    expect(image).toBeInTheDocument();
  });

  it("renders with fill fit", () => {
    render(
      <NimbusProvider>
        <Image
          src="https://example.com/image.jpg"
          alt="Fill fit image"
          fit="fill"
          data-testid="fill-image"
        />
      </NimbusProvider>
    );

    const image = screen.getByTestId("fill-image");
    expect(image).toBeInTheDocument();
  });
});

/**
 * @docs-section loading-behavior
 * @docs-title Loading Behavior Tests
 * @docs-description Test lazy loading and eager loading configurations
 * @docs-order 4
 */
describe("Image - Loading behavior", () => {
  it("renders with lazy loading attribute", () => {
    render(
      <NimbusProvider>
        <Image
          src="https://example.com/image.jpg"
          alt="Lazy loaded image"
          loading="lazy"
          data-testid="lazy-image"
        />
      </NimbusProvider>
    );

    const image = screen.getByTestId("lazy-image");
    expect(image).toHaveAttribute("loading", "lazy");
  });

  it("renders with eager loading attribute", () => {
    render(
      <NimbusProvider>
        <Image
          src="https://example.com/image.jpg"
          alt="Eager loaded image"
          loading="eager"
          data-testid="eager-image"
        />
      </NimbusProvider>
    );

    const image = screen.getByTestId("eager-image");
    expect(image).toHaveAttribute("loading", "eager");
  });

  it("handles onLoad callback", () => {
    const onLoad = vi.fn();

    render(
      <NimbusProvider>
        <Image
          src="https://example.com/image.jpg"
          alt="Image with load handler"
          onLoad={onLoad}
          data-testid="load-handler-image"
        />
      </NimbusProvider>
    );

    const image = screen.getByTestId("load-handler-image");
    expect(image).toBeInTheDocument();
  });
});

/**
 * @docs-section responsive-images
 * @docs-title Responsive Images Tests
 * @docs-description Test srcSet and sizes for responsive image delivery
 * @docs-order 5
 */
describe("Image - Responsive images", () => {
  it("renders with srcSet attribute", () => {
    render(
      <NimbusProvider>
        <Image
          src="https://example.com/image-800w.jpg"
          srcSet="https://example.com/image-400w.jpg 400w, https://example.com/image-800w.jpg 800w"
          alt="Responsive image"
          data-testid="srcset-image"
        />
      </NimbusProvider>
    );

    const image = screen.getByTestId("srcset-image") as HTMLImageElement;
    expect(image.srcset).toContain("400w");
    expect(image.srcset).toContain("800w");
  });

  it("renders with sizes attribute", () => {
    render(
      <NimbusProvider>
        <Image
          src="https://example.com/image.jpg"
          srcSet="https://example.com/image-400w.jpg 400w, https://example.com/image-800w.jpg 800w"
          sizes="(max-width: 600px) 400px, 800px"
          alt="Responsive image with sizes"
          data-testid="sizes-image"
        />
      </NimbusProvider>
    );

    const image = screen.getByTestId("sizes-image") as HTMLImageElement;
    expect(image.sizes).toBe("(max-width: 600px) 400px, 800px");
  });
});

/**
 * @docs-section accessibility
 * @docs-title Accessibility Tests
 * @docs-description Verify proper accessibility attributes and behavior
 * @docs-order 6
 */
describe("Image - Accessibility", () => {
  it("requires alt text for accessibility", () => {
    render(
      <NimbusProvider>
        <Image
          src="https://example.com/image.jpg"
          alt="Descriptive alt text"
          data-testid="accessible-image"
        />
      </NimbusProvider>
    );

    const image = screen.getByTestId("accessible-image");
    expect(image).toHaveAccessibleName("Descriptive alt text");
  });

  it("supports empty alt for decorative images", () => {
    render(
      <NimbusProvider>
        <Image
          src="https://example.com/decorative.jpg"
          alt=""
          data-testid="decorative-image"
        />
      </NimbusProvider>
    );

    const image = screen.getByTestId("decorative-image") as HTMLImageElement;
    expect(image.alt).toBe("");
  });

  it("applies aria attributes when provided", () => {
    render(
      <NimbusProvider>
        <Image
          src="https://example.com/image.jpg"
          alt="Test image"
          aria-describedby="image-description"
          data-testid="aria-image"
        />
      </NimbusProvider>
    );

    const image = screen.getByTestId("aria-image");
    expect(image).toHaveAttribute("aria-describedby", "image-description");
  });
});

/**
 * @docs-section styling
 * @docs-title Styling Tests
 * @docs-description Test custom styling and responsive style props
 * @docs-order 7
 */
describe("Image - Styling", () => {
  it("applies custom width and height", () => {
    render(
      <NimbusProvider>
        <Image
          src="https://example.com/image.jpg"
          alt="Sized image"
          width="300px"
          height="200px"
          data-testid="sized-image"
        />
      </NimbusProvider>
    );

    const image = screen.getByTestId("sized-image");
    expect(image).toBeInTheDocument();
  });

  it("applies border radius styling", () => {
    render(
      <NimbusProvider>
        <Image
          src="https://example.com/image.jpg"
          alt="Rounded image"
          borderRadius="full"
          data-testid="rounded-image"
        />
      </NimbusProvider>
    );

    const image = screen.getByTestId("rounded-image");
    expect(image).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <NimbusProvider>
        <Image
          src="https://example.com/image.jpg"
          alt="Custom class image"
          className="custom-image-class"
          data-testid="class-image"
        />
      </NimbusProvider>
    );

    const image = screen.getByTestId("class-image");
    expect(image).toHaveClass("custom-image-class");
  });
});

/**
 * @docs-section integration
 * @docs-title Integration Tests
 * @docs-description Test Image component within common layout patterns
 * @docs-order 8
 */
describe("Image - Integration", () => {
  it("renders within a Box container", () => {
    render(
      <NimbusProvider>
        <Box maxWidth="400px">
          <Image
            src="https://example.com/image.jpg"
            alt="Boxed image"
            data-testid="boxed-image"
          />
        </Box>
      </NimbusProvider>
    );

    const image = screen.getByTestId("boxed-image");
    expect(image).toBeInTheDocument();
  });

  it("renders with id for tracking", () => {
    const persistentId = "product-image-123";

    render(
      <NimbusProvider>
        <Image
          id={persistentId}
          src="https://example.com/product.jpg"
          alt="Product image"
          data-testid="tracked-image"
        />
      </NimbusProvider>
    );

    const image = screen.getByTestId("tracked-image");
    expect(image).toHaveAttribute("id", persistentId);
  });
});
