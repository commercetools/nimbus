import { useState } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  SkeletonText,
  Stack,
  Text,
  Button,
  NimbusProvider,
} from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering
 * @docs-description Render a `SkeletonText` block and confirm it renders one placeholder line per `lines`; the container is decorative (`aria-hidden`) by default, so assistive technology skips it.
 * @docs-order 1
 */
describe("SkeletonText - Basic rendering", () => {
  it("renders one placeholder line per `lines`", () => {
    render(
      <NimbusProvider>
        <SkeletonText data-testid="skeleton-text" lines={3} width="300px" />
      </NimbusProvider>
    );

    const container = screen.getByTestId("skeleton-text");
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute("aria-hidden", "true");
    // One Skeleton line is rendered for each of the three requested lines.
    expect(container.children).toHaveLength(3);
  });
});

/**
 * @docs-section standalone-pattern
 * @docs-title Standalone Loading Pattern
 * @docs-description The recommended way to use SkeletonText: render placeholder lines while the text is loading, then swap in the real paragraph with conditional rendering — SkeletonText has no `isLoaded` prop, so the consumer owns the loading state.
 * @docs-order 2
 */
describe("SkeletonText - Standalone loading pattern", () => {
  /**
   * A representative consumer component: show placeholder lines while
   * `isLoading`, then render the real description once loading completes.
   */
  function ProductDescription({ isLoading }: { isLoading: boolean }) {
    return isLoading ? (
      <SkeletonText lines={3} width="100%" />
    ) : (
      <Text>
        Wireless keyboard with a compact layout and long battery life.
      </Text>
    );
  }

  it("shows placeholder lines while loading, then the real text", async () => {
    const description =
      "Wireless keyboard with a compact layout and long battery life.";

    const Example = () => {
      const [isLoading, setIsLoading] = useState(true);
      return (
        <Stack gap="400" width="320px">
          <ProductDescription isLoading={isLoading} />
          <Button onPress={() => setIsLoading(false)}>Finish loading</Button>
        </Stack>
      );
    };

    render(
      <NimbusProvider>
        <Example />
      </NimbusProvider>
    );

    // While loading: real text is absent.
    expect(screen.queryByText(description)).toBeNull();

    await userEvent.click(
      screen.getByRole("button", { name: "Finish loading" })
    );

    // After loading: real text is present.
    expect(screen.getByText(description)).toBeInTheDocument();
  });
});

/**
 * @docs-section aria-busy-pattern
 * @docs-title Announcing Loading with aria-busy
 * @docs-description SkeletonText is decorative (`aria-hidden`), so it is not announced on its own; communicate the loading state to assistive technology by setting `aria-busy` on the surrounding container instead.
 * @docs-order 3
 */
describe("SkeletonText - Container aria-busy pattern", () => {
  it("announces loading state via aria-busy on the container", () => {
    render(
      <NimbusProvider>
        <section
          data-testid="container"
          aria-busy={true}
          aria-label="Product description"
        >
          <SkeletonText lines={3} width="100%" />
        </section>
      </NimbusProvider>
    );

    const container = screen.getByTestId("container");
    expect(container).toHaveAttribute("aria-busy", "true");
    expect(container).toHaveAttribute("aria-label", "Product description");
  });
});
