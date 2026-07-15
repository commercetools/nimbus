import { useState } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  Stack,
  Text,
  Button,
  NimbusProvider,
} from "@commercetools/nimbus";

/**
 * @docs-section basic-usage
 * @docs-title Basic Usage
 * @docs-description The three building blocks of the family: `Skeleton` (the
 * base rectangle/circle placeholder), `SkeletonText` (a paragraph of lines sized
 * to a `textStyle`), and `SkeletonCircle` (an avatar/icon placeholder).
 * @docs-order 1
 */
describe("Skeleton - Basic usage", () => {
  it("renders the base Skeleton, SkeletonText, and SkeletonCircle", () => {
    render(
      <NimbusProvider>
        <Stack gap="400" alignItems="flex-start">
          <Skeleton data-testid="skeleton" width="7200" height="1000" />
          <SkeletonText
            data-testid="skeleton-text"
            lines={3}
            textStyle="body"
          />
          <SkeletonCircle data-testid="skeleton-circle" size="md" />
        </Stack>
      </NimbusProvider>
    );

    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-text")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton-circle")).toBeInTheDocument();
  });
});

/**
 * @docs-section standalone-pattern
 * @docs-title Standalone Loading Pattern
 * @docs-description The recommended way to use Skeleton: render placeholders
 * while data is loading, then swap in the real content with conditional
 * rendering. Skeleton deliberately has no `isLoaded` wrapper prop — the
 * consumer owns the loading state.
 * @docs-order 2
 */
describe("Skeleton - Standalone loading pattern", () => {
  /**
   * A representative consumer component: show a skeleton placeholder while
   * `isLoading`, then render the real content once loading completes.
   */
  function ProductSummary({ isLoading }: { isLoading: boolean }) {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {isLoading ? (
          <SkeletonCircle boxSize="2000" />
        ) : (
          <img src="/avatar.png" alt="Product thumbnail" width={80} />
        )}
        {isLoading ? (
          <SkeletonText lines={2} width="7200" />
        ) : (
          <Text>Wireless keyboard — $49.00</Text>
        )}
      </Stack>
    );
  }

  it("shows skeleton placeholders while loading, then real content", async () => {
    const Example = () => {
      const [isLoading, setIsLoading] = useState(true);
      return (
        <Stack gap="400">
          <ProductSummary isLoading={isLoading} />
          <Button onPress={() => setIsLoading(false)}>Finish loading</Button>
        </Stack>
      );
    };

    render(
      <NimbusProvider>
        <Example />
      </NimbusProvider>
    );

    // While loading: real content is absent.
    expect(screen.queryByText("Wireless keyboard — $49.00")).toBeNull();

    await userEvent.click(
      screen.getByRole("button", { name: "Finish loading" })
    );

    // After loading: real content is present.
    expect(screen.getByText("Wireless keyboard — $49.00")).toBeInTheDocument();
  });
});

/**
 * @docs-section aria-busy-pattern
 * @docs-title Announcing Loading with aria-busy
 * @docs-description Skeleton shapes are decorative (`aria-hidden`) so they are
 * not announced individually. Communicate the loading state to assistive
 * technology by setting `aria-busy` on the surrounding container instead.
 * @docs-order 3
 */
describe("Skeleton - Container aria-busy pattern", () => {
  it("announces loading state via aria-busy on the container", () => {
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

  it("clears aria-busy once real content is rendered", () => {
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
