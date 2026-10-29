import { act } from "react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NimbusColorModeProvider } from "./components/nimbus-provider.color-mode-provider";

// NimbusColorModeProvider is rendered directly: the full NimbusProvider
// cannot be server-rendered yet because ToastOutlet's useSyncExternalStore
// has no getServerSnapshot.

const tree = (
  <NimbusColorModeProvider>
    <div>Test content</div>
  </NimbusColorModeProvider>
);

type ActGlobal = { IS_REACT_ACT_ENVIRONMENT?: boolean };

describe("NimbusColorModeProvider - hydration", () => {
  let root: Root | undefined;
  let previousActEnvironment: boolean | undefined;

  beforeEach(() => {
    // Restored in afterEach so the shared (`isolate: false`) test environment
    // is not changed for other test files.
    previousActEnvironment = (globalThis as ActGlobal).IS_REACT_ACT_ENVIRONMENT;
    (globalThis as ActGlobal).IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(async () => {
    // Unmount so next-themes removes its `storage` listener from `window`.
    // Clearing the DOM alone does not run React effect cleanup.
    await act(async () => {
      root?.unmount();
    });
    root = undefined;
    (globalThis as ActGlobal).IS_REACT_ACT_ENVIRONMENT = previousActEnvironment;
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

    await act(async () => {
      root = hydrateRoot(container, tree, { onRecoverableError });
    });

    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(consoleError).not.toHaveBeenCalled();
    expect(container).toHaveTextContent("Test content");
  });
});
