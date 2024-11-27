import { useAtomValue } from "jotai";

import {
  BreadcrumbRoot,
  BreadcrumbLink,
  BreadcrumbCurrentLink,
} from "@bleh-ui/react";
import { useMemo } from "react";
import { activeDocAtom } from "../../atoms/activeDoc";
import { menuToPath } from "../../utils/sluggify";

export const BreadcrumbNav = () => {
  const activeDoc = useAtomValue(activeDocAtom);
  const parts = useMemo(() => {
    if (!activeDoc) return [];

    const menu = activeDoc.meta.menu;

    return menu.map((item, idx) => {
      return {
        label: item,
        href: "/" + menuToPath(activeDoc.meta.menu.slice(0, idx + 1)),
      };
    });
  }, [activeDoc]);

  const isHomePage = parts.length === 1 && parts[0].label === "Home";

  return (
    <BreadcrumbRoot variant="plain">
      {!isHomePage && <BreadcrumbLink href="/">Home</BreadcrumbLink>}
      {parts.map((item, idx) => {
        const LinkComponent =
          parts.length === idx - 1 ? BreadcrumbCurrentLink : BreadcrumbLink;
        return (
          <LinkComponent key={item.href} href={item.href}>
            {item.label}
          </LinkComponent>
        );
      })}
    </BreadcrumbRoot>
  );
};
