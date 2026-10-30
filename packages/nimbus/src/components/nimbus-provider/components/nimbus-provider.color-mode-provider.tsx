import { useMemo } from "react";
import { ThemeProvider } from "next-themes";
import type { ColorModeProviderProps } from "../nimbus-provider.types";

/**
 * Type for the theme-initialization `<script>` that next-themes renders.
 *
 * React 19.3 logs "Encountered a script tag while rendering React component"
 * when it creates a `<script>` on the client, unless the script is a data
 * block. A script is a data block when its `type` is non-empty and is not a
 * JavaScript MIME type, `module`, `importmap` or `speculationrules`.
 * Browsers never execute data blocks, and React never executes scripts it
 * creates on the client anyway, so this changes no behavior in the browser.
 *
 * `text/plain` is used because it is a standard type that every tool already
 * treats as inert text. A JSON type would invite tools to parse the body as
 * JSON, and a custom type would add a new value consumers have to know about.
 */
const DATA_BLOCK_SCRIPT_TYPE = "text/plain";

export const NimbusColorModeProvider = ({
  scriptProps,
  ...props
}: ColorModeProviderProps) => {
  // On the server the script must stay executable: the browser runs it from
  // the server-rendered HTML and sets the theme before first paint.
  // On the client the script is inert, so it is marked as a data block.
  // next-themes renders the script with `suppressHydrationWarning`, so the
  // `type` difference does not cause a hydration warning.
  const isClient = typeof window !== "undefined";

  // Stable identity, so next-themes' memoized script component can skip
  // re-renders when the consumer's `scriptProps` do not change.
  const mergedScriptProps = useMemo(
    () =>
      isClient
        ? {
            ...scriptProps,
            // A consumer-provided `type` takes priority over the default.
            // An empty or undefined `type` makes the script executable again,
            // so it falls back to the data-block type.
            type: scriptProps?.type || DATA_BLOCK_SCRIPT_TYPE,
          }
        : scriptProps,
    [isClient, scriptProps]
  );

  return (
    <ThemeProvider
      attribute="class"
      disableTransitionOnChange
      {...props}
      scriptProps={mergedScriptProps}
    />
  );
};
