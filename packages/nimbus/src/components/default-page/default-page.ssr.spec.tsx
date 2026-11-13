// @vitest-environment node
import { renderToString } from "react-dom/server";
import { describe, it, expect } from "vitest";
import { NimbusProvider } from "../nimbus-provider/nimbus-provider";
import { DefaultPage } from "./default-page";

const renderPage = (collapseHeaderOnScroll: boolean) =>
  renderToString(
    <NimbusProvider loadFonts={false}>
      <DefaultPage.Root collapseHeaderOnScroll={collapseHeaderOnScroll}>
        <DefaultPage.Header>
          <DefaultPage.BackLink href="/products">
            Back to products
          </DefaultPage.BackLink>
          <DefaultPage.Title>Classic T-Shirt</DefaultPage.Title>
          <DefaultPage.Subtitle>SKU-12345</DefaultPage.Subtitle>
        </DefaultPage.Header>
        <DefaultPage.Content>Content</DefaultPage.Content>
      </DefaultPage.Root>
    </NimbusProvider>
  );

describe("DefaultPage - server rendering with collapseHeaderOnScroll", () => {
  it("renders the full header form, without data-collapsed", () => {
    const html = renderPage(true);

    expect(html).toContain("Classic T-Shirt");
    expect(html).toContain("SKU-12345");
    // The emitted CSS mentions `data-collapsed` in selectors, so check the
    // header element itself.
    const headerTag = html.match(/<header\b[^>]*>/)?.[0];
    expect(headerTag).toBeDefined();
    expect(headerTag).not.toContain("data-collapsed");
  });

  it("does not set the header height variable before the first measurement", () => {
    expect(renderPage(true)).not.toContain("--default-page-header-height");
    expect(renderPage(false)).not.toContain("--default-page-header-height");
  });

  it("renders the back link label as text in its own element", () => {
    const html = renderPage(true);

    expect(html).toMatch(
      /<span class="[^"]*nimbus-default-page__backLinkLabel[^"]*">Back to products<\/span>/
    );
  });
});
