import { useAtomValue } from "jotai";
import { useMemo } from "react";
import {
  BreadcrumbRoot,
  BreadcrumbLink,
  BreadcrumbCurrentLink,
} from "@bleh-ui/react";
import { activeDocAtom } from "../../../atoms/active-doc";
import { menuToPath } from "../../../utils/sluggify";
import { BreadcrumbItem } from "./breadcrumb.types";

/**
 * BreadcrumbNav component renders the breadcrumb navigation based on the active document.
 */
export const BreadcrumbNav = () => {
  const activeDoc = useAtomValue(activeDocAtom);

  // Memoize the breadcrumb parts to avoid unnecessary recalculations
  const parts: BreadcrumbItem[] = useMemo(() => {
    if (!activeDoc) return [];

    const { menu } = activeDoc.meta;

    return menu.map((item, idx) => ({
      label: item,
      href: "/" + menuToPath(menu.slice(0, idx + 1)),
    }));
  }, [activeDoc]);

  const isHomePage = parts.length === 1 && parts[0].label === "Home";

  return (
    <BreadcrumbRoot variant="plain">
      {!isHomePage && <BreadcrumbLink href="/">Home</BreadcrumbLink>}
      {parts.map((item, idx) => {
        const LinkComponent =
          idx === parts.length - 1 ? BreadcrumbCurrentLink : BreadcrumbLink;
        return (
          <LinkComponent key={item.href} href={item.href}>
            {item.label}
          </LinkComponent>
        );
      })}
    </BreadcrumbRoot>
  );
};
