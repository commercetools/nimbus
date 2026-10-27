// @vitest-environment node
import { renderToString } from "react-dom/server";
import { describe, it, expect } from "vitest";
import { NimbusColorModeProvider } from "./components/nimbus-provider.color-mode-provider";

// NimbusColorModeProvider is rendered directly: the full NimbusProvider
// cannot be server-rendered yet because ToastOutlet's useSyncExternalStore
// has no getServerSnapshot.

describe("NimbusColorModeProvider - server rendering", () => {
  it("renders an executable theme script on the server", () => {
    expect(typeof window).toBe("undefined");

    const html = renderToString(
      <NimbusColorModeProvider>
        <div>Test content</div>
      </NimbusColorModeProvider>
    );

    expect(html).toContain("Test content");
    const scriptTag = html.match(/<script\b[^>]*>/)?.[0];
    expect(scriptTag).toBeDefined();
    // No `type` means the browser runs it as classic JavaScript
    expect(scriptTag).not.toMatch(/\btype=/);
  });

  it("lets a consumer type win on the server", () => {
    const html = renderToString(
      <NimbusColorModeProvider scriptProps={{ type: "module" }}>
        <div>Test content</div>
      </NimbusColorModeProvider>
    );

    expect(html.match(/<script\b[^>]*>/)?.[0]).toMatch(/type="module"/);
  });
});
