import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  NimbusProvider,
} from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify that skeleton components render and are hidden from assistive technology by default
 * @docs-order 1
 */
describe("Skeleton - Basic rendering", () => {
  it("renders a Skeleton element in the DOM", () => {
    render(
      <NimbusProvider>
        <Skeleton data-testid="sk" width="200px" height="40px" />
      </NimbusProvider>
    );

    expect(screen.getByTestId("sk")).toBeInTheDocument();
  });

  it("is hidden from assistive technology by default", () => {
    render(
      <NimbusProvider>
        <Skeleton data-testid="sk" width="200px" height="40px" />
      </NimbusProvider>
    );

    expect(screen.getByTestId("sk")).toHaveAttribute("aria-hidden", "true");
  });

  it("allows aria-hidden to be overridden", () => {
    render(
      <NimbusProvider>
        <Skeleton
          data-testid="sk"
          width="200px"
          height="40px"
          aria-hidden={false}
          aria-label="Loading thumbnail"
        />
      </NimbusProvider>
    );

    expect(screen.getByTestId("sk")).toHaveAttribute("aria-hidden", "false");
  });
});

/**
 * @docs-section skeleton-text
 * @docs-title SkeletonText Tests
 * @docs-description Verify that SkeletonText renders the correct number of lines and respects configuration props
 * @docs-order 2
 */
describe("SkeletonText - Multi-line placeholder", () => {
  it("renders the default number of lines (3)", () => {
    render(
      <NimbusProvider>
        <SkeletonText data-testid="skt" />
      </NimbusProvider>
    );

    const container = screen.getByTestId("skt");
    expect(container.children).toHaveLength(3);
  });

  it("renders a custom number of lines", () => {
    render(
      <NimbusProvider>
        <SkeletonText data-testid="skt" lines={5} />
      </NimbusProvider>
    );

    const container = screen.getByTestId("skt");
    expect(container.children).toHaveLength(5);
  });

  it("is hidden from assistive technology by default", () => {
    render(
      <NimbusProvider>
        <SkeletonText data-testid="skt" />
      </NimbusProvider>
    );

    expect(screen.getByTestId("skt")).toHaveAttribute("aria-hidden", "true");
  });
});

/**
 * @docs-section skeleton-circle
 * @docs-title SkeletonCircle Tests
 * @docs-description Verify that SkeletonCircle renders as an element hidden from assistive technology
 * @docs-order 3
 */
describe("SkeletonCircle - Circular placeholder", () => {
  it("renders a SkeletonCircle element in the DOM", () => {
    render(
      <NimbusProvider>
        <SkeletonCircle data-testid="skc" size="64px" />
      </NimbusProvider>
    );

    expect(screen.getByTestId("skc")).toBeInTheDocument();
  });

  it("is hidden from assistive technology by default", () => {
    render(
      <NimbusProvider>
        <SkeletonCircle data-testid="skc" size="64px" />
      </NimbusProvider>
    );

    expect(screen.getByTestId("skc")).toHaveAttribute("aria-hidden", "true");
  });
});

/**
 * @docs-section aria-busy-pattern
 * @docs-title Container aria-busy Pattern Tests
 * @docs-description Verify the recommended pattern of setting aria-busy on the container to announce loading state
 * @docs-order 4
 */
describe("Skeleton - Container aria-busy pattern", () => {
  it("container with aria-busy correctly announces loading state", () => {
    render(
      <NimbusProvider>
        <section
          data-testid="container"
          aria-busy={true}
          aria-label="Product details"
        >
          <SkeletonText lines={3} width="100%" />
        </section>
      </NimbusProvider>
    );

    const container = screen.getByTestId("container");
    expect(container).toHaveAttribute("aria-busy", "true");
    expect(container).toHaveAttribute("aria-label", "Product details");
  });

  it("renders real content when loading is complete", () => {
    render(
      <NimbusProvider>
        <section data-testid="container" aria-busy={false}>
          <p>Product details loaded</p>
        </section>
      </NimbusProvider>
    );

    expect(screen.getByText("Product details loaded")).toBeInTheDocument();
    expect(screen.getByTestId("container")).toHaveAttribute(
      "aria-busy",
      "false"
    );
  });
});
