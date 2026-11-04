import { describe, it, expect } from "vitest";
import { DefaultPage } from "./default-page";
import type { DefaultPageProps } from "./default-page.types";

/**
 * Compile checks for `DefaultPageProps`.
 *
 * The functions below are never called. `tsc` checks them
 * (`pnpm --filter @commercetools/nimbus typecheck:dev`), and each
 * `@ts-expect-error` fails the type check when its line starts to compile.
 * They are inside an `it()` block because a file with only type checks fails
 * with "No test suite found".
 */
describe("DefaultPageProps", () => {
  it("keeps consumer patterns compiling and rejects invalid combinations", () => {
    // A `layout` value typed as the union of both layouts.
    const UnionLayout = ({
      layout,
    }: {
      layout: "constrained" | "flexible";
    }) => <DefaultPage.Root layout={layout} />;

    const UnionLayoutWithCollapse = ({
      layout,
    }: {
      layout: "constrained" | "flexible";
    }) => <DefaultPage.Root layout={layout} collapseHeaderOnScroll />;

    // A wrapper built with `Omit<DefaultPageProps, "children">` that spreads
    // the rest into Root. `Omit` keeps only the keys shared by both layouts,
    // so such a wrapper accepts `layout` and `collapseHeaderOnScroll`, but not
    // `stickyHeader` (also before `collapseHeaderOnScroll` existed).
    type WrapperProps = Omit<DefaultPageProps, "children"> & {
      title: string;
    };
    const Wrapper = ({ title, ...rest }: WrapperProps) => (
      <DefaultPage.Root {...rest}>
        <DefaultPage.Header>
          <DefaultPage.Title>{title}</DefaultPage.Title>
        </DefaultPage.Header>
      </DefaultPage.Root>
    );
    const WrapperUsage = () => (
      <>
        <Wrapper title="Constrained" />
        <Wrapper title="Collapsing" collapseHeaderOnScroll />
        <Wrapper title="Flexible" layout="flexible" />
        <Wrapper
          title="Flexible collapsing"
          layout="flexible"
          collapseHeaderOnScroll
        />
      </>
    );

    // Destructured `layout`, rest spread into Root.
    const Forwarding = ({ layout, ...rest }: DefaultPageProps) => (
      <DefaultPage.Root layout={layout} {...rest} />
    );

    // `stickyHeader` from a boolean variable, with and without the new prop.
    const StickyFromBoolean = ({ isSticky }: { isSticky: boolean }) => (
      <>
        <DefaultPage.Root layout="flexible" stickyHeader={isSticky} />
        <DefaultPage.Root
          layout="flexible"
          stickyHeader={isSticky}
          collapseHeaderOnScroll
        />
      </>
    );

    // The new prop in both layouts, and as a variable.
    const BothLayouts = ({ collapse }: { collapse: boolean }) => (
      <>
        <DefaultPage.Root collapseHeaderOnScroll />
        <DefaultPage.Root layout="constrained" collapseHeaderOnScroll />
        <DefaultPage.Root layout="flexible" collapseHeaderOnScroll={collapse} />
      </>
    );

    // Invalid combinations stay compile errors.
    const Invalid = () => (
      <>
        {/* @ts-expect-error stickyHeader requires layout="flexible" */}
        <DefaultPage.Root stickyHeader />
        {/* @ts-expect-error stickyFooter requires layout="flexible" */}
        <DefaultPage.Root stickyFooter />
        {/* @ts-expect-error stickyHeader is not allowed with layout="constrained" */}
        <DefaultPage.Root layout="constrained" stickyHeader />
        {/* @ts-expect-error collapseHeaderOnScroll is a boolean */}
        <DefaultPage.Root collapseHeaderOnScroll="yes" />
      </>
    );

    expect([
      UnionLayout,
      UnionLayoutWithCollapse,
      WrapperUsage,
      Forwarding,
      StickyFromBoolean,
      BothLayouts,
      Invalid,
    ]).toHaveLength(7);
  });
});
