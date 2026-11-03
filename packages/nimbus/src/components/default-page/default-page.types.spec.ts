import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { DefaultPage } from "./default-page";
import type { DefaultPageProps } from "./default-page.types";

describe("DefaultPageProps", () => {
  it("keeps compiling for existing consumer patterns", () => {
    const layout: "constrained" | "flexible" = "constrained";
    const withUnionLayout = createElement(DefaultPage.Root, { layout });

    const Wrapper = (props: Omit<DefaultPageProps, "children">) =>
      createElement(DefaultPage.Root, props);

    const SpreadLayout = ({ layout: pageLayout, ...rest }: DefaultPageProps) =>
      createElement(DefaultPage.Root, { layout: pageLayout, ...rest });

    const stickyHeader = true;
    const withSticky = createElement(DefaultPage.Root, {
      layout: "flexible",
      stickyHeader,
    });
    const withStickyAndCollapse = createElement(DefaultPage.Root, {
      layout: "flexible",
      stickyHeader,
      collapseHeaderOnScroll: true,
    });

    expect(withUnionLayout).toBeTruthy();
    expect(Wrapper).toBeTruthy();
    expect(SpreadLayout).toBeTruthy();
    expect(withSticky).toBeTruthy();
    expect(withStickyAndCollapse).toBeTruthy();
  });
});
