import { mergeRefs } from "@/utils";
import { useDefaultPageContext } from "../default-page.context";
import { DefaultPageHeaderSlot } from "../default-page.slots";
import type { DefaultPageHeaderProps } from "../default-page.types";

/**
 * DefaultPage.Header - The header section containing back link, title, and subtitle
 *
 * @supportsStyleProps
 */
export const DefaultPageHeader = ({
  ref,
  children,
  ...props
}: DefaultPageHeaderProps) => {
  const { form, registerHeader } = useDefaultPageContext();

  return (
    <DefaultPageHeaderSlot
      ref={mergeRefs(ref, registerHeader)}
      data-collapsed={form === "collapsed" ? "true" : undefined}
      {...props}
    >
      {children}
    </DefaultPageHeaderSlot>
  );
};

DefaultPageHeader.displayName = "DefaultPage.Header";
