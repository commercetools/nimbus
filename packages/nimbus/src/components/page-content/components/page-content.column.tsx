import { PageContentColumnSlot } from "../page-content.slots";
import type { PageContentColumnProps } from "../page-content.types";

/**
 * PageContent.Column - A column within a multi-column PageContent layout.
 *
 * Supports sticky positioning via the `sticky` prop. Use the `top` style prop
 * to customize the sticky offset.
 *
 * @supportsStyleProps
 */
export const PageContentColumn = ({
  ref,
  children,
  sticky,
  ...props
}: PageContentColumnProps) => {
  const stickyProps = sticky
    ? { position: "sticky" as const, top: 0, alignSelf: "start" }
    : {};

  return (
    <PageContentColumnSlot
      ref={ref}
      data-sticky={sticky || undefined}
      {...stickyProps}
      {...props}
    >
      {children}
    </PageContentColumnSlot>
  );
};

PageContentColumn.displayName = "PageContent.Column";
