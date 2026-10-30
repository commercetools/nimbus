import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import {
  DefaultPageRootSlot,
  DefaultPageScrollSentinelSlot,
} from "../default-page.slots";
import {
  parseStickyHeader,
  useCompactOnScroll,
} from "../hooks/use-compact-on-scroll";
import type { DefaultPageProps } from "../default-page.types";

/**
 * DefaultPage.Root - The root container for the default page layout
 *
 * @supportsStyleProps
 */
export const DefaultPageRoot = ({
  ref,
  children,
  ...props
}: DefaultPageProps) => {
  const recipe = useSlotRecipe({ key: "nimbusDefaultPage" });
  const { sticky, compactOnScroll } = parseStickyHeader(
    props.layout,
    "stickyHeader" in props ? props.stickyHeader : undefined
  );
  const { sentinelRef, phase } = useCompactOnScroll(compactOnScroll);

  const [recipeProps, restProps] = recipe.splitVariantProps({
    ...props,
    stickyHeader: sticky,
  });

  return (
    <DefaultPageRootSlot
      ref={ref}
      data-compact={compactOnScroll && phase === "compact" ? "true" : undefined}
      {...recipeProps}
      compactHeader={compactOnScroll ? phase : undefined}
      {...restProps}
    >
      {compactOnScroll && (
        <DefaultPageScrollSentinelSlot ref={sentinelRef} aria-hidden="true" />
      )}
      {children}
    </DefaultPageRootSlot>
  );
};

DefaultPageRoot.displayName = "DefaultPage.Root";
