import { useEffect } from "react";

type UseUnpinnedCollapseWarningOptions = {
  /** Value of `collapseHeaderOnScroll` on `DefaultPage.Root`. */
  collapseHeaderOnScroll?: boolean;
  /** Value of `layout` on `DefaultPage.Root`. */
  layout?: "constrained" | "flexible";
  /** Value of `stickyHeader` on `DefaultPage.Root`. */
  stickyHeader?: boolean;
};

/**
 * Logs a warning in development builds when `collapseHeaderOnScroll` is set
 * but the header is not pinned (`layout="flexible"` without `stickyHeader`).
 * In that case the option has no effect, and the header keeps its full form.
 */
export function useUnpinnedCollapseWarning({
  collapseHeaderOnScroll,
  layout,
  stickyHeader,
}: UseUnpinnedCollapseWarningOptions) {
  const isUnpinned =
    collapseHeaderOnScroll === true && layout === "flexible" && !stickyHeader;

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (!isUnpinned) return;
    console.warn(
      '[Nimbus DefaultPage] `collapseHeaderOnScroll` has no effect with `layout="flexible"` ' +
        "unless `stickyHeader` is also set. The header is not pinned, so it keeps its full form."
    );
  }, [isUnpinned]);
}
