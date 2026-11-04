type WarnCollapseHeaderOnScrollOptions = {
  collapseHeaderOnScroll?: boolean;
  layout?: "constrained" | "flexible";
  stickyHeader?: boolean;
};

/**
 * Logs in development when `collapseHeaderOnScroll` is set but the header
 * is not pinned (`layout="flexible"` without `stickyHeader`).
 */
export const warnCollapseHeaderOnScroll = ({
  collapseHeaderOnScroll,
  layout,
  stickyHeader,
}: WarnCollapseHeaderOnScrollOptions): void => {
  if (typeof process === "undefined" || process.env.NODE_ENV === "production") {
    return;
  }

  if (collapseHeaderOnScroll && layout === "flexible" && !stickyHeader) {
    console.warn(
      'DefaultPage.Root: `collapseHeaderOnScroll` has no effect when `layout="flexible"` and `stickyHeader` is not set. The header is not pinned.'
    );
  }
};
