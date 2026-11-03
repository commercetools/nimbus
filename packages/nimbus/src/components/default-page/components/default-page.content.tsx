import { mergeRefs } from "@/utils";
import { useDefaultPageContext } from "../default-page.context";
import { DefaultPageContentSlot } from "../default-page.slots";
import type { DefaultPageContentProps } from "../default-page.types";

/**
 * DefaultPage.Content - The main content area of the default page.
 *
 * @supportsStyleProps
 */
export const DefaultPageContent = ({
  ref,
  children,
  ...props
}: DefaultPageContentProps) => {
  const { registerContent } = useDefaultPageContext();

  return (
    <DefaultPageContentSlot
      ref={mergeRefs(ref, registerContent)}
      tabIndex={0}
      {...props}
    >
      {children}
    </DefaultPageContentSlot>
  );
};

DefaultPageContent.displayName = "DefaultPage.Content";
