import { useEffect, useMemo, useState } from "react";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { mergeRefs } from "@/utils";
import { DefaultPageContext } from "../default-page.context";
import { DefaultPageRootSlot } from "../default-page.slots";
import type { DefaultPageProps } from "../default-page.types";
import { useCollapseHeaderOnScroll } from "../hooks/use-collapse-header-on-scroll";
import { warnCollapseHeaderOnScroll } from "../utils/warn-collapse-header-on-scroll";

const HEADER_HEIGHT_VAR = "--default-page-header-height";

/**
 * DefaultPage.Root - The root container for the default page layout
 *
 * @supportsStyleProps
 */
export const DefaultPageRoot = ({
  ref,
  children,
  collapseHeaderOnScroll,
  ...props
}: DefaultPageProps) => {
  const recipe = useSlotRecipe({ key: "nimbusDefaultPage" });
  const [recipeProps, restProps] = recipe.splitVariantProps(props);
  const [rootEl, setRootEl] = useState<HTMLDivElement | null>(null);
  const [headerEl, setHeaderEl] = useState<HTMLElement | null>(null);
  const [contentEl, setContentEl] = useState<HTMLElement | null>(null);

  const stickyHeader =
    props.layout === "flexible" ? props.stickyHeader : undefined;
  const isHeaderPinned = props.layout !== "flexible" || Boolean(stickyHeader);

  warnCollapseHeaderOnScroll({
    collapseHeaderOnScroll,
    layout: props.layout,
    stickyHeader,
  });

  const { form, headerHeight } = useCollapseHeaderOnScroll({
    enabled: Boolean(collapseHeaderOnScroll) && isHeaderPinned,
    header: headerEl,
    content: contentEl,
    root: rootEl,
  });

  useEffect(() => {
    if (!rootEl) {
      return;
    }
    if (collapseHeaderOnScroll && headerHeight != null) {
      rootEl.style.setProperty(HEADER_HEIGHT_VAR, `${headerHeight}px`);
      return;
    }
    rootEl.style.removeProperty(HEADER_HEIGHT_VAR);
  }, [rootEl, collapseHeaderOnScroll, headerHeight]);

  const context = useMemo(
    () => ({
      form,
      registerHeader: setHeaderEl,
      registerContent: setContentEl,
    }),
    [form]
  );

  return (
    <DefaultPageContext.Provider value={context}>
      <DefaultPageRootSlot
        ref={mergeRefs(ref, setRootEl)}
        {...recipeProps}
        {...restProps}
      >
        {children}
      </DefaultPageRootSlot>
    </DefaultPageContext.Provider>
  );
};

DefaultPageRoot.displayName = "DefaultPage.Root";
