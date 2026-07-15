import { useState } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Skeleton,
  Stack,
  Text,
  Button,
  NimbusProvider,
} from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering
 * @docs-description Render a `Skeleton` placeholder and confirm it is present; it stretches to the `width`/`height` you give it and is decorative (`aria-hidden`) by default, so assistive technology skips it.
 * @docs-order 1
 */
describe("Skeleton - Basic rendering", () => {
  it("renders a decorative placeholder block", () => {
    render(
      <NimbusProvider>
        <Skeleton data-testid="skeleton" width="200px" height="40px" />
      </NimbusProvider>
    );

    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute("aria-hidden", "true");
  });
});

/**
 * @docs-section standalone-pattern
 * @docs-title Standalone Loading Pattern
 * @docs-description The recommended way to use Skeleton: render a placeholder while data is loading, then swap in the real content with conditional rendering — Skeleton has no `isLoaded` prop, so the consumer owns the loading state.
 * @docs-order 2
 */
describe("Skeleton - Standalone loading pattern", () => {
  /**
   * A representative consumer component: show a skeleton banner while
   * `isLoading`, then render the real image once loading completes.
   */
  function ProductBanner({ isLoading }: { isLoading: boolean }) {
    return isLoading ? (
      <Skeleton width="288px" height="120px" />
    ) : (
      <img src="/banner.png" alt="Product banner" width={288} />
    );
  }

  it("shows a skeleton while loading, then the real content", async () => {
    const Example = () => {
      const [isLoading, setIsLoading] = useState(true);
      return (
        <Stack gap="400">
          <ProductBanner isLoading={isLoading} />
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
    expect(screen.queryByAltText("Product banner")).toBeNull();

    await userEvent.click(
      screen.getByRole("button", { name: "Finish loading" })
    );

    // After loading: real content is present.
    expect(screen.getByAltText("Product banner")).toBeInTheDocument();
  });
});

/**
 * @docs-section aria-busy-pattern
 * @docs-title Announcing Loading with aria-busy
 * @docs-description Skeleton shapes are decorative (`aria-hidden`) so they are not announced individually; communicate the loading state to assistive technology by setting `aria-busy` on the surrounding container instead.
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
          <Skeleton width="100%" height="120px" />
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
          <Text>Product details loaded</Text>
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
