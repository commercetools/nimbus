import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { describe, it, expect, vi, afterEach } from "vitest";
import { NimbusColorModeProvider } from "./components/nimbus-provider.color-mode-provider";

// NimbusColorModeProvider is rendered directly: the full NimbusProvider
// cannot be server-rendered yet because ToastOutlet's useSyncExternalStore
// has no getServerSnapshot.

const tree = (
  <NimbusColorModeProvider>
    <div>Test content</div>
  </NimbusColorModeProvider>
);

describe("NimbusColorModeProvider - hydration", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("hydrates server-rendered HTML without errors or warnings", async () => {
    // Server markup differs from client markup only in the script `type`
    // (see nimbus-provider.ssr.spec.tsx, which checks real server output).
    // `window` cannot be removed here because next-themes needs it, so the
    // server markup is derived from the client markup.
    const serverHtml = renderToString(tree).replace(
      /(<script\b[^>]*?) type="text\/plain"/,
      "$1"
    );

    expect(serverHtml.match(/<script\b[^>]*>/)?.[0]).not.toMatch(/\btype=/);

    const container = document.createElement("div");
    container.innerHTML = serverHtml;
    document.body.appendChild(container);

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const onRecoverableError = vi.fn();
    (
      globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
    ).IS_REACT_ACT_ENVIRONMENT = true;

    await act(async () => {
      hydrateRoot(container, tree, { onRecoverableError });
    });

    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(consoleError).not.toHaveBeenCalled();
    expect(container).toHaveTextContent("Test content");
  });
});
