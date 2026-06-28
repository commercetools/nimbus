import { useEffect } from "react";
import { getHeadingLevels, findHeadingLevelSkips } from "../utils";

/**
 * Emit a development-mode warning when author markdown skips a heading level
 * (e.g. `#` then `###`). The content is still rendered faithfully — Nimbus does
 * not silently rewrite author structure.
 */
export function useHeadingSkipWarning(source: string) {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const skips = findHeadingLevelSkips(getHeadingLevels(source));
    for (const { from, to } of skips) {
      console.warn(
        `[Nimbus Markdown] Heading level skip detected (h${from} → h${to}). ` +
          `Skipping levels can break the document outline for assistive technology. ` +
          `Consider adjusting the source or using \`headingOffset\`.`
      );
    }
  }, [source]);
}
