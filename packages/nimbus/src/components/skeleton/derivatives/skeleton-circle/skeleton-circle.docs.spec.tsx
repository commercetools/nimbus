import { useState } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  SkeletonCircle,
  Stack,
  Button,
  NimbusProvider,
} from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering
 * @docs-description Render a `SkeletonCircle` and confirm it is present; the circle is decorative (`aria-hidden`) by default, so assistive technology skips it.
 * @docs-order 1
 */
describe("SkeletonCircle - Basic rendering", () => {
  it("renders a decorative circular placeholder", () => {
    render(
      <NimbusProvider>
        <SkeletonCircle data-testid="skeleton-circle" size="md" />
      </NimbusProvider>
    );

    const circle = screen.getByTestId("skeleton-circle");
    expect(circle).toBeInTheDocument();
    expect(circle).toHaveAttribute("aria-hidden", "true");
  });
});

/**
 * @docs-section avatar-aligned-sizes
 * @docs-title Avatar-aligned Sizes
 * @docs-description Render the avatar-aligned `size` values (`2xs`, `xs`, `md`) that let a SkeletonCircle stand in for an `Avatar` at the same dimensions.
 * @docs-order 2
 */
describe("SkeletonCircle - Avatar-aligned sizes", () => {
  it("renders each avatar-aligned size", () => {
    render(
      <NimbusProvider>
        <Stack direction="row" gap="400" alignItems="center">
          <SkeletonCircle data-testid="circle-2xs" size="2xs" />
          <SkeletonCircle data-testid="circle-xs" size="xs" />
          <SkeletonCircle data-testid="circle-md" size="md" />
        </Stack>
      </NimbusProvider>
    );

    expect(screen.getByTestId("circle-2xs")).toBeInTheDocument();
    expect(screen.getByTestId("circle-xs")).toBeInTheDocument();
    expect(screen.getByTestId("circle-md")).toBeInTheDocument();
  });
});

/**
 * @docs-section standalone-pattern
 * @docs-title Standalone Loading Pattern
 * @docs-description The recommended way to use SkeletonCircle: render the circle while an avatar is loading, then swap in the real image with conditional rendering — SkeletonCircle has no `isLoaded` prop, so the consumer owns the loading state.
 * @docs-order 3
 */
describe("SkeletonCircle - Standalone loading pattern", () => {
  /**
   * A representative consumer component: show a circular placeholder while
   * `isLoading`, then render the real avatar image once loading completes.
   */
  function UserAvatar({ isLoading }: { isLoading: boolean }) {
    return isLoading ? (
      <SkeletonCircle size="md" />
    ) : (
      <img src="/avatar.png" alt="Ada Lovelace" width={40} height={40} />
    );
  }

  it("shows a circular placeholder while loading, then the real avatar", async () => {
    const Example = () => {
      const [isLoading, setIsLoading] = useState(true);
      return (
        <Stack gap="400">
          <UserAvatar isLoading={isLoading} />
          <Button onPress={() => setIsLoading(false)}>Finish loading</Button>
        </Stack>
      );
    };

    render(
      <NimbusProvider>
        <Example />
      </NimbusProvider>
    );

    // While loading: real avatar is absent.
    expect(screen.queryByAltText("Ada Lovelace")).toBeNull();

    await userEvent.click(
      screen.getByRole("button", { name: "Finish loading" })
    );

    // After loading: real avatar is present.
    expect(screen.getByAltText("Ada Lovelace")).toBeInTheDocument();
  });
});
